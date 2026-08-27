#!/usr/bin/env python3
"""Canonical nature taxonomy + deterministic classification rules.

Classification is driven by Wikidata structured types (P31, and one hop of
P279 on each P31 value) for the place entity. A place NAME is never used to
add a category — only, in a small number of hard-coded cases, to remove one.
"Lakeview Park" is a park, not a lake.

Every rule below is keyed on a TYPE entity, not on free text from the place
record, so the same evidence is reproducible from scripts/nature/cache.
"""

# ---------------------------------------------------------------------------
# 1. Categories that exist because the corpus actually supports them.
#    Ordered by classification priority: a place typed as both a waterfall and
#    a protected area is a waterfall. Specific physical features outrank
#    protective designations, which outrank generic recreation land.
# ---------------------------------------------------------------------------
CATEGORY_PRIORITY = [
    "waterfall", "cave", "canyon", "glacier", "beach", "lake", "island",
    "volcano", "river", "wetland", "mountain", "valley", "coast", "desert",
    "forest", "national-park", "nature-reserve", "park", "viewpoint",
]
# The order settles the three real collisions in the corpus:
#   volcanic crater lake -> lake      (Lake Haruna reads as a lake)
#   river island         -> island    (Yeouido reads as an island)
#   stratovolcano        -> volcano   (Mount Fuji reads as a volcano,
#                                      and still appears under mountains
#                                      because it carries both categories)

# ---------------------------------------------------------------------------
# 2. Contamination — type entities that disqualify a place from every nature
#    category, however it is otherwise typed. Extends the airport /
#    artificial-island filters already applied to the corpus.
# ---------------------------------------------------------------------------
# Individual entities that are landmass- or subcontinent-scale. They are real
# features correctly typed as peninsulas, ranges and valleys, but nobody
# spends a weekend at "the Iberian Peninsula", so they are not destinations.
# Kept as an explicit, short, reviewable list rather than an area threshold:
# Wikidata P2046 units are inconsistent across these entities (Haut-Languedoc
# publishes 307,183,804 with unit `hectare`, three orders of magnitude out),
# so an area gate would encode a wrong number as a rule.
VETO_PLACE_QIDS = {
    "Q483134",   # Korean Peninsula
    "Q12837",    # Iberian Peninsula
    "Q51614",    # Anatolia
    "Q6821578",  # Mesopotamia
    "Q177567",   # Amazon rainforest
    "Q1286",     # Alps (the range as a whole)
    "Q5477",     # Caucasus Mountains
    "Q486986",   # Greater Caucasus
    "Q130978",   # Yucatan Peninsula
    "Q2661894",  # Florida Peninsula
    "Q1031793",  # Chilean Central Valley
    "Q3623051",  # Sub-Balkan valleys
}

# Type entities that disqualify a place from every nature category, however
# it is otherwise typed. Extends the airport / artificial-island filters
# already applied to the corpus. These are UNCONDITIONAL: an artificial island
# typed `island` is still artificial.
VETO_TYPE_QIDS = {
    "Q13691",      # artificial island
    "Q28692646",   # artificial island airport
    "Q135474849",  # artificial archipelago
    "Q10873387",   # list of National Forest Parks of China - a Wikimedia list
    "Q65640417",   # petrified forest - a fossil site, not woodland
    "Q139765196",  # former waterfall - no longer a waterfall
    "Q12053053",   # artificial waterfall
    "Q10460934",   # artificial hill      - a landscaped mound in a city park
    "Q483453",     # fountain
    "Q167346",     # botanical garden      - cultivated collection, not a natural feature
    "Q272231",     # arboretum
    "Q1759852",    # sculpture garden
    "Q291177",     # rose garden
    "Q1107656",    # garden
    "Q12783",      # English garden
    "Q12774",      # French formal garden
    "Q14946335",   # Historic Garden (Spain)
    "Q1048525",    # golf course
    "Q130003",     # ski resort
    "Q1021711",    # seaside resort
    "Q875157",     # resort
    "Q317548",     # resort town
    "Q100996875",  # wakeboarding resort
    "Q1440300",    # observation tower
    "Q15911738",   # hydroelectric power station
    "Q339353",     # pumped-storage power station
    "Q446013",     # pumping station
    "Q3497366",    # whaling station
    "Q1616075",    # television station
    "Q27095213",   # shopping district
    "Q118793205",  # small states
}

# Type entities that veto a place only when nothing in TYPE_CATEGORIES matched.
#
# These describe a designation layered ON TOP of a place rather than what the
# place is: Peneda-Geres is typed both `national park` and `cultural
# heritage`, and it is a national park. Applying them unconditionally deleted
# real parks from the corpus, so they are consulted last — a place with no
# natural type left is a heritage or administrative record, and is dropped.
SOFT_VETO_TYPE_QIDS = {
    "Q839954",     # archaeological site
    "Q11331347",   # calvary
    "Q231685",     # stations of the Cross
    "Q23929227",   # place of national remembrance
    "Q1433032",    # Lourdes grotto
    "Q210272",     # cultural heritage
    "Q1129474",    # cultural landscape
    "Q5264414",    # designed landscape
    "Q3491088",    # mesoregion            - administrative statistical division
    "Q1162817",    # geographical small region of Hungary
    "Q572995",     # natural region of France
    "Q1970725",    # natural region
    "Q12018178",   # geomorphological district
    "Q12018175",   # geomorphological subprovince
    "Q12766313",   # geomorphological unit
    "Q82794",      # region                - too coarse to visit
    "Q4835091",    # territory
    "Q3257686",    # locality
    "Q10561633",   # hometown Fuji
    "Q222912",     # rolling country
    "Q110544132",  # free flight site
    "Q23764086",   # site where canyoning is practiced
    "Q1200957",    # tourist destination
}

# HARD veto labels. A place typed as a settlement, a building, a transport
# facility or an institution is not a natural feature even when it also
# carries a natural type — "Canvey Island" is typed both `town` and
# `river island`, and it is a town.
HARD_VETO_TYPE_LABEL = (
    r"airport|aerodrome|airfield|air base|spaceport|heliport|"
    r"railway station|metro station|bus station|seaport|container port|"
    r"museum|\bzoo\b|aquarium|stadium|arena|shopping|mall\b|hotel|hostel|"
    r"amusement|theme park|water park|funfair|"
    r"hospital|university|school|prison|barracks|"
    r"\bchurch\b|cathedral|chapel|basilica|monastery|abbey|convent|temple|mosque|synagogue|"
    r"\bcastle\b|palace|chateau|manor|villa|fortress|citadel|bunker|"
    r"\bmine\b|quarry|factory|industrial|power plant|refinery|"
    r"\bdam\b|weir|aqueduct|waterworks|sewage|"
    r"bridge|tunnel|skyscraper|\bbuilding\b|"
    r"human settlement|municipalit|commune of|\bvillage\b|\btown\b|\bcity\b|"
    r"census-designated|unincorporated|neighbou?rhood|hamlet|suburb|"
    r"sovereign state|\bcontinent\b|subcontinent|tectonic plate|"
    r"disambiguation|scholarly article|\bfilm\b|\btaxon\b|\bhuman\b|"
    r"Wikimedia|encyclopedic article"
)

# SOFT veto labels. Applied only when no curated type in TYPE_CATEGORIES
# matched, so "natural monument" is not lost to /monument/ and "country park"
# is not lost to /\bcountry\b/.
VETO_TYPE_LABEL = (
    r"airport|aerodrome|airfield|air base|spaceport|heliport|"
    r"railway station|metro station|bus station|seaport|container port|"
    r"museum|\bzoo\b|aquarium|stadium|arena|shopping|mall\b|hotel|hostel|"
    r"amusement|theme park|water park|funfair|"
    r"hospital|university|school|prison|barracks|"
    r"\bchurch\b|cathedral|chapel|basilica|monastery|abbey|convent|temple|mosque|synagogue|"
    r"\bcastle\b|palace|chateau|manor|villa|fortress|citadel|\bfort\b|bunker|"
    r"memorial|monument|battlefield|cemetery|mausoleum|"
    r"\bmine\b|quarry|factory|mill\b|industrial|power plant|refinery|"
    r"\bdam\b|weir|aqueduct|\bcanal\b|waterworks|sewage|"
    r"bridge|tunnel|tower|skyscraper|building|house\b|\bhall\b|"
    r"human settlement|municipalit|commune of|\bvillage\b|\btown\b|\bcity\b|"
    r"administrative|\bcounty\b|\bprovince\b|\bdistrict\b|\bborough\b|\bward\b|"
    r"sovereign state|\bcountry\b|continent|subcontinent|tectonic plate|"
    r"census-designated|unincorporated|neighbou?rhood|hamlet|suburb|"
    r"historic district|heritage site|world heritage|"
    r"golf|ski (?:resort|area)|campground|camping|caravan|marina\b"
)

# ---------------------------------------------------------------------------
# 3. Type entity -> nature categories. A type may license more than one
#    category, so a stratovolcano is both a volcano and a mountain and appears
#    on both pages. Multi-category is deliberate: it is how Mount Fuji stays
#    answerable to "which mountains can I reach".
# ---------------------------------------------------------------------------
TYPE_CATEGORIES = {
    # --- lakes and still water -------------------------------------------
    "Q23397": ["lake"], "Q131681": ["lake"], "Q3215290": ["lake"],
    "Q104093746": ["lake"], "Q30092776": ["lake"], "Q211302": ["lake"],
    "Q188025": ["lake"], "Q187223": ["lake", "coast"], "Q204324": ["lake", "volcano"],
    "Q11726988": ["lake"], "Q100900880": ["lake", "volcano"], "Q1734500": ["lake"],
    "Q2551525": ["lake"], "Q12376661": ["lake"], "Q3705882": ["lake", "coast"],
    "Q863974": ["lake", "island"], "Q3391202": ["lake"], "Q2479431": ["lake"],
    "Q337567": ["lake"],
    # --- rivers -----------------------------------------------------------
    "Q4022": ["river"], "Q47521": ["river"], "Q355304": ["river"],
    "Q30092769": ["river"], "Q3529419": ["river"], "Q1437299": ["river"],
    "Q63565252": ["river"], "Q4366834": ["river"], "Q3073652": ["river"],
    "Q108822533": ["river"], "Q98242145": ["river"], "Q125941113": ["river"],
    "Q846385": ["river"], "Q1967665": ["river"], "Q7164110": ["river"],
    "Q57208171": ["river"], "Q1233637": ["river"], "Q7338349": ["river"],
    "Q43197": ["river", "wetland"], "Q2490191": ["river", "valley"],
    "Q162602": ["island", "river"], "Q14713846": ["beach", "river"],
    "Q202199": ["island"],
    # --- waterfalls -------------------------------------------------------
    "Q34038": ["waterfall"], "Q2270442": ["waterfall"], "Q2967706": ["waterfall", "coast"],
    "Q357384": ["waterfall"], "Q21504956": ["waterfall", "cave"],
    # --- beaches and coast ------------------------------------------------
    "Q40080": ["beach"], "Q7900097": ["beach"], "Q38051384": ["beach"],
    "Q34763": ["coast"], "Q185113": ["coast"], "Q39594": ["coast"],
    "Q191992": ["coast"], "Q93352": ["coast"], "Q468756": ["coast"],
    "Q45776": ["coast"], "Q37901": ["coast"], "Q31615": ["coast"],
    "Q107679": ["coast"], "Q47053": ["coast", "wetland"], "Q941043": ["coast", "beach"],
    "Q2923911": ["coast"],
    # --- islands ----------------------------------------------------------
    "Q23442": ["island"], "Q33837": ["island"], "Q1161185": ["island", "volcano"],
    # --- mountains and elevation -----------------------------------------
    "Q8502": ["mountain"], "Q46831": ["mountain"], "Q54050": ["mountain"],
    "Q207326": ["mountain"], "Q111177881": ["mountain"], "Q3393392": ["mountain"],
    "Q674541": ["mountain"], "Q2624046": ["mountain"], "Q9381142": ["mountain"],
    "Q1061151": ["mountain"], "Q12059057": ["mountain"], "Q502899": ["mountain"],
    "Q1437459": ["mountain"], "Q75520": ["mountain"], "Q55075651": ["mountain"],
    "Q106589819": ["mountain"], "Q113320279": ["mountain"],
    # --- valleys and canyons ---------------------------------------------
    "Q39816": ["valley"], "Q1672567": ["valley"], "Q1739217": ["valley"],
    "Q649266": ["valley"], "Q611796": ["valley"], "Q664803": ["valley"],
    "Q2366717": ["valley"], "Q1976531": ["valley"], "Q1410408": ["valley"],
    "Q190429": ["valley"], "Q150784": ["canyon", "valley"],
    "Q1744266": ["canyon", "valley"], "Q2042028": ["canyon", "valley"],
    "Q3699460": ["canyon", "valley"],
    # --- caves ------------------------------------------------------------
    "Q35509": ["cave"], "Q2232001": ["cave"], "Q7558985": ["cave"],
    "Q1435994": ["cave"], "Q1317637": ["cave"], "Q66443867": ["cave"],
    "Q58214800": ["cave"], "Q57732276": ["cave"], "Q1131329": ["cave"],
    "Q16817": ["cave"],
    # --- volcanoes --------------------------------------------------------
    "Q8072": ["volcano", "mountain"], "Q169358": ["volcano", "mountain"],
    "Q1197120": ["volcano", "mountain"], "Q1330974": ["volcano", "mountain"],
    "Q212057": ["volcano", "mountain"], "Q534282": ["volcano", "mountain"],
    "Q37499745": ["volcano", "mountain"], "Q653139": ["volcano", "mountain"],
    "Q159954": ["volcano"], "Q519105": ["volcano"], "Q29025902": ["volcano"],
    "Q2895674": ["volcano"], "Q1194379": ["volcano"], "Q193457": ["volcano"],
    "Q108066280": ["volcano"], "Q55818": ["volcano"], "Q7290026": ["volcano"],
    "Q109391": ["volcano"],
    # --- glaciers and desert ---------------------------------------------
    "Q35666": ["glacier", "mountain"],
    "Q8514": ["desert"], "Q25391": ["desert"], "Q104774336": ["desert"],
    "Q62129035": ["desert"], "Q863906": ["desert"],
    # --- wetlands ---------------------------------------------------------
    "Q170321": ["wetland"], "Q30198": ["wetland"], "Q166735": ["wetland"],
    "Q1681353": ["wetland"], "Q3240227": ["wetland"], "Q125165628": ["wetland"],
    "Q514050": ["wetland"], "Q55706997": ["wetland"], "Q29925": ["wetland"],
    "Q107990807": ["wetland", "nature-reserve"], "Q56344511": ["wetland", "nature-reserve"],
    "Q19683138": ["wetland", "nature-reserve"], "Q6158975": ["wetland", "nature-reserve"],
    "Q7990118": ["wetland", "nature-reserve"],
    # --- forest -----------------------------------------------------------
    "Q4421": ["forest"], "Q3241565": ["forest"], "Q208478": ["forest"],
    "Q3079086": ["forest"], "Q1740919": ["forest"], "Q1211122": ["forest"],
    "Q2337961": ["forest"], "Q11177275": ["forest"], "Q1197552": ["forest"],
    "Q4930213": ["forest"], "Q1975546": ["forest"], "Q29529886": ["forest"],
    "Q7315273": ["forest", "nature-reserve"], "Q56344503": ["forest", "nature-reserve"],
    "Q3079027": ["forest", "nature-reserve"], "Q612741": ["forest", "nature-reserve"],
    "Q24194884": ["forest", "nature-reserve"], "Q2324919": ["forest", "nature-reserve"],
    "Q18479032": ["forest", "nature-reserve"], "Q329842": ["forest", "nature-reserve"],
    "Q16966008": ["forest", "nature-reserve"], "Q141112511": ["forest", "nature-reserve"],
    "Q107557544": ["forest", "nature-reserve"], "Q6629955": ["forest", "park"],
    "Q92272084": ["forest", "park"],
    # --- V4 forest ontology additions (each type reviewed individually) -----
    "Q1510380": ["forest"],     # grove
    "Q10509765": ["forest"],    # border forest
    "Q199403": ["forest"],      # tropical forest
    "Q18578149": ["forest"],    # forest in the Netherlands
    "Q6536864": ["forest"],     # holm oak forest
    "Q7242530": ["forest"],     # ribbon forest
    "Q4409552": ["forest"],     # riparian forest (alt id)
    "Q1907114": ["forest"],     # gallery forest
    "Q1189895": ["forest"],     # cloud forest
    "Q194188": ["forest"],      # spruce forest
    "Q1348589": ["forest"],     # beech forest
    "Q2445146": ["forest"],     # oak forest
    "Q4290092": ["forest"],     # boreal forest
    "Q1153216": ["forest"],     # temperate rainforest
    "Q159183": ["forest"],      # rainforest

    # --- national parks ---------------------------------------------------
    "Q46169": ["national-park"], "Q3220096": ["national-park"],
    "Q14215551": ["national-park"], "Q108060568": ["national-park"],
    "Q1316973": ["national-park"], "Q18618819": ["national-park"],
    "Q56809587": ["national-park"], "Q34918903": ["national-park"],
    "Q3364923": ["national-park"], "Q1317754": ["national-park"],
    "Q20526152": ["national-park"], "Q21815132": ["national-park"],
    "Q1296040": ["national-park"],
    # --- protected areas / reserves --------------------------------------
    "Q473972": ["nature-reserve"], "Q140460149": ["nature-reserve"],
    "Q179049": ["nature-reserve"], "Q15069452": ["nature-reserve"],
    "Q1191622": ["nature-reserve"], "Q796174": ["nature-reserve"],
    "Q60534895": ["nature-reserve"], "Q2463705": ["nature-reserve"],
    "Q158454": ["nature-reserve"], "Q9309832": ["nature-reserve"],
    "Q21101734": ["nature-reserve"], "Q15089606": ["nature-reserve"],
    "Q1959314": ["nature-reserve"], "Q19656847": ["nature-reserve"],
    "Q3936950": ["nature-reserve"], "Q28055269": ["nature-reserve"],
    "Q3457526": ["nature-reserve"], "Q1410668": ["nature-reserve"],
    "Q1377575": ["nature-reserve"], "Q759421": ["nature-reserve"],
    "Q20081524": ["nature-reserve"], "Q9307836": ["nature-reserve"],
    "Q422211": ["nature-reserve"], "Q23790": ["nature-reserve"],
    "Q21100463": ["nature-reserve"], "Q62059246": ["nature-reserve"],
    "Q3457689": ["nature-reserve"], "Q17000624": ["nature-reserve"],
    "Q3564598": ["nature-reserve"], "Q65148973": ["nature-reserve"],
    "Q20296613": ["nature-reserve"], "Q2828312": ["nature-reserve"],
    "Q25429352": ["nature-reserve"], "Q10594991": ["nature-reserve"],
    "Q372363": ["nature-reserve"], "Q1324355": ["nature-reserve"],
    "Q21503788": ["nature-reserve"], "Q759882": ["nature-reserve"],
    "Q20290500": ["nature-reserve"], "Q63354980": ["nature-reserve"],
    "Q174945": ["nature-reserve"], "Q386426": ["nature-reserve"],
    # --- parks and recreation land ---------------------------------------
    "Q22698": ["park"], "Q22746": ["park"], "Q1761072": ["park"],
    "Q6063204": ["park"], "Q2006279": ["park"], "Q350723": ["park"],
    "Q5177940": ["park"], "Q338112": ["park"], "Q16023747": ["park"],
    "Q728904": ["park", "nature-reserve"], "Q20354035": ["park", "nature-reserve"],
    "Q16149276": ["park", "nature-reserve"], "Q1818761": ["park", "nature-reserve"],
    "Q79979740": ["park"], "Q20893000": ["park", "nature-reserve"],
    "Q108060572": ["park", "nature-reserve"], "Q28055278": ["park", "nature-reserve"],
    "Q6576413": ["park", "nature-reserve"], "Q1803820": ["park", "nature-reserve"],
    "Q37989229": ["park"], "Q38001316": ["park"], "Q37995709": ["park"],
    "Q38001301": ["park"], "Q37999727": ["park"], "Q28399100": ["park"],
    "Q37952119": ["park"], "Q5999924": ["park"], "Q37895263": ["park"],
    "Q37994313": ["park"], "Q37994596": ["park"], "Q111415237": ["park"],
    # --- viewpoints -------------------------------------------------------
    "Q6017969": ["viewpoint"],
    # --- V4 waterfall ontology additions ------------------------------------
    "Q1332767": ["waterfall"],  # cataract
    "Q3623925": ["waterfall"],  # waterfall group

    # --- long tail promoted to high confidence after review ---------------
    "Q1226252": ["island"], "Q555937": ["island"], "Q1402592": ["island"],
    "Q131587717": ["island"],
    "Q19850234": ["mountain"], "Q740445": ["mountain"], "Q133056": ["mountain"],
    "Q6341928": ["lake"], "Q317995": ["lake"],
    "Q1092661": ["nature-reserve"], "Q63248569": ["nature-reserve"],
    "Q53444003": ["nature-reserve"], "Q18379650": ["nature-reserve"],
    "Q6974560": ["nature-reserve"], "Q23905068": ["nature-reserve"],
    "Q337807": ["nature-reserve"], "Q27995042": ["nature-reserve"],
    "Q5162993": ["nature-reserve"], "Q485098": ["national-park"],
    "Q3997444": ["national-park"], "Q11832860": ["national-park"],
    "Q123923573": ["national-park"], "Q30304302": ["national-park"],
    "Q108060629": ["national-park"], "Q1071482": ["national-park"],
    "Q1277221": ["park"], "Q15222729": ["park"], "Q28936794": ["park"],
    "Q27038967": ["park"], "Q26810467": ["park"], "Q5469191": ["forest", "park"],
    "Q1322134": ["coast"],
}

# Superclass (one P279 hop from a P31 value) -> categories. Only consulted
# when no P31 value of the place is in TYPE_CATEGORIES, so it never overrides
# a specific type.
SUPERCLASS_CATEGORIES = {
    "Q23397": ["lake"], "Q2479431": ["lake"], "Q337567": ["lake"],
    "Q3391202": ["lake"], "Q2551525": ["lake"], "Q3215290": ["lake"],
    "Q12376661": ["lake"], "Q15324": ["lake"],
    "Q355304": ["river"], "Q30092769": ["river"], "Q55462971": ["river"],
    "Q34038": ["waterfall"], "Q40080": ["beach"],
    "Q23442": ["island"], "Q202199": ["island"],
    "Q8502": ["mountain"], "Q46831": ["mountain"], "Q106589819": ["mountain"],
    "Q39816": ["valley"], "Q150784": ["canyon", "valley"],
    "Q35509": ["cave"], "Q8072": ["volcano", "mountain"],
    "Q29025902": ["volcano"], "Q35666": ["glacier", "mountain"],
    "Q170321": ["wetland"], "Q30198": ["wetland"],
    "Q4421": ["forest"], "Q46169": ["national-park"],
    "Q473972": ["nature-reserve"], "Q140460149": ["nature-reserve"],
    "Q179049": ["nature-reserve"], "Q15069452": ["nature-reserve"],
    "Q62059246": ["nature-reserve"], "Q1377575": ["nature-reserve"],
    "Q728904": ["park", "nature-reserve"], "Q3564598": ["nature-reserve"],
    "Q17000624": ["nature-reserve"], "Q65148973": ["nature-reserve"],
    "Q20296613": ["nature-reserve"], "Q2828312": ["nature-reserve"],
    "Q25429352": ["nature-reserve"], "Q3457689": ["nature-reserve"],
    "Q22698": ["park"], "Q338112": ["park"], "Q16023747": ["park"],
    "Q93352": ["coast"], "Q468756": ["coast"], "Q191992": ["coast"],
    "Q205895": ["island"], "Q1286517": [], "Q271669": [],
}

# Type-label patterns, used only when neither the P31 QIDs nor their
# superclasses resolve. The label belongs to the TYPE entity, so this is
# still structured evidence, one tier weaker.
LABEL_CATEGORIES = [
    (r"\bwaterfall\b|\bcascade\b", ["waterfall"]),
    (r"\bvolcan|caldera|\blava\b", ["volcano", "mountain"]),
    (r"\bcave\b|cavern|\bkarst\b", ["cave"]),
    (r"canyon|gorge|ravine", ["canyon", "valley"]),
    (r"glacier|icefield", ["glacier", "mountain"]),
    (r"\bbeach\b|\bstrand\b|\bplaya\b", ["beach"]),
    (r"\blake\b|\bpond\b|reservoir|\bloch\b|lagoon|\btarn\b", ["lake"]),
    (r"\briver\b|\bstream\b|\bcreek\b|watercourse", ["river"]),
    (r"wetland|\bmarsh\b|\bswamp\b|\bbog\b|\bfen\b|estuar|\bmire\b", ["wetland"]),
    (r"\bisland\b|\bisle\b|archipelago|\batoll\b|\bcay\b", ["island"]),
    (r"mountain|\bhill\b|\bpeak\b|\bsummit\b|massif|\bridge\b|\bmesa\b|plateau|\bbutte\b", ["mountain"]),
    (r"\bvalley\b|\bglen\b|\bdale\b|\bvale\b", ["valley"]),
    (r"peninsula|headland|\bcape\b|\bbay\b|\bfjord\b|coastline|\bcoast\b|\bcliff\b|\bcove\b|\bshore\b", ["coast"]),
    (r"\bdesert\b|\bdune\b|sand sea", ["desert"]),
    (r"forest|woodland|\bwood\b|\btaiga\b|rainforest", ["forest"]),
    (r"national park", ["national-park"]),
    (r"nature reserve|protected area|wildlife refuge|conservation area|biosphere|"
     r"natura 2000|nature park|naturpark|naturschutz|landscape park|protected landscape|"
     r"wilderness|game reserve|sanctuary", ["nature-reserve"]),
    (r"\bpark\b|recreation area|greenbelt|green space", ["park"]),
    (r"viewpoint|lookout|panorama", ["viewpoint"]),
]

# ---------------------------------------------------------------------------
# 4. Name-based demotions. These may only ever REMOVE a category, never add
#    one, so a name can never manufacture a lake.
# ---------------------------------------------------------------------------
NAME_DEMOTIONS = [
    # a "<something> Park" named after a lake is a park, not a lake
    (r"\bpark\b|\bgardens?\b|\bpromenade\b|\bplaza\b", ["lake", "beach", "mountain", "river"]),
]

# Categories a dedicated /cities/[city]/<route> page may be built for, and the
# route segment each uses.
PAGE_CATEGORIES = {
    "lake": "lakes", "beach": "beaches", "mountain": "mountains",
    "forest": "forests", "waterfall": "waterfalls", "island": "islands",
    "nature-reserve": "protected-areas", "national-park": "protected-areas",
    "park": "parks",
}
