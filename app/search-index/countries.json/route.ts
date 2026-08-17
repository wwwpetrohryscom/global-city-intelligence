import { buildCountryIndex } from "@/lib/search/build-index";

// Materialised at build time into a plain static file at
// /search-index/countries.json — same mechanism as app/sitemap.xml/route.ts.
// No runtime execution, so this adds zero Functions and zero Edge Functions.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(JSON.stringify(buildCountryIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Content is fixed for the lifetime of a deploy and every deploy is
      // atomic, so it can be cached hard at the edge without ever going stale.
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
