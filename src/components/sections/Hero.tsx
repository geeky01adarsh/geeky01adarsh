import type { PortfolioConfig } from "../../types";
import { publicUrl } from "../../lib/publicUrl";
import { Badge } from "../ui/Badge";
import { GradientText } from "../ui/GradientText";
import { HeroTerminal } from "../ui/HeroTerminal";
import { NetworkGraphCanvas } from "../ui/NetworkGraphCanvas";
import { useSectionReveal } from "../../hooks/useSectionReveal";

type Props = {
  config: PortfolioConfig;
};

function githubProfilePng(githubProfileUrl: string): string | null {
  try {
    const u = new URL(githubProfileUrl);
    const user = u.pathname.split("/").filter(Boolean)[0];
    if (!user || !u.hostname.replace("www.", "").endsWith("github.com")) return null;
    return `https://github.com/${user}.png?size=480`;
  } catch {
    return null;
  }
}

export function Hero({ config }: Props) {
  const ref = useSectionReveal<HTMLElement>();
  const hero = config.hero;
  const visual = config.visual;

  const portrait =
    visual?.hero?.portraitUrl?.trim() ||
    (visual?.hero?.useGithubAvatarFallback !== false ? githubProfilePng(config.meta.links.github) : null);

  function scrollTo(href: string) {
    if (href.startsWith("#")) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="reveal-section relative mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6 lg:px-8"
    >
      <NetworkGraphCanvas enabled={visual?.background?.enabled !== false} />

      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {portrait ? (
              <img
                src={publicUrl(portrait) ?? portrait}
                alt={visual?.hero?.portraitAlt ?? config.meta.siteTitle}
                className="h-12 w-12 rounded-full border border-white/10 object-cover"
                width={48}
                height={48}
                loading="eager"
                decoding="async"
              />
            ) : null}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{config.meta.tagline}</p>
              <p className="text-sm text-muted">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                {config.meta.location}
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            <GradientText as="span" className="block">
              {hero.headline.split(",").map((part, i) => (
                <span key={i}>
                  {i > 0 ? "," : ""}
                  {part}
                  {i < hero.headline.split(",").length - 1 ? <br /> : null}
                </span>
              ))}
            </GradientText>
          </h1>

          <p className="max-w-xl text-lg text-muted">{hero.subheading}</p>

          <div className="flex flex-wrap gap-3">
            {hero.ctas.map((cta) => {
              const isHash = cta.href.startsWith("#");
              const isExternal = cta.external || (!isHash && !cta.href.startsWith("/"));

              if (isHash) {
                return (
                  <button
                    key={cta.label}
                    type="button"
                    onClick={() => scrollTo(cta.href)}
                    className={
                      cta.variant === "primary"
                        ? "rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                        : cta.variant === "secondary"
                          ? "glass rounded-xl px-6 py-3 text-sm font-medium transition-colors hover:border-white/20"
                          : "rounded-xl px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
                    }
                  >
                    {cta.label}
                  </button>
                );
              }

              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className={
                    cta.variant === "primary"
                      ? "rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      : cta.variant === "secondary"
                        ? "glass rounded-xl px-6 py-3 text-sm font-medium transition-colors hover:border-white/20"
                        : "rounded-xl px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
                  }
                >
                  {cta.label}
                </a>
              );
            })}
          </div>

          {hero.badges?.length ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {hero.badges.map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <HeroTerminal />
          <div className="pointer-events-none absolute -right-4 -top-4 hidden h-24 w-24 rounded-full bg-[var(--accent-from)] opacity-20 blur-3xl lg:block" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 hidden h-32 w-32 rounded-full bg-[var(--accent-to)] opacity-15 blur-3xl lg:block" />
        </div>
      </div>
    </section>
  );
}
