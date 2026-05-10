import { Card } from "@/components/ui/Card";
import { generateSourceBlockIntro } from "@/lib/content/generators";
import type { DataSource } from "@/types";

export function SourceBlock({ sources }: { sources: DataSource[] }) {
  return (
    <Card as="section">
      <h2 className="text-xl font-semibold text-text-primary">Sources</h2>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        {generateSourceBlockIntro(sources)} Structured indicators on this page
        are directional and intended for orientation; verified datasets are
        being integrated and official sources should be used for critical
        decisions.
      </p>
      <ul className="mt-5 space-y-4">
        {sources.map((source) => (
          <li key={source.id}>
            <a
              className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
              href={source.url}
            >
              {source.organization}: {source.name}
            </a>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              {source.reliabilityNote}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
