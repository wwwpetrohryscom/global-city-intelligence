export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div aria-hidden="true" className="mb-3 h-1 w-10 rounded-full bg-[linear-gradient(90deg,var(--color-info),var(--color-positive),var(--color-brand))]" />
      <h2 className="text-[1.65rem] font-semibold leading-tight text-text-primary md:text-[1.8rem]">
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
