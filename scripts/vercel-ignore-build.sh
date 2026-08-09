#!/usr/bin/env bash
#
# Vercel "Ignored Build Step" decision script.
#
# Exit code contract (Vercel):
#   exit 1  -> BUILD   (proceed with the deployment)
#   exit 0  -> SKIP    (cancel the build, no Build CPU spent)
#
# Why this exists
# ---------------
# There is no vercel.json in the project today, so every push to every branch
# builds the full ~73.5k-page application. In July, 41 pushes triggered builds
# but only 16 were merges to main, i.e. roughly 60% of Build CPU went to
# preview builds — including builds for commits that cannot change the built
# output at all (docs, memory notes, CI workflow text).
#
# Design rules (in priority order)
# --------------------------------
#   1. NEVER skip a production build. Production is always built, no exceptions.
#   2. FAIL OPEN. Any error, any unknown state, any inability to diff -> BUILD.
#      A wasted build costs a few cents; a wrongly skipped build ships nothing
#      and can look like a broken deploy.
#   3. Only skip when EVERY changed file matches a strict, explicit allowlist of
#      paths that provably cannot affect the built output.
#   4. Always allow a manual override so a preview can be forced on demand.
#
# Manual override
# ---------------
#   Put [force-build] (or [vercel build]) anywhere in the commit message.
#   Redeploying from the Vercel dashboard also bypasses this script entirely.

set -uo pipefail

build()  { echo "BUILD: $1"; exit 1; }
skip()   { echo "SKIP: $1";  exit 0; }

echo "ignore-build: env=${VERCEL_ENV:-unknown} ref=${VERCEL_GIT_COMMIT_REF:-unknown}"

# ---- Rule 1: production is sacred -------------------------------------------
# Covers both the env flag and the branch name, so a misconfigured VERCEL_ENV
# still cannot cause a skipped production deploy.
if [ "${VERCEL_ENV:-}" = "production" ]; then
  build "production deployment"
fi
case "${VERCEL_GIT_COMMIT_REF:-}" in
  main|master) build "production branch (${VERCEL_GIT_COMMIT_REF})" ;;
esac

# ---- Rule 4: explicit manual override ---------------------------------------
MSG="$(git log -1 --pretty=%B 2>/dev/null || echo '')"
case "$MSG" in
  *"[force-build]"*|*"[vercel build]"*) build "forced by commit message" ;;
esac

# ---- Rule 2: we must be able to diff, or we build ---------------------------
PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$PREV" ]; then
  build "no previous SHA (first build on this branch / unknown base)"
fi
if ! git cat-file -e "${PREV}^{commit}" 2>/dev/null; then
  build "previous SHA $PREV not present in the shallow clone"
fi

CHANGED="$(git diff --name-only "$PREV" HEAD 2>/dev/null)"
if [ -z "$CHANGED" ]; then
  # No diff at all is unusual (empty commit, force-push, rebase). Build.
  build "no file diff resolved against $PREV"
fi

# ---- Rule 3: strict allowlist of output-irrelevant paths --------------------
# Anything NOT matched here forces a build. Deliberately conservative:
# scripts/ is NOT blanket-ignored because some scripts generate lib/data.
is_ignorable() {
  case "$1" in
    docs/*)                       return 0 ;;
    *.md)                         return 0 ;;   # READMEs, notes, changelogs
    LICENSE)                      return 0 ;;
    .github/*)                    return 0 ;;   # CI config; never in the bundle
    .gitignore|.editorconfig)     return 0 ;;
    .env.example)                 return 0 ;;
    *) return 1 ;;
  esac
}

RELEVANT=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  if ! is_ignorable "$f"; then
    RELEVANT=$((RELEVANT + 1))
    [ "$RELEVANT" -le 5 ] && echo "  relevant change: $f"
  fi
done <<EOF
$CHANGED
EOF

TOTAL="$(printf '%s\n' "$CHANGED" | grep -c . || true)"
if [ "$RELEVANT" -eq 0 ]; then
  skip "all ${TOTAL} changed file(s) are documentation/config only"
fi

build "${RELEVANT} of ${TOTAL} changed file(s) can affect the build output"
