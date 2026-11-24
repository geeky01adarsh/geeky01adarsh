import { useState } from "react";
import { useScrollSpy } from "../../hooks/useSiteEffects";
import { initialsOf, useSite } from "./shared";

type Props = {
  mode: "landing" | "shell";
  onModeChange: (mode: "landing" | "shell") => void;
  onOpenPalette: () => void;
  themesEnabled: boolean;
  isLight: boolean;
  onToggleTheme: () => void;
};

function ThemeSwitch({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`theme-switch${isLight ? " is-light" : ""}`}
      onClick={onToggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={isLight}
    >
      <span className="ts-text ts-text-dark">Dark</span>
      <span className="ts-text ts-text-light">Light</span>
      <span className="ts-knob" aria-hidden="true">
        <span className="ts-icon" key={isLight ? "sun" : "moon"}>
          {isLight ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M20.3 14.6A8.6 8.6 0 0 1 9.4 3.7a8.6 8.6 0 1 0 10.9 10.9Z" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}

export function SiteHeader({ mode, onModeChange, onOpenPalette, themesEnabled, isLight, onToggleTheme }: Props) {
  const { config, sections } = useSite();
  const [open, setOpen] = useState(false);
  const navItems = sections.filter((s) => s.label && s.type !== "hero");
  const active = useScrollSpy(mode === "landing" ? navItems.map((s) => s.id) : []);
  const { profile, nav } = config;
  const close = () => setOpen(false);

  const goHome = (e: React.MouseEvent) => {
    close();
    if (mode !== "landing") {
      e.preventDefault();
      onModeChange("landing");
    }
  };

  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Main navigation">
        <a className="brand-link" href="#hero" onClick={goHome} aria-label="Home">
          <span className="brand-avatar">{profile.initials ?? initialsOf(profile.name)}</span>
          <span className="brand-meta">
            <span className="brand-name">{profile.name}</span>
            {profile.status ? (
              <span className="brand-status">
                <span className="status-dot" /> {profile.status}
              </span>
            ) : null}
          </span>
        </a>

        {mode === "landing" ? (
          <ul className={`nav-links${open ? " is-open" : ""}`}>
            {navItems.map((s) => (
              <li key={s.id}>
                <a className={`nav-link${active === s.id ? " is-active" : ""}`} href={`#${s.id}`} onClick={close}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span className="nav-mode-label">~/terminal</span>
        )}

        <div className="nav-actions">
          {nav?.showSearch !== false ? (
            <button type="button" className="nav-icon-btn" onClick={onOpenPalette} aria-label="Open command palette (⌘K)" title="Search (⌘K)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.2-4.2" />
              </svg>
            </button>
          ) : null}
          {nav?.showShellToggle !== false ? (
            <button
              type="button"
              className={`nav-icon-btn${mode === "shell" ? " is-active" : ""}`}
              onClick={() => onModeChange(mode === "shell" ? "landing" : "shell")}
              aria-label={mode === "shell" ? "Back to site" : "Open terminal view"}
              title={mode === "shell" ? "Back to site" : "Terminal view"}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 7 5 5-5 5M12.5 17H19" />
              </svg>
            </button>
          ) : null}
          {themesEnabled && mode === "landing" ? <ThemeSwitch isLight={isLight} onToggle={onToggleTheme} /> : null}
          {mode === "landing" ? (
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? "✕" : "☰"}
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
