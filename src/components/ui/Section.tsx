import type { ReactNode } from "react";
import { useSectionReveal } from "../../hooks/useSectionReveal";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, description, children, className = "" }: Props) {
  const ref = useSectionReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`reveal-section mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 ${className}`}
    >
      <header className="mb-12 max-w-2xl">
        {eyebrow ? <p className="section-eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        {description ? <p className="mt-4 text-lg text-muted">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
