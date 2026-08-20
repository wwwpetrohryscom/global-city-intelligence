import { buildDiscoveryIndex } from "@/lib/discovery/build-index";
import {
  alternatives,
  buildContext,
  similarCities,
  type AlternativeHit,
  type EngineContext,
  type IntentId,
  type SimilarHit,
} from "@/lib/similar/engine";

/**
 * SERVER ONLY — build-time entry to the recommendation engine.
 *
 * Feeds the pure engine the exact same `DiscoveryIndex` the client fetches as
 * /discovery-index/cities.json, via the existing `buildDiscoveryIndex()`.
 * Server-rendered Similar Cities and the browser's interactive Alternatives
 * therefore compute over identical data with identical code.
 *
 * Cost model: the context (normalization + vectors, O(N·m)) is built once per
 * process and memoised; each city page then runs one O(N·m) scan (~42k float
 * ops) — trivial against the ~390 s export.
 */
let ctx: EngineContext | null = null;
function context(): EngineContext {
  if (!ctx) ctx = buildContext(buildDiscoveryIndex());
  return ctx;
}

export function similarFor(slug: string): SimilarHit[] {
  return similarCities(context(), slug);
}

export function alternativesFor(slug: string, intent: IntentId): AlternativeHit[] {
  return alternatives(context(), slug, intent);
}

/** Country name for rendering, without re-exposing the whole context. */
export function countryNameFor(countryIdx: number): string {
  return context().countryName(countryIdx);
}
