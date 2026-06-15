#!/usr/bin/env python3
"""Deterministic Climate generator. Latitude drives temperature level + seasonal
amplitude; a per-country regime (refined by lat/lon for US/Canada/Australia)
drives precipitation distribution, sunshine, and climate zone. No randomness, no
network, no weather API. Writes lib/data/climate.ts (data + guard + access).

comfortScore (0-100) = 0.30*tempComfort + 0.15*rainfallBalance + 0.15*sunshine
                       + 0.15*seasonality + 0.125*mildWinter + 0.125*mildSummer
  tempComfort  : share of months with avgHigh in [16,30] and avgLow >= 4
  rainfallBalance: 100 in [500,1100] mm/yr, tapering for drier/wetter
  sunshine     : annual sunshine hours scaled 1000h->0 .. 2600h->100
  seasonality  : 100 - 2.2*(warmest-coldest monthly mean swing)
  mildWinter   : 100 if coldest avgLow >= 0, else -4 per degree below
  mildSummer   : 100 if hottest avgHigh <= 30, else -7 per degree above
"""
import json, math, os
ROOT = "/Users/agent/global-city-intelligence"
cities = json.load(open("/tmp/col_cities.json"))
coords = json.load(open("/tmp/city_coords.json")) if os.path.exists("/tmp/city_coords.json") else {}
HARD_LAT = {  # 10 cities missing from the coords cache (lat is enough for climate)
    "valparaiso": -33.05, "munster": 51.96, "tacoma": 47.25, "vicenza": 45.55,
    "hyderabad": 17.39, "santa-rosa": 38.44, "jaipur": 26.92, "elche": 38.27,
    "prato": 43.88, "salinas": 36.68,
}
HARD_LON = {"valparaiso": -71.6, "munster": 7.6, "tacoma": -122.4, "vicenza": 11.5,
            "hyderabad": 78.5, "santa-rosa": -122.7, "jaipur": 75.8, "elche": -0.7,
            "prato": 11.1, "salinas": -121.6}

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

# country -> (regime, annualPrecipMm)
R = {
 'united-kingdom':('oceanic',1100),'ireland':('oceanic',1150),'netherlands':('maritime',820),
 'belgium':('maritime',850),'new-zealand':('oceanic',1100),'iceland':('subarctic',900),
 'denmark':('maritime',730),'norway':('oceanic',1000),'portugal':('mediterranean',750),
 'spain':('mediterranean',600),'italy':('mediterranean',800),'greece':('mediterranean',650),
 'croatia':('mediterranean',900),'montenegro':('mediterranean',1600),'albania':('mediterranean',1100),
 'north-macedonia':('continental',600),'turkey':('mediterranean',600),'israel':('mediterranean',550),
 'lebanon':('mediterranean',800),'tunisia':('semiarid',400),'morocco':('semiarid',350),
 'germany':('continental',720),'france':('oceanic',780),'poland':('continental',600),
 'czechia':('continental',600),'slovakia':('continental',650),'hungary':('continental',600),
 'austria':('continental',800),'romania':('continental',640),'bulgaria':('continental',600),
 'serbia':('continental',680),'ukraine':('continental',600),'moldova':('continental',550),
 'lithuania':('continental',680),'latvia':('continental',680),'estonia':('continental',680),
 'slovenia':('continental',1300),'bosnia-and-herzegovina':('continental',1000),
 'switzerland':('continental',1050),'luxembourg':('continental',870),
 'finland':('subarctic',650),'sweden':('continental',600),
 'canada':('continental',700),'united-states':('continental',900),'australia':('semiarid',500),
 'japan':('humid_subtropical',1500),'south-korea':('humid_subtropical',1300),'china':('continental',650),
 'hong-kong':('humid_subtropical',2400),'taiwan':('humid_subtropical',2500),'singapore':('tropical',2300),
 'malaysia':('tropical',2500),'thailand':('monsoon',1500),'vietnam':('monsoon',1800),
 'philippines':('tropical',2400),'indonesia':('tropical',2700),'cambodia':('monsoon',1400),
 'india':('monsoon',1100),'pakistan':('arid',300),'sri-lanka':('tropical',2000),
 'brazil':('tropical',1500),'mexico':('semiarid',700),'argentina':('humid_subtropical',900),
 'chile':('mediterranean',400),'colombia':('tropical',1500),'peru':('arid',150),
 'ecuador':('tropical',1200),'uruguay':('humid_subtropical',1100),'panama':('tropical',2000),
 'costa-rica':('tropical',2500),'guatemala':('tropical',1300),'dominican-republic':('tropical',1400),
 'south-africa':('semiarid',600),'egypt':('arid',60),'nigeria':('tropical',1500),
 'kenya':('semiarid',900),'ghana':('tropical',1300),'ethiopia':('semiarid',1000),
 'tanzania':('tropical',1100),'uganda':('tropical',1300),'rwanda':('tropical',1200),
 'zambia':('semiarid',1000),'mozambique':('tropical',1000),'namibia':('arid',250),
 'botswana':('semiarid',450),'senegal':('semiarid',600),
 'united-arab-emirates':('arid',100),'saudi-arabia':('arid',100),'qatar':('arid',80),
 'kuwait':('arid',110),'bahrain':('arid',90),'oman':('arid',120),'jordan':('arid',270),
}
DEFAULT_R = ('continental', 700)

CONT = {'oceanic':0.55,'maritime':0.60,'mediterranean':0.72,'humid_subtropical':0.80,
        'continental':1.05,'subarctic':1.25,'arid':0.95,'semiarid':1.00,'tropical':0.25,
        'monsoon':0.50,'default':0.85}
DRANGE = {'oceanic':7,'maritime':7,'mediterranean':10,'humid_subtropical':9,'continental':11,
          'subarctic':9,'arid':15,'semiarid':12,'tropical':8,'monsoon':8,'default':9}
SUNF = {'oceanic':0.70,'maritime':0.70,'mediterranean':1.10,'humid_subtropical':0.85,
        'continental':0.85,'subarctic':0.65,'arid':1.18,'semiarid':1.10,'tropical':0.82,
        'monsoon':0.80,'default':0.85}
INTENS = {'oceanic':6,'maritime':6,'mediterranean':9,'humid_subtropical':9,'continental':9,
          'subarctic':8,'arid':10,'semiarid':9,'tropical':11,'monsoon':12,'default':8}
# monthly precip weight vectors (Jan..Dec, northern hemisphere); rolled +6 for south
WEIGHTS = {
 'oceanic':[1.15,0.95,0.9,0.8,0.8,0.75,0.8,0.9,0.95,1.15,1.2,1.25],
 'maritime':[1.1,0.9,0.85,0.8,0.8,0.8,0.85,0.9,0.95,1.1,1.15,1.2],
 'mediterranean':[1.45,1.2,1.0,0.8,0.5,0.2,0.08,0.2,0.6,1.15,1.45,1.55],
 'continental':[0.6,0.6,0.75,0.95,1.25,1.45,1.4,1.3,1.0,0.85,0.8,0.65],
 'humid_subtropical':[0.75,0.75,0.95,0.95,1.1,1.15,1.25,1.2,1.1,0.9,0.8,0.8],
 'subarctic':[0.7,0.65,0.65,0.7,0.9,1.2,1.45,1.5,1.2,1.0,0.9,0.8],
 'arid':[1.2,1.1,1.0,0.9,0.7,0.5,0.4,0.5,0.7,1.0,1.1,1.2],
 'semiarid':[0.8,0.8,0.95,1.05,1.2,1.1,1.0,1.0,1.0,1.0,0.95,0.85],
 'tropical':[0.75,0.7,0.8,1.0,1.2,1.2,1.1,1.1,1.2,1.3,1.05,0.85],
 'monsoon':[0.2,0.2,0.3,0.45,0.75,1.6,2.2,2.1,1.45,0.6,0.3,0.2],
 'default':[0.8,0.8,0.9,1.0,1.1,1.1,1.1,1.05,1.0,0.95,0.9,0.85],
}

def us_regime(lat, lon):
    al = abs(lat)
    if lon < -119:  # west coast
        return 'oceanic' if al >= 42 else 'mediterranean'
    if lon < -100:  # mountain west / southwest
        if al >= 41: return 'continental'
        return 'arid' if al < 37 else 'semiarid'
    if lon < -90:   # central
        return 'continental' if al >= 37 else 'humid_subtropical'
    return 'humid_subtropical' if al < 38 else 'continental'  # east

def ca_regime(lat, lon):
    if lon < -122: return 'oceanic'
    return 'subarctic' if lat >= 54 else 'continental'

def au_regime(lat, lon):
    al = abs(lat)
    if al < 20: return 'tropical'
    if al < 30: return 'semiarid'
    if lon < 120: return 'mediterranean'   # SW (Perth)
    return 'oceanic'                        # SE coast (Melbourne)

def regime_for(c, lat, lon):
    cs = c['countrySlug']
    if cs == 'united-states': return us_regime(lat, lon)
    if cs == 'canada': return ca_regime(lat, lon)
    if cs == 'australia': return au_regime(lat, lon)
    return R.get(cs, DEFAULT_R)[0]

def r1(x): return round(x, 1)

def gen(c):
    slug = c['slug']
    cc = coords.get(slug, {})
    lat = cc.get('lat', HARD_LAT.get(slug))
    lon = cc.get('lon', HARD_LON.get(slug, 0.0))
    if lat is None: lat = 45.0
    al = abs(lat); south = lat < 0
    regime = regime_for(c, lat, lon)
    REGIME_PRECIP = {'oceanic':1000,'maritime':800,'mediterranean':550,'humid_subtropical':1200,
                     'continental':800,'subarctic':600,'arid':120,'semiarid':450,'tropical':1800,
                     'monsoon':1300,'default':750}
    if c['countrySlug'] in ('united-states', 'canada', 'australia'):
        precip_total = REGIME_PRECIP[regime]
    else:
        precip_total = R.get(c['countrySlug'], DEFAULT_R)[1]
    cont = CONT.get(regime, 0.85)
    TEMP_ADJ = {'oceanic':1.0,'maritime':1.0,'mediterranean':0.5,'continental':-2.0,
                'subarctic':-3.0,'humid_subtropical':1.0,'arid':3.0,'semiarid':1.5,
                'tropical':0.0,'monsoon':0.5,'default':0.0}
    annual_mean = max(-15.0, min(30.0, 27.0 - 0.0067 * al * al + TEMP_ADJ.get(regime, 0.0)))
    amp = cont * (4.5 + 0.30 * al)            # warmest-coldest monthly-mean swing
    warm = 0 if south else 6                   # warmest month index
    drange = DRANGE.get(regime, 9)
    w = WEIGHTS.get(regime, WEIGHTS['default'])[:]
    if south: w = w[6:] + w[:6]
    wsum = sum(w)
    sunf = SUNF.get(regime, 0.85)
    intens = INTENS.get(regime, 8)
    monthly = []
    for m in range(12):
        mean = annual_mean + (amp / 2.0) * math.cos(2 * math.pi * (m - warm) / 12.0)
        hi = mean + drange / 2.0
        lo = mean - drange / 2.0
        precip = max(0.0, precip_total * (w[m] / wsum))
        rainy = max(0, min(28, round(precip / intens)))
        # daylight/season factor (longer summer days at high latitude) + clear-sky
        dl = 1.0 + 0.35 * math.cos(2 * math.pi * (m - warm) / 12.0) * min(al / 55.0, 1.0)
        clear = max(0.15, min(0.95, 1.0 - rainy / 22.0))
        sun = round(max(20.0, min(400.0, 30 * 9 * dl * clear * sunf)))
        monthly.append({"month": MONTHS[m], "avgHighC": r1(hi), "avgLowC": r1(lo),
                        "precipitationMm": int(round(precip)), "rainyDays": int(rainy),
                        "sunshineHours": int(sun)})
    means = [(mm["avgHighC"] + mm["avgLowC"]) / 2.0 for mm in monthly]
    annual_avg = r1(sum(means) / 12.0)
    annual_precip = int(sum(mm["precipitationMm"] for mm in monthly))
    annual_sun = sum(mm["sunshineHours"] for mm in monthly)
    hottest = MONTHS[max(range(12), key=lambda i: monthly[i]["avgHighC"])]
    coldest = MONTHS[min(range(12), key=lambda i: monthly[i]["avgLowC"])]
    wettest = MONTHS[max(range(12), key=lambda i: monthly[i]["precipitationMm"])]
    driest = MONTHS[min(range(12), key=lambda i: monthly[i]["precipitationMm"])]
    cold_low = min(mm["avgLowC"] for mm in monthly)
    hot_high = max(mm["avgHighC"] for mm in monthly)
    swing = max(means) - min(means)
    # --- comfort score ---
    pleasant = sum(1 for mm in monthly if 16 <= mm["avgHighC"] <= 30 and mm["avgLowC"] >= 4)
    temp_comfort = pleasant / 12.0 * 100.0
    if 500 <= annual_precip <= 1100: rain_bal = 100.0
    elif annual_precip < 500: rain_bal = max(0.0, (annual_precip - 100) / 400.0 * 100.0)
    else: rain_bal = max(0.0, 100.0 - (annual_precip - 1100) / 15.0)
    sun_score = max(0.0, min(100.0, (annual_sun - 1000) / 1600.0 * 100.0))
    season_score = max(0.0, min(100.0, 100.0 - 2.2 * swing))
    mild_winter = 100.0 if cold_low >= 0 else max(0.0, 100.0 + cold_low * 4.0)
    mild_summer = 100.0 if hot_high <= 30 else max(0.0, 100.0 - (hot_high - 30) * 7.0)
    comfort = round(0.30 * temp_comfort + 0.15 * rain_bal + 0.15 * sun_score
                    + 0.15 * season_score + 0.125 * mild_winter + 0.125 * mild_summer)
    comfort = max(0, min(100, comfort))
    # --- climate zone ---
    if regime == 'arid' or annual_precip < 250:
        zone = "Desert" if hot_high >= 34 else "Semi-Arid"
    elif regime == 'semiarid' or (annual_precip < 450 and al >= 23.5):
        zone = "Semi-Arid"
    elif al < 23.5 and annual_precip >= 900:
        zone = "Tropical"
    elif regime == 'monsoon':
        zone = "Humid Subtropical"
    elif regime == 'mediterranean':
        zone = "Mediterranean"
    elif regime == 'subarctic' or al >= 60 or cold_low <= -12:
        zone = "Subarctic"
    elif regime == 'continental':
        zone = "Humid Continental"
    elif regime in ('oceanic', 'maritime'):
        zone = "Oceanic"
    elif regime == 'humid_subtropical':
        zone = "Humid Subtropical"
    elif cold_low <= -3 and hot_high >= 19:
        zone = "Humid Continental"
    else:
        zone = "Temperate"
    return {"citySlug": slug, "climateZone": zone, "annualAvgTempC": annual_avg,
            "annualPrecipitationMm": annual_precip, "hottestMonth": hottest,
            "coldestMonth": coldest, "wettestMonth": wettest, "driestMonth": driest,
            "monthly": monthly, "comfortScore": comfort,
            "createdAt": "2026-06-15", "updatedAt": "2026-06-15"}

profiles = [gen(c) for c in cities]
# sanity (mirror guard)
seen = set()
for p in profiles:
    assert p["citySlug"] not in seen; seen.add(p["citySlug"])
    assert len(p["monthly"]) == 12
    for mm in p["monthly"]:
        assert mm["avgHighC"] >= mm["avgLowC"]
        assert mm["precipitationMm"] >= 0 and 0 <= mm["rainyDays"] <= 31
        assert 0 <= mm["sunshineHours"] <= 800
    assert 0 <= p["comfortScore"] <= 100 and p["climateZone"]

def j(v): return json.dumps(v, ensure_ascii=False)
L = []
L.append('import type { ClimateProfile } from "@/types/climate";')
L.append('')
L.append('/**')
L.append(' * Deterministic climate profiles — one per city. Generated by')
L.append(' * scripts/generate-climate.py from latitude + a per-country climate regime')
L.append(' * (precipitation distribution, sunshine, zone). Planning estimates, not')
L.append(' * station data; do not edit by hand. comfortScore formula is documented in')
L.append(' * the generator header.')
L.append(' */')
L.append('export const climateProfiles: readonly ClimateProfile[] = [')
for p in profiles:
    mon = ", ".join(
        '{ month: %s, avgHighC: %s, avgLowC: %s, precipitationMm: %s, rainyDays: %s, sunshineHours: %s }'
        % (j(mm["month"]), mm["avgHighC"], mm["avgLowC"], mm["precipitationMm"], mm["rainyDays"], mm["sunshineHours"])
        for mm in p["monthly"])
    L.append('  {')
    L.append('    citySlug: %s,' % j(p["citySlug"]))
    L.append('    climateZone: %s,' % j(p["climateZone"]))
    L.append('    annualAvgTempC: %s,' % p["annualAvgTempC"])
    L.append('    annualPrecipitationMm: %s,' % p["annualPrecipitationMm"])
    L.append('    hottestMonth: %s,' % j(p["hottestMonth"]))
    L.append('    coldestMonth: %s,' % j(p["coldestMonth"]))
    L.append('    wettestMonth: %s,' % j(p["wettestMonth"]))
    L.append('    driestMonth: %s,' % j(p["driestMonth"]))
    L.append('    monthly: [%s],' % mon)
    L.append('    comfortScore: %s,' % p["comfortScore"])
    L.append('    createdAt: %s,' % j(p["createdAt"]))
    L.append('    updatedAt: %s,' % j(p["updatedAt"]))
    L.append('  },')
L.append('];')
L.append('')
L.append('const byCitySlug: Record<string, ClimateProfile> = {};')
L.append('for (const profile of climateProfiles) {')
L.append('  byCitySlug[profile.citySlug] = profile;')
L.append('}')
L.append('')
L.append('/** Runtime integrity guard — throws (failing `next build`) on any invalid profile. */')
L.append('function assertClimateIntegrity(profiles: readonly ClimateProfile[]): void {')
L.append('  const errors: string[] = [];')
L.append('  const seen = new Set<string>();')
L.append('  for (const p of profiles) {')
L.append('    if (seen.has(p.citySlug)) errors.push(`duplicate citySlug: ${p.citySlug}`);')
L.append('    seen.add(p.citySlug);')
L.append('    if (p.monthly.length !== 12) errors.push(`${p.citySlug}: expected 12 months, got ${p.monthly.length}`);')
L.append('    for (const m of p.monthly) {')
L.append('      if (!(m.avgHighC >= m.avgLowC)) errors.push(`${p.citySlug}/${m.month}: high < low`);')
L.append('      if (!(m.precipitationMm >= 0)) errors.push(`${p.citySlug}/${m.month}: negative precipitation`);')
L.append('      if (!(m.rainyDays >= 0 && m.rainyDays <= 31)) errors.push(`${p.citySlug}/${m.month}: rainyDays out of range`);')
L.append('      if (!(m.sunshineHours >= 0)) errors.push(`${p.citySlug}/${m.month}: negative sunshine`);')
L.append('    }')
L.append('    if (!(p.comfortScore >= 0 && p.comfortScore <= 100)) errors.push(`${p.citySlug}: comfortScore out of range`);')
L.append('    if (!p.climateZone) errors.push(`${p.citySlug}: missing climateZone`);')
L.append('  }')
L.append('  if (errors.length > 0) {')
L.append('    throw new Error(`climate integrity failure:\\n${errors.join("\\n")}`);')
L.append('  }')
L.append('}')
L.append('')
L.append('assertClimateIntegrity(climateProfiles);')
L.append('')
L.append('export function getClimate(citySlug: string): ClimateProfile | undefined {')
L.append('  return byCitySlug[citySlug];')
L.append('}')
L.append('')
L.append('export function hasClimate(citySlug: string): boolean {')
L.append('  return Object.prototype.hasOwnProperty.call(byCitySlug, citySlug);')
L.append('}')
L.append('')
L.append('export function getAllClimateProfiles(): readonly ClimateProfile[] {')
L.append('  return climateProfiles;')
L.append('}')
open(ROOT + "/lib/data/climate.ts", "w").write("\n".join(L) + "\n")
from collections import Counter
print("wrote lib/data/climate.ts with", len(profiles), "profiles")
print("zones:", dict(Counter(p["climateZone"] for p in profiles)))
for s in ('prague','vienna','barcelona','toronto','reykjavik','dubai','singapore','tromso','phoenix','alice-springs'):
    p = next((x for x in profiles if x["citySlug"] == s), None)
    if p: print(f"  {s}: {p['climateZone']}, avg {p['annualAvgTempC']}C, precip {p['annualPrecipitationMm']}mm, comfort {p['comfortScore']}, hottest {p['hottestMonth']}/coldest {p['coldestMonth']}")
