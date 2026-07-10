#!/usr/bin/env python3
"""Wave 11 Phase 2: dedup + filter + SEO-score + round-robin select 250.
--dry prints eligibility + samples; without it, writes /tmp/w17/selected.json."""
import sys, json, math, re, unicodedata, difflib
from pathlib import Path

OUT = Path("/tmp/w17")
DRY = "--dry" in sys.argv

existing_cities = json.load(open(OUT / "existing_cities.json"))
existing_slugs = set(json.load(open(OUT / "existing_slugs.json")))
existing_qidset = set(json.load(open(OUT / "existing_qidset.json")))
exist_names_by_country = {}
for c in existing_cities:
    exist_names_by_country.setdefault(c["countrySlug"], set()).add(
        re.sub(r"[^a-z0-9]", "", (c["name"] or "").lower()))

PREMAP = str.maketrans({
    "ß": "ss", "Ø": "O", "ø": "o", "Æ": "Ae", "æ": "ae", "Å": "A", "å": "a",
    "Œ": "Oe", "œ": "oe", "Ł": "L", "ł": "l", "Đ": "D", "đ": "d", "Þ": "Th",
    "þ": "th", "ð": "d", "Ð": "D",
})
DASHES = dict.fromkeys(map(ord, "‐‑‒–—―−·•"), "-")
def slugify(name):
    s = (name or "").translate(DASHES).translate(PREMAP)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

import math as _m
# major AU metros: reject candidates within 35km (CBDs / metro suburbs tagged as cities)
AU_METROS = [(-33.87,151.21),(-37.81,144.96),(-27.47,153.03),(-31.95,115.86),(-34.93,138.60),
             (-28.00,153.43),(-32.93,151.78),(-35.28,149.13),(-34.42,150.89),(-38.15,144.36)]
def _hav(a,b,c,d):
    R=6371.0; p=_m.radians
    return 2*R*_m.asin(_m.sqrt(_m.sin((p(c)-p(a))/2)**2+_m.cos(p(a))*_m.cos(p(c))*_m.sin((p(d)-p(b))/2)**2))
def near_au_metro(lat,lon):
    return any(_hav(lat,lon,m[0],m[1])<35 for m in AU_METROS)
LONDON=(51.5074,-0.1278)
def near_london(lat,lon):
    return _hav(lat,lon,LONDON[0],LONDON[1])<28

# US state / CA province / AU state abbreviations for same-country disambiguation
ABBR = {
 "alabama":"al","alaska":"ak","arizona":"az","arkansas":"ar","california":"ca","colorado":"co",
 "connecticut":"ct","delaware":"de","florida":"fl","georgia":"ga","hawaii":"hi","idaho":"id",
 "illinois":"il","indiana":"in","iowa":"ia","kansas":"ks","kentucky":"ky","louisiana":"la",
 "maine":"me","maryland":"md","massachusetts":"ma","michigan":"mi","minnesota":"mn",
 "mississippi":"ms","missouri":"mo","montana":"mt","nebraska":"ne","nevada":"nv",
 "new hampshire":"nh","new jersey":"nj","new mexico":"nm","new york":"ny","north carolina":"nc",
 "north dakota":"nd","ohio":"oh","oklahoma":"ok","oregon":"or","pennsylvania":"pa",
 "rhode island":"ri","south carolina":"sc","south dakota":"sd","tennessee":"tn","texas":"tx",
 "utah":"ut","vermont":"vt","virginia":"va","washington":"wa","west virginia":"wv",
 "wisconsin":"wi","wyoming":"wy",
 "ontario":"on","quebec":"qc","british columbia":"bc","alberta":"ab","manitoba":"mb",
 "saskatchewan":"sk","nova scotia":"ns","new brunswick":"nb","newfoundland and labrador":"nl",
 "prince edward island":"pe",
 "new south wales":"nsw","victoria":"vic","queensland":"qld","western australia":"wa",
 "south australia":"sa","tasmania":"tas","northern territory":"nt",
 "australian capital territory":"act",
 "bavaria":"by","baden-wurttemberg":"bw","north rhine-westphalia":"nw","hesse":"he",
 "lower saxony":"ni","saxony":"sn","rhineland-palatinate":"rp","thuringia":"th",
 "brandenburg":"bb","saxony-anhalt":"st","schleswig-holstein":"sh","mecklenburg-vorpommern":"mv",
 "saarland":"sl","tyrol":"tyr","styria":"sty","upper austria":"ooe","lower austria":"noe",
 "salzburg":"sbg","carinthia":"ktn","vorarlberg":"vbg","burgenland":"bgl",
 "zurich":"zh","bern":"be-ct","vaud":"vd","aargau":"ag","st. gallen":"sg","lucerne":"lu",
 "ticino":"ti","valais":"vs","fribourg":"fr-ch","thurgau":"tg","grisons":"gr","solothurn":"so",
 "west flanders":"wvl","east flanders":"ovl","antwerp":"ant","limburg":"lim-be",
 "flemish brabant":"vbr","walloon brabant":"bw-be","hainaut":"hai","liege":"lg","namur":"nam","luxembourg":"lux-be",
}
CC = {"greece":"gr","hungary":"hu","bulgaria":"bg","slovenia":"si","serbia":"rs","lithuania":"lt","latvia":"lv","estonia":"ee","montenegro":"me","ukraine":"ua","belarus":"by","russia":"ru","turkey":"tr","israel":"il","czechia":"cz"}

# metro / admin / non-city type or name rejects
HARD_TYPE = re.compile(r"metropolitan|functional urban area|urban agglomeration|agglomeration|"
    r"conurbation|regional unit|\bregion\b|\bdepartment\b|arrondissement|\bcanton\b|"
    r"prefecture|former municipality|ghost town|abandoned")
SOFT_TYPE = re.compile(r"locality of|ortsteil|stadtteil|\bquarter\b|borough of|subdivision|"
    r"neighbou?rhood|suburb|city district|\bdistrict\b|\bcounty\b|locality$|"
    r"\bhamlet\b|\bvillage\b|london borough")
CITYISH = re.compile(r"\bcity\b|\btown\b|municipality|commune|\bstad\b|gemeinde|"
    r"regional cent|independent city|charter city|consolidated city|county seat|"
    r"county town|port city|\bville\b|lutherstadt|hanseatic")
BAD_NAME = re.compile(r"metropolitan|metro area|agglomeration|urban area|conurbation|randstad|"
    r"\bregion\b|\bcounty\b|central business district|\bcbd\b", re.I)

def mainland_ok(slug, lat, lon):
    """Reject overseas/external territories for FR/NL/AU (US keeps AK/HI)."""
    B = {"greece": (34.7, 41.8, 19.3, 28.3), "hungary": (45.7, 48.6, 16.1, 22.9),
         "bulgaria": (41.2, 44.3, 22.3, 28.7), "slovenia": (45.4, 46.9, 13.3, 16.7),
         "serbia": (42.2, 46.2, 18.8, 23.1), "lithuania": (53.8, 56.5, 20.9, 26.9),
         "latvia": (55.6, 58.1, 20.9, 28.3), "estonia": (57.5, 59.8, 21.7, 28.3),
         "montenegro": (41.8, 43.6, 18.4, 20.4), "ukraine": (44.3, 52.5, 22.1, 40.3),
         "belarus": (51.2, 56.2, 23.1, 32.9), "russia": (41.0, 78.0, 19.0, 180.0),
         "turkey": (35.8, 42.2, 25.5, 44.9), "israel": (29.4, 33.4, 34.2, 35.95),
         "czechia": (48.5, 51.1, 12.0, 18.9)}
    if slug in B:
        a, b, c, d = B[slug]
        return a <= lat <= b and c <= lon <= d
    return True

def seo_score(r):
    pop = r["population"] or 0
    sl = r["sitelinks"]
    s = 0.0
    s += max(0.0, math.log10(max(pop, 1000)) ) * 11.0          # ~33-77 for 1k..5M
    s += min(sl, 150) * 0.42                                    # up to 63
    if r["hasImage"]: s += 6
    if r["capitalOf"]: s += 9
    if re.search(r"capital|prefecture|county seat|state capital|administrative cent", r["types"]): s += 5
    if pop >= 100000: s += 4
    return round(s, 2)

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
existing_norm_by_country = {k: {norm(x) for x in v} for k, v in {
    cc: {s for s in existing_slugs if True} for cc in CC}.items()}  # placeholder, replaced below
# build per-country existing slug sets for fuzzy (all slugs; fuzzy within country not separable -> use global)
existing_slug_norm = {norm(s): s for s in existing_slugs}

def eligible(r):
    if not r["qid"] or not r["name"] or r["lat"] is None: return None
    if r["qid"] in existing_qidset: return None
    if (r["population"] or 0) < 1000: return None
    t = r["types"] or ""
    if HARD_TYPE.search(t): return None
    if SOFT_TYPE.search(t) and not CITYISH.search(t): return None
    if BAD_NAME.search(r["name"] or ""): return None
    if re.search(r"\bsector\b|city district|arrondissement|subdivision", (r["types"] or "")+" "+(r["name"] or ""), re.I): return None
    # population-inheritance anomaly: large pop but trivial notability = metro pop on a small place
    if (r["population"] or 0) > 800000 and r["sitelinks"] < 25: return None
    if not mainland_ok(r["countrySlug"], r["lat"], r["lon"]): return None
    # suburb of an existing metro: admin parent is itself an existing city
    if r["adminQ"] and r["adminQ"] in existing_qidset: return None
    # same-country exact name match -> same place
    if norm(r["name"]) in exist_names_by_country.get(r["countrySlug"], set()): return None
    _sm = re.sub(r"[^a-z0-9]","", re.sub(r"\b(municipality|kommun|kommune|kunta)\b","",(r["name"] or "").lower()))
    if _sm in {re.sub(r"(municipality|kommun|kommune|kunta)","",x) for x in exist_names_by_country.get(r["countrySlug"], set())}: return None
    # AU metro suburbs / CBDs tagged as cities
    if r["countrySlug"] == "australia" and near_au_metro(r["lat"], r["lon"]): return None
    if r["countrySlug"] == "united-kingdom" and near_london(r["lat"], r["lon"]): return None
    return r

def assign_slug(r, used):
    base = slugify(r["name"])
    if not base: return None
    cc = CC[r["countrySlug"]]
    cands = [base]
    # admin-based suffix for disambiguation
    adm = (r["admin"] or "").lower()
    ab = ABBR.get(adm)
    if ab: cands.append(f"{base}-{ab}")
    cands.append(f"{base}-{cc}")
    for cand in cands:
        if cand in existing_slugs or cand in used: continue
        # fuzzy near-dup vs existing (guard against trailing-s / minor variants)
        nc = norm(cand)
        if nc in existing_slug_norm: continue
        close = difflib.get_close_matches(nc, list(existing_slug_norm.keys()), n=1, cutoff=0.94)
        if close and abs(len(nc) - len(close[0])) <= 2 and nc[:4] == close[0][:4]:
            continue
        return cand
    return None

# build eligible pools per country
pools = {cc: [] for cc in CC}
raw_counts = {}
for slug in CC:
    raw = json.load(open(OUT / f"raw_{slug}.json"))
    raw_counts[slug] = len(raw)
    for r in raw:
        e = eligible(r)
        if e:
            e["seo"] = seo_score(e)
            pools[slug].append(e)
    pools[slug].sort(key=lambda x: -x["seo"])

print("=== raw / eligible per country ===")
for slug in CC:
    print(f"  {slug:16s} raw={raw_counts[slug]:5d}  eligible={len(pools[slug])}")

if DRY:
    for slug in CC:
        print(f"\n--- {slug} top 18 ---")
        used = set()
        for r in pools[slug][:18]:
            sg = assign_slug(r, used); used.add(sg or "")
            print(f"  {r['qid']:10s} {str(r['name'])[:24]:24s} pop={int(r['population'] or 0):>8d} "
                  f"sl={r['sitelinks']:>3d} seo={r['seo']:>5} img={'Y' if r['hasImage'] else '-'} "
                  f"slug={sg} types={r['types'][:30]}")
    sys.exit(0)

# ---- round-robin selection with per-country caps ----
CAPS = json.load(open(OUT / "caps.json")) if (OUT / "caps.json").exists() else {
    "greece": 40, "hungary": 20, "bulgaria": 20, "slovenia": 10, "serbia": 15, "lithuania": 20, "latvia": 20, "estonia": 10, "montenegro": 5, "ukraine": 45, "belarus": 25, "russia": 50, "turkey": 50, "israel": 20, "czechia": 25}
ORDER = ["russia", "turkey", "ukraine", "greece", "belarus", "czechia", "hungary", "bulgaria", "lithuania", "latvia", "serbia", "israel", "slovenia", "estonia", "montenegro"]
TARGET = 375
selected = []
used_slugs = set()
idx = {cc: 0 for cc in CC}
count = {cc: 0 for cc in CC}
progress = True
while len(selected) < TARGET and progress:
    progress = False
    for cc in ORDER:
        if len(selected) >= TARGET: break
        if count[cc] >= CAPS.get(cc, 0): continue
        # advance to next assignable candidate in this country
        while idx[cc] < len(pools[cc]):
            r = pools[cc][idx[cc]]; idx[cc] += 1
            sg = assign_slug(r, used_slugs)
            if not sg: continue
            r2 = dict(r); r2["slug"] = sg
            used_slugs.add(sg)
            selected.append(r2); count[cc] += 1; progress = True
            break

print(f"\n=== SELECTED {len(selected)} ===")
for cc in ORDER:
    print(f"  {cc:16s} {count[cc]}")
json.dump(selected, open(OUT / "selected.json", "w"), ensure_ascii=False)
print("wrote /tmp/w17/selected.json")
