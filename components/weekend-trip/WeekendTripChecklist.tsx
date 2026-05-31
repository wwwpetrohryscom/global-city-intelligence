import type {
  WeekendTripChecklistCategory,
  WeekendTripChecklistItem,
} from "@/types";

interface WeekendTripChecklistProps {
  items: readonly WeekendTripChecklistItem[];
}

interface CategoryDefinition {
  category: WeekendTripChecklistCategory;
  label: string;
  description: string;
}

const CATEGORY_ORDER: readonly CategoryDefinition[] = [
  {
    category: "arrival_first_evening",
    label: "Arrival and first evening planning",
    description:
      "Set up your arrival address, offline maps, official transport sources, and backup payment / communication options before travel day.",
  },
  {
    category: "time_management",
    label: "Short-trip time management",
    description:
      "Plan a few unrushed anchors per day rather than a packed schedule. This guide does not publish itineraries, attraction rankings, or 'things to do' lists.",
  },
  {
    category: "budget_buffer",
    label: "Budget and trip buffer",
    description:
      "Use the platform calculators with your own inputs and keep an emergency buffer. Calculators are planning estimators only — not official cost measurements.",
  },
  {
    category: "transport_daily",
    label: "Transport and daily access",
    description:
      "Use the city transport context and the official local transport authority. This guide does not publish routes, fares, schedules, or operator names.",
  },
  {
    category: "healthcare_safety",
    label: "Healthcare and public safety",
    description:
      "Use the country healthcare access and emergency profiles, and the official local emergency service. This guide is not medical advice and does not publish crime rates or area safety rankings.",
  },
  {
    category: "visual_planning_links",
    label: "Visual orientation and planning links",
    description:
      "Where a visual guide, Summer 2026 travel guide, arrival guide, neighborhood guide, or moving-to guide is available for the city, open it alongside this checklist. Imagery is orientation, not evidence.",
  },
];

export function WeekendTripChecklist({ items }: WeekendTripChecklistProps) {
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
            aria-labelledby={`weekend-checklist-${group.category}`}
            key={group.category}
          >
            <h3
              className="text-base font-semibold text-text-primary"
              id={`weekend-checklist-${group.category}`}
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
