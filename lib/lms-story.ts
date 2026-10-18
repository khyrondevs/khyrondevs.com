import type { gsap } from "gsap";

/**
 * Story engine for Online LMS's Pinned Panoramic Cyber-Academy Theater.
 * 100% bespoke scroll-driven motion choreography:
 *   - Phase 01: 3-Tier concentric orbital rings expansion, SimpleJWT bearer descent & endpoint illumination.
 *   - Phase 02: Role elevation to Instructor & object-level tenant deflection shield (403 Forbidden).
 *   - Phase 03: Sequential curriculum waterfall ladder & liquid progress bar filling to 100% certificate unlock.
 *   - Phase 04: ReportLab vector certificate compilation, dynamic typography auto-scaling & animated cursive signature tracing.
 */

export type LmsPhaseReadout = {
  id: string;
  number: string;
  codename: string;
  title: string;
  status: string;
  telemetryLeft: { label: string; value: string };
  telemetryRight: { label: string; value: string };
};

export type LmsMotionTargets = {
  progressFill?: gsap.TweenTarget;
  ringStudent?: gsap.TweenTarget;
  ringInstructor?: gsap.TweenTarget;
  ringAdmin?: gsap.TweenTarget;
  coreShield?: gsap.TweenTarget;
  jwtTokenPacket?: gsap.TweenTarget;
  // Phase 02: Object-level Tenant Gate
  instructorCard?: gsap.TweenTarget;
  peerIntruderCard?: gsap.TweenTarget;
  tenantShield?: gsap.TweenTarget;
  forbiddenDeflect?: gsap.TweenTarget;
  // Phase 03: Curriculum Progression Waterfall
  moduleCards?: gsap.TweenTarget[];
  liquidProgressBar?: gsap.TweenTarget;
  unlockBadge?: gsap.TweenTarget;
  // Phase 04: ReportLab Vector Studio
  certCanvas?: gsap.TweenTarget;
  signatureTracePath?: gsap.TweenTarget;
  qrSealBadge?: gsap.TweenTarget;
  bufferCylinder?: gsap.TweenTarget;
  // Screen Stage Panes
  screens: gsap.TweenTarget[];
};

export const LMS_PHASES: readonly LmsPhaseReadout[] = [
  {
    id: "rbac",
    number: "01",
    codename: "3-TIER ORBITAL RBAC SHIELD",
    title: "Concentric Permission Boundaries & SimpleJWT",
    status: "ORBITAL_SHIELD_ACTIVE",
    telemetryLeft: { label: "AUTH SCHEME", value: "SimpleJWT Bearer" },
    telemetryRight: { label: "ROLES", value: "Student · Instructor · Admin" },
  },
  {
    id: "tenant",
    number: "02",
    codename: "TENANT ISOLATION & OBJECT GATE",
    title: "Zero Privilege Escalation & DRF Scoping",
    status: "FORBIDDEN_403_DEFLECTED",
    telemetryLeft: { label: "PERMISSION", value: "IsInstructorOrReadOnly" },
    telemetryRight: { label: "QUERYSET", value: "filter(instructor=user)" },
  },
  {
    id: "waterfall",
    number: "03",
    codename: "CURRICULUM PROGRESSION WATERFALL",
    title: "Sequential Module Milestones & 100% Gate",
    status: "MILESTONE_100_UNLOCKED",
    telemetryLeft: { label: "TRACKING", value: "LessonCompletion rows" },
    telemetryRight: { label: "GATE THRESHOLD", value: "100% Complete Required" },
  },
  {
    id: "reportlab",
    number: "04",
    codename: "REPORTLAB VECTOR COMPILER STUDIO",
    title: "In-Memory BytesIO & Cursive Signature Trace",
    status: "CERTIFICATE_RENDERED_42MS",
    telemetryLeft: { label: "RENDER ENGINE", value: "ReportLab 5.0 Canvas" },
    telemetryRight: { label: "BUFFER", value: "0 Bytes Disk Footprint" },
  },
] as const;

export function lmsPhaseAtProgress(progress: number): number {
  if (progress < 0.25) return 0;
  if (progress < 0.5) return 1;
  if (progress < 0.75) return 2;
  return 3;
}

export function scoreLmsTheater(
  timeline: gsap.core.Timeline,
  targets: LmsMotionTargets,
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
  // PHASE 01: 3-Tier Orbital RBAC Hologram (0 -> q1)
  // ─────────────────────────────────────────────────────────────
  if (targets.ringStudent && targets.ringInstructor && targets.ringAdmin) {
    timeline
      .fromTo(targets.ringStudent, { opacity: 0 }, { opacity: 1, duration: q1 * 0.45, ease: "power2.out" }, 0)
      .fromTo(targets.ringInstructor, { opacity: 0 }, { opacity: 1, duration: q1 * 0.45, ease: "power2.out" }, q1 * 0.1)
      .fromTo(targets.ringAdmin, { opacity: 0 }, { opacity: 1, duration: q1 * 0.45, ease: "power2.out" }, q1 * 0.2);
  }

  if (targets.coreShield) {
    timeline.fromTo(
      targets.coreShield,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: q1 * 0.4, ease: "back.out(2)" },
      q1 * 0.15
    );
  }

  if (targets.jwtTokenPacket) {
    timeline.fromTo(
      targets.jwtTokenPacket,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: q1 * 0.35, ease: "power2.out" },
      q1 * 0.3
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 02: Object-Level Tenant Gate & Deflection (q1 -> q2)
  // ─────────────────────────────────────────────────────────────
  if (targets.instructorCard && targets.peerIntruderCard) {
    timeline.set(targets.instructorCard, { xPercent: -80, opacity: 0 }, 0);
    timeline.set(targets.peerIntruderCard, { xPercent: 80, opacity: 0 }, 0);
    if (targets.forbiddenDeflect) {
      timeline.set(targets.forbiddenDeflect, { scale: 0, opacity: 0 }, 0);
    }

    const gateEntry = q1 + (q2 - q1) * 0.1;
    const gateClash = q1 + (q2 - q1) * 0.5;

    timeline
      .to(targets.instructorCard, { xPercent: 0, opacity: 1, duration: (q2 - q1) * 0.3, ease: "power2.out" }, gateEntry)
      .to(targets.peerIntruderCard, { xPercent: 0, opacity: 1, duration: (q2 - q1) * 0.3, ease: "power2.out" }, gateEntry);

    if (targets.tenantShield) {
      timeline.fromTo(
        targets.tenantShield,
        { scale: 0.8, opacity: 0 },
        { scale: 1.1, opacity: 1, duration: (q2 - q1) * 0.2, ease: "back.out(2)" },
        gateClash
      );
    }

    if (targets.forbiddenDeflect) {
      timeline.fromTo(
        targets.forbiddenDeflect,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: (q2 - q1) * 0.2, ease: "back.out(1.7)" },
        gateClash + (q2 - q1) * 0.05
      );
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 03: Curriculum Waterfall & 100% Gate (q2 -> q3)
  // ─────────────────────────────────────────────────────────────
  if (targets.moduleCards && targets.moduleCards.length) {
    targets.moduleCards.forEach((card, idx) => {
      const delay = q2 + ((idx * (q3 - q2) * 0.6) / targets.moduleCards!.length);
      timeline.fromTo(
        card,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: (q3 - q2) * 0.25, ease: "power2.out" },
        delay
      );
    });
  }

  if (targets.liquidProgressBar) {
    const liquidStart = q2 + (q3 - q2) * 0.15;
    timeline.fromTo(
      targets.liquidProgressBar,
      { scaleX: 0 },
      { scaleX: 1, duration: (q3 - q2) * 0.6, ease: "power1.inOut" },
      liquidStart
    );
  }

  if (targets.unlockBadge) {
    const unlockPoint = q2 + (q3 - q2) * 0.75;
    timeline.fromTo(
      targets.unlockBadge,
      { scale: 0, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: (q3 - q2) * 0.2, ease: "back.out(2.5)" },
      unlockPoint
    );
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE 04: ReportLab Vector Studio & Signature Trace (q3 -> end)
  // ─────────────────────────────────────────────────────────────
  const p4Len = scrollDistance - q3;

  if (targets.certCanvas) {
    timeline.fromTo(
      targets.certCanvas,
      { scale: 0.88, opacity: 0 },
      { scale: 1, opacity: 1, duration: p4Len * 0.35, ease: "power2.out" },
      q3 + p4Len * 0.05
    );
  }

  if (targets.signatureTracePath) {
    const sigStart = q3 + p4Len * 0.35;
    timeline.fromTo(
      targets.signatureTracePath,
      { strokeDashoffset: 400 },
      { strokeDashoffset: 0, duration: p4Len * 0.45, ease: "power1.inOut" },
      sigStart
    );
  }

  if (targets.qrSealBadge) {
    const sealPoint = q3 + p4Len * 0.7;
    timeline.fromTo(
      targets.qrSealBadge,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: p4Len * 0.2, ease: "back.out(2)" },
      sealPoint
    );
  }

  if (targets.bufferCylinder) {
    timeline.fromTo(
      targets.bufferCylinder,
      { opacity: 0.3, y: 15 },
      { opacity: 1, y: 0, duration: p4Len * 0.3, ease: "power2.out" },
      q3 + p4Len * 0.1
    );
  }
}
