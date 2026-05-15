import type { PortfolioConfig, ThemePalette } from "../types";

/** Fully resolved token set → CSS custom properties. */
export type ResolvedThemeTokens = Required<{
  [K in keyof ThemePalette]: string;
}>;

const KEYS = [
  "bg",
  "surface",
  "text",
  "muted",
  "blueCard",
  "purple",
  "boxShadow",
  "orange",
  "orangeCard",
  "blurTint",
  "yellow",
  "toggleTrackBg",
  "ghostBtnBg",
  "ghostBtnHover",
  "pillBg",
  "terminalBg",
  "terminalFg",
  "terminalPrompt",
  "terminalHint",
  "terminalErr",
  "metaThemeColor",
  "cardBorder",
  "codeBg",
] as const satisfies readonly (keyof ThemePalette)[];

const CSS_VAR: Record<(typeof KEYS)[number], string> = {
  bg: "--bg",
  surface: "--surface",
  text: "--black",
  muted: "--gray",
  blueCard: "--blue-card",
  purple: "--purple",
  boxShadow: "--box-shadow",
  orange: "--orange",
  orangeCard: "--orange-card",
  blurTint: "--blur-tint",
  yellow: "--yellow",
  toggleTrackBg: "--toggle-track-bg",
  ghostBtnBg: "--ghost-btn-bg",
  ghostBtnHover: "--ghost-btn-hover",
  pillBg: "--pill-bg",
  terminalBg: "--terminal-bg",
  terminalFg: "--terminal-fg",
  terminalPrompt: "--terminal-prompt",
  terminalHint: "--terminal-hint",
  terminalErr: "--terminal-err",
  metaThemeColor: "--meta-theme-color",
  cardBorder: "--card-border",
  codeBg: "--code-bg",
};

export const BUILTIN_LIGHT: ResolvedThemeTokens = {
  bg: "#fafbff",
  surface: "#ffffff",
  text: "#242d49",
  muted: "#788097",
  blueCard: "#ddf8fe",
  purple: "rgb(238 210 255)",
  boxShadow: "0px 19px 60px rgb(0 0 0 / 8%)",
  orange: "#fca61f",
  orangeCard: "rgba(252, 166, 31, 0.45)",
  blurTint: "#edd0ff",
  yellow: "#f5c32c",
  toggleTrackBg: "#ddf8fe",
  ghostBtnBg: "#ffffff",
  ghostBtnHover: "#fff7ec",
  pillBg: "#ffffff",
  terminalBg: "#0f1224",
  terminalFg: "#e8ecff",
  terminalPrompt: "#8ef9ff",
  terminalHint: "#94a3b8",
  terminalErr: "#fda4af",
  metaThemeColor: "#242d49",
  cardBorder: "transparent",
  codeBg: "rgb(0 0 0 / 6%)",
};

export const BUILTIN_DARK: ResolvedThemeTokens = {
  bg: "#0b0d18",
  surface: "#13162a",
  text: "#eef1ff",
  muted: "#9aa4bf",
  blueCard: "#1a1f38",
  purple: "rgba(168, 85, 247, 0.28)",
  boxShadow: "0 22px 55px rgb(0 0 0 / 55%)",
  orange: "#fca61f",
  orangeCard: "rgba(252, 166, 31, 0.35)",
  blurTint: "#2d1f4d",
  yellow: "#f5c32c",
  toggleTrackBg: "#1a1f38",
  ghostBtnBg: "#1b2039",
  ghostBtnHover: "#242a4a",
  pillBg: "#171b33",
  terminalBg: "#0a0c16",
  terminalFg: "#e8ecff",
  terminalPrompt: "#8ef9ff",
  terminalHint: "#94a3b8",
  terminalErr: "#fda4af",
  metaThemeColor: "#0b0d18",
  cardBorder: "rgba(255, 255, 255, 0.06)",
  codeBg: "rgb(255 255 255 / 8%)",
};

/** Full-page shell: align surfaces with the terminal chrome. */
export const BUILTIN_SHELL: ResolvedThemeTokens = {
  ...BUILTIN_DARK,
  bg: "#060814",
  surface: "#0f1224",
  blueCard: "#151a32",
  pillBg: "#12172c",
  toggleTrackBg: "#151a32",
  ghostBtnBg: "#12172c",
  ghostBtnHover: "#1a2140",
  terminalBg: "#080b14",
  metaThemeColor: "#060814",
  cardBorder: "rgba(255, 255, 255, 0.07)",
};

function mergeResolved(base: ResolvedThemeTokens, patch?: ThemePalette): ResolvedThemeTokens {
  if (!patch) return base;
  const out = { ...base };
  for (const k of KEYS) {
    const v = patch[k];
    if (v !== undefined && v !== "") out[k] = v;
  }
  return out;
}

export type SurfaceMode = "light" | "dark" | "shell";

export function resolvePalette(config: PortfolioConfig, surfaceMode: SurfaceMode): ResolvedThemeTokens {
  const defs = config.themes?.definitions;
  if (surfaceMode === "light") {
    return mergeResolved(BUILTIN_LIGHT, defs?.light);
  }
  if (surfaceMode === "dark") {
    return mergeResolved(BUILTIN_DARK, defs?.dark);
  }
  const dark = mergeResolved(BUILTIN_DARK, defs?.dark);
  const shellBase = mergeResolved(dark, BUILTIN_SHELL);
  return mergeResolved(shellBase, defs?.shell);
}

export function applyPortfolioTheme(config: PortfolioConfig, surfaceMode: SurfaceMode) {
  const palette = resolvePalette(config, surfaceMode);
  const root = document.documentElement;
  root.dataset.surface = surfaceMode;
  root.dataset.shellPage = surfaceMode === "shell" ? "true" : "false";

  for (const k of KEYS) {
    root.style.setProperty(CSS_VAR[k], palette[k]);
  }

  root.style.setProperty("--accent-from", config.theme?.accentFrom ?? "#fdc50f");
  root.style.setProperty("--accent-to", config.theme?.accentTo ?? "#fb982f");
  if (config.theme?.blurTint) root.style.setProperty("--blur-tint", config.theme.blurTint);

  const metaColor = config.seo?.themeColor ?? palette.metaThemeColor;
  let meta = document.head.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", metaColor);
}
