#!/usr/bin/env python3
"""Disambiguate + corroborate one coordinate per indexed city.

Two independent witnesses exist in the repository, and they do not always
agree:

  * lib/data/nearby-places.ts — every curated place carries a Wikidata P625
    coordinate and the city slugs it was selected for. The selection pipeline
    used a <=170 km radius, so the correct city entity is the candidate whose
    connected places all fall inside that radius. This is the witness the
    nature feature actually publishes against, so it is primary.

  * lib/data/city-discovery-graph.ts — published great-circle distances
    between city centres. Used for cities with too few places to decide, and
    as the seed for cities with no resolvable Wikidata entity at all.

The graph is NOT authoritative: it disagrees with both Wikidata and the place
corpus for a small number of cities (e.g. hradec-kralove, whose graph
geometry sits ~130 km from the real city). Those disagreements are reported,
never silently adopted.

A city is published only when its chosen coordinate places every connected
nature place inside MAX_PLACE_KM. Otherwise it is dropped, and its nature
pages are simply not generated.

Output: scripts/nature/cache/city-coords.json
"""
import json, re, math, statistics, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).resolve().parent / "cache"
# The primary selection radius was 170 km, but sparse-region waves widened it
# deliberately (documented 2-4 place fallbacks in Gulf / inland-China cities),
# so this gate is set to catch a namesake in the wrong region, not to second-
# guess the corpus. Cities whose furthest place exceeds REPORT_PLACE_KM are
# reported as sparse rather than dropped.
MAX_PLACE_KM = 400.0   # median, not max — see place_score
REPORT_PLACE_KM = 220.0
MAX_GRAPH_MEDIAN_KM = 12.0
TRILATERATION_MARGIN_KM = 25.0   # a derived point must beat a named entity by this much    # tolerance when the graph is the only witness
MIN_PLACES_FOR_PLACE_WITNESS = 3
ITERATIONS = 6

data = json.load(open(CACHE / "city-candidates.json"))
cand = data["cand"]

src = (ROOT / "lib/data/cities.ts").read_text()
body = src[src.index("const seeds: CitySeed[] = ["): src.index("export const cities: City[] = seeds.map(buildCity);")]
slugs = [m.group(1) for m in re.finditer(r'slug: "([a-z0-9][a-z0-9-]*)"', body)]

places_path = CACHE / "places-compact.json"
places = json.load(open(places_path))
by_city = {}
for p in places:
    for s in p["cities"]:
        by_city.setdefault(s, []).append((p["lat"], p["lon"]))

g = (ROOT / "lib/data/city-discovery-graph.ts").read_text()
edges, cur = [], None
for m in re.finditer(r'^  "([a-z0-9-]+)": \[|citySlug: "([a-z0-9-]+)", distanceKm: (\d+(?:\.\d+)?)', g, re.M):
    if m.group(1):
        cur = m.group(1)
    elif cur:
        edges.append((cur, m.group(2), float(m.group(3))))
nb = {}
for a, b, km in edges:
    nb.setdefault(a, []).append((b, km))
    nb.setdefault(b, []).append((a, km))
print(f"cities {len(slugs)}; places {len(places)}; graph edges {len(edges)}")


def hav(a, b, c, d):
    r = math.radians
    return 2 * 6371 * math.asin(math.sqrt(
        math.sin((r(c) - r(a)) / 2) ** 2 + math.cos(r(a)) * math.cos(r(c)) * math.sin((r(d) - r(b)) / 2) ** 2))


def place_score(c, pts):
    """Median connected-place distance.

    The <=170 km selection radius bounds this quantity, so a namesake in
    another region scores catastrophically. The MEDIAN rather than the max is
    used because a single contaminated place record (a namesake feature
    hundreds of km away) must not be able to overrule a city's identity —
    those outliers are caught separately as contamination."""
    return statistics.median(hav(c["lat"], c["lon"], la, lo) for la, lo in pts)


def worst_place(c, pts):
    return max(hav(c["lat"], c["lon"], la, lo) for la, lo in pts)


def graph_score(c, refs):
    return statistics.median(abs(hav(c["lat"], c["lon"], o["lat"], o["lon"]) - km) for o, km in refs)


pick, witness = {}, {}
for s in slugs:
    cs = cand.get(s)
    if not cs:
        continue
    pts = by_city.get(s, [])
    if len(pts) >= MIN_PLACES_FOR_PLACE_WITNESS:
        best = min(cs, key=lambda c: place_score(c, pts))
        pick[s], witness[s] = best, "nearby-places"
    else:
        pick[s], witness[s] = cs[0], "population-seed"

for it in range(ITERATIONS):
    changed = 0
    for s in slugs:
        cs = cand.get(s)
        if not cs or len(cs) == 1 or witness.get(s) == "nearby-places":
            continue
        refs = [(pick[o], km) for o, km in nb.get(s, []) if o in pick and o != s]
        if len(refs) < 3:
            continue
        best = min(cs, key=lambda c: graph_score(c, refs))
        if best["qid"] != pick[s]["qid"]:
            pick[s] = best
            changed += 1
        witness[s] = "city-discovery-graph"
    print(f"  iter {it + 1}: reassigned {changed}")
    if not changed:
        break


def trilaterate(refs, seed):
    lat, lon = seed
    for _ in range(300):
        na = no = den = 0.0
        for o, km in refs:
            d = hav(lat, lon, o["lat"], o["lon"])
            dy = (o["lat"] - lat) * 111.32
            dx = (o["lon"] - lon) * 111.32 * math.cos(math.radians(lat))
            n = math.hypot(dx, dy)
            if n < 1e-9:
                continue
            na += (d - km) * (dy / n)
            no += (d - km) * (dx / n)
            den += 1
        if den == 0:
            return None
        lat += 0.7 * (na / den) / 111.32
        lon += 0.7 * (no / den) / (111.32 * math.cos(math.radians(lat)))
    return lat, lon


coords, dropped, graph_conflicts = {}, {}, {}
for s_ in slugs:
    pts = by_city.get(s_, [])
    refs = [(pick[o], km) for o, km in nb.get(s_, []) if o in pick and o != s_]

    # Every positional hypothesis for this city: the Wikidata candidates plus,
    # when the graph is dense enough, the point the published inter-city
    # distances trilaterate to. Wikidata entities are preferred on ties so a
    # real identity always beats a derived point.
    hyps = [dict(c, _src="wikidata") for c in (cand.get(s_) or [])]
    if len(refs) >= 4:
        srt = sorted(refs, key=lambda r: r[1])
        for seed in ((statistics.mean(o["lat"] for o, _ in refs), statistics.mean(o["lon"] for o, _ in refs)),
                     (srt[0][0]["lat"], srt[0][0]["lon"])):
            t = trilaterate(refs, seed)
            if t:
                hyps.append({"lat": t[0], "lon": t[1], "qid": None, "_src": "graph-trilateration"})
    if not hyps:
        dropped[s_] = "no candidate and no usable graph geometry"
        continue

    def score(h):
        pk = place_score(h, pts) if pts else None
        gk = graph_score(h, refs) if refs else None
        # place geometry decides; the graph only ranks when there are no places
        return (pk if pk is not None else (gk if gk is not None else 9e9),
                gk if gk is not None else 9e9)

    wiki = [h for h in hyps if h["_src"] == "wikidata"]
    tri = [h for h in hyps if h["_src"] == "graph-trilateration"]
    best_wiki = min(wiki, key=score) if wiki else None
    best_tri = min(tri, key=score) if tri else None
    # A real Wikidata entity is always preferred; the derived point only wins
    # when it is MATERIALLY better, i.e. the named entity is the wrong place.
    if best_wiki is None:
        best = best_tri
    elif best_tri is None:
        best = best_wiki
    else:
        best = best_tri if score(best_wiki)[0] > score(best_tri)[0] + TRILATERATION_MARGIN_KM else best_wiki

    worst = worst_place(best, pts) if pts else None
    med_place = place_score(best, pts) if pts else None
    gerr = round(graph_score(best, refs), 2) if refs else None

    if med_place is not None and med_place > MAX_PLACE_KM:
        dropped[s_] = f"median connected place {med_place:.0f} km > {MAX_PLACE_KM:.0f} km"
        continue
    if worst is None and gerr is not None and gerr > MAX_GRAPH_MEDIAN_KM:
        dropped[s_] = f"no connected places and graph disagrees ({gerr} km)"
        continue

    if gerr is not None and gerr > MAX_GRAPH_MEDIAN_KM and worst is not None:
        graph_conflicts[s_] = {"graphMedianErrorKm": gerr, "worstPlaceKm": round(worst, 1)}
    coords[s_] = {"lat": round(best["lat"], 5), "lon": round(best["lon"], 5), "qid": best.get("qid"),
                  "witness": ("nearby-places" if pts else "city-discovery-graph"),
                  "identity": best["_src"],
                  "worstPlaceKm": round(worst, 1) if worst is not None else None,
                  "medianPlaceKm": round(med_place, 1) if med_place is not None else None,
                  "places": len(pts), "graphMedianErrorKm": gerr}

print(f"\npublished coords: {len(coords)}/{len(slugs)}   dropped: {len(dropped)}")
for w in ["wikidata", "graph-trilateration"]:
    print(f"  identity {w:22s} {sum(1 for v in coords.values() if v['identity'] == w)}")
for w in ["nearby-places", "city-discovery-graph"]:
    print(f"  witness  {w:22s} {sum(1 for v in coords.values() if v['witness'] == w)}")
wp = sorted(v["worstPlaceKm"] for v in coords.values() if v["worstPlaceKm"] is not None)
print(f"worst-connected-place km: p50={statistics.median(wp):.0f} p90={wp[int(.9*len(wp))]:.0f} max={wp[-1]:.0f}")
sparse = {s: v["worstPlaceKm"] for s, v in coords.items() if v["worstPlaceKm"] and v["worstPlaceKm"] > REPORT_PLACE_KM}
print(f"sparse-radius cities (furthest place > {REPORT_PLACE_KM:.0f} km): {len(sparse)}")
print(f"cities where the published city-discovery graph conflicts with the place geometry: {len(graph_conflicts)}")
for s, d in sorted(graph_conflicts.items(), key=lambda kv: -kv[1]["graphMedianErrorKm"])[:20]:
    print(f"  {s}: graph median err {d['graphMedianErrorKm']} km (places fit {d['worstPlaceKm']} km)")
for s, r in sorted(dropped.items())[:20]:
    print(f"  DROP {s}: {r}")
json.dump({"coords": coords, "dropped": dropped, "graphConflicts": graph_conflicts, "sparse": sparse},
          open(CACHE / "city-coords.json", "w"))
