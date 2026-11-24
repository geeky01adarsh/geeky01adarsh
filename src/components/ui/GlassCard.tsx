import type { ReactNode, CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
};

export function GlassCard({ children, className = "", style, hover = true }: Props) {
  return (
    <div
      className={`glass rounded-2xl p-6 transition-all duration-300 ${
        hover ? "hover:border-white/15 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]" : ""
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
