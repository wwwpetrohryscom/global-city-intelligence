"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRightIcon,
  CloseIcon,
  EcosystemGlyph,
} from "@/components/ecosystem/icons";
import {
  AppsGrid,
  FutureProductsNote,
  WebsitesGrid,
} from "@/components/ecosystem/EcosystemSections";
import {
  ECOSYSTEM_BRAND,
  ECOSYSTEM_PATH,
  ECOSYSTEM_SECTION_IDS,
  ecosystemCounts,
} from "@/lib/ecosystem/products";

const TITLE_ID = "helperg-ecosystem-drawer-title";
const EXIT_MS = 240;

const FOCUSABLE =
  'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * The HELPERG ecosystem mega-panel. Rendered into a body portal so it always
 * sits above the sticky bar/header stack and can never be trapped by a parent
 * stacking context. It is a proper modal dialog: Escape closes it, focus is
 * trapped inside and restored to the trigger on close, the background is
 * scroll-locked, and the whole thing is only ever in the DOM while open (so it
 * adds nothing to first paint and cannot cause hydration flicker or CLS).
 */
export function EcosystemDrawer({
  open,
  onClose,
  scrollTargetId,
}: {
  open: boolean;
  onClose: () => void;
  /** Optional section id to scroll into view once the panel is open. */
  scrollTargetId?: string;
}) {
  const [mounted, setMounted] = useState(false);
  // `active` keeps the panel in the DOM through its exit animation.
  const [active, setActive] = useState(false);
  // `entered` drives the enter/exit transition target.
  const [entered, setEntered] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enter/exit lifecycle: mount immediately on open, unmount after the exit
  // transition on close.
  useEffect(() => {
    if (open) {
      setActive(true);
      const raf = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    setEntered(false);
    if (!active) return;
    const timer = setTimeout(() => setActive(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open, active]);

  // Scroll-lock + focus management + Escape + focus-trap, while active.
  useEffect(() => {
    if (!active) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // Move focus into the panel once it is on screen.
    const focusTimer = requestAnimationFrame(() => {
      panelRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === panel);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey) {
        if (activeEl === first || activeEl === panel) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", onKeyDown, true);
      body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [active, onClose]);

  // When opened via a section quick-link, bring that section into view inside
  // the panel's own scroll area (the page behind stays scroll-locked).
  useEffect(() => {
    if (!entered || !scrollTargetId) return;
    const panel = panelRef.current;
    if (!panel) return;
    const el = panel.querySelector<HTMLElement>(`#${CSS.escape(scrollTargetId)}`);
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [entered, scrollTargetId]);

  // The scroll container overlays the backdrop, so close-on-outside-click must
  // live on the container itself and fire only when the empty area around the
  // panel is clicked (not a click that bubbles up from inside the panel).
  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  if (!mounted || !active) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70]" role="presentation">
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-200 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className="absolute inset-0 flex items-start justify-center overflow-y-auto overscroll-contain p-3 pt-3 sm:p-4 sm:pt-[calc(var(--ecosystem-bar-height)_+_0.75rem)]"
        onClick={handleContainerClick}
      >
        <div
          aria-labelledby={TITLE_ID}
          aria-modal="true"
          className={`relative my-auto w-full max-w-4xl rounded-2xl border border-neutral-border/80 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] outline-none transition duration-200 sm:my-0 ${
            entered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
          ref={panelRef}
          role="dialog"
          tabIndex={-1}
        >
          <div className="flex items-start justify-between gap-4 border-b border-neutral-border/80 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-200 bg-brand-50 text-brand-700">
                <EcosystemGlyph className="h-5 w-5" />
              </span>
              <div>
                <h2
                  className="text-base font-semibold text-text-primary"
                  id={TITLE_ID}
                >
                  {ECOSYSTEM_BRAND.name} Ecosystem
                </h2>
                <p className="text-xs text-text-secondary">
                  {ecosystemCounts.websites} websites · {ecosystemCounts.apps}{" "}
                  mobile apps
                </p>
              </div>
            </div>
            <button
              aria-label="Close the HELPERG ecosystem panel"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-neutral-border bg-white text-text-secondary transition hover:border-brand-200 hover:bg-brand-50 hover:text-text-primary sm:h-9 sm:w-9"
              onClick={onClose}
              type="button"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[min(70vh,42rem)] overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <DrawerSection
              id={ECOSYSTEM_SECTION_IDS.websites}
              subtitle="Explore every HELPERG website."
              title="Websites"
            >
              <WebsitesGrid compact />
            </DrawerSection>

            <DrawerSection
              className="mt-7"
              id={ECOSYSTEM_SECTION_IDS.apps}
              subtitle="Download the HELPERG mobile apps."
              title="Mobile apps"
            >
              <AppsGrid compact />
            </DrawerSection>

            <DrawerSection
              className="mt-7"
              id={ECOSYSTEM_SECTION_IDS.future}
              subtitle="What is coming next."
              title="Future products"
            >
              <FutureProductsNote compact />
            </DrawerSection>
          </div>

          <div className="border-t border-neutral-border/80 px-5 py-4 sm:px-6">
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-100"
              href={ECOSYSTEM_PATH}
              onClick={onClose}
            >
              Open the full ecosystem page
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DrawerSection({
  id,
  title,
  subtitle,
  className,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className={className} id={id}>
      <div className="mb-3">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.08em] text-text-primary"
          id={`${id}-heading`}
        >
          {title}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
