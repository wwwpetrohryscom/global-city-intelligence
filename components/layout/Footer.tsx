import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { getCities, getRankings } from "@/lib/data/queries";
import { cityRoute, rankingRoute, staticRoutes } from "@/lib/seo/routes";

export function Footer() {
  const cities = getCities().slice(0, 4);
  const rankings = getRankings().slice(0, 4);

  return (
    <footer className="border-t border-neutral-border bg-white text-text-primary">
      <Container className="grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold">Global City Intelligence</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
            A server-rendered city intelligence platform for comparing
            affordability, clean air, energy readiness, and resilience.
          </p>
        </div>
        <nav aria-label="Footer city links">
          <p className="text-sm font-semibold text-text-primary">Cities</p>
          <ul className="mt-3 space-y-2 text-sm">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link className="text-text-secondary hover:text-text-primary" href={cityRoute(city.slug)}>
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer SEO links">
          <p className="text-sm font-semibold text-text-primary">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="text-text-secondary hover:text-text-primary" href={staticRoutes.methodology}>
                Methodology
              </Link>
            </li>
            <li>
              <Link className="text-text-secondary hover:text-text-primary" href={staticRoutes.dataSources}>
                Data Sources
              </Link>
            </li>
            {rankings.map((ranking) => (
              <li key={ranking.slug}>
                <Link className="text-text-secondary hover:text-text-primary" href={rankingRoute(ranking.slug)}>
                  {ranking.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

export { Footer as SiteFooter };
