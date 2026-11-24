import { Fragment, createContext, useContext, useMemo, useRef, type ElementType } from "react";
import { prefersReducedMotion } from "../../hooks/useSiteEffects";
import { publicUrl } from "../../lib/publicUrl";
import type { PortfolioConfig, SiteSection } from "../../types";

export type SiteContextValue = {
  config: PortfolioConfig;
  /** Visible sections, in order. */
  sections: SiteSection[];
};

export const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteContext");
  return ctx;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const isExternal = (href: string) => /^(https?:)?\/\//i.test(href);

export function linkProps(href: string) {
  return isExternal(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
}

/** Resolves a /public path or URL; falls back to the GitHub avatar. */
export function resolvePortrait(config: PortfolioConfig, override?: string) {
  const src = override ?? config.profile.portrait;
  if (src) return publicUrl(src);
  if (config.visual?.hero?.useGithubAvatarFallback !== false) {
    const gh = config.meta?.links?.github?.replace(/\/+$/, "");
    if (gh) return `${gh}.png?size=600`;
  }
  return undefined;
}

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

type SectionHeadProps = { section: SiteSection; align?: "left" | "center" };

/** "02 / KICKER" + two-tone title + lead, matching the nav numbering. */
export function SectionHead({ section, align = "left" }: SectionHeadProps) {
  const { sections } = useSite();
  const navSections = sections.filter((s) => s.label && s.type !== "hero");
  const idx = navSections.findIndex((s) => s.id === section.id);
  const title = Array.isArray(section.title) ? section.title : section.title ? [section.title] : [];
  return (
    <div className={`section-head ${align === "center" ? "is-center" : ""}`}>
      <div>
        {section.kicker ? (
          <p className="section-kicker">
            {idx >= 0 ? `${pad2(idx + 1)} / ` : ""}
            {section.kicker}
          </p>
        ) : null}
        {title.length ? (
          <h2 className="section-title">
            {title[0]}
            {title[1] ? (
              <>
                {" "}
                <span>{title[1]}</span>
              </>
            ) : null}
          </h2>
        ) : null}
      </div>
      {section.lead ? <p className="section-lead">{section.lead}</p> : null}
    </div>
  );
}

type WaveTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Lift, in em. */
  amp?: number;
  /** Influence radius, in em. */
  radius?: number;
  enabled?: boolean;
};

/** Each letter lifts and recolors (via the `--w` CSS var) as the pointer passes near it. */
export function WaveText({ text, as: Tag = "span", className = "", amp = 0.12, radius = 0.8, enabled = true }: WaveTextProps) {
  const chars = useRef<(HTMLSpanElement | null)[]>([]);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const words = useMemo(() => {
    let i = 0;
    return text.split(" ").map((w, wi) => ({ key: `${w}-${wi}`, chars: [...w].map((c) => ({ c, i: i++ })) }));
  }, [text]);

  if (!enabled) return <Tag className={className}>{text}</Tag>;

  const tick = () => {
    frame.current = 0;
    const els = chars.current;
    const host = els[0]?.parentElement?.parentElement;
    const fontSize = parseFloat(host ? getComputedStyle(host).fontSize : "16") || 16;
    const lift = amp * fontSize;
    const r = radius * fontSize;
    const { x, y } = pointer.current;
    const rects = els.map((el) => el?.getBoundingClientRect());
    els.forEach((el, i) => {
      const rect = rects[i];
      if (!el || !rect) return;
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      const w = Math.exp(-(dx * dx + dy * dy) / (r * r));
      el.style.transform = `translateY(${(-lift * w).toFixed(2)}px) scale(${(1 + 0.1 * w).toFixed(3)})`;
      el.style.setProperty("--w", w.toFixed(3));
    });
  };

  const onMove = (e: React.PointerEvent) => {
    if (prefersReducedMotion() || e.pointerType === "touch") return;
    pointer.current = { x: e.clientX, y: e.clientY };
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    chars.current.forEach((el) => {
      if (!el) return;
      el.style.transform = "";
      el.style.setProperty("--w", "0");
    });
  };

  return (
    <Tag className={`wave-text ${className}`} aria-label={text} onPointerMove={onMove} onPointerLeave={onLeave}>
      {words.map((w, wi) => (
        <Fragment key={w.key}>
          <span className="wave-word" aria-hidden="true">
            {w.chars.map(({ c, i }) => (
              <span key={i} className="wave-char" ref={(el) => (chars.current[i] = el)}>
                {c}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
