"use client";

import React from "react";
import { ArrowUpRight, FileCode2 } from "lucide-react";
import type { Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

type ProjectStyle = {
  liveBg: string;
  liveText: string;
  liveShadow: string;
  liveHoverShadow: string;
  liveRing: string;
  liveDot: string;
  githubBorder: string;
  githubText: string;
  githubHoverBorder: string;
  githubHoverBg: string;
  githubHoverShadow: string;
};

const PROJECT_STYLES: Record<string, ProjectStyle> = {
  cyphr: {
    liveBg: "bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa]",
    liveText: "text-white font-semibold",
    liveShadow: "shadow-[0_0_20px_rgba(59,130,246,0.35)]",
    liveHoverShadow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.6)]",
    liveRing: "focus-visible:ring-[#60a5fa]",
    liveDot: "bg-[#60a5fa]",
    githubBorder: "border-[#3b82f6]/40",
    githubText: "text-white",
    githubHoverBorder: "hover:border-[#60a5fa]",
    githubHoverBg: "hover:bg-[#3b82f6]/15",
    githubHoverShadow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
  },
  cinemora: {
    liveBg: "bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24]",
    liveText: "text-black font-semibold",
    liveShadow: "shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    liveHoverShadow: "hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]",
    liveRing: "focus-visible:ring-[#f59e0b]",
    liveDot: "bg-[#f59e0b]",
    githubBorder: "border-[#f59e0b]/40",
    githubText: "text-white",
    githubHoverBorder: "hover:border-[#fbbf24]",
    githubHoverBg: "hover:bg-[#f59e0b]/15",
    githubHoverShadow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
  },
  jobpilot: {
    liveBg: "bg-gradient-to-r from-[#059669] via-[#10b981] to-[#34d399]",
    liveText: "text-black font-semibold",
    liveShadow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    liveHoverShadow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.6)]",
    liveRing: "focus-visible:ring-[#10b981]",
    liveDot: "bg-[#34d399]",
    githubBorder: "border-[#10b981]/40",
    githubText: "text-white",
    githubHoverBorder: "hover:border-[#34d399]",
    githubHoverBg: "hover:bg-[#10b981]/15",
    githubHoverShadow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
  },
  eazyshop: {
    liveBg: "bg-gradient-to-r from-[#047857] via-[#10b981] to-[#6ee7b7]",
    liveText: "text-black font-semibold",
    liveShadow: "shadow-[0_0_20px_rgba(16,185,129,0.35)]",
    liveHoverShadow: "hover:shadow-[0_0_30px_rgba(110,231,183,0.6)]",
    liveRing: "focus-visible:ring-[#10b981]",
    liveDot: "bg-[#10b981]",
    githubBorder: "border-[#10b981]/40",
    githubText: "text-white",
    githubHoverBorder: "hover:border-[#6ee7b7]",
    githubHoverBg: "hover:bg-[#10b981]/15",
    githubHoverShadow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
  },
  "ai-house-price-estimator": {
    liveBg: "bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#38bdf8]",
    liveText: "text-black font-semibold",
    liveShadow: "shadow-[0_0_20px_rgba(6,182,212,0.35)]",
    liveHoverShadow: "hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]",
    liveRing: "focus-visible:ring-[#06b6d4]",
    liveDot: "bg-[#22d3ee]",
    githubBorder: "border-[#06b6d4]/40",
    githubText: "text-white",
    githubHoverBorder: "hover:border-[#38bdf8]",
    githubHoverBg: "hover:bg-[#06b6d4]/15",
    githubHoverShadow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
  },
  "online-lms": {
    liveBg: "bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#818cf8]",
    liveText: "text-white font-semibold",
    liveShadow: "shadow-[0_0_20px_rgba(99,102,241,0.35)]",
    liveHoverShadow: "hover:shadow-[0_0_30px_rgba(129,140,248,0.6)]",
    liveRing: "focus-visible:ring-[#6366f1]",
    liveDot: "bg-[#818cf8]",
    githubBorder: "border-[#6366f1]/40",
    githubText: "text-white",
    githubHoverBorder: "hover:border-[#818cf8]",
    githubHoverBg: "hover:bg-[#6366f1]/15",
    githubHoverShadow: "hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]",
  },
};

const DEFAULT_STYLE: ProjectStyle = {
  liveBg: "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400",
  liveText: "text-white font-semibold",
  liveShadow: "shadow-[0_0_20px_rgba(59,130,246,0.35)]",
  liveHoverShadow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.6)]",
  liveRing: "focus-visible:ring-blue-400",
  liveDot: "bg-cyan-400",
  githubBorder: "border-white/20",
  githubText: "text-white",
  githubHoverBorder: "hover:border-white/50",
  githubHoverBg: "hover:bg-white/10",
  githubHoverShadow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]",
};

interface ProjectActionButtonsProps {
  project: Project;
  className?: string;
  size?: "default" | "sm";
}

export function ProjectActionButtons({
  project,
  className,
  size = "default",
}: ProjectActionButtonsProps) {
  const links = project.links ?? [];
  if (!links.length) return null;

  const liveLink = links.find((l) => l.kind === "live");
  const githubLink = links.find((l) => l.kind === "github");
  const otherLinks = links.filter((l) => l.kind !== "live" && l.kind !== "github");

  const style = PROJECT_STYLES[project.slug] ?? DEFAULT_STYLE;

  const isSm = size === "sm";

  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {/* ── 1. PRIMARY VISIT LIVE BUTTON ── */}
      {liveLink && (
        <a
          href={liveLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative inline-flex items-center gap-2.5 rounded-xl font-mono uppercase tracking-wider transition-all duration-200",
            "active:scale-[0.97] hover:brightness-110",
            style.liveBg,
            style.liveText,
            style.liveShadow,
            style.liveHoverShadow,
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0d]",
            style.liveRing,
            isSm ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-xs sm:text-sm font-medium"
          )}
        >
          {/* Subtle light sweep sheen */}
          <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute -inset-[100%] top-0 block -rotate-45 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:translate-x-full" />
          </span>

          {/* Pulsing live radar beacon */}
          <span className="relative flex h-2 w-2 flex-none">
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", style.liveDot)} />
            <span className={cn("relative inline-flex rounded-full h-2 w-2", style.liveDot)} />
          </span>

          <span className="relative">{liveLink.label}</span>
          <ArrowUpRight
            size={isSm ? 14 : 16}
            className="flex-none transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      )}

      {/* ── 2. SECONDARY SOURCE CODE BUTTON ── */}
      {githubLink && (
        <a
          href={githubLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative inline-flex items-center gap-2.5 rounded-xl font-mono uppercase tracking-wider transition-all duration-200",
            "border bg-black/40 backdrop-blur-md",
            "active:scale-[0.97]",
            style.githubBorder,
            style.githubText,
            style.githubHoverBorder,
            style.githubHoverBg,
            style.githubHoverShadow,
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0d] focus-visible:ring-white/40",
            isSm ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-xs sm:text-sm"
          )}
        >
          <GithubIcon className="w-4 h-4 flex-none opacity-90 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110" />
          <span>{githubLink.label}</span>
          <ArrowUpRight
            size={isSm ? 14 : 16}
            className="flex-none text-white/50 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      )}

      {/* ── 3. OTHER COMPLEMENTARY LINKS (Docs / API) ── */}
      {otherLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 font-mono text-xs uppercase tracking-wider text-white/70 backdrop-blur-md transition-all duration-200",
            "hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-[0.97]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0d] focus-visible:ring-white/40",
            isSm ? "px-3 py-1.5" : "px-4 py-2"
          )}
        >
          <FileCode2 size={13} className="flex-none opacity-70 group-hover:opacity-100" />
          <span>{link.label}</span>
          <ArrowUpRight size={13} className="flex-none opacity-50 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      ))}
    </div>
  );
}

export default ProjectActionButtons;
