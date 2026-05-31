# Community Media Roadmap

## Product direction
  - Local-first travel/rest social platform
  - Surface beautiful places near each user's own city, not flight-first tourism
  - Verified-source photos first; user submissions later under strict moderation
  - Not an Instagram or Facebook clone — the surface, source policy, and
    moderation gates are different

## Current phase (2026-05-31)
  - Verified-source images only (Wikimedia Commons, Wikidata P18, official sources)
  - Existing nearby weekend places model: 68 records with full source attribution
  - Strict license and attribution rules already enforced
  - No public community photos exist on any rendered surface

## This task — foundation only
  - Types defined for future user-submitted photos
  - Policy + validation helpers added (pure, synchronous, server-safe)
  - No upload UI, no API routes, no storage, no auth, no public rendering
  - Verified-source media catalog left completely untouched
  - Target validation is shape-only — `validateCommunityPhotoTarget` checks
    the target-type allow-list and that `targetSlug` is non-empty, but does
    NOT resolve `targetSlug` against actual project content (nearby places /
    cities / countries). That resolution is deferred to the future
    server-side submission endpoint.

## Next phase
  - Allow user submissions
    - upload endpoint backed by a storage provider (deferred)
    - submission record created with status: "pending_review"
    - sourceType: "user_uploaded" (always)
    - userConfirmedRights / userConfirmedPlaceMatch /
      userConfirmedNoSensitiveContent all required to be true
  - Moderator dashboard
    - reviewer can approve / reject / hide / remove / request_changes
    - high-risk safety flags block auto-approval and bump review priority
    - approve transitions visibility to "public"
    - publicUrl + thumbnailUrl + altText + attributionLabel become required at
      approval time

## Future phases
  - User profiles (separate task)
  - Place photo galleries
  - City photo feeds
  - Saved places and follows
  - Reports and audit log
  - Unified UI with separate "Verified photos" and "Community photos" tabs

## Source separation
  - sourceType values:
    - verified_source — bridged from the existing verified media catalog at a
      later, explicit task (no automatic merging)
    - user_uploaded — submitted by users; ALWAYS requires moderation; never
      appears on public surfaces until status === "approved"
    - moderator_added — added by a moderator; still requires review
  - User-uploaded photos are NEVER labeled as verified-source images
  - Verified-source media records (existing NearbyPlaceImage, PlaceImage, etc.)
    continue to use their existing strict source-attribution model and remain
    in their existing catalogs

## Moderation lifecycle
  - draft -> pending_review (on submission)
  - pending_review -> approved | rejected | request_changes (reviewer decision)
  - any -> hidden | removed (moderator action)
  - reported (community report) -> moderator queue
  - Visibility derives from status via getCommunityPhotoVisibilityForStatus
  - Only "approved" status maps to public visibility

## Safety flags
  - The full enum is defined in /types/community-media.ts.
  - High-risk subset (blocks auto-approval, bumps priority to "high"):
    - child_visible
    - private_person_main_subject
    - personal_information
    - violence_or_disturbing
    - hate_or_extremism
    - nudity_or_sexual_content
    - copyright_risk
    - manipulated_or_ai_generated

## Trust and safety rules
  - User-uploaded photos ALWAYS require moderation before public visibility
  - High-risk safety flags block auto-approval and require high-priority review
  - Manipulated or AI-generated content is not accepted as authentic place media
  - Copyright-risk submissions must be resolved before public display
  - Reports increment reportCount and re-queue the submission for review

## Copyright / rights confirmation
  - For user_uploaded submissions, the user must affirmatively confirm:
    - userConfirmedRights — they hold the rights to share the image
    - userConfirmedNoSensitiveContent — the image carries no sensitive content
    - userConfirmedPlaceMatch — the image shows the claimed place
  - licenseIntent captures the user's declared license:
    - user_owned, user_has_permission, public_domain, creative_commons, unknown
  - "unknown" licenseIntent triggers a copyright_risk safety flag at submission

## Child / private-person policy
  - child_visible and private_person_main_subject are high-risk flags that
    block auto-approval
  - Images where children or identifiable private individuals are the main
    subject must be manually reviewed before public visibility, and most are
    expected to be rejected unless documented consent is available

## AI / manipulated media policy
  - manipulated_or_ai_generated is a hard block on public display
  - The platform's image policy explicitly excludes AI-generated content from
    the verified media catalog, and the same exclusion applies to community
    submissions

## Public visibility rules
  - canCommunityPhotoBePublic(status) returns true only for "approved"
  - validateCommunityPhotoPublicRecord enforces presence of publicUrl,
    altText, width, height, attributionLabel, and absence of high-risk
    safety flags

## Storage / auth / API — deferred
  - This task ships the model only
  - Storage provider integration, auth flow, upload routes, and moderation
    routes are all deferred to follow-up tasks
  - No package dependencies were added

## Recommended future implementation sequence
  - Auth + user identity
  - Storage provider integration (file upload only, no rendering surface yet)
  - Submission endpoint with server-side validation calling the helpers added
    here
  - Moderator dashboard route (auth-gated)
  - Public render path for approved photos with explicit "Community photo"
    labeling and separate gallery tab from verified photos
