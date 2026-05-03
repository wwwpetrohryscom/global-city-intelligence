import Link from "next/link";
import type { BreadcrumbItem } from "@/types";

export function BreadcrumbNav({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-text-secondary">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={item.href}>
              {isLast ? (
                <span aria-current="page" className="font-medium text-text-primary">
                  {item.name}
                </span>
              ) : (
                <Link className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline" href={item.href}>
                  {item.name}
                </Link>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
