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
    <section className="border-b border-neutral-border bg-surface-soft">
      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[65ch] text-lg leading-8 text-text-secondary">
            {intro}
          </p>
        </div>
        {children ? (
          <Card as="div" className="self-end border-neutral-border">
            {children}
          </Card>
        ) : null}
      </Container>
    </section>
  );
}
