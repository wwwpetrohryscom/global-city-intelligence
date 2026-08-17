"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchIndex } from "@/components/search/use-search-index";
import { flagEmoji } from "@/lib/search/regions";
import { EMPTY_RESULTS, search } from "@/lib/search/query";

/**
 * Global country + city search.
 *
 * Client-only and index-driven: it never imports `lib/data` (which would drag
 * the multi-megabyte data layer into the browser bundle) and never imports
 * `lib/seo/routes` for the same reason — result hrefs are built from the two
 * literal path shapes below.
 *
 * Semantics follow the ARIA combobox pattern: the input owns
 * `aria-expanded`/`aria-controls`/`aria-activedescendant`, the panel is a
 * `listbox` of `option`s grouped by entity type, and selection is tracked by
 * active-descendant so focus never leaves the input while arrowing.
 */

const cityHref = (slug: string) => `/cities/${slug}`;
const countryHref = (slug: string) => `/countries/${slug}`;

type Flat =
  | { kind: "country"; id: string; href: string; label: string; sub: string; flag: string }
  | { kind: "city"; id: string; href: string; label: string; sub: string; flag: string };

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { countries, cities, status, prime } = useSearchIndex();

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const inputId = `${baseId}-input`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Element focus is returned here on close so keyboard users are not dumped
  // at the top of the document.
  const restoreRef = useRef<HTMLElement | null>(null);

  const results = useMemo(
    () => (status === "ready" ? search(countries, cities, query) : EMPTY_RESULTS),
    [countries, cities, query, status],
  );

  const flat = useMemo<Flat[]>(() => {
    const out: Flat[] = [];
    results.countries.forEach((c, i) => {
      out.push({
        kind: "country",
        id: `${baseId}-c-${i}`,
        href: countryHref(c.s),
        label: c.n,
        sub: c.c === 1 ? "1 city" : `${c.c} cities`,
        flag: flagEmoji(c.i),
      });
    });
    results.cities.forEach((c, i) => {
      out.push({
        kind: "city",
        id: `${baseId}-t-${i}`,
        href: cityHref(c.s),
        label: c.n,
        // `d` is set only where the name+country string repeats, so the two
        // Portlands in the United States stay tellable apart.
        sub: c.d ? `${c.cn} · /${c.d}` : c.cn,
        flag: "",
      });
    });
    return out;
  }, [results, baseId]);

  useEffect(() => setActive(0), [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    restoreRef.current?.focus();
  }, []);

  const openNow = useCallback(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    prime();
  }, [prime]);

  // Cmd/Ctrl+K opens from anywhere; Escape closes even when focus has moved
  // into the panel.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) close();
        else openNow();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openNow]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close on outside pointer press.
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) close();
    }
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [open, close]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (!flat.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + flat.length) % flat.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(flat.length - 1);
    } else if (event.key === "Enter") {
      const target = flat[active];
      if (target) {
        event.preventDefault();
        close();
        router.push(target.href);
      }
    }
  }

  const countryHits = flat.filter((f) => f.kind === "country");
  const cityHits = flat.filter((f) => f.kind === "city");
  const hasQuery = query.trim().length > 0;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={openNow}
        onPointerEnter={prime}
        onFocus={prime}
        aria-label="Search countries or cities"
        aria-haspopup="dialog"
        aria-expanded={open}
        // min-h-11 (44px) is the accessible touch-target floor on mobile; the
        // desktop row can afford the tighter 40px so the header stays compact.
        className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-eco-200 bg-white px-3.5 py-2 text-sm text-text-secondary transition duration-150 hover:border-eco-300 hover:bg-eco-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 lg:min-h-10 lg:w-64"
      >
        <SearchIcon />
        <span className="flex-1 text-left">Search countries or cities</span>
        <kbd className="hidden rounded-md border border-eco-200 bg-eco-50 px-1.5 py-0.5 text-[11px] font-medium text-eco-700 lg:inline-block">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[var(--sticky-stack-height)] z-50 px-4 lg:absolute lg:inset-x-auto lg:right-0 lg:top-[calc(100%+0.5rem)] lg:w-[28rem] lg:px-0">
          <div className="overflow-hidden rounded-2xl border border-eco-200 bg-white shadow-[0_18px_45px_-18px_rgba(23,32,51,0.28)]">
            <div className="flex items-center gap-2 border-b border-eco-100 px-3.5 py-2.5">
              <SearchIcon />
              <label className="sr-only" htmlFor={inputId}>
                Search countries or cities
              </label>
              <input
                id={inputId}
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search countries or cities"
                autoComplete="off"
                spellCheck={false}
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={flat[active]?.id}
                className="min-h-11 flex-1 border-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
              />
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xs font-medium text-text-secondary transition hover:bg-eco-50 hover:text-eco-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain">
              <ul id={listboxId} role="listbox" aria-label="Search results">
                {countryHits.length ? (
                  <li role="presentation">
                    <GroupLabel>Countries</GroupLabel>
                    <ul role="group" aria-label="Countries">
                      {countryHits.map((hit) => (
                        <ResultRow
                          key={hit.id}
                          hit={hit}
                          selected={flat[active]?.id === hit.id}
                          onHover={() => setActive(flat.indexOf(hit))}
                          onPick={close}
                        />
                      ))}
                    </ul>
                  </li>
                ) : null}
                {cityHits.length ? (
                  <li role="presentation">
                    <GroupLabel>Cities</GroupLabel>
                    <ul role="group" aria-label="Cities">
                      {cityHits.map((hit) => (
                        <ResultRow
                          key={hit.id}
                          hit={hit}
                          selected={flat[active]?.id === hit.id}
                          onHover={() => setActive(flat.indexOf(hit))}
                          onPick={close}
                        />
                      ))}
                    </ul>
                  </li>
                ) : null}
              </ul>

              {hasQuery && status === "ready" && !flat.length ? (
                <p className="px-4 py-6 text-center text-sm text-text-secondary">
                  No countries or cities match “{query.trim()}”.
                </p>
              ) : null}
              {status === "loading" ? (
                <p className="px-4 py-6 text-center text-sm text-text-secondary">
                  Loading search…
                </p>
              ) : null}
              {status === "error" ? (
                <p className="px-4 py-6 text-center text-sm text-text-secondary">
                  Search is unavailable right now. Browse{" "}
                  <Link className="font-medium text-eco-700 underline" href="/countries">
                    all countries
                  </Link>{" "}
                  instead.
                </p>
              ) : null}
              {!hasQuery && status !== "error" ? (
                <p className="px-4 py-6 text-center text-sm text-text-secondary">
                  Start typing a country or city name.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* Result count for screen readers, announced politely as it changes. */}
      <p aria-live="polite" className="sr-only">
        {open && hasQuery && status === "ready"
          ? `${results.total} result${results.total === 1 ? "" : "s"} for ${query.trim()}`
          : ""}
      </p>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
      {children}
    </p>
  );
}

function ResultRow({
  hit,
  selected,
  onHover,
  onPick,
}: {
  hit: Flat;
  selected: boolean;
  onHover: () => void;
  onPick: () => void;
}) {
  return (
    <li id={hit.id} role="option" aria-selected={selected}>
      <Link
        href={hit.href}
        onClick={onPick}
        onPointerMove={onHover}
        tabIndex={-1}
        className={`flex min-h-11 items-center gap-3 px-4 py-2 text-sm transition ${
          selected ? "bg-eco-50 text-eco-900" : "text-text-primary hover:bg-eco-50/70"
        }`}
      >
        {hit.flag ? (
          <span aria-hidden="true" className="text-base leading-none">
            {hit.flag}
          </span>
        ) : (
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ecogreen-400" />
        )}
        <span className="flex-1 truncate font-medium">{hit.label}</span>
        <span className="shrink-0 text-xs text-text-secondary">{hit.sub}</span>
      </Link>
    </li>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-eco-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}
