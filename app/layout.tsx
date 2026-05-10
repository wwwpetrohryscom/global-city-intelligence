import type { Metadata, Viewport } from "next";
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
      </body>
    </html>
  );
}
