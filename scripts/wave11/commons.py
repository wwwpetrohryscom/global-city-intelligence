#!/usr/bin/env python3
"""Commons + Wikidata EntityData helpers for Wave 11 image resolution.
Endpoints (NOT the rate-limited WDQS): commons.wikimedia.org API + Special:EntityData."""
import json, urllib.parse, urllib.request, urllib.error, time, re, html

UA = "GCI-wave11/1.0 (titan95431@gmail.com) python-urllib"
COMMONS = "https://commons.wikimedia.org/w/api.php"

def _get(url, timeout=30, retries=6, expect=None):
    """expect: a key whose presence means a valid response; if absent (or an
    'error' key present) we treat it as transient throttling and retry."""
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                d = json.loads(r.read().decode())
            if "error" in d or (expect and expect not in d):
                last = RuntimeError(f"throttled/empty: {str(d)[:120]}")
                time.sleep(2 + i * 2); continue
            return d
        except Exception as e:
            last = e; time.sleep(2 + i * 2)
    raise RuntimeError(f"GET failed: {last}")

def entity_claims(qid, timeout=30):
    d = _get(f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json", timeout, expect="entities")
    return d["entities"][qid]["claims"]

def claim_values(claims, prop):
    out = []
    for c in claims.get(prop, []):
        dv = c.get("mainsnak", {}).get("datavalue")
        if dv: out.append(dv["value"])
    return out

def imageinfo(filename, width=1280, timeout=30):
    """Return dict with url(thumb), width, height, ow, oh, mime, license, licenseUrl,
    artist, descriptionurl, categories — or None if missing."""
    params = {"action": "query", "format": "json", "titles": "File:" + filename,
              "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata",
              "iiurlwidth": str(width),
              "iiextmetadatafilter": "License|LicenseShortName|LicenseUrl|Artist|Categories|ImageDescription"}
    d = _get(COMMONS + "?" + urllib.parse.urlencode(params), timeout, expect="query")
    pages = d.get("query", {}).get("pages", {})
    for _, p in pages.items():
        if "missing" in p or "imageinfo" not in p:
            return None
        ii = p["imageinfo"][0]; em = ii.get("extmetadata", {})
        def e(k): return (em.get(k, {}) or {}).get("value")
        return {
            "url": ii.get("thumburl") or ii.get("url"),
            "width": ii.get("thumbwidth") or ii.get("width"),
            "height": ii.get("thumbheight") or ii.get("height"),
            "ow": ii.get("width"), "oh": ii.get("height"), "mime": ii.get("mime"),
            "descriptionurl": ii.get("descriptionurl"),
            "licenseCode": e("License"), "licenseShort": e("LicenseShortName"),
            "licenseUrl": e("LicenseUrl"), "artist": e("Artist"),
            "categories": e("Categories"),
        }
    return None

def category_files(category, limit=60, timeout=30):
    """List file titles in a Commons category (no 'Category:' prefix needed)."""
    cat = category if category.lower().startswith("category:") else "Category:" + category
    params = {"action": "query", "format": "json", "list": "categorymembers",
              "cmtitle": cat, "cmtype": "file", "cmlimit": str(limit)}
    d = _get(COMMONS + "?" + urllib.parse.urlencode(params), timeout, expect="query")
    return [m["title"].split(":", 1)[1] for m in d.get("query", {}).get("categorymembers", [])]

# ---------------- filtering / normalization ----------------
BAD_FILE_TOKENS = ("flag", "coat_of_arms", "coat-of-arms", "emblem", "wappen", "seal_of_",
    "dannebrog", "tricolour", "tricolore", "_deckel", "woerterbuch", "_cover", "_culture.",
    "_montage", "montage_", "photomontage",
    # extra (task: reject maps/logos/collages/diagrams/locators)
    "logo", "_map.", "_map_", "locator", "location_map", "collage", "diagram",
    "blason", "stadtplan", "plan_de_", ".svg")

def file_unsuitable(filename):
    # check BOTH the space form and the underscore form (the src URL uses underscores)
    n = filename.lower()
    nu = filename.replace(" ", "_").lower()
    return any(t in n or t in nu for t in BAD_FILE_TOKENS)

# nearby-validator SUSPICIOUS_SRC_PATTERNS (applied to filename) — must avoid these
_NEARBY_PAT = re.compile(
    r"montage|collage|/flag_|_flag\.|_flag_|coat[_-]of[_-]arms|emblem|_logo_|/logo_|_logo\.|"
    r"/map_|_map\.|protest|military|disaster|postcard|"
    r"ferraris|ordnance|topograf|mapa|\bcarte\b|\bkaart\b|\bkaarte\b|\bkarte\b|mtn25|mtn-|/sheet_|_sheet\.|"
    r"butterfly|\badmiral\b|\binsect\b|beetle|\bmoth\b|\bbee\b|honey.?bee|\bwasp\b|spider|\bsnail\b|dragonfly|"
    r"fungus|fungi|mushroom|\bzwam\b|koraal|amanita|amaniet|toadstool|"
    r"\bflower\b|\bbloom\b|lichen|\bmoss\b|"
    r"\btown\b|rathaus|altstadt|ortskern|downtown", re.IGNORECASE)

_NEARBY_HARD = ("flag", "coat_of_arms", "coat-of-arms", "emblem", "wappen", "seal_of_",
    "_montage", "montage_", "photomontage", "_culture.", "_deckel")
def nearby_file_unsuitable(filename):
    """Mirror the validator's SUSPICIOUS_SRC_PATTERNS exactly (checked vs both the
    underscore src form and the space sourceUrl form), plus a few hard tokens.
    Deliberately NOT the broad BAD_FILE_TOKENS (its '_map' over-matches 'Mapillary')."""
    nu = filename.replace(" ", "_").lower()
    if any(t in nu for t in _NEARBY_HARD): return True
    return bool(_NEARBY_PAT.search(filename) or _NEARBY_PAT.search(filename.replace(" ", "_")))

def license_ok(code, short):
    """Accept CC0/CC BY/CC BY-SA/PD; reject NC/ND and everything else."""
    blob = ((code or "") + " " + (short or "")).lower()
    if "nc" in re.split(r"[-\s]", blob) or "nd" in re.split(r"[-\s]", blob):
        return False
    if re.search(r"\bby-nc|by-nd|noncommercial|no-?deriv", blob): return False
    if re.search(r"\bgfdl\b|fal\b|\bcc-by-sa-1\.0|attribution-only-non", blob):
        # GFDL/FAL not in allowed prefix set; reject
        if "cc" not in blob: return False
    c = (code or "").lower(); s = (short or "").lower()
    if c.startswith("cc0") or s.startswith("cc0"): return True
    if c.startswith("cc-by") or s.startswith("cc by") or s.startswith("cc-by"): return True
    if "public domain" in s or c.startswith("pd") or "pd-" in c or c == "pd": return True
    if s.startswith("public domain") or s == "pd": return True
    return False

def normalize_license(code, short):
    c = (code or "").lower(); s = (short or "")
    ver = ""
    m = re.search(r"(\d\.\d)", c) or re.search(r"(\d\.\d)", s)
    if m: ver = " " + m.group(1)
    if c.startswith("cc0") or s.lower().startswith("cc0"):
        return "CC0", "https://creativecommons.org/publicdomain/zero/1.0/"
    if "by-sa" in c or "by-sa" in s.lower():
        return ("CC BY-SA" + ver).strip(), f"https://creativecommons.org/licenses/by-sa/{ver.strip() or '4.0'}/"
    if c.startswith("cc-by") or s.lower().startswith("cc by"):
        return ("CC BY" + ver).strip(), f"https://creativecommons.org/licenses/by/{ver.strip() or '4.0'}/"
    # public domain / PD
    return "Public Domain", "https://en.wikipedia.org/wiki/Public_domain"

def clean_author(artist):
    if not artist: return None
    # try to capture an explicit link/user name first
    a = html.unescape(artist)
    a = re.sub(r"<[^>]+>", " ", a)
    a = re.sub(r"\s+", " ", a).strip().strip(",;|")
    if not a: return None
    low = a.lower()
    if ("unknown" in low or "not provided" in low or "anonym" in low or "machine-readable" in low
            or "own work assumed" in low or "no machine" in low
            or low in ("n/a", "self", "see source", "self-published work", "no")):
        return None
    # distill verbose / url-bearing author blobs
    if len(a) > 60 or "http" in low or "@" in a or "creativecommons" in low or "©" in a:
        # try a leading proper-name token
        m = re.match(r"([A-Z][\w.\-']+(?: [A-Z][\w.\-']+){0,2})", a)
        if m and len(m.group(1)) <= 40 and "unknown" not in m.group(1).lower():
            return m.group(1)
        return "Wikimedia Commons contributor"
    return a

def author_url(artist):
    if not artist: return None
    m = re.search(r'href="(//commons\.wikimedia\.org/wiki/User:[^"]+|https?://[^"]+)"', artist)
    if not m: return None
    u = m.group(1)
    if u.startswith("//"): u = "https:" + u
    return u
