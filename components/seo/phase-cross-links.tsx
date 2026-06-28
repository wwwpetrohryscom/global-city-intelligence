import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { hasWeekendTripPage } from "@/lib/data/queries/weekend-trip";
import { hasNearbyWeekendPlacesCityPage } from "@/lib/data/queries/nearby-places";
import { hasVisualCityGuidePage } from "@/lib/data/queries/visual-guides";
import {
  cityRoute,
  nearbyWeekendPlacesCityRoute,
  visualCityGuideRoute,
  weekendTripRoute,
} from "@/lib/seo/routes";

/**
 * Deterministic "Related guides" cross-link block rendered at the foot of every
 * Phase A–F city page. It links the topic page back to the city's full profile
 * (where the AI-overview + FAQ live) and across to its travel/visual guides,
 * strengthening internal linking between same-city pages. Server-rendered; each
 * link is gated on the target page actually existing.
 */
export function PhaseCrossLinks({
  citySlug,
  cityName,
  currentDimension,
}: {
  citySlug: string;
  cityName: string;
  /** Label of the page this block sits on, so it can be skipped from the list. */
  currentDimension?: string;
}) {
  const links: { href: string; label: string; blurb: string }[] = [
    {
      href: cityRoute(citySlug),
      label: `${cityName} city profile`,
      blurb:
        "Full intelligence profile with quick answers, FAQs and every indexed dimension.",
    },
  ];
  if (hasWeekendTripPage(citySlug)) {
    links.push({
      href: weekendTripRoute(citySlug),
      label: `Weekend trips from ${cityName}`,
      blurb: "Curated nearby getaways and day trips within easy reach.",
    });
  }
  if (hasNearbyWeekendPlacesCityPage(citySlug)) {
    links.push({
      href: nearbyWeekendPlacesCityRoute(citySlug),
      label: `Nature near ${cityName}`,
      blurb: "Verified parks, lakes, coasts and uplands within ~170 km.",
    });
  }
  if (hasVisualCityGuidePage(citySlug)) {
    links.push({
      href: visualCityGuideRoute(citySlug),
      label: `${cityName} visual guide`,
      blurb: "A visual orientation to the city and its surroundings.",
    });
  }

  const visible = links.filter((l) => l.label !== currentDimension);
  if (visible.length === 0) return null;

  return (
    <section aria-labelledby="related-guides-heading">
      <SectionHeading
        description={`Keep exploring ${cityName} across the rest of the dataset — its full profile, travel guides and nearby nature.`}
        title="Related guides"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((l) => (
          <Link
            className="rounded-2xl border border-neutral-border bg-white p-5 transition-colors hover:border-brand-500"
            href={l.href}
            key={l.href}
          >
            <span className="block font-semibold text-text-primary">
              {l.label}
            </span>
            <span className="mt-2 block text-sm leading-6 text-text-secondary">
              {l.blurb}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
