import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { Container } from "@/components/layout/Container";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { staticRoutes } from "@/lib/seo/routes";

const navItems = [
  { href: staticRoutes.exploreCities, label: "Find a city" },
  { href: staticRoutes.cities, label: "Cities" },
  { href: staticRoutes.countries, label: "Countries" },
  { href: staticRoutes.rankings, label: "Rankings" },
  { href: staticRoutes.compare, label: "Compare" },
  { href: staticRoutes.collections, label: "Best Cities" },
  { href: staticRoutes.methodology, label: "Methodology" },
  { href: staticRoutes.dataSources, label: "Data Sources" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-[var(--ecosystem-bar-height)] z-30 border-b border-eco-100 bg-white/95 shadow-[0_1px_0_rgba(23,32,51,0.02)] backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <BrandMark size="md" tone="accent" />
        {/* DOM order is brand → search → nav, so on mobile (column layout)
            search sits directly under the logo and is immediately visible
            without displacing the brand. On desktop it is pulled to the end of
            the row so the nav keeps the centre. */}
        <div className="w-full lg:order-last lg:w-auto">
          <GlobalSearch />
        </div>
        <nav aria-label="Primary navigation" className="primary-nav-scroll -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <ul className="flex min-w-max items-center gap-1.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-10 items-center rounded-xl px-3.5 py-2 text-sm font-medium text-text-secondary transition duration-150 hover:bg-eco-50 hover:text-eco-800 focus-visible:bg-eco-50"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
