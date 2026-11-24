import { useEffect, useMemo, useState } from "react";
import { loadPortfolio } from "./api/loadPortfolio";
import { CommandPalette } from "./components/layout/CommandPalette";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { LandingPage } from "./components/LandingPage";
import { ShellView } from "./components/ShellView";
import { SiteContext, type SiteContextValue } from "./components/site/shared";
import { SiteFooter } from "./components/site/SiteFooter";
import { SiteHeader } from "./components/site/SiteHeader";
import { NetworkGraphCanvas } from "./components/ui/NetworkGraphCanvas";
import { useCommandPalette } from "./hooks/useCommandPalette";
import { usePortfolioThemes } from "./hooks/usePortfolioThemes";
import { applyDesignTokens, applyFonts } from "./lib/applyDesign";
import { applyPortfolioTheme } from "./lib/applyPortfolioTheme";
import { applySeo } from "./lib/applySeo";
import type { PortfolioConfig } from "./types";
import "./styles/global.css";
import "./styles/site.css";

type Mode = "landing" | "shell";

export default function App() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("landing");
  const { open: paletteOpen, close: closePalette, toggle: togglePalette } = useCommandPalette();
  const { themesEnabled, shellDarkChrome, setAppearanceChoice, surfaceMode, landingResolved } = usePortfolioThemes(
    config,
    mode,
  );

  useEffect(() => {
    loadPortfolio()
      .then(setConfig)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load config"));
  }, []);

  useEffect(() => {
    if (!config) return;
    applyPortfolioTheme(config, surfaceMode);
    const palette = applyDesignTokens(config, surfaceMode === "light" ? "light" : "dark");
    if (!config.seo?.themeColor) {
      document.head.querySelector('meta[name="theme-color"]')?.setAttribute("content", palette.bgPrimary);
    }
  }, [config, surfaceMode]);

  useEffect(() => {
    if (!config) return;
    applyFonts(config);
    applySeo(config);
  }, [config]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [mode]);

  const site = useMemo<SiteContextValue | null>(
    () => (config ? { config, sections: (config.sections ?? []).filter((s) => s.enabled !== false) } : null),
    [config],
  );

  if (error) {
    return (
      <div className="app-status">
        <p>{error}</p>
      </div>
    );
  }

  if (!config || !site) {
    return (
      <div className="app-status">
        <span className="app-spinner" aria-hidden="true" />
        <p>Loading…</p>
      </div>
    );
  }

  const effects = config.design?.effects ?? {};
  const background = effects.background ?? "grid";
  const terminalChrome = mode === "shell" && shellDarkChrome;

  return (
    <SiteContext.Provider value={site}>
      <div className={`site-root${terminalChrome ? " is-shell" : ""}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {mode === "landing" && background === "grid" ? <div className="bg-grid-lines" aria-hidden="true" /> : null}
        {mode === "landing" && background === "network" ? (
          <div className="bg-network" aria-hidden="true">
            <NetworkGraphCanvas enabled />
          </div>
        ) : null}

        {mode === "landing" && effects.scrollProgress !== false ? <ScrollProgress /> : null}

        <SiteHeader
          mode={mode}
          onModeChange={setMode}
          onOpenPalette={togglePalette}
          themesEnabled={themesEnabled}
          isLight={landingResolved === "light"}
          onToggleTheme={() => setAppearanceChoice(landingResolved === "light" ? "dark" : "light")}
        />

        <CommandPalette
          open={paletteOpen}
          onClose={closePalette}
          config={config}
          sections={site.sections}
          onModeChange={setMode}
        />

        <main id="main-content" className="site-main">
          {mode === "landing" ? (
            <LandingPage />
          ) : (
            <div className="shell-wrap">
              <ShellView config={config} />
            </div>
          )}
        </main>

        {mode === "landing" ? <SiteFooter /> : null}
      </div>
    </SiteContext.Provider>
  );
}
