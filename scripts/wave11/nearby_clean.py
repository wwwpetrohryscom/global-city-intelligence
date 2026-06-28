#!/usr/bin/env python3
"""Wave 11 audit fix: remove nearby places that are NOT genuine nature (NPS cultural
units, memorials, historic sites, forts, museums, zoos, dams, canals, urban islands)
and re-topup affected cities from a strong-nature-filtered pool. Updates nearby.json."""
import sys, json, re, math, time
from pathlib import Path
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave11")
import commons as C
from sparql import sparql
import nearby_resolve as NR

OUT = Path("/tmp/w11")
nearby = json.load(open(OUT / "nearby.json"))
selected = {c["slug"]: c for c in json.load(open(OUT / "selected.json"))}
existing_nearby_slugs = set(json.load(open(OUT / "existing_nearby_slugs.json")))
flagged = set(json.load(open(OUT / "flagged_nearby_qids.json")))

# qid -> types from all nature pools
qid_types = {}
for cc in ["united-states", "canada", "australia", "germany", "france", "netherlands"]:
    for fn in [OUT / f"nature_{cc}.json", OUT / f"nature_full_{cc}.json"]:
        if fn.exists():
            for f in json.load(open(fn)):
                qid_types.setdefault(f["qid"], f["types"])

BAD = re.compile(
    r"historic|memorial|monument|battlefield|\bfort\b|fortress|museum|aquarium|\bzoo\b|"
    r"bird park|theme park|amusement|\bprison\b|archaeolog|fossil|palaeo|paleo|pile dwelling|"
    r"rijksbeschermd|\bdam\b|\bcanal\b|water ?works|\bhamlet\b|outbuilding|attraction|"
    r"neighbou?rhood|\bsquare\b|statue|\bchurch\b|cathedral|\bpalace\b|chateau|château|"
    r"\bestate\b|heritage|\bmanor\b|\babbey\b|monastery|\bmine\b|industrial|stadium|arena|"
    r"cemetery|necropolis|botanical|\bgarden\b|\bbuilding\b|historic district|world heritage|"
    r"conservation area|protected urban|water tower|windmill|lighthouse|\bdike\b|polder village|"
    r"\bhouse\b|\bvilla\b|\bzoo\b|aquarium|theme|\bdepot\b|waterworks|\bcastle\b|citadel")
NATURE_OK = re.compile(
    r"national park|nature reserve|national nature reserve|protected landscape|state park|"
    r"provincial park|regional park|natural park|nature park|national forest|state forest|"
    r"\bforest\b|\bmountain|\bpeak\b|massif|\bhill\b|\blake\b|reservoir|\bbay\b|\bcape\b|"
    r"peninsula|\bbeach\b|\bisland\b|archipelago|waterfall|\bgorge\b|canyon|\bvalley\b|"
    r"wilderness|geopark|marine park|wildlife refuge|wildlife management|wildlife sanctuary|"
    r"wetland|moor|heath|dune|fjord|estuary|nature monument|conservation park|country park|"
    r"protected area|biosphere|ramsar|natura 2000|special area of conservation|fell|"
    r"national wildlife|state natural|natural area|scenic")

def genuine_nature(types):
    if not types: return True   # unknown -> keep (rare)
    if BAD.search(types): return False
    return bool(NATURE_OK.search(types))

# urban metros: drop island/waterfront within 25km (urban river islands)
METROS = [(48.853,2.349),(40.713,-74.006),(49.283,-123.121),(39.953,-75.165),(42.360,-71.058),
          (34.052,-118.244),(41.881,-87.629),(38.895,-77.036),(45.501,-73.567),(43.651,-79.383)]
def hav(a,b,c,d):
    r=math.radians; return 2*6371*math.asin(math.sqrt(math.sin((r(c)-r(a))/2)**2+math.cos(r(a))*math.cos(r(c))*math.sin((r(d)-r(b))/2)**2))
def urban_island(rec):
    if rec["category"] not in ("island","waterfront"): return False
    return any(hav(rec["latitude"],rec["longitude"],m[0],m[1])<25 for m in METROS)

# fetch types for nearby qids missing from pools
missing = sorted({r["wikidataId"] for v in nearby.values() for r in v if r["wikidataId"] not in qid_types})
print("nearby qids missing types:", len(missing))
for i in range(0, len(missing), 120):
    ch = missing[i:i+120]; vals = " ".join("wd:"+q for q in ch)
    q = f"SELECT ?item (GROUP_CONCAT(DISTINCT ?t;SEPARATOR='|') AS ?types) WHERE {{ VALUES ?item {{ {vals} }} OPTIONAL {{ ?item wdt:P31 ?ti. ?ti rdfs:label ?t. FILTER(lang(?t)='en') }} }} GROUP BY ?item"
    for r in sparql(q, timeout=180):
        qid = r["item"]["value"].split("/")[-1]
        qid_types[qid] = (r.get("types",{}).get("value","") or "").lower()

def bad_record(r):
    if r["wikidataId"] in flagged: return True
    if urban_island(r): return True
    return not genuine_nature(qid_types.get(r["wikidataId"], ""))

# clean pool for topup (genuine nature only, not flagged)
clean_pool = {}
for cc in ["united-states","canada","australia","germany","france","netherlands"]:
    lst=[]
    for fn in [OUT/f"nature_{cc}.json", OUT/f"nature_full_{cc}.json"]:
        if fn.exists():
            for f in json.load(open(fn)):
                if f.get("name") and f.get("p18file") and f["qid"] not in flagged and genuine_nature(f["types"]):
                    lst.append(f)
    # dedup by qid
    seen=set(); out=[]
    for f in lst:
        if f["qid"] in seen: continue
        seen.add(f["qid"]); out.append(f)
    clean_pool[cc]=out
    print(f"clean pool {cc}: {len(out)}")

used = set(r["slug"] for v in nearby.values() for r in v)
total_dropped=0; total_added=0
for slug, recs in nearby.items():
    bad=[r for r in recs if bad_record(r)]
    if not bad: continue
    keep=[r for r in recs if not bad_record(r)]
    drop_qids={r["wikidataId"] for r in bad}
    for r in bad: used.discard(r["slug"])
    nearby[slug]=keep
    total_dropped+=len(bad)
    c=selected[slug]; have={r["wikidataId"] for r in keep}|drop_qids
    pool=clean_pool[c["countrySlug"]]
    cands=[]
    for f in pool:
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
        used.add(sl); have.add(f["qid"])
        desig=NR.designation(f["types"],cat)
        nearby[slug].append({"slug":sl,"name":f["name"],"countrySlug":f["countrySlug"],"regionName":NR.REGION[f["countrySlug"]],
            "category":cat,"summary":(f"{f['name']} is a {desig.lower()} reachable from {c['name']} as a nearby nature destination. "
            f"Research access, facilities, and seasonal conditions with official sources before visiting."),
            "connectedCitySlugs":[slug],"distanceBand":NR.band(km),"wikidataId":f["qid"],
            "officialUrl":f["website"] if f.get("website") else None,"latitude":round(f["lat"],5),"longitude":round(f["lon"],5),
            "verificationStatus":"verified","img":img,
            "facts":{"designation":desig,"iucnCategory":(re.sub(r".*category\s*","",f["iucn"]).strip()[:4] if f.get("iucn") else None),
                     "established":f.get("inception") if (f.get("inception") and 1000<f["inception"]<=2026) else None},
            "distanceKm":round(km,1)})
        total_added+=1
    print(f"  {slug}: dropped {len(bad)}, now {len(nearby[slug])}")

# final iucn clean
VALID={"Ia","Ib","I","II","III","IV","V","VI"}
for v in nearby.values():
    for r in v:
        iu=r["facts"].get("iucnCategory")
        if iu and iu not in VALID:
            m=re.match(r"(Ia|Ib|IV|VI|V|III|II|I)\b",iu.strip()); r["facts"]["iucnCategory"]=m.group(1) if (m and m.group(1) in VALID) else None
json.dump(nearby,open(OUT/"nearby.json","w"),ensure_ascii=False)
print(f"\nTOTAL dropped {total_dropped}, added {total_added}")
print("under5:",sorted([(s,len(v)) for s,v in nearby.items() if len(v)<5]))
print("total nearby:",sum(len(v) for v in nearby.values()))
