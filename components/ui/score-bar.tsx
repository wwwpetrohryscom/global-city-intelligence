export function ScoreBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div aria-label={`${label}: ${value} out of 100`} className="space-y-2.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-text-secondary">{label}</span>
        <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 font-semibold tabular-nums text-text-primary">
          {value}/100
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#EFE7DE]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#92400E_0%,#B86108_48%,#EA8C1A_100%)] shadow-[0_0_0_1px_rgba(146,64,14,0.08)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
