import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useRevealOnce } from "../../hooks/useSiteEffects";
import { publicUrl } from "../../lib/publicUrl";
import type { FeaturedProject, ProjectLink, ProjectMockup, ProjectsSection } from "../../types";
import { pad2, useSite } from "./shared";

/** Normalises old-style project entries (problem / architecture / results) into card fields. */
function cardData(p: FeaturedProject) {
  const links: ProjectLink[] = p.links ?? [
    ...(p.demo ? [{ label: "Live", href: p.demo }] : []),
    ...(p.link ? [{ label: "GitHub", href: p.link }] : []),
  ];
  const highlights =
    p.highlights ??
    p.results.slice(0, 4).map((r, i) => ({ label: `RESULT ${pad2(i + 1)}`, value: r }));
  const tags = p.tags ?? p.stack.split(",").map((t) => t.trim());
  return {
    id: p.id ?? p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: p.category ?? p.period ?? "",
    title: p.name,
    subtitle: p.subtitle ?? p.problem,
    description: p.description ?? p.architecture,
    badge: p.badge,
    video: publicUrl(p.video),
    image: publicUrl(p.imageUrl),
    imageAlt: p.imageAlt ?? p.name,
    mockup: p.mockup,
    highlights,
    tags,
    links,
  };
}

function Mockup({ m }: { m: ProjectMockup }) {
  return (
    <div className="mockup">
      <div className="mockup-head">{m.icon ? <span className="mockup-icon">{m.icon}</span> : <span />}</div>
      <div className="mockup-center">
        {m.type === "tiles" && m.tiles ? (
          <div className="mockup-tiles">
            {m.tiles.map((t) => (
              <div key={t.label}>
                <strong>{t.value}</strong>
                <small>{t.label}</small>
              </div>
            ))}
          </div>
        ) : null}
        {m.type === "quote" && m.quote ? <div className="mockup-quote">{m.quote}</div> : null}
        {m.type === "bars" && m.bars ? (
          <div className="mockup-bars" aria-hidden="true">
            {m.bars.map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        ) : null}
      </div>
      {m.left || m.right ? (
        <div className="mockup-foot">
          <span>{m.left}</span>
          <strong>{m.right}</strong>
        </div>
      ) : null}
    </div>
  );
}

function ProjectMedia({ d }: { d: ReturnType<typeof cardData> }) {
  const video = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="ps-tile ps-media">
      <div className="ps-viewport">
        {d.video ? (
          <video
            ref={video}
            className={`ps-video${ready ? " is-loaded" : ""}`}
            src={d.video}
            loop
            muted
            playsInline
            preload="metadata"
            onCanPlay={() => setReady(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setReady(false)}
            onClick={toggle}
          />
        ) : null}
        {!ready && d.image ? <img className="ps-image" src={d.image} alt={d.imageAlt} loading="lazy" /> : null}
        {!ready && !d.image && d.mockup ? <Mockup m={d.mockup} /> : null}
        {!ready && !d.image && !d.mockup ? <div className="ps-placeholder">{d.title}</div> : null}
      </div>
      {d.badge ? (
        <span className="ps-badge">
          <span className="indicator-pulse" />
          {d.badge}
        </span>
      ) : null}
      {ready ? (
        <div className="ps-controls">
          <button type="button" onClick={toggle} aria-label="Toggle play / pause">
            {playing ? "⏸" : "▶"}
          </button>
          <button type="button" onClick={() => video.current?.requestFullscreen?.()} aria-label="Fullscreen">
            ⤢
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Projects({ section }: { section: ProjectsSection }) {
  const { config } = useSite();
  const titleRef = useRevealOnce<HTMLHeadingElement>(0.3);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const stacking = config.design?.effects?.stackingProjects !== false;
  const projects = config.projects.map(cardData);
  const title = Array.isArray(section.title) ? section.title.join(" ") : section.title ?? "Projects";

  // Cards behind the top card shrink + dim a little as the next ones slide over them.
  useEffect(() => {
    if (!stacking) return;
    const desktop = window.matchMedia("(min-width: 901px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = cards.current.filter(Boolean) as HTMLElement[];
      if (!desktop.matches || prefersReducedMotion()) {
        els.forEach((el) => el.style.setProperty("--p", "0"));
        return;
      }
      const line = window.innerHeight * 0.85;
      const tops = els.map((el) => el.getBoundingClientRect().top);
      const stick = els.map((el) => parseFloat(getComputedStyle(el).top) || 0);
      els.forEach((el, i) => {
        let p = 0;
        for (let j = i + 1; j < els.length; j++) {
          const span = Math.max(1, line - stick[j]!);
          p += Math.min(1, Math.max(0, (line - tops[j]!) / span));
        }
        el.style.setProperty("--p", p.toFixed(3));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stacking, projects.length]);

  return (
    <section className={`ps-section${stacking ? " is-stacking" : ""}`} id={section.id}>
      <div className="wrap">
        <h2 className="ps-title" ref={titleRef}>
          {title}
        </h2>
        {section.lead ? <p className="ps-lead">{section.lead}</p> : null}
        <div className="ps-stack">
          {projects.map((d, i) => (
            <article
              key={d.id}
              className="ps-card"
              ref={(el) => (cards.current[i] = el)}
              style={{ "--i": i } as React.CSSProperties}
            >
              <header className="ps-head">
                <span className="ps-num">{pad2(i + 1)}</span>
                <div className="ps-label">
                  {d.category ? <strong>{d.category}</strong> : null}
                  <span>{d.title}</span>
                </div>
                {d.links.length ? (
                  <div className="ps-pills">
                    {d.links.map((l) => (
                      <a key={l.href + l.label} className="ps-pill" href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </header>
              <div className="ps-body">
                <ProjectMedia d={d} />
                <div className="ps-tile ps-about">
                  <h3>{d.subtitle}</h3>
                  <p>{d.description}</p>
                </div>
                <div className="ps-tile ps-facts">
                  <div className="ps-metrics">
                    {d.highlights.map((h) => (
                      <div key={h.label}>
                        <small>{h.label}</small>
                        <strong>{h.value}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="ps-tags">
                    {d.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
