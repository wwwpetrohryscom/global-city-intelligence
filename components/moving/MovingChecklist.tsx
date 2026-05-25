import type {
  MovingChecklistCategory,
  MovingChecklistItem,
} from "@/types";

interface MovingChecklistProps {
  items: readonly MovingChecklistItem[];
}

interface CategoryDefinition {
  category: MovingChecklistCategory;
  label: string;
  description: string;
}

const CATEGORY_ORDER: readonly CategoryDefinition[] = [
  {
    category: "legal_official",
    label: "Legal and official requirements",
    description:
      "Find the official immigration, residency, registration, and tax publishers. Verify everything directly — this guide is not legal, immigration, or tax advice.",
  },
  {
    category: "housing",
    label: "Housing research",
    description:
      "Compare neighborhoods through planning criteria and verify lease, deposit, and registration requirements with the landlord, agent, or official local source. Not legal or rental advice; no rent prices or 'best' / 'safest' / 'cheapest' area claims.",
  },
  {
    category: "cost_planning",
    label: "Cost planning",
    description:
      "Use the cost-of-living calculator and travel budget calculator with your own inputs. Calculators are planning estimators only — not official cost measurements.",
  },
  {
    category: "arrival",
    label: "Arrival and first week",
    description:
      "Use the structured arrival guide where available and save key official sources offline. Confirm arrival address, route, and backup options before you travel.",
  },
  {
    category: "healthcare_safety",
    label: "Healthcare and public safety",
    description:
      "Use the country healthcare and emergency profiles, and the official local emergency service. This guide does not publish crime rates, hospital proximities, or area safety rankings.",
  },
  {
    category: "transport_daily",
    label: "Transport and daily access",
    description:
      "Use the city transport context and the official local transport authority. This guide does not publish routes, fares, schedules, or operator names.",
  },
  {
    category: "work_study_family",
    label: "Work, study, and family routines",
    description:
      "Confirm employer, school, and family-service requirements with the official local authority. School and childcare research uses official local registries, not third-party rankings.",
  },
];

export function MovingChecklist({ items }: MovingChecklistProps) {
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
            aria-labelledby={`moving-checklist-${group.category}`}
            key={group.category}
          >
            <h3
              className="text-base font-semibold text-text-primary"
              id={`moving-checklist-${group.category}`}
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
