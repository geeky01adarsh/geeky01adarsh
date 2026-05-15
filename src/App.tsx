import { useEffect, useState } from "react";
import { loadPortfolio } from "./api/loadPortfolio";
import { CustomCursor, shouldShowCustomCursor } from "./components/CustomCursor";
import { InteractiveBackground } from "./components/InteractiveBackground";
import { LandingPage } from "./components/LandingPage";
import { ShellView } from "./components/ShellView";
import { ThemeToggle } from "./components/ThemeToggle";
import { useGamification } from "./hooks/useGamification";
import { usePortfolioThemes } from "./hooks/usePortfolioThemes";
import { applyPortfolioTheme } from "./lib/applyPortfolioTheme";
import { applySeo } from "./lib/applySeo";
import type { PortfolioConfig } from "./types";
import "./styles/global.css";

type Mode = "landing" | "shell";

export default function App() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("landing");
  const { save, awardShellCommand, revealLandingSection, achievementsState } = useGamification(config);
  const {
    themesEnabled,
    shellDarkChrome,
    appearanceChoice,
    setAppearanceChoice,
    surfaceMode,
    labels,
  } = usePortfolioThemes(config, mode);

  useEffect(() => {
    loadPortfolio()
      .then(setConfig)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load config"));
  }, []);

  useEffect(() => {
    if (!config) return;
    applyPortfolioTheme(config, surfaceMode);
  }, [config, surfaceMode]);

  useEffect(() => {
    if (!config) return;
    applySeo(config);
  }, [config]);

  if (error) {
    return (
      <div className="app-shell">
        <p>{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="app-shell">
        <p className="muted">Loading portfolio…</p>
      </div>
    );
  }

  const terminalChrome = mode === "shell" && shellDarkChrome;
  const customCursor = shouldShowCustomCursor(config.visual);

  return (
    <div
      className={`app-shell${terminalChrome ? " app-shell--terminal" : ""}${customCursor ? " app-shell--custom-cursor" : ""}`}
    >
      <InteractiveBackground visual={config.visual} />
      <div className="bg-blur" aria-hidden />
      <CustomCursor visual={config.visual} />
      <header className="top-bar">
        <div className="brand">
          <strong>{config.meta.siteTitle}</strong>
          <span>{config.meta.tagline}</span>
        </div>
        <div className="hud">
          <span className="pill">
            XP <strong>{save.xp}</strong>
          </span>
          <span className="pill pill-muted">
            Achievements <strong>{achievementsState.filter((a) => a.unlocked).length}</strong>/
            {achievementsState.length}
          </span>
          {themesEnabled ? (
            <ThemeToggle
              choice={appearanceChoice}
              onChange={setAppearanceChoice}
              labels={labels}
              inactive={terminalChrome}
              title={
                terminalChrome
                  ? "Shell uses the `shell` palette from portfolio.json. Your choice applies on Landing."
                  : undefined
              }
            />
          ) : null}
          <div className="toggle" role="group" aria-label="View mode">
            <button type="button" className={mode === "landing" ? "active" : ""} onClick={() => setMode("landing")}>
              Landing
            </button>
            <button type="button" className={mode === "shell" ? "active" : ""} onClick={() => setMode("shell")}>
              Shell
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {mode === "landing" ? (
          <LandingPage
            config={config}
            revealedIds={save.revealedLandingSectionIds}
            onRevealSection={revealLandingSection}
          />
        ) : (
          <ShellView config={config} onCommand={awardShellCommand} />
        )}

        <section className="card" style={{ marginTop: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Achievement log</h3>
          <ul className="list" style={{ listStyle: "none", paddingLeft: 0 }}>
            {achievementsState.map((a) => (
              <li key={a.id} style={{ opacity: a.unlocked ? 1 : 0.45 }}>
                <strong>{a.title}</strong> — {a.description}
                {a.unlocked ? " ✓" : " (locked)"}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
