import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/routes";
import { PROXIED_SITEMAPS } from "@/lib/navigation/ecosystem";

export const dynamic = "force-static";

/**
 * robots.txt for the canonical domain.
 *
 * IT MUST ADVERTISE ALL THREE SITEMAPS, not just this application's.
 *
 * One domain is served by three independent deployments. This build knows
 * about its own 84,833 URLs; the other two products publish their own sitemaps
 * inside the namespaces they own, at /blog/sitemap.xml and /places/sitemap.xml.
 * Both are reachable on this domain through the proxy — and neither was
 * discoverable, because robots.txt named only this one and nothing links to
 * them. Around 1,000 Places URLs and every article had no sitemap a crawler
 * could find.
 *
 * The sitemaps are declared here rather than fetched or generated: this build
 * must not depend on another deployment being up, and a proxied sitemap is
 * simply a URL on this domain. Their existence is asserted against the emitted
 * artifact by `scripts/validate-proxy-routes.mjs`.
 *
 * Every entry is a canonical-domain URL. A robots.txt pointing at a
 * *.netlify.app origin would hand crawlers the infrastructure hostname and
 * invite exactly the duplicate indexing the origins' own robots.txt files
 * exist to prevent.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      ...PROXIED_SITEMAPS.map((path) => absoluteUrl(path)),
    ],
  };
}
