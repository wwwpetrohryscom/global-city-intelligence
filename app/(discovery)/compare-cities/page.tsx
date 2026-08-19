import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareCitiesClient } from "./CompareCitiesClient";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { staticBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createMetadata } from "@/lib/seo/metadata";
import { staticRoutes } from "@/lib/seo/routes";

const title = "Compare cities";
const description =
  "Compare up to four cities side by side across population, affordability, climate, safety, economy, education and healthcare using published Global City Intelligence data.";

/**
 * ROBOTS: deliberately noindex, follow.
 *
 * The page's content is determined entirely by a `?cities=` parameter, so its
 * indexable surface is either empty (no parameter) or one of ~10^13 possible
 * city combinations. Letting crawlers enumerate those is the faceted-indexation
 * explosion the SEO rules forbid, and the empty state has no standalone value
 * to rank. `follow` is kept so the outbound links to real city pages still pass
 * signal. It is therefore also absent from the sitemap by design.
 *
 * The curated, editorially written comparisons at /compare remain the indexable
 * comparison surface and are untouched by this page.
 */
export const metadata: Metadata = {
  ...createMetadata({ title, description, path: staticRoutes.compareCities }),
  robots: { index: false, follow: true },
};

export default function CompareCitiesPage() {
  const breadcrumbs = staticBreadcrumbs("Compare cities", staticRoutes.compareCities);

  return (
    <main>
      <PageHeader
        eyebrow="Compare"
        intro="Up to four cities, side by side, using the same published values as their own pages. Missing values are shown as “Not available” rather than estimated."
        title={title}
      />
      <Container className="pb-16">
        <BreadcrumbNav items={breadcrumbs} />
        <div className="mt-8">
          {/* useSearchParams opts its subtree out of prerendering; the static
              export needs this boundary to build. */}
          <Suspense
            fallback={
              <p className="text-sm text-text-secondary">Loading comparison…</p>
            }
          >
            <CompareCitiesClient />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
