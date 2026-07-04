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
