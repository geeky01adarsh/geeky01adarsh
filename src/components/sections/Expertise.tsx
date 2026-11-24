import type { PortfolioConfig } from "../../types";
import { Badge } from "../ui/Badge";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Expertise({ config }: Props) {
  return (
    <Section
      id="expertise"
      eyebrow="Capabilities"
      title="Engineering Expertise"
      description="Deep specialization across the full stack — from packet-level systems to AI-powered applications."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {config.expertise.map((card) => (
          <GlassCard
            key={card.id}
            style={{ borderTopColor: card.accent, borderTopWidth: "2px" }}
            className="flex flex-col"
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{card.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {card.skills.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
