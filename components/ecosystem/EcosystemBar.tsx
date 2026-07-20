"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { EcosystemDrawer } from "@/components/ecosystem/EcosystemDrawer";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  EcosystemGlyph,
} from "@/components/ecosystem/icons";
import { Container } from "@/components/layout/Container";
import {
  ECOSYSTEM_BRAND,
  ECOSYSTEM_PATH,
  ECOSYSTEM_SECTION_IDS,
} from "@/lib/ecosystem/products";

/**
 * HELPERG ecosystem bar — Variant 7 ("company timeline").
 *
 * The top layer of the sticky stack: it pins at top: 0 and the site header
 * pins directly beneath it. It is a client component, but its bar markup is
 * fully server-rendered (the drawer is the only client-only part, and it is
 * absent until opened), so first paint is complete — no hydration flicker, no
 * CLS. Every interactive element degrades to a real link to `/ecosystem` (or
 * an in-page anchor), so the ecosystem is reachable with JavaScript disabled
 * and by crawlers.
 */
export function EcosystemBar() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);

  const openDrawer = useCallback((sectionId?: string) => {
    setTarget(sectionId);
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);

  const openWith = useCallback(
    (sectionId?: string) => (event: React.MouseEvent) => {
      // Progressive enhancement: with JS, intercept and open the panel; without
      // JS the browser follows the href to the full page / anchor.
      event.preventDefault();
      openDrawer(sectionId);
    },
    [openDrawer],
  );

  return (
    <div className="ecosystem-bar sticky top-0 z-40 border-b border-neutral-border bg-white">
      <nav aria-label="HELPERG ecosystem" className="h-full">
        <Container className="flex h-full items-center gap-3">
          {/* Left — brand, always a crawlable link to the ecosystem page. */}
          <Link
            className="group flex min-h-11 min-w-0 items-center gap-2.5 rounded-full py-1 pr-1 transition sm:min-h-0"
            href={ECOSYSTEM_PATH}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-eco-200 bg-eco-50 transition group-hover:border-eco-400 group-hover:bg-eco-100">
              <EcosystemGlyph className="h-[1.05rem] w-[1.05rem]" />
            </span>
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="truncate text-sm font-semibold text-text-primary">
                {ECOSYSTEM_BRAND.name}{" "}
                <span className="text-text-secondary">Ecosystem</span>
              </span>
              <span className="hidden text-xs text-text-muted xl:inline">
                {ECOSYSTEM_BRAND.tagline}
              </span>
            </span>
          </Link>

          {/* Center — quick links (desktop). Each is a real anchor to the page
              section that opens the drawer when JS is available. */}
          <div className="ml-1 hidden items-center gap-3 lg:flex">
            <Dot />
            <QuickLink
              expanded={open}
              href={`${ECOSYSTEM_PATH}#${ECOSYSTEM_SECTION_IDS.websites}`}
              onClick={openWith(ECOSYSTEM_SECTION_IDS.websites)}
            >
              Websites
            </QuickLink>
            <Dot />
            <QuickLink
              expanded={open}
              href={`${ECOSYSTEM_PATH}#${ECOSYSTEM_SECTION_IDS.apps}`}
              onClick={openWith(ECOSYSTEM_SECTION_IDS.apps)}
            >
              Mobile Apps
            </QuickLink>
          </div>

          {/* Right — primary CTA. */}
          <div className="ml-auto flex shrink-0 items-center">
            <a
              aria-haspopup="dialog"
              aria-expanded={open}
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-eco-200 bg-eco-50 px-3.5 text-sm font-semibold text-eco-700 transition duration-150 hover:border-eco-400 hover:bg-eco-100 sm:min-h-9 sm:px-4"
              href={ECOSYSTEM_PATH}
              onClick={openWith(undefined)}
            >
              <span className="hidden sm:inline">Explore </span>
              <span className="hidden md:inline">HELPERG&nbsp;</span>
              <span className="hidden sm:inline">Ecosystem</span>
              <span className="sm:hidden">Explore</span>
              <ArrowRightIcon className="hidden h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 sm:block" />
              <ChevronDownIcon className="h-4 w-4 sm:hidden" />
            </a>
          </div>
        </Container>
      </nav>

      <EcosystemDrawer onClose={closeDrawer} open={open} scrollTargetId={target} />
    </div>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="h-1 w-1 shrink-0 rounded-full bg-neutral-line"
    />
  );
}

function QuickLink({
  href,
  onClick,
  expanded,
  children,
}: {
  href: string;
  onClick: (event: React.MouseEvent) => void;
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-expanded={expanded}
      aria-haspopup="dialog"
      className="inline-flex items-center rounded-full px-1 text-sm font-medium text-text-secondary transition duration-150 hover:text-eco-700 focus-visible:text-eco-700"
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
