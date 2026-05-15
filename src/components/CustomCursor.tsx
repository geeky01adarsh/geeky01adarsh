import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import type { VisualConfig } from "../types";

const TRAIL_COUNT = 5;

/** Each segment eases toward the position in front of it (lower index = closer to the lead). */
const TRAIL_LERP = [0.16, 0.13, 0.11, 0.09, 0.075] as const;

type Props = {
  visual: VisualConfig | undefined;
};

function prefersCoarsePointer() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(pointer: coarse)").matches;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function cursorDiameterPx(visual: VisualConfig | undefined): number {
  const c = visual?.cursor;
  const n = c?.sizePx ?? c?.ringPx ?? 44;
  return Math.min(96, Math.max(22, n));
}

function trailScale(i: number): number {
  return Math.max(0.22, 0.58 - i * 0.068);
}

/** Nearest trail = strongest; each step drops ~0.12–0.14 so the fade reads clearly. */
function trailOpacity(i: number): number {
  return Math.max(0.14, 0.78 - i * 0.145);
}

/**
 * “Nexus” cursor + fading motion trail: each trail blob eases toward the segment ahead,
 * so the tail lags by a few dozen pixels and fades out.
 */
export function CustomCursor({ visual }: Props) {
  const el = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sizePx = cursorDiameterPx(visual);
  const enabled = visual?.cursor?.enabled !== false && !prefersCoarsePointer() && !prefersReducedMotion();
  const pressing = useRef(false);
  const lastSample = useRef({ x: 0, y: 0, t: 0 });
  const speed = useRef(0);

  useEffect(() => {
    const down = () => {
      pressing.current = true;
    };
    const up = () => {
      pressing.current = false;
    };
    window.addEventListener("pointerdown", down, { capture: true });
    window.addEventListener("pointerup", up, { capture: true });
    window.addEventListener("pointercancel", up, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", down, { capture: true });
      window.removeEventListener("pointerup", up, { capture: true });
      window.removeEventListener("pointercancel", up, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!enabled || !el.current) return;
    const node = el.current;
    const half = sizePx / 2;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    const txArr = Array.from({ length: TRAIL_COUNT }, () => tx);
    const tyArr = Array.from({ length: TRAIL_COUNT }, () => ty);
    let pressEase = 0;
    let energy = 0.62;
    const now0 = performance.now();
    lastSample.current = { x: tx, y: ty, t: now0 };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = performance.now();
      const { x, y, t: t0 } = lastSample.current;
      const dt = Math.max(4, t - t0);
      const inst = (Math.hypot(e.clientX - x, e.clientY - y) / dt) * 18;
      lastSample.current = { x: e.clientX, y: e.clientY, t };
      speed.current = Math.min(4.5, speed.current * 0.88 + inst * 0.22);
    };

    const tick = () => {
      const follow = 0.2;
      cx += (tx - cx) * follow;
      cy += (ty - cy) * follow;

      let targetX = cx;
      let targetY = cy;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const a = TRAIL_LERP[i] ?? 0.07;
        txArr[i] += (targetX - txArr[i]) * a;
        tyArr[i] += (targetY - tyArr[i]) * a;
        targetX = txArr[i];
        targetY = tyArr[i];
        const tnode = trailRefs.current[i];
        if (tnode) {
          const ts = sizePx * trailScale(i);
          const th = ts / 2;
          tnode.style.transform = `translate3d(${txArr[i] - th}px, ${tyArr[i] - th}px, 0)`;
          tnode.style.opacity = String(trailOpacity(i));
        }
      }

      const targetPress = pressing.current ? 1 : 0;
      pressEase += (targetPress - pressEase) * 0.26;
      const scale = 1 - pressEase * 0.18;

      speed.current *= 0.965;
      const targetEnergy = Math.min(1.12, 0.48 + speed.current * 0.18);
      energy += (targetEnergy - energy) * 0.1;

      node.style.setProperty("--cursor-energy", energy.toFixed(3));
      node.style.transform = `translate3d(${cx - half}px, ${cy - half}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, sizePx]);

  if (!enabled) return null;

  return (
    <Fragment>
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(r) => {
            trailRefs.current[i] = r;
          }}
          className="custom-cursor-trail"
          style={
            {
              width: sizePx * trailScale(i),
              height: sizePx * trailScale(i),
              opacity: trailOpacity(i),
              zIndex: 9994 + i,
            } as CSSProperties
          }
          aria-hidden
        />
      ))}
      <div
        ref={el}
        className="custom-cursor"
        style={
          {
            width: sizePx,
            height: sizePx,
            ["--cursor-energy" as string]: 0.62,
          } as CSSProperties
        }
        aria-hidden
      />
    </Fragment>
  );
}

export function shouldShowCustomCursor(visual: VisualConfig | undefined): boolean {
  if (visual?.cursor?.enabled === false) return false;
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}
