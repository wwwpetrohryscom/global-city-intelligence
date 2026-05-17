import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getCollectionIntentLabel } from "@/lib/data/queries";
import { getCollectionUrl } from "@/lib/seo/routes";
import type { CityCollection } from "@/types";

export function RelatedCollections({
  collections,
}: {
  collections: CityCollection[];
}) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection) => (
        <li key={collection.slug}>
          <Card as="article" interactive>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {getCollectionIntentLabel(collection.intent)}
            </p>
            <h3 className="mt-2 text-base font-semibold text-text-primary">
              <Link
                className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                href={getCollectionUrl(collection.slug)}
              >
                {collection.title}
              </Link>
            </h3>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {collection.description}
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
