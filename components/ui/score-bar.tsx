export function ScoreBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div aria-label={`${label}: ${value} out of 100`} className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-text-secondary">{label}</span>
        <span className="font-semibold tabular-nums text-text-primary">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-line/70">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#92400E,#D97706)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
