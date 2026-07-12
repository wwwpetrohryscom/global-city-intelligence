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
    <section className="relative overflow-hidden border-b border-neutral-border bg-[radial-gradient(circle_at_18%_0%,rgba(254,215,170,0.42),transparent_30rem),linear-gradient(180deg,#FFFBF7_0%,#F9FAFB_68%,#FFFFFF_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#92400E_0%,#D97706_42%,#FED7AA_100%)]"
      />
      <Container className="relative grid gap-8 py-11 md:py-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
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
