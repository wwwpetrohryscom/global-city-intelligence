#!/bin/zsh
# Upload monitor for a manual Netlify artifact deploy.
#
# Watches THREE independent signals and only reports trouble when several
# agree. Deliberately avoids the failure modes of earlier attempts:
#   * tracks the CLI by PID and its descendants, never by process NAME —
#     npx executes `.bin/netlify`, so a name match proves nothing either way
#   * never uses `nettop -L 1` as a "one sample": it blocks ~50 s and reads
#     as a hang
#   * never restarts the upload; a restart costs a full re-upload
#
# Usage: scripts/release/deploy-monitor.sh <cli-pid> <cli-log> [site-id]
set -u
PID="$1"; LOG="$2"; SITE="${3:-85ce5e66-cc2a-47b1-9271-26e5374089ee}"
NL="npx -y netlify-cli@27.1.2"
STALL_LIMIT=1800          # 30 min with no progress before escalating
INTERVAL=120
START=$(date +%s)
last_progress=$START
last_marker=""
deploy_id=""

echo "monitoring pid=$PID log=$LOG site=$SITE"
while kill -0 "$PID" 2>/dev/null; do
  now=$(date +%s); elapsed=$(( now - START ))

  # 1. process tree: the CLI plus every descendant, by PID
  kids=$(pgrep -P "$PID" 2>/dev/null | wc -l | tr -d ' ')

  # 2. CLI output: size and the newest progress-bearing line
  logsz=$(wc -c < "$LOG" 2>/dev/null | tr -d ' ')
  marker=$(grep -oE "Uploading [0-9]+|[0-9]+ assets?|[0-9]+/[0-9]+" "$LOG" 2>/dev/null | tail -1)
  [ -z "$deploy_id" ] && deploy_id=$(grep -oE "[0-9a-f]{24}" "$LOG" 2>/dev/null | tail -1)

  # 3. authoritative deploy state, only once an id is known
  state=""
  if [ -n "$deploy_id" ]; then
    state=$($NL api getDeploy --data "{\"deploy_id\":\"$deploy_id\"}" </dev/null 2>/dev/null \
            | python3 -c "import json,sys; print((json.load(sys.stdin) or {}).get('state',''))" 2>/dev/null)
  fi

  if [ "$marker" != "$last_marker" ] || [ "$logsz" != "${last_size:-}" ]; then
    last_progress=$now; last_marker="$marker"; last_size="$logsz"
  fi
  stalled=$(( now - last_progress ))

  printf "[%5ss] children=%s log=%sB progress=%-18s state=%-10s stalled=%ss\n" \
    "$elapsed" "$kids" "$logsz" "${marker:-none}" "${state:-unknown}" "$stalled"

  # escalation: only on agreeing signals
  if [ "$state" = "error" ]; then echo "ALERT: deploy state=error — escalate"; fi
  if [ "$stalled" -ge "$STALL_LIMIT" ] && [ "$state" != "ready" ]; then
    echo "ALERT: no progress for ${stalled}s AND state=${state:-unknown} — escalate to owner (do NOT auto-restart)"
  fi
  [ "$state" = "ready" ] && { echo "deploy state=ready"; break; }
  sleep "$INTERVAL"
done

wait "$PID" 2>/dev/null; rc=$?
echo "CLI exited rc=$rc after $(( $(date +%s) - START ))s; deploy_id=${deploy_id:-unknown}"
