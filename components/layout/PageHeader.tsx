import { Badge } from "@/components/ui/Badge";
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
    <section className="border-b border-neutral-border bg-neutral-soft">
      <Container className="grid gap-8 py-12 md:py-16 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="max-w-3xl">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[65ch] text-lg leading-8 text-text-secondary">
            {intro}
          </p>
        </div>
        {children ? (
          <Card as="div" className="self-end border-brand-400/50">
            {children}
          </Card>
        ) : null}
      </Container>
    </section>
  );
}
