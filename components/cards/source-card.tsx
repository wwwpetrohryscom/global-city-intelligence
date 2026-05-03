import { Card } from "@/components/ui/Card";
import type { DataSource } from "@/types";

export function SourceCard({ source }: { source: DataSource }) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        {source.organization}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-text-primary">
        <a className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline" href={source.url}>
          {source.name}
        </a>
      </h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        {source.description}
      </p>
      <p className="mt-3 border-l-2 border-brand-500 pl-3 text-sm leading-6 text-text-secondary">
        {source.reliabilityNote}
      </p>
    </Card>
  );
}
