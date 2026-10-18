"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Cpu,
  GraduationCap,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  LMS_PHASES,
  lmsPhaseAtProgress,
  scoreLmsTheater,
} from "@/lib/lms-story";
import LmsCaseStudy from "@/components/sections/LmsCaseStudy";

export default function LmsProjectExperience({
  project,
  children,
}: {
  project: Project;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const theaterStage = useRef<HTMLDivElement>(null);
  const scrollTrack = useRef<HTMLDivElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  useEffect(() => {
    registerGsap();
    const container = root.current;
    const stage = theaterStage.current;
    const track = scrollTrack.current;
    if (!container || !stage || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        mobile: "(max-width: 1023px)",
      },
      (context) => {
        const desktop = Boolean(context.conditions?.desktop);
        if (!desktop) return;

        // Collect motion targets
        const screens = gsap.utils.toArray<HTMLElement>("[data-theater-screen]", stage);
        const progressFill = stage.querySelector<HTMLElement>("[data-theater-progress]");
        const ringStudent = stage.querySelector<HTMLElement>("[data-ring-student]");
        const ringInstructor = stage.querySelector<HTMLElement>("[data-ring-instructor]");
        const ringAdmin = stage.querySelector<HTMLElement>("[data-ring-admin]");
        const coreShield = stage.querySelector<HTMLElement>("[data-core-shield]");
        const jwtTokenPacket = stage.querySelector<HTMLElement>("[data-jwt-packet]");

        // Phase 2 targets
        const instructorCard = stage.querySelector<HTMLElement>("[data-instructor-card]");
        const peerIntruderCard = stage.querySelector<HTMLElement>("[data-intruder-card]");
        const tenantShield = stage.querySelector<HTMLElement>("[data-tenant-shield]");
        const forbiddenDeflect = stage.querySelector<HTMLElement>("[data-forbidden-deflect]");

        // Phase 3 targets
        const moduleCards = gsap.utils.toArray<HTMLElement>("[data-module-card]", stage);
        const liquidProgressBar = stage.querySelector<HTMLElement>("[data-liquid-progress]");
        const unlockBadge = stage.querySelector<HTMLElement>("[data-unlock-badge]");

        // Phase 4 targets
        const certCanvas = stage.querySelector<HTMLElement>("[data-cert-canvas]");
        const signatureTracePath = stage.querySelector<SVGPathElement>("[data-sig-path]");
        const qrSealBadge = stage.querySelector<HTMLElement>("[data-qr-seal]");
        const bufferCylinder = stage.querySelector<HTMLElement>("[data-buffer-cylinder]");

        const scrollDistance = window.innerHeight * 2.8;
        const timeline = gsap.timeline({ paused: true });

        scoreLmsTheater(
          timeline,
          {
            progressFill: progressFill ?? undefined,
            ringStudent: ringStudent ?? undefined,
            ringInstructor: ringInstructor ?? undefined,
            ringAdmin: ringAdmin ?? undefined,
            coreShield: coreShield ?? undefined,
            jwtTokenPacket: jwtTokenPacket ?? undefined,
            instructorCard: instructorCard ?? undefined,
            peerIntruderCard: peerIntruderCard ?? undefined,
            tenantShield: tenantShield ?? undefined,
            forbiddenDeflect: forbiddenDeflect ?? undefined,
            moduleCards: moduleCards.length ? moduleCards : undefined,
            liquidProgressBar: liquidProgressBar ?? undefined,
            unlockBadge: unlockBadge ?? undefined,
            certCanvas: certCanvas ?? undefined,
            signatureTracePath: signatureTracePath ?? undefined,
            qrSealBadge: qrSealBadge ?? undefined,
            bufferCylinder: bufferCylinder ?? undefined,
            screens,
          },
          scrollDistance
        );

        const syncPhase = (self: ScrollTrigger) => {
          const phase = lmsPhaseAtProgress(self.progress);
          setActivePhaseIndex((prev) => (prev === phase ? prev : phase));
        };

        const trigger = ScrollTrigger.create({
          animation: timeline,
          trigger: track,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: stage,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: syncPhase,
        });

        return () => {
          trigger.kill();
          timeline.kill();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  const activePhase = LMS_PHASES[activePhaseIndex] ?? LMS_PHASES[0];

  return (
    <div ref={root} id="online-lms" className="lms-experience bg-[#070913] text-white selection:bg-[#6366f1] selection:text-white min-h-screen">
      {/* ── Standard Showcase Header (Passed from page.tsx) ── */}
      <div className="lms-project-card">{children}</div>

      {/* ── Bespoke Pinned Panoramic Cyber-Academy Theater ── */}
      <section className="lms-theater-section" aria-label="Online LMS Cyber-Academy Matrix Flight Deck">
        {/* Scroll Track container for Desktop Pinning */}
        <div ref={scrollTrack} className="lms-scroll-track">
          {/* Pinned Panoramic Stage Shell */}
          <div ref={theaterStage} className="lms-theater-stage">
            {/* 1. Tactical Academic HUD Header */}
            <header className="lms-hud-header">
              <div className="flex items-center gap-3">
                <span className="lms-beacon" aria-hidden="true" />
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#6366f1] uppercase">
                    ROLE-BASED ACCESS CONTROL &amp; IN-MEMORY VECTOR COMPILATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                    ONLINE LMS CYBER-ACADEMY THEATER
                  </h2>
                </div>
              </div>

              {/* Mission Telemetry Stats */}
              <div className="hidden md:flex items-center gap-4 text-xs font-mono" aria-hidden="true">
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                  <span className="text-white/40 block text-[9px]">SECURITY SHIELD</span>
                  <strong className="text-[#22d3ee]">3-TIER RBAC GATES</strong>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                  <span className="text-white/40 block text-[9px]">PDF COMPILER</span>
                  <strong className="text-[#eab308]">REPORTLAB BYTESIO</strong>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                  <span className="text-white/40 block text-[9px]">STATUS</span>
                  <strong className="text-[#6366f1]">{activePhase.status}</strong>
                </div>
              </div>
            </header>

            {/* 2. Operational Phase Mode Navigation & Scrub Bar */}
            <nav className="lms-mode-nav" aria-label="LMS Operational Phase Selector">
              <div className="lms-mode-tabs" role="tablist">
                {LMS_PHASES.map((phase, idx) => (
                  <button
                    key={phase.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activePhaseIndex}
                    className={`lms-mode-tab${idx === activePhaseIndex ? " is-active" : ""}`}
                    onClick={() => {
                      if (typeof window !== "undefined" && scrollTrack.current) {
                        const targetY =
                          scrollTrack.current.offsetTop + (idx / 4) * window.innerHeight * 2.8;
                        window.scrollTo({ top: targetY, behavior: "smooth" });
                      }
                    }}
                  >
                    <div className="font-bold text-[#6366f1]">{phase.number}</div>
                    <div className="truncate text-white/80">{phase.codename}</div>
                  </button>
                ))}
              </div>

              {/* Progress Scrub Track */}
              <div className="lms-scrub-bar" aria-hidden="true">
                <span className="lms-scrub-fill" data-theater-progress />
              </div>
            </nav>

            {/* 3. Central Panoramic Viewport */}
            <div className="lms-viewport-housing">
              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 01: 3-Tier Orbital RBAC Hologram                   */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`lms-screen-pane${activePhaseIndex === 0 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
                  <div className="lms-orbital-container scale-[0.8] xs:scale-[0.88] sm:scale-95 md:scale-100">
                    <div data-ring-student className="lms-orbital-ring lms-ring-student">
                      <div className="lms-orbit-badge border border-[#22d3ee]/60 text-[#22d3ee] shadow-[0_0_14px_rgba(34,211,238,0.35)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_6px_#22d3ee]" />
                        <span className="font-mono text-xs font-bold tracking-wider uppercase">
                          TIER 01: STUDENT
                        </span>
                      </div>
                    </div>

                    <div data-ring-instructor className="lms-orbital-ring lms-ring-instructor">
                      <div className="lms-orbit-badge border border-[#818cf8]/60 text-[#818cf8] shadow-[0_0_14px_rgba(99,102,241,0.35)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] shadow-[0_0_6px_#818cf8]" />
                        <span className="font-mono text-xs font-bold tracking-wider uppercase">
                          TIER 02: INSTRUCTOR
                        </span>
                      </div>
                    </div>

                    <div data-ring-admin className="lms-orbital-ring lms-ring-admin">
                      <div className="lms-orbit-badge border border-[#facc15]/70 text-[#facc15] shadow-[0_0_16px_rgba(234,179,8,0.4)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#facc15] shadow-[0_0_6px_#facc15]" />
                        <span className="font-mono text-xs font-bold tracking-wider uppercase">
                          TIER 03: ADMIN
                        </span>
                      </div>
                    </div>

                    {/* Central Core Shield & JWT Ingress */}
                    <div data-core-shield className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-black/95 border-2 border-[#6366f1] shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                      <ShieldCheck size={28} className="text-[#6366f1] animate-pulse" />
                      <span className="font-mono text-[9px] text-white/90 mt-1 font-bold tracking-wider">SIMPLEJWT</span>
                      <div data-jwt-packet className="absolute top-[-14px] rounded bg-[#22d3ee] px-2 py-0.5 text-[8px] font-mono text-black font-bold shadow-md">
                        BEARER CLAIMS
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 02: Object-Level Tenant Defense Arena              */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`lms-screen-pane${activePhaseIndex === 1 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-4xl mx-auto flex items-center justify-between gap-8 font-mono text-xs">
                  {/* Instructor Course Owner Card */}
                  <div data-instructor-card className="rounded-2xl border border-[#10b981]/40 bg-[#10b981]/10 p-6 w-64 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm mb-2">
                      <GraduationCap size={16} />
                      <span>COURSE INSTRUCTOR</span>
                    </div>
                    <div className="text-white/60">ID: Instructor_108</div>
                    <div className="text-[#10b981] font-semibold mt-2">200 OK (OWNER GRANTED)</div>
                  </div>

                  {/* Center Tenant Isolation Shield */}
                  <div className="relative flex flex-col items-center justify-center">
                    <div
                      data-forbidden-deflect
                      className="absolute bottom-[calc(100%+18px)] z-30 whitespace-nowrap rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] px-4 py-1.5 font-mono text-[10px] text-white font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(225,29,72,0.6)] border border-[#f43f5e]/80 opacity-0"
                    >
                      403 FORBIDDEN DEFLECTED
                    </div>

                    <div data-tenant-shield className="w-28 h-28 rounded-3xl border-2 border-[#6366f1] bg-black/80 flex flex-col items-center justify-center shadow-2xl">
                      <ShieldCheck size={32} className="text-[#6366f1]" />
                      <span className="font-mono text-[9px] text-[#6366f1] mt-1 font-bold text-center leading-tight">
                        OBJECT GATE<br />obj.instructor
                      </span>
                    </div>
                  </div>

                  {/* Peer Intruder Card */}
                  <div data-intruder-card className="rounded-2xl border border-[#e11d48]/40 bg-[#e11d48]/10 p-6 w-64 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#f43f5e] font-bold text-sm mb-2">
                      <ShieldAlert size={16} />
                      <span>PEER INTRUDER</span>
                    </div>
                    <div className="text-white/60">Unauthorized Mutation</div>
                    <div className="text-[#f43f5e] font-semibold mt-2">403 FORBIDDEN (BLOCKED)</div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 03: Sequential Curriculum Waterfall                */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`lms-screen-pane${activePhaseIndex === 2 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 font-mono text-xs">
                  {/* Cascading Module Cards */}
                  <div className="space-y-2 w-full sm:w-80">
                    {[
                      "01 // Distributed Systems Architecture",
                      "02 // Redis Pub/Sub Multiplexing",
                      "03 // Concurrency Locks & PostgreSQL",
                      "04 // ReportLab Dynamic Vector PDF",
                      "05 // Final Examination & Certification",
                    ].map((modTitle, i) => (
                      <div
                        key={i}
                        data-module-card
                        className="flex items-center justify-between p-3 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 text-white"
                      >
                        <span className="truncate">{modTitle}</span>
                        <CheckCircle2 size={14} className="text-[#10b981] flex-none" />
                      </div>
                    ))}
                  </div>

                  {/* Liquid Progress Bar & Unlock Badge */}
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-6 w-full sm:w-80 flex flex-col items-center shadow-2xl">
                    <div className="w-full text-white/50 mb-2 flex justify-between">
                      <span>COMPLETION:</span>
                      <strong className="text-[#22d3ee]">100%</strong>
                    </div>

                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden my-3">
                      <div
                        data-liquid-progress
                        className="h-full w-full bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#10b981] rounded-full transform-origin-left"
                      />
                    </div>

                    <div data-unlock-badge className="mt-4 flex items-center gap-2 rounded-xl bg-[#eab308] px-4 py-2 font-bold text-black shadow-lg shadow-[#eab308]/20">
                      <Sparkles size={16} />
                      <span>CERTIFICATE UNLOCKED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 04: ReportLab Vector Studio & Cursive Signature     */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`lms-screen-pane${activePhaseIndex === 3 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
                  {/* Certificate Preview Canvas */}
                  <div data-cert-canvas className="lms-cert-canvas max-w-md w-full relative shadow-2xl">
                    <div className="lms-cert-outer-border" />
                    <div className="lms-cert-inner-border" />

                    <div className="text-center relative z-10 pt-2">
                      <div className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#1d4ed8] font-bold">
                        ACADEMY OF DISTRIBUTED SYSTEMS
                      </div>
                      <h3 className="text-lg font-serif text-[#0f172a] font-bold mt-1">
                        Certificate of Mastery
                      </h3>
                      <div className="font-serif italic text-base text-[#1e1b4b] my-2 font-bold">
                        Gowtham R
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-4 border-t border-[#e2e8f0] relative z-10 text-[9px] text-[#64748b]">
                      <div className="flex flex-col items-center">
                        <svg width="100" height="30" viewBox="0 0 120 40" className="text-[#1e1b4b]">
                          <path
                            data-sig-path
                            d="M10 25 C 25 10, 35 35, 55 15 C 70 5, 85 30, 110 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="400"
                            strokeDashoffset="400"
                          />
                        </svg>
                        <span>SIGNATURE VERIFIED</span>
                      </div>

                      <div data-qr-seal className="flex items-center gap-1.5 rounded bg-black p-1 text-white">
                        <QrCode size={16} />
                        <span className="font-mono text-[7px]">UUID: 8F2A-99B1</span>
                      </div>
                    </div>
                  </div>

                  {/* In-Memory Buffer Cylinder */}
                  <div data-buffer-cylinder className="rounded-2xl border border-[#eab308]/40 bg-black/60 p-6 font-mono text-xs w-full sm:w-72 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#eab308] font-bold mb-3">
                      <Cpu size={16} />
                      <span>IN-MEMORY COMPILER</span>
                    </div>
                    <div className="space-y-1 text-white/70 text-[11px]">
                      <div>Buffer: io.BytesIO()</div>
                      <div>Footprint: 0 bytes disk</div>
                      <div>Compile Time: 42ms</div>
                      <div className="text-[#10b981] font-semibold mt-2">HTTP 200: application/pdf</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Deep Dive Interactive Laboratory ── */}
      <LmsCaseStudy project={project} embedded />
    </div>
  );
}
