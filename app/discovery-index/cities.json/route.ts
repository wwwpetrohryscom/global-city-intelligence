import { buildDiscoveryIndex } from "@/lib/discovery/build-index";

// Materialised at build time into a plain static file at
// /discovery-index/cities.json. Fetched lazily by the City Finder the first
// time a visitor actually opens it, so the discovery index is never part of any
// other page's payload. Mirrors app/search-index/* exactly.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(buildDiscoveryIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
