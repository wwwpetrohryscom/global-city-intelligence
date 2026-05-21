# Image sourcing

This document describes how hero and secondary contextual imagery is
sourced, verified, and attributed for city and country pages on the
platform.

The visual layer is deliberately conservative. **It is better to render
the designed fallback block than to publish an image with uncertain
provenance, unclear licensing, or a wrong place match.**

## Allowed sources

In priority order:

1. **Wikimedia Commons** — primary source for landmarks, skylines,
   architecture, and country landscapes. Records must include the file
   page URL, author, and a permissive Creative Commons or public-domain
   license. Resolved through the Wikipedia → Wikidata `P18` →
   Commons-API pipeline implemented by
   `scripts/verify-place-images.py`.
2. **Unsplash** — premium hero imagery. Records must include the
   photographer, profile URL, and source page URL per the Unsplash
   provider terms. Use only when Wikimedia coverage is weak or
   non-existent.
3. **Pexels** — high-quality urban photography as a fallback. Records
   must include the photographer and the source page URL.
4. **Openverse** / **Flickr** — only when the license, author, and
   source URL are explicit and verifiable on the original file page.
5. **Mapillary** — reserved for future street-level / mobility context
   only. Not used as primary hero imagery in the current visual layer.

Source priority in practice:

- **Hero images** — start with Wikimedia Commons. Only fall back to
  Unsplash / Pexels / Openverse / Flickr if no permissively-licensed
  Commons file exists for the place.
- **Secondary contextual images** — same priority, applied per
  `(place, imageType)` pair. Limited to **two images per place total**
  (hero + at most one secondary) so page payloads stay small.

## Allowed licenses

- Public domain (PD)
- CC0
- CC BY (any version)
- CC BY-SA (any version)

**Not allowed**:

- Non-commercial-only licenses (CC BY-NC, CC BY-NC-SA, etc.)
- No-derivatives licenses (CC BY-ND, CC BY-NC-ND) — because the hero
  component may crop or constrain aspect ratio
- "Free Art License" (FAL), GFDL, and other copyleft licenses that
  don't fall under the Creative Commons whitelist
- "Copyrighted free use", "Attribution" (ambiguous), or any license
  without a clear, linkable text
- All-rights-reserved or any license without a clear, linkable text

## Attribution requirements

Every published image carries a visible attribution line below the hero
or secondary card. The line is rendered by
`components/media/ImageAttribution.tsx` and reads:

> Image: `{author}` / `{source name}`, `{license}`

The author name, source URL, and license URL are all real, working
`<a href>` links and open in a new tab with `rel="noopener noreferrer"`.

If an image's provider terms ever change, remove the record from the
relevant catalog. The page will fall back to the designed image block
automatically.

## Secondary contextual images

Some city / country pages render an additional "Visual context" section
with one secondary image (architecture, landmark, skyline, cityscape,
landscape, street, or transport). Rules:

- At most one secondary image per place (max two total per place
  including the hero).
- The secondary image must be a different file from the hero — same
  license, author, and source-page checks apply.
- Secondary images lazy-load (`loading="lazy"`), include explicit width
  / height, and live below the fold. They are not part of the LCP.
- Rendered by `components/media/PlaceSecondaryImages.tsx`. The section
  is omitted entirely when no verified secondary records exist — there
  is no placeholder block for secondaries.

## How to add a new verified image record

1. Confirm the image clearly represents the city or country (no
   ambiguous skylines, no images of the wrong place, no images with
   identifiable private people as the main subject).
2. Confirm the license is one of the allowed licenses above.
3. Open the original file page on the provider (Wikimedia Commons file
   page, Unsplash photo page, Pexels photo page).
4. Capture the metadata:
   - direct image URL (prefer a sized thumbnail, not the original
     full-resolution file, to keep payloads small)
   - width and height of the thumbnail you are linking to
   - author / photographer name
   - author profile URL where available
   - license short name (e.g. `CC BY-SA 4.0`)
   - license URL (Creative Commons deed page)
   - source page URL
5. Add the record to `lib/data/media/city-images.ts` or
   `lib/data/media/country-images.ts` using the `PlaceImage` shape from
   `types/media.ts`. Set `verified: true` and `verifiedAt` to today's
   date in ISO format.

### Wikimedia automation

For Wikimedia Commons records, several helper scripts live in
`scripts/`:

- `scripts/verify-place-images.py` — resolves each indexed city /
  country to a Wikipedia page, reads the page's Wikidata QID, fetches
  the `P18` ("image") claim, queries the Commons API for license /
  author / dimensions, and emits a candidate JSON record. Only records
  with a permissive license and a real author make it through.
- `scripts/verify-missing-places.py` — re-runs the same verifier only
  for places not yet covered.
- `scripts/verify-landmark-fallback.py` — when a place's `P18` is a
  montage, flag, dictionary cover, location map, or other unusable
  file, this script falls back to a curated list of **landmark
  Wikipedia article titles** for the place. It resolves each title via
  the same Wikipedia → Wikidata → Commons pipeline and takes the first
  one whose article title actually matches the landmark (sanity check
  on disambiguation pages) AND whose Commons metadata passes all
  validators. Hard-coded QIDs are deliberately avoided because they can
  silently map to unrelated subjects.
- `scripts/verify-secondary-images.py` — same pattern, for the
  curated secondary `(image_type, landmark)` list. Skips any candidate
  whose Commons filename collides with the place's existing hero.
- `scripts/build-place-images.py` — post-processes the JSON records,
  drops files matching unsuitable patterns (flags, emblems, dictionary
  covers, cultural montages that may contain identifiable people),
  cleans `(talk · contribs)` suffixes and HTML entities from author
  names, merges in secondary records, and emits the final TypeScript
  catalogs.
- `scripts/diagnose-missing-places.py` — prints the resolved Wikipedia
  title, Wikidata QID, P18 filename, filter outcome, license, and
  artist for every place still missing from the catalog. Used to
  decide whether to add a landmark fallback entry.
- `scripts/validate-media-catalogs.py` — static linter over the final
  TypeScript catalogs. Checks every record has src, alt, sourceUrl,
  author, license, and a license in the allowed prefix set. Confirms
  every `placeSlug` resolves to a real `lib/data/cities.ts` /
  `lib/data/countries.ts` entry. Confirms `(placeSlug, imageType)` is
  unique. Confirms no placeholder strings ("Unknown author", "TODO",
  "lorem", etc.) slipped into a record. Exits non-zero on any error.

Re-run the verifiers whenever Wikidata's `P18` claims or Commons
licensing metadata may have changed for places already covered.

## How to handle missing images

Do **not** invent a record to fill a gap. Leave the record absent and
let the fallback render. The fallback is intentionally branded so the
page still feels finished. Missing coverage is reported in the build
summary and tracked as future work.

## Rules that must never be broken

- No images from generic Google Images results.
- No images without license metadata.
- No images without a source URL.
- No invented author names, license names, license URLs, or source URLs.
- No images of the wrong place — when sourcing a landmark by Wikipedia
  article title, the verifier sanity-checks that the resolved article
  title matches the requested landmark to avoid disambiguation traps.
- No AI-generated images presented as real photography.
- No images with identifiable private people as the main subject.
- No misleading, offensive, political, violent, or low-quality imagery.
- No flag-only, emblem-only, or coat-of-arms-only files as country hero
  imagery — these are filtered by `BAD_FILE_TOKENS` in
  `scripts/build-place-images.py`.
- No cultural-montage hero images that may contain identifiable people.
- No important SEO text rendered inside the image itself.

## Performance contract

- Hero and secondary images are linked from provider CDNs (Wikimedia
  upload service) rather than re-hosted, so no `next/image`
  `remotePatterns` changes are required.
- All `<img>` tags include explicit `width`, `height`, `loading`, and
  `decoding` attributes and use an `aspect-ratio` style to prevent
  layout shift.
- Hero images receive `priority` so they get `loading="eager"` and
  `fetchPriority="high"`.
- Secondary images always lazy-load (`loading="lazy"`,
  `decoding="async"`) and use smaller `sizes` hints so they don't fight
  for bandwidth with the hero.
- No client-side image fetching, no image carousels, no heavy gallery
  libraries.
