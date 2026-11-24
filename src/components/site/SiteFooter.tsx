import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useRevealOnce } from "../../hooks/useSiteEffects";
import { useSite } from "./shared";

type Bubble = { id: number; x: number; y: number; size: number; mix: number; delay: number; popped: boolean; gen: number };

// Positions are % of the bubble field; deterministic so the layout is stable between renders.
const SEED: Omit<Bubble, "id" | "popped" | "gen">[] = [
  { x: 4, y: 52, size: 46, mix: 90, delay: 0 },
  { x: 14, y: 18, size: 28, mix: 80, delay: 0.6 },
  { x: 24, y: 58, size: 62, mix: 70, delay: 1.2 },
  { x: 38, y: 10, size: 34, mix: 60, delay: 0.3 },
  { x: 47, y: 46, size: 52, mix: 50, delay: 0.9 },
  { x: 60, y: 22, size: 24, mix: 40, delay: 1.5 },
  { x: 68, y: 54, size: 70, mix: 30, delay: 0.4 },
  { x: 82, y: 14, size: 38, mix: 20, delay: 1.1 },
  { x: 92, y: 56, size: 30, mix: 10, delay: 0.7 },
];

function Bubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>(() => SEED.map((b, i) => ({ ...b, id: i, popped: false, gen: 0 })));
  const field = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const spray = (b: Bubble) => {
    const host = field.current;
    if (!host || prefersReducedMotion()) return;
    const rect = host.getBoundingClientRect();
    const cx = (b.x / 100) * rect.width + b.size / 2;
    const cy = (b.y / 100) * rect.height + b.size / 2;
    for (let i = 0; i < 10; i++) {
      const drop = document.createElement("span");
      const a = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const dist = b.size * (0.6 + Math.random() * 0.6);
      const s = 3 + Math.random() * 4;
      drop.className = "ft-drop";
      drop.style.cssText = `left:${cx}px;top:${cy}px;width:${s}px;height:${s}px;--dx:${(Math.cos(a) * dist).toFixed(1)}px;--dy:${(Math.sin(a) * dist).toFixed(1)}px;--mix:${b.mix}%`;
      host.appendChild(drop);
      timers.current.push(window.setTimeout(() => drop.remove(), 650));
    }
  };

  const pop = (id: number) => {
    const b = bubbles.find((x) => x.id === id);
    if (!b || b.popped) return;
    spray(b);
    setBubbles((list) => list.map((x) => (x.id === id ? { ...x, popped: true } : x)));
    timers.current.push(
      window.setTimeout(() => {
        setBubbles((list) => list.map((x) => (x.id === id ? { ...x, popped: false, gen: x.gen + 1 } : x)));
      }, 1600 + Math.random() * 1200),
    );
  };

  return (
    <div className="ft-bubbles" ref={field}>
      {bubbles.map((b) => (
        <button
          type="button"
          key={`${b.id}-${b.gen}`}
          className={`ft-bubble${b.popped ? " is-popped" : ""}${b.gen ? " is-respawn" : ""}`}
          style={
            {
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              "--mix": `${b.mix}%`,
              animationDelay: `${b.delay}s`,
            } as React.CSSProperties
          }
          onClick={() => pop(b.id)}
          onMouseEnter={(e) => e.buttons === 1 && pop(b.id)}
          aria-label="Pop bubble"
          tabIndex={-1}
        >
          <span className="ft-glass" />
        </button>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const { config } = useSite();
  const ref = useRevealOnce<HTMLDivElement>(0.4);
  const footer = config.footer ?? {};
  const bubbles = config.design?.effects?.footerBubbles !== false;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer ft">
      <div className="ft-glow" aria-hidden="true" />
      <div className={`wrap ft-inner${bubbles ? " has-bubbles" : ""}`}>
        <div className="ft-thanks" ref={ref}>
          <span className="ft-rule ft-rule-l" />
          <p className="ft-thanks-text">{footer.thanks ?? "Have a nice day"}</p>
          <span className="ft-rule ft-rule-r" />
        </div>
        <div className="ft-bar">
          <span>{footer.copyright ?? `© ${year} ${config.profile.name}`}</span>
          <span>{footer.tagline ?? "Built with code. Driven by curiosity."}</span>
        </div>
      </div>
      {bubbles ? (
        <>
          <Bubbles />
          <p className="ft-hint">{footer.bubbleHint ?? "Click to pop the bubbles"}</p>
        </>
      ) : null}
    </footer>
  );
}
