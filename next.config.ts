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
  // static-export worker materializes the full set (4,400+ cities x Phase A-F,
  // 32k+ nearby places, the discovery graphs, tens of thousands of FAQ entries).
  // On a high-core Vercel build machine Next spawns ~1 worker per core (~30), each
  // holding a full copy, and the 60 GB container is SIGKILLed (OOM). Cap the worker
  // count so peak RAM stays in budget: raising staticGenerationMinPagesPerWorker
  // forces workers = ceil(pages/N) deterministically, independent of Next's
  // per-worker memory estimate (which under-counts our heavy data modules).
  //   history: 10000 held ~7 workers for Wave 18's ~68k pages (fit, thin margin),
  //   but Wave 19 (~73.5k pages + larger data modules) → 8 workers OOM'd on Vercel.
  //   25000 → ceil(73.5k/25000) = 3 workers (~3x the per-worker heap headroom).
  experimental: {
    staticGenerationMinPagesPerWorker: 25000,
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
