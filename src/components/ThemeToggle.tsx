import type { AppearanceMode } from "../types";

type Props = {
  choice: AppearanceMode;
  onChange: (next: AppearanceMode) => void;
  labels: { light: string; dark: string; system: string };
  /** When true (e.g. full-page shell), control is visually disabled — preference still applies on Landing. */
  inactive?: boolean;
  title?: string;
};

export function ThemeToggle({ choice, onChange, labels, inactive, title }: Props) {
  return (
    <div
      className={`toggle theme-toggle${inactive ? " toggle--disabled" : ""}`}
      role="group"
      aria-label="Color theme"
      title={title}
    >
      <button type="button" className={choice === "light" ? "active" : ""} onClick={() => onChange("light")} title={labels.light}>
        {labels.light}
      </button>
      <button type="button" className={choice === "dark" ? "active" : ""} onClick={() => onChange("dark")} title={labels.dark}>
        {labels.dark}
      </button>
      <button type="button" className={choice === "system" ? "active" : ""} onClick={() => onChange("system")} title={labels.system}>
        {labels.system}
      </button>
    </div>
  );
}
