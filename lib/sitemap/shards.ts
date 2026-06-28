import { absoluteUrl } from "@/lib/seo/routes";
import {
  getSitemapEntries,
  SITEMAP_CATEGORY_ORDER,
  type SitemapEntry,
} from "@/lib/sitemap/entries";

/**
 * Maximum URLs per sitemap shard. The sitemaps protocol caps a single file at
 * 50,000 URLs / 50 MB; 45,000 leaves headroom and keeps shards gzip-friendly.
 * Sharding is automatic — when a category grows past this, additional numbered
 * shards (`<category>-2`, `<category>-3`, …) are created with no code changes.
 */
export const MAX_URLS_PER_SHARD = 45_000;

export interface SitemapShard {
  /** Stable shard name, e.g. "cities-1". Used in the shard URL `/sitemaps/<name>.xml`. */
  name: string;
  entries: SitemapEntry[];
  /** Most-recent lastModified across the shard's entries (for the index <lastmod>). */
  lastModified: Date;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Partition every sitemap entry into deterministic, capped shards. Categories are
 * emitted in {@link SITEMAP_CATEGORY_ORDER}; each category is split into ≤MAX_URLS
 * numbered shards. Order is stable between builds so shard URLs never churn.
 */
export function getSitemapShards(): SitemapShard[] {
  const entries = getSitemapEntries();
  const byCategory = new Map<string, SitemapEntry[]>();
  for (const entry of entries) {
    const list = byCategory.get(entry.category);
    if (list) list.push(entry);
    else byCategory.set(entry.category, [entry]);
  }

  const shards: SitemapShard[] = [];
  for (const category of SITEMAP_CATEGORY_ORDER) {
    const list = byCategory.get(category);
    if (!list || list.length === 0) continue;
    chunk(list, MAX_URLS_PER_SHARD).forEach((part, index) => {
      let latest = 0;
      for (const e of part) {
        const t = e.lastModified ? new Date(e.lastModified).getTime() : 0;
        if (t > latest) latest = t;
      }
      shards.push({
        name: `${category}-${index + 1}`,
        entries: part,
        lastModified: new Date(latest || new Date(0).getTime()),
      });
    });
  }
  return shards;
}

/** Resolve a shard's entries by name (without the `.xml` suffix), or null. */
export function getShardEntries(name: string): SitemapEntry[] | null {
  const shard = getSitemapShards().find((s) => s.name === name);
  return shard ? shard.entries : null;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

/** Serialize the sitemap **index** (`/sitemap.xml`) listing all child shards. */
export function renderSitemapIndex(shards: SitemapShard[]): string {
  const body = shards
    .map((shard) => {
      const loc = escapeXml(absoluteUrl(`/sitemaps/${shard.name}.xml`));
      return `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${shard.lastModified.toISOString()}</lastmod>\n  </sitemap>`;
    })
    .join("\n");
  return `${XML_HEADER}\n<sitemapindex xmlns="${URLSET_NS}">\n${body}\n</sitemapindex>\n`;
}

/** Serialize a single child sitemap (`/sitemaps/<name>.xml`). */
export function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.url)}</loc>`];
      if (entry.lastModified) {
        const d = entry.lastModified instanceof Date ? entry.lastModified : new Date(entry.lastModified);
        parts.push(`    <lastmod>${d.toISOString()}</lastmod>`);
      }
      if (entry.changeFrequency) parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
      if (typeof entry.priority === "number") parts.push(`    <priority>${entry.priority.toFixed(2)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `${XML_HEADER}\n<urlset xmlns="${URLSET_NS}">\n${body}\n</urlset>\n`;
}
