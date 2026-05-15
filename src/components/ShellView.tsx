import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioConfig } from "../types";

type Line = { kind: "out" | "err"; text: string };

function formatSkills(cfg: PortfolioConfig): string {
  return Object.entries(cfg.skills)
    .map(([k, v]) => `${k}: ${v.join(", ")}`)
    .join("\n\n");
}

function formatExperience(cfg: PortfolioConfig): string {
  return cfg.experience
    .map((e) => {
      const blocks = e.highlights
        .map(
          (h) =>
            `  ▸ ${h.name} — ${h.stack}\n${h.bullets.map((b) => `    - ${b}`).join("\n")}`,
        )
        .join("\n");
      return `${e.role} @ ${e.company} (${e.start} – ${e.end})\n${e.location}\n${blocks}`;
    })
    .join("\n\n");
}

function formatProjects(cfg: PortfolioConfig): string {
  return cfg.projects
    .map((p) => {
      const link = p.link ? `\n  link: ${p.link}` : "";
      return `${p.name} (${p.period ?? "—"})\n  stack: ${p.stack}${link}\n${p.bullets.map((b) => `  - ${b}`).join("\n")}`;
    })
    .join("\n\n");
}

type Props = {
  config: PortfolioConfig;
  onCommand: (cmd: string) => void;
};

export function ShellView({ config, onCommand }: Props) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const helpText = useMemo(
    () =>
      [
        "Commands:",
        "  help            Show this list",
        "  clear           Clear the screen",
        "  whoami          Short bio",
        "  skills          Technical skills",
        "  experience      Work history",
        "  projects        Selected projects",
        "  achievements    Awards & highlights",
        "  education       Degrees",
        "  contact         Email, phone, links",
        "  quests          Gamification progress",
      ].join("\n"),
    [],
  );

  useEffect(() => {
    setLines([
      { kind: "out", text: `💙 ${config.meta.siteTitle}` },
      { kind: "out", text: config.meta.shellWelcome },
      { kind: "out", text: "" },
      { kind: "out", text: helpText },
    ]);
  }, [config, helpText]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  function pushOut(text: string) {
    setLines((prev) => [...prev, { kind: "out", text }]);
  }

  function pushErr(text: string) {
    setLines((prev) => [...prev, { kind: "err", text }]);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    onCommand(cmd);
    setLines((prev) => [...prev, { kind: "out", text: `$ ${cmd}` }]);

    const c = cmd.toLowerCase();
    if (c === "help") pushOut(helpText);
    else if (c === "clear") setLines([]);
    else if (c === "whoami")
      pushOut(`${config.meta.siteTitle}\n${config.meta.tagline}\n${config.meta.location}`);
    else if (c === "skills") pushOut(formatSkills(config));
    else if (c === "experience") pushOut(formatExperience(config));
    else if (c === "projects") pushOut(formatProjects(config));
    else if (c === "achievements") pushOut(config.achievements.map((a) => `• ${a}`).join("\n"));
    else if (c === "education")
      pushOut(
        config.education
          .map((ed) => `${ed.degree} — ${ed.school}\n${ed.detail ?? ""}\n${ed.end} · ${ed.location}`)
          .join("\n\n"),
      );
    else if (c === "contact")
      pushOut(
        [
          config.meta.email,
          config.meta.phone,
          `LinkedIn: ${config.meta.links.linkedin}`,
          `GitHub: ${config.meta.links.github}`,
        ]
          .filter((v): v is string => Boolean(v && v.length))
          .join("\n"),
      );
    else if (c === "quests")
      pushOut(
        [
          "Explore the landing page sections and run distinct shell commands to earn XP.",
          "Achievements unlock from config — see HUD on the landing view.",
        ].join("\n"),
      );
    else pushErr(`Unknown command: ${cmd}. Try help.`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = input;
    setInput("");
    run(v);
  }

  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="terminal" role="region" aria-label="Portfolio shell">
        <div>
          {lines.map((l, i) => (
            <p key={`${i}-${l.text.slice(0, 12)}`} className={`line${l.kind === "err" ? " line--err" : ""}`}>
              {l.text}
            </p>
          ))}
        </div>
        <form className="cmd-input-row" onSubmit={onSubmit}>
          <span className="prompt">$</span>
          <input
            autoComplete="off"
            spellCheck={false}
            placeholder="try: experience | skills | projects"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div className="hint">Tip: every new command awards XP (stored in this browser).</div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
