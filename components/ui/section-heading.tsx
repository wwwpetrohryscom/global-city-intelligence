export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-[65ch] text-base leading-7 text-text-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}
