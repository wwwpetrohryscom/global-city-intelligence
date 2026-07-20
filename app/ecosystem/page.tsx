import type { Metadata } from "next";
import {
  AppsGrid,
  FutureProductsNote,
  WebsitesGrid,
} from "@/components/ecosystem/EcosystemSections";
import { ExternalLinkIcon } from "@/components/ecosystem/icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  ECOSYSTEM_BRAND,
  ECOSYSTEM_SECTION_IDS,
  ecosystemApps,
  ecosystemCounts,
  ecosystemWebsites,
} from "@/lib/ecosystem/products";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";
import { breadcrumbSchema, webpageSchema } from "@/lib/seo/schema";

const title = "HELPERG Ecosystem — Websites and Mobile Apps";
const description =
  "Global City Intelligence is part of HELPERG. Browse every HELPERG website and mobile app in one place — analytics, finance, business, agriculture, astronomy and more, plus utility and productivity apps for iOS and Android.";

const breadcrumbs = staticBreadcrumbs(
  "HELPERG Ecosystem",
  staticRoutes.ecosystem,
);

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: staticRoutes.ecosystem,
});

/**
 * ItemList of every product, using each product's own canonical (external)
 * URL. Built inline rather than via `itemListSchema`, which would prefix the
 * site origin onto these off-site links.
 */
function ecosystemItemListSchema() {
  const websiteItems = ecosystemWebsites.map((website, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: website.name,
    url: website.url,
  }));
  const appItems = ecosystemApps.map((app, index) => ({
    "@type": "ListItem",
    position: ecosystemWebsites.length + index + 1,
    name: app.name,
    url: app.stores[0]?.url,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${ECOSYSTEM_BRAND.name} ecosystem`,
    description,
    numberOfItems: ecosystemWebsites.length + ecosystemApps.length,
    itemListElement: [...websiteItems, ...appItems],
  };
}

export default function EcosystemPage() {
  return (
    <main>
      <JsonLd
        data={webpageSchema({
          path: staticRoutes.ecosystem,
          title,
          description,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={ecosystemItemListSchema()} />

      <PageHeader
        eyebrow={`${ECOSYSTEM_BRAND.name} Ecosystem`}
        intro={description}
        title="Every HELPERG website and mobile app in one place"
      >
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Websites
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
              {ecosystemCounts.websites}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Mobile apps
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">
              {ecosystemCounts.apps}
            </dd>
          </div>
        </dl>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbs} />

        <section id={ECOSYSTEM_SECTION_IDS.websites}>
          <SectionHeading
            description={`The ${ecosystemCounts.websites} websites in the HELPERG family. Each opens in a new tab.`}
            title="Websites"
          />
          <div className="mt-6">
            <WebsitesGrid />
          </div>
        </section>

        <section id={ECOSYSTEM_SECTION_IDS.apps}>
          <SectionHeading
            description={`The ${ecosystemCounts.apps} HELPERG mobile apps, with links to their App Store and Google Play listings.`}
            title="Mobile apps"
          />
          <div className="mt-6">
            <AppsGrid />
          </div>
        </section>

        <section id={ECOSYSTEM_SECTION_IDS.future}>
          <SectionHeading
            description="New HELPERG websites and apps will appear here as they launch."
            title="Future products"
          />
          <div className="mt-6">
            <FutureProductsNote />
          </div>
        </section>

        <section className="rounded-[1.45rem] border border-neutral-border/80 bg-surface-warm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text-primary">
            About the HELPERG ecosystem
          </h2>
          <p className="mt-3 max-w-[70ch] leading-7 text-text-secondary">
            HELPERG builds independent websites and mobile applications across a
            range of topics. Global City Intelligence is one of them. Each
            product is operated on its own domain; this page is a directory of
            the family, not a single combined service.
          </p>
          <a
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-eco-200 bg-eco-50 px-4 py-2 text-sm font-semibold text-eco-700 transition hover:border-eco-400 hover:bg-eco-100"
            href={ECOSYSTEM_BRAND.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Visit {ECOSYSTEM_BRAND.name}
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </section>
      </div>
    </main>
  );
}
