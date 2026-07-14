#!/usr/bin/env python3
"""TS2590 guard: after phase6_append splices new records into the `export const
<name>` SPREAD array, the appended object literals form one large inline literal
again. Move them out into fresh chunk consts (<name>_<next>..) of <=SIZE objects
each and rewrite the export spread. Idempotent-ish: only acts on literal objects
currently sitting in the export array (spreads are preserved, existing chunks
untouched). Run AFTER phase6_append, BEFORE typecheck."""
import re, sys
from pathlib import Path

ROOT = Path("/Users/agent/global-city-intelligence")


def split_top_level(inner):
    """Split an array's inner text into top-level comma-separated elements,
    respecting strings, template literals, escapes, // line comments and nesting."""
    elems, buf = [], []
    i, n = 0, len(inner)
    depth = 0
    quote = None  # active string delimiter
    while i < n:
        ch = inner[i]
        if quote:
            buf.append(ch)
            if ch == "\\" and i + 1 < n:
                buf.append(inner[i + 1]); i += 2; continue
            if ch == quote:
                quote = None
            i += 1; continue
        # not in a string
        if ch in "\"'`":
            quote = ch; buf.append(ch); i += 1; continue
        if ch == "/" and i + 1 < n and inner[i + 1] == "/":
            # line comment -> skip to end of line (drop it)
            j = inner.find("\n", i)
            if j == -1: j = n
            i = j; continue
        if ch in "{[(":
            depth += 1; buf.append(ch); i += 1; continue
        if ch in "}])":
            depth -= 1; buf.append(ch); i += 1; continue
        if ch == "," and depth == 0:
            elems.append("".join(buf)); buf = []; i += 1; continue
        buf.append(ch); i += 1
    tail = "".join(buf).strip()
    if tail:
        elems.append(tail)
    return elems


def rechunk(rel, name, typ, size):
    path = ROOT / rel
    text = path.read_text()
    export_re = re.compile(r"export const " + re.escape(name) + r"\s*:\s*readonly " + re.escape(typ) + r"\[\]\s*=\s*\[")
    m = export_re.search(text)
    if not m:
        print(f"  {name}: export decl not found — skip"); return
    open_i = m.end() - 1  # position of '['
    # find matching close bracket
    depth, j = 0, open_i
    while j < len(text):
        if text[j] == "[": depth += 1
        elif text[j] == "]":
            depth -= 1
            if depth == 0: break
        j += 1
    close_i = j
    inner = text[open_i + 1:close_i]
    elems = [e.strip() for e in split_top_level(inner) if e.strip()]
    spreads = [e for e in elems if e.startswith("...")]
    literals = [e for e in elems if not e.startswith("...")]
    if not literals:
        print(f"  {name}: no inline literals in export ({len(spreads)} spreads) — nothing to rechunk"); return
    # next chunk index
    existing = [int(x) for x in re.findall(r"const " + re.escape(name) + r"_(\d+)\s*:", text)]
    nxt = (max(existing) + 1) if existing else 0
    # build new chunk consts
    new_consts = []
    new_names = []
    for k in range(0, len(literals), size):
        cname = f"{name}_{nxt}"; nxt += 1
        new_names.append(cname)
        body = ",\n".join(literals[k:k + size])
        new_consts.append(f"const {cname}: readonly {typ}[] = [\n{body},\n];")
    # rewrite: replace the whole export declaration (incl. trailing ';;') with
    # new chunk consts + a fresh export spread. Preserve everything after verbatim.
    insert_at = m.start()
    end = close_i + 1
    while end < len(text) and text[end] == ";":  # consume ';' / ';;'
        end += 1
    all_spread_names = spreads + [f"...{c}" for c in new_names]
    new_export = (f"export const {name}: readonly {typ}[] = ["
                  + ", ".join(all_spread_names) + "];")
    new_text = (text[:insert_at]
                + "\n\n".join(new_consts) + "\n\n"
                + new_export
                + text[end:])
    path.write_text(new_text)
    print(f"  {name}: moved {len(literals)} literals -> {len(new_names)} new chunk(s) {new_names}; export now {len(all_spread_names)} spreads")


if __name__ == "__main__":
    print("rechunk education.universities:")
    rechunk("lib/data/education.ts", "universities", "UniversityProfile", 1200)
    print("rechunk healthcare.medicalFacilities:")
    rechunk("lib/data/healthcare-retirement.ts", "medicalFacilities", "MedicalFacility", 2000)
    print("RECHUNK DONE")
