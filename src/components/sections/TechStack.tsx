import { useMemo, useState } from "react";
import type { PortfolioConfig } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function TechStack({ config }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return config.techStack
      .filter((cat) => !activeCategory || cat.id === activeCategory)
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter((s) => !q || s.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [config.techStack, query, activeCategory]);

  return (
    <Section
      id="tech-stack"
      eyebrow="Proficiency"
      title="Tech Stack"
      description="Interactive skills map across languages, infrastructure, AI, and security."
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search technologies..."
          className="glass flex-1 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted"
          aria-label="Search technologies"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
              !activeCategory
                ? "bg-white/10 text-foreground"
                : "text-muted hover:bg-white/5"
            }`}
          >
            All
          </button>
          {config.techStack.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                activeCategory === cat.id
                  ? "bg-white/10 text-foreground"
                  : "text-muted hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((cat) => (
          <GlassCard key={cat.id}>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--accent-from)]">
              {cat.label}
            </h3>
            <div className="space-y-3">
              {cat.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="font-mono text-xs text-muted">{skill.proficiency}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] transition-all duration-700"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
