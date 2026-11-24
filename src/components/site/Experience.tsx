import { publicUrl } from "../../lib/publicUrl";
import type { ExperienceSection } from "../../types";
import { SectionHead, useSite } from "./shared";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-03" → "Mar 2024"; anything else passes through ("present" → "Present"). */
export function formatMonth(v: string) {
  const m = /^(\d{4})-(\d{2})$/.exec(v.trim());
  if (m) return `${MONTHS[Number(m[2]) - 1] ?? ""} ${m[1]}`;
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function Experience({ section }: { section: ExperienceSection }) {
  const { config } = useSite();
  return (
    <section className="section-shell xp-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <ol className="xp-list">
          {config.experience.map((job) => {
            const logo = publicUrl(job.logoUrl);
            return (
              <li key={`${job.company}-${job.start}`} className="xp-card">
                <div className="xp-meta">
                  <div className="xp-meta-sticky">
                    <div className="xp-company">
                      {logo ? (
                        <span className="xp-logo">
                          <img src={logo} alt={job.logoAlt ?? job.company} loading="lazy" />
                        </span>
                      ) : null}
                      <div>
                        <h3>{job.company}</h3>
                        <p>{job.role}</p>
                      </div>
                    </div>
                    <p className="xp-dates">
                      {formatMonth(job.start)} — {formatMonth(job.end)}
                      <span>{job.location}</span>
                    </p>
                    {job.tags?.length ? (
                      <div className="chip-row">
                        {job.tags.map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="xp-body">
                  {job.stats?.length ? (
                    <div className="xp-stats">
                      {job.stats.map((s) => (
                        <div key={s.label}>
                          <strong>{s.value}</strong>
                          <small>{s.label}</small>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {job.highlights.map((h) => (
                    <div key={h.name} className="xp-highlight">
                      <div className="xp-highlight-head">
                        <h4>{h.name}</h4>
                        <span>{h.stack}</span>
                      </div>
                      <ul>
                        {h.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
