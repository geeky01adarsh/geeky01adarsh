/** Small metric badge — rendered as a chip on the landing page. */
export type Stat = {
  /** Short label, e.g. "wallet users". */
  label: string;
  /** Eye-catching value, e.g. "45K+". */
  value: string;
};

export type Project = {
  name: string;
  period?: string;
  stack: string;
  link?: string;
  /** Optional cover image (URL or `/path` under `public/`). */
  imageUrl?: string;
  imageAlt?: string;
  /** Optional tech tags rendered as chips on the project card. Falls back to `stack`. */
  tags?: string[];
  bullets: string[];
};

export type WorkHighlight = {
  name: string;
  stack: string;
  bullets: string[];
};

export type Experience = {
  role: string;
  company: string;
  /** Optional logo (URL or `/file` in `public/`). */
  logoUrl?: string;
  logoAlt?: string;
  location: string;
  start: string;
  end: string;
  /** Optional brand accent applied to the role card (CSS color string). */
  themeAccent?: string;
  /** Optional top-level tags rendered as chips below the role headline. */
  tags?: string[];
  /** Optional metric chips (e.g. `{ label: "tx / day", value: "300K+" }`). */
  stats?: Stat[];
  highlights: WorkHighlight[];
};

export type Education = {
  school: string;
  degree: string;
  detail?: string;
  end: string;
  location: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type LandingSection = {
  id: string;
  label: string;
};

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  xpBonus: number;
};

export type GamificationConfig = {
  xpPerShellCommand: number;
  xpPerLandingSection: number;
  achievements: AchievementDef[];
};

/** Optional SEO overrides — edit `public/portfolio.json` to tune title, description, and keywords. */
export type SeoConfig = {
  /** Production origin without trailing slash, e.g. https://yoursite.netlify.app — used for canonical & JSON-LD `url`. */
  siteUrl?: string;
  /** Full `<title>`; if omitted, built from `meta.siteTitle` + `titleSuffix` / tagline. */
  pageTitle?: string;
  /** Used in the default title pattern when `pageTitle` is not set. */
  titleSuffix?: string;
  /** Primary meta description (~150–165 chars recommended). */
  description?: string;
  /** Curated keywords and phrases (also merged with skills, employers, and projects at runtime). */
  keywords?: string[];
  /** Open Graph / Twitter image URL. If empty, a GitHub avatar is inferred from `meta.links.github`. */
  ogImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  googlebot?: string;
  themeColor?: string;
  /** e.g. en_IN */
  locale?: string;
  /** Structured data `jobTitle` override (defaults to latest role from `experience`). */
  jsonLdJobTitle?: string;
};

/**
 * UI color tokens (camelCase in JSON). Maps to CSS variables on `:root` — see `applyPortfolioTheme`.
 * Omit keys to use built-in defaults for that variant (`light` / `dark` / `shell`).
 */
export type ThemePalette = {
  bg?: string;
  surface?: string;
  /** Primary text (maps to legacy `--black`). */
  text?: string;
  muted?: string;
  blueCard?: string;
  purple?: string;
  boxShadow?: string;
  orange?: string;
  orangeCard?: string;
  blurTint?: string;
  yellow?: string;
  toggleTrackBg?: string;
  ghostBtnBg?: string;
  ghostBtnHover?: string;
  pillBg?: string;
  terminalBg?: string;
  terminalFg?: string;
  terminalPrompt?: string;
  terminalHint?: string;
  terminalErr?: string;
  metaThemeColor?: string;
  cardBorder?: string;
  codeBg?: string;
};

export type AppearanceMode = "light" | "dark" | "system";

export type ThemesConfig = {
  /** When false, landing stays on built-in light tokens and the appearance toggle is hidden. Shell may still use dark chrome; see `shellPageUsesDarkChrome`. */
  enabled?: boolean;
  /** Initial choice if nothing is stored yet. */
  defaultMode?: AppearanceMode;
  /**
   * When true (default), Shell view applies the `shell` palette to the **entire** page (header, cards, achievements).
   * Set false to keep landing appearance while only the terminal block stays dark.
   */
  shellPageUsesDarkChrome?: boolean;
  /** `localStorage` key for Light / Dark / Auto. */
  appearanceStorageKey?: string;
  labels?: {
    light?: string;
    dark?: string;
    system?: string;
  };
  definitions?: {
    light?: ThemePalette;
    dark?: ThemePalette;
    /** Merged on top of resolved `dark` when Shell + `shellPageUsesDarkChrome`. */
    shell?: ThemePalette;
  };
};

/** Cursor, interactive background, and imagery — all optional; configure in `public/portfolio.json` → `visual`. */
export type VisualConfig = {
  cursor?: {
    /** Default true. Set false to use the system cursor. */
    enabled?: boolean;
    /** Diameter of the custom cursor in CSS px (clamped ~20–96). Default 40. */
    sizePx?: number;
    /** @deprecated Use `sizePx`. If set without `sizePx`, used as diameter. */
    ringPx?: number;
    /** @deprecated Removed from UI; ignored if present. */
    dotPx?: number;
  };
  background?: {
    /** Default true. Set false to disable the animated backdrop. */
    enabled?: boolean;
    /** `aurora` (warm gradients) or `mesh` (cool grid wash). `none` disables. */
    style?: "aurora" | "mesh" | "none";
    /** How far layers track the pointer (0–1). Default ~0.55. */
    parallaxStrength?: number;
  };
  hero?: {
    portraitUrl?: string;
    portraitAlt?: string;
    /** When true (default) and `portraitUrl` is omitted, uses GitHub profile picture from `meta.links.github`. */
    useGithubAvatarFallback?: boolean;
    asideImageUrl?: string;
    asideImageAlt?: string;
  };
  skillsBanner?: {
    url?: string;
    alt?: string;
  };
  contactBanner?: {
    url?: string;
    alt?: string;
  };
};

export type PortfolioConfig = {
  meta: {
    siteTitle: string;
    tagline: string;
    location: string;
    /** Optional phone (omit to keep it private). */
    phone?: string;
    email: string;
    links: { linkedin: string; github: string };
    shellWelcome: string;
  };
  seo?: SeoConfig;
  /** Accent overrides (gradient / blur) — applied on top of the active palette. */
  theme?: {
    accentFrom?: string;
    accentTo?: string;
    blurTint?: string;
  };
  /** Light / dark / shell page theming — configure in `public/portfolio.json`. */
  themes?: ThemesConfig;
  /** Cursor, motion background, and image URLs for a richer landing page. */
  visual?: VisualConfig;
  /** Top-level metric chips shown under the hero (résumé "wow numbers"). */
  heroStats?: Stat[];
  gamification: GamificationConfig;
  skills: Record<string, string[]>;
  experience: Experience[];
  projects: Project[];
  achievements: string[];
  education: Education[];
  landingSections: LandingSection[];
};
