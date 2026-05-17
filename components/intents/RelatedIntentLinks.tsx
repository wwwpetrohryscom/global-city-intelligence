import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getCityIntentBySlug } from "@/lib/data/queries";
import { getCityIntentUrl } from "@/lib/seo/routes";
import type { CityIntentPage } from "@/types";

export function RelatedIntentLinks({
  cityName,
  intentPages,
}: {
  cityName: string;
  intentPages: CityIntentPage[];
}) {
  if (intentPages.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {intentPages.map((page) => {
        const intent = getCityIntentBySlug(page.intentSlug);
        if (!intent) {
          return null;
        }
        return (
          <li key={`${page.citySlug}-${page.intentSlug}`}>
            <Card as="article" className="h-full" interactive>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {intent.shortTitle}
              </p>
              <h3 className="mt-2 text-base font-semibold text-text-primary">
                <Link
                  className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                  href={getCityIntentUrl(page.citySlug, page.intentSlug)}
                >
                  {cityName} for {intent.shortTitle}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {page.summary}
              </p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
