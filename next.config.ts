import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
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
