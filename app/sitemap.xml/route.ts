import { getSitemapShards, renderSitemapIndex } from "@/lib/sitemap/shards";

// Statically generated at build time; served as /sitemap.xml (the sitemap index).
export const dynamic = "force-static";

export function GET(): Response {
  const xml = renderSitemapIndex(getSitemapShards());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Sitemap content is fixed at build time and Vercel's edge cache is
      // deployment-scoped (a new deploy always serves fresh XML), so a long
      // s-maxage can never serve a stale sitemap across deploys. 24h at the
      // edge avoids re-pulling multi-MB XML from origin on every crawler poll.
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
