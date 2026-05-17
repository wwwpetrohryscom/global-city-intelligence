import { Card } from "@/components/ui/Card";

export interface OverviewCard {
  label: string;
  value: string;
  description?: string;
}

export function CountryOverviewCards({
  cards,
}: {
  cards: OverviewCard[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <li key={card.label}>
          <Card as="article" className="h-full">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">
              {card.value}
            </p>
            {card.description ? (
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {card.description}
              </p>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}
