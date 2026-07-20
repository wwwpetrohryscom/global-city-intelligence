import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-eco-100 bg-[radial-gradient(circle_at_16%_0%,rgba(219,238,254,0.82),transparent_32rem),radial-gradient(circle_at_82%_12%,rgba(240,253,246,0.72),transparent_26rem),linear-gradient(180deg,#F7F9FC_0%,#FFFFFF_78%)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-info)_0%,var(--color-positive)_54%,var(--color-brand)_100%)]"
      />
      <Container className="relative grid gap-8 py-11 md:py-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-eco-800">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.06] text-text-primary sm:text-5xl lg:text-[3.35rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-8 text-text-secondary">
            {intro}
          </p>
        </div>
        {children ? (
          <Card as="div" className="self-end border-neutral-border/80 bg-white/95 p-6">
            {children}
          </Card>
        ) : null}
      </Container>
    </section>
  );
}
