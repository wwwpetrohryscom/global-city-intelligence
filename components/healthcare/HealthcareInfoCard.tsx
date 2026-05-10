import type { HealthcareLink } from "@/types";

export function HealthcareInfoCard({
  title,
  body,
  link,
}: {
  title: string;
  body?: string;
  link?: HealthcareLink;
}) {
  if (!body && !link) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {title}
      </p>
      {body ? (
        <p className="mt-2 text-sm leading-6 text-text-primary">{body}</p>
      ) : null}
      {link ? (
        <p className="mt-3 text-sm leading-6">
          <a
            className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
            href={link.url}
            rel="noreferrer"
            target="_blank"
          >
            {link.label}
          </a>
        </p>
      ) : null}
    </article>
  );
}
