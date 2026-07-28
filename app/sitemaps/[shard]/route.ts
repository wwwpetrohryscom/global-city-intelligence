import {
  getShardEntries,
  getSitemapShards,
  renderUrlset,
} from "@/lib/sitemap/shards";

// Each child sitemap is statically generated at build time: /sitemaps/<name>.xml
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): Array<{ shard: string }> {
  return getSitemapShards().map((s) => ({ shard: `${s.name}.xml` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shard: string }> },
): Promise<Response> {
  const { shard } = await params;
  const name = shard.replace(/\.xml$/, "");
  const entries = getShardEntries(name);
  if (!entries) {
    return new Response("Sitemap shard not found", { status: 404 });
  }
  return new Response(renderUrlset(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Shard XML is fixed at build time; the edge cache is deployment-scoped
      // (fresh deploys always serve fresh shards), so 24h s-maxage is safe and
      // avoids hourly origin re-pulls of the multi-MB module/phase shards.
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
