import { useEffect, useState } from "react";
import type { AppearanceMode, LandingSection, PortfolioConfig } from "../../types";
import { ThemeToggle } from "../ThemeToggle";

type Props = {
  config: PortfolioConfig;
  mode: "landing" | "shell";
  onModeChange: (mode: "landing" | "shell") => void;
  onOpenPalette: () => void;
  themesEnabled: boolean;
  appearanceChoice: AppearanceMode;
  onAppearanceChange: (mode: AppearanceMode) => void;
  themeLabels: { light: string; dark: string; system: string };
  terminalChrome?: boolean;
};

export function Navbar({
  config,
  mode,
  onModeChange,
  onOpenPalette,
  themesEnabled,
  appearanceChoice,
  onAppearanceChange,
  themeLabels,
  terminalChrome,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const sections = (config.landingSections ?? []).filter((s) => s.id !== "hero");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => (mode === "landing" ? scrollTo("hero") : onModeChange("landing"))}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] font-mono text-xs font-bold text-white">
            AS
          </span>
          <span className="hidden font-semibold tracking-tight sm:block">{config.meta.siteTitle}</span>
        </button>

        {mode === "landing" ? (
          <div className="hidden items-center gap-1 md:flex">
            {sections.map((s: LandingSection) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="font-mono text-sm text-muted">terminal</span>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted transition-colors hover:border-white/20 sm:flex"
            aria-label="Open command palette"
          >
            <span>Search</span>
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>

          {themesEnabled ? (
            <ThemeToggle
              choice={appearanceChoice}
              onChange={onAppearanceChange}
              labels={themeLabels}
              inactive={terminalChrome}
            />
          ) : null}

          <div className="flex rounded-lg border border-white/10 p-0.5" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => onModeChange("landing")}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                mode === "landing" ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              Site
            </button>
            <button
              type="button"
              onClick={() => onModeChange("shell")}
              className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                mode === "shell" ? "bg-white/10 text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              Shell
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-muted hover:bg-white/5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {menuOpen ? (
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              ) : (
                <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && mode === "landing" ? (
        <div className="glass border-t border-white/8 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-white/5 hover:text-foreground"
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenPalette();
              }}
              className="rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-white/5"
            >
              Command Palette (⌘K)
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
