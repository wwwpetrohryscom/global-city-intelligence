import type { DataSource } from "@/types";

export function TransportSourcesBlock({
  sources,
  lastVerified,
}: {
  sources: DataSource[];
  lastVerified?: string;
}) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Transport sources"
      className="rounded-2xl border border-neutral-border bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-text-primary">
        Transport sources
      </h3>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Each entry above is attributed to an official transport authority,
        national operator, airport publisher, or government source. Confirm
        current information directly with these publishers.
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        {sources.map((source) => (
          <li key={source.id}>
            <a
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={source.url}
              rel="noreferrer"
              target="_blank"
            >
              {source.organization}: {source.name}
            </a>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {source.reliabilityNote}
            </p>
          </li>
        ))}
      </ul>
      {lastVerified ? (
        <p className="mt-4 text-xs uppercase tracking-wide text-text-secondary">
          Last verified: {lastVerified}
        </p>
      ) : null}
    </section>
  );
}
