import { useRevealOnce } from "../../hooks/useSiteEffects";
import type { AboutSection } from "../../types";
import { linkProps, resolvePortrait, useSite, WaveText } from "./shared";

export function About({ section }: { section: AboutSection }) {
  const { config } = useSite();
  const ref = useRevealOnce<HTMLDivElement>(0.2);
  const wave = config.design?.effects?.waveText !== false;
  const title = Array.isArray(section.title) ? section.title.join(" ") : section.title ?? "About Me";
  const portrait = resolvePortrait(config, section.portrait);
  const links = section.links ?? config.profile.links?.slice(0, 2) ?? [];
  const [left, right] = links;

  return (
    <section className="about-section" id={section.id}>
      <div className="wrap">
        <div className="about-card" ref={ref}>
          <WaveText as="h2" className="about-title" text={title} amp={0.11} radius={0.75} enabled={wave} />
          {portrait ? (
            <div className={`about-portrait is-${config.profile.portraitStyle ?? "circle"}`}>
              <img src={portrait} alt={`${config.profile.name} portrait`} draggable={false} loading="lazy" />
            </div>
          ) : null}
          <WaveText as="p" className="about-script" text={config.profile.name} amp={0.12} radius={1} enabled={wave} />
          <WaveText as="p" className="about-bio" text={section.bio ?? config.profile.bio} amp={0.35} radius={4.5} enabled={wave} />
          <div className="about-foot">
            {left ? <a {...linkProps(left.href)}>{left.label}</a> : <span />}
            <span className="about-sparks" aria-hidden="true">
              ✦ ✦ ✦
            </span>
            {right ? <a {...linkProps(right.href)}>{right.label}</a> : <span />}
          </div>
        </div>
      </div>
    </section>
  );
}
