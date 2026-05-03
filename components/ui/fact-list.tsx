import { Card } from "@/components/ui/Card";

export function FactList({
  facts,
}: {
  facts: { label: string; value: string }[];
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {facts.map((fact) => (
        <Card as="div" className="p-4" key={fact.label}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {fact.label}
          </dt>
          <dd className="mt-1 text-base font-semibold text-text-primary">
            {fact.value}
          </dd>
        </Card>
      ))}
    </dl>
  );
}
