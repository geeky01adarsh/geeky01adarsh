import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioConfig, SiteSection } from "../../types";

type Command = {
  id: string;
  label: string;
  group: string;
  action: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  sections: SiteSection[];
  onModeChange: (mode: "landing" | "shell") => void;
};

export function CommandPalette({ open, onClose, config, sections, onModeChange }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const nav = sections.filter((s) => s.label).map((s) => ({
      id: `nav-${s.id}`,
      label: `Go to ${s.label}`,
      group: "Navigate",
      action: () => {
        onModeChange("landing");
        onClose();
        setTimeout(() => {
          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      },
    }));

    const actions: Command[] = [
      {
        id: "shell",
        label: "Open Terminal",
        group: "Actions",
        action: () => {
          onModeChange("shell");
          onClose();
        },
      },
      {
        id: "email",
        label: "Send Email",
        group: "Actions",
        action: () => {
          window.location.href = `mailto:${config.meta.email}`;
          onClose();
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "Links",
        action: () => {
          window.open(config.meta.links.github, "_blank");
          onClose();
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Links",
        action: () => {
          window.open(config.meta.links.linkedin, "_blank");
          onClose();
        },
      },
    ];

    if (config.resumeUrl) {
      actions.push({
        id: "resume",
        label: "Download Resume",
        group: "Actions",
        action: () => {
          window.open(config.resumeUrl, "_blank");
          onClose();
        },
      });
    }

    return [...nav, ...actions];
  }, [config, sections, onClose, onModeChange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, activeIndex]);

  if (!open) return null;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.group] ??= []).push(cmd);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-4">
          <svg className="h-4 w-4 text-muted" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group}>
              <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted">{group}</p>
              {cmds.map((cmd) => {
                const idx = flatIndex++;
                const active = idx === activeIndex;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => cmd.action()}
                    className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      active ? "bg-white/10 text-foreground" : "text-muted hover:bg-white/5"
                    }`}
                  >
                    {cmd.label}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">No results found.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
