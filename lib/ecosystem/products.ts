/**
 * HELPERG ecosystem — single canonical product registry.
 *
 * This is the ONLY place product data lives. The ecosystem bar, the drawer,
 * and the dedicated `/ecosystem` page all read from here, so a product is
 * added, renamed, or re-linked in exactly one file (no duplicated lists).
 *
 * Taglines are short, factual descriptions of what each product is — no
 * statistics, no "used by millions" claims, no marketing superlatives. Keep
 * them that way when editing.
 */

/**
 * Client-safe route constants.
 *
 * Client components (the bar, the drawer, the product cards) must NEVER import
 * `@/lib/seo/routes`, because that module top-level-imports the full city-data
 * layer (`@/lib/data/queries` → ~21 MB of generated data). Pulling that into a
 * client component drags the entire dataset into the browser bundle on every
 * page and breaks the production client build. These plain string constants let
 * client components link to the ecosystem/home routes with zero heavy imports.
 * `lib/seo/routes.ts` re-exports ECOSYSTEM_PATH as `staticRoutes.ecosystem`, so
 * the path is still defined exactly once, here.
 */
export const ECOSYSTEM_PATH = "/ecosystem";
export const HOME_PATH = "/";

/** The umbrella brand shown on the left of the ecosystem bar. */
export const ECOSYSTEM_BRAND = {
  name: "HELPERG",
  /** Shown as the bar's subtitle. */
  tagline: "Products. Apps. Platforms.",
  /** Marketing/company hub. */
  url: "https://helperg.com",
} as const;

export interface EcosystemWebsite {
  name: string;
  /** Canonical, absolute product URL. */
  url: string;
  /** One-line, factual description of the product's domain. */
  tagline: string;
  /** Short category label used for the pill/eyebrow. */
  category: string;
  /**
   * Marks the site the user is currently on (Global City Intelligence).
   * The card is rendered as "You are here" and links to the local home page
   * instead of opening a new tab to itself.
   */
  current?: boolean;
  /** Marks the umbrella company hub (HELPERG) for slightly emphasised styling. */
  hub?: boolean;
}

export type StorePlatform = "app-store" | "google-play";

export interface EcosystemAppStore {
  platform: StorePlatform;
  url: string;
}

export interface EcosystemApp {
  name: string;
  /** One-line, factual description of what the app does. */
  tagline: string;
  category: string;
  stores: EcosystemAppStore[];
}

/** Human label for a store platform. */
export const STORE_LABELS: Record<StorePlatform, string> = {
  "app-store": "App Store",
  "google-play": "Google Play",
};

/**
 * Every HELPERG website. Order is intentional: the current site and the
 * company hub are grouped at the end so the visitor's own site is easy to
 * find and the umbrella brand reads as the "home" of the family.
 */
export const ecosystemWebsites: EcosystemWebsite[] = [
  {
    name: "WebmasterID",
    url: "https://webmasterid.com",
    tagline: "Privacy-first website analytics",
    category: "Analytics",
  },
  {
    name: "Cash Workspace",
    url: "https://cashworkspace.com",
    tagline: "Finance and accounting workspace",
    category: "Finance",
  },
  {
    name: "GeoBusinessIQ",
    url: "https://geobusinessiq.com",
    tagline: "Local business intelligence",
    category: "Business",
  },
  {
    name: "TalentPartnerID",
    url: "https://talentpartnerid.com",
    tagline: "Recruiting and talent tools",
    category: "Recruiting",
  },
  {
    name: "HRHelperG",
    url: "https://hrhelperg.com",
    tagline: "Human-resources toolkit",
    category: "HR",
  },
  {
    name: "Twin Phone",
    url: "https://twin-phone.com",
    tagline: "Phone and communication utilities",
    category: "Communication",
  },
  {
    name: "SocialSportHub",
    url: "https://socialsporthub.com",
    tagline: "Sports community hub",
    category: "Sports",
  },
  {
    name: "AgricultureID",
    url: "https://agricultureid.com",
    tagline: "Agriculture reference platform",
    category: "Agriculture",
  },
  {
    name: "AsteriaStar",
    url: "https://asteriastar.com",
    tagline: "Astronomy data platform",
    category: "Astronomy",
  },
  {
    name: "FaunaHub",
    url: "https://faunahub.com",
    tagline: "Wildlife and animal reference",
    category: "Wildlife",
  },
  {
    name: "BuildDesignHub",
    url: "https://builddesignhub.com",
    tagline: "Architecture and design resources",
    category: "Design",
  },
  {
    name: "PrinterArchive",
    url: "https://printerarchive.net",
    tagline: "Printer drivers and support archive",
    category: "Printing",
  },
  {
    name: "Virtue & Power",
    url: "https://virtueandpower.com",
    tagline: "Essays on ethics and leadership",
    category: "Ideas",
  },
  {
    name: "Global City Intelligence",
    url: "https://globalcityintelligence.com",
    tagline: "City and country intelligence",
    category: "Cities",
    current: true,
  },
  {
    name: "Petro Hrys",
    url: "https://petrohrys.com",
    tagline: "Personal site and portfolio",
    category: "Portfolio",
  },
  {
    name: "HELPERG",
    url: "https://helperg.com",
    tagline: "The HELPERG product family",
    category: "Company",
    hub: true,
  },
];

/**
 * Every HELPERG mobile application. Some apps ship on a single platform;
 * the `stores` array only lists the platforms that actually exist so the UI
 * never renders a link to a store page that isn't there.
 */
export const ecosystemApps: EcosystemApp[] = [
  {
    name: "ZIP",
    tagline: "Archive and extract ZIP files",
    category: "Utilities",
    stores: [
      {
        platform: "google-play",
        url: "https://play.google.com/store/apps/details?id=com.ziparchivator.zip&pcampaignid=web_share",
      },
      { platform: "app-store", url: "https://apps.apple.com/app/id6753772583" },
    ],
  },
  {
    name: "Printer",
    tagline: "Mobile smart printing",
    category: "Utilities",
    stores: [
      {
        platform: "google-play",
        url: "https://play.google.com/store/apps/details?id=com.helperg.smart.printer",
      },
      { platform: "app-store", url: "https://apps.apple.com/app/id6746067890" },
    ],
  },
  {
    name: "Fax",
    tagline: "Send faxes from your phone",
    category: "Utilities",
    stores: [
      {
        platform: "google-play",
        url: "https://play.google.com/store/apps/details?id=com.helperg.fax.app&pcampaignid=web_share",
      },
      { platform: "app-store", url: "https://apps.apple.com/app/id6760895885" },
    ],
  },
  {
    name: "PDF Editor",
    tagline: "Edit and annotate PDFs",
    category: "Documents",
    stores: [
      {
        platform: "google-play",
        url: "https://play.google.com/store/apps/details?id=com.helperg.editor.documents&pcampaignid=web_share",
      },
      { platform: "app-store", url: "https://apps.apple.com/app/id6747341672" },
    ],
  },
  {
    name: "CV Resume Builder",
    tagline: "Build resumes and CVs",
    category: "Productivity",
    stores: [
      { platform: "app-store", url: "https://apps.apple.com/app/id6745150815" },
    ],
  },
  {
    name: "Invoice Maker",
    tagline: "Create and send invoices",
    category: "Finance",
    stores: [
      {
        platform: "google-play",
        url: "https://play.google.com/store/apps/details?id=com.helperg.invoicer",
      },
      { platform: "app-store", url: "https://apps.apple.com/app/id6747311276" },
    ],
  },
  {
    name: "Pocket Manager",
    tagline: "Personal money manager",
    category: "Finance",
    stores: [
      {
        platform: "google-play",
        url: "https://play.google.com/store/apps/details?id=com.helperg.money",
      },
      { platform: "app-store", url: "https://apps.apple.com/app/id6743084126" },
    ],
  },
];

/** Counts used for the bar/page labels — derived, never hardcoded. */
export const ecosystemCounts = {
  websites: ecosystemWebsites.length,
  apps: ecosystemApps.length,
} as const;

/** Local anchor ids so the bar's quick-links and the page stay in sync. */
export const ECOSYSTEM_SECTION_IDS = {
  websites: "websites",
  apps: "apps",
  future: "future",
} as const;
