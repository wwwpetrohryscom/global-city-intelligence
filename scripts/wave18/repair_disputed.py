#!/usr/bin/env python3
"""Editorial disputed-territory repair for Wave 18.

Removes 22 cities whose country assignment is disputed/occupied/misassigned and
replaces them with clean same-country candidates (preserving per-country target
counts), so no page ships a contested country assignment:

  serbia  (5)  Kosovo cities            pristina/prizren/peja/ferizaj/mitrovica
  ukraine (15) Crimea + occupied Donbas/Kherson
  israel  (1)  Jerusalem (Israel+Palestine dual-tag)
  greece  (1)  Didim (actually Aydin Province, TURKEY; P17=Greece was ancient-Ionia)

Definitive filter = Wikidata P17 must be the SINGLE current sovereign == target
country (rejects Kosovo/Russia/Palestine/Turkey dual-tags). For occupied
Donbas/Kherson (Wikidata P17=Ukraine only) a geographic safe-zone is added.
Reuses the wave18_select eligibility + slug logic and the repair hero/nearby
resolvers. Also re-applies the naoussa hero + Kallidromo nearby image fixes into
heroes.json / nearby.json so the re-wire preserves them. Writes corrected
selected/heroes/nearby.json in place."""
import sys, json, re, math, unicodedata, difflib
from pathlib import Path
from collections import Counter
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave18")
import commons as C
import nearby_resolve as NR
from sparql import sparql

OUT = Path("/tmp/w18")
MIN_DIM = 600

REMOVE = {
    # serbia — Kosovo (P17 = Kosovo + Serbia)
    "pristina", "prizren", "peja", "ferizaj", "mitrovica",
    # ukraine — Crimea (Russia-annexed 2014)
    "yalta", "sevastopol", "alushta", "bakhchysarai", "simferopol", "feodosiia", "dzhankoi",
    # ukraine — occupied Donbas / Kherson
    "luhansk", "makiivka", "antratsyt", "sorokyne", "avdiivka", "siverskodonetsk", "rubizhne", "nova-kakhovka",
    # israel — Jerusalem (Israel + Palestine)
    "jerusalem",
    # greece — Didim is in Turkey (factual misassignment)
    "didim",
}
NEED = Counter()  # per-country replacements required, derived from REMOVE below

CN = {"greece": "Greece", "serbia": "Serbia", "ukraine": "Ukraine", "israel": "Israel"}
CC = {"greece": "gr", "serbia": "rs", "ukraine": "ua", "israel": "il"}
# Wikidata current-sovereign QIDs allowed per country (single-tag required)
SOV_OK = {"greece": "Q41", "serbia": "Q403", "ukraine": "Q212", "israel": "Q801"}
# other CURRENT sovereigns that must NOT co-tag (dispute markers)
DISPUTE_MARK = {"Q1246", "Q159", "Q219060", "Q43", "Q858", "Q801", "Q403", "Q212", "Q41"}
# historical / non-current P17 values to ignore when counting sovereigns
HIST = {"Q15180", "Q34266", "Q2184", "Q212857", "Q139319", "Q83286", "Q172107",
        "Q12560", "Q131964", "Q15102440", "Q153136", "Q171150", "Q191077", "Q241748",
        "Q37024", "Q701914", "Q838261", "Q193714", "Q12560", "Q7075820", "Q12544",
        "Q12548", "Q42406", "Q41304", "Q28513", "Q153943"}

CRIMEA = lambda lat, lon: 44.0 <= lat <= 46.30 and 32.30 <= lon <= 36.90


def ua_safe(lat, lon):
    """Western/central/northern Ukraine, clear of Crimea + occupied SE oblasts."""
    if CRIMEA(lat, lon):
        return False
    if lon > 32.3:      # excludes Donbas, Zaporizhzhia, Kharkiv-east, occupied S. Kherson
        return False
    return True


# ---------- reused wave18_select eligibility (copied to avoid its import side-effects) ----------
PREMAP = str.maketrans({"ß": "ss", "Ø": "O", "ø": "o", "Æ": "Ae", "æ": "ae", "Å": "A", "å": "a",
    "Œ": "Oe", "œ": "oe", "Ł": "L", "ł": "l", "Đ": "D", "đ": "d", "Þ": "Th", "þ": "th", "ð": "d", "Ð": "D"})
DASHES = dict.fromkeys(map(ord, "‐‑‒–—―−·•"), "-")
def slugify(name):
    s = (name or "").translate(DASHES).translate(PREMAP)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

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

MAINLAND = {"greece": (34.7, 41.8, 19.3, 28.3), "serbia": (42.2, 46.2, 18.8, 23.1),
            "ukraine": (44.3, 52.5, 22.1, 40.3), "israel": (29.4, 33.4, 34.2, 35.95)}
def mainland_ok(slug, lat, lon):
    a, b, c, d = MAINLAND[slug]
    return a <= lat <= b and c <= lon <= d

def seo_score(r):
    pop = r["population"] or 0
    s = max(0.0, math.log10(max(pop, 1000))) * 11.0 + min(r["sitelinks"], 150) * 0.42
    if r["hasImage"]: s += 6
    if r["capitalOf"]: s += 9
    if re.search(r"capital|prefecture|county seat|state capital|administrative cent", r["types"]): s += 5
    if pop >= 100000: s += 4
    return round(s, 2)

norm = lambda s: re.sub(r"[^a-z0-9]", "", (s or "").lower())

existing_cities = json.load(open(OUT / "existing_cities.json"))
existing_slugs = set(json.load(open(OUT / "existing_slugs.json")))
existing_qidset = set(json.load(open(OUT / "existing_qidset.json")))
exist_names_by_country = {}
for c in existing_cities:
    exist_names_by_country.setdefault(c["countrySlug"], set()).add(norm(c["name"]))
existing_slug_norm = {norm(s): s for s in existing_slugs}
ABBR = {}  # no state abbreviations for these 4 countries

def eligible(r):
    if not r["qid"] or not r["name"] or r["lat"] is None: return None
    if r["qid"] in existing_qidset: return None
    if (r["population"] or 0) < 1000: return None
    t = r["types"] or ""
    if HARD_TYPE.search(t): return None
    if SOFT_TYPE.search(t) and not CITYISH.search(t): return None
    if BAD_NAME.search(r["name"] or ""): return None
    if re.search(r"\bsector\b|city district|arrondissement|subdivision", t + " " + (r["name"] or ""), re.I): return None
    if (r["population"] or 0) > 800000 and r["sitelinks"] < 25: return None
    if not mainland_ok(r["countrySlug"], r["lat"], r["lon"]): return None
    if r["adminQ"] and r["adminQ"] in existing_qidset: return None
    if norm(r["name"]) in exist_names_by_country.get(r["countrySlug"], set()): return None
    return r

def assign_slug(r, used):
    base = slugify(r["name"])
    if not base: return None
    cc = CC[r["countrySlug"]]
    for cand in [base, f"{base}-{cc}"]:
        if cand in existing_slugs or cand in used: continue
        nc = norm(cand)
        if nc in existing_slug_norm: continue
        close = difflib.get_close_matches(nc, list(existing_slug_norm.keys()), n=1, cutoff=0.94)
        if close and abs(len(nc) - len(close[0])) <= 2 and nc[:4] == close[0][:4]:
            continue
        return cand
    return None


def p17_of(qids):
    """Return {qid: set(current-sovereign P17 QIDs)} (historical filtered out)."""
    out = {}
    for i in range(0, len(qids), 120):
        batch = qids[i:i + 120]
        vals = " ".join(f"wd:{q}" for q in batch)
        rows = sparql(f"SELECT ?c ?country WHERE {{ VALUES ?c {{ {vals} }} OPTIONAL {{ ?c wdt:P17 ?country. }} }}",
                      retries=4, timeout=90)
        for r in rows:
            c = r["c"]["value"].split("/")[-1]
            out.setdefault(c, set())
            if "country" in r:
                cq = r["country"]["value"].split("/")[-1]
                if cq not in HIST:
                    out[c].add(cq)
    return out


def hero_for(c):
    def tryf(fn):
        if not fn or C.file_unsuitable(fn): return None
        ii = C.imageinfo(fn, width=1280)
        if not ii or ii["mime"] not in ("image/jpeg", "image/png"): return None
        if max(ii.get("ow") or 0, ii.get("oh") or 0) < MIN_DIM: return None
        if not C.license_ok(ii["licenseCode"], ii["licenseShort"]): return None
        au = C.clean_author(ii["artist"])
        if not au: return None
        lic, licurl = C.normalize_license(ii["licenseCode"], ii["licenseShort"])
        if ii.get("licenseUrl"): licurl = ii["licenseUrl"]
        attr = f"{au} / Wikimedia Commons, {lic}"
        # avoid the media-validator placeholder-substring trap (todo/tbd/lorem/unknown)
        if any(tok in (au + " " + attr).lower() for tok in ("placeholder", "lorem", "click here",
               "unknown author", "unknown license", "image here", "todo", "tbd")):
            return None
        sf = fn.replace("_", " ")
        return {"src": ii["url"], "width": int(ii["width"]), "height": int(ii["height"]),
                "alt": f"View of {c['name']}, {CN[c['countrySlug']]}",
                "sourceUrl": "https://commons.wikimedia.org/wiki/File:" + sf,
                "author": au, "authorUrl": C.author_url(ii["artist"]),
                "license": lic, "licenseUrl": licurl,
                "attributionText": attr, "commonsFile": sf, "qid": c["qid"]}
    h = tryf(c.get("p18file"))
    if h: return h
    try:
        claims = C.entity_claims(c["qid"])
    except Exception:
        return None
    for f in C.claim_values(claims, "P18"):
        h = tryf(f)
        if h: return h
    for cat in C.claim_values(claims, "P373"):
        try:
            files = C.category_files(cat, limit=60)
        except Exception:
            continue
        for f in sorted(files, key=lambda f: (0 if f.lower().endswith((".jpg", ".jpeg")) else 1, f.lower())):
            h = tryf(f)
            if h: return h
    return None


def main():
    selected = json.load(open(OUT / "selected.json"))
    heroes = json.load(open(OUT / "heroes.json"))
    nearby = json.load(open(OUT / "nearby.json"))

    # --- re-apply the naoussa hero + Kallidromo nearby image fixes into the inputs ---
    if (OUT / "naoussa_hero.json").exists():
        nh = json.load(open(OUT / "naoussa_hero.json"))
        h = heroes["naoussa"]
        h.update({k: nh[k] for k in ("src", "width", "height", "sourceUrl", "author",
                                      "license", "licenseUrl", "attributionText", "commonsFile")})
        h["authorUrl"] = nh.get("authorUrl")
        print("re-applied naoussa hero fix ->", nh["author"])
    if (OUT / "kallidromo_img.json").exists():
        ki = json.load(open(OUT / "kallidromo_img.json"))
        img = {"src": ki["src"], "width": ki["width"], "height": ki["height"],
               "alt": "Verified Wikimedia Commons image of Kallidromo", "source": "wikimedia-commons",
               "sourceUrl": ki["sourceUrl"], "author": ki["author"], "authorUrl": ki.get("authorUrl"),
               "license": ki["license"], "licenseUrl": ki["licenseUrl"],
               "attributionText": f'{ki["author"]} / Wikimedia Commons, {ki["license"]}',
               "verified": True, "verifiedAt": "2026-07-09"}
        for city in ("livadeia", "farsala"):
            for r in nearby.get(city, []):
                if r["slug"].startswith("kallidromo-near-"):
                    r["img"] = dict(img); r["img"]["qid"] = r.get("wikidataId")
        print("re-applied Kallidromo nearby image fix ->", ki["author"])

    removed = [c for c in selected if c["slug"] in REMOVE]
    assert len(removed) == len(REMOVE), f"expected {len(REMOVE)} removals, matched {len(removed)}: {sorted(REMOVE - {c['slug'] for c in removed})}"
    for c in removed:
        NEED[c["countrySlug"]] += 1
    print("removing per country:", dict(NEED))

    kept = [c for c in selected if c["slug"] not in REMOVE]
    keep_slugs = {c["slug"] for c in kept}
    keep_qids = {c["qid"] for c in kept}
    keep_names = {(c["countrySlug"], norm(c["name"])) for c in kept}
    used_nearby = set(r["slug"] for v in nearby.items() for r in v[1]) if False else \
        set(r["slug"] for v in nearby.values() for r in v)

    adds = []
    for cc, need in NEED.items():
        raw = json.load(open(OUT / f"raw_{cc}.json"))
        pool = []
        for r in raw:
            e = eligible(r)
            if not e: continue
            if e["qid"] in keep_qids or (cc, norm(e["name"])) in keep_names: continue
            if cc == "ukraine" and not ua_safe(e["lat"], e["lon"]): continue
            if cc == "israel" and (e["lon"] > 35.0 or e["lat"] > 32.9): continue  # coastal/central, avoid WB/Golan
            e["seo"] = seo_score(e)
            pool.append(e)
        pool.sort(key=lambda x: -x["seo"])
        # verify P17 single-current-sovereign == target country (batch, top of pool)
        head = pool[:max(60, need * 6)]
        p17 = p17_of([r["qid"] for r in head])
        clean = []
        for r in head:
            sov = p17.get(r["qid"], set())
            disp = {q for q in sov if q in DISPUTE_MARK}
            if disp != {SOV_OK[cc]}:
                continue  # rejects dual-sovereign (Kosovo/Russia/Palestine/Turkey) or wrong sole tag
            clean.append(r)
        print(f"\n[{cc}] eligible={len(pool)} P17-clean(head)={len(clean)} need={need}")

        got, used_slugs = 0, set()
        for r in clean:
            if got >= need: break
            sg = assign_slug(r, keep_slugs | used_slugs)
            if not sg: continue
            recs = NR.resolve_city({**r, "slug": sg}, used_nearby)
            if len(recs) < 5:
                continue
            h = hero_for(r)
            if not h:
                continue
            used_slugs.add(sg); keep_names.add((cc, norm(r["name"]))); keep_qids.add(r["qid"])
            r2 = dict(r); r2["slug"] = sg
            adds.append(r2); heroes[sg] = h; nearby[sg] = recs; got += 1
            print(f"  +{sg:24s} {r['name'][:22]:22s} {r['qid']:10s} lat={r['lat']:.2f} lon={r['lon']:.2f} "
                  f"P17ok nearby={len(recs)} hero={h['width']}x{h['height']}")
        if got < need:
            print(f"  !! only {got}/{need} for {cc}"); sys.exit(1)

    for c in removed:
        heroes.pop(c["slug"], None); nearby.pop(c["slug"], None)
    selected = kept + adds

    json.dump(selected, open(OUT / "selected.json", "w"), ensure_ascii=False)
    json.dump(heroes, open(OUT / "heroes.json", "w"), ensure_ascii=False)
    json.dump(nearby, open(OUT / "nearby.json", "w"), ensure_ascii=False)
    cnt = [len(v) for v in nearby.values()]
    print(f"\nremoved {len(removed)}, added {len(adds)} | selected={len(selected)} heroes={len(heroes)}")
    print("per-country:", dict(Counter(c["countrySlug"] for c in selected)))
    print(f"nearby total={sum(cnt)} under5={sum(1 for x in cnt if x < 5)} "
          f"heroes==selected==375: {len(heroes) == len(selected) == 375}")


if __name__ == "__main__":
    main()
