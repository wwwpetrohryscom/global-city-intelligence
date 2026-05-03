import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { staticRoutes } from "@/lib/seo/routes";

const navItems = [
  { href: staticRoutes.rankings, label: "Rankings" },
  { href: staticRoutes.methodology, label: "Methodology" },
  { href: staticRoutes.dataSources, label: "Data Sources" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-border bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-5 py-4">
        <Link
          className="flex items-center gap-3 font-semibold text-text-primary"
          href={staticRoutes.home}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-sm font-bold text-text-primary shadow-sm">
            GCI
          </span>
          <span>Global City Intelligence</span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition duration-150 hover:bg-orange-50 hover:text-text-primary"
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
