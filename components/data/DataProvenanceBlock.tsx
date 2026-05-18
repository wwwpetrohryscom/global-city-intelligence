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
      <h3 className="text-lg font-semibold text-text-primary">{heading}</h3>
      <ul className="mt-4 space-y-4">
        {provenance.map((entry) => {
          const dataset = getOfficialDatasetById(entry.datasetId);
          const sources = getSourcesByIds(entry.sourceIds);

          return (
            <li
              className="rounded-xl border border-neutral-border bg-surface-soft p-4"
              key={`${entry.datasetId}-${entry.sourceIds.join("-")}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-text-primary">
                  {dataset?.name ?? entry.datasetId}
                </p>
                <DataVerificationBadge status={entry.verificationStatus} />
              </div>
              <dl className="mt-3 grid gap-2 text-xs text-text-secondary sm:grid-cols-2">
                <div>
                  <dt className="font-semibold uppercase tracking-wide">
                    Publisher
                  </dt>
                  <dd className="mt-1">{entry.publisher}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wide">
                    Last verified
                  </dt>
                  <dd className="mt-1">{entry.lastVerified}</dd>
                </div>
                {entry.retrievedAt ? (
                  <div>
                    <dt className="font-semibold uppercase tracking-wide">
                      Retrieved at
                    </dt>
                    <dd className="mt-1">{entry.retrievedAt}</dd>
                  </div>
                ) : null}
                {entry.license ? (
                  <div>
                    <dt className="font-semibold uppercase tracking-wide">
                      License
                    </dt>
                    <dd className="mt-1">{entry.license}</dd>
                  </div>
                ) : null}
              </dl>
              {entry.transformationNotes ? (
                <p className="mt-3 text-xs leading-5 text-text-secondary">
                  {entry.transformationNotes}
                </p>
              ) : null}
              {sources.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs leading-5">
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a
                        className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                        href={source.url}
                      >
                        {source.organization}: {source.name}
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
