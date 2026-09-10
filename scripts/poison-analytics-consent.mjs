#!/usr/bin/env node
/**
 * POISON TESTS for the main site's analytics consent gate.
 *
 * The property: A BROWSER MUST NOT CONTACT THE MEASUREMENT PROVIDER UNTIL THE
 * READER HAS SAID YES, ON THE CANONICAL HOST — and the main site and GCI
 * Places must mean the same thing by "yes".
 *
 * Every mutation leaves a program that RUNS. A change that fails to compile
 * makes the validator crash, and a crash is not a rule firing — checked here
 * rather than assumed: any case whose output mentions a type or syntax error is
 * reported NOT CAUGHT even when the exit code was non-zero.
 *
 * Each case names the rule it expects, and the harness reports EXPECTED vs
 * ACTUAL when they differ, because "something went red" is not evidence that
 * the rule you care about is the one that fired.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
let failures = 0;
let passes = 0;

/**
 * RESTORE ON THE WAY OUT, WHATEVER HAPPENS.
 *
 * This harness edits real files. An earlier run was killed by a timeout
 * partway through and left `browserRefusesTracking` returning `false` on disk
 * — a mutation that disables Do Not Track, sitting in the working tree looking
 * like code somebody wrote. The next validator run caught it, which is the
 * system working, but only by luck of the ordering.
 *
 * So every mutation is registered before it is written and undone on any exit
 * path: normal, thrown, interrupted or terminated.
 */
const pending = new Map();
function restoreAll() {
  for (const [path, original] of pending) {
    try {
      writeFileSync(path, original);
    } catch {
      /* Nothing useful to do while exiting; the next gate run will report it. */
    }
  }
  pending.clear();
}
process.on("exit", restoreAll);
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    restoreAll();
    process.exit(130);
  });
}
process.on("uncaughtException", (error) => {
  restoreAll();
  process.stdout.write(`\n  HARNESS ERROR: ${error?.message ?? error}\n`);
  process.exit(1);
});

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
    const out = execFileSync("node", ["scripts/validate-analytics-consent.mjs"], {
      cwd: ROOT,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"],
      /* Source mutations; the emitted-output rules have their own section. */
      env: { ...process.env, CONSENT_GATE_SKIP_OUTPUT: "1" },
    });
    return { ok: true, output: out };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

/*
 * A CRASH IS NOT A RULE FIRING, and it must not be reported as one — nor as a
 * gate that stayed green, which is what the first version said when a mutation
 * made the validator throw. Both compile-time and RUNTIME failures count:
 * `const inserted = false` transpiles happily and then dies on assignment, and
 * the validator never reaches the rule the case was written to prove.
 */
const crashed = (output) =>
  /SyntaxError|Cannot find name|error TS\d+|TSError|TypeError|ReferenceError|Assignment to constant/.test(output);
const actualRules = (output) => [...output.matchAll(/ERROR \[([a-zA-Z.]+)\]/g)].map((m) => m[1]);

function poison({ name, file, find, replace, expectRule }) {
  const path = join(ROOT, file);
  const original = readFileSync(path, "utf-8");
  if (!original.includes(find)) {
    failures += 1;
    process.stdout.write(`  ANCHOR x   ${name}\n`);
    return;
  }
  pending.set(path, original);
  writeFileSync(path, original.replace(find, replace));
  const result = runValidator();
  writeFileSync(path, original);
  pending.delete(path);

  if (crashed(result.output)) {
    check(name, false, "the mutation crashed the validator; a crash is not a rule firing");
    return;
  }
  const actual = actualRules(result.output);
  const ok = !result.ok && actual.includes(expectRule);
  check(name, ok, ok ? "" : `EXPECTED ${expectRule} · ACTUAL ${actual.join(",") || "(none — gate stayed green)"}`);
}

process.stdout.write("Main analytics consent poison\n\n");

/* ---- 1-2. The unconditional tracker and its preload come back ---- */
poison({
  name: "the unconditional <Script> is restored in the layout",
  file: "app/layout.tsx",
  find: "        <AnalyticsLoader />",
  replace:
    '        <script defer src="https://webmasterid.com/tracker.iife.min.js" />\n        <AnalyticsLoader />',
  expectRule: "consent.unconditional",
});
poison({
  name: "a tracker preload is restored",
  file: "app/layout.tsx",
  find: "        <AnalyticsLoader />",
  replace:
    '        <link as="script" href="https://webmasterid.com/tracker.iife.min.js" rel="preload" />\n        <AnalyticsLoader />',
  expectRule: "consent.unconditional",
});

/* ---- 3-4. Undecided or denied authorises ---- */
poison({
  name: "undecided authorises measurement",
  file: "lib/analytics/preferences.ts",
  find: '  if (preferences === null) return { authorised: false, reason: "undecided" };',
  replace: "  if (preferences === null) return { authorised: true };",
  expectRule: "consent.conformance",
});
poison({
  name: "a refusal authorises measurement",
  file: "lib/analytics/preferences.ts",
  find: '  if (preferences.analytics === "denied") return { authorised: false, reason: "denied" };',
  replace: '  if (preferences.analytics === "denied") return { authorised: true };',
  expectRule: "consent.conformance",
});

/* ---- 5-6. Browser signals ignored ---- */
poison({
  name: "Do Not Track is ignored",
  file: "lib/analytics/preferences.ts",
  find: '  return dnt === "1" || dnt === "yes";',
  replace: "  return false;",
  expectRule: "consent.conformance",
});
poison({
  name: "Global Privacy Control is ignored",
  file: "lib/analytics/preferences.ts",
  find: "  if (source.globalPrivacyControl === true) return true;",
  replace: "  if (source.globalPrivacyControl === false) return true;",
  expectRule: "consent.conformance",
});
poison({
  name: "a stored grant is made to outrank the browser signal",
  file: "lib/analytics/preferences.ts",
  find: '  if (refuses) return { authorised: false, reason: "browser-signal" };',
  replace: '  if (refuses && preferences?.analytics !== "granted") return { authorised: false, reason: "browser-signal" };',
  expectRule: "consent.conformance",
});

/* ---- 7-8. Malformed and future preferences ---- */
poison({
  name: "a malformed preference is read as agreement",
  file: "lib/analytics/preferences.ts",
  find: "  } catch {\n    return null;\n  }",
  replace: '  } catch {\n    return { version: 1, analytics: "granted", decidedAt: new Date().toISOString() };\n  }',
  expectRule: "consent.conformance",
});
poison({
  name: "an unknown future schema version is honoured as a grant",
  file: "lib/analytics/preferences.ts",
  find: "  if (value.version !== PRIVACY_PREFERENCES_VERSION) return null;",
  replace: "  if (typeof value.version !== \"number\") return null;",
  expectRule: "consent.conformance",
});

/* ---- 9-10. Non-canonical hosts load the tracker ---- */
poison({
  name: "localhost is treated as the production host",
  file: "lib/analytics/tracker.ts",
  find: "  return host === MEASURED_HOST;",
  replace: '  return host === MEASURED_HOST || host === "localhost";',
  expectRule: "consent.host",
});
poison({
  name: "the Netlify origin is treated as the production host",
  file: "lib/analytics/tracker.ts",
  find: "  return host === MEASURED_HOST;",
  replace: "  return host.endsWith(MEASURED_HOST);",
  expectRule: "consent.host",
});

/* ---- 11. Duplicate initialisation ---- */
poison({
  /*
   * The latch's EFFECT, removed by a mutation that actually runs. Rewriting
   * `let` to `const` looks like the obvious poison and is useless: it
   * transpiles, then throws on the first assignment, so the validator dies
   * before reaching any rule.
   */
  name: "the module latch stops being consulted, so two effects can both insert",
  file: "lib/analytics/tracker.ts",
  find: '  if (inserted) return "already-loaded";',
  replace: "",
  expectRule: "consent.duplicate",
});
poison({
  name: "the document check is removed",
  file: "lib/analytics/tracker.ts",
  find: "    alreadyLoaded: hasDocument && document.getElementById(TRACKER_ELEMENT_ID) !== null,",
  replace: "    alreadyLoaded: false,",
  expectRule: "consent.duplicate",
});

/* ---- 12-14. The tracker reaches the page before authorisation ---- */
poison({
  name: "the loader stops consulting the reader's decision",
  file: "lib/analytics/tracker.ts",
  find: '  if (!conditions.authorised) return { load: false, reason: "not-authorised" };',
  replace: "",
  expectRule: "consent.decision",
});
poison({
  name: "the loader stops checking the host",
  file: "lib/analytics/tracker.ts",
  find: '  if (!conditions.canonicalHost) return { load: false, reason: "wrong-host" };',
  replace: "",
  expectRule: "consent.decision",
});
poison({
  name: "the loader inserts during render rather than in an effect",
  file: "components/analytics/AnalyticsLoader.tsx",
  find: "  useEffect(() => {",
  replace: "  const runOnRender = ((): void => {",
  expectRule: "consent.loader",
});

/* ---- 15-17. Withdrawal ---- */
poison({
  name: "withdrawal leaves future authorisation true",
  file: "lib/analytics/store.ts",
  find: '  const refused = write("denied");',
  replace: '  const refused = write("granted");',
  expectRule: "consent.withdrawal",
});
poison({
  name: "withdrawal stops removing the analytics identifier",
  file: "lib/analytics/tracker.ts",
  find: "    window.localStorage.removeItem(PROVIDER_ANALYTICS_ID_KEY);",
  replace: "    void PROVIDER_ANALYTICS_ID_KEY;",
  expectRule: "consent.withdrawal",
});
poison({
  name: "the loader reaches into personal-map state",
  file: "lib/analytics/tracker.ts",
  find: "export const TRACKER_ELEMENT_ID",
  replace:
    'export const SAVED = "gci.places.retention.v1";\nexport const TRACKER_ELEMENT_ID',
  expectRule: "consent.scope",
});

/* ---- 17b. Withdrawal stops terminating a running tracker ---- */
poison({
  name: "withdrawal reports the reload but never performs it",
  file: "lib/analytics/store.ts",
  find: "  if (refused && reloadRequiredForActiveTrackerWithdrawal) reload();",
  replace: "",
  expectRule: "consent.withdrawal",
});
poison({
  name: "withdrawal reloads even when no tracker is running",
  file: "lib/analytics/store.ts",
  find: "  if (refused && reloadRequiredForActiveTrackerWithdrawal) reload();",
  replace: "  if (refused) reload();",
  expectRule: "consent.withdrawal",
});
poison({
  name: "the live check falls back to a DOM-only test the provider survives",
  file: "lib/analytics/tracker.ts",
  find: "    if (global.__webmasteridTrackerInitialized === true) return true;\n    if (global.WebmasterID !== undefined) return true;",
  replace: "    void global;",
  expectRule: "consent.withdrawal",
});

/* ---- 18. The two products' keys diverge ---- */
poison({
  name: "the main site invents its own preference key",
  file: "lib/analytics/preferences.ts",
  find: 'export const PRIVACY_PREFERENCES_KEY = "gci.privacy.v1";',
  replace: 'export const PRIVACY_PREFERENCES_KEY = "gci.main.privacy";',
  expectRule: "consent.sharedKey",
});

/* ---- 19. The policy says Places-only opt-in ---- */
poison({
  name: "the policy reverts to unconditional main-site measurement",
  file: "app/privacy/page.tsx",
  find: "<strong>Nothing here is measured unless you allow it.</strong> That applies to the",
  replace: "<strong>The main site</strong> uses WebmasterID to count visits and applies to the",
  expectRule: "consent.policy",
});
poison({
  name: "the policy stops saying the choice covers both products",
  file: "app/privacy/page.tsx",
  find: "It is <strong>one choice for one site</strong>. The main site and GCI Places share the",
  replace: "This applies here. GCI Places and the main site share the",
  expectRule: "consent.policy",
});

/* ---- 20. Reject harder than Allow ---- */
poison({
  name: "the refusal is styled differently from the grant",
  file: "components/analytics/AnalyticsPreferences.tsx",
  find: '            <button className={ANSWER_CLASS} key={option.label} onClick={option.run} type="button">',
  replace: '            <button className="text-[10px] underline" key={option.label} onClick={option.run} type="button">',
  expectRule: "consent.darkPattern",
});
poison({
  name: "consent is implied from continued use",
  file: "components/analytics/AnalyticsPreferences.tsx",
  find: "        Help improve Global City Intelligence?",
  replace: "        By continuing you consent to analytics",
  expectRule: "consent.darkPattern",
});

/* ---- 21. The consent UI disappears from the main site ---- */
poison({
  name: "the analytics choice is removed from the layout",
  file: "app/layout.tsx",
  find: "        <AnalyticsPrompt />",
  replace: "",
  expectRule: "consent.ui",
});
poison({
  name: "the privacy page stops exposing the choice",
  file: "app/privacy/page.tsx",
  find: "          <AnalyticsPreferencesPanel />",
  replace: "",
  expectRule: "consent.ui",
});

/* ---- 22. The preference carries unrelated personal data ---- */
poison({
  name: "the parsed preference carries fields nobody put in the schema",
  file: "lib/analytics/preferences.ts",
  find: "  return {\n    version: PRIVACY_PREFERENCES_VERSION,\n    analytics: value.analytics,\n    decidedAt: value.decidedAt,\n  };",
  replace: "  return { ...(value as unknown as PrivacyPreferences) };",
  expectRule: "consent.schema",
});
poison({
  name: "the preference interface reaches for personal content",
  file: "components/analytics/AnalyticsPreferences.tsx",
  find: "  const withdraw = () => {",
  replace: "  const latitude = 1.3;\n  void latitude;\n  const withdraw = () => {",
  expectRule: "consent.scope",
});

/* ================================================================== *
 * THE EMITTED SITE — the rule that protects a reader who said nothing.
 *
 * These run the output scan for real, on one injected page, because that rule
 * is skipped during the source cases above.
 * ================================================================== */
process.stdout.write("\nEmitted-output poison\n\n");
{
  const page = join(ROOT, "out/404.html");
  if (!readFileSync(page, "utf-8")) {
    failures += 1;
    process.stdout.write("  ANCHOR x   no emitted page to inject into\n");
  } else {
    const original = readFileSync(page, "utf-8");
    for (const [name, injection, rule] of [
      [
        "the tracker baked into a static page",
        '<script defer src="https://webmasterid.com/tracker.iife.min.js"></script>',
        "consent.staticHtml",
      ],
      [
        "the tracker preloaded ahead of any decision",
        '<link as="script" href="https://webmasterid.com/tracker.iife.min.js" rel="preload"/>',
        "consent.preload",
      ],
    ]) {
      pending.set(page, original);
      writeFileSync(page, original.replace("</body>", `${injection}</body>`));
      let result;
      try {
        const out = execFileSync("node", ["scripts/validate-analytics-consent.mjs"], {
          cwd: ROOT,
          encoding: "utf-8",
          stdio: ["ignore", "pipe", "pipe"],
        });
        result = { ok: true, output: out };
      } catch (error) {
        result = { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
      }
      writeFileSync(page, original);
      pending.delete(page);
      const actual = actualRules(result.output);
      const ok = !result.ok && actual.includes(rule);
      check(name, ok, ok ? "" : `EXPECTED ${rule} · ACTUAL ${actual.join(",") || "(none)"}`);
    }
  }
}

/* ================================================================== */
const final = runValidator();
process.stdout.write(`\n  restored: consent gate is ${final.ok ? "GREEN" : "RED"}\n`);
if (!final.ok) {
  process.stdout.write(`  (restored-state failures: ${actualRules(final.output).join(",") || "see output"})\n`);
}

process.stdout.write(
  failures === 0
    ? `\nALL ${passes} MAIN CONSENT POISON CASES CAUGHT BY THE EXPECTED RULE\n`
    : `\n${failures} MAIN CONSENT POISON CASE(S) NOT HANDLED CORRECTLY\n`,
);
process.exit(failures === 0 ? 0 : 1);
