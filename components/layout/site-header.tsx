import Link from "next/link";
import { BrandMark } from "@/components/layout/BrandMark";
import { Container } from "@/components/layout/Container";
import { staticRoutes } from "@/lib/seo/routes";

const navItems = [
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
    <header className="sticky top-0 z-30 border-b border-neutral-border bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur supports-[backdrop-filter]:bg-white/88">
      <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <BrandMark size="md" tone="accent" />
        <nav aria-label="Primary navigation" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <ul className="flex min-w-max items-center gap-1.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex min-h-10 items-center rounded-full px-3.5 py-2 text-sm font-medium text-text-secondary transition duration-150 hover:bg-brand-50 hover:text-text-primary focus-visible:bg-brand-50"
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
