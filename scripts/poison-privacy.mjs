#!/usr/bin/env node
/**
 * POISON TESTS for the privacy contract.
 *
 * Every rule in `validate-privacy.mjs` is proved to fire, by making the exact
 * contradiction it exists to catch and checking that IT is the reason for the
 * failure — not that something, somewhere, went red.
 *
 * Two things this project has learned the hard way and applies here:
 *
 *   A MUTATION MUST PRODUCE A PROGRAM THAT RUNS. A change that fails to parse
 *   makes the validator crash, and a crash is not a rule firing. Every poison
 *   below leaves valid code that is simply untrue.
 *
 *   A POISON VALUE MUST BE ABLE TO REACH THE GUARDED PATH. A case that probes
 *   with something the rule could never see looks thorough and tests nothing —
 *   which is exactly how a prototype-pollution case in the Places repository
 *   passed while the hole it named was open.
 *
 *   node scripts/poison-privacy.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
let failures = 0;
let passes = 0;

function check(name, ok, detail = "") {
  if (ok) {
    passes += 1;
    process.stdout.write(`  caught     ${name}\n`);
  } else {
    failures += 1;
    process.stdout.write(`  NOT CAUGHT ${name}${detail ? `: ${detail}` : ""}\n`);
  }
}

function runValidator() {
  try {
    const out = execFileSync("node", ["scripts/validate-privacy.mjs"], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { ok: true, output: out };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

/** Apply a textual mutation, run the validator, restore, assert the rule. */
function poison({ name, file, find, replace, expectRule }) {
  const path = join(ROOT, file);
  const original = readFileSync(path, "utf-8");
  if (!original.includes(find)) {
    failures += 1;
    process.stdout.write(`  ANCHOR x   ${name}\n`);
    return;
  }
  writeFileSync(path, original.replace(find, replace));
  const result = runValidator();
  writeFileSync(path, original);
  check(name, !result.ok && result.output.includes(expectRule), result.output.slice(0, 140));
}

process.stdout.write("Privacy contract poison\n\n");

/* ---- 1. The policy claims analytics is on while the layout has no tracker ---- */
poison({
  name: "policy claims main-site measurement is active while the layout has none",
  file: "app/layout.tsx",
  find: 'src="https://webmasterid.com/tracker.iife.min.js"',
  replace: 'src="https://webmasterid.example/disabled.js"',
  expectRule: "privacy.analyticsDrift",
});

/* ---- 2. A tracker appears that the policy does not disclose ---- */
poison({
  name: "an undisclosed third-party script added to the layout",
  file: "app/layout.tsx",
  find: "        <Script",
  replace: '        <Script src="https://cdn.trackerco.test/t.js" strategy="afterInteractive" id="x" />\n        <Script',
  expectRule: "privacy.undisclosedProvider",
});

/* ---- 3. The policy claims cloud sync while denying a server ---- */
poison({
  name: "policy claims cloud sync exists",
  file: "lib/legal/privacy.ts",
  find: "  cloudSyncEnabled: false,",
  replace: "  cloudSyncEnabled: true,",
  expectRule: "privacy.syncDrift",
});

/* ---- 4. The policy claims accounts exist ---- */
poison({
  name: "policy claims accounts exist",
  file: "lib/legal/privacy.ts",
  find: "  accountsEnabled: false,",
  replace: "  accountsEnabled: true,",
  expectRule: "privacy.accountsDrift",
});

/* ---- 5. A permanent guarantee is weakened ---- */
for (const guarantee of [
  "personalPinCoordinatesTransmitted",
  "privateNotesTransmitted",
  "listNamesTransmitted",
]) {
  poison({
    name: `the "${guarantee}" guarantee flipped`,
    file: "lib/legal/privacy.ts",
    find: `  ${guarantee}: false,`,
    replace: `  ${guarantee}: true,`,
    expectRule: "privacy.guarantee",
  });
}

/* ---- 6. The canonical route is moved or duplicated ---- */
poison({
  name: "the canonical privacy route moved off /privacy",
  file: "lib/seo/routes.ts",
  find: '  privacy: "/privacy",',
  replace: '  privacy: "/legal/privacy",',
  expectRule: "privacy.route",
});

poison({
  name: "the footer link to the privacy policy removed",
  file: "components/layout/Footer.tsx",
  find: "          <FooterLink href={staticRoutes.privacy}>Privacy</FooterLink>",
  replace: "",
  expectRule: "privacy.footerLink",
});

poison({
  name: "the privacy route dropped from the sitemap",
  file: "lib/sitemap/entries.ts",
  find: '    { url: absoluteUrl(staticRoutes.privacy), lastModified: staticFreshness, changeFrequency: "yearly", priority: 0.3 },',
  replace: "",
  expectRule: "privacy.sitemap",
});

poison({
  name: "privacy added to the primary navigation, crowding the shared header",
  file: "components/layout/PrimaryNav.tsx",
  find: "export function PrimaryNav",
  replace:
    'import { staticRoutes as __routes } from "@/lib/seo/routes";\nconst __privacy = __routes.privacy;\nvoid __privacy;\nexport function PrimaryNav',
  expectRule: "privacy.headerCrowding",
});

/* ---- 7. Unsupported absolutes in the published text ---- */
for (const [name, sentence, rule] of [
  ["claims complete anonymity", "Our analytics are 100% anonymous.", "privacy.unsupportedClaim"],
  ["claims IP addresses are never logged", "We never log your IP address.", "privacy.unsupportedClaim"],
  ["claims no data is collected at all", "We never collect any data.", "privacy.unsupportedClaim"],
  ["asserts regulatory compliance", "This site is fully GDPR compliant.", "privacy.unsupportedClaim"],
]) {
  poison({
    name: `policy ${name}`,
    file: "app/privacy/page.tsx",
    find: "          <p className=\"text-sm text-text-muted\">Prepared {PRIVACY_PREPARED_ON}.</p>",
    replace: `          <p className="text-sm text-text-muted">Prepared {PRIVACY_PREPARED_ON}.</p>\n          <p>${sentence}</p>`,
    expectRule: rule,
  });
}

/* ---- 8. A blocker quietly removed ---- */
poison({
  name: "the consent blocker removed without being resolved",
  file: "lib/legal/privacy.ts",
  find: '    id: "consent-mechanism",',
  replace: '    id: "consent-resolved-somehow",',
  expectRule: "privacy.blocker",
});

/* ---- 9. A duplicate competing privacy route ---- */
{
  const dir = join(ROOT, "app/privacy-policy");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), "export default function P() {\n  return null;\n}\n");
  const result = runValidator();
  rmSync(dir, { recursive: true, force: true });
  check(
    "a second competing privacy route added",
    !result.ok && result.output.includes("privacy.duplicateRoute"),
    result.output.slice(0, 140),
  );
}

/* ---- 10. An analytics dependency installed without disclosure ---- */
{
  const path = join(ROOT, "package.json");
  const original = readFileSync(path, "utf-8");
  const parsed = JSON.parse(original);
  parsed.dependencies["posthog-js"] = "^1.0.0";
  writeFileSync(path, `${JSON.stringify(parsed, null, 2)}\n`);
  const result = runValidator();
  writeFileSync(path, original);
  check(
    "an undisclosed analytics provider installed",
    !result.ok && result.output.includes("privacy.undisclosedProvider"),
    result.output.slice(0, 140),
  );
}

/* ---- 11. An API route appears, contradicting "no GCI server" ---- */
{
  const dir = join(ROOT, "app/api/sync");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "route.ts"), "export async function POST() {\n  return new Response(null);\n}\n");
  const result = runValidator();
  rmSync(join(ROOT, "app/api"), { recursive: true, force: true });
  check(
    "a server endpoint added while the policy denies one",
    !result.ok && result.output.includes("privacy.syncDrift"),
    result.output.slice(0, 140),
  );
}

/* ---- 12. The whole contract removed ---- */
{
  const path = join(ROOT, "lib/legal/privacy.ts");
  const original = readFileSync(path, "utf-8");
  rmSync(path);
  const result = runValidator();
  writeFileSync(path, original);
  check(
    "the privacy contract deleted",
    !result.ok && result.output.includes("privacy.contract"),
    result.output.slice(0, 140),
  );
}

/* ---- The operator is published, so the page must actually name it ---- */
poison({
  name: "the operator is published but the page stops rendering the legal entity",
  file: "app/privacy/page.tsx",
  find: "{PRIVACY_OPERATOR.legalEntity}",
  replace: "{PRIVACY_OPERATOR.displayName}",
  expectRule: "privacy.operatorUnrendered",
});

poison({
  name: "the operator is published but the page stops rendering the address",
  file: "app/privacy/page.tsx",
  find: "{PRIVACY_OPERATOR.postalAddress.map((line) => (",
  replace: "{[].map((line) => (",
  expectRule: "privacy.operatorUnrendered",
});

/* ---- The page keeps telling readers the operator is unknown ---- */
poison({
  name: "the page still claims the operator has not yet been published",
  file: "app/privacy/page.tsx",
  find: "a company registered in {PRIVACY_OPERATOR.country}",
  replace: "whose registered details have not yet been published here",
  expectRule: "privacy.operatorStale",
});

/* ---- A placeholder standing where an operator fact belongs ---- */
poison({
  name: "the legal entity is replaced with a placeholder",
  file: "lib/legal/privacy.ts",
  find: 'legalEntity: "HELPERG LLC",',
  replace: 'legalEntity: "Example LLC",',
  expectRule: "privacy.operatorPlaceholder",
});

/* ---- A contact that is not an address ---- */
poison({
  name: "the privacy contact is prose rather than an email address",
  file: "lib/legal/privacy.ts",
  find: '  contact: "info@helperg.com",',
  replace: '  contact: "via the contact form",',
  expectRule: "privacy.operatorContact",
});

/* ---- A contact printed but not reachable ---- */
poison({
  name: "the contact is shown as plain text with no mailto",
  file: "app/privacy/page.tsx",
  find: "href={`mailto:${PRIVACY_OPERATOR.contact}`}",
  replace: 'href="/contact"',
  expectRule: "privacy.operatorContact",
});

/* ---- Active measurement described as universal rather than optional ---- */
poison({
  name: "the page stops saying measurement needs permission",
  file: "app/privacy/page.tsx",
  find: "<strong>GCI Places measures nothing unless you allow it.</strong> It asks first and",
  replace: "<strong>GCI Places measures how the site is used.</strong> It counts pages and",
  expectRule: "privacy.activeAnalytics",
});

poison({
  name: "the page stops saying silence is a refusal",
  file: "app/privacy/page.tsx",
  find: "takes silence as a no: until you choose, no measurement script is loaded, no",
  replace: "begins straight away: from your first visit a measurement script is loaded, an",
  expectRule: "privacy.activeAnalytics",
});

poison({
  name: "the page stops saying the choice can be changed",
  file: "app/privacy/page.tsx",
  find: "You can change your mind at any time under <em>Analytics preferences</em> on the Saved",
  replace: "This applies from now on, under <em>Analytics preferences</em> on the Saved",
  expectRule: "privacy.activeAnalytics",
});

poison({
  name: "the page stops saying withdrawal deletes the identifier",
  file: "app/privacy/page.tsx",
  find: "Withdrawing stops it immediately, and deletes the identifier from your browser.",
  replace: "Withdrawing stops it immediately.",
  expectRule: "privacy.activeAnalytics",
});

poison({
  name: "the page stops excluding private personal-map content",
  file: "app/privacy/page.tsx",
  find: "your list names, your pin titles, your pin locations or",
  replace: "your saved cities or",
  expectRule: "privacy.activeAnalytics",
});

poison({
  name: "the page still claims GCI Places measures nothing",
  file: "app/privacy/page.tsx",
  find: "<strong>GCI Places measures nothing unless you allow it.</strong>",
  replace: "<strong>GCI Places currently measures nothing.</strong>",
  expectRule: "privacy.staleAnalytics",
});

poison({
  name: "measurement is active while the opt-in requirement is dropped",
  file: "lib/legal/privacy.ts",
  find: "  placesAnalyticsRequiresOptIn: true,",
  replace: "  placesAnalyticsRequiresOptIn: false,",
  expectRule: "privacy.consentDrift",
});

/* ================================================================== */
const final = runValidator();
process.stdout.write(`\n  restored: privacy contract is ${final.ok ? "GREEN" : "RED"}\n`);
if (!final.ok) failures += 1;

process.stdout.write(
  failures === 0
    ? `\nALL ${passes} PRIVACY POISON CASES CAUGHT BY THE EXPECTED RULE\n`
    : `\n${failures} PRIVACY POISON CASE(S) NOT HANDLED CORRECTLY\n`,
);
process.exit(failures === 0 ? 0 : 1);
