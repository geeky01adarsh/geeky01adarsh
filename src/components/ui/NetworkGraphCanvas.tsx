import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

type Props = {
  enabled?: boolean;
  className?: string;
};

export function NetworkGraphCanvas({ enabled = true, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((w * h) / 18000);
      nodes = Array.from({ length: Math.max(24, Math.min(count, 60)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-from").trim() || "#3b82f6";
      const accent2 = getComputedStyle(document.documentElement).getPropertyValue("--accent-to").trim() || "#8b5cf6";

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!prefersReduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.15;
            ctx!.strokeStyle = `color-mix(in srgb, ${accent} ${alpha * 100}%, transparent)`;
            ctx!.lineWidth = 0.6;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }

        ctx!.fillStyle = i % 3 === 0 ? accent : accent2;
        ctx!.globalAlpha = 0.5;
        ctx!.beginPath();
        ctx!.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      if (!prefersReduced) animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-60 ${className}`}
      aria-hidden
    />
  );
}
