/**
 * IndexNow submission service.
 *
 * Notifies IndexNow-participating search engines (Bing, Yandex, Seznam,
 * Naver, …) that URLs were added or updated. Framework-free and
 * dependency-free (uses global `fetch`), so it can be called from a Next
 * server action / route handler or from a plain Node CLI
 * (scripts/submit-indexnow.mjs).
 *
 * NEVER call this during `next build` — IndexNow is for post-publish
 * notification only. Use the CLI or a post-deploy workflow.
 *
 * Endpoint + payload follow the IndexNow spec:
 *   POST https://api.indexnow.org/indexnow
 *   { host, key, keyLocation, urlList }
 * The key file must be reachable at https://<host>/<key>.txt.
 */

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** IndexNow accepts at most 10,000 URLs per request. */
export const INDEXNOW_MAX_BATCH = 10000;

const DEFAULT_HOST = "www.globalcityintelligence.com";

export interface IndexNowOptions {
  /** API key. Defaults to process.env.INDEXNOW_KEY. */
  key?: string;
  /** Bare host (no protocol/path), e.g. "www.globalcityintelligence.com". Defaults from env. */
  host?: string;
  /** Public URL of the key file. Defaults to https://<host>/<key>.txt. */
  keyLocation?: string;
  /** Override endpoint (e.g. a search-engine-specific IndexNow endpoint). */
  endpoint?: string;
  /** URLs per request (clamped to INDEXNOW_MAX_BATCH). Default 10000. */
  chunkSize?: number;
  /** Retry attempts per batch on network/5xx/429. Default 3. */
  retries?: number;
  /** Per-request timeout in ms. Default 15000. */
  timeoutMs?: number;
  /** Progress logger. Default console.log. Pass () => {} to silence. */
  logger?: (message: string) => void;
  /** Injectable fetch (for tests). Default global fetch. */
  fetchImpl?: typeof fetch;
  /** If true, validate + log but do not send the request. */
  dryRun?: boolean;
}

export interface IndexNowBatchResult {
  batch: number;
  count: number;
  status: number | null;
  ok: boolean;
  attempts: number;
  error?: string;
}

export interface IndexNowResult {
  ok: boolean;
  host: string;
  submitted: number;
  skipped: number;
  batches: IndexNowBatchResult[];
}

function hostFromEnv(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "";
  if (!raw) return DEFAULT_HOST;
  try {
    return new URL(raw).host;
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || DEFAULT_HOST;
  }
}

function resolveConfig(opts: IndexNowOptions) {
  const key = opts.key ?? process.env.INDEXNOW_KEY;
  if (!key) {
    throw new Error(
      "IndexNow key missing: set INDEXNOW_KEY (or pass options.key).",
    );
  }
  const host = opts.host ?? hostFromEnv();
  const keyLocation = opts.keyLocation ?? `https://${host}/${key}.txt`;
  return {
    key,
    host,
    keyLocation,
    endpoint: opts.endpoint ?? INDEXNOW_ENDPOINT,
    chunkSize: Math.min(opts.chunkSize ?? INDEXNOW_MAX_BATCH, INDEXNOW_MAX_BATCH),
    retries: Math.max(0, opts.retries ?? 3),
    timeoutMs: opts.timeoutMs ?? 15000,
    logger: opts.logger ?? ((m: string) => console.log(m)),
    fetchImpl: opts.fetchImpl ?? fetch,
    dryRun: opts.dryRun ?? false,
  };
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Normalise the URL list: drop blanks, dedupe, keep only absolute http(s)
 * URLs whose host matches the IndexNow host (IndexNow rejects mixed hosts).
 */
function normalizeUrls(urls: string[], host: string): { kept: string[]; skipped: number } {
  const seen = new Set<string>();
  const kept: string[] = [];
  let skipped = 0;
  for (const raw of urls) {
    const url = (raw || "").trim();
    if (!url) {
      skipped++;
      continue;
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      skipped++;
      continue;
    }
    if (!/^https?:$/.test(parsed.protocol) || parsed.host !== host || seen.has(parsed.href)) {
      skipped++;
      continue;
    }
    seen.add(parsed.href);
    kept.push(parsed.href);
  }
  return { kept, skipped };
}

async function postBatch(
  urlList: string[],
  cfg: ReturnType<typeof resolveConfig>,
  batchIndex: number,
): Promise<IndexNowBatchResult> {
  const body = JSON.stringify({
    host: cfg.host,
    key: cfg.key,
    keyLocation: cfg.keyLocation,
    urlList,
  });

  let lastStatus: number | null = null;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= cfg.retries + 1; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
    try {
      const res = await cfg.fetchImpl(cfg.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body,
        signal: controller.signal,
      });
      lastStatus = res.status;
      // 200 OK and 202 Accepted are success. 429/5xx are retryable.
      if (res.status === 200 || res.status === 202) {
        return { batch: batchIndex, count: urlList.length, status: res.status, ok: true, attempts: attempt };
      }
      if (res.status !== 429 && res.status < 500) {
        // 4xx (e.g. 403 invalid key, 422 host mismatch) — not retryable.
        lastError = `HTTP ${res.status} (not retryable)`;
        return { batch: batchIndex, count: urlList.length, status: res.status, ok: false, attempts: attempt, error: lastError };
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    } finally {
      clearTimeout(timer);
    }
    if (attempt <= cfg.retries) {
      const backoff = Math.min(1000 * 2 ** (attempt - 1), 8000);
      cfg.logger(`  batch ${batchIndex}: attempt ${attempt} failed (${lastError}); retrying in ${backoff}ms`);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  return { batch: batchIndex, count: urlList.length, status: lastStatus, ok: false, attempts: cfg.retries + 1, error: lastError };
}

/** Submit a batch of URLs to IndexNow (chunked, retried, timed out). */
export async function submitUrls(urls: string[], options: IndexNowOptions = {}): Promise<IndexNowResult> {
  const cfg = resolveConfig(options);
  const { kept, skipped } = normalizeUrls(urls, cfg.host);

  if (kept.length === 0) {
    cfg.logger(`IndexNow: nothing to submit (host=${cfg.host}, skipped=${skipped}).`);
    return { ok: true, host: cfg.host, submitted: 0, skipped, batches: [] };
  }

  const batches = chunk(kept, cfg.chunkSize);
  cfg.logger(
    `IndexNow: submitting ${kept.length} URL(s) to ${cfg.endpoint} in ${batches.length} batch(es) ` +
      `(host=${cfg.host}, key=${cfg.key.slice(0, 6)}…, skipped=${skipped})${cfg.dryRun ? " [DRY RUN]" : ""}`,
  );

  const results: IndexNowBatchResult[] = [];
  let i = 0;
  for (const b of batches) {
    i++;
    if (cfg.dryRun) {
      cfg.logger(`  batch ${i}/${batches.length}: ${b.length} URL(s) [dry-run, not sent]`);
      results.push({ batch: i, count: b.length, status: null, ok: true, attempts: 0 });
      continue;
    }
    const r = await postBatch(b, cfg, i);
    cfg.logger(
      `  batch ${i}/${batches.length}: ${r.ok ? "OK" : "FAILED"} ` +
        `(${r.count} URLs, status ${r.status ?? "n/a"}, attempts ${r.attempts})${r.error ? ` — ${r.error}` : ""}`,
    );
    results.push(r);
  }

  const ok = results.every((r) => r.ok);
  const submitted = results.filter((r) => r.ok).reduce((n, r) => n + r.count, 0);
  cfg.logger(`IndexNow: done — ${ok ? "all batches OK" : "some batches failed"} (${submitted}/${kept.length} URLs).`);
  return { ok, host: cfg.host, submitted, skipped, batches: results };
}

/** Submit a single URL to IndexNow. */
export async function submitUrl(url: string, options: IndexNowOptions = {}): Promise<IndexNowResult> {
  return submitUrls([url], options);
}
