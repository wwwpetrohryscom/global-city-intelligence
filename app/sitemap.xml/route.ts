import { getSitemapShards, renderSitemapIndex } from "@/lib/sitemap/shards";

// Statically generated at build time; served as /sitemap.xml (the sitemap index).
export const dynamic = "force-static";

export function GET(): Response {
  const xml = renderSitemapIndex(getSitemapShards());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
