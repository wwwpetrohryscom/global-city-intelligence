import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // The generated city datasets in lib/data are enormous (nearby-places.ts
  // alone is ~21MB). Running ESLint + the full tsc type-check inside
  // `next build` makes the Vercel build container run out of memory (the
  // worker is SIGKILLed during "Linting and checking validity of types").
  // Type-checking and linting are enforced separately via `npm run
  // typecheck` / `npm run lint` (locally and/or in CI), so it is safe to
  // skip them here and keep the production build within its memory budget.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Static-generation memory budget. The datasets are enormous and every
  // static-export worker materializes the full set (2,600+ cities x Phase A-F,
  // 18k+ nearby places, the ~180k-edge discovery graph, tens of thousands of FAQ
  // entries). On a high-core Vercel build machine Next spawns ~1 worker per core
  // (~30), each holding a full copy, and the 60 GB container is SIGKILLed (OOM) at
  // "Generating static pages (0/44555)". Cap the worker count so peak RAM stays in
  // budget: raising staticGenerationMinPagesPerWorker forces workers = ceil(pages/N)
  // (~5 for ~48k pages instead of ~30) deterministically, independent of Next's
  // per-worker memory estimate (which under-counts our heavy data modules).
  experimental: {
    staticGenerationMinPagesPerWorker: 10000,
    memoryBasedWorkersCount: true,
    enablePrerenderSourceMaps: false,
    webpackMemoryOptimizations: true,
  },
  async redirects() {
    return [
      { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap/xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap/", destination: "/sitemap.xml", permanent: true },
      { source: "/robots", destination: "/robots.txt", permanent: true },
    ];
  },
};

export default nextConfig;
