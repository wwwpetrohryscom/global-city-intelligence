import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { Container } from "@/components/layout/Container";
import {
  getAllCollections,
  getCities,
  getCountries,
  getRankings,
} from "@/lib/data/queries";
import {
  cityRoute,
  countryRoute,
  getCollectionUrl,
  rankingRoute,
  staticRoutes,
} from "@/lib/seo/routes";

export function Footer() {
  const cities = getCities().slice(0, 5);
  const countries = getCountries().slice(0, 5);
  const rankings = getRankings().slice(0, 4);
  const collections = getAllCollections().slice(0, 5);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-border bg-surface text-text-primary">
      <Container className="grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <BrandMark size="md" />
          <p className="mt-4 max-w-md text-sm leading-6 text-text-secondary">
            A server-rendered city and country intelligence platform.
            Structured indicators across affordability, air quality, energy,
            resilience, public safety, and healthcare — attributed to official
            data sources.
          </p>
        </div>

        <FooterColumn label="Cities">
          <FooterLink href={staticRoutes.cities}>All cities</FooterLink>
          {cities.map((city) => (
            <FooterLink href={cityRoute(city.slug)} key={city.slug}>
              {city.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn label="Countries">
          <FooterLink href={staticRoutes.countries}>All countries</FooterLink>
          {countries.map((country) => (
            <FooterLink href={countryRoute(country.slug)} key={country.slug}>
              {country.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn label="Rankings">
          <FooterLink href={staticRoutes.rankings}>All rankings</FooterLink>
          {rankings.map((ranking) => (
            <FooterLink href={rankingRoute(ranking.slug)} key={ranking.slug}>
              {ranking.shortTitle}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn label="Best Cities">
          <FooterLink href={staticRoutes.collections}>All collections</FooterLink>
          {collections.map((collection) => (
            <FooterLink
              href={getCollectionUrl(collection.slug)}
              key={collection.slug}
            >
              {collection.shortTitle}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn label="Reference">
          <FooterLink href={staticRoutes.compare}>City comparisons</FooterLink>
          <FooterLink href={staticRoutes.arrival}>
            Arrival planning guides
          </FooterLink>
          <FooterLink href={staticRoutes.movingTo}>
            Moving to city guides
          </FooterLink>
          <FooterLink href={staticRoutes.tools}>Tools and calculators</FooterLink>
          <FooterLink href={staticRoutes.costOfLivingCalculator}>
            Cost of living calculator
          </FooterLink>
          <FooterLink href={staticRoutes.travelBudgetCalculator}>
            Travel budget calculator
          </FooterLink>
          <FooterLink href={staticRoutes.relocationChecklist}>
            Relocation checklist
          </FooterLink>
          <FooterLink href={staticRoutes.methodology}>Methodology</FooterLink>
          <FooterLink href={staticRoutes.dataSources}>Data sources</FooterLink>
        </FooterColumn>
      </Container>
      <div className="border-t border-neutral-border bg-surface-soft">
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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <nav aria-label={`Footer ${label.toLowerCase()} links`} className="md:col-span-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
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
        className="inline-flex text-text-secondary transition hover:text-brand-500"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

export { Footer as SiteFooter };
