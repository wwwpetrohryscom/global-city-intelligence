#!/usr/bin/env python3
"""Wave 12 sparse expansion: discover nature pools for the European/Anglo countries
that have existing cities with <5 nearby places (the 6 W12 countries are already
cached). Reuses nature_discover.run(). Resumable per country."""
import sys
sys.path.insert(0, "/Users/agent/global-city-intelligence/scripts/wave12")
import nature_discover as N

# Country QIDs for the sparse-city European/Anglo set (good Commons nature coverage).
EURO = {
    "italy": "Q38", "spain": "Q29", "poland": "Q36", "netherlands": "Q55",
    "new-zealand": "Q664", "ireland": "Q27", "sweden": "Q34", "portugal": "Q45",
    "belgium": "Q31", "czechia": "Q213", "romania": "Q218", "finland": "Q33",
    "greece": "Q41", "denmark": "Q35", "austria": "Q40", "croatia": "Q224",
    "norway": "Q20", "slovakia": "Q214", "slovenia": "Q215", "lithuania": "Q37",
    "latvia": "Q211", "estonia": "Q191", "hungary": "Q28", "switzerland": "Q39",
    "luxembourg": "Q32", "bulgaria": "Q219", "ukraine": "Q212", "serbia": "Q403",
}

for slug, cq in EURO.items():
    try:
        rows = N.run(slug, cq)
        print(f"  {slug}: {len(rows)} nature features")
    except Exception as e:
        print(f"  {slug}: ERROR {e}")
print("SPARSE NATURE DISCOVERY DONE")
