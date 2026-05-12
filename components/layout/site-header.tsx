import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { Container } from "@/components/layout/Container";
import { staticRoutes } from "@/lib/seo/routes";

const navItems = [
  { href: staticRoutes.cities, label: "Cities" },
  { href: staticRoutes.countries, label: "Countries" },
  { href: staticRoutes.rankings, label: "Rankings" },
  { href: staticRoutes.methodology, label: "Methodology" },
  { href: staticRoutes.dataSources, label: "Data Sources" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex items-center justify-between gap-5 py-4">
        <BrandMark size="md" />
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition duration-150 hover:bg-orange-50 hover:text-text-primary focus-visible:bg-orange-50"
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
