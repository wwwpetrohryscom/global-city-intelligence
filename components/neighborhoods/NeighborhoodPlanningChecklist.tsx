import type {
  NeighborhoodChecklistCategory,
  NeighborhoodChecklistItem,
} from "@/types";

interface NeighborhoodPlanningChecklistProps {
  items: readonly NeighborhoodChecklistItem[];
}

interface CategoryDefinition {
  category: NeighborhoodChecklistCategory;
  label: string;
  description: string;
}

const CATEGORY_ORDER: readonly CategoryDefinition[] = [
  {
    category: "daily_access",
    label: "Daily access",
    description:
      "Filter areas by your real daily-access pattern rather than a generic 'best area' search. Verify specific addresses and services locally.",
  },
  {
    category: "transport_fit",
    label: "Transport fit",
    description:
      "Use the platform's transport context and the official local transport authority. This guide does not publish routes, fares, schedules, or operator names.",
  },
  {
    category: "housing_research",
    label: "Housing research",
    description:
      "Lease, deposit, and registration requirements differ by city and country. Verify everything with the landlord, agent, or official local source — this guide is not legal or rental advice.",
  },
  {
    category: "safety_services",
    label: "Safety and public services",
    description:
      "Use the country emergency profile and official local government and police publishers. This guide does not publish crime rates or safety rankings.",
  },
  {
    category: "healthcare_family",
    label: "Healthcare and family",
    description:
      "Use the country healthcare profile and official local registries for schools, childcare, and family services. This guide does not publish school rankings.",
  },
  {
    category: "remote_work",
    label: "Remote work / daily productivity",
    description:
      "Use the city intelligence connectivity context for framing; verify individual building / address connectivity with the local provider.",
  },
  {
    category: "budget_planning",
    label: "Budget planning",
    description:
      "Use the cost-of-living calculator and travel budget calculator with your own inputs. Calculators are planning estimators only — not official cost measurements.",
  },
];

export function NeighborhoodPlanningChecklist({
  items,
}: NeighborhoodPlanningChecklistProps) {
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
            aria-labelledby={`neighborhood-checklist-${group.category}`}
            key={group.category}
          >
            <h3
              className="text-base font-semibold text-text-primary"
              id={`neighborhood-checklist-${group.category}`}
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
