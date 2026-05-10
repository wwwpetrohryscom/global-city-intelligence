import type { VerifiedHospital } from "@/types";

export function VerifiedHospitalsTable({
  caption,
  hospitals,
}: {
  caption: string;
  hospitals: VerifiedHospital[];
}) {
  if (hospitals.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-border bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-neutral-soft text-text-secondary">
          <tr>
            <th className="px-4 py-3 font-semibold" scope="col">
              Hospital
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Type
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Emergency department
            </th>
            <th className="px-4 py-3 font-semibold" scope="col">
              Official link
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {hospitals.map((hospital) => (
            <tr
              className="odd:bg-white even:bg-neutral-soft/60"
              key={hospital.id}
            >
              <th
                className="px-4 py-4 font-medium text-text-primary"
                scope="row"
              >
                {hospital.name}
                {hospital.address ? (
                  <span className="block text-xs font-normal text-text-secondary">
                    {hospital.address}
                  </span>
                ) : null}
              </th>
              <td className="px-4 py-4 text-text-secondary">
                {hospital.type ?? "—"}
              </td>
              <td className="border-l-2 border-brand-500 px-4 py-4 font-semibold text-text-primary">
                {hospital.emergencyDepartmentAvailable === undefined
                  ? "Not specified"
                  : hospital.emergencyDepartmentAvailable
                    ? "Yes"
                    : "No"}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {hospital.officialUrl ? (
                  <a
                    className="font-semibold text-text-primary underline decoration-brand-500 decoration-2 hover:bg-orange-50"
                    href={hospital.officialUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Official page
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
