import Link from "next/link";
import { isCrossDeploymentPath } from "@/lib/navigation/ecosystem";

/**
 * The only link component allowed to render an ecosystem destination.
 *
 * WHY IT EXISTS: /blog and /places are served by other deployments through
 * Netlify rewrites, and this application builds no route for either. A
 * next/link to one of them prefetches a React payload for a page that cannot
 * exist here — a 404 in the console of every page load that puts the link in
 * the viewport — before falling back to a hard navigation anyway.
 *
 * WHY A COMPONENT RATHER THAN A RULE: the first two attempts at this were a
 * convention and then a lint. Both missed the hub navigation, which reads the
 * contract, renders every entry with <Link>, and passes each href as a
 * variable — invisible to a scan for literal hrefs. So the decision moved into
 * the element that makes it, and the gate now checks a structural fact
 * instead: a component that reads the navigation contract may not render
 * <Link> itself. It has to come through here.
 */
export function EcosystemLink({
  href,
  className,
  ariaCurrent,
  children,
}: {
  href: string;
  className?: string;
  ariaCurrent?: "page" | "true";
  children: React.ReactNode;
}) {
  if (isCrossDeploymentPath(href)) {
    return (
      <a aria-current={ariaCurrent} className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link aria-current={ariaCurrent} className={className} href={href}>
      {children}
    </Link>
  );
}
