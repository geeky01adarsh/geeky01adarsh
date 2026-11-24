import type { PortfolioConfig } from "../../types";
import { GlassCard } from "../ui/GlassCard";
import { Section } from "../ui/Section";

type Props = {
  config: PortfolioConfig;
};

export function Contact({ config }: Props) {
  return (
    <Section
      id="contact"
      eyebrow="Get in Touch"
      title="Let's Build Something"
      description={config.availability ?? config.hero.availability}
    >
      <GlassCard className="mx-auto max-w-2xl text-center">
        <p className="text-lg text-muted">{config.meta.email}</p>
        <p className="mt-2 text-sm text-muted">{config.meta.location}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${config.meta.email}`}
            className="rounded-xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Send Email
          </a>
          <a
            href={config.meta.links.github}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl px-6 py-3 text-sm font-medium transition-colors hover:border-white/20"
          >
            GitHub
          </a>
          <a
            href={config.meta.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-xl px-6 py-3 text-sm font-medium transition-colors hover:border-white/20"
          >
            LinkedIn
          </a>
          {config.resumeUrl ? (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-xl px-6 py-3 text-sm font-medium transition-colors hover:border-white/20"
            >
              Resume
            </a>
          ) : null}
        </div>
      </GlassCard>
    </Section>
  );
}
