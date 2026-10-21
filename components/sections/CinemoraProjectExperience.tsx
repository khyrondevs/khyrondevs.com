"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Lock,
  QrCode,
  Radio,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  CINEMORA_PHASES,
  cinemoraPhaseAtProgress,
  scoreCinemoraTheater,
} from "@/lib/cinemora-story";
import CinemoraCaseStudy from "@/components/sections/CinemoraCaseStudy";

export default function CinemoraProjectExperience({
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
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        setActivePhaseIndex((prev) => Math.min(prev + 1, CINEMORA_PHASES.length - 1));
      } else {
        setActivePhaseIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handlePhaseSelect = (idx: number) => {
    setActivePhaseIndex(idx);
    if (typeof window !== "undefined" && scrollTrack.current && window.innerWidth >= 1024) {
      const targetY =
        scrollTrack.current.offsetTop + (idx / 4) * window.innerHeight * 2.8;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

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
        const projectorRay = stage.querySelector<HTMLElement>("[data-projector-ray]");
        const imaxScreen = stage.querySelector<HTMLElement>("[data-imax-screen]");
        const seatRows = gsap.utils.toArray<HTMLElement>("[data-seat-row]", stage);
        const wsBeams = gsap.utils.toArray<HTMLElement>("[data-ws-beam]", stage);

        // Phase 2 targets
        const userCardTokyo = stage.querySelector<HTMLElement>("[data-user-tokyo]");
        const userCardLondon = stage.querySelector<HTMLElement>("[data-user-london]");
        const laserBeamTokyo = stage.querySelector<HTMLElement>("[data-laser-tokyo]");
        const laserBeamLondon = stage.querySelector<HTMLElement>("[data-laser-london]");
        const rowLockShield = stage.querySelector<HTMLElement>("[data-row-lock-shield]");
        const conflictClash = stage.querySelector<HTMLElement>("[data-conflict-clash]");

        // Phase 3 targets
        const qrTicket = stage.querySelector<HTMLElement>("[data-qr-ticket]");
        const qrScanLaser = stage.querySelector<HTMLElement>("[data-qr-laser]");
        const turnstileArm = stage.querySelector<HTMLElement>("[data-turnstile-arm]");
        const admissionBeacon = stage.querySelector<HTMLElement>("[data-admission-beacon]");

        // Phase 4 targets
        const timeScrubberNeedle = stage.querySelector<HTMLElement>("[data-scrubber-needle]");
        const refundGaugeDial = stage.querySelector<HTMLElement>("[data-refund-dial]");
        const moneyBurstParticles = gsap.utils.toArray<HTMLElement>("[data-money-particle]", stage);
        const walletCard = stage.querySelector<HTMLElement>("[data-wallet-card]");
        const walletBalance = stage.querySelector<HTMLElement>("[data-wallet-balance]");

        const scrollDistance = window.innerHeight * 2.8;
        const timeline = gsap.timeline({ paused: true });

        scoreCinemoraTheater(
          timeline,
          {
            progressFill: progressFill ?? undefined,
            projectorRay: projectorRay ?? undefined,
            imaxScreen: imaxScreen ?? undefined,
            seatRows: seatRows.length ? seatRows : undefined,
            wsBeams: wsBeams.length ? wsBeams : undefined,
            userCardTokyo: userCardTokyo ?? undefined,
            userCardLondon: userCardLondon ?? undefined,
            laserBeamTokyo: laserBeamTokyo ?? undefined,
            laserBeamLondon: laserBeamLondon ?? undefined,
            rowLockShield: rowLockShield ?? undefined,
            conflictClash: conflictClash ?? undefined,
            qrTicket: qrTicket ?? undefined,
            qrScanLaser: qrScanLaser ?? undefined,
            turnstileArm: turnstileArm ?? undefined,
            admissionBeacon: admissionBeacon ?? undefined,
            timeScrubberNeedle: timeScrubberNeedle ?? undefined,
            refundGaugeDial: refundGaugeDial ?? undefined,
            moneyBurstParticles: moneyBurstParticles.length ? moneyBurstParticles : undefined,
            walletCard: walletCard ?? undefined,
            walletBalance: walletBalance ?? undefined,
            screens,
          },
          scrollDistance
        );

        const syncPhase = (self: ScrollTrigger) => {
          const phase = cinemoraPhaseAtProgress(self.progress);
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

  const activePhase = CINEMORA_PHASES[activePhaseIndex] ?? CINEMORA_PHASES[0];

  return (
    <div ref={root} id="cinemora" className="cinemora-experience bg-[#08090d] text-white selection:bg-[#f59e0b] selection:text-black min-h-screen">
      {/* ── Standard Showcase Header (Passed from page.tsx) ── */}
      <div className="cinemora-project-card">{children}</div>

      {/* ── Bespoke Pinned Panoramic Concurrency Theater ── */}
      <section className="cinemora-theater-section" aria-label="Cinemora Real-Time Concurrency Flight Deck">
        {/* Scroll Track container for Desktop Pinning */}
        <div ref={scrollTrack} className="cinemora-scroll-track">
          {/* Pinned Panoramic Stage Shell */}
          <div ref={theaterStage} className="cinemora-theater-stage">
            {/* 1. Tactical Cinema HUD Header */}
            <header className="cinemora-hud-header">
              <div className="flex items-center gap-3">
                <span className="cinemora-live-beacon" aria-hidden="true" />
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-[#f59e0b] uppercase">
                    DISTRIBUTED CONCURRENCY &amp; ASYNCHRONOUS WEBSOCKETS
                  </span>
                  <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                    CINEMORA REAL-TIME CONCURRENCY THEATER
                  </h2>
                </div>
              </div>

              {/* Mission Telemetry Stats */}
              <div className="hidden md:flex items-center gap-4 text-xs font-mono" aria-hidden="true">
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                  <span className="text-white/40 block text-[9px]">BROADCAST ENGINE</span>
                  <strong className="text-[#06b6d4]">DAPHNE ASGI 4.3</strong>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                  <span className="text-white/40 block text-[9px]">ISOLATION LEVEL</span>
                  <strong className="text-[#10b981]">SELECT FOR UPDATE</strong>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5">
                  <span className="text-white/40 block text-[9px]">STATUS</span>
                  <strong className="text-[#f59e0b]">{activePhase.status}</strong>
                </div>
              </div>
            </header>

            {/* 2. Operational Phase Mode Navigation & Scrub Bar */}
            <nav className="cinemora-mode-nav" aria-label="Concurrency Operational Phase Selector">
              <div className="cinemora-mode-tabs" role="tablist">
                {CINEMORA_PHASES.map((phase, idx) => (
                  <button
                    key={phase.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activePhaseIndex}
                    className={`cinemora-mode-tab${idx === activePhaseIndex ? " is-active" : ""}`}
                    onClick={() => handlePhaseSelect(idx)}
                  >
                    <div className="font-bold text-[#f59e0b] text-[11px] sm:text-xs">{phase.number}</div>
                    <div className="cinemora-tab-codename text-white/80">{phase.codename}</div>
                  </button>
                ))}
              </div>

              {/* Progress Scrub Track */}
              <div className="cinemora-scrub-bar" aria-hidden="true">
                <span
                  className="cinemora-scrub-fill"
                  data-theater-progress
                  style={{
                    transform:
                      typeof window !== "undefined" && window.innerWidth < 1024
                        ? `scaleX(${(activePhaseIndex + 1) / CINEMORA_PHASES.length})`
                        : undefined,
                  }}
                />
              </div>
            </nav>

            {/* 3. Central Panoramic Viewport */}
            <div
              className="cinemora-viewport-housing"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 01: WebSocket Seat Fan-Out & Projector Ray        */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`cinemora-screen-pane${activePhaseIndex === 0 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
                  <div data-projector-ray className="cinemora-projector-ray" />

                  {/* Curved IMAX Screen */}
                  <div data-imax-screen className="cinemora-imax-screen mb-6">
                    <span className="cinemora-screen-label">IMAX LASER CURVED SOUNDSTAGE // SCREEN 01</span>
                  </div>

                  {/* 3D Seat Rows */}
                  <div className="cinemora-auditorium-stage w-full">
                    <div className="cinemora-seat-grid-3d flex flex-col items-center gap-1.5 sm:gap-2">
                      {["A", "B", "C", "D"].map((rowLabel) => (
                        <div key={rowLabel} data-seat-row className="flex items-center gap-1 sm:gap-2">
                          <span className="w-4 sm:w-5 font-mono text-[9px] sm:text-[10px] text-white/40">{rowLabel}</span>
                          <div className="flex gap-1 sm:gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 sm:w-7 sm:h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center text-[8px] sm:text-[9px] font-mono text-white/60"
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ingestion Beam Telemetry */}
                  <div className="mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-6 font-mono text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Radio size={14} className="text-[#06b6d4] animate-pulse" />
                      <span>REDIS CHANNEL BUS // showtime_104</span>
                      <span data-ws-beam className="hidden sm:inline-block w-12 h-0.5 bg-[#06b6d4] rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-[#10b981]" />
                      <span>42 SUBSCRIBED CLIENTS</span>
                      <span data-ws-beam className="hidden sm:inline-block w-12 h-0.5 bg-[#10b981] rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 02: Dual-User Concurrency Duel (409 Conflict)      */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`cinemora-screen-pane${activePhaseIndex === 1 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                  {/* Tokyo Client Card */}
                  <div data-user-tokyo className="rounded-2xl border border-[#10b981]/40 bg-[#10b981]/10 p-4 sm:p-6 font-mono text-xs w-full max-w-xs md:w-64 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm mb-2">
                      <Users size={16} />
                      <span>USER_TOKYO (TX#9841)</span>
                    </div>
                    <div className="text-white/60">Target: Seat A4 (VIP)</div>
                    <div className="text-[#10b981] font-semibold mt-2">HTTP 200 OK (LOCK WON)</div>
                  </div>

                  {/* Center PostgreSQL Lock Core */}
                  <div className="relative flex flex-col items-center justify-center my-2 md:my-0">
                    <div data-laser-tokyo className="hidden md:block absolute left-[-100px] top-1/2 w-28 h-1 bg-[#10b981] rounded shadow-[0_0_12px_#10b981]" />
                    <div data-laser-london className="hidden md:block absolute right-[-100px] top-1/2 w-28 h-1 bg-[#e11d48] rounded shadow-[0_0_12px_#e11d48]" />

                    <div
                      data-conflict-clash
                      className="md:absolute md:bottom-[calc(100%+18px)] mb-3 md:mb-0 z-30 whitespace-nowrap rounded-full bg-gradient-to-r from-[#e11d48] to-[#be123c] px-4 py-1.5 font-mono text-[10px] text-white font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(225,29,72,0.6)] border border-[#f43f5e]/80 opacity-100 md:opacity-0"
                    >
                      409 CONFLICT DEFLECTED
                    </div>

                    <div data-row-lock-shield className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-3xl border-2 border-[#f59e0b] bg-black/80 flex flex-col items-center justify-center shadow-2xl">
                      <Lock size={28} className="text-[#f59e0b] animate-pulse" />
                      <span className="font-mono text-[9px] text-[#f59e0b] mt-1 font-bold">ROW EXCLUSIVE</span>
                    </div>
                  </div>

                  {/* London Client Card */}
                  <div data-user-london className="rounded-2xl border border-[#e11d48]/40 bg-[#e11d48]/10 p-4 sm:p-6 font-mono text-xs w-full max-w-xs md:w-64 shadow-2xl">
                    <div className="flex items-center gap-2 text-[#f43f5e] font-bold text-sm mb-2">
                      <Users size={16} />
                      <span>USER_LONDON (TX#9842)</span>
                    </div>
                    <div className="text-white/60">Target: Seat A4 (VIP)</div>
                    <div className="text-[#f43f5e] font-semibold mt-2">409 CONFLICT (SEAT HELD)</div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 03: Cryptographic QR Gatekeeper & Turnstile        */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`cinemora-screen-pane${activePhaseIndex === 2 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                  {/* Holographic QR Ticket */}
                  <div data-qr-ticket className="relative rounded-2xl border border-white/20 bg-black/70 p-6 shadow-2xl flex flex-col items-center">
                    <div data-qr-laser className="cinemora-laser-scanner" />
                    <div className="p-3 bg-white rounded-xl shadow-inner">
                      <div className="w-32 h-32 bg-black flex flex-wrap p-1 gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-5 h-5 rounded-xs ${i % 2 === 0 || i === 7 ? "bg-white" : "bg-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#f59e0b] font-bold tracking-widest mt-3">
                      BK9X4M2QW7
                    </span>
                  </div>

                  {/* Turnstile Physical Gate Visualizer */}
                  <div className="flex flex-col items-center sm:items-start font-mono text-xs space-y-4">
                    <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                      <QrCode size={18} />
                      <span>OPTICAL TURNSTILE BARRIER 01</span>
                    </div>

                    <div className="w-56 h-8 bg-white/5 rounded-full overflow-hidden flex items-center px-2 border border-white/10">
                      <div data-turnstile-arm className="cinemora-turnstile-arm h-3 w-40 bg-[#10b981] rounded-full" />
                    </div>

                    <div data-admission-beacon className="flex items-center gap-2 rounded-xl border border-[#10b981]/40 bg-[#10b981]/20 px-4 py-2 text-[#10b981] font-bold">
                      <CheckCircle2 size={16} />
                      <span>ACCESS GRANTED: SCREEN 3 - SEAT A4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 04: Tiered Refund Engine & Wallet Reactor           */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`cinemora-screen-pane${activePhaseIndex === 3 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="relative w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 font-mono text-xs">
                  {/* Scrubber Gauge */}
                  <div className="rounded-2xl border border-white/10 bg-black/60 p-6 w-full sm:w-80 shadow-2xl">
                    <div className="text-white/40 mb-2">PROXIMITY HORIZON:</div>
                    <div className="relative h-2 w-full bg-white/10 rounded-full my-4 overflow-hidden">
                      <div data-scrubber-needle className="h-full w-8 bg-[#f59e0b] rounded-full shadow-[0_0_8px_#f59e0b]" />
                    </div>
                    <div className="flex justify-between text-[11px] text-white/50">
                      <span>48h (100%)</span>
                      <span>24h (75%)</span>
                      <span>2h (50%)</span>
                    </div>
                  </div>

                  {/* Wallet Credit Card */}
                  <div data-wallet-card className="rounded-2xl border border-[#f59e0b]/40 bg-gradient-to-br from-[#f59e0b]/15 to-transparent p-6 w-full sm:w-80 shadow-2xl relative">
                    <div className="flex items-center justify-between text-white/50 mb-2">
                      <span>CUSTOMER WALLET LEDGER</span>
                      <Wallet size={16} className="text-[#f59e0b]" />
                    </div>
                    <div data-wallet-balance className="text-3xl font-light text-[#f59e0b]">$145.00</div>

                    {/* Floating Money Particles */}
                    <div className="absolute right-6 top-4 flex flex-col gap-1">
                      <span data-money-particle className="text-sm font-bold text-[#10b981] opacity-0">+$25.00</span>
                      <span data-money-particle className="text-sm font-bold text-[#10b981] opacity-0">+$25.00</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-white/60">
                      STATUS: ATOMIC LEDGER SETTLEMENT COMMITTED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Deep Dive Interactive Laboratory ── */}
      <CinemoraCaseStudy project={project} embedded />
    </div>
  );
}
