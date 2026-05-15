import { useLayoutEffect, useRef } from "react";
import type { PortfolioConfig, Project, Experience } from "../types";
import { publicUrl } from "../lib/publicUrl";

type Props = {
  config: PortfolioConfig;
  revealedIds: string[];
  onRevealSection: (id: string) => void;
};

function githubProfilePng(githubProfileUrl: string): string | null {
  try {
    const u = new URL(githubProfileUrl);
    const user = u.pathname.split("/").filter(Boolean)[0];
    if (!user || !u.hostname.replace("www.", "").endsWith("github.com")) return null;
    return `https://github.com/${user}.png?size=480`;
  } catch {
    return null;
  }
}

/** Split a "stack" string into chips so we have a fallback when `tags` is not provided. */
function fallbackTags(stackOrTags: string | string[] | undefined): string[] {
  if (!stackOrTags) return [];
  const items = Array.isArray(stackOrTags) ? stackOrTags : stackOrTags.split(",");
  return items.map((s) => s.trim()).filter(Boolean);
}

function projectTags(p: Project): string[] {
  if (p.tags?.length) return p.tags;
  return fallbackTags(p.stack);
}

function experienceTags(e: Experience): string[] {
  if (e.tags?.length) return e.tags;
  return [];
}

/** Small animated Canton-style mini network — pure SVG, no deps. */
function CantonMini() {
  return (
    <svg
      className="hero-mini"
      viewBox="0 0 220 140"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="hm-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8ef9ff" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <g stroke="url(#hm-edge)" strokeOpacity="0.6" strokeWidth="1.6" fill="none">
        <line x1="30" y1="40" x2="110" y2="90" />
        <line x1="110" y1="90" x2="190" y2="40" />
        <line x1="30" y1="40" x2="190" y2="40" />
        <line x1="110" y1="90" x2="60" y2="120" />
        <line x1="110" y1="90" x2="160" y2="120" />
      </g>
      <g>
        <circle cx="30" cy="40" r="9" className="hero-mini__node hero-mini__node--cyan" />
        <circle cx="190" cy="40" r="9" className="hero-mini__node hero-mini__node--cyan" />
        <circle cx="110" cy="90" r="12" className="hero-mini__node hero-mini__node--gold" />
        <circle cx="60" cy="120" r="7" className="hero-mini__node hero-mini__node--violet" />
        <circle cx="160" cy="120" r="7" className="hero-mini__node hero-mini__node--violet" />
      </g>
      <g className="hero-mini__pulse" fill="#fdc50f">
        <circle cx="110" cy="90" r="3.5">
          <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function revealInView(el: HTMLElement, onRevealSection: (id: string) => void) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  const vw = window.innerWidth || 0;
  if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) return;
  el.classList.add("is-revealed");
  const id = el.dataset.sectionId;
  if (id) onRevealSection(id);
}

export function LandingPage({ config, revealedIds, onRevealSection }: Props) {
  const observer = useRef<IntersectionObserver | null>(null);
  const v = config.visual;
  const hero = v?.hero;
  const portrait =
    hero?.portraitUrl?.trim() ||
    (hero?.useGithubAvatarFallback !== false ? githubProfilePng(config.meta.links.github) : null) ||
    undefined;
  const portraitAlt = hero?.portraitAlt ?? `${config.meta.siteTitle} — profile photo`;
  const heroStats = config.heroStats ?? [];

  useLayoutEffect(() => {
    observer.current?.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-revealed");
          const id = el.dataset.sectionId;
          if (id) onRevealSection(id);
        }
      },
      /* threshold 0.18 could skip a tall hero on short viewports (intersection ratio stays below 0.18 → stuck at opacity 0). */
      { threshold: 0, rootMargin: "80px 0px" },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      revealInView(el, onRevealSection);
      observer.current?.observe(el);
    });

    return () => observer.current?.disconnect();
  }, [onRevealSection]);

  function scrollTo(id: string) {
    onRevealSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const skillsBanner = v?.skillsBanner;
  const contactBanner = v?.contactBanner;

  return (
    <div className="landing">
      <section
        className="card hero hero--rich"
        data-section-id="hero"
        data-reveal
        id="hero"
      >
        <div className="hero__intro">
          {/* <span className="tag tag--accent">Portfolio v2 · live build</span> */}
          <h1>
            {config.meta.siteTitle}
            <span className="hero__cursor" aria-hidden>
              _
            </span>
          </h1>
          <p className="lead">{config.meta.tagline}</p>
          <p className="muted hero__location">
            <span className="dot" aria-hidden /> {config.meta.location}
          </p>
          <div className="hero-actions">
            <a
              className="btn-primary"
              href={`mailto:${config.meta.email}`}
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              Email me
            </a>
            <a className="btn-ghost" href={config.meta.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn-ghost" href={config.meta.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>

          {heroStats.length > 0 ? (
            <ul className="hero-stats" aria-label="Highlights">
              {heroStats.map((s) => (
                <li key={s.label} className="hero-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {portrait ? (
          <figure className="hero__portrait">
            <img
              src={publicUrl(portrait) ?? portrait}
              alt={portraitAlt}
              loading="eager"
              decoding="async"
              width={480}
              height={480}
            />
            <figcaption className="hero__portrait-badge">
              <span className="hero__portrait-dot" aria-hidden /> available · {config.meta.location.split(",")[0]}
            </figcaption>
          </figure>
        ) : null}

        <aside
          className={`card hero__aside${hero?.asideImageUrl ? " hero__aside--has-bg" : ""}`}
        >
          {hero?.asideImageUrl ? (
            <img
              className="hero__aside-photo"
              src={publicUrl(hero.asideImageUrl) ?? hero.asideImageUrl}
              alt={hero.asideImageAlt ?? ""}
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="hero__aside-body">
            <div className="hero__aside-headline">
              <CantonMini />
              <div>
                <strong>What I build</strong>
                <p className="muted" style={{ margin: "0.3rem 0 0" }}>
                  Web3 wallets on Canton/DAML, high-volume Node.js APIs, and federal-grade C++
                  network intelligence. Switch to the <code>shell</code> to query this résumé like a CLI.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <nav className="section-nav" aria-label="Sections">
        {config.landingSections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={revealedIds.includes(s.id) ? "revealed" : ""}
            onClick={() => scrollTo(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <section
        className="card card--flush-top"
        data-section-id="skills"
        data-reveal
        id="skills"
      >
        {skillsBanner?.url ? (
          <div className="section-banner">
            <img src={publicUrl(skillsBanner.url) ?? skillsBanner.url} alt={skillsBanner.alt ?? "Skills"} loading="lazy" decoding="async" />
            <div className="section-banner__scrim" aria-hidden />
            <h2 className="section-banner__title">Skills</h2>
          </div>
        ) : null}
        <div className="card__padded">
          {!skillsBanner?.url ? <h2 style={{ marginTop: 0 }}>Skills</h2> : null}
          <div className="skills-grid">
            {Object.entries(config.skills).map(([title, items]) => (
              <div key={title} className="skills-group">
                <strong className="skills-group__title">{title.replaceAll("_", " ")}</strong>
                <ul className="chip-row">
                  {items.map((it) => (
                    <li key={it} className="chip">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card" data-section-id="experience" data-reveal id="experience">
        <h2 style={{ marginTop: 0 }}>Experience</h2>
        <ol className="timeline">
          {config.experience.map((job) => {
            const tags = experienceTags(job);
            const stats = job.stats ?? [];
            return (
              <li
                key={`${job.company}-${job.start}`}
                className="experience-card"
                style={
                  job.themeAccent
                    ? ({ ["--exp-accent" as never]: job.themeAccent } as React.CSSProperties)
                    : undefined
                }
              >
                <div className="experience-card__head">
                  {job.logoUrl ? (
                    <img
                      className="experience-card__logo"
                      src={publicUrl(job.logoUrl) ?? job.logoUrl}
                      alt={job.logoAlt ?? `${job.company} logo`}
                      loading="lazy"
                      decoding="async"
                      width={64}
                      height={64}
                    />
                  ) : null}
                  <div className="experience-card__head-text">
                    <div className="experience-card__title-row">
                      <strong className="experience-card__role">{job.role}</strong>
                      <span className="muted">
                        {job.company} · {job.start} – {job.end}
                      </span>
                    </div>
                    <p className="muted" style={{ margin: "0.2rem 0 0" }}>
                      {job.location}
                    </p>
                    {tags.length > 0 ? (
                      <ul className="chip-row chip-row--compact" style={{ marginTop: "0.55rem" }}>
                        {tags.map((t) => (
                          <li key={t} className="chip chip--ghost">
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                {stats.length > 0 ? (
                  <ul className="stat-strip" aria-label={`${job.company} key metrics`}>
                    {stats.map((s) => (
                      <li key={s.label} className="stat-strip__item">
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="experience-card__highlights">
                  {job.highlights.map((h) => (
                    <article key={h.name} className="highlight">
                      <div className="highlight__head">
                        <span className="tag">{h.name}</span>
                        <span className="muted highlight__stack">{h.stack}</span>
                      </div>
                      <ul className="list">
                        {h.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="card" data-section-id="projects" data-reveal id="projects">
        <h2 style={{ marginTop: 0 }}>Projects</h2>
        <div className="grid-2 project-grid">
          {config.projects.map((p) => {
            const tags = projectTags(p);
            return (
              <article key={p.name} className="project-card">
                {p.imageUrl ? (
                  <div className="project-card__media">
                    <img src={publicUrl(p.imageUrl) ?? p.imageUrl} alt={p.imageAlt ?? p.name} loading="lazy" decoding="async" />
                    {tags.length > 0 ? (
                      <ul className="project-card__overlay">
                        {tags.slice(0, 6).map((t) => (
                          <li key={t} className="chip chip--glass">
                            {t}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
                <div className="project-card__body">
                  <header className="project-card__head">
                    <strong>{p.name}</strong>
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      {p.period}
                    </span>
                  </header>
                  <p className="muted project-card__stack">{p.stack}</p>
                  <ul className="list">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" className="project-card__link">
                      Repository / link →
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card" data-section-id="achievements" data-reveal id="achievements">
        <h2 style={{ marginTop: 0 }}>Achievements</h2>
        <ul className="achievement-grid">
          {config.achievements.map((a, i) => (
            <li key={a} className="achievement-card">
              <span className="achievement-card__index" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p>{a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" data-section-id="education" data-reveal id="education">
        <h2 style={{ marginTop: 0 }}>Education</h2>
        {config.education.map((ed) => (
          <div key={ed.school} className={ed.imageUrl ? "education-row" : undefined}>
            {ed.imageUrl ? (
              <div className="education-row__media">
                <img src={publicUrl(ed.imageUrl) ?? ed.imageUrl} alt={ed.imageAlt ?? ed.school} loading="lazy" decoding="async" />
              </div>
            ) : null}
            <div className={ed.imageUrl ? "education-row__text" : undefined}>
              <strong>{ed.degree}</strong>
              <p className="muted" style={{ margin: "0.25rem 0" }}>
                {ed.school} · {ed.end}
              </p>
              <p className="muted" style={{ margin: 0 }}>
                {ed.detail ? `${ed.detail} · ` : null}
                {ed.location}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section
        className="card card--flush-top"
        data-section-id="contact"
        data-reveal
        id="contact"
      >
        {contactBanner?.url ? (
          <div className="section-banner section-banner--short">
            <img src={publicUrl(contactBanner.url) ?? contactBanner.url} alt={contactBanner.alt ?? "Contact"} loading="lazy" decoding="async" />
            <div className="section-banner__scrim" aria-hidden />
            <h2 className="section-banner__title">Contact</h2>
          </div>
        ) : null}
        <div className="card__padded">
          {!contactBanner?.url ? <h2 style={{ marginTop: 0 }}>Contact</h2> : null}
          <p className="muted" style={{ marginTop: 0 }}>
            {[config.meta.email, config.meta.phone].filter(Boolean).join(" · ")}
          </p>
          <div className="hero-actions">
            <a
              className="btn-primary"
              href={`mailto:${config.meta.email}`}
              style={{ textDecoration: "none" }}
            >
              Email
            </a>
            <a
              className="btn-ghost"
              href={config.meta.links.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn-ghost"
              href={config.meta.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
