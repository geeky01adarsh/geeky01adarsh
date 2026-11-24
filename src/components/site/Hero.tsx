import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../hooks/useSiteEffects";
import type { HeroSection } from "../../types";
import { resolvePortrait, useSite } from "./shared";

const MAX_TILT = 7;
const EASE = 0.12;

/** Portrait that tilts in 3D toward the pointer. */
function TiltPortrait({ src, alt, style, tilt }: { src?: string; alt: string; style: "circle" | "cutout"; tilt: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !tilt || prefersReducedMotion()) return;
    let raf = 0;
    let rx = 0;
    let ry = 0;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const nx = clamp((px - (r.left + r.width / 2)) / (window.innerWidth / 2));
      const ny = clamp((py - (r.top + r.height / 2)) / (window.innerHeight / 2));
      rx += (-ny * MAX_TILT - rx) * EASE;
      ry += (nx * MAX_TILT - ry) * EASE;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [tilt]);

  return (
    <div className="hero-portrait" ref={ref}>
      <div className={`hero-portrait-frame is-${style}`}>
        {src ? <img src={src} alt={alt} fetchPriority="high" draggable={false} /> : <span className="hero-portrait-empty" />}
      </div>
    </div>
  );
}

export function Hero({ section }: { section: HeroSection }) {
  const { config, sections } = useSite();
  const { profile } = config;
  const next = sections[sections.findIndex((s) => s.id === section.id) + 1];
  return (
    <section className="hero-section" id={section.id} aria-label={profile.name}>
      <div className="hero-layout">
        <div className="hero-left-intro">
          <h1 className="hero-greeting-title">{profile.greeting}</h1>
          <p className="hero-role-subtitle">{profile.role}</p>
        </div>
        <TiltPortrait
          src={resolvePortrait(config)}
          alt={profile.portraitAlt ?? profile.name}
          style={profile.portraitStyle ?? "circle"}
          tilt={config.design?.effects?.portraitTilt !== false}
        />
        <div className="hero-right-intro">
          <p className="hero-bio-text">{profile.bio}</p>
        </div>
      </div>
      {next ? (
        <a className="hero-scroll-cue" href={`#${next.id}`} aria-label="Scroll down">
          <span />
        </a>
      ) : null}
    </section>
  );
}
