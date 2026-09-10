#!/usr/bin/env node
/**
 * PRIVACY DRIFT GATE.
 *
 * A privacy policy is a set of claims about a running system, and prose drifts
 * silently. These rules check the claims in `lib/legal/privacy.ts` against the
 * code that actually decides them — the tracker's presence in the layout, the
 * Places retention flag, the absence of any account surface — so a
 * contradiction fails a build rather than sitting on a legal page for a year.
 *
 * WHAT THIS DELIBERATELY IS NOT: a substring search over the policy text.
 * Three previous phases in this project shipped gates that passed while
 * checking the wrong thing — one read prose inside a comment, one collapsed
 * the file it was scanning, one was satisfied by a marker legend. A rule that
 * greps a paragraph for "sync" tells you a word is present, not whether the
 * product syncs. Every rule below reads a STRUCTURED FACT and compares it to a
 * STRUCTURAL PROPERTY of the source.
 *
 *   node scripts/validate-privacy.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const errors = [];
const notes = [];
const fail = (rule, where, detail) => errors.push({ rule, where, detail });

/**
 * Comments removed, strings kept. Import paths and route literals are strings.
 *
 * THE SCHEME SEPARATOR IS PROTECTED FIRST, and it has to be. A naive
 * line-comment strip deletes everything after the `//` in `https://…` — which
 * is exactly how the first run of this file reported that `app/layout.tsx`
 * does not load the tracker, while the tracker's `<Script src="https://…">`
 * sat four lines above. The rule was reading a file it had truncated itself.
 */
const code = (source) =>
  source
    .replace(/:\/\//g, ":\u0000\u0000")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ")
    .replace(/:\u0000\u0000/g, "://");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry === ".next") continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const contractPath = join(ROOT, "lib/legal/privacy.ts");
if (!existsSync(contractPath)) {
  fail("privacy.contract", "lib/legal/privacy.ts", "the privacy contract is missing");
  report();
}
const contract = readFileSync(contractPath, "utf8");
const contractCode = code(contract);

/** Read one boolean from the PRIVACY_FACTS literal. */
function fact(name) {
  const match = contractCode.match(new RegExp(`\\b${name}\\s*:\\s*(true|false)`));
  return match ? match[1] === "true" : null;
}

/* ------------------------------------------------------------------ *
 * 1. THE MAIN SITE'S ANALYTICS CLAIM MATCHES THE MAIN SITE'S LAYOUT.
 * ------------------------------------------------------------------ */
{
  const layout = code(readFileSync(join(ROOT, "app/layout.tsx"), "utf8"));
  const trackerPresent = /webmasterid\.com\/tracker/.test(layout);
  const claimed = fact("mainAnalyticsActive");
  if (claimed === null) {
    fail("privacy.fact", "PRIVACY_FACTS", "mainAnalyticsActive is not declared");
  } else if (claimed !== trackerPresent) {
    fail(
      "privacy.analyticsDrift",
      "app/layout.tsx",
      `the policy says the main site's measurement is ${claimed ? "active" : "inactive"}, but the layout ${trackerPresent ? "loads" : "does not load"} the tracker`,
    );
  } else {
    notes.push(`main-site measurement: ${trackerPresent ? "active" : "inactive"} — layout and policy agree`);
  }
}

/* ------------------------------------------------------------------ *
 * 2. NO SECOND ANALYTICS PROVIDER MAY APPEAR UNANNOUNCED.
 *
 * The policy names the providers a browser contacts. A new one installed
 * without being added there would make the page quietly incomplete.
 * ------------------------------------------------------------------ */
{
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const installed = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const providers = [
    "@vercel/analytics", "posthog-js", "mixpanel-browser", "@amplitude/analytics-browser",
    "@segment/analytics-next", "react-ga", "react-ga4", "@microsoft/clarity", "hotjar",
    "plausible-tracker", "@datadog/browser-rum",
  ];
  for (const provider of providers) {
    if (installed[provider]) {
      fail("privacy.undisclosedProvider", "package.json", `"${provider}" is installed but the policy does not disclose it`);
    }
  }

  // And any third-party script host in the layout must be a disclosed party.
  const layout = readFileSync(join(ROOT, "app/layout.tsx"), "utf8");
  const scriptHosts = [...layout.matchAll(/src=["'`]https:\/\/([^/"'`]+)/g)].map((m) => m[1]);
  for (const host of new Set(scriptHosts)) {
    const disclosed = contract.includes(host.replace(/^www\./, "").split(".")[0]);
    if (!disclosed) {
      fail("privacy.undisclosedProvider", "app/layout.tsx", `the layout loads a script from "${host}", which the policy does not disclose`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * 3. NO ACCOUNTS, NO SYNC, NO SERVER — checked structurally.
 *
 * The policy states all three. Each is contradicted by something concrete: an
 * auth dependency, a route that would receive saved state, an API route.
 * ------------------------------------------------------------------ */
{
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const installed = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const authPackages = [
    "next-auth", "@auth/core", "@clerk/nextjs", "@auth0/nextjs-auth0",
    "firebase", "@supabase/supabase-js", "lucia", "passport",
  ];
  const accountsClaimed = fact("accountsEnabled");
  const found = authPackages.filter((p) => installed[p]);
  if (accountsClaimed === false && found.length > 0) {
    fail("privacy.accountsDrift", "package.json", `the policy says there are no accounts, but ${found.join(", ")} is installed`);
  }
  if (accountsClaimed === true) {
    fail("privacy.accountsDrift", "PRIVACY_FACTS", "the policy claims accounts exist; this phase does not build them");
  }

  /*
   * SYMMETRIC, because a contradiction has two directions and the first
   * version of this rule only checked one. It caught "the policy denies sync
   * while a server exists" and sailed past "the policy claims sync while no
   * server does" — which is the more likely drift, since a claim is a word and
   * a server is a directory. A poison case flipping the flag to true found it.
   */
  const apiRoutes = walk(join(ROOT, "app")).filter((f) => /\/api\/.*route\.(ts|js)$/.test(f));
  const syncClaimed = fact("cloudSyncEnabled");
  if (syncClaimed === null) {
    fail("privacy.fact", "PRIVACY_FACTS", "cloudSyncEnabled is not declared");
  } else if (syncClaimed === false && apiRoutes.length > 0) {
    fail(
      "privacy.syncDrift",
      "app/api",
      `the policy says nothing is sent to a GCI server, but ${apiRoutes.length} API route(s) exist: ${apiRoutes[0]}`,
    );
  } else if (syncClaimed === true && apiRoutes.length === 0) {
    fail(
      "privacy.syncDrift",
      "PRIVACY_FACTS",
      "the policy claims saved data syncs to a GCI server, but no server endpoint exists to receive it",
    );
  }
  notes.push(`API routes: ${apiRoutes.length}`);
}

/* ------------------------------------------------------------------ *
 * 4. THE PERMANENT GUARANTEES MAY NOT BE WEAKENED.
 *
 * These five say private content is never transmitted. They are the only
 * claims on the page a reader cannot verify for themselves, so flipping one
 * must be impossible to do quietly.
 * ------------------------------------------------------------------ */
for (const guarantee of [
  "personalPinCoordinatesTransmitted",
  "personalPinTitlesTransmitted",
  "privateNotesTransmitted",
  "listNamesTransmitted",
  "listContentsTransmitted",
]) {
  const value = fact(guarantee);
  if (value === null) fail("privacy.guarantee", "PRIVACY_FACTS", `${guarantee} is not declared`);
  else if (value !== false) fail("privacy.guarantee", "PRIVACY_FACTS", `${guarantee} is no longer false`);
}

/* ------------------------------------------------------------------ *
 * 5. THE PAGE EXISTS, IS REACHABLE, AND IS NOT DUPLICATED.
 * ------------------------------------------------------------------ */
{
  const routes = code(readFileSync(join(ROOT, "lib/seo/routes.ts"), "utf8"));
  const declared = routes.match(/privacy:\s*"([^"]+)"/)?.[1] ?? null;
  if (declared === null) {
    fail("privacy.route", "lib/seo/routes.ts", "no privacy route is declared");
  } else if (declared !== "/privacy") {
    fail("privacy.route", "lib/seo/routes.ts", `the privacy route is "${declared}"; the canonical route is /privacy`);
  }

  const pages = walk(join(ROOT, "app")).filter((f) => f.endsWith("page.tsx"));
  const privacyPages = pages.filter((f) => /\/(privacy|privacy-policy|legal)\//.test(f.replace(ROOT, "")));
  if (privacyPages.length === 0) {
    fail("privacy.route", "app", "no privacy page exists");
  } else if (privacyPages.length > 1) {
    fail(
      "privacy.duplicateRoute",
      "app",
      `${privacyPages.length} competing privacy routes: ${privacyPages.map((f) => f.replace(ROOT, "")).join(", ")}`,
    );
  }

  const footer = code(readFileSync(join(ROOT, "components/layout/Footer.tsx"), "utf8"));
  if (!/staticRoutes\.privacy/.test(footer)) {
    fail("privacy.footerLink", "components/layout/Footer.tsx", "the footer does not link to the privacy policy");
  }

  // It must NOT be in the primary navigation: that row is a cross-product
  // contract and an eleventh item reopens a fixed overflow.
  /*
   * Any reference at all, not one spelling of one alias.
   *
   * The first version matched `staticRoutes.privacy`, so a poison case that
   * imported the same module under a different name walked straight past it.
   * A rule that depends on how somebody chose to name an import is not
   * checking the property it claims to.
   */
  const nav = code(readFileSync(join(ROOT, "components/layout/PrimaryNav.tsx"), "utf8"));
  if (/\bprivacy\b/i.test(nav)) {
    fail(
      "privacy.headerCrowding",
      "components/layout/PrimaryNav.tsx",
      "the primary navigation references privacy; the header is a ten-destination contract shared with two other products",
    );
  }

  const sitemap = code(readFileSync(join(ROOT, "lib/sitemap/entries.ts"), "utf8"));
  if (!/staticRoutes\.privacy/.test(sitemap)) {
    fail("privacy.sitemap", "lib/sitemap/entries.ts", "the privacy route is absent from the sitemap while comparable reference pages are in it");
  }
}

/* ------------------------------------------------------------------ *
 * 6. NO UNSUPPORTED ABSOLUTES IN THE PUBLISHED TEXT.
 *
 * Not a blanket ban on the word "never" — the page makes several deliberate
 * never-claims that the architecture genuinely enforces, and a rule that
 * flagged those would be flagging the strongest true statements on the page.
 * What is forbidden is a specific set of claims this project cannot support:
 * about logs it does not control, about anonymity it does not have, and about
 * data collection in general when it does collect some.
 * ------------------------------------------------------------------ */
{
  const page = readFileSync(join(ROOT, "app/privacy/page.tsx"), "utf8");
  const text = code(page).replace(/\s+/g, " ");
  const unsupported = [
    [/100\s*%\s*anonymous|completely anonymous|fully anonymous/i, "claims complete anonymity, which a durable browser identifier contradicts"],
    [/we (do not|don't|never) log (your )?IP/i, "claims IP addresses are not logged; hosting logs are not GCI's to promise about"],
    [/we (never|do not|don't) collect any (data|information)/i, "claims no data is collected at all"],
    [/(never|not) shared? with (any )?third part/i, "claims data is never shared with third parties while the page also names third parties a browser contacts"],
    [/GDPR compliant|fully compliant|legally compliant/i, "asserts regulatory compliance, which this project has not established"],
    [/military[- ]grade|bank[- ]level|absolutely secure/i, "asserts a security posture that has not been established"],
  ];
  for (const [pattern, why] of unsupported) {
    if (pattern.test(text)) fail("privacy.unsupportedClaim", "app/privacy/page.tsx", why);
  }
}

/* ------------------------------------------------------------------ *
 * 6b. ACTIVE MEASUREMENT MUST BE DESCRIBED AS OPTIONAL, NOT AS UNIVERSAL.
 *
 * `placesAnalyticsActive` means the capability is live. It does NOT mean every
 * visitor is measured, and the difference is the whole consent architecture: a
 * reader who has said nothing is not measured, and one who refused never will
 * be. A policy that said "GCI Places uses analytics", full stop, would be false
 * for everyone who has not chosen — which is everyone, until they do.
 *
 * So while measurement is active the page must carry the conditions, and must
 * not carry the sentence it replaced.
 * ------------------------------------------------------------------ */
{
  const page = code(readFileSync(join(ROOT, "app/privacy/page.tsx"), "utf8"));
  /*
   * SCOPED TO THE MEASUREMENT SECTION, and it has to be.
   *
   * The first version searched the whole page, so deleting "list names" from
   * the paragraph about what analytics excludes still passed — the phrase
   * survived in an unrelated section about browser storage. A guarantee has to
   * be made where the reader is being told what is collected, not somewhere
   * else on the same page.
   */
  const sectionStart = page.indexOf('title="Measuring how the site is used"');
  const sectionEnd = page.indexOf("<SectionHeading", sectionStart + 1);
  const text = (sectionStart === -1 ? page : page.slice(sectionStart, sectionEnd === -1 ? undefined : sectionEnd))
    .replace(/\s+/g, " ");
  if (sectionStart === -1) {
    fail("privacy.activeAnalytics", "app/privacy/page.tsx", "the measurement section is missing or was renamed");
  }
  const active = /placesAnalyticsActive:\s*true/.test(contractCode);
  const optIn = /placesAnalyticsRequiresOptIn:\s*true/.test(contractCode);

  if (active && !optIn) {
    fail("privacy.consentDrift", "PRIVACY_FACTS", "measurement is active in GCI Places without the opt-in requirement");
  }
  if (active) {
    for (const [what, pattern] of [
      ["that nothing happens unless the reader allows it", /unless you allow it|only if you say yes|asks first/i],
      ["that silence counts as a refusal", /takes silence as a no|silence as a no/i],
      ["that the choice can be changed", /change your mind/i],
      ["that withdrawal deletes the identifier", /deletes the identifier|delete the identifier/i],
      ["that DNT and GPC override it", /Do Not Track/i],
      ["that private personal-map content is excluded", /list names/i],
      ["that there is no advertising or profiling", /no advertising, no profiling|no profiling/i],
    ]) {
      if (!pattern.test(text)) {
        fail("privacy.activeAnalytics", "app/privacy/page.tsx", `measurement is active but the page does not say ${what}`);
      }
    }
    /* The sentence that became false the moment activation shipped. */
    if (/GCI Places currently measures nothing|loads no measurement script/i.test(text)) {
      fail("privacy.staleAnalytics", "app/privacy/page.tsx", "the page still says GCI Places measures nothing while measurement is active");
    }
  }
  if (!active && !/currently measures nothing|measures nothing unless/i.test(text)) {
    fail("privacy.staleAnalytics", "app/privacy/page.tsx", "measurement is inactive but the page does not say so");
  }
}

/* ------------------------------------------------------------------ *
 * 7. BLOCKERS ARE VISIBLE, NOT BURIED.
 * ------------------------------------------------------------------ */
{
  const ids = [...contractCode.matchAll(/id:\s*"([a-z-]+)"/g)].map((m) => m[1]);
  for (const required of ["operator-identity", "consent-mechanism"]) {
    if (!ids.includes(required)) {
      fail("privacy.blocker", "PRIVACY_BLOCKERS", `the "${required}" blocker was removed without being resolved in the contract`);
    }
  }
  const operatorSet = /legalEntity:\s*"/.test(contractCode) && /contact:\s*"/.test(contractCode);
  notes.push(
    operatorSet
      ? "operator identity: PUBLISHED"
      : "operator identity: NOT PUBLISHED — the page renders an explicit gap; see PRIVACY_BLOCKERS",
  );

  /*
   * A CONTRACT THE PAGE DOES NOT RENDER IS NOT A PUBLISHED OPERATOR.
   *
   * Filling in PRIVACY_OPERATOR and forgetting to print it would leave the
   * contract asserting an accountable entity that no reader can see — which
   * is the same failure as naming none, dressed as a resolution. So once the
   * operator is set, the page must read every field of it.
   */
  /* Comments stripped first: a reference inside a comment renders nothing. */
  const pageSource = code(readFileSync(join(ROOT, "app/privacy/page.tsx"), "utf8"));
  const pageText = pageSource.replace(/\s+/g, " ");
  if (operatorSet) {
    for (const field of ["legalEntity", "postalAddress", "contact"]) {
      if (!new RegExp(`PRIVACY_OPERATOR\\.${field}\\b`).test(pageSource)) {
        fail("privacy.operatorUnrendered", "app/privacy/page.tsx", `the operator is published but the page never renders ${field}`);
      }
    }
    /* And it must not still be telling readers the operator is unknown. */
    if (/(not yet been published|have not been published|no registered operator)/i.test(pageText)) {
      fail("privacy.operatorStale", "app/privacy/page.tsx", "the page still says the operator is unpublished while the contract publishes one");
    }
  }

  /*
   * A PLACEHOLDER IS NOT A FACT. An operator invented to make a gate green is
   * worse than an admitted gap, because it looks settled.
   */
  const placeholder = /\b(TBD|TODO|FIXME|XXX|PLACEHOLDER|Example (Ltd|Inc|LLC|GmbH)|Acme|Your Company)\b/i;
  for (const line of contractCode.split("\n")) {
    if (!/legalEntity|postalAddress|contact:|country:/.test(line)) continue;
    if (placeholder.test(line)) {
      fail("privacy.operatorPlaceholder", "lib/legal/privacy.ts", `a placeholder stands where an operator fact belongs: ${line.trim().slice(0, 80)}`);
    }
  }

  /*
   * A CONTACT MUST BE REACHABLE, not merely printed.
   *
   * The page renders the address from the contract rather than repeating it as
   * a literal — which is right, and means the check is about shape and reach:
   * the contract must hold something that is actually an address, and the page
   * must offer it as one a reader can click rather than as decoration.
   */
  if (operatorSet) {
    const contact = contractCode.match(/\n\s*contact:\s*"([^"]+)"/)?.[1] ?? "";
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(contact)) {
      fail("privacy.operatorContact", "lib/legal/privacy.ts", `the privacy contact is not an email address: "${contact}"`);
    }
    if (!/mailto:\$\{PRIVACY_OPERATOR\.contact\}/.test(pageSource)) {
      fail("privacy.operatorContact", "app/privacy/page.tsx", "the privacy contact is printed but not offered as a mailto link");
    }
  }
}

function report() {
  for (const note of notes) process.stdout.write(`  ${note}\n`);
  for (const e of errors) process.stdout.write(`  ERROR [${e.rule}] ${e.where}: ${e.detail}\n`);
  process.stdout.write(
    errors.length === 0
      ? `\nPRIVACY CONTRACT PASS (${notes.length} facts checked)\n`
      : `\n${errors.length} PRIVACY CONTRACT FAILURE(S)\n`,
  );
  process.exit(errors.length === 0 ? 0 : 1);
}

report();
