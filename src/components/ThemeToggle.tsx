import type { AppearanceMode } from "../types";

type Props = {
  choice: AppearanceMode;
  onChange: (next: AppearanceMode) => void;
  labels: { light: string; dark: string; system: string };
  inactive?: boolean;
  title?: string;
};

export function ThemeToggle({ choice, onChange, labels, inactive, title }: Props) {
  return (
    <div
      className={`hidden items-center rounded-lg border border-white/10 p-0.5 sm:flex ${inactive ? "opacity-50" : ""}`}
      role="group"
      aria-label="Color theme"
      title={title}
    >
      {(["light", "dark", "system"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          disabled={inactive}
          className={`rounded-md px-2 py-1 text-[10px] transition-colors ${
            choice === mode ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
          }`}
          onClick={() => onChange(mode)}
          title={labels[mode]}
        >
          {labels[mode]}
        </button>
      ))}
    </div>
  );
}
