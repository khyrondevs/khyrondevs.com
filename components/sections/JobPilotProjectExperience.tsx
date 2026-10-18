"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  Check,
  Crosshair,
  Cpu,
  Layers,
  Lock,
  Radio,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  JOBPILOT_PHASES,
  jobpilotPhaseAtProgress,
  scoreJobpilotTheater,
} from "@/lib/jobpilot-story";
import JobPilotCaseStudy from "@/components/sections/JobPilotCaseStudy";

export default function JobPilotProjectExperience({
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

        if (!desktop) {
          // Mobile: simple interactive state with clean scroll reveals
          return;
        }

        // Desktop: Fullscreen Pinned Tactical Radar Theater
        const screens = gsap.utils.toArray<HTMLElement>("[data-theater-screen]", stage);
        const progressFill = stage.querySelector<HTMLElement>("[data-theater-progress]");
        const radarSweepRay = stage.querySelector<HTMLElement>("[data-radar-ray]");
        const radarBlips = gsap.utils.toArray<HTMLElement>("[data-radar-blip]", stage);
        const ingestBeams = gsap.utils.toArray<HTMLElement>("[data-ingest-beam]", stage);

        // Phase 2 targets
        const collisionCardLeft = stage.querySelector<HTMLElement>("[data-collision-left]");
        const collisionCardRight = stage.querySelector<HTMLElement>("[data-collision-right]");
        const collisionCardTop = stage.querySelector<HTMLElement>("[data-collision-top]");
        const collisionPulse = stage.querySelector<HTMLElement>("[data-collision-pulse]");
        const canonicalBadge = stage.querySelector<HTMLElement>("[data-canonical-badge]");

        // Phase 3 targets
        const laserFenceBeam = stage.querySelector<HTMLElement>("[data-laser-fence]");
        const seniorCard = stage.querySelector<HTMLElement>("[data-senior-card]");
        const fresherCard = stage.querySelector<HTMLElement>("[data-fresher-card]");
        const vectorMeterFill = stage.querySelector<HTMLElement>("[data-vector-meter-fill]");

        // Phase 4 targets
        const ssrfShield = stage.querySelector<HTMLElement>("[data-ssrf-shield]");
        const ssrfProbeBadges = gsap.utils.toArray<HTMLElement>("[data-ssrf-probe]", stage);
        const webhookBeam = stage.querySelector<HTMLElement>("[data-webhook-beam]");

        const scrollDistance = window.innerHeight * 2.8;

        const timeline = gsap.timeline({ paused: true });

        scoreJobpilotTheater(
          timeline,
          {
            progressFill: progressFill ?? undefined,
            radarSweepRay: radarSweepRay ?? undefined,
            radarBlips: radarBlips.length ? radarBlips : undefined,
            ingestBeams: ingestBeams.length ? ingestBeams : undefined,
            collisionCardLeft: collisionCardLeft ?? undefined,
            collisionCardRight: collisionCardRight ?? undefined,
            collisionCardTop: collisionCardTop ?? undefined,
            collisionPulse: collisionPulse ?? undefined,
            canonicalBadge: canonicalBadge ?? undefined,
            laserFenceBeam: laserFenceBeam ?? undefined,
            seniorCard: seniorCard ?? undefined,
            fresherCard: fresherCard ?? undefined,
            vectorMeterFill: vectorMeterFill ?? undefined,
            ssrfShield: ssrfShield ?? undefined,
            ssrfProbeBadges: ssrfProbeBadges.length ? ssrfProbeBadges : undefined,
            webhookBeam: webhookBeam ?? undefined,
            screens,
          },
          scrollDistance
        );

        const syncPhase = (self: ScrollTrigger) => {
          const phase = jobpilotPhaseAtProgress(self.progress);
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

  const activePhase = JOBPILOT_PHASES[activePhaseIndex] ?? JOBPILOT_PHASES[0];

  return (
    <div ref={root} id="jobpilot" className="jobpilot-experience">
      {/* ── Standard Showcase Header (Passed from page.tsx) ── */}
      <div className="jobpilot-project-card">{children}</div>

      {/* ── Bespoke Tactical Theater Experience ── */}
      <section className="jobpilot-theater-section" aria-label="JobPilot Autonomous Radar Theater">
        {/* Scroll Track container for Desktop Pinning */}
        <div ref={scrollTrack} className="jobpilot-scroll-track">
          {/* Pinned Panoramic Stage Shell */}
          <div ref={theaterStage} className="jobpilot-theater-stage">
            {/* 1. Tactical HUD Header */}
            <header className="jobpilot-hud-header">
              <div className="jobpilot-hud-left">
                <span className="jobpilot-radar-beacon" aria-hidden="true" />
                <div className="jobpilot-hud-title-wrap">
                  <span className="jobpilot-hud-label">AUTONOMOUS RECONNAISSANCE &amp; INGESTION RADAR</span>
                  <h2 className="jobpilot-hud-heading">JOBPILOT TACTICAL FLIGHT DECK</h2>
                </div>
              </div>

              {/* Mission Telemetry Stats */}
              <div className="jobpilot-hud-meta" aria-hidden="true">
                <div className="jobpilot-meta-chip">
                  <span className="jobpilot-meta-kicker">MISSION CLUSTER</span>
                  <strong className="jobpilot-meta-val text-sky-400">OCI AMPERE ARM64</strong>
                </div>
                <div className="jobpilot-meta-chip">
                  <span className="jobpilot-meta-kicker">SCRAPERS ACTIVE</span>
                  <strong className="jobpilot-meta-val text-lime-400">5 ATS PROVIDERS</strong>
                </div>
                <div className="jobpilot-meta-chip">
                  <span className="jobpilot-meta-kicker">STATUS</span>
                  <strong className="jobpilot-meta-val text-emerald-400">AUTONOMOUS DISPATCH</strong>
                </div>
              </div>
            </header>

            {/* 2. Mode Selector Navigation & Scrub Bar */}
            <nav className="jobpilot-mode-nav" aria-label="Operational Phase Selector">
              <div className="jobpilot-mode-tabs" role="tablist">
                {JOBPILOT_PHASES.map((phase, idx) => (
                  <button
                    key={phase.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activePhaseIndex}
                    className={`jobpilot-mode-tab${idx === activePhaseIndex ? " is-active" : ""}`}
                    onClick={() => {
                      if (typeof window !== "undefined" && scrollTrack.current) {
                        const targetY =
                          scrollTrack.current.offsetTop + (idx / 4) * window.innerHeight * 2.8;
                        window.scrollTo({ top: targetY, behavior: "smooth" });
                      }
                    }}
                  >
                    <span className="jobpilot-tab-num">{phase.number}</span>
                    <span className="jobpilot-tab-code">{phase.codename}</span>
                  </button>
                ))}
              </div>

              {/* Progress Scrub Track */}
              <div className="jobpilot-scrub-bar" aria-hidden="true">
                <span className="jobpilot-scrub-fill" data-theater-progress />
              </div>
            </nav>

            {/* 3. Central Panoramic Viewport */}
            <div className="jobpilot-viewport-housing">
              {/* Corner Tactical Brackets */}
              <span className="jobpilot-bracket top-left" aria-hidden="true" />
              <span className="jobpilot-bracket top-right" aria-hidden="true" />
              <span className="jobpilot-bracket bottom-left" aria-hidden="true" />
              <span className="jobpilot-bracket bottom-right" aria-hidden="true" />

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 01: Multi-Vector Recon Radar                       */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`jobpilot-screen-pane${activePhaseIndex === 0 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="jobpilot-radar-stage">
                  {/* Concentric Radar Grid & Rotating Beam */}
                  <div className="jobpilot-radar-grid" aria-hidden="true">
                    <svg className="jobpilot-radar-svg" viewBox="0 0 600 600">
                      <circle cx="300" cy="300" r="280" className="radar-ring r1" />
                      <circle cx="300" cy="300" r="210" className="radar-ring r2" />
                      <circle cx="300" cy="300" r="140" className="radar-ring r3" />
                      <circle cx="300" cy="300" r="70" className="radar-ring r4" />
                      <line x1="300" y1="20" x2="300" y2="580" className="radar-axis" />
                      <line x1="20" y1="300" x2="580" y2="300" className="radar-axis" />
                      {/* Rotating Sweep Beam */}
                      <g data-radar-ray style={{ transformOrigin: "300px 300px" }}>
                        <line x1="300" y1="300" x2="300" y2="20" className="radar-sweep-edge" />
                        <path d="M300 300 L230 35 A280 280 0 0 1 300 20 Z" className="radar-sweep-wedge" />
                      </g>
                    </svg>

                    {/* Radar Target Acquisition Blips */}
                    <div className="jobpilot-blip b1" data-radar-blip>
                      <Crosshair size={14} className="text-sky-400" />
                      <span>STRIPE // BACKEND SWE</span>
                    </div>
                    <div className="jobpilot-blip b2" data-radar-blip>
                      <Crosshair size={14} className="text-lime-400" />
                      <span>LINEAR // FULLSTACK</span>
                    </div>
                    <div className="jobpilot-blip b3" data-radar-blip>
                      <Crosshair size={14} className="text-amber-400" />
                      <span>VERCEL // DEV EXPERT</span>
                    </div>
                  </div>

                  {/* 4 Provider Crawler Nodes */}
                  <div className="jobpilot-crawler-stations" aria-hidden="true">
                    <div className="jobpilot-station top-left">
                      <Radio size={14} className="text-sky-400" />
                      <div>
                        <strong>LINKEDIN WORKER</strong>
                        <span>Port 443 • Headless Pool</span>
                      </div>
                      <span className="station-beam" data-ingest-beam />
                    </div>

                    <div className="jobpilot-station top-right">
                      <Layers size={14} className="text-lime-400" />
                      <div>
                        <strong>GREENHOUSE ATS</strong>
                        <span>Direct REST • 18ms latency</span>
                      </div>
                      <span className="station-beam" data-ingest-beam />
                    </div>

                    <div className="jobpilot-station bottom-left">
                      <Terminal size={14} className="text-amber-400" />
                      <div>
                        <strong>INDEED CRAWLER</strong>
                        <span>Rotating Residential IPs</span>
                      </div>
                      <span className="station-beam" data-ingest-beam />
                    </div>

                    <div className="jobpilot-station bottom-right">
                      <Cpu size={14} className="text-emerald-400" />
                      <div>
                        <strong>REDIS INGEST STREAM</strong>
                        <span>180 listings/min buffer</span>
                      </div>
                      <span className="station-beam" data-ingest-beam />
                    </div>
                  </div>

                  {/* High-Res Application Capture Backdrop */}
                  <div className="jobpilot-screen-backdrop">
                    <Image
                      src="/images/jobpilot/Today.png"
                      alt="JobPilot autonomous daily opportunity radar"
                      fill
                      className="object-cover opacity-35 mix-blend-luminosity"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 02: Tri-Vector Canonical Collision Reactor         */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`jobpilot-screen-pane${activePhaseIndex === 1 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="jobpilot-collider-stage">
                  {/* Central SHA-256 Collision Core */}
                  <div className="jobpilot-collision-core">
                    <div className="jobpilot-core-ring" aria-hidden="true">
                      <span className="jobpilot-ring-pulse" data-collision-pulse />
                      <Lock size={28} className="text-lime-400" />
                      <span className="jobpilot-hash-formula">sha256(corp:title:loc)</span>
                    </div>

                    {/* Incoming Duplicate Card Left */}
                    <div className="jobpilot-collision-card card-left" data-collision-left>
                      <span className="card-tag bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        LINKEDIN ATS
                      </span>
                      <strong>Stripe</strong>
                      <p>Software Engineer</p>
                      <span className="card-loc">San Francisco, CA</span>
                    </div>

                    {/* Incoming Duplicate Card Right */}
                    <div className="jobpilot-collision-card card-right" data-collision-right>
                      <span className="card-tag bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        INDEED CRAWL
                      </span>
                      <strong>Stripe, Inc.</strong>
                      <p>Software Engineer - 2026 Batch</p>
                      <span className="card-loc">SF / Remote</span>
                    </div>

                    {/* Incoming Duplicate Card Top */}
                    <div className="jobpilot-collision-card card-top" data-collision-top>
                      <span className="card-tag bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        GREENHOUSE API
                      </span>
                      <strong>STRIPE</strong>
                      <p>SWE I</p>
                      <span className="card-loc">San Francisco</span>
                    </div>

                    {/* Canonical Master Badge (Emerged after collision) */}
                    <div className="jobpilot-canonical-master" data-canonical-badge>
                      <div className="master-header">
                        <Check size={16} className="text-lime-400" />
                        <span>CANONICAL MASTER LOCKED</span>
                        <span className="master-badge">94.8% PURGED</span>
                      </div>
                      <h4>Stripe &bull; Software Engineer</h4>
                      <p className="master-hash">sha256: 7f3e8b419c2... &bull; SF, CA</p>
                      <div className="master-lineage">
                        <span>3 SOURCES ATTACHED</span>
                        <span>0 REDUNDANT DISPATCHES</span>
                      </div>
                    </div>
                  </div>

                  {/* Backdrop */}
                  <div className="jobpilot-screen-backdrop">
                    <Image
                      src="/images/jobpilot/Jobs.png"
                      alt="JobPilot canonical deduplicated master records table"
                      fill
                      className="object-cover opacity-35 mix-blend-luminosity"
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 03: Fresher Laser Defense Perimeter                 */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`jobpilot-screen-pane${activePhaseIndex === 2 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="jobpilot-defense-stage">
                  {/* High-Frequency Laser Security Fence */}
                  <div className="jobpilot-laser-gate" data-laser-fence aria-hidden="true">
                    <span className="laser-beam" />
                    <div className="laser-rule-hud">
                      <ShieldCheck size={14} className="text-sky-400" />
                      <span>EXPERIENCE FENCE: YOE &lt;= 1.5 &amp; NOT SENIOR</span>
                    </div>
                  </div>

                  {/* Senior Card (Deflected & Vaporized) */}
                  <div className="jobpilot-sieve-card card-senior" data-senior-card>
                    <span className="sieve-status alert">DEFLECTED &bull; 8 YOE</span>
                    <strong>Staff Systems Architect</strong>
                    <p>Requires 8+ YOE, distributed systems leadership.</p>
                    <span className="sieve-action text-red-400">PURGED FROM FRESHER FEED</span>
                  </div>

                  {/* Fresher Card (Cleared & Locked to Cosine Vector) */}
                  <div className="jobpilot-sieve-card card-fresher" data-fresher-card>
                    <span className="sieve-status cleared">CLEARED &bull; 0-1 YOE</span>
                    <strong>Junior Frontend Engineer</strong>
                    <p>React, TypeScript, Next.js. Freshers welcome.</p>
                    <div className="vector-score-cluster">
                      <div className="vector-score-header">
                        <span>COSINE SIMILARITY</span>
                        <strong className="text-lime-400">94.2% MATCH</strong>
                      </div>
                      <div className="vector-score-track">
                        <span className="vector-score-fill" data-vector-meter-fill />
                      </div>
                    </div>
                  </div>

                  {/* Backdrop */}
                  <div className="jobpilot-screen-backdrop">
                    <Image
                      src="/images/jobpilot/Search_Vectors.png"
                      alt="JobPilot semantic vector cosine distance matching"
                      fill
                      className="object-cover opacity-35 mix-blend-luminosity"
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SCREEN 04: Zero-Trust SSRF Gateway & OCI Launchpad         */}
              {/* ────────────────────────────────────────────────────────── */}
              <div
                className={`jobpilot-screen-pane${activePhaseIndex === 3 ? " is-visible" : ""}`}
                data-theater-screen
              >
                <div className="jobpilot-launchpad-stage">
                  {/* SSRF Cryptographic Shield Pod */}
                  <div className="jobpilot-security-shield" data-ssrf-shield>
                    <div className="shield-header">
                      <ShieldCheck size={20} className="text-sky-400" />
                      <div>
                        <h3>ZERO-TRUST SSRF FIREWALL</h3>
                        <p>Pre-flight socket IP validation before redirect fetch</p>
                      </div>
                    </div>

                    <div className="ssrf-probes-grid">
                      <div className="ssrf-probe-card" data-ssrf-probe>
                        <Check size={14} className="text-lime-400" />
                        <div>
                          <strong>DNS RESOLVED</strong>
                          <span>Public routable IP (104.18.22.42)</span>
                        </div>
                      </div>

                      <div className="ssrf-probe-card" data-ssrf-probe>
                        <Check size={14} className="text-lime-400" />
                        <div>
                          <strong>PRIVATE CIDR BLOCKED</strong>
                          <span>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</span>
                        </div>
                      </div>

                      <div className="ssrf-probe-card" data-ssrf-probe>
                        <Check size={14} className="text-lime-400" />
                        <div>
                          <strong>CLOUD METADATA DENIED</strong>
                          <span>169.254.169.254 AWS/OCI fail-closed</span>
                        </div>
                      </div>
                    </div>

                    {/* Outbound Webhook Beam */}
                    <div className="ssrf-dispatch-beam" aria-hidden="true">
                      <span className="beam-track" />
                      <span className="beam-laser" data-webhook-beam />
                      <div className="beam-target">
                        <Zap size={14} className="text-lime-400" />
                        <span>n8n DISPATCH &bull; T+0.04s</span>
                      </div>
                    </div>
                  </div>

                  {/* Backdrop */}
                  <div className="jobpilot-screen-backdrop">
                    <Image
                      src="/images/jobpilot/System_Stats.png"
                      alt="JobPilot production cluster monitoring on Oracle Cloud ARM64"
                      fill
                      className="object-cover opacity-35 mix-blend-luminosity"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Bottom Tactical Console Footer */}
            <footer className="jobpilot-console-footer">
              <div className="jobpilot-footer-telemetry">
                <div className="telemetry-block">
                  <span className="telemetry-label">{activePhase.telemetryLeft.label}</span>
                  <strong className="telemetry-value">{activePhase.telemetryLeft.value}</strong>
                </div>
                <div className="telemetry-block">
                  <span className="telemetry-label">{activePhase.telemetryRight.label}</span>
                  <strong className="telemetry-value">{activePhase.telemetryRight.value}</strong>
                </div>
              </div>

              <div className="jobpilot-footer-nav">
                <a href="#jobpilot-case-study" className="jobpilot-dive-link">
                  <span>Explore Deep-Dive Architecture &amp; Labs</span>
                  <ArrowDown size={14} aria-hidden="true" />
                </a>
              </div>
            </footer>
          </div>
        </div>
      </section>

      {/* ── Embedded Deep-Dive Case Study Section ── */}
      <JobPilotCaseStudy project={project} embedded />
    </div>
  );
}
