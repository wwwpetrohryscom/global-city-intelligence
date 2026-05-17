interface HubNavItem {
  href: string;
  label: string;
}

export function CountryHubNavigation({
  items,
  label = "On this page",
}: {
  items: HubNavItem[];
  label?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={label}
      className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <a
              className="inline-flex items-center rounded-full border border-neutral-border bg-surface-soft px-3 py-1.5 font-medium text-text-secondary transition hover:border-brand-400 hover:bg-orange-50 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
