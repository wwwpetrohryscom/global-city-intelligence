import Link from "next/link";
import { CITY_SECTIONS, type CitySectionAvailability, type CitySectionId } from "@/lib/discovery/city-sections";
import { RecordCityVisit } from "@/components/discovery/RecordCityVisit";

/**
 * Contextual navigation across one city's intelligence dimensions.
 *
 * SERVER COMPONENT: every tab is a real `<a>` in the static HTML, so the links
 * are crawlable and work with JavaScript disabled. Only the one-line visit
 * recorder below is a client component.
 *
 * NOT STICKY — by design. The layout already pins two layers (the ecosystem bar
 * at z-40 and the site header at z-30, composed via `--sticky-stack-height`). A
 * third would eat roughly a third of a 390px viewport and collide with the
 * search dialog, which positions itself against that same variable.
 *
 * Horizontal scrolling is confined to this strip (`overflow-x-auto`), so a
 * narrow screen never scrolls the page itself sideways.
 */
export function CityQuickNav({
  citySlug,
  cityName,
  current,
  availability,
}: {
  citySlug: string;
  cityName: string;
  /** The section this page IS, so it can be marked current rather than linked away. */
  current: CitySectionId;
  availability: CitySectionAvailability;
}) {
  const sections = CITY_SECTIONS.filter((section) => availability[section.id]);

  // One tab is not a navigator. If a city somehow publishes only its current
  // page, render nothing rather than a lone decorative chip.
  if (sections.length < 2) return null;

  return (
    <nav
      aria-label={`${cityName} intelligence sections`}
      className="border-b border-neutral-border bg-white"
    >
      <RecordCityVisit slug={citySlug} />
      <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isCurrent = section.id === current;
          return (
            <li className="shrink-0" key={section.id}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                aria-label={section.ariaLabel(cityName)}
                className={[
                  "inline-flex min-h-[44px] items-center whitespace-nowrap border-b-2 px-4 text-sm transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-500",
                  isCurrent
                    ? "border-brand-500 font-semibold text-text-primary"
                    : "border-transparent text-text-secondary hover:border-neutral-line hover:text-text-primary",
                ].join(" ")}
                href={section.href(citySlug)}
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
