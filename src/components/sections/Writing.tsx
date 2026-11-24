import type { PortfolioConfig } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Writing({ config }: Props) {
  const stats = config.writingStats;

  return (
    <Section
      id="writing"
      eyebrow="Publications"
      title="Articles & Writing"
      description="Technical writing on systems design, network analytics, and backend engineering."
    >
      {stats ? (
        <div className="mb-8 flex flex-wrap gap-6">
          <div>
            <p className="text-3xl font-semibold">{stats.articles}</p>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Articles Published</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{stats.views}</p>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">Total Views</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {config.writing.map((article) => (
          <GlassCard key={article.title} className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold leading-snug">{article.title}</h3>
              {article.views ? (
                <span className="shrink-0 font-mono text-xs text-muted">{article.views}</span>
              ) : null}
            </div>
            {article.excerpt ? <p className="mt-2 flex-1 text-sm text-muted">{article.excerpt}</p> : null}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">
                {article.platform}
                {article.date ? ` · ${article.date}` : ""}
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[var(--accent-from)] transition-colors hover:text-[var(--accent-to)]"
              >
                Read →
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
