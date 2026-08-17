import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
  //   25000 → ceil(73.5k/25000) = 3 workers (~3x the per-worker heap headroom)
  //   — tuned for the old 60 GB build container.
  //   45000 → 2 active gen workers (holds through ~90k pages). Set after the
  //   build machine became 8 cores / 16 GB and 3 workers SIGKILLed at
  //   "Generating static pages (0/73564)": the OOM is a worker START-UP spike
  //   (each child evaluating the ~21 MB data modules at once, stacked on the
  //   collect-page-data pool, which is sized by CPU count and briefly held
  //   ~7 GB total in an instrumented 16 GB run), not steady state (steady:
  //   ~1.1-1.6 GB per active worker, main ≤2.2 GB; observed combined peak
  //   7.4 GB → ~8.6 GB headroom). Fewer simultaneous cold-starts = smaller
  //   spike. Instrumented full-run: 1,078 s local (M-series), 80 pages/s gen.
  experimental: {
    // Cap the WHOLE jest-worker pool, not just the active static-gen workers.
    // Instrumented 16 GB runs show staticGenerationMinPagesPerWorker only
    // limits how many children actively render pages (2), while the pool
    // itself is sized from CPU count (9 children on a 10-core machine, ~7 on
    // the 8-core Vercel builder) and EVERY child evaluates the ~21 MB data
    // modules during "Collecting page data", holding ~0.8-1.6 GB each
    // afterwards. That pool — not the 2 active workers — is what OOM'd the
    // 16 GB build container even at minPagesPerWorker: 45000 (main build
    // d1ccef9 SIGKILLed at "Generating static pages (0/73564)").
    // cpus: 3 → pool of 3 children ≈ ≤5 GB worker RSS total + main ≈ well
    // inside 16 GB. Collect-page-data runs ~3x slower (seconds, not minutes);
    // static generation is unaffected (still 2 active workers via the
    // 45000 page floor below).
    cpus: 3,
    staticGenerationMinPagesPerWorker: 45000,
    memoryBasedWorkersCount: true,
    enablePrerenderSourceMaps: false,
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
