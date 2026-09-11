"use client";

import { useEffect, useState } from "react";

/**
 * THE VISIBLE LANGUAGE SWITCH.
 *
 * It offers a translation when one exists and shows nothing when one does not,
 * and it knows nothing about Germany.
 *
 * ONE SOURCE OF TRUTH, BY CONSTRUCTION.
 *
 * The alternates this reads are the very `<link rel="alternate" hrefLang="…">`
 * elements the page already emits for search engines, generated at build time
 * from the committed route-pair contract. The visible switch and the hreflang
 * cluster therefore cannot disagree — not because a test compares them, but
 * because they are the same DOM nodes. Every other design (threading a path
 * through each page, a second registry, a client-side map) can drift the moment
 * one page passes the wrong value; this one has nothing to pass.
 *
 * WHAT REACHES THE BROWSER.
 *
 * Nothing but this component. There are 2,757 localized route pairs and a
 * 5,056-route completeness matrix, and neither is shipped: a page carries only
 * its own two link elements, which it needed for SEO regardless. No fetch, no
 * locale service, no runtime lookup.
 *
 * WHY IT IS A CLIENT COMPONENT.
 *
 * Next's App Router gives a server layout no way to know which page is
 * rendering beneath it, and this application's header lives in the root layout.
 * The alternative was passing locale data through ~30 route families by hand —
 * more code, more places to get it wrong, and a new way for the switch and the
 * hreflang to disagree. Reading the page's own head is the smaller and safer
 * mechanism.
 *
 * ADDING A LANGUAGE.
 *
 * Nothing here changes. When a page starts emitting another `hrefLang`, this
 * renders it, provided the locale has a label below. That is the whole
 * extension model.
 */

/** What each locale is called, in its own language. */
const LOCALE_LABEL: Record<string, string> = {
  en: "English",
  "de-DE": "Deutsch",
  // Future locales need only a label here; nothing else in this file changes.
  es: "Español",
  fr: "Français",
  pt: "Português",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
};

export interface LocaleLink {
  locale: string;
  label: string;
  href: string;
  current: boolean;
}

/**
 * The locales this page is available in, read from the page itself.
 *
 * `x-default` is excluded deliberately: it is a routing hint for search
 * engines, not a language a reader can choose, and offering it would put the
 * same destination in the list twice.
 */
export function readLocaleLinks(doc: Document): LocaleLink[] {
  const current = doc.documentElement.lang || "en";
  const seen = new Set<string>();
  const links: LocaleLink[] = [];
  for (const el of Array.from(doc.querySelectorAll("link[rel='alternate'][hreflang]"))) {
    const locale = el.getAttribute("hreflang");
    const href = el.getAttribute("href");
    if (!locale || !href || locale === "x-default") continue;
    if (seen.has(locale)) continue;
    seen.add(locale);
    const label = LOCALE_LABEL[locale];
    if (!label) continue; // an unlabelled locale is not offered rather than shown raw
    links.push({ locale, label, href, current: locale === current });
  }
  return links;
}

export function LanguageSwitcher() {
  const [links, setLinks] = useState<LocaleLink[]>([]);

  useEffect(() => {
    setLinks(readLocaleLinks(document));
  }, []);

  /*
   * A single language is not a choice. A page with no translation renders no
   * control at all rather than a disabled or self-referential one — which is
   * also the negative guarantee the gates check: no page without a counterpart
   * may show a language action.
   */
  if (links.length < 2) return null;

  const currentLabel = links.find((l) => l.current)?.label;

  return (
    <nav aria-label="Language" className="shrink-0">
      {currentLabel ? (
        <span className="sr-only">Current language: {currentLabel}. </span>
      ) : null}
      <ul className="flex items-center gap-1.5 text-[13px]">
        {links.map((link) => (
          <li key={link.locale} className="flex items-center gap-1.5">
            {link.current ? (
              /*
                AT 320px THE CURRENT LANGUAGE IS A LABEL, NOT A CONTROL.
                Brand, navigation, this switch and search share one row, and
                rendering "English · Deutsch" pushed that row 11px past a 320px
                viewport on every page that has a translation — measured, not
                guessed. The label a reader cannot click is the one that gives
                way; it stays in the accessibility tree at every width, so the
                current language is still announced.
              */
              <span
                aria-current="true"
                className="hidden font-medium text-eco-900 min-[360px]:inline"
                lang={link.locale}
              >
                {link.label}
              </span>
            ) : (
              <a
                href={link.href}
                hrefLang={link.locale}
                lang={link.locale}
                className="inline-flex min-h-[32px] items-center rounded text-eco-600 underline decoration-eco-200 underline-offset-4 hover:text-eco-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
