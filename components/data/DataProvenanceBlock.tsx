import { Card } from "@/components/ui/Card";
import { DataVerificationBadge } from "@/components/data/DataVerificationBadge";
import { getSourcesByIds } from "@/lib/data/sources";
import { getOfficialDatasetById } from "@/lib/data/official/registry";
import type { DataProvenance } from "@/types";

export function DataProvenanceBlock({
  heading = "Data provenance",
  provenance,
}: {
  heading?: string;
  provenance: DataProvenance[];
}) {
  if (provenance.length === 0) {
    return null;
  }

  return (
    <Card as="section">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-primary">{heading}</h3>
        <span className="text-xs uppercase tracking-wide text-text-muted">
          Source attribution
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {provenance.map((entry) => {
          const dataset = getOfficialDatasetById(entry.datasetId);
          const sources = getSourcesByIds(entry.sourceIds);

          return (
            <li
              className="rounded-xl border border-neutral-border bg-surface-soft p-3.5"
              key={`${entry.datasetId}-${entry.sourceIds.join("-")}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-text-primary">
                  {dataset?.name ?? entry.datasetId}
                </p>
                <DataVerificationBadge status={entry.verificationStatus} />
              </div>
              <dl className="mt-2.5 grid gap-x-4 gap-y-1.5 text-xs text-text-secondary sm:grid-cols-2">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold uppercase tracking-wide text-text-muted">
                    Publisher
                  </dt>
                  <dd className="text-text-secondary">{entry.publisher}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold uppercase tracking-wide text-text-muted">
                    Last verified
                  </dt>
                  <dd className="text-text-secondary tabular-nums">
                    {entry.lastVerified}
                  </dd>
                </div>
                {entry.retrievedAt ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold uppercase tracking-wide text-text-muted">
                      Retrieved at
                    </dt>
                    <dd className="text-text-secondary tabular-nums">
                      {entry.retrievedAt}
                    </dd>
                  </div>
                ) : null}
                {entry.license ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold uppercase tracking-wide text-text-muted">
                      License
                    </dt>
                    <dd className="text-text-secondary">{entry.license}</dd>
                  </div>
                ) : null}
              </dl>
              {entry.transformationNotes ? (
                <p className="mt-2.5 text-xs leading-5 text-text-secondary">
                  {entry.transformationNotes}
                </p>
              ) : null}
              {sources.length > 0 ? (
                <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5">
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a
                        className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 underline-offset-2 hover:bg-orange-50"
                        href={source.url}
                      >
                        {source.organization}
                        <span className="ml-1 font-normal text-text-secondary">
                          {source.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
