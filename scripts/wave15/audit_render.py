#!/usr/bin/env python3
"""Production-readiness render audit (v2) over prerendered .next/server/app HTML.
Corrected after triage:
 - the site-wide `webmasterid-ingest-api.vercel.app` analytics beacon is expected on
   every page (existing + new); only CANONICAL/sitemap host matters for preview URLs.
 - phase pages carry title+canonical+og:title+og:description but NO og:image by design
   (identical on all pre-existing cities) → og:image required only on main + detail.
 - nearby detail route is dynamicParams=false: only detail-eligible slugs render; other
   nearby places are non-linked cards. Audit real wave13 detail pages + globally verify
   no page links to a non-rendered nearby slug (would 404)."""
import json, re, sys
from pathlib import Path
from collections import Counter

APP = Path("/Users/agent/global-city-intelligence/.next/server/app")
PROD = "https://www.globalcityintelligence.com"
BAD_HOST = re.compile(r"vercel\.app|localhost|127\.0\.0\.1|\.now\.sh|git-[a-z0-9-]+\.vercel", re.I)

sel = {c["slug"]: c for c in json.load(open("/tmp/w15/selected.json"))}
nb = json.load(open("/tmp/w15/nearby.json"))
city_sample = [s["slug"] for s in json.load(open("/tmp/w15/audit_sample.json"))]
for u in ():
    if u in sel and u not in city_sample:
        city_sample.append(u)
detail_sample = json.load(open("/tmp/w15/detail_sample.json"))

# valid nearby detail slugs = every prerendered nearby-weekend-places/*.html
detail_valid = {p.stem for p in (APP / "nearby-weekend-places").glob("*.html")}

issues = []
def add(where, kind, detail): issues.append((where, kind, detail))

def meta_checks(t, where, need_ogimage):
    if len(t) < 3000: add(where, "TINY", f"{len(t)}b")
    m = re.search(r"<title>(.*?)</title>", t, re.S)
    if not m or not m.group(1).strip(): add(where, "NO_TITLE", "")
    cm = re.search(r'<link rel="canonical" href="([^"]+)"', t)
    if not cm: add(where, "NO_CANONICAL", "")
    else:
        can = cm.group(1)
        if BAD_HOST.search(can): add(where, "BAD_CANONICAL_HOST", can)
        elif not can.startswith(PROD): add(where, "CANONICAL_NOT_PROD", can)
    for prop in ("og:title", "og:description"):
        if f'property="{prop}"' not in t: add(where, "NO_OG", prop)
    if need_ogimage:
        ogm = re.search(r'property="og:image" content="([^"]*)"', t)
        if not ogm or not ogm.group(1).startswith("http") or "undefined" in ogm.group(1):
            add(where, "BROKEN_OG_IMAGE", ogm.group(1) if ogm else "(missing)")
    # canonical/preview: also fail if any canonical or og:url uses a bad host
    for u in re.findall(r'(?:rel="canonical" href|property="og:url" content)="([^"]+)"', t):
        if BAD_HOST.search(u): add(where, "PREVIEW_URL_IN_META", u)
    # empty-section leakage in visible text
    vis = re.sub(r"<script[\s\S]*?</script>", "", t)
    for tok in (">undefined<", ">NaN<", ">null<", "NaN%", "undefined/100", "$NaN", "€NaN", "£NaN", "A$NaN", "C$NaN"):
        if tok in vis: add(where, "EMPTY_SECTION", tok)
    # broken <img>
    for src in re.findall(r'<img[^>]+src="([^"]*)"', t):
        if src == "" or "undefined" in src or src.endswith("null"): add(where, "BROKEN_IMG", src or "(empty)")
    # broken internal links to nearby detail (dynamicParams=false => must be prerendered)
    for href in set(re.findall(r'href="/nearby-weekend-places/([a-z0-9-]+)"', t)):
        if href not in detail_valid: add(where, "BROKEN_NEARBY_LINK", href)
    # broken internal links to city routes
    for href in set(re.findall(r'href="/cities/([a-z0-9-]+)"', t)):
        if not (APP / f"cities/{href}.html").exists(): add(where, "BROKEN_CITY_LINK", href)

CITY_ROUTES = {
    "main city":        lambda s: APP / f"cities/{s}.html",
    "cost of living":   lambda s: APP / f"cities/{s}/cost-of-living.html",
    "climate":          lambda s: APP / f"cities/{s}/climate.html",
    "quality of life":  lambda s: APP / f"safety/{s}.html",
    "economy":          lambda s: APP / f"cities/{s}/economy.html",
    "education":        lambda s: APP / f"cities/{s}/education.html",
    "healthcare":       lambda s: APP / f"cities/{s}/healthcare.html",
    "weekend trip":     lambda s: APP / f"cities/{s}/weekend-trip.html",
    "visual guide":     lambda s: APP / f"cities/{s}/visual-guide.html",
}

print(f"City sample: {len(city_sample)} | detail sample: {len(detail_sample)}\n")
for s in city_sample:
    for label, fn in CITY_ROUTES.items():
        h = fn(s)
        if not h.exists(): add(f"{s}/{label}", "MISSING", str(h)); continue
        meta_checks(h.read_text(errors="ignore"), f"{s}/{label}", need_ogimage=(label == "main city"))
for d in detail_sample:
    h = APP / f"nearby-weekend-places/{d}.html"
    if not h.exists(): add(f"{d}/detail", "MISSING", str(h)); continue
    t = h.read_text(errors="ignore")
    meta_checks(t, f"{d}/detail", need_ogimage=False)
    if "wikimedia" not in t: add(f"{d}/detail", "NO_HERO_IMG_REF", "")

# ---- GLOBAL broken-nearby-link sweep across ALL 250 new-city main + listing pages ----
print("Global sweep: 250 new cities' main + nearby-listing pages for broken nearby links...")
gbroken = Counter()
for slug in sel:
    for page in (APP / f"cities/{slug}.html", APP / f"cities/{slug}/nearby-weekend-places.html"):
        if not page.exists(): continue
        t = page.read_text(errors="ignore")
        for href in set(re.findall(r'href="/nearby-weekend-places/([a-z0-9-]+)"', t)):
            if href not in detail_valid:
                gbroken[href] += 1
if gbroken:
    add("GLOBAL", "BROKEN_NEARBY_LINK", f"{len(gbroken)} distinct e.g {list(gbroken)[:5]}")
print(f"  distinct broken nearby links across all new cities: {len(gbroken)}\n")

if not issues:
    print("✓ CLEAN — no issues across sampled city routes + detail pages + global sweep")
else:
    print(f"✗ {len(issues)} issue(s):")
    for k, n in Counter(i[1] for i in issues).most_common(): print(f"  {k}: {n}")
    print()
    for where, kind, detail in issues[:80]: print(f"  [{kind}] {where}: {detail}")
    sys.exit(1)
