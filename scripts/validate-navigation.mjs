#!/usr/bin/env node
/**
 * NAVIGATION AND RANKING PARITY GATE.
 *
 * The failures this exists to make impossible:
 *
 *   - a ranking is published and reachable from nowhere in the navigation
 *     (the footer used to hard-code four of thirteen)
 *   - a featured city or country slug that has no public route
 *   - a cross-product link to an internal origin (a *.netlify.app host) or
 *     over http
 *   - a city-specific /places/<slug>/ link for a city with no Places hub
 *   - a Places link at all while Places is not publicly reachable
 *   - the country directory quietly falling back to alphabetical order
 *
 * TWO MODES:
 *   node scripts/validate-navigation.mjs            data + config only (fast)
 *   node scripts/validate-navigation.mjs --out out  also checks the emitted HTML
 *
 * The second mode is the one that actually proves the product: registries can
 * agree with each other perfectly while the rendered footer contains something
 * else entirely.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createJiti } from "jiti";

const ROOT = resolve(import.meta.dirname, "..");
const jiti = createJiti(ROOT, { alias: { "@": ROOT } });

const outFlag = process.argv.indexOf("--out");
const OUT = outFlag === -1 ? null : resolve(process.argv[outFlag + 1] ?? "out");

const errors = [];
const fail = (message) => errors.push(message);
let checks = 0;
const check = (condition, message) => {
  checks += 1;
  if (!condition) fail(message);
};

/* ------------------------------------------------------------------ *
 * Load the contract and the corpus.
 * ------------------------------------------------------------------ */
const ecosystem = jiti("./lib/navigation/ecosystem.ts");
const featured = jiti("./lib/navigation/featured.ts");
const registryModule = jiti("./lib/navigation/rankings-registry.ts");
const placesModule = jiti("./lib/navigation/places.ts");
const rankingsData = jiti("./lib/data/rankings.ts");
const collectionsData = jiti("./lib/data/collections.ts");
const citiesData = jiti("./lib/data/cities.ts");
const countriesData = jiti("./lib/data/countries.ts");

const { ECOSYSTEM_DESTINATIONS, PLACES_PUBLIC, CANONICAL_ORIGIN } = ecosystem;
const { FEATURED_CITIES, FEATURED_COUNTRIES } = featured;
const { RANKING_REGISTRY } = registryModule;
const published = RANKING_REGISTRY.filter((entry) => entry.published);
const { PLACES_CITIES } = placesModule;

const citySlugs = new Set(citiesData.cities.map((city) => city.slug));
const countrySlugs = new Set(countriesData.countries.map((country) => country.slug));

/* ------------------------------------------------------------------ *
 * 1. The ecosystem contract itself.
 * ------------------------------------------------------------------ */
{
  const seenPath = new Map();
  const seenId = new Set();
  for (const item of ECOSYSTEM_DESTINATIONS) {
    check(
      item.path.startsWith("/"),
      `nav destination "${item.id}" is not a domain-relative path: ${item.path}`,
    );
    check(
      !/^https?:\/\//i.test(item.path),
      `nav destination "${item.id}" uses an absolute URL: ${item.path}`,
    );
    check(
      !/netlify\.app/i.test(item.path),
      `nav destination "${item.id}" points at an internal Netlify origin: ${item.path}`,
    );
    check(!seenId.has(item.id), `duplicate nav destination id "${item.id}"`);
    seenId.add(item.id);
    check(
      !seenPath.has(item.path),
      `duplicate primary nav destination: "${item.path}" is both "${seenPath.get(item.path)}" and "${item.id}"`,
    );
    seenPath.set(item.path, item.id);
  }
  check(
    CANONICAL_ORIGIN === "https://www.globalcityintelligence.com",
    `canonical origin must be the public www host over https, got ${CANONICAL_ORIGIN}`,
  );
}

/* ------------------------------------------------------------------ *
 * 2. Featured lists resolve to real routes.
 * ------------------------------------------------------------------ */
for (const entry of FEATURED_COUNTRIES) {
  check(
    countrySlugs.has(entry.slug),
    `featured country "${entry.slug}" has no country record, so /countries/${entry.slug} does not exist`,
  );
}
for (const entry of FEATURED_CITIES) {
  check(
    citySlugs.has(entry.slug),
    `featured city "${entry.slug}" has no city record, so /cities/${entry.slug} does not exist`,
  );
}
check(
  FEATURED_CITIES[0]?.slug === "singapore",
  "Singapore must lead the featured cities: it is the current flagship market",
);
check(
  FEATURED_COUNTRIES[0]?.slug === "singapore",
  "Singapore must lead the featured countries: it is the current flagship market",
);
{
  const dupCities = FEATURED_CITIES.map((e) => e.slug).filter(
    (slug, index, all) => all.indexOf(slug) !== index,
  );
  check(dupCities.length === 0, `duplicate featured city slugs: ${dupCities.join(", ")}`);
  const dupCountries = FEATURED_COUNTRIES.map((e) => e.slug).filter(
    (slug, index, all) => all.indexOf(slug) !== index,
  );
  check(
    dupCountries.length === 0,
    `duplicate featured country slugs: ${dupCountries.join(", ")}`,
  );
}

/* ------------------------------------------------------------------ *
 * 3. RANKING REGISTRY == THE REAL PUBLISHED RANKING PAGES.
 *
 * Both directions. A registry that merely contains no lies is not enough:
 * the point of the gate is that a NEW published ranking cannot stay out of it.
 * ------------------------------------------------------------------ */
{
  const registryIds = new Set();
  const registryRoutes = new Map();
  for (const entry of RANKING_REGISTRY) {
    check(!registryIds.has(entry.id), `duplicate ranking registry id "${entry.id}"`);
    registryIds.add(entry.id);
    check(
      !registryRoutes.has(entry.route),
      `duplicate ranking route "${entry.route}" (${registryRoutes.get(entry.route)} and ${entry.id})`,
    );
    registryRoutes.set(entry.route, entry.id);
    check(
      entry.id === `${entry.family}:${entry.slug}`,
      `ranking registry id "${entry.id}" does not match its family and slug`,
    );
    const expectedRoute =
      entry.family === "ranking" ? `/rankings/${entry.slug}` : `/${entry.slug}`;
    check(
      entry.route === expectedRoute,
      `ranking "${entry.id}" route is "${entry.route}" but its family publishes at "${expectedRoute}"`,
    );
  }

  const dataRankingSlugs = new Set(rankingsData.rankings.map((r) => r.slug));
  const dataCollectionSlugs = new Set(
    collectionsData.cityCollections.map((c) => c.slug),
  );

  for (const slug of dataRankingSlugs) {
    check(
      registryIds.has(`ranking:${slug}`),
      `published ranking /rankings/${slug} is missing from the ranking registry`,
    );
  }
  for (const slug of dataCollectionSlugs) {
    check(
      registryIds.has(`collection:${slug}`),
      `published shortlist /${slug} is missing from the ranking registry`,
    );
  }
  for (const entry of RANKING_REGISTRY) {
    const known =
      entry.family === "ranking"
        ? dataRankingSlugs.has(entry.slug)
        : dataCollectionSlugs.has(entry.slug);
    check(
      known,
      `ranking registry entry "${entry.id}" has no published page behind it`,
    );
  }

  check(
    published.length === dataRankingSlugs.size + dataCollectionSlugs.size,
    `registry publishes ${published.length} rankings but the corpus publishes ${dataRankingSlugs.size + dataCollectionSlugs.size}`,
  );

  const themed = registryModule.publishedRankingsByTheme();
  const grouped = themed.reduce((sum, group) => sum + group.entries.length, 0);
  check(
    grouped === published.length,
    `theme grouping covers ${grouped} of ${published.length} published rankings — one has a theme no group renders`,
  );
}

/* ------------------------------------------------------------------ *
 * 4. Places: the manifest, and the release switch.
 * ------------------------------------------------------------------ */
for (const entry of PLACES_CITIES) {
  check(
    citySlugs.has(entry.gciCitySlug),
    `Places manifest names "${entry.gciCitySlug}", which is not a city in this corpus`,
  );
  check(
    entry.path === `/places/${entry.placesCitySlug}/`,
    `Places manifest path for "${entry.gciCitySlug}" is "${entry.path}", not the /places/<slug>/ shape`,
  );
  check(
    entry.publishedPlaces > 0,
    `Places manifest lists "${entry.gciCitySlug}" with no published places`,
  );
}
{
  // The gating helpers must agree with the switch, in both directions.
  const withHub = PLACES_CITIES[0]?.gciCitySlug;
  const withoutHub = [...citySlugs].find(
    (slug) => !PLACES_CITIES.some((entry) => entry.gciCitySlug === slug),
  );
  if (withHub) {
    check(
      placesModule.hasPlacesCity(withHub) === PLACES_PUBLIC,
      `hasPlacesCity("${withHub}") must follow PLACES_PUBLIC (${PLACES_PUBLIC})`,
    );
  }
  if (withoutHub) {
    check(
      placesModule.hasPlacesCity(withoutHub) === false,
      `hasPlacesCity("${withoutHub}") must be false: that city has no Places hub`,
    );
    const link = placesModule.placesLinkForCity(withoutHub);
    check(
      link === null || link.cityScoped === false,
      `a city with no Places hub must never get a city-scoped Places link (got ${link?.href})`,
    );
  }
  if (!PLACES_PUBLIC) {
    check(
      placesModule.placesLinkForCity(withHub ?? "singapore") === null,
      "while PLACES_PUBLIC is false no Places link may be produced for any city",
    );
  }
}

/* ------------------------------------------------------------------ *
 * 5. The country directory's default order.
 * ------------------------------------------------------------------ */
{
  const economics = jiti("./lib/data/official/country-economics/queries.ts");
  check(
    economics.DEFAULT_COUNTRY_SORT === "gdp",
    `the country directory default sort must be economic size, got "${economics.DEFAULT_COUNTRY_SORT}"`,
  );
  const ordered = economics.getCountriesByEconomicSize();
  const alphabetical = [...countriesData.countries].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  check(
    ordered[0].slug !== alphabetical[0].slug,
    `the default country order starts with "${ordered[0].slug}", which is also the first alphabetically — the economic sort is not taking effect`,
  );
  const dataset = jiti("./lib/data/official/country-economics/dataset.ts");
  const biggest = dataset.countryEconomicRecords
    .filter((r) => typeof r.gdpCurrentUsd === "number")
    .sort((a, b) => b.gdpCurrentUsd - a.gdpCurrentUsd)[0];
  check(
    ordered[0].slug === biggest.countrySlug,
    `the default order should start with the largest economy (${biggest.countrySlug}) but starts with ${ordered[0].slug}`,
  );
  // Unreported countries must sort last, never first and never as zero.
  const unreported = dataset.countryEconomicRecords
    .filter((r) => r.reportingStatus === "not-reported")
    .map((r) => r.countrySlug);
  for (const slug of unreported) {
    const position = ordered.findIndex((c) => c.slug === slug);
    const reportedCount = dataset.countryEconomicRecords.filter(
      (r) => r.reportingStatus === "reported",
    ).length;
    check(
      position >= reportedCount,
      `"${slug}" has no reported GDP but sorts at position ${position}, ahead of countries that do`,
    );
  }
  // The per-capita sort must not silently be the GDP sort.
  const byCapita = [...countriesData.countries].sort((a, b) =>
    economics.compareByEconomicSort("gdp-per-capita", a, b),
  );
  check(
    byCapita[0].slug !== ordered[0].slug,
    "the GDP-per-capita sort produces the same leader as the GDP sort — it is probably reading the same field",
  );
}

/* ------------------------------------------------------------------ *
 * 6. RENDERED OUTPUT. Only what was actually emitted counts.
 * ------------------------------------------------------------------ */
if (OUT) {
  const htmlFor = (routePath) => {
    const rel = routePath.replace(/^\/+/, "").replace(/\/$/, "");
    const direct = join(OUT, `${rel}.html`);
    if (existsSync(direct)) return direct;
    const nested = join(OUT, rel, "index.html");
    return existsSync(nested) ? nested : null;
  };
  const read = (routePath) => {
    const file = htmlFor(routePath);
    return file ? readFileSync(file, "utf8") : null;
  };

  const home = read("/");
  check(home !== null, `${OUT} has no home page — build first`);

  if (home) {
    // 6a. Every published ranking is reachable from the footer.
    for (const entry of published) {
      check(
        home.includes(`href="${entry.route}"`),
        `published ranking "${entry.id}" (${entry.route}) is not linked from the footer`,
      );
    }

    // 6b. Featured lists are the ones rendered.
    for (const entry of FEATURED_COUNTRIES) {
      check(
        home.includes(`href="/countries/${entry.slug}"`),
        `featured country "${entry.slug}" is not rendered in the footer`,
      );
    }
    for (const entry of FEATURED_CITIES) {
      check(
        home.includes(`href="/cities/${entry.slug}"`),
        `featured city "${entry.slug}" is not rendered in the footer`,
      );
    }

    // 6c. Nothing links to an internal origin or over http.
    const leaked = [...home.matchAll(/href="(http:\/\/[^"]+|https:\/\/[^"]*netlify\.app[^"]*)"/g)];
    check(
      leaked.length === 0,
      `home page links to a non-canonical or insecure target: ${leaked.slice(0, 3).map((m) => m[1]).join(", ")}`,
    );

    // 6d. The Places release switch, as rendered.
    const placesLinks = [...home.matchAll(/href="(\/places[^"]*)"/g)].map((m) => m[1]);
    if (PLACES_PUBLIC) {
      check(
        placesLinks.length > 0,
        "PLACES_PUBLIC is true but no /places link is rendered",
      );
    } else {
      check(
        placesLinks.length === 0,
        `PLACES_PUBLIC is false but the page renders Places links: ${placesLinks.slice(0, 3).join(", ")}`,
      );
    }

    // 6e. No horizontal-scroll navigation left anywhere in the header markup.
    const header = home.slice(0, home.indexOf("</header>") + 9);
    check(
      !/primary-nav-scroll/.test(home),
      "the horizontally scrolling navigation class is still rendered",
    );
    check(
      !/<nav[^>]*aria-label="Primary navigation"[^>]*overflow-x-auto/.test(header),
      "the primary navigation still declares overflow-x-auto",
    );

    // 6f. Each primary destination appears exactly once in the header.
    for (const item of ECOSYSTEM_DESTINATIONS) {
      const shown = item.servedBy !== "gci-places" || PLACES_PUBLIC;
      const count = header.split(`href="${item.path}"`).length - 1;
      if (shown) {
        check(
          count === 1,
          `header renders "${item.path}" ${count} times; every primary destination must appear exactly once`,
        );
      } else {
        check(count === 0, `header renders "${item.path}" while it is not public`);
      }
    }
  }

  // 6g. Every ranking route the registry claims was actually emitted.
  for (const entry of published) {
    check(
      htmlFor(entry.route) !== null,
      `ranking registry claims "${entry.route}" but no page was emitted there`,
    );
  }

  // 6h. Rankings index parity: the index lists every scored ranking, and the
  //     shortlist index lists every shortlist.
  const rankingsIndex = read("/rankings");
  if (rankingsIndex) {
    for (const entry of published.filter((e) => e.family === "ranking")) {
      check(
        rankingsIndex.includes(`href="${entry.route}"`),
        `/rankings does not link to published ranking "${entry.route}"`,
      );
    }
  } else {
    fail("/rankings was not emitted");
  }
  const collectionsIndex = read("/best-cities");
  if (collectionsIndex) {
    for (const entry of published.filter((e) => e.family === "collection")) {
      check(
        collectionsIndex.includes(`href="${entry.route}"`),
        `/best-cities does not link to published shortlist "${entry.route}"`,
      );
    }
  } else {
    fail("/best-cities was not emitted");
  }

  // 6i. The country directory's SERVED order is economic, not alphabetical.
  const countriesPage = read("/countries");
  if (countriesPage) {
    const order = [...countriesPage.matchAll(/href="\/countries\/([a-z0-9-]+)"/g)]
      .map((m) => m[1])
      .filter((slug, index, all) => all.indexOf(slug) === index);
    const economics = jiti("./lib/data/official/country-economics/queries.ts");
    const expected = economics.getCountriesByEconomicSize().map((c) => c.slug);
    check(
      order[0] === expected[0],
      `/countries renders "${order[0]}" first; the economic order starts with "${expected[0]}"`,
    );
    const alphabetical = [...countriesData.countries]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => c.slug);
    check(
      order.slice(0, 5).join(",") !== alphabetical.slice(0, 5).join(","),
      "/countries renders in alphabetical order",
    );
    check(
      !/<link rel="canonical" href="[^"]*\/countries\?/.test(countriesPage),
      "/countries declares a canonical URL carrying a sort query parameter",
    );
  } else {
    fail("/countries was not emitted");
  }

  // 6j. A city page carries the shared Explore module, with honest Places.
  const sampleCities = ["singapore", "hong-kong", "new-york", "london", "barcelona"];
  for (const slug of sampleCities.filter((s) => citySlugs.has(s))) {
    const page = read(`/cities/${slug}`);
    if (!page) {
      fail(`/cities/${slug} was not emitted`);
      continue;
    }
    check(
      page.includes('id="explore-city-heading"'),
      `/cities/${slug} is missing the Explore module`,
    );
    const cityPlaces = [...page.matchAll(/href="\/places\/([a-z0-9-]+)\//g)].map(
      (m) => m[1],
    );
    for (const linked of cityPlaces) {
      check(
        PLACES_CITIES.some((entry) => entry.placesCitySlug === linked),
        `/cities/${slug} links to /places/${linked}/, which the Places manifest does not publish`,
      );
    }
    // Every ranking route the module offers must be a registry route.
    const rankingHrefs = [...page.matchAll(/href="(\/rankings\/[a-z0-9-]+)"/g)].map(
      (m) => m[1],
    );
    for (const href of rankingHrefs) {
      check(
        published.some((entry) => entry.route === href),
        `/cities/${slug} links to "${href}", which is not a published ranking route`,
      );
    }
  }
}

/* ------------------------------------------------------------------ */
if (errors.length > 0) {
  console.error(`navigation validation FAILED (${errors.length} of ${checks} checks)`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(
  `navigation validation passed — ${checks} checks${OUT ? ` (including rendered output in ${OUT})` : " (data and config only)"}`,
);
