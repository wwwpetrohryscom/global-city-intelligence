import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils/cn";

export function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section className={cn("py-12 md:py-16", className)} id={id}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
