import { Card } from "@/components/ui/Card";

export interface VisualGuideOverviewCard {
  label: string;
  value: string;
  description: string;
}

export function VisualGuideOverviewCards({
  cards,
}: {
  cards: readonly VisualGuideOverviewCard[];
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <li key={card.label}>
          <Card as="article" className="h-full p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {card.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              {card.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {card.description}
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
