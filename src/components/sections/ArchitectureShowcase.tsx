import { useEffect, useState } from "react";
import type { ArchitectureDiagram, PortfolioConfig } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

function DiagramSvg({ diagram, active }: { diagram: ArchitectureDiagram; active: boolean }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [active]);

  const nodeMap = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));
  const activeEdgeIndex = tick % diagram.edges.length;

  return (
    <svg viewBox="0 0 680 240" className="h-auto w-full" role="img" aria-label={diagram.title}>
      <defs>
        <linearGradient id={`grad-${diagram.id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-from)" />
          <stop offset="100%" stopColor="var(--accent-to)" />
        </linearGradient>
        <filter id={`glow-${diagram.id}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {diagram.edges.map((edge, i) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;
        const isActive = active && i === activeEdgeIndex;
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={`url(#grad-${diagram.id})`}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeOpacity={isActive ? 0.9 : 0.35}
              filter={isActive ? `url(#glow-${diagram.id})` : undefined}
            />
            {isActive ? (
              <circle r="4" fill="var(--accent-from)">
                <animateMotion
                  dur="1.5s"
                  repeatCount="indefinite"
                  path={`M${from.x},${from.y} L${to.x},${to.y}`}
                />
              </circle>
            ) : null}
            {edge.label ? (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 8}
                textAnchor="middle"
                className="fill-current text-[9px] opacity-50"
                style={{ fill: "var(--gray)" }}
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {diagram.nodes.map((node) => (
        <g key={node.id}>
          <rect
            x={node.x - 44}
            y={node.y - 18}
            width={88}
            height={36}
            rx={8}
            fill="var(--surface)"
            stroke="var(--card-border)"
            strokeWidth={1}
          />
          <text
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            className="text-[10px] font-medium"
            style={{ fill: "var(--black)" }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ArchitectureShowcase({ config }: Props) {
  const [activeId, setActiveId] = useState(config.architectureDiagrams[0]?.id ?? "");
  const active = config.architectureDiagrams.find((d) => d.id === activeId);

  return (
    <Section
      id="architecture"
      eyebrow="System Design"
      title="Architecture Showcase"
      description="Interactive diagrams from production systems — distributed pipelines, event-driven flows, and deployment infrastructure."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {config.architectureDiagrams.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActiveId(d.id)}
            className={`rounded-xl px-4 py-2 text-sm transition-colors ${
              activeId === d.id
                ? "bg-white/10 text-foreground"
                : "text-muted hover:bg-white/5 hover:text-foreground"
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {active ? (
        <GlassCard>
          <p className="mb-6 text-sm text-muted">{active.description}</p>
          <DiagramSvg diagram={active} active={true} />
        </GlassCard>
      ) : null}
    </Section>
  );
}
