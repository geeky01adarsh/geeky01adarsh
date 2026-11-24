import { useEffect, useState } from "react";

const COMMANDS = [
  { cmd: "whoami", output: "adarsh.sinha — backend & systems engineer" },
  { cmd: "uptime", output: "3+ years · 4 production systems · 99.99% SLA" },
  { cmd: "stats --live", output: "45K users · 300K tx/day · 10M sessions/day" },
  { cmd: "stack", output: "Node.js · C++ · TypeScript · AWS · Canton · DPI" },
  { cmd: "status", output: "● available — backend, systems, AI engineering" },
];

export function HeroTerminal() {
  const [lines, setLines] = useState<{ cmd: string; output: string }[]>([]);
  const [currentCmd, setCurrentCmd] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "pause">("typing");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(COMMANDS.slice(0, 3));
      return;
    }

    const entry = COMMANDS[cmdIndex];
    if (!entry) return;

    if (phase === "typing") {
      if (charIndex < entry.cmd.length) {
        const t = setTimeout(() => {
          setCurrentCmd(entry.cmd.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        }, 60 + Math.random() * 40);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("output"), 400);
      return () => clearTimeout(t);
    }

    if (phase === "output") {
      setLines((prev) => [...prev.slice(-4), { cmd: entry.cmd, output: entry.output }]);
      setCurrentCmd("");
      setCharIndex(0);
      setPhase("pause");
      const t = setTimeout(() => {
        setCmdIndex((i) => (i + 1) % COMMANDS.length);
        setPhase("typing");
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [phase, charIndex, cmdIndex]);

  return (
    <div className="glass overflow-hidden rounded-xl font-mono text-xs sm:text-sm">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-muted">~/portfolio</span>
      </div>
      <div className="min-h-[180px] space-y-2 p-4 text-terminal-fg">
        {lines.map((l, i) => (
          <div key={`${l.cmd}-${i}`}>
            <p>
              <span className="text-terminal-prompt">$</span> {l.cmd}
            </p>
            <p className="pl-4 text-muted">{l.output}</p>
          </div>
        ))}
        {phase === "typing" && currentCmd ? (
          <p>
            <span className="text-terminal-prompt">$</span> {currentCmd}
            <span className="animate-pulse text-terminal-prompt">▊</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
