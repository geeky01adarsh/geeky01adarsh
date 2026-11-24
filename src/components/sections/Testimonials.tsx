import type { PortfolioConfig } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Testimonials({ config }: Props) {
  const items = config.testimonials ?? [];
  if (items.length === 0) return null;

  return (
    <Section
      id="testimonials"
      eyebrow="Recognition"
      title="What People Say"
      description="Feedback from managers, founders, and engineering leaders."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((t) => (
          <GlassCard key={`${t.author}-${t.role}`}>
            <blockquote className="text-muted">&ldquo;{t.quote}&rdquo;</blockquote>
            <footer className="mt-4 border-t border-white/8 pt-4">
              <p className="font-semibold">{t.author}</p>
              <p className="text-sm text-muted">
                {t.role}
                {t.company ? ` · ${t.company}` : ""}
              </p>
            </footer>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
