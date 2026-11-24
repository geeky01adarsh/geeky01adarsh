import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "p";
  className?: string;
};

export function GradientText({ children, as: Tag = "span", className = "" }: Props) {
  return <Tag className={`gradient-text ${className}`}>{children}</Tag>;
}
