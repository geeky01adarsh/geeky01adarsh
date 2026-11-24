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
      return `${p.name} (${p.period ?? "—"})\n  stack: ${p.stack}${link}\n${p.results.map((b) => `  - ${b}`).join("\n")}`;
    })
    .join("\n\n");
}

type Props = {
  config: PortfolioConfig;
};

export function ShellView({ config }: Props) {
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
        "  contact         Email and links",
        "  metrics         Engineering metrics",
        "  stack           Tech stack proficiency",
      ].join("\n"),
    [],
  );

  useEffect(() => {
    setLines([
      { kind: "out", text: config.meta.siteTitle },
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
    setLines((prev) => [...prev, { kind: "out", text: `$ ${cmd}` }]);

    const c = cmd.toLowerCase();
    if (c === "help") pushOut(helpText);
    else if (c === "clear") setLines([]);
    else if (c === "whoami")
      pushOut(`${config.meta.siteTitle}\n${config.hero.subheading}\n${config.meta.location}`);
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
          config.availability,
        ]
          .filter((v): v is string => Boolean(v && v.length))
          .join("\n"),
      );
    else if (c === "metrics")
      pushOut(
        config.metrics
          .map((m) => `${m.label}: ${m.prefix ?? ""}${m.value}${m.suffix ?? ""}`)
          .join("\n"),
      );
    else if (c === "stack")
      pushOut(
        config.techStack
          .map((cat) => `${cat.label}:\n${cat.skills.map((s) => `  ${s.name} (${s.proficiency}%)`).join("\n")}`)
          .join("\n\n"),
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
    <div className="glass overflow-hidden rounded-2xl font-mono text-sm">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-muted">portfolio-shell</span>
      </div>
      <div
        className="min-h-[60vh] max-h-[70vh] overflow-y-auto bg-[var(--terminal-bg)] p-4 text-[var(--terminal-fg)]"
        role="region"
        aria-label="Portfolio shell"
      >
        <div>
          {lines.map((l, i) => (
            <p
              key={`${i}-${l.text.slice(0, 12)}`}
              className={`whitespace-pre-wrap leading-relaxed ${l.kind === "err" ? "text-[var(--terminal-err)]" : ""}`}
            >
              {l.text}
            </p>
          ))}
        </div>
        <form className="mt-2 flex items-center gap-2" onSubmit={onSubmit}>
          <span className="text-[var(--terminal-prompt)]">$</span>
          <input
            autoComplete="off"
            spellCheck={false}
            placeholder="try: experience | projects | metrics"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-[var(--terminal-fg)] outline-none placeholder:text-[var(--terminal-hint)]"
            aria-label="Shell command input"
          />
        </form>
        <p className="mt-3 text-xs text-[var(--terminal-hint)]">
          Tip: type <code className="text-[var(--terminal-prompt)]">help</code> for available commands.
        </p>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
