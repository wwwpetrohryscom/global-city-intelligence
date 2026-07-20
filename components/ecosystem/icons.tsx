import type { SVGProps } from "react";

/**
 * Small inline icons for the ecosystem surfaces. The project has no icon
 * library (icons are hand-authored SVG, e.g. BrandMark), so these follow the
 * same convention: currentColor strokes, decorative-by-default, sized by the
 * caller via className.
 */

/**
 * Ecosystem mark — a compact constellation of nodes. Reads as a small family
 * of connected products rather than a generic "grid app-switcher" glyph.
 */
export function EcosystemGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Two-tone HELPERG mark: blue primary nodes + green accent nodes. */}
      <path
        d="M10 3.2 4.4 6.4v7.2L10 16.8l5.6-3.2V6.4L10 3.2Z"
        opacity="0.3"
        stroke="#0F6CBD"
        strokeLinejoin="round"
        strokeWidth="1.1"
      />
      <circle cx="10" cy="10" fill="#0F6CBD" r="1.7" />
      <circle cx="10" cy="4.2" fill="#0F6CBD" opacity="0.9" r="1.15" />
      <circle cx="15" cy="7" fill="#4CAF50" r="1.15" />
      <circle cx="15" cy="13" fill="#4CAF50" opacity="0.8" r="1.15" />
      <circle cx="10" cy="15.8" fill="#0F6CBD" opacity="0.75" r="1.15" />
      <circle cx="5" cy="13" fill="#4CAF50" opacity="0.8" r="1.15" />
      <circle cx="5" cy="7" fill="#0F6CBD" opacity="0.9" r="1.15" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/** Outbound-link affordance — arrow leaving a frame. */
export function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.5 3.5h-3v9h9v-3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
      <path
        d="M9.5 3.5h3v3M12.5 3.5 7.5 8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m4 4 8 8M12 4l-8 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Generic, platform-neutral store glyphs.
 *
 * NOTE: HELPERG brand rules and the Apple/Google trademark guidelines both
 * forbid re-drawing the official "Download on the App Store" / "Get it on
 * Google Play" badge artwork. These are neutral, monochrome marks (a device
 * for the App Store, a play-triangle for Google Play) paired with a text
 * label — recognisable without imitating the trademarked badges. If official
 * badge assets are ever licensed, swap them in here only.
 */
export function AppStoreGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="13"
        rx="2.6"
        stroke="currentColor"
        strokeWidth="1.2"
        width="9"
        x="3.5"
        y="1.5"
      />
      <path
        d="M6.7 3.4h2.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="12.5" fill="currentColor" r="0.85" />
    </svg>
  );
}

export function GooglePlayGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.8 2.2v11.6c0 .5.55.8.97.53l8.4-5.8c.37-.26.37-.8 0-1.06l-8.4-5.8A.64.64 0 0 0 3.8 2.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
