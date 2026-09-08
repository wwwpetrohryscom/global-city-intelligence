"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { EcosystemLink } from "@/components/navigation/EcosystemLink";
import { availableDestinations } from "@/lib/navigation/ecosystem";

/**
 * The primary navigation.
 *
 * WHAT WAS WRONG BEFORE: the nav was `overflow-x-auto` with `min-w-max` — a
 * horizontally scrolling ribbon. At any width where the links did not fit, they
 * were not collapsed, they were CLIPPED, and reaching the last of them meant
 * discovering that a strip of the page scrolled sideways. That is a scrollbar
 * standing in for an information architecture decision.
 *
 * WHAT IT IS NOW: one row of real links down to 1180px, where all ten
 * destinations measurably fit (812px of links in 860px of space), and a single
 * disclosure below that. There is no horizontal scrolling at any width.
 *
 * ONE COPY OF EVERY LINK. The same <ul> is the row on desktop and the panel on
 * narrow screens — CSS changes its layout, not its contents. Nothing is
 * rendered twice and hidden, so a destination cannot appear twice in the
 * header's markup and the "no duplicate destination" rule is structural rather
 * than a convention someone has to remember.
 *
 * CLIENT, BUT NOT COSTLY: it imports only `lib/navigation/ecosystem`, which is
 * ten string literals and no data layer. The links are in the server-rendered
 * HTML exactly as before, so they stay crawlable and work without JavaScript
 * (the panel is only needed below 1180px, where the toggle is the only thing
 * JavaScript adds).
 */
export function PrimaryNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = `${useId()}-primary-nav`;
  const destinations = availableDestinations();

  // A width change can leave the panel "open" while the row is showing; the
  // row ignores the state, but the toggle's aria-expanded would lie. Closing
  // on route change keeps the two in agreement and stops the panel from
  // covering the page the visitor just asked for.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isCurrent = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end nav:justify-end">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-eco-200 bg-white px-3 text-sm font-medium text-text-secondary transition hover:border-eco-300 hover:bg-eco-50 hover:text-eco-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500 nav:hidden"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <MenuIcon open={open} />
        Menu
      </button>

      <nav
        aria-label="Primary navigation"
        className="contents"
      >
        <ul
          className={[
            // Narrow: a panel under the header, pinned below the sticky stack.
            "absolute inset-x-0 top-full z-40 flex-col gap-0.5 border-b border-eco-100 bg-white p-3 shadow-[0_18px_45px_-24px_rgba(23,32,51,0.35)]",
            open ? "flex" : "hidden",
            // Wide: the same list becomes the row. `!static` and `!flex` win
            // over the panel state, so the row can never be affected by it.
            "nav:!static nav:!flex nav:flex-row nav:items-center nav:gap-0.5 nav:border-0 nav:bg-transparent nav:p-0 nav:shadow-none xl:gap-1",
          ].join(" ")}
          id={panelId}
        >
          {destinations.map((item) => {
            const current = isCurrent(item.path);
            return (
              <li key={item.id}>
                <EcosystemLink
                  ariaCurrent={current ? "page" : undefined}
                  className={[
                    "inline-flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-medium transition duration-150",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-eco-500",
                    "nav:min-h-10 nav:w-auto nav:px-2.5 nav:text-[13.5px] xl:px-3 xl:text-sm",
                    current
                      ? "bg-eco-50 font-semibold text-eco-800"
                      : "text-text-secondary hover:bg-eco-50 hover:text-eco-800",
                    // The editorial product is a different KIND of destination
                    // from the data sections, so it keeps the brand accent it
                    // had before rather than a badge or an animation.
                    item.servedBy === "gci-media" && !current
                      ? "text-brand-700 hover:bg-brand-50 hover:text-brand-800"
                      : "",
                  ].join(" ")}
                  href={item.path}
                >
                  {item.label}
                </EcosystemLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}
