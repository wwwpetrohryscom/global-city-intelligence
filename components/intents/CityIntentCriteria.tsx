import { Card } from "@/components/ui/Card";
import { getSourcesByIds } from "@/lib/data/sources";
import type { CityIntentCriterion } from "@/types";

export function CityIntentCriteria({
  criteria,
  criteriaNotes,
}: {
  criteria: CityIntentCriterion[];
  criteriaNotes: Record<string, string>;
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {criteria.map((criterion) => {
        const sources = criterion.sourceIds
          ? getSourcesByIds(criterion.sourceIds)
          : [];
        const note = criteriaNotes[criterion.key];

        return (
          <li key={criterion.key}>
            <Card as="article" className="h-full">
              <h3 className="text-base font-semibold text-text-primary">
                {criterion.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {criterion.explanation}
              </p>
              {note ? (
                <p className="mt-3 text-sm leading-6 text-text-primary">
                  {note}
                </p>
              ) : null}
              {sources.length > 0 ? (
                <p className="mt-3 text-xs leading-5 text-text-muted">
                  Reference context:{" "}
                  {sources.map((source, index) => (
                    <span key={source.id}>
                      <a
                        className="font-medium text-text-secondary underline decoration-brand-500 decoration-2"
                        href={source.url}
                      >
                        {source.organization}
                      </a>
                      {index < sources.length - 1 ? "; " : ""}
                    </span>
                  ))}
                </p>
              ) : null}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
