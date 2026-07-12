export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div aria-hidden="true" className="mb-3 h-1 w-10 rounded-full bg-brand-500" />
      <h2 className="text-[1.65rem] font-semibold leading-tight text-text-primary">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-[65ch] text-base leading-7 text-text-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}
