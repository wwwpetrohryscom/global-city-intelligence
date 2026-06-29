import { SectionHeading } from "@/components/ui/section-heading";
import type { FaqItem } from "@/types/faq";

/**
 * City FAQ block — server-rendered native <details> accordion (no client JS, fully
 * crawlable) with FAQPage structured data. Questions/answers are generated
 * deterministically from the city's indexed Phase A–F data + nearby nature.
 */
export function FaqSection({
  cityName,
  items,
}: {
  cityName: string;
  items: readonly FaqItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading">
      <SectionHeading
        description={`Common questions about living in, visiting, working in, studying in and retiring to ${cityName}, answered from the indexed cost-of-living, climate, safety, economy, education, healthcare and nearby-nature data on this profile.`}
        title={`${cityName} FAQ`}
      />
      <h2 className="sr-only" id="faq-heading">
        Frequently asked questions about {cityName}
      </h2>
      <div className="mt-6 divide-y divide-neutral-border rounded-2xl border border-neutral-border bg-white">
        {items.map((item) => (
          <details className="group p-5" key={item.question}>
            <summary className="cursor-pointer list-none text-base font-semibold text-text-primary marker:hidden">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
