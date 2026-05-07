import type { EmergencyContact } from "@/types";

export function EmergencyContactCard({
  contact,
}: {
  contact: EmergencyContact;
}) {
  return (
    <article className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {contact.label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
        <a
          aria-label={`Call ${contact.label} on ${contact.value}`}
          className="underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-orange-50"
          href={`tel:${contact.value.replace(/\s+/g, "")}`}
        >
          {contact.value}
        </a>
      </p>
      {contact.availability ? (
        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
          Availability: {contact.availability}
        </p>
      ) : null}
      {contact.notes ? (
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          {contact.notes}
        </p>
      ) : null}
    </article>
  );
}
