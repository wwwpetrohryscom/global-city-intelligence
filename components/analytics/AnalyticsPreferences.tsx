"use client";

import { useId, useState } from "react";

import { allowAnalytics, denyAnalytics, withdrawAnalyticsCompletely } from "@/lib/analytics/store";
import { usePrivacy } from "@/lib/analytics/use-privacy";
import { staticRoutes } from "@/lib/seo/routes";

/**
 * THE ASK, AND THE PLACE TO CHANGE IT.
 *
 * ONE DECISION ACROSS ONE ORIGIN. The main site and GCI Places share
 * `gci.privacy.v1`, so somebody who has already answered on either is not
 * asked again here — the prompt renders only while the answer is genuinely
 * absent, and the panel always shows the current state whichever product set
 * it.
 *
 * BOTH ANSWERS ARE ONE ARRAY WITH ONE SHARED CLASS. That is not tidiness: it
 * is what makes a dark pattern require deliberate work rather than a moment's
 * inattention, and a gate checks that the two buttons still share it.
 */

const ANSWER_CLASS =
  "rounded-full border border-[color:var(--gci-border,#d8dee9)] px-4 py-2 text-[13px] font-medium " +
  "text-[color:var(--gci-ink,#1b2733)] transition hover:border-[color:var(--gci-ink,#1b2733)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export function AnalyticsPrompt() {
  const { ready, preferences, refusesTracking, writable } = usePrivacy();
  const [error, setError] = useState<string | null>(null);
  const headingId = `${useId()}-analytics-ask`;

  /*
   * Nothing to ask when the question is already answered, when the browser has
   * answered it globally, or when this browser cannot record an answer — a
   * prompt whose buttons could not persist anything would be a lie.
   */
  if (!ready || preferences !== null || refusesTracking || !writable) return null;

  const answer = (allow: boolean) => {
    const persisted = allow ? allowAnalytics() : denyAnalytics();
    if (!persisted) setError("This browser refused to save that choice.");
  };

  return (
    <aside
      aria-labelledby={headingId}
      className="mx-auto mt-8 max-w-3xl rounded-xl border border-[color:var(--gci-border,#d8dee9)] p-4"
    >
      <h2 className="text-[14px] font-semibold" id={headingId}>
        Help improve Global City Intelligence?
      </h2>
      <p className="mt-1 max-w-prose text-[13px] leading-relaxed">
        We would like to count which pages are read, and how features are used, so we can tell what
        is worth building. It is optional and off unless you say yes.
        <span className="block pt-1">
          Saying yes loads a measurement script, which stores a random identifier in this browser so
          repeat visits count once rather than many times, and records that you opened a page. It
          covers this site and GCI Places, and you can change your mind at any time.
        </span>{" "}
        <a className="underline underline-offset-4" href={staticRoutes.privacy}>
          Privacy
        </a>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { label: "Allow analytics", allow: true },
          { label: "No thanks", allow: false },
        ].map((option) => (
          <button
            className={ANSWER_CLASS}
            key={option.label}
            onClick={() => answer(option.allow)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-[12px]" role="alert">
          {error}
        </p>
      ) : null}
    </aside>
  );
}

/**
 * The reopenable panel. A decision somebody cannot revisit is not a decision,
 * so this always says what the current state is and always offers the other
 * answer — and explains WHY when a browser signal is in force, rather than
 * showing a control that would appear not to work.
 */
export function AnalyticsPreferencesPanel() {
  const { ready, preferences, authorisation, refusesTracking, writable } = usePrivacy();
  const [error, setError] = useState<string | null>(null);
  const headingId = `${useId()}-analytics-preferences`;

  if (!ready) return null;

  const act = (fn: () => boolean) => {
    if (!fn()) setError("This browser refused to save that choice.");
    else setError(null);
  };

  /*
   * Withdrawal is two things, and this page can only finish one. The refusal
   * stops every future page loading the tracker and the identifier is deleted
   * here — but a script already running in THIS document keeps running, and
   * the provider documents no teardown. So the reader is told and offered the
   * reload, rather than the page reloading itself.
   */
  const withdraw = () => {
    const outcome = withdrawAnalyticsCompletely();
    if (!outcome.refused) {
      setError("This browser refused to save that choice.");
      return;
    }
    setError(null);
  };

  const state = refusesTracking
    ? "Your browser asks sites not to track you, so analytics stays off here. That setting wins over anything chosen on this page."
    : preferences === null
      ? "You have not been asked yet, so analytics is off."
      : preferences.analytics === "granted"
        ? "You allowed optional analytics. A measurement script runs on this site and on GCI Places, it keeps a random identifier in this browser, and it counts which pages and features you use."
        : "You declined optional analytics, so it stays off.";

  return (
    <section
      aria-labelledby={headingId}
      className="mt-6 rounded-xl border border-[color:var(--gci-border,#d8dee9)] p-4"
    >
      <h2 className="text-[14px] font-semibold" id={headingId}>
        Analytics preferences
      </h2>
      <p className="mt-1 max-w-prose text-[13px] leading-relaxed" role="status">
        {state}
      </p>

      {refusesTracking || !writable ? null : (
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { label: "Allow analytics", run: () => act(allowAnalytics) },
            {
              label: preferences?.analytics === "granted" ? "Turn off analytics" : "No thanks",
              run: preferences?.analytics === "granted" ? withdraw : () => act(denyAnalytics),
            },
          ].map((option) => (
            <button className={ANSWER_CLASS} key={option.label} onClick={option.run} type="button">
              {option.label}
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 max-w-prose text-[12px] leading-snug">
        This choice covers the whole site, including GCI Places. Changing it never affects your
        saved places, lists, pins or notes — they are stored separately and are not part of
        analytics.{" "}
        <a className="underline underline-offset-4" href={staticRoutes.privacy}>
          Privacy
        </a>
      </p>



      {error ? (
        <p className="mt-2 text-[12px]" role="alert">
          {error}
        </p>
      ) : null}
      {/* A machine-readable statement of the current authorisation, for QA. */}
      <span
        data-analytics-authorised={authorisation.authorised ? "yes" : "no"}
        data-analytics-reason={authorisation.authorised ? "granted" : authorisation.reason}
        hidden
      />
    </section>
  );
}
