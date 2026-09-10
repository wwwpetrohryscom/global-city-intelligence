#!/usr/bin/env node
/**
 * MAIN ANALYTICS CONSENT GATE.
 *
 * The property, in one sentence: A BROWSER MUST NOT CONTACT THE MEASUREMENT
 * PROVIDER UNTIL THE READER HAS SAID YES, ON THE CANONICAL HOST — and the main
 * site and GCI Places must mean the same thing by "yes".
 *
 * "Contact" is the word that matters. Until Phase 9.3A the tracker was a
 * <Script> in the layout: baked into 84,836 static pages and preloaded, so the
 * provider was fetched before any code considered a preference. It does honour
 * Do Not Track and Global Privacy Control — its own minified source guards
 * three initialisation functions on that test — but only after the request has
 * been made, which is too late to be the mechanism.
 *
 * This gate RUNS the real state machine rather than reading it. The TypeScript
 * is transpiled with the compiler this repository already depends on and
 * imported, so "undecided must not authorise" is checked by asking the
 * function, not by matching a substring.
 *
 *   node scripts/validate-analytics-consent.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = process.cwd();
const errors = [];
const notes = [];
const fail = (rule, where, detail) => errors.push({ rule, where, detail });

const code = (source) =>
  source
    .replace(/:\/\//g, ":  ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ")
    .replace(/:  /g, "://");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Transpile a TypeScript module and import it.
 *
 * Import specifiers are rewritten from the "@/" alias to relative paths inside
 * the temporary directory, so a module graph of two or three files loads
 * without a bundler. Nothing here is clever: it exists so the rules below can
 * call the real functions.
 */
const workdir = mkdtempSync(join(tmpdir(), "gci-consent-"));
async function loadModule(relPath, deps) {
  for (const dep of [...deps, relPath]) {
    const source = readFileSync(join(ROOT, dep), "utf8");
    const js = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText.replace(/from\s+"@\/lib\/analytics\/([a-z-]+)"/g, 'from "./$1.mjs"');
    writeFileSync(join(workdir, `${dep.split("/").pop().replace(/\.ts$/, "")}.mjs`), js);
  }
  const entry = join(workdir, `${relPath.split("/").pop().replace(/\.ts$/, "")}.mjs`);
  return import(pathToFileURL(entry).href);
}

const prefs = await loadModule("lib/analytics/preferences.ts", []);
const vectors = await loadModule("lib/analytics/conformance.ts", []);
const tracker = await loadModule("lib/analytics/tracker.ts", ["lib/analytics/preferences.ts"]);

/* ------------------------------------------------------------------ *
 * 1. THE SHARED SEMANTICS, RUN.
 *
 * Every row of the conformance table is a real stored value and a real pair of
 * browser signals. These are the vectors GCI Places must produce the same
 * answers for; a divergence here is two products disagreeing about what
 * somebody consented to.
 * ------------------------------------------------------------------ */
for (const v of vectors.CONSENT_CONFORMANCE) {
  const parsed = prefs.parsePreferences(v.stored);
  const result = prefs.analyticsAuthorisation(parsed, {
    refusesTracking: prefs.browserRefusesTracking({
      doNotTrack: v.dnt ? "1" : null,
      globalPrivacyControl: v.gpc === true,
    }),
    ...(v.storageAvailable === false ? { storageAvailable: false } : {}),
  });
  if (result.authorised !== v.expected) {
    fail("consent.conformance", v.name, `expected authorised=${v.expected}, got ${result.authorised}`);
  } else if (!v.expected && v.expectedReason && result.reason !== v.expectedReason) {
    fail("consent.conformance", v.name, `refused for "${result.reason}", expected "${v.expectedReason}"`);
  }
}
notes.push(`shared-consent conformance: ${vectors.CONSENT_CONFORMANCE.length} vectors`);

/* A grant must actually be able to authorise, or the gate is an outage. */
if (!prefs.analyticsAuthorisation(prefs.preferencesFor("granted"), { refusesTracking: false }).authorised) {
  fail("consent.conformance", "analyticsAuthorisation", "no input authorises measurement at all");
}

/* Parsing must never return a field nobody put in the schema. */
{
  const smuggled = prefs.parsePreferences(
    '{"version":1,"analytics":"granted","decidedAt":"2026-09-10T00:00:00.000Z","visitorId":"abc","latitude":1.3}',
  );
  const keys = Object.keys(smuggled ?? {}).sort();
  const allowed = [...vectors.PREFERENCE_FIELDS].sort();
  if (JSON.stringify(keys) !== JSON.stringify(allowed)) {
    fail("consent.schema", "parsePreferences", `returns ${keys.join(",")}; only ${allowed.join(",")} are allowed`);
  }
}

/* ------------------------------------------------------------------ *
 * 2. THE SAME KEY AS GCI PLACES.
 * ------------------------------------------------------------------ */
if (prefs.PRIVACY_PREFERENCES_KEY !== "gci.privacy.v1") {
  fail("consent.sharedKey", "preferences.ts", `the main site uses "${prefs.PRIVACY_PREFERENCES_KEY}"; Places owns "gci.privacy.v1"`);
}
if (prefs.PROVIDER_ANALYTICS_ID_KEY !== "wmid:av:v1") {
  fail("consent.sharedKey", "preferences.ts", `the provider identifier key is "${prefs.PROVIDER_ANALYTICS_ID_KEY}"`);
}

/* ------------------------------------------------------------------ *
 * 3. THE LOADER'S DECISION, RUN.
 * ------------------------------------------------------------------ */
{
  const ALLOWED = { canonicalHost: true, authorised: true, alreadyLoaded: false };
  const refusals = [
    ["a non-canonical host", { canonicalHost: false }, "wrong-host"],
    ["a reader who has not agreed", { authorised: false }, "not-authorised"],
    ["a page that already has the script", { alreadyLoaded: true }, "already-loaded"],
  ];
  for (const [what, override, reason] of refusals) {
    const d = tracker.trackerDecision({ ...ALLOWED, ...override });
    if (d.load) fail("consent.decision", "trackerDecision", `loads the tracker for ${what}`);
    else if (d.reason !== reason) fail("consent.decision", "trackerDecision", `refused ${what} as "${d.reason}", expected "${reason}"`);
  }
  if (!tracker.trackerDecision(ALLOWED).load) {
    fail("consent.decision", "trackerDecision", "refuses every input; the tracker could never load");
  }
  /* Consent must not be able to override the host gate, in either order. */
  if (tracker.trackerDecision({ ...ALLOWED, canonicalHost: false, authorised: true }).load) {
    fail("consent.decision", "trackerDecision", "a granted preference overrides the production-host gate");
  }
}

/* ------------------------------------------------------------------ *
 * 4. THE HOST GATE IS AN EQUALITY.
 * ------------------------------------------------------------------ */
for (const host of [
  "globalcityintelligence-places.netlify.app",
  "globalcityintelligence.netlify.app",
  "6aa1e5dc077dc3526d270971--globalcityintelligence.netlify.app",
  "localhost",
  "127.0.0.1",
  "globalcityintelligence.com",
  /* Registrable, and the reason `endsWith` is not good enough. */
  "evil-www.globalcityintelligence.com",
  "www.globalcityintelligence.com.evil.test",
]) {
  if (tracker.isMeasuredHost(host)) {
    fail("consent.host", "isMeasuredHost", `treats "${host}" as the canonical production host`);
  }
}
if (!tracker.isMeasuredHost("www.globalcityintelligence.com")) {
  fail("consent.host", "isMeasuredHost", "rejects the canonical host; measurement could never happen");
}

/* ------------------------------------------------------------------ *
 * 5. NOTHING MAY LOAD THE TRACKER BUT THE LOADER.
 * ------------------------------------------------------------------ */
{
  const LOADER = join(ROOT, "lib/analytics/tracker.ts");
  /*
   * THE RULE IS ABOUT FETCHING THE TRACKER, NOT ABOUT NAMING THE COMPANY.
   *
   * Its first version forbade "webmasterid.com" anywhere but the loader and
   * flagged lib/ecosystem/products.ts, which lists WebmasterID as a sibling
   * HELPERG product with a link to its homepage. A hyperlink a reader may
   * choose to follow is not a script a page loads on their behalf, and a rule
   * that cannot tell them apart would push somebody to delete a legitimate
   * link to keep a privacy gate green.
   *
   * So what is forbidden is the tracker SCRIPT and the INGEST endpoint.
   */
  const PROVIDER_HOSTS = /webmasterid\.com\/tracker|webmasterid-ingest-api\.vercel\.app/i;
  const sources = [
    ...walk(join(ROOT, "app")),
    ...walk(join(ROOT, "lib")),
    ...walk(join(ROOT, "components")),
  ].filter((f) => /\.tsx?$/.test(f));

  for (const file of sources) {
    if (file === LOADER) continue;
    if (PROVIDER_HOSTS.test(code(readFileSync(file, "utf8")))) {
      fail("consent.provider", relative(ROOT, file), "names a provider host; only lib/analytics/tracker.ts may");
    }
  }

  const loader = code(readFileSync(LOADER, "utf8"));
  if (/from\s+"next\/script"/.test(loader)) {
    fail("consent.provider", "tracker.ts", "loads the tracker through next/script, which preloads it");
  }
  if (!/document\.createElement\("script"\)/.test(loader)) {
    fail("consent.provider", "tracker.ts", "does not construct the script element at runtime");
  }
  /*
   * CONSULTED IN loadTracker, not merely somewhere in the file. A poison case
   * removed the latch check from the insertion path and the gate stayed green,
   * because `trackerIsLive()` also opens with `if (inserted) return` — a match
   * I had introduced myself while strengthening the withdrawal probe.
   */
  const loadFn = loader.slice(loader.indexOf("export function loadTracker"));
  const loadBody = loadFn.slice(0, loadFn.indexOf("\n}"));
  if (!/let inserted = false/.test(loader) || !/if \(inserted\) return/.test(loadBody)) {
    fail("consent.duplicate", "tracker.ts", "the module latch is absent or not consulted by loadTracker; two effects can both insert before either appends");
  }
  /*
   * IN THE FUNCTION THAT DECIDES, not merely somewhere in the file. The first
   * version matched `getElementById(TRACKER_ELEMENT_ID)` anywhere, so setting
   * `alreadyLoaded: false` in currentConditions() left the gate green — the
   * identifier still appeared in trackerIsLive() and in the withdrawal path.
   */
  const conditionsFn = loader.slice(loader.indexOf("export function currentConditions"));
  const conditionsBody = conditionsFn.slice(0, conditionsFn.indexOf("\n}"));
  if (!/getElementById\(TRACKER_ELEMENT_ID\)/.test(conditionsBody)) {
    fail("consent.duplicate", "tracker.ts", "currentConditions() does not check the document for an existing tag");
  }
  if (!/removeItem/.test(loader)) {
    fail("consent.withdrawal", "tracker.ts", "never removes the provider's identifier");
  }
  if (!/reloadRequiredForActiveTrackerWithdrawal/.test(loader)) {
    fail("consent.withdrawal", "tracker.ts", "does not report that an already-running tracker requires a reload");
  }
  /*
   * The live check must not be DOM-only. The provider survives element
   * removal, so a check that only looks for the tag would report a running
   * tracker as gone and skip the reload that terminates it.
   */
  if (!/__webmasteridTrackerInitialized/.test(loader) || !/WebmasterID !== undefined/.test(loader)) {
    fail("consent.withdrawal", "tracker.ts", "trackerIsLive() does not consult the provider globals, which survive element removal");
  }
  /* The verified configuration must be preserved, not invented. */
  for (const [what, pattern] of [
    ["the tracker source", /https:\/\/webmasterid\.com\/tracker\.iife\.min\.js/],
    ["the existing site id", /wm_hmlk0yl01zarz1cc/],
    ["the existing ingest endpoint", /webmasterid-ingest-api\.vercel\.app\/api\/events/],
  ]) {
    if (!pattern.test(loader)) fail("consent.provider", "tracker.ts", `${what} is missing from the loader`);
  }
  /* The loader must not reach into anything but the analytics preference. */
  if (/gci\.places\.retention|savedPlaces|personalPins|privateNotes/i.test(loader)) {
    fail("consent.scope", "tracker.ts", "reads personal-map state; the main site needs only the analytics preference");
  }
}

/* The layout must not carry a tracker, and must mount the loader. */
{
  const layout = code(readFileSync(join(ROOT, "app/layout.tsx"), "utf8"));
  if (/webmasterid/i.test(layout)) {
    fail("consent.unconditional", "app/layout.tsx", "the layout names the provider; the tracker must arrive only through the loader");
  }
  if (/<Script\b/.test(layout)) {
    fail("consent.unconditional", "app/layout.tsx", "a next/script tag is present; it emits a preload before any decision");
  }
  if (!/<AnalyticsLoader\s*\/>/.test(layout)) {
    fail("consent.loader", "app/layout.tsx", "the consent-gated loader is not mounted");
  }
  if (!/<AnalyticsPrompt\s*\/>/.test(layout)) {
    fail("consent.ui", "app/layout.tsx", "there is no way for a reader to make the choice");
  }
}

/* The loader component must be a client component that defers to an effect. */
{
  const file = join(ROOT, "components/analytics/AnalyticsLoader.tsx");
  if (!existsSync(file)) {
    fail("consent.loader", "AnalyticsLoader.tsx", "the only mount point for the tracker is missing");
  } else {
    const source = readFileSync(file, "utf8");
    if (!/^"use client"/.test(source)) {
      fail("consent.loader", "AnalyticsLoader.tsx", "is not a client component; it would run during the static build");
    }
    if (!/useEffect\s*\(/.test(code(source).replace(/^import[^;]+;/gm, ""))) {
      fail("consent.loader", "AnalyticsLoader.tsx", "does not defer to an effect; it could insert during render");
    }
  }
}

/* Both answers must share one class, so neither can be styled away. */
{
  const file = join(ROOT, "components/analytics/AnalyticsPreferences.tsx");
  if (!existsSync(file)) {
    fail("consent.ui", "AnalyticsPreferences.tsx", "there is no analytics preference interface");
  } else {
    const source = readFileSync(file, "utf8");
    const stripped = code(source);
    if ((stripped.match(/ANSWER_CLASS/g) ?? []).length < 3) {
      fail("consent.darkPattern", "AnalyticsPreferences.tsx", "the two answers do not visibly share one class");
    }
    if (/checked|defaultChecked/.test(stripped)) {
      fail("consent.darkPattern", "AnalyticsPreferences.tsx", "a pre-selected choice appears in the interface");
    }
    if (/By continuing/i.test(stripped)) {
      fail("consent.darkPattern", "AnalyticsPreferences.tsx", 'implies consent from continued use ("By continuing…")');
    }
    if (!/Allow analytics/.test(stripped) || !/No thanks/.test(stripped)) {
      fail("consent.ui", "AnalyticsPreferences.tsx", "the two answers are not both offered");
    }
    /* The preference must never carry anything but the decision. */
    if (/latitude|longitude|visitorId|userId|savedPlaces|listName/i.test(stripped)) {
      fail("consent.scope", "AnalyticsPreferences.tsx", "the preference interface touches personal content");
    }
  }
}

/* ------------------------------------------------------------------ *
 * 5b. WITHDRAWAL, RUN — not read.
 *
 * The poison suite found that nothing exercised the store: changing
 * withdrawal to record a GRANT left every rule green. So the real function is
 * loaded against a fake browser and called, and what it wrote is read back.
 * ------------------------------------------------------------------ */
{
  const data = new Map([
    ["gci.privacy.v1", JSON.stringify({ version: 1, analytics: "granted", decidedAt: "2026-09-10T00:00:00.000Z" })],
    ["wmid:av:v1", "av_existing"],
    ["gci.places.retention.v1", JSON.stringify({ version: 2, savedPlaces: { a: {} } })],
  ]);
  const fakeStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
    removeItem: (k) => data.delete(k),
  };
  const element = { remove: () => {} };
  globalThis.window = {
    localStorage: fakeStorage,
    location: { hostname: "www.globalcityintelligence.com" },
    addEventListener: () => {},
    removeEventListener: () => {},
    __webmasteridTrackerInitialized: true,
  };
  globalThis.document = { getElementById: () => element, createElement: () => ({ setAttribute: () => {} }), body: { appendChild: () => {} } };
  /* Node defines `navigator` as a getter-only global; define over it. */
  Object.defineProperty(globalThis, "navigator", { value: {}, configurable: true, writable: true });

  try {
    const store = await loadModule("lib/analytics/store.ts", ["lib/analytics/preferences.ts", "lib/analytics/tracker.ts"]);
    let reloads = 0;
    const outcome = store.withdrawAnalyticsCompletely(() => {
      reloads += 1;
    });
    const after = prefs.parsePreferences(data.get("gci.privacy.v1") ?? null);

    if (after === null || after.analytics !== "denied") {
      fail("consent.withdrawal", "withdrawAnalyticsCompletely", `records "${after?.analytics ?? "nothing"}" rather than a refusal`);
    }
    if (prefs.analyticsAuthorisation(after, { refusesTracking: false }).authorised) {
      fail("consent.withdrawal", "withdrawAnalyticsCompletely", "measurement is still authorised after withdrawal");
    }
    if (data.has("wmid:av:v1")) {
      fail("consent.withdrawal", "withdrawAnalyticsCompletely", "the provider identifier survives withdrawal");
    }
    if (!outcome.identifierRemoved) {
      fail("consent.withdrawal", "withdrawAnalyticsCompletely", "does not report the identifier as removed");
    }
    /*
     * THE RELOAD IS REQUIRED, AND MUST ACTUALLY HAPPEN — once.
     *
     * A runtime probe of the real provider showed that removing the script
     * element leaves its globals alive and that deleting the identifier is
     * undone by the next event. So reporting "a reload would help" and
     * stopping would leave the tracker running until the reader navigated.
     */
    if (!outcome.reloadRequiredForActiveTrackerWithdrawal) {
      fail("consent.withdrawal", "withdrawAnalyticsCompletely", "does not detect that a running tracker requires a reload");
    }
    if (reloads !== 1) {
      fail("consent.withdrawal", "withdrawAnalyticsCompletely", `reloaded ${reloads} times while terminating a running tracker; expected exactly 1`);
    }
    /* And it must not take anything it was not offered. */
    if (!data.has("gci.places.retention.v1")) {
      fail("consent.scope", "withdrawAnalyticsCompletely", "withdrawal deleted the reader's saved places");
    }
    notes.push("withdrawal: refusal recorded, identifier removed, reload performed once, saved state untouched");

    /*
     * NO RELOAD WHEN THERE IS NOTHING TO TERMINATE. Somebody declining before
     * anything loaded must not have the page jump under them, and a reload in
     * the already-denied state is how a loop starts.
     */
    {
      globalThis.window.__webmasteridTrackerInitialized = false;
      delete globalThis.window.WebmasterID;
      globalThis.document.getElementById = () => null;
      const { __resetTrackerLatch } = await loadModule("lib/analytics/tracker.ts", ["lib/analytics/preferences.ts"]);
      __resetTrackerLatch?.();
      let quietReloads = 0;
      const quiet = store.withdrawAnalyticsCompletely(() => {
        quietReloads += 1;
      });
      if (quiet.reloadRequiredForActiveTrackerWithdrawal || quietReloads !== 0) {
        fail("consent.withdrawal", "withdrawAnalyticsCompletely", `reloaded ${quietReloads} times with no tracker running; a reload loop starts here`);
      }
      notes.push("withdrawal with no tracker running: no reload");
    }

    /* Allowing after a refusal must work, or withdrawal is a trap. */
    store.allowAnalytics();
    const reAllowed = prefs.parsePreferences(data.get("gci.privacy.v1") ?? null);
    if (!prefs.analyticsAuthorisation(reAllowed, { refusesTracking: false }).authorised) {
      fail("consent.withdrawal", "allowAnalytics", "a reader who withdrew cannot opt back in");
    }
  } finally {
    delete globalThis.window;
    delete globalThis.document;
    Reflect.deleteProperty(globalThis, "navigator");
  }
}

/* ------------------------------------------------------------------ *
 * 6. THE EMITTED SITE MUST NOT MENTION THE PROVIDER.
 *
 * The rule that actually protects a reader who has said nothing. Everything
 * above is source; this is what a browser receives.
 *
 * `grep` rather than 84,836 readFileSync calls: the site is ~21 GB, and a
 * gate that takes four minutes is a gate people stop running. One process
 * reads it in seconds and answers the same question.
 *
 * CONSENT_GATE_SKIP_OUTPUT is honoured for the poison harness, whose cases all
 * mutate SOURCE — re-scanning the same unchanged build twenty-six times proves
 * nothing and costs an hour. The emitted-output rules have their own poison
 * section that injects into a page and runs this scan for real.
 * ------------------------------------------------------------------ */
{
  const out = join(ROOT, "out");
  if (!existsSync(out)) {
    notes.push("emitted output: not built — run `npm run build` before trusting this gate");
  } else if (process.env.CONSENT_GATE_SKIP_OUTPUT === "1") {
    notes.push("emitted output: skipped (CONSENT_GATE_SKIP_OUTPUT=1)");
  } else {
    const grep = (pattern) => {
      try {
        return execFileSync("grep", ["-rlE", "--include=*.html", pattern, out], {
          encoding: "utf-8",
          maxBuffer: 256 * 1024 * 1024,
        })
          .split("\n")
          .filter(Boolean);
      } catch (error) {
        /* grep exits 1 when nothing matched, which is the good case. */
        if (error.status === 1) return [];
        throw error;
      }
    };
    /*
     * WHAT IS FORBIDDEN IS A FETCH, NOT A MENTION.
     *
     * The first version failed on any page containing "webmasterid" and caught
     * two that are correct: /ecosystem, which LINKS to WebmasterID as a sibling
     * HELPERG product, and /privacy, which DISCLOSES it as the measurement
     * provider — naming `wmid:av:v1` in the storage table because the policy is
     * required to. A rule that fails a release for disclosing the provider
     * would pressure somebody to delete a disclosure to keep a privacy gate
     * green, which is precisely backwards.
     *
     * So the check is for the things that make a browser CONTACT the provider
     * before anyone has agreed: the tracker script URL, the ingest endpoint, a
     * <script> naming the host, and every resource hint or speculation rule
     * that would fetch it. A hyperlink a reader may choose to follow, and a
     * sentence describing what happens after they agree, are neither.
     */
    const initiators = [
      ["the tracker script URL", "tracker\\.iife\\.min\\.js"],
      ["the ingest endpoint", "webmasterid-ingest-api"],
      ["a <script> naming the provider", "<script[^>]*webmasterid"],
      ["a resource hint for the provider", 'rel="(preload|prefetch|preconnect|dns-prefetch|modulepreload)"[^>]*webmasterid'],
      ["a speculation rule", "speculationrules"],
    ];
    /*
     * ONE PASS OVER 21 GB, not five. The union answers the only question that
     * matters — is there anything here that would fetch the provider — and the
     * per-pattern classification runs afterwards, on the handful of files it
     * found, which costs nothing. A gate slow enough to be skipped protects
     * nobody.
     */
    const offending = grep(initiators.map(([, pattern]) => `(${pattern})`).join("|"));
    if (offending.length > 0) {
      for (const [what, pattern] of initiators) {
        const hits = offending.filter((f) => new RegExp(pattern, "i").test(readFileSync(f, "utf8")));
        if (hits.length > 0) {
          fail("consent.staticHtml", "out", `${hits.length} emitted page(s) contain ${what}, e.g. ${relative(out, hits[0])}`);
        }
      }
    }
    const preloading = offending.filter((f) =>
      /rel="(preload|prefetch|preconnect|dns-prefetch|modulepreload)"[^>]*webmasterid/i.test(readFileSync(f, "utf8")),
    );
    if (preloading.length > 0) {
      fail("consent.preload", relative(out, preloading[0]), "asks the browser to fetch the provider ahead of any decision");
    }
    const mentions = grep("webmasterid");
    notes.push(
      `emitted output: ${offending.length} pages that would fetch the provider, ${preloading.length} preloading it ` +
        `(${mentions.length} mention it in a link or a disclosure, which is expected)`,
    );
  }
}

/* ------------------------------------------------------------------ *
 * 7. THE POLICY AND THE IMPLEMENTATION AGREE.
 * ------------------------------------------------------------------ */
{
  const raw = readFileSync(join(ROOT, "app/privacy/page.tsx"), "utf8");
  const full = code(raw).replace(/\s+/g, " ");
  /*
   * SCOPED TO THE MEASUREMENT SECTION. A poison case removed the cross-product
   * claim from the paragraph that explains measurement and the gate stayed
   * green, because the same words survived in a later section about where the
   * setting lives. A guarantee has to be made where the reader is being told
   * what is collected — the same lesson the Places copy gate learned about
   * "list names".
   */
  const sectionStart = full.indexOf("Measuring how the site is used");
  const sectionEnd = full.indexOf("SectionHeading", sectionStart + 1);
  const page = sectionStart === -1 ? full : full.slice(sectionStart, sectionEnd === -1 ? undefined : sectionEnd);
  if (sectionStart === -1) {
    fail("consent.policy", "app/privacy/page.tsx", "the measurement section is missing or was renamed");
  }
  for (const [what, pattern] of [
    ["that nothing is measured without permission", /measured unless you allow it|nothing here is measured unless/i],
    ["that the choice covers both products", /one choice for one site/i],
    ["that DNT and GPC override it", /Do Not Track/i],
    ["that withdrawal deletes the identifier", /deletes the identifier|withdraw below, which deletes it/i],
  ]) {
    if (!pattern.test(page)) {
      fail("consent.policy", "app/privacy/page.tsx", `the policy does not say ${what}`);
    }
  }
  /* The superseded claim: unconditional main-site measurement. */
  if (/The main site<\/strong> uses WebmasterID to count/.test(page)) {
    fail("consent.policy", "app/privacy/page.tsx", "the policy still describes unconditional main-site measurement");
  }
  /*
   * RENDERED, not imported. The first version matched the component name
   * anywhere in the file, so deleting the JSX left the import line satisfying
   * it — the same shape as a rule that matched `useEffect` in an import while
   * the effect itself had been replaced.
   */
  if (!/<AnalyticsPreferencesPanel\s*\/>/.test(raw)) {
    fail("consent.ui", "app/privacy/page.tsx", "the privacy page imports the analytics choice but never renders it");
  }
}

rmSync(workdir, { recursive: true, force: true });

for (const note of notes) process.stdout.write(`  ${note}\n`);
for (const e of errors) process.stdout.write(`  ERROR [${e.rule}] ${e.where}: ${e.detail}\n`);
process.stdout.write(
  errors.length === 0
    ? `\nMAIN ANALYTICS CONSENT PASS\n`
    : `\n${errors.length} MAIN ANALYTICS CONSENT FAILURE(S)\n`,
);
process.exit(errors.length === 0 ? 0 : 1);
