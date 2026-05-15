import { useCallback, useEffect, useMemo, useState } from "react";
import type { PortfolioConfig } from "../types";

const KEY = "portfolioV2_game_v1";

export type GameSave = {
  xp: number;
  unlockedAchievementIds: string[];
  distinctShellCommands: string[];
  revealedLandingSectionIds: string[];
};

function readSave(): GameSave {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("empty");
    return JSON.parse(raw) as GameSave;
  } catch {
    return {
      xp: 0,
      unlockedAchievementIds: [],
      distinctShellCommands: [],
      revealedLandingSectionIds: [],
    };
  }
}

function writeSave(s: GameSave) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function useGamification(config: PortfolioConfig | null) {
  const [save, setSave] = useState<GameSave>(() =>
    typeof window === "undefined"
      ? {
          xp: 0,
          unlockedAchievementIds: [],
          distinctShellCommands: [],
          revealedLandingSectionIds: [],
        }
      : readSave(),
  );

  useEffect(() => {
    setSave(readSave());
  }, []);

  const awardShellCommand = useCallback(
    (cmd: string) => {
      if (!config) return;
      const normalized = cmd.trim().toLowerCase();
      if (!normalized) return;

      setSave((prev) => {
        const already = prev.distinctShellCommands.includes(normalized);
        const distinct = already
          ? prev.distinctShellCommands
          : [...prev.distinctShellCommands, normalized];

        const xpGain = already ? 0 : config.gamification.xpPerShellCommand;
        let xp = prev.xp + xpGain;
        const unlocked = new Set(prev.unlockedAchievementIds);

        for (const a of config.gamification.achievements) {
          if (unlocked.has(a.id)) continue;
          let ok = false;
          if (a.id === "shell_starter" && distinct.length >= 1) ok = true;
          if (a.id === "shell_power" && distinct.length >= 8) ok = true;
          if (ok) {
            unlocked.add(a.id);
            xp += a.xpBonus;
          }
        }

        const next: GameSave = {
          xp,
          unlockedAchievementIds: [...unlocked],
          distinctShellCommands: distinct,
          revealedLandingSectionIds: prev.revealedLandingSectionIds,
        };
        writeSave(next);
        return next;
      });
    },
    [config],
  );

  const revealLandingSection = useCallback(
    (id: string) => {
      if (!config) return;
      setSave((prev) => {
        if (prev.revealedLandingSectionIds.includes(id)) return prev;
        const revealed = [...prev.revealedLandingSectionIds, id];
        let xp = prev.xp + config.gamification.xpPerLandingSection;
        const unlocked = new Set(prev.unlockedAchievementIds);

        const allIds = config.landingSections.map((s) => s.id);
        const covered = allIds.every((x) => revealed.includes(x));
        const scout = config.gamification.achievements.find((a) => a.id === "landing_scout");
        if (covered && scout && !unlocked.has(scout.id)) {
          unlocked.add(scout.id);
          xp += scout.xpBonus;
        }

        const next: GameSave = {
          xp,
          unlockedAchievementIds: [...unlocked],
          distinctShellCommands: prev.distinctShellCommands,
          revealedLandingSectionIds: revealed,
        };
        writeSave(next);
        return next;
      });
    },
    [config],
  );

  const achievementsState = useMemo(() => {
    if (!config) return [];
    return config.gamification.achievements.map((a) => ({
      ...a,
      unlocked: save.unlockedAchievementIds.includes(a.id),
    }));
  }, [config, save.unlockedAchievementIds]);

  return { save, awardShellCommand, revealLandingSection, achievementsState };
}
