import type { AirportProfile } from "@/types";

export function AirportLinksTable({
  caption,
  airports,
}: {
  caption: string;
  airports: AirportProfile[];
}) {
  if (airports.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-neutral-soft text-text-primary">
          <tr>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Airport
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              IATA
            </th>
            <th
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              scope="col"
            >
              Official link
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {airports.map((airport) => (
            <tr
              className="odd:bg-white even:bg-neutral-soft/60"
              key={airport.id}
            >
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                {airport.name}
              </th>
              <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                {airport.iataCode ?? "—"}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                <a
                  className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                  href={airport.officialUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Official page
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
