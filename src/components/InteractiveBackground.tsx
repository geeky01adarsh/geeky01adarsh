import { useEffect, useRef } from "react";
import type { VisualConfig } from "../types";

type Props = {
  visual: VisualConfig | undefined;
};

/**
 * Pointer-reactive gradient layers. Driven by `portfolio.json` → `visual.background`.
 * Respects `prefers-reduced-motion`: becomes a static wash when reduced motion is on.
 */
export function InteractiveBackground({ visual }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const bg = visual?.background;
  const enabled = bg?.enabled !== false && bg?.style !== "none";
  const style = bg?.style ?? "aurora";
  const strength = Math.min(1, Math.max(0, bg?.parallaxStrength ?? 0.55));

  useEffect(() => {
    if (!enabled || !el.current) return;
    const node = el.current;
    let raf = 0;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      node.style.setProperty("--ib-x", "0px");
      node.style.setProperty("--ib-y", "0px");
      return;
    }

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      tx = ((e.clientX / w) * 2 - 1) * 48 * strength;
      ty = ((e.clientY / h) * 2 - 1) * 40 * strength;
    };

    const tick = () => {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      node.style.setProperty("--ib-x", `${mx}px`);
      node.style.setProperty("--ib-y", `${my}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, strength]);

  if (!enabled) return null;

  return (
    <div
      ref={el}
      className={`interactive-bg interactive-bg--${style}`}
      aria-hidden
    />
  );
}
