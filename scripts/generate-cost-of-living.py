#!/usr/bin/env python3
"""Deterministic Cost of Living generator. Country cost baseline (currency, fx,
costIndex) x per-city adjustment (affordability score + metro size) -> profile.
No randomness, no network. Writes lib/data/cost-of-living.ts (data + guard + access)."""
import json, re, math
ROOT="/Users/agent/global-city-intelligence"
cities=json.load(open("/tmp/col_cities.json"))

# country -> (currency ISO, fx local-per-USD, costIndex relative cost level ~100=mid)
C={
 'united-states':('USD',1.0,125),'canada':('CAD',1.36,112),'united-kingdom':('GBP',0.79,130),
 'australia':('AUD',1.52,122),'new-zealand':('NZD',1.64,115),
 'germany':('EUR',0.92,120),'france':('EUR',0.92,122),'italy':('EUR',0.92,108),'spain':('EUR',0.92,100),
 'netherlands':('EUR',0.92,124),'belgium':('EUR',0.92,116),'austria':('EUR',0.92,122),'portugal':('EUR',0.92,92),
 'greece':('EUR',0.92,88),'ireland':('EUR',0.92,130),'finland':('EUR',0.92,124),'slovakia':('EUR',0.92,78),
 'slovenia':('EUR',0.92,86),'latvia':('EUR',0.92,76),'lithuania':('EUR',0.92,74),'estonia':('EUR',0.92,82),
 'luxembourg':('EUR',0.92,140),'croatia':('EUR',0.92,80),'montenegro':('EUR',0.92,64),
 'switzerland':('CHF',0.88,175),'norway':('NOK',10.8,150),'sweden':('SEK',10.7,120),'denmark':('DKK',6.9,135),
 'poland':('PLN',4.0,70),'czechia':('CZK',23.0,78),'hungary':('HUF',360.0,66),'romania':('RON',4.6,64),
 'bulgaria':('BGN',1.8,58),'ukraine':('UAH',41.0,45),'serbia':('RSD',108.0,58),
 'bosnia-and-herzegovina':('BAM',1.8,56),'north-macedonia':('MKD',57.0,54),'albania':('ALL',95.0,56),
 'iceland':('ISK',138.0,160),'moldova':('MDL',17.8,48),'turkey':('TRY',33.0,55),
 'russia':('RUB',92.0,46),'belarus':('BYN',3.3,42),'georgia':('GEL',2.7,48),'armenia':('AMD',390.0,48),
 'azerbaijan':('AZN',1.7,46),'kazakhstan':('KZT',480.0,44),'uzbekistan':('UZS',12700.0,35),
 'israel':('ILS',3.7,130),'united-arab-emirates':('AED',3.67,110),'saudi-arabia':('SAR',3.75,90),
 'qatar':('QAR',3.64,115),'kuwait':('KWD',0.31,105),'bahrain':('BHD',0.38,95),'oman':('OMR',0.385,90),
 'jordan':('JOD',0.71,85),'lebanon':('USD',1.0,75),
 'japan':('JPY',150.0,105),'south-korea':('KRW',1350.0,100),'china':('CNY',7.1,75),'hong-kong':('HKD',7.8,135),
 'taiwan':('TWD',32.0,80),'singapore':('SGD',1.34,140),'malaysia':('MYR',4.4,55),'thailand':('THB',35.0,55),
 'vietnam':('VND',25000.0,45),'philippines':('PHP',57.0,50),'indonesia':('IDR',15800.0,48),
 'cambodia':('KHR',4100.0,45),'india':('INR',83.0,45),'pakistan':('PKR',280.0,40),'sri-lanka':('LKR',300.0,42),
 'brazil':('BRL',5.2,62),'mexico':('MXN',18.0,58),'argentina':('ARS',1000.0,60),'chile':('CLP',950.0,65),
 'colombia':('COP',4200.0,50),'peru':('PEN',3.8,55),'ecuador':('USD',1.0,55),'uruguay':('UYU',41.0,70),
 'panama':('USD',1.0,70),'costa-rica':('CRC',520.0,65),'guatemala':('GTQ',7.8,52),'dominican-republic':('DOP',60.0,55),
 'south-africa':('ZAR',18.5,55),'egypt':('EGP',49.0,40),'morocco':('MAD',10.0,50),'tunisia':('TND',3.1,48),
 'nigeria':('NGN',1600.0,42),'kenya':('KES',130.0,48),'ghana':('GHS',15.0,45),'ethiopia':('ETB',122.0,38),
 'tanzania':('TZS',2700.0,40),'uganda':('UGX',3700.0,38),'rwanda':('RWF',1300.0,42),'zambia':('ZMW',26.0,42),
 'mozambique':('MZN',64.0,42),'namibia':('NAD',18.5,52),'botswana':('BWP',13.6,52),'senegal':('XOF',600.0,48),
}
DEFAULT=('USD',1.0,75)
# USD reference bases for a mid-cost (costIndex=100) typical city
BASE_SINGLE=1600.0; BASE_RENT1=850.0; BASE_MEAL=14.0; BASE_COFFEE=3.2; BASE_TRANSIT=55.0

def parse_pop(s):
    m=re.search(r'([\d.]+)\s*([MmKk])', s or '')
    if not m: return 300000.0
    return float(m.group(1))*(1e6 if m.group(2) in 'Mm' else 1e3)

def sig3(v):
    if v<=0: return 1
    d=math.floor(math.log10(v)); step=10**(d-2); r=round(v/step)*step
    return int(round(r)) if r>=10 else round(r,1)

def gen(city):
    cur,fx,idx=C.get(city['countrySlug'],DEFAULT)
    aff=city['affordability']
    pop=parse_pop(city['population'])
    cost_mult=1.30-0.006*aff                      # higher affordability -> lower cost
    if pop>=3e6: sb=0.07
    elif pop>=1.5e6: sb=0.045
    elif pop>=7e5: sb=0.02
    elif pop>=2.5e5: sb=0.0
    else: sb=-0.03
    m=max(0.78,min(1.30,cost_mult*(1+sb)))
    f=idx/100.0
    single=BASE_SINGLE*f*m*fx
    rent1=BASE_RENT1*f*m*fx
    return {
        'citySlug':city['slug'],
        'monthlyCostSingle':sig3(single),
        'monthlyCostCouple':sig3(single*1.7),
        'monthlyCostFamily':sig3(single*2.55),
        'rentStudio':sig3(rent1*0.74),
        'rentOneBedroom':sig3(rent1),
        'rentThreeBedroom':sig3(rent1*1.85),
        'mealRestaurant':sig3(BASE_MEAL*f*m*fx),
        'coffee':sig3(BASE_COFFEE*f*m*fx),
        'publicTransportPass':sig3(BASE_TRANSIT*f*m*fx),
        'localCurrency':cur,
        'affordabilityScore':aff,
        'createdAt':'2026-06-15',
        'updatedAt':'2026-06-15',
    }

profiles=[gen(c) for c in cities]
# sanity (mirror guard) before writing
seen=set()
for p in profiles:
    assert p['citySlug'] not in seen, p['citySlug']; seen.add(p['citySlug'])
    for k in ('monthlyCostSingle','monthlyCostCouple','monthlyCostFamily','rentStudio','rentOneBedroom','rentThreeBedroom','mealRestaurant','coffee','publicTransportPass'):
        assert isinstance(p[k],(int,float)) and p[k]>0, (p['citySlug'],k,p[k])
    assert 0<=p['affordabilityScore']<=100; assert p['localCurrency']
    assert p['monthlyCostCouple']>p['monthlyCostSingle'] and p['monthlyCostFamily']>p['monthlyCostCouple']
    assert p['rentThreeBedroom']>p['rentOneBedroom']>p['rentStudio']

def num(v): return str(v)
lines=[]
lines.append('import type { CostOfLivingProfile } from "@/types/cost-of-living";')
lines.append('')
lines.append('/**')
lines.append(' * Deterministic Cost of Living profiles — one per city. Generated by')
lines.append(' * scripts/generate-cost-of-living.py from a country cost baseline (currency,')
lines.append(' * FX, cost index) adjusted for each city’s affordability score and metro size.')
lines.append(' * Values are local-currency planning estimates, not live prices; do not edit by hand.')
lines.append(' */')
lines.append('export const costOfLivingProfiles: readonly CostOfLivingProfile[] = [')
for p in profiles:
    lines.append('  { citySlug: %s, monthlyCostSingle: %s, monthlyCostCouple: %s, monthlyCostFamily: %s, rentStudio: %s, rentOneBedroom: %s, rentThreeBedroom: %s, mealRestaurant: %s, coffee: %s, publicTransportPass: %s, localCurrency: %s, affordabilityScore: %s, createdAt: %s, updatedAt: %s },' % (
        json.dumps(p['citySlug']),num(p['monthlyCostSingle']),num(p['monthlyCostCouple']),num(p['monthlyCostFamily']),
        num(p['rentStudio']),num(p['rentOneBedroom']),num(p['rentThreeBedroom']),num(p['mealRestaurant']),
        num(p['coffee']),num(p['publicTransportPass']),json.dumps(p['localCurrency']),num(p['affordabilityScore']),
        json.dumps(p['createdAt']),json.dumps(p['updatedAt'])))
lines.append('];')
lines.append('')
lines.append('const byCitySlug: Record<string, CostOfLivingProfile> = {};')
lines.append('for (const profile of costOfLivingProfiles) {')
lines.append('  byCitySlug[profile.citySlug] = profile;')
lines.append('}')
lines.append('')
lines.append('/** Build-time integrity guard — throws (failing `next build`) on any invalid profile. */')
lines.append('function assertCostOfLivingIntegrity(')
lines.append('  profiles: readonly CostOfLivingProfile[],')
lines.append('): void {')
lines.append('  const errors: string[] = [];')
lines.append('  const seen = new Set<string>();')
lines.append('  for (const p of profiles) {')
lines.append('    if (seen.has(p.citySlug)) errors.push(`duplicate citySlug: ${p.citySlug}`);')
lines.append('    seen.add(p.citySlug);')
lines.append('    const values = [')
lines.append('      p.monthlyCostSingle, p.monthlyCostCouple, p.monthlyCostFamily,')
lines.append('      p.rentStudio, p.rentOneBedroom, p.rentThreeBedroom,')
lines.append('      p.mealRestaurant, p.coffee, p.publicTransportPass,')
lines.append('    ];')
lines.append('    if (values.some((n) => typeof n !== "number" || !Number.isFinite(n) || n <= 0)) {')
lines.append('      errors.push(`${p.citySlug}: non-positive or invalid numeric value`);')
lines.append('    }')
lines.append('    if (!(p.affordabilityScore >= 0 && p.affordabilityScore <= 100)) {')
lines.append('      errors.push(`${p.citySlug}: affordabilityScore out of range`);')
lines.append('    }')
lines.append('    if (!p.localCurrency) errors.push(`${p.citySlug}: missing localCurrency`);')
lines.append('  }')
lines.append('  if (errors.length > 0) {')
lines.append('    throw new Error(`cost-of-living integrity failure:\\n${errors.join("\\n")}`);')
lines.append('  }')
lines.append('}')
lines.append('')
lines.append('assertCostOfLivingIntegrity(costOfLivingProfiles);')
lines.append('')
lines.append('export function getCostOfLiving(')
lines.append('  citySlug: string,')
lines.append('): CostOfLivingProfile | undefined {')
lines.append('  return byCitySlug[citySlug];')
lines.append('}')
lines.append('')
lines.append('export function hasCostOfLiving(citySlug: string): boolean {')
lines.append('  return Object.prototype.hasOwnProperty.call(byCitySlug, citySlug);')
lines.append('}')
lines.append('')
lines.append('export function getAllCostProfiles(): readonly CostOfLivingProfile[] {')
lines.append('  return costOfLivingProfiles;')
lines.append('}')
open(ROOT+"/lib/data/cost-of-living.ts","w").write("\n".join(lines)+"\n")
print("wrote lib/data/cost-of-living.ts with",len(profiles),"profiles")
# show a few samples
for s in ('prague','vienna','barcelona','toronto','zurich','lviv','tokyo','mumbai'):
    p=next((x for x in profiles if x['citySlug']==s),None)
    if p: print(f"  {s}: single {p['monthlyCostSingle']} {p['localCurrency']}, rent1br {p['rentOneBedroom']}, coffee {p['coffee']}, aff {p['affordabilityScore']}")
