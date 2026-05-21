import type { ArrivalChecklistCategory, ArrivalChecklistItem } from "@/types";

interface ArrivalChecklistProps {
  items: readonly ArrivalChecklistItem[];
}

interface CategoryDefinition {
  category: ArrivalChecklistCategory;
  label: string;
  description: string;
}

const CATEGORY_ORDER: readonly CategoryDefinition[] = [
  {
    category: "before",
    label: "Before arrival",
    description:
      "Review structured context for the city and country, and confirm documents with official sources before you travel.",
  },
  {
    category: "first_day",
    label: "First day planning",
    description:
      "Practical steps that reduce friction on the day you arrive and during the first night.",
  },
  {
    category: "transport",
    label: "Transport context",
    description:
      "Use the platform's verified mobility-authority context. Confirm routes, fares, and schedules through official authorities.",
  },
  {
    category: "safety",
    label: "Safety context",
    description:
      "Use the country emergency profile and official emergency-service publishers when verified records exist.",
  },
  {
    category: "healthcare",
    label: "Healthcare context",
    description:
      "Use the country healthcare profile and any verified hospital references. Confirm access with official sources.",
  },
  {
    category: "budget",
    label: "Budget planning",
    description:
      "Use the platform calculators with your own inputs. Calculators do not import live prices.",
  },
];

export function ArrivalChecklist({ items }: ArrivalChecklistProps) {
  return (
    <div className="space-y-8">
      {CATEGORY_ORDER.map((group) => {
        const groupItems = items.filter(
          (item) => item.category === group.category,
        );
        if (groupItems.length === 0) {
          return null;
        }
        return (
          <section
            aria-labelledby={`arrival-checklist-${group.category}`}
            key={group.category}
          >
            <h3
              className="text-base font-semibold text-text-primary"
              id={`arrival-checklist-${group.category}`}
            >
              {group.label}
            </h3>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {group.description}
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-2">
              {groupItems.map((item) => (
                <li
                  className="rounded-2xl border border-neutral-border bg-white p-4 shadow-sm"
                  key={item.label}
                >
                  <p className="text-sm font-semibold text-text-primary">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
