import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { AppearanceMode, PortfolioConfig } from "../types";
import type { SurfaceMode } from "../lib/applyPortfolioTheme";

type Mode = "landing" | "shell";

function subscribeDarkPreference(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getDarkPreferenceSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSnapshot() {
  return false;
}

function readStoredAppearance(key: string, fallback: AppearanceMode): AppearanceMode {
  try {
    const v = localStorage.getItem(key);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function usePortfolioThemes(config: PortfolioConfig | null, viewMode: Mode) {
  const themes = config?.themes;
  const themesEnabled = config != null && config.themes?.enabled !== false;
  const shellDarkChrome = themes?.shellPageUsesDarkChrome !== false;
  const storageKey = themes?.appearanceStorageKey ?? "portfolioV2_appearance";
  const defaultMode: AppearanceMode = themes?.defaultMode ?? "system";

  const [choice, setChoiceState] = useState<AppearanceMode>(() =>
    typeof window === "undefined" ? defaultMode : readStoredAppearance(storageKey, defaultMode),
  );

  useEffect(() => {
    if (!config) return;
    setChoiceState(readStoredAppearance(storageKey, defaultMode));
  }, [config, storageKey, defaultMode]);

  const systemDark = useSyncExternalStore(subscribeDarkPreference, getDarkPreferenceSnapshot, getServerSnapshot);

  const setChoice = useCallback(
    (next: AppearanceMode) => {
      setChoiceState(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const landingResolved: "light" | "dark" = useMemo(() => {
    if (choice === "system") return systemDark ? "dark" : "light";
    return choice;
  }, [choice, systemDark]);

  const surfaceMode: SurfaceMode = useMemo(() => {
    if (!config) return "light";
    if (viewMode === "shell" && shellDarkChrome) return "shell";
    if (!themesEnabled) return "light";
    return landingResolved;
  }, [config, viewMode, shellDarkChrome, themesEnabled, landingResolved]);

  const labels = {
    light: themes?.labels?.light ?? "Light",
    dark: themes?.labels?.dark ?? "Dark",
    system: themes?.labels?.system ?? "Auto",
  };

  return {
    themesEnabled,
    shellDarkChrome,
    appearanceChoice: choice,
    setAppearanceChoice: setChoice,
    surfaceMode,
    landingResolved,
    labels,
    storageKey,
    defaultMode,
  };
}
