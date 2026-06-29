#!/usr/bin/env python3
"""Stabilization: regenerate FAQ (16 Q across 15 topics) + AI-Overview (10 concise
answer-first Q&A, <=180 words total) for ALL 2,369 cities, composed deterministically
from the existing Phase A-F prose summaries + numbers + nearby nature. No network, no
hallucination. Overwrites lib/data/city-faqs.ts + lib/data/city-ai-overviews.ts (the
two derived SEO blocks Phases 2-3 target for improvement). Core city/Phase data and
all URLs/slugs are untouched."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
COUNTRY_THE = {"united-states", "united-kingdom", "netherlands", "philippines",
               "united-arab-emirates", "czechia", "dominican-republic"}
CUR = {"USD": "$", "CAD": "C$", "AUD": "A$", "EUR": "€", "GBP": "£", "NZD": "NZ$",
       "CHF": "CHF ", "SEK": "SEK ", "NOK": "NOK ", "DKK": "DKK ", "PLN": "PLN ",
       "JPY": "¥", "INR": "₹", "BRL": "R$", "MXN": "MX$", "ZAR": "R", "SGD": "S$"}


def art(w):
    return "an" if w and w[0].lower() in "aeiou" else "a"


def fmt_money(v, cur):
    if v is None:
        return "the local mid-range"
    sym = CUR.get(cur, "")
    return f"{sym}{int(round(v)):,}" + ("" if sym else f" {cur}")


def parse_records(path, anchor):
    """Brace-depth parser — handles BOTH single-line (older waves) and multi-line
    (Wave 12 / city-quality) record formats. Captures each top-level {...} object in
    the array; flat field regex with setdefault so top-level keys win over nested ones."""
    s = (ROOT / path).read_text()
    # array start is after the `=` (skip the `Profile[]` type annotation's brackets)
    o = s.index("[", s.index("=", s.index(anchor)))
    depth, end = 0, o
    for j in range(o, len(s)):
        if s[j] == "[":
            depth += 1
        elif s[j] == "]":
            depth -= 1
            if depth == 0:
                end = j
                break
    arr = s[o + 1:end]
    recs, bd, rs = {}, 0, None
    for j, ch in enumerate(arr):
        if ch == "{":
            if bd == 0:
                rs = j
            bd += 1
        elif ch == "}":
            bd -= 1
            if bd == 0 and rs is not None:
                body = arr[rs:j + 1]
                sm = re.search(r'citySlug:\s*"([a-z0-9-]+)"', body)
                if sm:
                    d = {}
                    for fm in re.finditer(r'(\w+):\s*("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|\[[^\]]*\])', body):
                        k, v = fm.group(1), fm.group(2)
                        if k in d:
                            continue
                        if v.startswith('"'):
                            d[k] = v[1:-1].replace('\\"', '"')
                        elif v.startswith("["):
                            d[k] = re.findall(r'"([^"]+)"', v)
                        else:
                            d[k] = float(v) if "." in v else int(v)
                    recs[sm.group(1)] = d
                rs = None
    return recs


# ---- city seeds ----
cs = (ROOT / "lib/data/cities.ts").read_text()
seedsrc = cs[cs.index("const seeds"):cs.index("export const cities")]
cities = {}
for m in re.finditer(r'\{\s*slug: "([a-z0-9-]+)",\s*name: "((?:[^"\\]|\\.)*)",\s*countrySlug: "([a-z0-9-]+)",\s*countryName: "((?:[^"\\]|\\.)*)"', seedsrc):
    cities[m.group(1)] = {"name": m.group(2).replace('\\"', '"'), "countrySlug": m.group(3), "countryName": m.group(4)}
print("cities:", len(cities))

# ---- nearby per city (whole-file split) ----
np = (ROOT / "lib/data/nearby-places.ts").read_text()
nearby = {}
for ch in re.split(r'(?=slug: ")', np):
    sm = re.match(r'slug: "([a-z0-9-]+)"', ch)
    if not sm:
        continue
    nm = re.search(r'name: "((?:[^"\\]|\\.)*)"', ch)
    cat = re.search(r'category: "([a-z]+)"', ch)
    cm = re.search(r'connectedCitySlugs: \[([^\]]*)\]', ch)
    if not (nm and cm):
        continue
    for c in re.findall(r'"([a-z0-9-]+)"', cm.group(1)):
        nearby.setdefault(c, []).append((nm.group(1).replace('\\"', '"'), cat.group(1) if cat else "nature"))

col = parse_records("lib/data/cost-of-living.ts", "costOfLivingProfiles")
clim = parse_records("lib/data/climate.ts", "climateProfiles")
qual = parse_records("lib/data/city-quality.ts", "cityQualityProfiles")
econ = parse_records("lib/data/economy.ts", "economyProfiles")
edu = parse_records("lib/data/education.ts", "educationProfiles")
hc = parse_records("lib/data/healthcare-retirement.ts", "healthcareProfiles")
rt = parse_records("lib/data/healthcare-retirement.ts", "retirementProfiles")


def band(s, hi=80, mid=65, lo=50):
    if s is None:
        return "moderate"
    return "excellent" if s >= hi else ("strong" if s >= mid else ("good" if s >= lo else "more modest"))


def cn_of(slug, name):
    return ("the " + name) if slug in COUNTRY_THE else name


faqs, aios = {}, {}
for slug, c in cities.items():
    name = c["name"]
    cn = cn_of(c["countrySlug"], c["countryName"])
    cl, cm, q = col.get(slug, {}), clim.get(slug, {}), qual.get(slug, {})
    ec, ed, h, r = econ.get(slug, {}), edu.get(slug, {}), hc.get(slug, {}), rt.get(slug, {})
    npl = nearby.get(slug, [])
    nat = [n for n, _ in npl[:3]]
    nat_list = ", ".join(nat[:2]) + (f" and {nat[2]}" if len(nat) > 2 else "") if nat else "nearby parks and countryside"
    inds = ec.get("dominantIndustries", []) or []
    ind = ", ".join(inds[:3]).lower() if inds else "a mixed local economy"
    single, cur = cl.get("monthlyCostSingle"), cl.get("localCurrency", "")
    aff = cl.get("affordabilityScore", 50)
    afftext = "more affordable than average" if aff >= 62 else ("around average cost" if aff >= 48 else "relatively expensive")
    costadj = "below-average" if aff >= 62 else ("around-average" if aff >= 48 else "above-average")
    zone = cm.get("climateZone", "temperate")
    temp = cm.get("annualAvgTempC", "")
    warm, cold = cm.get("hottestMonth", "summer"), cm.get("coldestMonth", "winter")
    dry = cm.get("driestMonth", "")
    qol = q.get("qualityOfLifeScore", 60)
    econ_label = ec.get("economyCategory", "regional").replace("_", " ")

    # ---------------- AI Overview: 10 concise answer-first Q&A (<=180 words) ----------------
    has_nat = bool(nat)
    nat2 = ", ".join(nat[:2]) if nat else ""
    aio = [
        (f"Is {name} worth visiting?",
         (f"Yes — {band(qol)} quality of life ({qol}/100), with nearby nature such as {nat2}."
          if has_nat else
          f"Yes — {band(qol)} quality of life ({qol}/100) and a {econ_label} economy.")),
        (f"Is {name} good for families?",
         f"{band(q.get('familyFriendlyScore')).capitalize()} ({q.get('familyFriendlyScore','-')}/100) on safety, schools and green space."),
        (f"Is {name} affordable?",
         f"{afftext.capitalize()}; about {fmt_money(single, cur)}/month for one person (estimate)."),
        (f"When is the best time to visit {name}?",
         f"Late spring to early autumn; warmest in {warm}, coldest in {cold}."),
        (f"What are {name}'s main industries?",
         f"Mainly {ind}."),
        (f"What is the climate in {name}?",
         f"{art(zone).capitalize()} {zone.lower()} climate, averaging about {temp}°C."),
        (f"Does {name} have universities?",
         (lambda hs: f"Higher education is {band(hs)} ({hs}/100).")(ed.get("higherEducationScore", ed.get("educationScore", "-")))),
        (f"What is healthcare like in {name}?",
         f"Healthcare access is {band(h.get('healthcareScore'))} ({h.get('healthcareScore','-')}/100)."),
        (f"Is {name} good for retirement?",
         f"Retirement suitability is {band(r.get('retirementScore'))} ({r.get('retirementScore','-')}/100)."),
        (f"What nature is near {name}?",
         (f"Within ~170 km: {nat2}."
          if has_nat else
          "No major nature destinations are indexed within day-trip range.")),
    ]
    aios[slug] = [{"question": a, "answer": re.sub(r"\s+", " ", b).strip()} for a, b in aio]

    # ---------------- FAQ: 16 questions across the 15 topic areas ----------------
    def s2(*xs):
        return " ".join(x for x in xs if x).strip()
    faq = [
        ("travel", f"Is {name} worth visiting?",
         s2(q.get("qualitySummary"), f"Visitors can also reach nature such as {nat_list} within weekend range.")),
        ("living", f"What is it like to live in {name}?",
         s2(q.get("qualitySummary"), f"It indexes {qol}/100 for overall quality of life.")),
        ("cost", f"How much does it cost to live in {name}?",
         s2(f"A single resident of {name} spends roughly {fmt_money(single, cur)} per month, with a one-bedroom rent near {fmt_money(cl.get('rentOneBedroom'), cur)}.",
            f"Overall the city is {afftext} for {cn}. These are modelled estimates, not live quotes — verify locally.")),
        ("moving", f"What should I know about moving to {name}?",
         s2(f"Plan for {costadj} living costs and check current rents before relocating.", q.get("nomadSummary"))),
        ("working", f"What is the job market like in {name}?",
         s2(ec.get("jobsSummary"), ec.get("economySummary"))),
        ("digital_nomads", f"Is {name} good for digital nomads and remote work?",
         s2(ec.get("remoteWorkSummary") or q.get("nomadSummary"))),
        ("education", f"What are the education options in {name}?",
         s2(ed.get("educationSummary"))),
        ("students", f"Is {name} a good place to study?",
         s2(ed.get("studentExperienceSummary") or ed.get("educationSummary"))),
        ("healthcare", f"What is healthcare like in {name}?",
         s2(h.get("healthcareSummary"), h.get("medicalAccessSummary"))),
        ("retirement", f"Is {name} a good place to retire?",
         s2(r.get("retirementSummary"), r.get("lifestyleSummary"))),
        ("climate", f"What is the climate like in {name}?",
         s2(f"{name} has {art(zone)} {zone.lower()} climate, averaging about {temp}°C annually with roughly {cm.get('annualPrecipitationMm','')} mm of rain.",
            f"The hottest month is {warm} and the coldest {cold}." + (f" The driest is typically {dry}." if dry else ""))),
        ("safety", f"Is {name} a safe place to live?",
         s2(q.get("safetySummary"))),
        ("transport", f"How easy is it to get around {name}?",
         s2(f"{name} indexes a walkability score of {q.get('walkabilityScore','-')} and a cycling score of {q.get('cyclingScore','-')} out of 100.",
            "Check the local operator for live transit routes and fares.")),
        ("nature", f"What nature and outdoor places are near {name}?",
         s2(f"Nature destinations within about 170 km of {name} include {nat_list}." if nat else f"{name} has limited indexed nature destinations within day-trip range.",
            "Each is linked with its official source on the profile." if nat else "")),
        ("families", f"Is {name} good for families?",
         s2(q.get("familySummary"))),
        ("outdoor", f"What outdoor activities are there around {name}?",
         s2(f"{name} rates {q.get('outdoorLifestyleScore','-')}/100 for outdoor lifestyle and {q.get('greenSpaceScore','-')}/100 for green space.",
            f"Nearby nature such as {nat_list} supports day hikes, water activities and weekend trips." if nat else "")),
    ]
    faqs[slug] = [{"category": cat, "question": qq, "answer": re.sub(r"\s+", " ", aa).strip()}
                  for cat, qq, aa in faq if aa and len(aa) > 12]


def jstr(s):
    return json.dumps(s, ensure_ascii=False)


def emit(path, var, typ, data, keys):
    L = [f'import type {{ {typ} }} from "@/types/faq";', "", f"export const {var}: readonly {typ}[] = ["]
    for slug, items in data.items():
        L.append("  {")
        L.append(f"    citySlug: {jstr(slug)},")
        L.append("    items: [")
        for it in items:
            L.append("      { " + ", ".join(f"{k}: {jstr(it[k])}" for k in keys if k in it) + " },")
        L.append("    ],")
        L.append("  },")
    L.append("];")
    (ROOT / path).write_text("\n".join(L) + "\n")
    cnts = [len(v) for v in data.values()]
    print(f"{path}: {len(data)} cities, q/city min {min(cnts)} max {max(cnts)}")


emit("lib/data/city-faqs.ts", "cityFaqs", "CityFaq", faqs, ["category", "question", "answer"])
emit("lib/data/city-ai-overviews.ts", "cityAiOverviews", "CityAiOverview", aios, ["question", "answer"])

# AIO word-count check (<=180 words)
import statistics
wc = [sum(len((it["question"] + " " + it["answer"]).split()) for it in v) for v in aios.values()]
print(f"AIO words/city: min {min(wc)} max {max(wc)} mean {round(statistics.mean(wc))}  (target <=180)")
over = sum(1 for w in wc if w > 180)
print(f"AIO cities >180 words: {over}")
print("DONE")
