import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { siteName } from "@/lib/seo/metadata";
import { siteUrl } from "@/lib/seo/routes";
import { websiteSchema } from "@/lib/seo/schema";
import "./globals.css";

const WEBMASTERID_SITE_ID = "wm_hmlk0yl01zarz1cc";
const WEBMASTERID_ENDPOINT =
  "https://webmasterid-ingest-api.vercel.app/api/events";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `${siteName} — global city and country intelligence`,
    template: `%s | ${siteName}`,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1B3D" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={websiteSchema()} />
        <SiteHeader />
        {children}
        <Footer />
        <Script
          data-endpoint={WEBMASTERID_ENDPOINT}
          data-wmid={WEBMASTERID_SITE_ID}
          id="webmasterid-tracker"
          src="https://webmasterid.com/tracker.iife.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
