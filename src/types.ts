/** Small metric badge — rendered as a chip on the landing page. */
export type Stat = {
  label: string;
  value: string;
};

export type Metric = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

export type HeroCta = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "ghost";
  external?: boolean;
};

export type HeroConfig = {
  headline: string;
  subheading: string;
  availability?: string;
  ctas: HeroCta[];
  badges?: string[];
};

export type ExpertiseCard = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  accent?: string;
};

export type ArchitectureNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  type?: "source" | "process" | "store" | "sink";
};

export type ArchitectureEdge = {
  from: string;
  to: string;
  label?: string;
};

export type ArchitectureDiagram = {
  id: string;
  title: string;
  description: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};

export type TechSkill = {
  name: string;
  proficiency: number;
};

export type TechStackCategory = {
  id: string;
  label: string;
  skills: TechSkill[];
};

export type WritingArticle = {
  title: string;
  url: string;
  platform?: string;
  date?: string;
  views?: string;
  excerpt?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company?: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

/** Label / value pair shown in the project "facts" tile, e.g. ["USERS", "45K+"]. */
export type ProjectHighlight = {
  label: string;
  value: string;
};

/** Shown in the media tile when a project has no image/video. */
export type ProjectMockup = {
  type: "tiles" | "quote" | "bars";
  icon?: string;
  tiles?: { value: string; label: string }[];
  quote?: string;
  bars?: number[];
  left?: string;
  right?: string;
};

export type FeaturedProject = {
  id?: string;
  name: string;
  /** Small kicker above the title, e.g. "Web3 / Wallet". */
  category?: string;
  /** Mono badge on the media tile, e.g. "PRODUCTION · 45K+ USERS". */
  badge?: string;
  /** Short headline for the about tile. Falls back to `problem`. */
  subtitle?: string;
  /** Body copy for the about tile. Falls back to `architecture`. */
  description?: string;
  video?: string;
  mockup?: ProjectMockup;
  highlights?: ProjectHighlight[];
  links?: ProjectLink[];
  period?: string;
  stack: string;
  link?: string;
  demo?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
  problem: string;
  architecture: string;
  results: string[];
  featured?: boolean;
};

export type Project = FeaturedProject & {
  bullets?: string[];
};

export type WorkHighlight = {
  name: string;
  stack: string;
  bullets: string[];
};

export type Experience = {
  role: string;
  company: string;
  logoUrl?: string;
  logoAlt?: string;
  location: string;
  start: string;
  end: string;
  themeAccent?: string;
  tags?: string[];
  stats?: Stat[];
  highlights: WorkHighlight[];
};

export type Education = {
  school: string;
  /** Big number on the card, e.g. "8.58". */
  score?: string;
  scoreLabel?: string;
  start?: string;
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

export type SeoConfig = {
  siteUrl?: string;
  pageTitle?: string;
  titleSuffix?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  googlebot?: string;
  themeColor?: string;
  locale?: string;
  jsonLdJobTitle?: string;
};

export type ThemePalette = {
  bg?: string;
  surface?: string;
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
  enabled?: boolean;
  defaultMode?: AppearanceMode;
  shellPageUsesDarkChrome?: boolean;
  appearanceStorageKey?: string;
  labels?: {
    light?: string;
    dark?: string;
    system?: string;
  };
  definitions?: {
    light?: ThemePalette;
    dark?: ThemePalette;
    shell?: ThemePalette;
  };
};

export type VisualConfig = {
  background?: {
    enabled?: boolean;
    style?: "network" | "none";
  };
  hero?: {
    portraitUrl?: string;
    portraitAlt?: string;
    useGithubAvatarFallback?: boolean;
  };
};

/* ───────────────────────── Design system (v3) ───────────────────────── */

/** Every key maps 1:1 to a CSS variable: `bgPrimary` → `--bg-primary`. */
export type DesignPalette = Partial<{
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgCardHover: string;
  bgNav: string;
  borderSubtle: string;
  borderCard: string;
  borderHover: string;
  accent: string;
  accentHover: string;
  accentLight: string;
  accentGlow: string;
  accentAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  live: string;
  shadowMd: string;
  shadowLg: string;
}>;

export type DesignFonts = {
  /** Google Fonts family names. Loaded automatically. */
  sans?: string;
  mono?: string;
  /** Giant condensed headline (About title). */
  display?: string;
  /** Script/serif accent (name under the About portrait). */
  serif?: string;
};

export type DesignEffects = {
  /** Background behind the page. */
  background?: "grid" | "network" | "none";
  /** Mouse-follow 3D tilt on the hero portrait. */
  portraitTilt?: boolean;
  /** Letters lift and recolor near the pointer. */
  waveText?: boolean;
  /** Project cards stick and stack while scrolling (desktop). */
  stackingProjects?: boolean;
  /** Poppable glass bubbles in the footer. */
  footerBubbles?: boolean;
  /** Thin progress bar at the top of the page. */
  scrollProgress?: boolean;
};

export type DesignConfig = {
  fonts?: DesignFonts;
  palettes?: { dark?: DesignPalette; light?: DesignPalette };
  effects?: DesignEffects;
};

export type ProfileLink = {
  label: string;
  href: string;
};

export type ProfileConfig = {
  name: string;
  /** Short text in the nav avatar circle. Defaults to initials of `name`. */
  initials?: string;
  /** Green-dot status in the nav, e.g. "Available for roles". Empty string hides it. */
  status?: string;
  greeting: string;
  role: string;
  bio: string;
  /** Path in /public or full URL. Falls back to the GitHub avatar. */
  portrait?: string;
  portraitAlt?: string;
  /** "circle" frames a normal photo; "cutout" suits a transparent PNG of you. */
  portraitStyle?: "circle" | "cutout";
  links?: ProfileLink[];
};

type SectionBase = {
  /** DOM id and nav anchor. */
  id: string;
  /** Set false to hide without deleting. */
  enabled?: boolean;
  /** Nav label. Omit to keep the section out of the nav. */
  label?: string;
  /** Small mono label above the title: "02 / <kicker>". */
  kicker?: string;
  /** One string, or [bold, muted] for the two-tone heading. */
  title?: string | string[];
  lead?: string;
};

export type HeroSection = SectionBase & { type: "hero" };
export type AboutSection = SectionBase & {
  type: "about";
  /** Bio override; defaults to profile.bio. */
  bio?: string;
  portrait?: string;
  /** Links at the bottom corners of the card. */
  links?: ProfileLink[];
};
export type MetricsSection = SectionBase & { type: "metrics" };
export type ProjectsSection = SectionBase & { type: "projects" };
export type ExperienceSection = SectionBase & { type: "experience" };
export type SkillWheelCategory = {
  id: string;
  /** Text on the wheel segment; each entry is a line. */
  lines: string[];
  title: string;
  items: string[];
};
export type SkillsSection = SectionBase & {
  type: "skills";
  categories?: SkillWheelCategory[];
  hint?: string;
};
export type WritingSection = SectionBase & { type: "writing"; moreHref?: string; moreLabel?: string };
export type EducationSection = SectionBase & { type: "education" };
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  type?: string;
  date?: string;
  facts?: string[];
  image?: string;
  file?: string;
  verify?: string;
};
export type CertificationsSection = SectionBase & {
  type: "certifications";
  items?: Certificate[];
  emptyText?: string;
};
export type AchievementsSection = SectionBase & { type: "achievements" };
export type ContactSection = SectionBase & {
  type: "contact";
  primary?: ProfileLink;
  links?: ProfileLink[];
};

export type SiteSection =
  | HeroSection
  | AboutSection
  | MetricsSection
  | ProjectsSection
  | ExperienceSection
  | SkillsSection
  | WritingSection
  | EducationSection
  | CertificationsSection
  | AchievementsSection
  | ContactSection;

export type NavConfig = {
  showShellToggle?: boolean;
  showSearch?: boolean;
};

export type FooterConfig = {
  thanks?: string;
  tagline?: string;
  bubbleHint?: string;
  copyright?: string;
};

export type PortfolioConfig = {
  design?: DesignConfig;
  profile: ProfileConfig;
  sections: SiteSection[];
  nav?: NavConfig;
  footer?: FooterConfig;
  meta: {
    siteTitle: string;
    tagline: string;
    location: string;
    phone?: string;
    email: string;
    links: { linkedin: string; github: string };
    shellWelcome: string;
  };
  seo?: SeoConfig;
  theme?: {
    accentFrom?: string;
    accentTo?: string;
    blurTint?: string;
  };
  themes?: ThemesConfig;
  visual?: VisualConfig;
  hero: HeroConfig;
  metrics: Metric[];
  expertise: ExpertiseCard[];
  architectureDiagrams: ArchitectureDiagram[];
  techStack: TechStackCategory[];
  writing: WritingArticle[];
  writingStats?: { articles: number; views: string };
  testimonials?: Testimonial[];
  availability?: string;
  resumeUrl?: string;
  skills: Record<string, string[]>;
  experience: Experience[];
  projects: FeaturedProject[];
  achievements: string[];
  education: Education[];
  landingSections?: LandingSection[];
};
