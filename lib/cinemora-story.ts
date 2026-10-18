import type { gsap } from "gsap";

/**
 * Story engine for Cinemora's Pinned Real-Time Concurrency Panoramic Theater.
 * 100% bespoke scroll-driven motion choreography:
 *   - Phase 01: Projector ray sweep, curved IMAX canvas power-on & WebSocket seat wave fan-out.
 *   - Phase 02: Dual-user concurrency duel (Tokyo vs. London) & PostgreSQL row-lock deflection (409 Conflict).
 *   - Phase 03: Cryptographic QR gatekeeper laser scanner & physical turnstile unlatching (-75deg).
 *   - Phase 04: Tiered cancellation timeline scrubber, dynamic refund gauge & wallet credit particle burst.
 */

export type CinemoraPhaseReadout = {
  id: string;
  number: string;
  codename: string;
  title: string;
  status: string;
  telemetryLeft: { label: string; value: string };
  telemetryRight: { label: string; value: string };
};

export type CinemoraMotionTargets = {
  progressFill?: gsap.TweenTarget;
  projectorRay?: gsap.TweenTarget;
  imaxScreen?: gsap.TweenTarget;
  seatRows?: gsap.TweenTarget[];
  wsBeams?: gsap.TweenTarget[];
  // Phase 02: Concurrency Duel
  userCardTokyo?: gsap.TweenTarget;
  userCardLondon?: gsap.TweenTarget;
  laserBeamTokyo?: gsap.TweenTarget;
  laserBeamLondon?: gsap.TweenTarget;
  rowLockShield?: gsap.TweenTarget;
  conflictClash?: gsap.TweenTarget;
  // Phase 03: QR Gatekeeper
  qrTicket?: gsap.TweenTarget;
  qrScanLaser?: gsap.TweenTarget;
  turnstileArm?: gsap.TweenTarget;
  admissionBeacon?: gsap.TweenTarget;
  // Phase 04: Tiered Refund & Wallet
  timeScrubberNeedle?: gsap.TweenTarget;
  refundGaugeDial?: gsap.TweenTarget;
  moneyBurstParticles?: gsap.TweenTarget[];
  walletCard?: gsap.TweenTarget;
  // Screen Stage Panes
  screens: gsap.TweenTarget[];
};

export const CINEMORA_PHASES: readonly CinemoraPhaseReadout[] = [
  {
    id: "fanout",
    number: "01",
    codename: "WEBSOCKET DERIVED FAN-OUT",
    title: "Zero-Drift Daphne WebSockets & IMAX Grid",
    status: "SYNC_BROADCAST_ACTIVE",
    telemetryLeft: { label: "PROTOCOL", value: "Channels 4.3 (Daphne)" },
    telemetryRight: { label: "LAYER", value: "Redis Pub/Sub (Zero Drift)" },
  },
  {
    id: "acid",
    number: "02",
    codename: "ACID CONCURRENCY DUEL",
    title: "SELECT FOR UPDATE Row-Exclusive Lock",
    status: "COLLISION_DEFLECTED_409",
    telemetryLeft: { label: "ISOLATION", value: "PostgreSQL Row-Exclusive" },
    telemetryRight: { label: "HOLD TTL", value: "15-Minute Auto Sweep" },
  },
  {
    id: "turnstile",
    number: "03",
    codename: "CRYPTOGRAPHIC QR GATEHOUSE",
    title: "Unguessable Gatekeeper & Physical Turnstile",
    status: "ADMITTED_TURNSTILE_01",
    telemetryLeft: { label: "ENTROPY", value: "secrets.token_urlsafe(32)" },
    telemetryRight: { label: "GATE HIT", value: "<5ms Indexed Single-Use" },
  },
  {
    id: "refund",
    number: "04",
    codename: "TIERED REFUND & WALLET REACTOR",
    title: "Automated Proximity Ledger Settlement",
    status: "WALLET_SETTLED_INSTANT",
    telemetryLeft: { label: "HORIZON", value: ">48h: 100% | >24h: 75% | >2h: 50%" },
    telemetryRight: { label: "SETTLEMENT", value: "Atomic Ledger Credit" },
  },
] as const;

export function cinemoraPhaseAtProgress(progress: number): number {
  if (progress < 0.25) return 0;
  if (progress < 0.5) return 1;
  if (progress < 0.75) return 2;
  return 3;
}

export function scoreCinemoraTheater(
  timeline: gsap.core.Timeline,
  targets: CinemoraMotionTargets,
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

  // 2. Quarter markers
  const q1 = scrollDistance * 0.25;
  const q2 = scrollDistance * 0.5;
  const q3 = scrollDistance * 0.75;
  const dur = scrollDistance * 0.08;

  // 3. Screen cross-fade transitions
  if (targets.screens.length >= 4) {
    timeline.set(targets.screens[0], { autoAlpha: 1, scale: 1, y: 0 }, 0);
    for (let i = 1; i < 4; i++) {
      timeline.set(targets.screens[i], { autoAlpha: 0, scale: 0.94, y: 24 }, 0);
    }

    // Phase 1 -> 2
    timeline
      .to(targets.screens[0], { autoAlpha: 0, scale: 1.05, y: -20, duration: dur, ease: "power2.inOut" }, q1 - dur / 2)
      .to(targets.screens[1], { autoAlpha: 1, scale: 1, y: 0, duration: dur, ease: "power2.out" }, q1 - dur / 2);

    // Phase 2 -> 3
    timeline
      .to(targets.screens[1], { autoAlpha: 0, scale: 1.05, y: -20, duration: dur, ease: "power2.inOut" }, q2 - dur / 2)
      .to(targets.screens[2], { autoAlpha: 1, scale: 1, y: 0, duration: dur, ease: "power2.out" }, q2 - dur / 2);

    // Phase 3 -> 4
    timeline
      .to(targets.screens[2], { autoAlpha: 0, scale: 1.05, y: -20, duration: dur, ease: "power2.inOut" }, q3 - dur / 2)
      .to(targets.screens[3], { autoAlpha: 1, scale: 1, y: 0, duration: dur, ease: "power2.out" }, q3 - dur / 2);
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 01: Projector Ray & WebSocket Seat Wave (0 -> q1)
  // ─────────────────────────────────────────────────────────────
  if (targets.projectorRay) {
    timeline.fromTo(
      targets.projectorRay,
      { opacity: 0, scaleY: 0 },
      { opacity: 0.8, scaleY: 1, duration: q1 * 0.5, ease: "power2.out" },
      0
    );
  }

  if (targets.imaxScreen) {
    timeline.fromTo(
      targets.imaxScreen,
      { opacity: 0.2, scale: 0.92 },
      { opacity: 1, scale: 1, duration: q1 * 0.6, ease: "power2.out" },
      0
    );
  }

  if (targets.seatRows && targets.seatRows.length) {
    targets.seatRows.forEach((row, idx) => {
      timeline.fromTo(
        row,
        { opacity: 0.3, y: 15 },
        { opacity: 1, y: 0, duration: q1 * 0.4, ease: "back.out(1.5)" },
        (idx * q1 * 0.35) / targets.seatRows!.length
      );
    });
  }

  if (targets.wsBeams && targets.wsBeams.length) {
    targets.wsBeams.forEach((beam, idx) => {
      timeline.fromTo(
        beam,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.9, duration: q1 * 0.35, ease: "power2.inOut", yoyo: true, repeat: 1 },
        (idx * q1) / (targets.wsBeams!.length + 1)
      );
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 02: ACID Concurrency Duel & 409 Collision (q1 -> q2)
  // ─────────────────────────────────────────────────────────────
  if (targets.userCardTokyo && targets.userCardLondon) {
    timeline.set(targets.userCardTokyo, { xPercent: -120, opacity: 0 }, 0);
    timeline.set(targets.userCardLondon, { xPercent: 120, opacity: 0 }, 0);
    if (targets.conflictClash) {
      timeline.set(targets.conflictClash, { scale: 0, opacity: 0 }, 0);
    }

    const duelEntry = q1 + (q2 - q1) * 0.1;
    const duelClash = q1 + (q2 - q1) * 0.5;

    // Users fly in
    timeline
      .to(targets.userCardTokyo, { xPercent: 0, opacity: 1, duration: (q2 - q1) * 0.3, ease: "power2.out" }, duelEntry)
      .to(targets.userCardLondon, { xPercent: 0, opacity: 1, duration: (q2 - q1) * 0.3, ease: "power2.out" }, duelEntry);

    // Laser rays shoot towards Seat A4
    if (targets.laserBeamTokyo && targets.laserBeamLondon) {
      timeline.fromTo(
        targets.laserBeamTokyo,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: (q2 - q1) * 0.25, ease: "power3.in" },
        duelEntry + (q2 - q1) * 0.15
      );
      timeline.fromTo(
        targets.laserBeamLondon,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: (q2 - q1) * 0.25, ease: "power3.in" },
        duelEntry + (q2 - q1) * 0.15
      );
    }

    // Row Lock Shield activates
    if (targets.rowLockShield) {
      timeline.fromTo(
        targets.rowLockShield,
        { scale: 0.7, opacity: 0 },
        { scale: 1.1, opacity: 1, duration: (q2 - q1) * 0.2, ease: "back.out(2)" },
        duelClash
      );
    }

    // London beam deflects with 409 Conflict flash
    if (targets.conflictClash) {
      timeline.fromTo(
        targets.conflictClash,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: (q2 - q1) * 0.2, ease: "back.out(1.7)" },
        duelClash + (q2 - q1) * 0.05
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 03: Cryptographic QR Gatekeeper & Turnstile (q2 -> q3)
  // ─────────────────────────────────────────────────────────────
  if (targets.qrTicket) {
    timeline.set(targets.qrTicket, { scale: 0.85, opacity: 0 }, 0);
    const qrEntry = q2 + (q3 - q2) * 0.1;
    timeline.to(targets.qrTicket, { scale: 1, opacity: 1, duration: (q3 - q2) * 0.35, ease: "power2.out" }, qrEntry);
  }

  if (targets.qrScanLaser) {
    const laserStart = q2 + (q3 - q2) * 0.2;
    timeline.fromTo(
      targets.qrScanLaser,
      { yPercent: -100, opacity: 0 },
      { yPercent: 120, opacity: 1, duration: (q3 - q2) * 0.45, ease: "power1.inOut", repeat: 1, yoyo: true },
      laserStart
    );
  }

  if (targets.turnstileArm) {
    const turnstileOpenPoint = q2 + (q3 - q2) * 0.55;
    timeline.fromTo(
      targets.turnstileArm,
      { rotation: 0 },
      { rotation: -75, duration: (q3 - q2) * 0.3, ease: "power2.out" },
      turnstileOpenPoint
    );
  }

  if (targets.admissionBeacon) {
    const beaconPoint = q2 + (q3 - q2) * 0.6;
    timeline.fromTo(
      targets.admissionBeacon,
      { scale: 0, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: (q3 - q2) * 0.25, ease: "back.out(2)" },
      beaconPoint
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 04: Tiered Refund Engine & Wallet Credit (q3 -> end)
  // ─────────────────────────────────────────────────────────────
  if (targets.timeScrubberNeedle) {
    const p4Len = scrollDistance - q3;
    timeline.fromTo(
      targets.timeScrubberNeedle,
      { xPercent: 0 },
      { xPercent: 280, duration: p4Len * 0.6, ease: "power1.inOut" },
      q3 + p4Len * 0.1
    );
  }

  if (targets.refundGaugeDial) {
    const p4Len = scrollDistance - q3;
    timeline.fromTo(
      targets.refundGaugeDial,
      { rotation: 0 },
      { rotation: 270, duration: p4Len * 0.6, ease: "power2.out" },
      q3 + p4Len * 0.1
    );
  }

  if (targets.moneyBurstParticles && targets.moneyBurstParticles.length) {
    const burstStart = q3 + (scrollDistance - q3) * 0.5;
    targets.moneyBurstParticles.forEach((particle, idx) => {
      timeline.fromTo(
        particle,
        { y: 0, opacity: 0, scale: 0.5 },
        { y: -35 - idx * 10, opacity: 1, scale: 1.2, duration: (scrollDistance - q3) * 0.35, ease: "power2.out" },
        burstStart + (idx * (scrollDistance - q3) * 0.05)
      );
    });
  }

  if (targets.walletCard) {
    const walletPoint = q3 + (scrollDistance - q3) * 0.45;
    timeline.fromTo(
      targets.walletCard,
      { scale: 0.95 },
      { scale: 1.05, duration: (scrollDistance - q3) * 0.3, ease: "back.out(2)" },
      walletPoint
    );
  }
}
