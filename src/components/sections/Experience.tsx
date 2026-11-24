import type { PortfolioConfig } from "../../types";
import { publicUrl } from "../../lib/publicUrl";
import { Badge } from "../ui/Badge";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Experience({ config }: Props) {
  return (
    <Section
      id="experience"
      eyebrow="Career"
      title="Experience"
      description="Building production systems across Web3, network intelligence, and full-stack platforms."
    >
      <ol className="relative space-y-0">
        <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent-from)] via-[var(--accent-to)] to-transparent opacity-30" aria-hidden />

        {config.experience.map((job, idx) => (
          <li key={`${job.company}-${job.start}`} className="relative pb-10 pl-16 last:pb-0">
            <span
              className="absolute left-4 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--accent-from)] bg-[var(--surface)]"
              style={{ boxShadow: `0 0 12px ${job.themeAccent ?? "var(--accent-from)"}40` }}
              aria-hidden
            >
              <span className="h-2 w-2 rounded-full bg-[var(--accent-from)]" />
            </span>

            <GlassCard style={{ borderLeftColor: job.themeAccent, borderLeftWidth: "3px" }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {job.logoUrl ? (
                  <img
                    src={publicUrl(job.logoUrl) ?? job.logoUrl}
                    alt={job.logoAlt ?? `${job.company} logo`}
                    className="h-12 w-12 rounded-xl border border-white/10 object-contain"
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold">{job.role}</h3>
                    <span className="text-sm text-muted">
                      {job.company} · {job.start} – {job.end}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{job.location}</p>

                  {job.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  ) : null}

                  {job.stats?.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {job.stats.map((s) => (
                        <div key={s.label} className="rounded-lg bg-white/5 px-3 py-2 text-center">
                          <p className="text-lg font-semibold">{s.value}</p>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 space-y-4">
                    {job.highlights.map((h) => (
                      <div key={h.name}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-[var(--accent-from)]">
                            {h.name}
                          </span>
                          <span className="text-xs text-muted">{h.stack}</span>
                        </div>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                          {h.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {idx < config.experience.length - 1 ? null : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
