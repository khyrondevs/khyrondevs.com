"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion } from "motion/react";
import { Terminal, CornerDownLeft, Sparkles, Copy, Check } from "lucide-react";
import { siteConfig } from "@/lib/content/site-config";
import { projects } from "@/lib/content/projects";
import { sound } from "@/lib/sound";
import useClipboard from "@/hooks/useClipboard";
import useMediaQuery from "@/hooks/use-media-query";

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

const QUICK_COMMANDS = ["services", "projects", "team", "contact", "clear"];

export default function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init",
      command: "welcome",
      output: (
        <div className="space-y-1 text-fg-muted">
          <p className="text-accent font-semibold">
            {siteConfig.name} / Engineering Console
          </p>
          <p className="text-fg-subtle">
            Type <span className="text-accent font-mono">help</span> or click a quick action pill below to inspect our capabilities.
          </p>
        </div>
      ),
    },
  ]);
  const { copy, status } = useClipboard();
  const copied = status === "copied";
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const nextId = useRef(0);
  const animate = useMediaQuery("(prefers-reduced-motion: no-preference)");

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [logs]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    sound.playClick();
    const id = String(++nextId.current);
    historyRef.current = [...historyRef.current, cmd].slice(-30);
    historyIndex.current = historyRef.current.length;

    if (trimmed === "clear") {
      setLogs([]);
      return;
    }

    let output: React.ReactNode;

    switch (trimmed) {
      case "help":
        output = (
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 font-mono text-fg">
            <div><strong className="text-accent">services</strong>: Core capabilities</div>
            <div><strong className="text-accent">projects</strong>: Live systems</div>
            <div><strong className="text-accent">team</strong>: Founding engineers</div>
            <div><strong className="text-accent">contact</strong>: Direct reach</div>
            <div><strong className="text-accent">clear</strong>: Reset console</div>
          </div>
        );
        break;

      case "services":
        output = (
          <div className="space-y-1.5 font-mono text-xs text-fg-muted">
            <p><span className="text-accent font-bold">[Systems]:</span> Full-stack web applications, FastAPI & Django backends, React 19, PostgreSQL & MongoDB Atlas.</p>
            <p><span className="text-accent font-bold">[AI & RAG]:</span> Document-grounded retrieval-augmented generation, vector search, Jina embeddings.</p>
            <p><span className="text-accent font-bold">[Automation]:</span> Autonomous workflow pipelines, scheduling, robust error handling & telemetry.</p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-2 font-mono text-xs">
            {projects.map((p) => {
              const liveLink = p.links?.find(link => link.kind === "live")?.href;
              return (
                <div key={p.slug} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-1">
                  <div>
                    <strong className="text-fg">{p.title}</strong> — <span className="text-fg-muted">{p.coverDescription}</span>
                  </div>
                  {liveLink ? <a
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-[11px]"
                  >
                    Live Demo →
                  </a> : <span className="text-fg-subtle">In development</span>}
                </div>
              );
            })}
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="space-y-1 font-mono text-xs text-fg">
            <p>Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-accent hover:underline">{siteConfig.contact.email}</a></p>
            <p>Location: <span className="text-fg-muted">Bengaluru, India</span></p>
            <p>GitHub: <a href={siteConfig.contact.github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Repositories</a></p>
          </div>
        );
        break;

      case "team":
      case "founders":
      case "hire":
        output = (
          <div className="space-y-2 rounded-xl border border-accent/20 bg-accent/5 p-3 font-mono text-xs text-fg">
            <div className="flex items-center gap-1.5 text-accent font-bold">
              <Sparkles size={14} />
              <span>Founding Team & Capabilities</span>
            </div>
            <p className="text-fg-muted">
              Founding Team: Senior full-stack engineering team led by Vittal J G. We build production systems end-to-end — from database architecture and APIs to frontends and cloud deployment.
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Engineering%20Partnership%20Inquiry`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 font-bold text-fg hover:opacity-90 transition-opacity"
              >
                Schedule Architecture Discussion →
              </a>
            </div>
          </div>
        );
        break;

      case "sudo":
      case "sudo build":
        output = (
          <p className="font-mono text-xs text-accent">
            [sudo] root override successful. System priority raised: READY_TO_SHIP.
          </p>
        );
        break;

      default:
        output = (
          <p className="font-mono text-xs text-accent-2">
            Command not recognized: &quot;{trimmed}&quot;. Type <span className="text-accent font-bold">help</span> to list options.
          </p>
        );
        break;
    }

    setLogs((prev) => [...prev, { id, command: cmd, output }].slice(-30));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput("");
  };

  const handleCopyEmail = async () => {
    if (await copy(siteConfig.contact.email)) sound.playChime();
  };

  return (
    <section aria-labelledby="terminal-title" className="relative mx-auto my-16 max-w-5xl px-4 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 id="terminal-title" className="text-2xl font-semibold tracking-tight text-fg">A conversation with our stack.</h2><p className="font-mono text-xs text-fg-subtle">Real systems. A few useful commands.</p></div>
      <div className="overflow-hidden rounded-3xl border border-border bg-base shadow-[0_30px_70px_-25px_rgba(0,0,0,0.7)]">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 font-mono text-[11px] text-fg-subtle hidden sm:inline">
              guest@khyron:~ (zsh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyEmail}
              onMouseEnter={() => sound.playHover()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-2.5 py-1 font-mono text-[11px] text-fg-muted hover:bg-surface hover:text-fg transition-colors"
            >
              {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy email"}</span>
            </button>
          </div>
        </div>

        {/* Console Log Area */}
        <div ref={logRef} role="log" aria-label="Command output" aria-live="polite" data-lenis-prevent className="max-h-[340px] min-h-[220px] overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-3 font-mono text-sm bg-base">
          {logs.map((log) => (
            <motion.div key={log.id} initial={animate && log.id !== "init" ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: animate ? .25 : 0 }} className="space-y-1">
              <div className="flex items-center gap-2 text-fg-subtle text-xs">
                <span className="text-accent">guest@khyron:~$</span>
                <span className="text-fg font-semibold">{log.command}</span>
              </div>
              <div className="pl-4">{log.output}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Action Chips & Input Form */}
        <div className="border-t border-border bg-surface p-3 sm:p-4">
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <span className="text-fg-subtle text-[11px] mr-1 hidden sm:inline">Quick actions:</span>
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => sound.playHover()}
                className="rounded-lg border border-border bg-elevated px-2.5 py-1 text-fg-muted hover:border-accent hover:bg-accent/15 hover:text-accent transition-all duration-200 cursor-pointer text-[11px]"
              >
                {cmd}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label className="sr-only" htmlFor="terminal-command">Terminal command</label>
            <Terminal size={15} className="text-accent shrink-0" />
            <input
              ref={inputRef}
              id="terminal-command"
              autoComplete="off"
              spellCheck={false}
              maxLength={200}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                e.preventDefault();
                const history = historyRef.current;
                historyIndex.current = Math.max(0, Math.min(history.length, historyIndex.current + (e.key === "ArrowUp" ? -1 : 1)));
                setInput(history[historyIndex.current] ?? "");
              }}
              placeholder="Type a command (try 'services', 'team', 'projects')..."
              className="min-w-0 flex-1 rounded-sm bg-transparent font-mono text-sm text-fg placeholder:text-fg-subtle focus-visible:outline-accent"
            />
            <button
              type="submit"
              aria-label="Submit command"
              className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-fg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <CornerDownLeft size={14} />
            </button>
          </form>
          <p role="status" className="mt-2 min-h-4 font-mono text-[11px] text-accent-light">{status === "error" ? `Copy unavailable. Email: ${siteConfig.contact.email}` : copied ? "Email copied to clipboard." : "↑ ↓ command history"}</p>
        </div>
      </div>
    </section>
  );
}
