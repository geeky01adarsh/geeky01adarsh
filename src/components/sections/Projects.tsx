import { useMemo, useState } from "react";
import type { PortfolioConfig } from "../../types";
import { publicUrl } from "../../lib/publicUrl";
import { Badge } from "../ui/Badge";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Projects({ config }: Props) {
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    config.projects.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags).sort()];
  }, [config.projects]);

  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(() => {
    if (activeTag === "All") return config.projects;
    return config.projects.filter((p) => p.tags?.includes(activeTag));
  }, [config.projects, activeTag]);

  return (
    <Section
      id="projects"
      eyebrow="Selected Work"
      title="Featured Projects"
      description="Production systems engineered end-to end — from architecture to deployment."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
              activeTag === tag
                ? "bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white"
                : "border border-white/10 text-muted hover:border-white/20 hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((p) => (
          <GlassCard key={p.name} className="flex flex-col overflow-hidden p-0">
            {p.imageUrl ? (
              <div className="relative h-40 overflow-hidden border-b border-white/8">
                <img
                  src={publicUrl(p.imageUrl) ?? p.imageUrl}
                  alt={p.imageAlt ?? p.name}
                  className="h-full w-full object-cover opacity-80"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent" />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.period ? <p className="mt-1 font-mono text-xs text-muted">{p.period}</p> : null}
                </div>
                <div className="flex gap-2">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-1 font-mono text-xs text-muted hover:border-white/20 hover:text-foreground"
                    >
                      GitHub
                    </a>
                  ) : null}
                  {p.demo ? (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-1 font-mono text-xs text-muted hover:border-white/20 hover:text-foreground"
                    >
                      Demo
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-from)]">Problem</p>
                  <p className="mt-1 text-muted">{p.problem}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-from)]">Architecture</p>
                  <p className="mt-1 text-muted">{p.architecture}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-from)]">Stack</p>
                  <p className="mt-1 text-muted">{p.stack}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-from)]">Results</p>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-muted">
                    {p.results.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {p.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
