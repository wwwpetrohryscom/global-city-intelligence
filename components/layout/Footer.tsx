import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { Container } from "@/components/layout/Container";
import {
  FEATURED_CITIES,
  FEATURED_CITIES_HEADING,
  FEATURED_COUNTRIES,
  FEATURED_COUNTRIES_HEADING,
} from "@/lib/navigation/featured";
import { PLACES_PUBLIC, blogUrl, placesIndexUrl } from "@/lib/navigation/ecosystem";
import { PLACES_CITIES } from "@/lib/navigation/places";
import { publishedRankingsByTheme } from "@/lib/navigation/rankings-registry";
import { cityRoute, countryRoute, staticRoutes } from "@/lib/seo/routes";

/**
 * The site footer.
 *
 * TWO THINGS CHANGED HERE, both structural.
 *
 * 1. CITIES AND COUNTRIES ARE NOW CHOSEN. They used to be
 *    `getCities().slice(0, 5)` and `getCountries().slice(0, 5)` — the first
 *    rows of a generated corpus, which is how every page on the site came to
 *    advertise Ukraine, Montenegro, Bosnia and Herzegovina, North Macedonia
 *    and Albania as its five countries. They now come from an explicit,
 *    reviewed list in `lib/navigation/featured.ts`, and the headings say
 *    "Featured" so a short list is not mistaken for the directory.
 *
 * 2. EVERY PUBLISHED RANKING IS HERE. It used to be
 *    `getRankings().slice(0, 4)` — four of the thirteen ranking pages the site
 *    publishes, with no mechanism that would ever notice the other nine. The
 *    footer now projects the whole registry, grouped by theme, and
 *    `scripts/validate-navigation.mjs` fails the build if a published ranking
 *    is missing from it.
 *
 * It also no longer imports `lib/data`. Everything it renders is a literal in
 * `lib/navigation/*`, so the footer that appears on all 84,000 pages costs the
 * corpus nothing.
 */
export function Footer() {
  const rankingGroups = publishedRankingsByTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-eco-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F9FC_100%)] text-text-primary">
      <Container className="grid gap-x-8 gap-y-10 py-12 md:grid-cols-12">
        <div className="md:col-span-12 lg:col-span-3">
          <BrandMark size="md" tone="accent" />
          <p className="mt-4 max-w-md text-sm leading-6 text-text-secondary">
            A server-rendered city and country intelligence platform.
            Structured indicators across affordability, air quality, energy,
            resilience, public safety, and healthcare — attributed to official
            data sources.
          </p>
        </div>

        <FooterColumn className="md:col-span-4 lg:col-span-2" label={FEATURED_CITIES_HEADING}>
          {FEATURED_CITIES.map((city) => (
            <FooterLink href={cityRoute(city.slug)} key={city.slug}>
              {city.label}
            </FooterLink>
          ))}
          <FooterLink href={staticRoutes.cities}>All cities</FooterLink>
          <FooterLink href={staticRoutes.exploreCities}>City Finder</FooterLink>
        </FooterColumn>

        <FooterColumn className="md:col-span-4 lg:col-span-2" label={FEATURED_COUNTRIES_HEADING}>
          {FEATURED_COUNTRIES.map((country) => (
            <FooterLink href={countryRoute(country.slug)} key={country.slug}>
              {country.label}
            </FooterLink>
          ))}
          <FooterLink href={staticRoutes.countries}>All countries</FooterLink>
        </FooterColumn>

        <FooterColumn className="md:col-span-4 lg:col-span-2" label="Reference">
          <FooterLink href={staticRoutes.compare}>City comparisons</FooterLink>
          <FooterLink href={staticRoutes.arrival}>Arrival planning guides</FooterLink>
          <FooterLink href={staticRoutes.movingTo}>Moving to city guides</FooterLink>
          <FooterLink href={staticRoutes.visualGuides}>Visual city guides</FooterLink>
          <FooterLink href={staticRoutes.summerTravel}>Summer 2026 travel guides</FooterLink>
          <FooterLink href={staticRoutes.weekendTrips}>Weekend trip guides</FooterLink>
          <FooterLink href={staticRoutes.nearbyWeekendPlaces}>Nearby weekend places</FooterLink>
          <FooterLink href={staticRoutes.tools}>Tools and calculators</FooterLink>
          <FooterLink href={staticRoutes.costOfLivingCalculator}>Cost of living calculator</FooterLink>
          <FooterLink href={staticRoutes.travelBudgetCalculator}>Travel budget calculator</FooterLink>
          <FooterLink href={staticRoutes.relocationChecklist}>Relocation checklist</FooterLink>
        </FooterColumn>

        {/* GCI Media — a separate Netlify deployment served under /blog.
            Section hubs only, never article titles, so publishing an article
            never requires rebuilding this site. */}
        <FooterColumn className="md:col-span-4 lg:col-span-3" label="GCI Media">
          <FooterLink href={blogUrl()}>Blog home</FooterLink>
          <FooterLink href={blogUrl("/cities")}>City stories</FooterLink>
          <FooterLink href={blogUrl("/data")}>Data stories</FooterLink>
          <FooterLink href={blogUrl("/research")}>Research</FooterLink>
          <FooterLink href={blogUrl("/interviews")}>Interviews</FooterLink>
          <FooterLink href={blogUrl("/editorial-policy")}>Editorial policy</FooterLink>
        </FooterColumn>

        {/* GCI Places. Rendered only once Places is reachable on this domain —
            see PLACES_PUBLIC. Until then the footer shows nothing rather than
            a column of links that 404. */}
        {PLACES_PUBLIC ? (
          <FooterColumn className="md:col-span-4 lg:col-span-2" label="Places">
            <FooterLink href={placesIndexUrl()}>All places</FooterLink>
            {PLACES_CITIES.map((city) => (
              <FooterLink href={city.path} key={city.gciCitySlug}>
                {city.name}
              </FooterLink>
            ))}
          </FooterColumn>
        ) : null}

        <FooterColumn className="md:col-span-4 lg:col-span-2" label="Methodology and trust">
          <FooterLink href={staticRoutes.methodology}>Methodology</FooterLink>
          <FooterLink href={staticRoutes.dataSources}>Data sources</FooterLink>
          <FooterLink href={staticRoutes.ecosystem}>HELPERG ecosystem</FooterLink>
        </FooterColumn>

        {/* EVERY published ranking, grouped by the themes the registry defines.
            Not a top five, and not the four that happened to be hard-coded. */}
        <nav
          aria-label="Footer rankings links"
          className="md:col-span-12"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-eco-800">
              Rankings and shortlists
            </p>
            <Link
              className="text-sm text-text-secondary underline decoration-eco-300 underline-offset-4 transition hover:text-eco-800"
              href={staticRoutes.rankings}
            >
              All rankings
            </Link>
          </div>
          <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {rankingGroups.map((group) => (
              <div key={group.key}>
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  {group.label}
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  {group.entries.map((entry) => (
                    <FooterLink href={entry.route} key={entry.id}>
                      {entry.shortLabel}
                    </FooterLink>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-text-muted">
            Shortlists are curated city selections, not measured rankings.
            Scored rankings state their method and sources on their own page.
          </p>
        </nav>
      </Container>
      <div className="border-t border-neutral-border bg-white/80">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-text-muted">
          <span>© {currentYear} Global City Intelligence</span>
          <span>
            Structured indicators are directional. Always verify critical
            decisions through official sources.
          </span>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <nav aria-label={`Footer ${label.toLowerCase()} links`} className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-eco-800">
        {label}
      </p>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </nav>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        className="inline-flex min-h-[32px] items-center text-text-secondary transition hover:text-eco-800"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

export { Footer as SiteFooter };
