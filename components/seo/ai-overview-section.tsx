import { SectionHeading } from "@/components/ui/section-heading";
import type { AiOverviewItem } from "@/types/faq";

/**
 * Answer-first Q&A block optimised for Google AI Overview / featured snippets.
 * Each answer leads with a concise, evidence-based response (≈40–80 words) and
 * is mirrored into FAQPage structured data. Fully server-rendered (crawlable).
 */
export function AiOverviewSection({
  cityName,
  items,
}: {
  cityName: string;
  items: readonly AiOverviewItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="ai-overview-heading">
      <SectionHeading
        description={`Quick, evidence-based answers about ${cityName} drawn from this profile's indexed cost, climate, safety, economy, education, healthcare and nearby-nature data. Figures are deterministic estimates for orientation — verify specifics with official sources.`}
        title="Quick answers"
      />
      <h2 className="sr-only" id="ai-overview-heading">
        Quick answers about {cityName}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            className="rounded-2xl border border-neutral-border bg-surface-soft p-5"
            key={item.question}
          >
            <h3 className="text-base font-semibold text-text-primary">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
