/**
 * THE PRIVACY CONTRACT.
 *
 * A privacy policy is a set of claims about a running system. Written as prose
 * it drifts the moment the system changes, and nothing notices — which is how
 * policies come to describe products that no longer exist.
 *
 * So the load-bearing claims live here as data. The page renders them, and
 * `scripts/validate-privacy.mjs` checks them against the things that decide
 * them: the tracker's presence in the layout, the Places retention flag, the
 * absence of any account or sync surface. A contradiction fails the build
 * rather than sitting on a legal page for a year.
 *
 * EVERY VALUE BELOW WAS VERIFIED against the running product in Phase 9.2, by
 * loading each surface in a browser and recording what it actually contacted,
 * stored and set. Nothing here is inferred from a dependency list, and nothing
 * is copied from another product's policy.
 */

/**
 * WHO OPERATES THIS SITE — and the one thing Phase 9.2 could not establish.
 *
 * The footer says "© Global City Intelligence", which is a product name.
 * `lib/ecosystem/products.ts` places it in the HELPERG family. Nothing in any
 * of the three repositories publishes a legal entity, a postal address or a
 * contact address — a search across source, content and configuration found
 * only photographers' emails inside Wikimedia attribution strings.
 *
 * A privacy policy naming an invented controller is worse than no policy: it
 * misstates who is accountable, which is the one fact a reader most needs. So
 * this is left unset, the page renders an explicit "not yet published" note
 * instead of a fabricated address, and the release checklist treats it as a
 * blocker. Filling it in is a decision for the owner, not an inference.
 */
export const PRIVACY_OPERATOR = {
  /** The name the site already publishes in its own footer. Verified. */
  displayName: "Global City Intelligence",
  /**
   * The legal entity accountable for the processing described here.
   * `null` until the owner supplies it. See PRIVACY_BLOCKERS.
   */
  legalEntity: null as string | null,
  /** A postal address, where one is required. `null` until supplied. */
  postalAddress: null as string | null,
  /** A working contact route for privacy questions. `null` until supplied. */
  contact: null as string | null,
} as const;

/**
 * When this policy was written.
 *
 * The date the text was prepared, not the date it went live — those are
 * different, and only the second one matters to a reader. The page says
 * "prepared" until a release stamps it, and the checklist requires the
 * effective date to be set in the release that publishes it.
 */
export const PRIVACY_PREPARED_ON = "2026-09-09";

/**
 * WHAT THE PRODUCT ACTUALLY DOES, as facts a validator can check.
 *
 * Each entry names the source of truth that decides it. When one of those
 * changes, the gate fails here rather than letting the page keep asserting
 * something that stopped being true.
 */
export const PRIVACY_FACTS = {
  /** Main GCI loads the WebmasterID tracker. Verified in production HTML. */
  mainAnalyticsActive: true,
  /** Places loads no analytics script at all. Verified in production HTML. */
  placesAnalyticsActive: false,
  /** GCI Places' retention measurement flag. Source: Places analytics.ts. */
  placesRetentionAnalyticsEnabled: false,
  /** The tracker's durable browser id lives in localStorage, not a cookie. */
  analyticsIdentifierStorage: "localStorage" as const,
  analyticsIdentifierKey: "wmid:av:v1",
  /** The tracker does not initialise at all under DNT or GPC. Verified. */
  analyticsHonoursDoNotTrack: true,
  analyticsHonoursGlobalPrivacyControl: true,
  /** No GCI cookie is set by any surface. Verified across all three products. */
  gciSetsCookies: false,
  /** No account system, and no server that could hold one. */
  accountsEnabled: false,
  cloudSyncEnabled: false,
  /** Places is a static export with no server code. */
  placesHasServerBackend: false,
  /* The permanent guarantees. None of these may become true. */
  personalPinCoordinatesTransmitted: false,
  personalPinTitlesTransmitted: false,
  privateNotesTransmitted: false,
  listNamesTransmitted: false,
  listContentsTransmitted: false,
} as const;

/**
 * THIRD PARTIES A READER'S BROWSER ACTUALLY CONTACTS.
 *
 * Recorded by loading each surface and listing every host that received a
 * request — not assembled from package dependencies, which describe what the
 * build uses rather than what a browser reaches. A provider is named here only
 * if it was observed.
 */
export const PRIVACY_THIRD_PARTIES = [
  {
    id: "webmasterid",
    name: "WebmasterID",
    role: "Usage measurement on the main site",
    surfaces: "Main site pages",
    receives:
      "The page address, the referring page, page title, browser language, user-agent string and window width, together with a random identifier this site stores in your browser.",
    verifiedOn: "www.globalcityintelligence.com — script and network request observed",
  },
  {
    id: "openfreemap",
    name: "OpenFreeMap",
    role: "Map tiles and styles",
    surfaces: "GCI Places pages that show a map",
    receives:
      "The tiles your browser asks for as you pan and zoom, which necessarily reveals roughly what part of a map you are looking at, plus the ordinary details every web request carries.",
    verifiedOn: "tiles.openfreemap.org — network request observed",
  },
  {
    id: "wikimedia",
    name: "Wikimedia Commons",
    role: "Photographs",
    surfaces: "Main site and GCI Media pages showing a photograph",
    receives:
      "A request for each image. Wikimedia sets its own cookie on that request; GCI neither sets nor reads it.",
    verifiedOn: "upload.wikimedia.org — request and WMF-Uniq cookie observed",
  },
  {
    id: "netlify",
    name: "Netlify",
    role: "Hosting and content delivery",
    surfaces: "Every page of every product",
    receives:
      "The ordinary details of an HTTP request — the address requested, your IP address, and your browser's user-agent — as any web host does.",
    verifiedOn: "Hosting configuration; response headers",
  },
] as const;

/**
 * WHAT STAYS ON THE DEVICE, and what stores it.
 *
 * These are first-party keys this product writes. The reader can see and clear
 * every one of them, and none of them is transmitted.
 */
export const PRIVACY_LOCAL_STORAGE = [
  {
    key: "gci.places.retention.v1",
    product: "GCI Places",
    holds:
      "Saved places and collections, your lists and their names, your private pins with their titles and locations, and your private notes.",
    control: "Clear saved data, on the Saved page.",
  },
  {
    key: "gci.places.retention.quarantine.v1",
    product: "GCI Places",
    holds:
      "A copy of saved data that could not be read, kept so it is not lost rather than deleted.",
    control: "Cleared by the same control.",
  },
  {
    key: "gci:recent-cities:v1",
    product: "Main site",
    holds: "The cities you looked at recently, so the site can offer them again.",
    control: "Clearing site data in your browser.",
  },
  {
    key: "wmid:av:v1",
    product: "Main site (WebmasterID)",
    holds:
      "A random identifier the measurement provider stores so repeat visits from this browser can be counted once rather than many times.",
    control:
      "Clearing site data in your browser. Turning on Do Not Track or Global Privacy Control stops it being created at all.",
  },
] as const;

/**
 * RELEASE BLOCKERS — machine-visible, because prose blockers get skimmed.
 *
 * `scripts/validate-privacy.mjs` prints these and `PRIVACY_RELEASE_CHECKLIST.md`
 * repeats them. Phase 9.3 must refuse activation while any remains open.
 */
export const PRIVACY_BLOCKERS = [
  {
    id: "operator-identity",
    blocks: "publishing the policy",
    summary:
      "No legal entity, postal address or contact route is published anywhere in the GCI ecosystem. The policy renders an explicit gap rather than inventing one.",
    resolvedBy: "The owner supplying verified details for PRIVACY_OPERATOR.",
  },
  {
    id: "consent-mechanism",
    blocks: "enabling retention measurement in GCI Places (Phase 9.3)",
    summary:
      "The measurement provider stores a durable identifier in the browser. Whether that needs consent before it is written depends on the reader's jurisdiction and is not a question this repository can settle. No consent mechanism exists in any GCI product today.",
    resolvedBy:
      "A specialist review of the applicable posture, and — if consent is required — a preferences mechanism decided as its own piece of work rather than bolted on.",
  },
  {
    id: "places-not-deployed",
    blocks: "the policy's GCI Places section being true",
    summary:
      "Saved places, lists, personal pins and private notes are merged but not deployed: production GCI Places has no Save control and /places/saved/ returns 404. The policy describes them because they ship in the same release window.",
    resolvedBy:
      "Releasing GCI Places alongside the policy, in the order set out in PRIVACY_RELEASE_CHECKLIST.md.",
  },
] as const;

export const PRIVACY_ROUTE = "/privacy";
