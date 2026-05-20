# Image sourcing

This document describes how hero imagery is sourced, verified, and attributed
for city and country pages on the platform.

The visual layer is deliberately conservative. **It is better to render the
designed fallback block than to publish an image with uncertain provenance,
unclear licensing, or a wrong place match.**

## Allowed sources

In priority order:

1. **Wikimedia Commons** — primary source for landmarks, skylines, architecture,
   and country landscapes. Records must include the file page URL, author, and
   a permissive Creative Commons or public-domain license.
2. **Unsplash** — premium hero imagery. Records must include the photographer,
   profile URL, and source page URL per the Unsplash provider terms.
3. **Pexels** — high-quality urban photography as a fallback. Records must
   include the photographer and the source page URL.
4. **Openverse** / **Flickr** — only when the license, author, and source URL
   are explicit and verifiable.
5. **Mapillary** — reserved for future street-level / mobility context. Not used
   as primary hero imagery in the current visual layer.

## Allowed licenses

- Public domain (PD)
- CC0
- CC BY (any version)
- CC BY-SA (any version)

**Not allowed**:

- Non-commercial-only licenses (CC BY-NC, CC BY-NC-SA, etc.)
- No-derivatives licenses (CC BY-ND, CC BY-NC-ND) — because the hero component
  may crop or constrain aspect ratio
- All-rights-reserved or any license without a clear, linkable text

## Attribution requirements

Every published image carries a visible attribution line below the hero card.
The line is rendered by `components/media/ImageAttribution.tsx` and reads:

> Image: `{author}` / `{source name}`, `{license}`

The author name, source URL, and license URL are all real, working `<a href>`
links and open in a new tab with `rel="noopener noreferrer"`.

If an image's provider terms ever change, remove the record from the relevant
catalog. The page will fall back to the designed image block automatically.

## How to add a new verified image record

1. Confirm the image clearly represents the city or country (no ambiguous
   skylines, no images of the wrong place, no images with identifiable private
   people as the main subject).
2. Confirm the license is one of the allowed licenses above.
3. Open the original file page on the provider (Wikimedia Commons file page,
   Unsplash photo page, Pexels photo page).
4. Capture the metadata:
   - direct image URL (prefer a sized thumbnail, not the original full-resolution
     file, to keep payloads small)
   - width and height of the thumbnail you are linking to
   - author / photographer name
   - author profile URL where available
   - license short name (e.g. `CC BY-SA 4.0`)
   - license URL (Creative Commons deed page)
   - source page URL
5. Add the record to `lib/data/media/city-images.ts` or
   `lib/data/media/country-images.ts` using the `PlaceImage` shape from
   `types/media.ts`. Set `verified: true` and `verifiedAt` to today's date in
   ISO format.

### Wikimedia automation

For Wikimedia Commons records, two helper scripts live in `scripts/`:

- `scripts/verify-place-images.py` — resolves each indexed city/country to a
  Wikipedia page, reads the page's Wikidata QID, fetches the `P18` ("image")
  claim, queries the Commons API for license/author/dimensions, and emits a
  candidate JSON record. Only records with a permissive license and a real
  author make it through.
- `scripts/build-place-images.py` — post-processes the JSON, drops files
  matching unsuitable patterns (flags, emblems, dictionary covers, cultural
  montages that may contain identifiable people), cleans `(talk · contribs)`
  suffixes and HTML entities from author names, and emits the final
  TypeScript catalogs.

Re-run both scripts whenever Wikidata's `P18` claims or Commons licensing
metadata may have changed for places already covered.

## How to handle missing images

Do **not** invent a record to fill a gap. Leave the record absent and let the
fallback render. The fallback is intentionally branded so the page still feels
finished. Missing coverage is reported in the build summary and tracked as
future work.

## Rules that must never be broken

- No images from generic Google Images results.
- No images without license metadata.
- No images without a source URL.
- No invented author or invented license names.
- No images of the wrong place.
- No AI-generated images presented as real photography.
- No images with identifiable private people as the main subject.
- No misleading, offensive, political, violent, or low-quality imagery.
- No important SEO text rendered inside the image itself.

## Performance contract

- Hero images are linked from provider CDNs (Wikimedia upload service) rather
  than re-hosted, so no `next/image` remote pattern changes are required.
- Hero `<img>` tags include explicit `width`, `height`, `loading`, and
  `decoding` attributes and use an `aspect-ratio` style to prevent layout
  shift.
- Above-the-fold heroes pass `priority` to opt into `loading="eager"` and
  `fetchPriority="high"`.
- Below-the-fold or directory thumbnails (when added) lazy-load by default.
