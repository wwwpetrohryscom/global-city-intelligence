import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DATA_YEAR, LAST_UPDATED } from "@/lib/data/constants";
import {
  getAllThematicCollections,
  getThemeLabel,
} from "@/lib/data/queries";
import { thematicCollectionBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes, thematicCollectionRoute } from "@/lib/seo/routes";
import {
  breadcrumbSchema,
  itemListSchema,
  webpageSchema,
} from "@/lib/seo/schema";
import type { ThemeType } from "@/types";

const title = "Thematic Discovery Collections: Nature by Theme";
const description =
  "Discover nature and the outdoors by theme — mountain escapes, lake escapes, coastal landscapes, forest walks, national park weekends, waterfall destinations, alpine, Nordic, and Mediterranean nature, and more. Theme-first collections of nearby places and cities, derived deterministically from existing data — not tourism rankings.";

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.thematicCollections,
});

const THEME_ORDER: ThemeType[] = [
  "mountain_escapes",
  "alpine_landscapes",
  "lake_escapes",
  "great_lakes_nature",
  "coastal_landscapes",
  "mediterranean_nature",
  "atlantic_coast_nature",
  "island_getaways",
  "forest_walks",
  "river_valleys",
  "waterfall_destinations",
  "wetlands_marshes",
  "volcanic_landscapes",
  "national_park_weekends",
  "protected_landscapes",
  "wildlife_areas",
  "nordic_nature",
  "cross_border_nature_areas",
  "hiking_areas",
  "cycling_friendly_areas",
  "sunrise_viewpoints",
  "nature_photography_spots",
  "family_outdoor_escapes",
  "weekend_nature_retreats",
  "unesco_nature_areas",
  "scenic_drives",
  "rural_countryside_escapes",
  "safest_cities",
  "family_friendly_cities",
  "digital_nomad_cities",
  "retirement_friendly_cities",
  "high_quality_of_life_cities",
  "technology_cities",
  "startup_cities",
  "business_hubs",
  "remote_work_cities",
  "finance_centers",
  "manufacturing_cities",
  "research_cities",
  "tourism_economies",
  "government_centers",
  "innovation_cities",
];

export default function ThematicCollectionsIndexPage() {
  const collections = getAllThematicCollections();
  const breadcrumbs = thematicCollectionBreadcrumbs();

  const totalCities = new Set(collections.flatMap((c) => c.cities)).size;
  const totalPlaces = new Set(collections.flatMap((c) => c.nearbyPlaces)).size;

  const byTheme = THEME_ORDER.map((t) => ({
    themeType: t,
    label: getThemeLabel(t),
    items: collections
      .filter((c) => c.themeType === t)
      .slice()
      .sort((a, b) => b.nearbyPlaces.length - a.nearbyPlaces.length),
  })).filter((g) => g.items.length > 0);

  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.thematicCollections,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={itemListSchema({
          name: title,
          description,
          items: collections.map((c) => ({
            name: c.title,
            path: thematicCollectionRoute(c.slug),
          })),
        })}
      />

      <PageHeader eyebrow="Themes" intro={description} title={title}>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Collections
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {collections.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Themes
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {byTheme.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Cities linked
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {totalCities}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Nearby places linked
            </dt>
            <dd className="mt-1 text-lg font-semibold text-text-primary">
              {totalPlaces}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <Container className="space-y-12 py-12">
        <BreadcrumbNav items={breadcrumbs} />

        <p className="max-w-3xl text-sm leading-6 text-text-secondary">
          A theme-first companion to the regional collections: the same cities
          and nearby places, grouped by outdoor interest. Generated
          deterministically from place categories and Wikidata classifications —
          not popularity, rankings, or &quot;best&quot; lists. Data year{" "}
          {DATA_YEAR}; last updated {LAST_UPDATED}.
        </p>

        {byTheme.map((group) => (
          <section aria-labelledby={`g-${group.themeType}`} key={group.themeType}>
            <SectionHeading
              description={`${group.items.length} ${group.label.toLowerCase()} collections.`}
              title={group.label}
            />
            <h2 className="sr-only" id={`g-${group.themeType}`}>
              {group.label}
            </h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((collection) => (
                <li key={collection.slug}>
                  <Card as="article" className="h-full">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                      {`${group.label} · ${collection.nearbyPlaces.length} places · ${collection.cities.length} cities`}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-text-primary">
                      <Link
                        className="decoration-brand-500 decoration-2 underline-offset-4 hover:underline"
                        href={thematicCollectionRoute(collection.slug)}
                      >
                        {collection.title}
                      </Link>
                    </h3>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </main>
  );
}
