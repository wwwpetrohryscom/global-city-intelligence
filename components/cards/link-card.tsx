import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Card interactive>
      <div aria-hidden="true" className="mb-4 h-1 w-8 rounded-full bg-brand-500" />
      <h3 className="text-lg font-semibold text-text-primary">
        <Link className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline" href={href}>
          {title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </Card>
  );
}
