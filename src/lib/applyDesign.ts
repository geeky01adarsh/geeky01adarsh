import type { DesignFonts, DesignPalette, PortfolioConfig } from "../types";

/** Defaults; anything in `design.palettes.<mode>` in portfolio.json overrides these. */
export const DEFAULT_PALETTES: Record<"dark" | "light", Required<DesignPalette>> = {
  dark: {
    bgPrimary: "#0d0d10",
    bgSecondary: "#131317",
    bgCard: "#18181e",
    bgCardHover: "#1f1f27",
    bgNav: "rgba(13, 13, 16, 0.85)",
    borderSubtle: "rgba(255, 255, 255, 0.07)",
    borderCard: "rgba(255, 255, 255, 0.11)",
    borderHover: "rgba(255, 255, 255, 0.22)",
    accent: "#e06835",
    accentHover: "#eb7847",
    accentLight: "rgba(224, 104, 53, 0.12)",
    accentGlow: "rgba(224, 104, 53, 0.28)",
    accentAlt: "#4f7cff",
    textPrimary: "#f6f6f8",
    textSecondary: "#a3a2af",
    textMuted: "#717080",
    live: "#10b981",
    shadowMd: "0 12px 32px rgba(0, 0, 0, 0.45)",
    shadowLg: "0 20px 60px rgba(0, 0, 0, 0.55)",
  },
  light: {
    bgPrimary: "#f5f2ed",
    bgSecondary: "#ece7e0",
    bgCard: "#ffffff",
    bgCardHover: "#faf7f2",
    bgNav: "rgba(245, 242, 237, 0.88)",
    borderSubtle: "rgba(0, 0, 0, 0.06)",
    borderCard: "rgba(0, 0, 0, 0.09)",
    borderHover: "rgba(0, 0, 0, 0.18)",
    accent: "#a4552c",
    accentHover: "#b86235",
    accentLight: "rgba(164, 85, 44, 0.1)",
    accentGlow: "rgba(164, 85, 44, 0.2)",
    accentAlt: "#3a5bd9",
    textPrimary: "#181716",
    textSecondary: "#5e5b56",
    textMuted: "#8c8880",
    live: "#059669",
    shadowMd: "0 12px 28px rgba(0, 0, 0, 0.06)",
    shadowLg: "0 24px 60px rgba(0, 0, 0, 0.08)",
  },
};

const DEFAULT_FONTS: Required<DesignFonts> = {
  sans: "Onest",
  mono: "JetBrains Mono",
  display: "Anton",
  serif: "Fraunces",
};

const kebab = (k: string) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function applyDesignTokens(config: PortfolioConfig, mode: "light" | "dark") {
  const root = document.documentElement;
  const palette = { ...DEFAULT_PALETTES[mode], ...(config.design?.palettes?.[mode] ?? {}) };
  for (const [k, v] of Object.entries(palette)) {
    if (v) root.style.setProperty(`--${kebab(k)}`, v);
  }
  root.dataset.theme = mode;
  return palette;
}

let fontsLoadedFor = "";

/** Injects a Google Fonts stylesheet for the configured families and exposes them as CSS vars. */
export function applyFonts(config: PortfolioConfig) {
  const fonts = { ...DEFAULT_FONTS, ...(config.design?.fonts ?? {}) };
  const root = document.documentElement;
  root.style.setProperty("--font-sans", `"${fonts.sans}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`);
  root.style.setProperty("--font-mono", `"${fonts.mono}", ui-monospace, monospace`);
  root.style.setProperty("--font-display", `"${fonts.display}", Impact, "Arial Narrow Bold", sans-serif`);
  root.style.setProperty("--font-serif", `"${fonts.serif}", Georgia, serif`);

  const families = [
    `${fonts.sans}:wght@300;400;500;600;700;800`,
    `${fonts.mono}:wght@400;500`,
    fonts.display,
    `${fonts.serif}:opsz,wght@9..144,400;9..144,700`,
  ];
  const key = families.join("|");
  if (key === fontsLoadedFor) return;
  fontsLoadedFor = key;

  const href =
    "https://fonts.googleapis.com/css2?" +
    families.map((f) => `family=${f.trim().replace(/\s+/g, "+")}`).join("&") +
    "&display=swap";
  let link = document.getElementById("design-fonts") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = "design-fonts";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = href;
}
