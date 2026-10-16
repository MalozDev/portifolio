"use client";

import { useEffect, useRef, useState } from "react";

import { contact } from "@/lib/data";

interface Line {
  prompt?: string;
  text: string;
  kind: "command" | "output" | "accent";
}

const COMMANDS: Record<string, Line[]> = {
  whoami: [
    { prompt: "$", text: "whoami", kind: "command" },
    {
      text: "steph — systemCall(). Computer Systems Engineer (UNZA '26). I build things people actually use.",
      kind: "output",
    },
  ],
  "cat mission.txt": [
    { prompt: "$", text: "cat mission.txt", kind: "command" },
    {
      text: "Turn ideas into deployed products. Learn systems by taking them apart. Ship, measure, improve.",
      kind: "output",
    },
  ],
  "ls skills": [
    { prompt: "$", text: "ls skills", kind: "command" },
    {
      text: "javascript  typescript  react  node.js  postgres  mongodb  linux  networking  iot  cloud",
      kind: "accent",
    },
  ],
  "ping awards": [
    { prompt: "$", text: "ping awards", kind: "command" },
    { text: "🏆 Mukali Award — top-performing installer, quarter award.", kind: "accent" },
    { text: "5 certifications · 8+ live projects · 2 hackathons", kind: "output" },
  ],
  "sudo hire me": [
    { prompt: "$", text: "sudo hire me", kind: "command" },
    { text: "[sudo] opening mail client…", kind: "output" },
    { prompt: "→", text: contact.email, kind: "accent" },
    { prompt: "→", text: contact.whatsapp, kind: "accent" },
  ],
};

const COMMAND_KEYS = Object.keys(COMMANDS);
const TYPING_SPEED_MS = 20;
const LINE_PAUSE_MS = 250;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(false);
  const busyRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  async function run(command: string) {
    if (busyRef.current) return;
    busyRef.current = true;
    setTyping(true);

    for (const line of COMMANDS[command]) {
      if (line.kind === "command") {
        // Type the command character by character.
        for (let i = 1; i <= line.text.length; i++) {
          const partial = { ...line, text: line.text.slice(0, i) };
          setLines((prev) =>
            i === 1 ? [...prev, partial] : [...prev.slice(0, -1), partial]
          );
          await sleep(TYPING_SPEED_MS);
        }
      } else {
        setLines((prev) => [...prev, line]);
      }
      await sleep(LINE_PAUSE_MS);
    }

    busyRef.current = false;
    setTyping(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0a0d12] shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-card/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
          steph@systemcall: ~/about
        </span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-72"
        aria-live="polite"
      >
        {lines.length === 0 && (
          <p className="text-muted-foreground">
            <span className="text-brand">$</span> Pick a command below to run it…
          </p>
        )}
        {lines.map((line, i) => (
          <p
            key={i}
            className={
              line.kind === "command"
                ? "text-foreground"
                : line.kind === "accent"
                  ? "text-brand"
                  : "text-muted-foreground"
            }
          >
            {line.prompt && <span className="mr-2 text-brand">{line.prompt}</span>}
            {line.text}
            {typing && i === lines.length - 1 && line.kind === "command" && (
              <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-brand animate-blink-cursor" />
            )}
          </p>
        ))}
      </div>

      {/* Command chips */}
      <div className="flex flex-wrap gap-2 border-t border-border bg-card/40 p-3">
        {COMMAND_KEYS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => run(command)}
            disabled={typing}
            className="rounded-lg border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
