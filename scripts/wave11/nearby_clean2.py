#!/usr/bin/env python3
"""Second-pass nearby cleaning: catch non-nature features whose bad indicator is in
the NAME (memorials/historic/heritage/mall), settlements (village/commune), urban
parks, ornamental canals, and specific re-audit-flagged QIDs. Re-topup affected cities."""
import sys, json, re, math
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C
from sparql import sparql
import nearby_resolve as NR

OUT = Path("/tmp/w11")
nearby = json.load(open(OUT / "nearby.json"))
selected = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))

EXTRA_FLAGGED = {"Q674774","Q1725724","Q916958","Q17984993","Q856742","Q2170728","Q301415",
    "Q4948706","Q49492592","Q2262676","Q37511031","Q16964708","Q7974715"}
flagged = set(json.load(open(OUT / "flagged_nearby_qids.json"))) | EXTRA_FLAGGED
json.dump(sorted(flagged), open(OUT / "flagged_nearby_qids.json", "w"))

# types map
qid_types = {}
import glob
for fp in glob.glob(str(OUT / "nature_*.json")):
    for f in json.load(open(fp)): qid_types.setdefault(f["qid"], f["types"])
miss = sorted({r["wikidataId"] for v in nearby.values() for r in v if r["wikidataId"] not in qid_types})
for i in range(0, len(miss), 120):
    ch = miss[i:i+120]; vals = " ".join("wd:"+q for q in ch)
    q = f"SELECT ?item (GROUP_CONCAT(DISTINCT ?t;SEPARATOR='|') AS ?types) WHERE {{ VALUES ?item {{ {vals} }} OPTIONAL {{ ?item wdt:P31 ?ti. ?ti rdfs:label ?t. FILTER(lang(?t)='en') }} }} GROUP BY ?item"
    for r in sparql(q, timeout=180):
        qid_types[r["item"]["value"].split("/")[-1]] = (r.get("types",{}).get("value","") or "").lower()

BAD_TYPE = re.compile(r"historic|memorial|monument|battlefield|\bfort\b|fortress|museum|aquarium|\bzoo\b|"
    r"bird park|theme park|amusement|\bprison\b|archaeolog|fossil|pile dwelling|rijksbeschermd|\bdam\b|"
    r"\bcanal\b|water ?works|\bhamlet\b|outbuilding|attraction|neighbou?rhood|\bsquare\b|statue|\bchurch\b|"
    r"cathedral|\bpalace\b|chateau|\bestate\b|heritage|\bmanor\b|\babbey\b|monastery|\bmine\b|industrial|"
    r"stadium|cemetery|botanical|\bgarden\b|\bbuilding\b|historic district|world heritage|conservation area|"
    r"\bhouse\b|\bvilla\b|\bdepot\b|\bcastle\b|citadel|\bvillage\b|commune of|human settlement|municipality|"
    r"urban park|former lake|woolen mill|\bmill\b|civic|ceremonial")
BAD_NAME = re.compile(r"memorial|monument|\bhistoric\b|heritage|\bmall\b|battlefield|\bfort\b|\bprison\b|"
    r"museum|state historic|national historic|\bcanal\b|woolen mill|\bmill\b|quartermaster|depot|"
    r"president'?s park|capitol|courthouse|\bhall\b|cathedral|\bchurch\b|\bdam\b", re.I)
NATURE_OK = re.compile(r"national park|nature reserve|national nature reserve|protected landscape|state park|"
    r"provincial park|regional park|natural park|nature park|national forest|state forest|\bforest\b|"
    r"\bmountain|\bpeak\b|massif|\bhill\b|\blake\b|reservoir|\bbay\b|\bcape\b|peninsula|\bbeach\b|\bisland\b|"
    r"archipelago|waterfall|\bgorge\b|canyon|\bvalley\b|wilderness|geopark|marine park|wildlife refuge|"
    r"wildlife management|wildlife sanctuary|wetland|moor|heath|dune|fjord|estuary|nature monument|"
    r"conservation park|country park|biosphere|ramsar|natura 2000|special area of conservation|fell|"
    r"national wildlife|state natural|natural area|scenic|national seashore|national lakeshore")
def genuine(types, name):
    if BAD_NAME.search(name or ""): return False
    if not types: return True
    if BAD_TYPE.search(types): return False
    return bool(NATURE_OK.search(types))

METROS = [(48.853,2.349),(40.713,-74.006),(49.283,-123.121),(39.953,-75.165),(42.360,-71.058),
          (34.052,-118.244),(41.881,-87.629),(38.895,-77.036),(45.501,-73.567),(43.651,-79.383),
          (52.370,4.895),(51.922,4.479)]
def hav(a,b,c,d):
    r=math.radians; return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2+math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))
def urban_island(rec):
    return rec["category"] in ("island","waterfront") and any(hav(rec["latitude"],rec["longitude"],m[0],m[1])<25 for m in METROS)

def bad_rec(r):
    return (r["wikidataId"] in flagged or urban_island(r) or not genuine(qid_types.get(r["wikidataId"], ""), r["name"]))

clean_pool = {}
for cc in ["united-states","canada","australia","germany","france","netherlands"]:
    seen=set(); lst=[]
    for fn in [OUT/f"nature_{cc}.json", OUT/f"nature_full_{cc}.json"]:
        if fn.exists():
            for f in json.load(open(fn)):
                if (f.get("name") and f.get("p18file") and f["qid"] not in flagged
                        and f["qid"] not in seen and genuine(f["types"], f["name"])):
                    seen.add(f["qid"]); lst.append(f)
    clean_pool[cc]=lst

used=set(r["slug"] for v in nearby.values() for r in v)
dropped=added=0
for slug,recs in nearby.items():
    bad=[r for r in recs if bad_rec(r)]
    if not bad: continue
    keep=[r for r in recs if not bad_rec(r)]
    for r in bad: used.discard(r["slug"])
    drop_qids={r["wikidataId"] for r in bad}; nearby[slug]=keep; dropped+=len(bad)
    c=selected[slug]; have={r["wikidataId"] for r in keep}|drop_qids
    cands=[]
    for f in clean_pool[c["countrySlug"]]:
        if f["qid"] in have: continue
        if abs(f["lat"]-c["lat"])>1.7 or abs(f["lon"]-c["lon"])>2.6: continue
        km=NR.hav(c["lat"],c["lon"],f["lat"],f["lon"])
        if km>170: continue
        cands.append((km,f))
    cands.sort(key=lambda x:x[0]-min(x[1]["sitelinks"],30)*1.5)
    target=max(5,len(recs))
    for km,f in cands:
        if len(nearby[slug])>=target: break
        cat=NR.categorize(f["types"]); pslug=NR.slugify(f["name"])
        if not pslug: continue
        sl=f"{pslug}-near-{slug}"
        if sl in existing_nearby_slugs or sl in used: continue
        rec={"latitude":round(f["lat"],5),"longitude":round(f["lon"],5),"category":cat}
        if urban_island(rec): continue
        img=NR.verify_image(f,f["name"])
        if not img: continue
        used.add(sl); have.add(f["qid"]); desig=NR.designation(f["types"],cat)
        nearby[slug].append({"slug":sl,"name":f["name"],"countrySlug":f["countrySlug"],"regionName":NR.REGION[f["countrySlug"]],
            "category":cat,"summary":(f"{f['name']} is a {desig.lower()} reachable from {c['name']} as a nearby nature destination. "
            f"Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs":[slug],"distanceBand":NR.band(km),"wikidataId":f["qid"],
            "officialUrl":f["website"] if f.get("website") else None,"latitude":round(f["lat"],5),"longitude":round(f["lon"],5),
            "verificationStatus":"verified","img":img,
            "facts":{"designation":desig,"iucnCategory":(re.sub(r".*category\s*","",f["iucn"]).strip()[:4] if f.get("iucn") else None),
                     "established":f.get("inception") if (f.get("inception") and 1000<f["inception"]<=2026) else None},
            "distanceKm":round(km,1)})
        added+=1
    print(f"  {slug}: dropped {len(bad)}, now {len(nearby[slug])}")
VALID={"Ia","Ib","I","II","III","IV","V","VI"}
for v in nearby.values():
    for r in v:
        iu=r["facts"].get("iucnCategory")
        if iu and iu not in VALID:
            m=re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b",iu.strip()); r["facts"]["iucnCategory"]=m.group(1) if (m and m.group(1) in VALID) else None
json.dump(nearby,open(OUT/"nearby.json","w"),ensure_ascii=False)
print(f"TOTAL dropped {dropped} added {added}")
print("under5:",sorted([(s,len(v)) for s,v in nearby.items() if len(v)<5]))
print("total:",sum(len(v) for v in nearby.values()))
