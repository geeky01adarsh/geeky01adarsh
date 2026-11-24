import { useState } from "react";
import { useRevealOnce } from "../../hooks/useSiteEffects";
import type { SkillWheelCategory, SkillsSection } from "../../types";
import { SectionHead, useSite } from "./shared";

const C = 500;
const R_OUT = 480;
const R_IN = 318;
const GAP_DEG = 0.6;

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const pt = ([x, y]: readonly [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`;

function segmentPath(a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M${pt(polar(R_OUT, a0))}`,
    `A${R_OUT} ${R_OUT} 0 ${large} 1 ${pt(polar(R_OUT, a1))}`,
    `L${pt(polar(R_IN, a1))}`,
    `A${R_IN} ${R_IN} 0 ${large} 0 ${pt(polar(R_IN, a0))}`,
    "Z",
  ].join(" ");
}

function edgePath(a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${pt(polar(R_OUT, a0))} A${R_OUT} ${R_OUT} 0 ${large} 1 ${pt(polar(R_OUT, a1))}`;
}

const titleCase = (s: string) => s.replace(/(^|[\s_-])(\w)/g, (_, p, c) => `${p === "_" || p === "-" ? " " : p}${c.toUpperCase()}`);

export function Skills({ section }: { section: SkillsSection }) {
  const { config } = useSite();
  const wheelRef = useRevealOnce<HTMLDivElement>(0.25);
  const categories: SkillWheelCategory[] =
    section.categories ??
    Object.entries(config.skills).map(([k, items]) => ({ id: k, lines: [titleCase(k)], title: titleCase(k), items }));
  const [active, setActive] = useState(0);
  const n = categories.length;
  if (!n) return null;
  const step = 360 / n;
  const current = categories[Math.min(active, n - 1)]!;
  const angles = (i: number) => [-90 + i * step + GAP_DEG, -90 + (i + 1) * step - GAP_DEG] as const;

  const chips = current.items.map((s, i) => (
    <span key={s} style={{ animationDelay: `${i * 25}ms` }}>
      {s}
    </span>
  ));

  return (
    <section className="section-shell skills-section" id={section.id}>
      <div className="wrap">
        <SectionHead section={section} />
        <div className="sk-wheel" ref={wheelRef}>
          <svg className="sk-svg" viewBox="0 0 1000 1000" role="group" aria-label="Skill categories">
            {categories.map((cat, i) => {
              const [a0, a1] = angles(i);
              return (
                <path
                  key={cat.id}
                  className={`sk-seg${i === active ? " is-active" : ""}`}
                  d={segmentPath(a0, a1)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${cat.title} — ${cat.items.length} skills`}
                  aria-pressed={i === active}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                />
              );
            })}
            <circle className="sk-ring" cx={C} cy={C} r={R_OUT} />
            <circle className="sk-ring" cx={C} cy={C} r={R_IN} />
            <path key={`edge-${active}`} className="sk-edge" d={edgePath(...angles(active))} />
            {categories.map((cat, i) => {
              const [x, y] = polar((R_OUT + R_IN) / 2, -90 + (i + 0.5) * step);
              const lh = 26;
              return (
                <text
                  key={cat.id}
                  className={`sk-label${i === active ? " is-active" : ""}`}
                  x={x}
                  y={y - ((cat.lines.length - 1) * lh) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {cat.lines.map((l, li) => (
                    <tspan key={li} x={x} dy={li === 0 ? 0 : lh}>
                      {l}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>
          <div className="sk-center" aria-live="polite">
            <div className="sk-center-body" key={current.id}>
              <span className="sk-kicker">
                {current.items.length} skills · {String(active + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
              </span>
              <h3 className="sk-title">{current.title}</h3>
              <div className="sk-chips sk-chips-center">{chips}</div>
            </div>
          </div>
        </div>
        <div className="sk-panel" key={`panel-${current.id}`}>
          <div className="sk-chips">{chips}</div>
        </div>
        <p className="sk-hint">{section.hint ?? "Hover or tap a segment to explore"}</p>
      </div>
    </section>
  );
}
