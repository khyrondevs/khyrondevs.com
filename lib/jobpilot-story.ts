import type { gsap } from "gsap";

/**
 * Story engine for the JobPilot Autonomous Panoramic Radar & Mission Theater.
 * 100% bespoke motion choreography:
 *   - Phase 01: Multi-source ingestion radar sweep & convergent signal beams.
 *   - Phase 02: 3-vector duplicate collision, SHA-256 shockwave & canonical badge emergence.
 *   - Phase 03: High-frequency laser security fence: senior deflection vs. fresher vector lock.
 *   - Phase 04: Zero-trust SSRF cryptographic lockdown & n8n webhook telemetry beam launch.
 */

export type JobpilotPhaseReadout = {
  id: string;
  number: string;
  codename: string;
  title: string;
  status: string;
  telemetryLeft: { label: string; value: string };
  telemetryRight: { label: string; value: string };
};

export type JobpilotMotionTargets = {
  progressFill?: gsap.TweenTarget;
  radarSweepRay?: gsap.TweenTarget;
  radarBlips?: gsap.TweenTarget[];
  ingestBeams?: gsap.TweenTarget[];
  // Phase 02: Collision Reactor
  collisionCardLeft?: gsap.TweenTarget;
  collisionCardRight?: gsap.TweenTarget;
  collisionCardTop?: gsap.TweenTarget;
  collisionPulse?: gsap.TweenTarget;
  canonicalBadge?: gsap.TweenTarget;
  // Phase 03: Fresher Laser Defense Fence
  laserFenceBeam?: gsap.TweenTarget;
  seniorCard?: gsap.TweenTarget;
  fresherCard?: gsap.TweenTarget;
  vectorMeterFill?: gsap.TweenTarget;
  // Phase 04: SSRF Lockdown & Cloud Launchpad
  ssrfShield?: gsap.TweenTarget;
  ssrfProbeBadges?: gsap.TweenTarget[];
  webhookBeam?: gsap.TweenTarget;
  // Screen Stage Panes
  screens: gsap.TweenTarget[];
};

export const JOBPILOT_PHASES: readonly JobpilotPhaseReadout[] = [
  {
    id: "radar",
    number: "01",
    codename: "MULTI-VECTOR RECON RADAR",
    title: "Parallel ATS Ingestion & Signal Intercept",
    status: "SCANNING_5_PROVIDERS",
    telemetryLeft: { label: "BUFFER", value: "Redis Stream (180/min)" },
    telemetryRight: { label: "ATS BOARDS", value: "LinkedIn • Greenhouse • Indeed" },
  },
  {
    id: "collider",
    number: "02",
    codename: "CANONICAL COLLISION REACTOR",
    title: "Tri-Vector Collision & SHA-256 Deduplication",
    status: "COLLISION_RESOLVED",
    telemetryLeft: { label: "PURGE RATE", value: "94.8% Redundant Drop" },
    telemetryRight: { label: "HASH ALGO", value: "sha256(corp:title:loc)" },
  },
  {
    id: "defense",
    number: "03",
    codename: "FRESHER DEFENSE PERIMETER",
    title: "Laser Seniority Fence & Cosine Vector Matcher",
    status: "FRESHER_LOCKED_0.94",
    telemetryLeft: { label: "YOE FENCE", value: "Strict <= 1.5 YOE" },
    telemetryRight: { label: "COSINE SIM", value: "94.2% Profile Intent" },
  },
  {
    id: "launchpad",
    number: "04",
    codename: "SSRF GATEWAY & CLOUD RUNTIME",
    title: "Fail-Closed Security & n8n Instant Dispatch",
    status: "AUTONOMOUS_DELIVERY",
    telemetryLeft: { label: "INFRA", value: "Oracle Cloud ARM64" },
    telemetryRight: { label: "DISPATCH", value: "n8n Webhook (T+0.04s)" },
  },
] as const;

/** Resolves current active phase from normalized timeline progress [0, 1] */
export function jobpilotPhaseAtProgress(progress: number): number {
  if (progress < 0.25) return 0;
  if (progress < 0.5) return 1;
  if (progress < 0.75) return 2;
  return 3;
}

/**
 * Scores the continuous GSAP timeline for the panoramic theater.
 * Each 25% segment of scroll corresponds to an active operational mode.
 */
export function scoreJobpilotTheater(
  timeline: gsap.core.Timeline,
  targets: JobpilotMotionTargets,
  scrollDistance: number
) {
  // 1. Progress track scrub
  if (targets.progressFill) {
    timeline.fromTo(
      targets.progressFill,
      { scaleX: 0 },
      { scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false },
      0
    );
  }

  // 2. Continuous 360-degree tactical radar sweep ray across entire duration
  if (targets.radarSweepRay) {
    timeline.fromTo(
      targets.radarSweepRay,
      { rotation: 0 },
      { rotation: 1080, duration: scrollDistance, ease: "none", immediateRender: true },
      0
    );
  }

  // 3. Screen cross-transitions across 4 operational quarters
  const q1 = scrollDistance * 0.25;
  const q2 = scrollDistance * 0.5;
  const q3 = scrollDistance * 0.75;
  const dur = scrollDistance * 0.08;

  if (targets.screens.length >= 4) {
    // Initial states: Screen 0 active, 1, 2, 3 hidden
    timeline.set(targets.screens[0], { autoAlpha: 1, scale: 1, y: 0 }, 0);
    for (let i = 1; i < 4; i++) {
      timeline.set(targets.screens[i], { autoAlpha: 0, scale: 0.94, y: 24 }, 0);
    }

    // Phase 01 -> Phase 02 transition at q1
    timeline
      .to(targets.screens[0], { autoAlpha: 0, scale: 1.05, y: -20, duration: dur, ease: "power2.inOut" }, q1 - dur / 2)
      .to(targets.screens[1], { autoAlpha: 1, scale: 1, y: 0, duration: dur, ease: "power2.out" }, q1 - dur / 2);

    // Phase 02 -> Phase 03 transition at q2
    timeline
      .to(targets.screens[1], { autoAlpha: 0, scale: 1.05, y: -20, duration: dur, ease: "power2.inOut" }, q2 - dur / 2)
      .to(targets.screens[2], { autoAlpha: 1, scale: 1, y: 0, duration: dur, ease: "power2.out" }, q2 - dur / 2);

    // Phase 03 -> Phase 04 transition at q3
    timeline
      .to(targets.screens[2], { autoAlpha: 0, scale: 1.05, y: -20, duration: dur, ease: "power2.inOut" }, q3 - dur / 2)
      .to(targets.screens[3], { autoAlpha: 1, scale: 1, y: 0, duration: dur, ease: "power2.out" }, q3 - dur / 2);
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 01: Multi-Vector Ingestion Radar (0 -> q1)
  // ─────────────────────────────────────────────────────────────
  if (targets.ingestBeams && targets.ingestBeams.length) {
    targets.ingestBeams.forEach((beam, idx) => {
      const delay = (idx * q1) / (targets.ingestBeams!.length + 1);
      timeline.fromTo(
        beam,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.8, duration: q1 * 0.4, ease: "power2.inOut", yoyo: true, repeat: 1 },
        delay
      );
    });
  }

  if (targets.radarBlips && targets.radarBlips.length) {
    targets.radarBlips.forEach((blip, idx) => {
      timeline.fromTo(
        blip,
        { scale: 0, opacity: 0 },
        { scale: 1.4, opacity: 1, duration: q1 * 0.25, ease: "back.out(2)" },
        (idx * q1) / 4
      );
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 02: Canonical Deduplication Collision Reactor (q1 -> q2)
  // ─────────────────────────────────────────────────────────────
  if (targets.collisionCardLeft && targets.collisionCardRight && targets.collisionCardTop) {
    // 3 Duplicate cards start outward
    timeline.set(targets.collisionCardLeft, { xPercent: -120, yPercent: 0, opacity: 0, scale: 0.85 }, 0);
    timeline.set(targets.collisionCardRight, { xPercent: 120, yPercent: 0, opacity: 0, scale: 0.85 }, 0);
    timeline.set(targets.collisionCardTop, { xPercent: 0, yPercent: -120, opacity: 0, scale: 0.85 }, 0);

    const collisionEntry = q1 + (q2 - q1) * 0.15;
    const collisionPoint = q1 + (q2 - q1) * 0.5;

    // Fly in towards center
    timeline
      .to(targets.collisionCardLeft, { xPercent: -20, opacity: 0.9, scale: 0.95, duration: (q2 - q1) * 0.35, ease: "power1.out" }, collisionEntry)
      .to(targets.collisionCardRight, { xPercent: 20, opacity: 0.9, scale: 0.95, duration: (q2 - q1) * 0.35, ease: "power1.out" }, collisionEntry)
      .to(targets.collisionCardTop, { yPercent: -20, opacity: 0.9, scale: 0.95, duration: (q2 - q1) * 0.35, ease: "power1.out" }, collisionEntry);

    // Slam together at center
    timeline
      .to(targets.collisionCardLeft, { xPercent: 0, opacity: 0, scale: 0.5, duration: (q2 - q1) * 0.15, ease: "power3.in" }, collisionPoint)
      .to(targets.collisionCardRight, { xPercent: 0, opacity: 0, scale: 0.5, duration: (q2 - q1) * 0.15, ease: "power3.in" }, collisionPoint)
      .to(targets.collisionCardTop, { yPercent: 0, opacity: 0, scale: 0.5, duration: (q2 - q1) * 0.15, ease: "power3.in" }, collisionPoint);

    // Shockwave pulse explodes outward
    if (targets.collisionPulse) {
      timeline.fromTo(
        targets.collisionPulse,
        { scale: 0.1, opacity: 0 },
        { scale: 2.2, opacity: 1, duration: (q2 - q1) * 0.12, ease: "power1.out" },
        collisionPoint
      );
      timeline.to(
        targets.collisionPulse,
        { opacity: 0, scale: 3.0, duration: (q2 - q1) * 0.15, ease: "power2.in" },
        collisionPoint + (q2 - q1) * 0.12
      );
    }

    // Canonical master record badge pops out
    if (targets.canonicalBadge) {
      timeline.fromTo(
        targets.canonicalBadge,
        { scale: 0.3, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: (q2 - q1) * 0.25, ease: "back.out(2)" },
        collisionPoint + (q2 - q1) * 0.08
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 03: Fresher Laser Defense Fence (q2 -> q3)
  // ─────────────────────────────────────────────────────────────
  if (targets.laserFenceBeam) {
    timeline.fromTo(
      targets.laserFenceBeam,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: (q3 - q2) * 0.2, ease: "power2.out" },
      q2 + (q3 - q2) * 0.05
    );
  }

  if (targets.seniorCard && targets.fresherCard) {
    // Both cards enter from left
    const fenceMid = q2 + (q3 - q2) * 0.45;

    // Senior card approaches laser fence -> ZAP! Deflected and vaporized
    timeline.fromTo(
      targets.seniorCard,
      { xPercent: -100, opacity: 0 },
      { xPercent: -15, opacity: 1, duration: (q3 - q2) * 0.35, ease: "power1.out" },
      q2 + (q3 - q2) * 0.1
    );

    timeline.to(
      targets.seniorCard,
      {
        xPercent: -35,
        yPercent: -80,
        rotation: -22,
        opacity: 0,
        filter: "hue-rotate(180deg) brightness(2)",
        duration: (q3 - q2) * 0.25,
        ease: "power2.in",
      },
      fenceMid
    );

    // Fresher card approaches laser fence -> passes cleanly through and locks in
    timeline.fromTo(
      targets.fresherCard,
      { xPercent: -100, opacity: 0 },
      { xPercent: -10, opacity: 1, duration: (q3 - q2) * 0.35, ease: "power1.out" },
      q2 + (q3 - q2) * 0.15
    );

    timeline.to(
      targets.fresherCard,
      {
        xPercent: 55,
        scale: 1.05,
        duration: (q3 - q2) * 0.3,
        ease: "back.out(1.5)",
      },
      fenceMid + (q3 - q2) * 0.05
    );

    // Vector Similarity meter fills up to 94.2%
    if (targets.vectorMeterFill) {
      timeline.fromTo(
        targets.vectorMeterFill,
        { scaleX: 0 },
        { scaleX: 0.942, duration: (q3 - q2) * 0.25, ease: "power2.out" },
        fenceMid + (q3 - q2) * 0.12
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 04: SSRF Lockdown & Cloud Launchpad (q3 -> scrollDistance)
  // ─────────────────────────────────────────────────────────────
  if (targets.ssrfShield) {
    timeline.fromTo(
      targets.ssrfShield,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: (scrollDistance - q3) * 0.25, ease: "power2.out" },
      q3 + (scrollDistance - q3) * 0.05
    );
  }

  if (targets.ssrfProbeBadges && targets.ssrfProbeBadges.length) {
    targets.ssrfProbeBadges.forEach((badge, idx) => {
      timeline.fromTo(
        badge,
        { opacity: 0.3, scale: 0.9 },
        { opacity: 1, scale: 1, duration: (scrollDistance - q3) * 0.15, ease: "back.out(1.8)" },
        q3 + (scrollDistance - q3) * (0.2 + idx * 0.12)
      );
    });
  }

  if (targets.webhookBeam) {
    const launchPoint = q3 + (scrollDistance - q3) * 0.58;
    timeline.fromTo(
      targets.webhookBeam,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: (scrollDistance - q3) * 0.3, ease: "power3.out" },
      launchPoint
    );
  }
}
