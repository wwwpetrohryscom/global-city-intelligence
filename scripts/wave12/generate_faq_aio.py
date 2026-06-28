#!/usr/bin/env python3
"""Wave 12: deterministically generate FAQ + AI-Overview content for the 250 NEW
cities, composed from their already-generated Phase A–F prose summaries + key
numbers + nearby nature (no hallucination, no network). Writes NEW data files
lib/data/city-faqs.ts and lib/data/city-ai-overviews.ts (new cities only)."""
import json, re
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")
OUT = Path("/tmp/w12")
sel = json.load(open(OUT / "selected.json"))
nearby = json.load(open(OUT / "nearby.json"))
COUNTRY = {"united-states": "the United States", "canada": "Canada", "australia": "Australia",
           "germany": "Germany", "france": "France", "united-kingdom": "the United Kingdom"}
CUR = {"USD": "$", "CAD": "C$", "AUD": "A$", "EUR": "€", "GBP": "£"}

def art(word):
    return "an" if word and word[0].lower() in "aeiou" else "a"

def fmt_money(v, cur):
    sym = CUR.get(cur, "")
    return f"{sym}{int(round(v)):,}" + ("" if sym else f" {cur}")

# ---- parse each phase .ts into {slug: {field: value}} ----
def parse_records(path, array_anchor):
    s = (ROOT / path).read_text()
    i = s.index(array_anchor); s = s[i:]
    # split into top-level records; each starts with "  {\n    citySlug:"
    recs = {}
    for m in re.finditer(r'\{\s*citySlug:\s*"([a-z0-9-]+)"([\s\S]*?)\n  \},', s):
        slug = m.group(1); body = m.group(2)
        d = {}
        for fm in re.finditer(r'(\w+):\s*("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|\[[^\]]*\])', body):
            k, v = fm.group(1), fm.group(2)
            if v.startswith('"'): d[k] = v[1:-1].replace('\\"', '"')
            elif v.startswith('['): d[k] = re.findall(r'"([^"]+)"', v)
            else: d[k] = float(v) if '.' in v else int(v)
        recs[slug] = d
    return recs

col = parse_records("lib/data/cost-of-living.ts", "costOfLivingProfiles")
clim = parse_records("lib/data/climate.ts", "climateProfiles")
qual = parse_records("lib/data/city-quality.ts", "cityQualityProfiles")
econ = parse_records("lib/data/economy.ts", "economyProfiles")
edu = parse_records("lib/data/education.ts", "educationProfiles")
hcare = parse_records("lib/data/healthcare-retirement.ts", "healthcareProfiles")
retire = parse_records("lib/data/healthcare-retirement.ts", "retirementProfiles")

def band(score, hi=78, mid=62):
    return "strong" if score >= hi else ("moderate" if score >= mid else "more limited")

faqs_out, aio_out = {}, {}
for c in sel:
    slug, name = c["slug"], c["name"]
    cn = COUNTRY[c["countrySlug"]]
    cl = col.get(slug, {}); cm = clim.get(slug, {}); q = qual.get(slug, {})
    ec = econ.get(slug, {}); ed = edu.get(slug, {}); hc = hcare.get(slug, {}); rt = retire.get(slug, {})
    npl = nearby.get(slug, [])
    nat_names = [r["name"] for r in npl[:4]]
    nat_list = ", ".join(nat_names[:3]) + (f" and {nat_names[3]}" if len(nat_names) > 3 else "")
    industries = ec.get("dominantIndustries", []) or []
    ind = ", ".join(industries[:3]).lower() if industries else "a mixed local economy"
    single = cl.get("monthlyCostSingle"); cur = cl.get("localCurrency", "")
    rent1 = cl.get("rentOneBedroom")
    aff = cl.get("affordabilityScore", 50)
    afftext = "more affordable than average" if aff >= 62 else ("around average cost" if aff >= 48 else "relatively expensive")
    costadj = "below-average" if aff >= 62 else ("around-average" if aff >= 48 else "above-average")
    econ_label = ec.get("economyCategory", "regional").replace("_", " ")

    # ---------- AI Overview (answer-first, 40-80 words) ----------
    aio = []
    aio.append(("Why live in " + name + "?",
        f"{name} is an indexed city in {cn} that scores {q.get('qualityOfLifeScore', 60)} for quality of life on our index. "
        f"It combines {ind} with {costadj} living costs, and sits within weekend reach of nature such as {nat_list or 'nearby parks and countryside'}. Use the profile to compare it against peer cities before relocating."))
    if single and cur:
        aio.append(("Is " + name + " expensive?",
            f"Living costs in {name} are {afftext}. A single resident needs roughly {fmt_money(single, cur)} per month including a typical one-bedroom rent of about {fmt_money(rent1, cur) if rent1 else 'mid-range'}. "
            f"These are deterministic estimates from country baselines and city size, not quoted prices — confirm current rents and bills locally before budgeting."))
    if q.get("safetySummary"):
        aio.append(("Is " + name + " safe?", q["safetySummary"][:300]))
    if cm.get("hottestMonth"):
        aio.append(("When is the best time to visit " + name + "?",
            f"{name} has {art(cm.get('climateZone','temperate'))} {cm.get('climateZone','temperate').lower()} climate with an annual average around {cm.get('annualAvgTempC','')}°C. "
            f"The warmest month is {cm.get('hottestMonth')} and the coldest is {cm.get('coldestMonth')}; the driest is typically {cm.get('driestMonth','summer')}. "
            f"Late spring through early autumn is usually the most comfortable window for visiting and outdoor trips."))
    if single and cur:
        annual = int(round(single * 12 * 1.35))
        aio.append(("What salary do you need in " + name + "?",
            f"As a rough guide, a single person in {name} should plan for take-home pay above about {fmt_money(single*1.35, cur)} per month (around {fmt_money(annual, cur)} net per year) to cover rent, food, transport and essentials comfortably. "
            f"Households and central locations cost more; treat these as orientation figures, not salary advice."))
    aio.append(("What is " + name + " known for?",
        f"{name} is known as {art(econ_label)} {econ_label} in {cn}, with its economy oriented toward {ind}. "
        f"Nearby it offers access to nature such as {nat_list or 'parks and countryside'}. The profile indexes its cost of living, climate, safety, economy, education and healthcare for comparison."))
    if rt.get("retirementSummary"):
        aio.append(("Can you retire in " + name + "?", rt["retirementSummary"][:300]))
    if ed.get("studentExperienceSummary") or ed.get("educationSummary"):
        aio.append(("Can you study in " + name + "?", (ed.get("educationSummary") or ed.get("studentExperienceSummary"))[:300]))
    if ec.get("jobsSummary"):
        aio.append(("What is it like to work in " + name + "?", ec["jobsSummary"][:300]))
    if nat_names:
        aio.append(("What nature is near " + name + "?",
            f"Within about 170 km of {name} you can reach nature destinations including {nat_list}. "
            f"These are verified parks, reserves, lakes, coasts and uplands suitable for day trips and weekend breaks. See the nearby weekend places section on the {name} profile for the full, source-linked list."))
    aio_out[slug] = [{"question": qx, "answer": re.sub(r"\s+", " ", ax).strip()} for qx, ax in aio if ax]

    # ---------- FAQ (topic-based, ~10) ----------
    faq = []
    if single and cur:
        faq.append(("cost", f"How much does it cost to live in {name}?",
            f"On our deterministic index a single resident of {name} spends roughly {fmt_money(single, cur)} per month, with a one-bedroom rent near {fmt_money(rent1, cur) if rent1 else 'the local mid-range'}. "
            f"Overall the city is {afftext} for {cn}. These are modelled estimates from country baselines and city size, not live quotes — verify current prices locally."))
    if q.get("safetySummary"): faq.append(("safety", f"Is {name} a safe place to live?", q["safetySummary"]))
    if cm.get("climateZone"):
        faq.append(("climate", f"What is the climate like in {name}?",
            f"{name} has {art(cm.get('climateZone'))} {cm.get('climateZone').lower()} climate, averaging about {cm.get('annualAvgTempC','')}°C annually with roughly {cm.get('annualPrecipitationMm','')} mm of rain. "
            f"The hottest month is {cm.get('hottestMonth')} and the coldest {cm.get('coldestMonth')}. Check a current forecast before travel."))
    if hc.get("healthcareSummary"): faq.append(("healthcare", f"What is healthcare like in {name}?", hc["healthcareSummary"]))
    if ed.get("educationSummary"): faq.append(("education", f"What are the education options in {name}?", ed["educationSummary"]))
    if rt.get("retirementSummary"): faq.append(("retirement", f"Is {name} a good place to retire?", rt["retirementSummary"]))
    if ec.get("jobsSummary"): faq.append(("jobs", f"What is the job market like in {name}?", ec["jobsSummary"]))
    if nat_names:
        faq.append(("nature", f"What nature and outdoor places are near {name}?",
            f"Nature destinations within about 170 km of {name} include {nat_list}. They are verified parks, reserves, lakes, coasts and uplands for day and weekend trips; the {name} profile links each with its official source."))
    walk = q.get("walkabilityScore")
    if walk is not None:
        cyc = q.get("cyclingScore")
        faq.append(("transportation", f"How easy is it to get around {name}?",
            f"{name} indexes a walkability score of {walk} and a cycling score of {cyc} out of 100, reflecting how navigable the city is on foot and by bike. "
            f"For local transit fares and routes, check the official operator before travel — the index does not publish live schedules or prices."))
    if nat_names:
        faq.append(("weekend", f"What weekend trips can you take from {name}?",
            f"Good weekend options from {name} include nature destinations such as {nat_list}, plus nearby indexed cities shown in the discovery section of its profile. "
            f"All are within weekend reach; verify access, opening times and conditions with official sources first."))
    faqs_out[slug] = [{"category": cat, "question": qx, "answer": re.sub(r"\s+", " ", ax).strip()} for cat, qx, ax in faq if ax]

# ---- emit lib/data/city-faqs.ts ----
def jstr(s): return json.dumps(s, ensure_ascii=False)
def emit(path, var, typ, data, item_keys):
    L = [f'import type {{ {typ} }} from "@/types/faq";', "",
         f"export const {var}: readonly {typ}[] = ["]
    for slug, items in data.items():
        L.append(f"  {{")
        L.append(f"    citySlug: {jstr(slug)},")
        L.append(f"    items: [")
        for it in items:
            parts = ", ".join(f"{k}: {jstr(it[k])}" for k in item_keys if k in it)
            L.append(f"      {{ {parts} }},")
        L.append(f"    ],")
        L.append(f"  }},")
    L.append("];")
    (ROOT / path).write_text("\n".join(L) + "\n")
    print(f"{path}: {len(data)} cities, {sum(len(v) for v in data.values())} items")

emit("lib/data/city-faqs.ts", "cityFaqs", "CityFaq", faqs_out, ["category", "question", "answer"])
emit("lib/data/city-ai-overviews.ts", "cityAiOverviews", "CityAiOverview", aio_out, ["question", "answer"])
print("FAQ/AIO generation done")
