import type { EmergencyContact } from "@/types";

export function EmergencyContactsTable({
  caption,
  contacts,
}: {
  caption: string;
  contacts: EmergencyContact[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-neutral-soft text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-semibold" scope="col">
              Service
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Number
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {contacts.map((contact) => (
            <tr
              className="odd:bg-white even:bg-neutral-soft/60"
              key={`${contact.type}-${contact.value}`}
            >
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                {contact.label}
              </th>
              <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                <a
                  aria-label={`Call ${contact.label} on ${contact.value}`}
                  className="underline decoration-brand-500 decoration-2 underline-offset-4 hover:bg-orange-50"
                  href={`tel:${contact.value.replace(/\s+/g, "")}`}
                >
                  {contact.value}
                </a>
                {contact.availability ? (
                  <span className="ml-2 text-xs font-normal uppercase tracking-wide text-text-secondary">
                    {contact.availability}
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {contact.notes ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
