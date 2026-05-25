import Link from "next/link";

export interface MovingRelatedLink {
  label: string;
  href: string;
  description?: string;
}

export function MovingRelatedLinks({
  links,
}: {
  links: readonly MovingRelatedLink[];
}) {
  return (
    <ul className="mt-6 grid gap-3 text-sm md:grid-cols-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={link.href}
          >
            {link.label}
          </Link>
          {link.description ? (
            <span className="text-text-secondary">
              {" "}— {link.description}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
