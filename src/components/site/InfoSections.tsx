import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../hooks/useSiteEffects";
import { publicUrl } from "../../lib/publicUrl";
import type {
  AchievementsSection,
  Certificate,
  CertificationsSection,
  ContactSection,
  EducationSection,
  Metric,
  MetricsSection,
  WritingSection,
} from "../../types";
import { formatMonth } from "./Experience";
import { linkProps, pad2, SectionHead, useSite } from "./shared";

/* ───────────── Metrics ───────────── */

function Counter({ m }: { m: Metric }) {
  const ref = useRef<HTMLElement | null>(null);
  const [val, setVal] = useState(prefersReducedMotion() ? m.value : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setVal(m.value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          setVal(m.value * (1 - Math.pow(1 - k, 3)));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [m.value]);
  return (
    <strong ref={ref}>
      {m.prefix}
      {val.toFixed(m.decimals ?? 0)}
      <em>{m.suffix}</em>
    </strong>
  );
}

/** 4 → 4 cols, 6 → 3×2, 8 → 4×2 … so rows stay full. */
const metricColumns = (n: number) => (n <= 4 ? n : n % 3 === 0 ? 3 : 4);

export function Metrics({ section }: { section: MetricsSection }) {
  const { config } = useSite();
  return (
    <section className="section-shell metrics-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <div className="metric-grid" style={{ "--cols": metricColumns(config.metrics.length) } as React.CSSProperties}>
          {config.metrics.map((m) => (
            <div key={m.id} className="metric-tile">
              <Counter m={m} />
              <small>{m.label}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Writing ───────────── */

export function Writing({ section }: { section: WritingSection }) {
  const { config } = useSite();
  return (
    <section className="section-shell writing-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <div className="card-grid">
          {config.writing.map((a) => (
            <a key={a.title} className="info-card writing-card" {...linkProps(a.url)}>
              <div className="info-meta-row">
                <span className="info-accent">{a.platform ?? "Article"}</span>
                <span>{a.views ? `${a.views} views` : a.date}</span>
              </div>
              <h3 className="info-title">{a.title}</h3>
              {a.excerpt ? <p className="info-text">{a.excerpt}</p> : null}
              <span className="info-cta">
                Read <span aria-hidden="true">↗</span>
              </span>
            </a>
          ))}
        </div>
        {section.moreHref ? (
          <div className="section-more">
            <a className="btn-secondary" {...linkProps(section.moreHref)}>
              {section.moreLabel ?? "More writing"} <span aria-hidden="true">↗</span>
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ───────────── Education ───────────── */

export function Education({ section }: { section: EducationSection }) {
  const { config } = useSite();
  return (
    <section className="section-shell edu-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <div className="edu-grid">
          {config.education.map((e, i) => (
            <article key={e.school + e.degree} className={`info-card edu-card${i === 0 ? " is-featured" : ""}`}>
              <div className="info-meta-row">
                <span className="info-accent">
                  {e.start ? `${formatMonth(e.start)} — ` : ""}
                  {formatMonth(e.end)}
                </span>
                <span>{e.location}</span>
              </div>
              <h3 className="info-title">{e.degree}</h3>
              <p className="info-text">{e.school}</p>
              {e.score || e.detail ? (
                <div className="edu-score">
                  <strong>{e.score ?? e.detail}</strong>
                  {e.scoreLabel ? <span>{e.scoreLabel}</span> : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Achievements ───────────── */

export function Achievements({ section }: { section: AchievementsSection }) {
  const { config } = useSite();
  return (
    <section className="section-shell achievements-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <ol className="ach-list">
          {config.achievements.map((a, i) => (
            <li key={a}>
              <span className="ach-num">{pad2(i + 1)}</span>
              <p>{a}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Certifications ───────────── */

function CertViewer({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="cert-viewer" role="dialog" aria-modal="true" aria-label={cert.title} onClick={onClose}>
      <div className="cert-viewer-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="cert-viewer-close" onClick={onClose} aria-label="Close certificate" autoFocus>
          ✕
        </button>
        {cert.image ? <img src={publicUrl(cert.image)} alt={`${cert.title} — ${cert.issuer} certificate`} /> : null}
        <div className="cert-viewer-bar">
          <div>
            <strong>{cert.title}</strong>
            <span>
              {cert.issuer}
              {cert.date ? ` · ${cert.date}` : ""}
            </span>
          </div>
          <div className="cert-viewer-links">
            {cert.verify ? <a {...linkProps(cert.verify)}>Verify ↗</a> : null}
            {cert.file ? <a {...linkProps(publicUrl(cert.file)!)}>Open original ↗</a> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Certifications({ section }: { section: CertificationsSection }) {
  const [open, setOpen] = useState<Certificate | null>(null);
  const items = section.items ?? [];
  return (
    <section className="section-shell certifications-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        {items.length ? (
          <div className="card-grid">
            {items.map((c) => (
              <article key={c.id} className="info-card cert-card">
                {c.image ? (
                  <button type="button" className="cert-thumb" onClick={() => setOpen(c)} aria-label={`View ${c.title} certificate`}>
                    <img src={publicUrl(c.image)} alt="" loading="lazy" />
                    <span className="cert-thumb-hint">View certificate</span>
                  </button>
                ) : null}
                <div className="cert-body">
                  <div className="info-meta-row">
                    <span className="info-accent">{c.issuer}</span>
                    <span>{c.date}</span>
                  </div>
                  <h3 className="info-title">{c.title}</h3>
                  {c.type ? <p className="info-text">{c.type}</p> : null}
                  {c.facts?.length ? (
                    <div className="chip-row">
                      {c.facts.map((f) => (
                        <span key={f} className="chip">
                          {f}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="pill-row">
                    {c.image ? (
                      <button type="button" className="pill-btn" onClick={() => setOpen(c)}>
                        View
                      </button>
                    ) : null}
                    {c.verify ? (
                      <a className="pill-btn" {...linkProps(c.verify)}>
                        Verify ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="cert-empty">{section.emptyText ?? "Certifications are being added — check back soon."}</p>
        )}
      </div>
      {open ? <CertViewer cert={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}

/* ───────────── Contact ───────────── */

export function Contact({ section }: { section: ContactSection }) {
  const { config } = useSite();
  const primary = section.primary ?? { label: config.meta.email, href: `mailto:${config.meta.email}` };
  const links = section.links ?? config.profile.links ?? [];
  return (
    <section className="section-shell contact-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <div className="contact-actions">
          <a className="btn-primary" {...linkProps(primary.href)}>
            {primary.label} <span aria-hidden="true">↗</span>
          </a>
          {links.map((l) => (
            <a key={l.href} className="btn-secondary" {...linkProps(l.href)}>
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          {config.resumeUrl ? (
            <a className="btn-secondary" {...linkProps(publicUrl(config.resumeUrl)!)}>
              Résumé <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
