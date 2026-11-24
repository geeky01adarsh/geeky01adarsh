import type { PortfolioConfig } from "../../types";
import { AnimatedCounter } from "../ui/AnimatedCounter";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Metrics({ config }: Props) {
  return (
    <Section
      id="metrics"
      eyebrow="Impact"
      title="Engineering at Scale"
      description="Production systems serving real users, processing real traffic, and delivering measurable results."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {config.metrics.map((m) => (
          <GlassCard key={m.id} className="text-center">
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              <AnimatedCounter
                value={m.value}
                suffix={m.suffix}
                prefix={m.prefix}
                decimals={m.decimals}
              />
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted sm:text-xs">
              {m.label}
            </p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
