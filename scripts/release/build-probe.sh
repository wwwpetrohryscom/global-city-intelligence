#!/bin/zsh
# Clean production build with RSS sampling.
#   $1 label   $2 optional NODE_OPTIONS heap cap in MB (empty = repo default)
set -u
LABEL="$1"; HEAP="${2:-}"
LOG="/tmp/gci-build-$LABEL.log"
SAMPLES="/tmp/gci-rss-$LABEL.csv"
rm -rf .next out; rm -f "$LOG" "$SAMPLES"
echo "t,nprocs,total_rss_mb,max_rss_mb" > "$SAMPLES"

if [ -n "$HEAP" ]; then export NODE_OPTIONS="--max-old-space-size=$HEAP"; else unset NODE_OPTIONS; fi
START=$(date +%s)
npm run build > "$LOG" 2>&1 &
BUILD_PID=$!

# Sample every 3s: every node process under this build, by RSS.
while kill -0 $BUILD_PID 2>/dev/null; do
  ps -Ao rss=,comm= 2>/dev/null | awk -v t=$(( $(date +%s) - START )) '
    /node$|next-server|jest-worker/ { n++; tot += $1; if ($1 > mx) mx = $1 }
    END { if (n) printf "%d,%d,%.0f,%.0f\n", t, n, tot/1024, mx/1024 }' >> "$SAMPLES"
  sleep 3
done
wait $BUILD_PID; EXIT=$?
echo "BUILD_EXIT=$EXIT" >> "$LOG"
echo "SECONDS=$(( $(date +%s) - START ))" >> "$LOG"
echo "HEAP_CAP=${HEAP:-default}" >> "$LOG"
tail -2 "$LOG"
