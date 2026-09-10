import type { Metadata, Viewport } from "next";
import { AnalyticsLoader } from "@/components/analytics/AnalyticsLoader";
import { AnalyticsPrompt } from "@/components/analytics/AnalyticsPreferences";
import { EcosystemBar } from "@/components/ecosystem/EcosystemBar";
import { Footer } from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { siteName } from "@/lib/seo/metadata";
import { siteUrl } from "@/lib/seo/routes";
import { websiteSchema } from "@/lib/seo/schema";
import "./globals.css";

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
    { media: "(prefers-color-scheme: dark)", color: "#172033" },
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
        <EcosystemBar />
        <SiteHeader />
        {children}
        {/*
          Asked after the content, never over it. A reader who ignores it stays
          UNDECIDED, and undecided means no measurement — so a blocking overlay
          would make silence worth something, which is the whole trick this
          product refuses.
        */}
        <AnalyticsPrompt />
        <Footer />
        {/*
          Renders nothing, and is the only route by which a third-party script
          can now reach this page.
          
          This replaced a <Script strategy="afterInteractive">, which baked the
          tag into all 84,836 static pages AND emitted a <link rel="preload"> —
          so a browser fetched webmasterid.com before any code had considered a
          preference, and the provider then minted a durable identifier and
          sent a page view. The request to a third party is itself the thing
          consent is about, so honouring Do Not Track after the fetch was too
          late to be the mechanism. See lib/analytics/tracker.ts.
        */}
        <AnalyticsLoader />
      </body>
    </html>
  );
}
