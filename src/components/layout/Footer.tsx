import type { PortfolioConfig } from "../../types";

type Props = {
  config: PortfolioConfig;
};

export function Footer({ config }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          © {year} {config.meta.siteTitle}. Built with precision.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={config.meta.links.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={config.meta.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${config.meta.email}`}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
