import { buildCityIndex } from "@/lib/search/build-index";

// Materialised at build time into a plain static file at
// /search-index/cities.json. Fetched lazily by the client the first time a
// visitor actually interacts with search, so the ~4,400-city index is never
// part of any page's initial payload.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(buildCityIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
