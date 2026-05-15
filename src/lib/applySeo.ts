import type { PortfolioConfig } from "../types";
import { publicUrl } from "./publicUrl";

function setMeta(attr: "name" | "property", key: string, content: string) {
  const selector = attr === "name" ? `meta[name="${CSS.escape(key)}"]` : `meta[property="${CSS.escape(key)}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${CSS.escape(rel)}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function githubAvatarUrl(githubProfileUrl: string): string | null {
  try {
    const u = new URL(githubProfileUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    if (u.hostname !== "github.com" || parts.length < 1) return null;
    return `https://github.com/${parts[0]}.png`;
  } catch {
    return null;
  }
}

function flattenSkills(skills: PortfolioConfig["skills"]): string[] {
  return Object.values(skills)
    .flat()
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildJsonLd(config: PortfolioConfig, siteUrl: string): object {
  const jobTitle = config.seo?.jsonLdJobTitle ?? config.experience[0]?.role ?? "Software Engineer";
  const sameAs = [config.meta.links.linkedin, config.meta.links.github].filter(Boolean);
  const locParts = config.meta.location.split(",").map((s) => s.trim());
  const locality = locParts[0] ?? config.meta.location;
  const region = locParts[1];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.meta.siteTitle,
    jobTitle,
    description: config.seo?.description ?? config.meta.tagline,
    url: siteUrl,
    email: config.meta.email,
    ...(config.meta.phone ? { telephone: config.meta.phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      ...(region ? { addressRegion: region } : {}),
      addressCountry: "IN",
    },
    sameAs,
    knowsAbout: flattenSkills(config.skills).slice(0, 40),
    alumniOf: config.education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.school,
    })),
    worksFor: config.experience.slice(0, 2).map((e) => ({
      "@type": "Organization",
      name: e.company,
    })),
  };
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Syncs document title, meta tags, canonical, Open Graph / Twitter, and JSON-LD from `portfolio.json`.
 * Call after config loads so search and social previews match your résumé keywords.
 */
export function applySeo(config: PortfolioConfig) {
  const seo = config.seo;
  const origin =
    typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null"
      ? window.location.origin
      : "";
  const configuredSite = seo?.siteUrl?.trim().replace(/\/+$/, "") ?? "";
  const siteUrl = (configuredSite || origin || "https://localhost").replace(/\/+$/, "");
  const path = typeof window !== "undefined" ? window.location.pathname || "/" : "/";
  const canonical = `${siteUrl}${path === "/" ? "/" : path}`;

  const titleSuffix = seo?.titleSuffix ?? config.meta.tagline;
  const pageTitle = seo?.pageTitle ?? `${config.meta.siteTitle} | ${titleSuffix}`;
  document.title = pageTitle;

  const description =
    seo?.description ??
    `${config.meta.siteTitle} — ${config.meta.tagline}. Based in ${config.meta.location}. Web3, backend, systems, and networking.`;

  const keywords = mergeKeywords(config, seo?.keywords);

  setMeta("name", "description", description);
  setMeta("name", "keywords", keywords);
  setMeta("name", "author", config.meta.siteTitle);
  setMeta("name", "robots", seo?.robots ?? "index,follow");
  setMeta("name", "googlebot", seo?.googlebot ?? "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1");
  /* theme-color is set by `applyPortfolioTheme` from `themes` / palette so it tracks light, dark, and shell. */

  setLink("canonical", canonical);

  const ogImageRaw = seo?.ogImage?.trim() || githubAvatarUrl(config.meta.links.github) || "";
  const ogImageResolved = publicUrl(ogImageRaw) ?? ogImageRaw;
  const ogHostBase = `${(configuredSite || origin || "https://localhost").replace(/\/+$/, "")}/`;
  const ogImageAbsolute =
    !ogImageResolved
      ? ""
      : /^https?:\/\//i.test(ogImageResolved)
        ? ogImageResolved
        : new URL(ogImageResolved.replace(/^\//, ""), ogHostBase).href;

  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", config.meta.siteTitle);
  setMeta("property", "og:title", pageTitle);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:locale", seo?.locale ?? "en_IN");
  if (ogImageAbsolute) setMeta("property", "og:image", ogImageAbsolute);

  setMeta("name", "twitter:card", ogImageAbsolute ? "summary_large_image" : "summary");
  if (seo?.twitterSite) setMeta("name", "twitter:site", seo.twitterSite);
  if (seo?.twitterCreator) setMeta("name", "twitter:creator", seo.twitterCreator);
  setMeta("name", "twitter:title", pageTitle);
  setMeta("name", "twitter:description", description);
  if (ogImageAbsolute) setMeta("name", "twitter:image", ogImageAbsolute);

  upsertJsonLd("portfolio-jsonld-person", buildJsonLd(config, siteUrl));
}

/** Curated phrases from config plus deduped skills, employers, and project names. */
function mergeKeywords(config: PortfolioConfig, manual: string[] | undefined): string {
  const autoParts = defaultKeywords(config)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const manualParts = (manual ?? []).map((s) => s.trim()).filter(Boolean);
  return [...new Set([...manualParts, ...autoParts])].join(", ");
}

function defaultKeywords(config: PortfolioConfig): string {
  const skillTerms = flattenSkills(config.skills);
  const companies = config.experience.map((e) => e.company);
  const projectNames = config.projects.map((p) => p.name);
  const base = [
    config.meta.siteTitle,
    "geeky01adarsh",
    "software engineer",
    "full stack developer",
    "backend engineer",
    "Web3 engineer",
    "blockchain developer",
    "Canton Network",
    "DAML",
    "Solidity",
    "Node.js",
    "TypeScript",
    "C++",
    "network security",
    "DPI",
    "TLS",
    "Indore",
    "India",
    "portfolio",
  ];
  return [...new Set([...base, ...skillTerms, ...companies, ...projectNames])].join(", ");
}
