import type { gsap } from "gsap";

/**
 * Story engine for the EazyShop cinematic scroll experience.
 * Owns three concerns:
 *   1. Chapter boundary resolution (pure math, no DOM).
 *   2. The chapter state machine (single owner of active-phase classes,
 *      ARIA state, and telemetry readouts).
 *   3. GSAP timeline scoring for the scrubbed transaction phases
 *      (terminal tilt, depth planes, laser ingress, lock pulse, receipt feed).
 */

export type EazyShopReadout = {
  id: string;
  phase: string;
  status: string;
  gateway: string;
};

type StoryStateTargets = {
  root: HTMLElement;
  chapters: HTMLElement[];
  links: HTMLAnchorElement[];
  planes: HTMLElement[];
  captions?: HTMLElement[];
  stageFigure: HTMLElement;
  progressLabel: HTMLElement;
  phaseLabel: HTMLElement;
  statusLabel: HTMLElement;
  gatewayLabel: HTMLElement;
  readouts: readonly EazyShopReadout[];
};

/** Resolve the last chapter whose reading boundary has been crossed. */
export function eazyshopChapterAtTime(offsets: readonly number[], time: number, readingOffset: number) {
  let index = 0;
  for (let next = 1; next < offsets.length; next++) {
    if (time < offsets[next] + readingOffset) break;
    index = next;
  }
  return index;
}

/** One owner for chapter classes and accessible state. */
export function createEazyShopStoryState(targets: StoryStateTargets) {
  let activeIndex = -1;
  let desktop = false;

  const syncMedia = () => {
    targets.planes.forEach((element, index) => {
      element.classList.toggle("is-active", index === activeIndex);
      if (desktop && index !== activeIndex) element.setAttribute("aria-hidden", "true");
      else element.removeAttribute("aria-hidden");
    });
    targets.captions?.forEach((element, index) => {
      element.classList.toggle("is-active", index === activeIndex);
    });
  };

  const activate = (index: number) => {
    const next = Number.isFinite(index) ? Math.max(0, Math.min(Math.floor(index), targets.chapters.length - 1)) : 0;
    if (next === activeIndex) return;
    activeIndex = next;

    targets.chapters.forEach((chapter, chapterIndex) => {
      chapter.classList.toggle("is-active", chapterIndex === next);
    });

    targets.links.forEach((link, linkIndex) => {
      link.classList.toggle("is-active", linkIndex === next);
      if (linkIndex === next) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });

    syncMedia();

    targets.progressLabel.textContent = `0${next + 1} / 0${targets.chapters.length}`;
    const readout = targets.readouts[next];
    if (readout) {
      targets.root.setAttribute("data-eazyshop-active", readout.id);
      targets.phaseLabel.textContent = readout.phase;
      targets.statusLabel.textContent = readout.status;
      targets.gatewayLabel.textContent = readout.gateway;
    }
  };

  const setDesktop = (enabled: boolean) => {
    desktop = enabled;
    if (enabled) targets.root.setAttribute("data-eazyshop-layout", "desktop");
    else targets.root.removeAttribute("data-eazyshop-layout");
    targets.stageFigure.hidden = !enabled;
    syncMedia();
  };

  activate(0);

  return {
    activate,
    setDesktop,
    dispose() {
      setDesktop(false);
      activeIndex = -1;
      activate(0);
      targets.root.removeAttribute("data-eazyshop-active");
    },
  };
}

export type EazyShopMotionTargets = {
  planes: gsap.TweenTarget[];
  progressFill: gsap.TweenTarget;
  railFill: gsap.TweenTarget;
  pipelineFill?: gsap.TweenTarget;
  terminal?: gsap.TweenTarget;
  scannerBeam?: gsap.TweenTarget;
  lockPulse?: gsap.TweenTarget;
  packet?: gsap.TweenTarget;
  receiptTape?: gsap.TweenTarget;
  stamp?: gsap.TweenTarget;
  ttlRing?: gsap.TweenTarget;
  hudChip?: gsap.TweenTarget;
  statusMeter?: gsap.TweenTarget;
};

/**
 * Scores the continuous GSAP timeline scrubbed by scroll.
 * Drives the 3D hardware-terminal tilt, depth-plane orbital travel,
 * laser scan sweeps across checkout captures, row-lock pulse rings,
 * webhook packet ingress, thermal receipt feed, and the PAID stamp slam.
 */
export function scoreEazyShopStory(
  timeline: gsap.core.Timeline,
  targets: EazyShopMotionTargets,
  chapterOffsets: readonly number[],
  viewportHeight: number,
  scrollDistance: number,
) {
  const duration = viewportHeight * 0.4;

  // 1. Progress rail + narrative spine + pipeline trace fill (full scrub)
  timeline
    .fromTo(targets.progressFill, { scaleX: 0 }, { scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false }, 0)
    .fromTo(targets.railFill, { scaleY: 0 }, { scaleY: 1, duration: scrollDistance, ease: "none", immediateRender: false }, 0);

  if (targets.pipelineFill) {
    timeline.fromTo(
      targets.pipelineFill,
      { scaleX: 0 },
      { scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false },
      0,
    );
  }

  // 2. Hardware terminal: subtle orbit tilt anchored to chapter crossings
  if (targets.terminal) {
    timeline.set(targets.terminal, { transformOrigin: "50% 46%", perspective: 900 }, 0);
    chapterOffsets.forEach((at, index) => {
      const tiltX = index % 2 === 0 ? 7 : -5;
      const tiltY = index % 2 === 0 ? -9 : 8;
      timeline.to(
        targets.terminal!,
        { rotationX: tiltX, rotationY: tiltY, z: index === chapterOffsets.length - 1 ? 24 : 0, duration, ease: "power2.inOut", immediateRender: false },
        at,
      );
      if (index === chapterOffsets.length - 1) {
        timeline.to(
          targets.terminal!,
          { rotationX: 0, rotationY: 0, z: 0, duration: duration * 0.6, ease: "power2.out", immediateRender: false },
          at + duration,
        );
      }
    });
  }

  // 3. Depth plane orbital transitions (enter from deep Z, exit into upper orbit)
  if (targets.planes.length) {
    timeline.set(targets.planes, { transformOrigin: "50% 50%" }, 0);
    timeline.set(targets.planes[0], {
      autoAlpha: 1,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      z: 0,
      yPercent: 0,
      immediateRender: true,
    }, 0);

    targets.planes.forEach((plane, index) => {
      const at = chapterOffsets[index] ?? 0;
      if (index > 0) {
        const enter = {
          autoAlpha: 0,
          scale: 0.9,
          rotationX: 10,
          rotationY: -7,
          z: -140,
          yPercent: 5,
        };
        const leave = {
          autoAlpha: 0,
          scale: 1.06,
          rotationX: -9,
          rotationY: 6,
          z: 70,
          yPercent: -5,
        };
        const active = {
          autoAlpha: 1,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          z: 0,
          yPercent: 0,
        };

        timeline
          .fromTo(targets.planes[index - 1], active, { ...leave, duration, ease: "power2.inOut", immediateRender: false }, at)
          .fromTo(plane, enter, { ...active, duration, ease: "power2.inOut", immediateRender: true }, at);
      }
      timeline.addLabel(`phase:${String(index + 1).padStart(2, "0")}`, index === 0 ? 0 : at + duration / 2);
    });
  }

  // 4. Laser scanner beam sweeping vertically across every capture swap
  if (targets.scannerBeam) {
    timeline.set(targets.scannerBeam, { autoAlpha: 0, top: "0%" }, 0);
    chapterOffsets.forEach((at) => {
      timeline
        .fromTo(
          targets.scannerBeam!,
          { autoAlpha: 0, top: "0%" },
          { autoAlpha: 1, top: "100%", duration: duration * 0.8, ease: "power1.inOut", immediateRender: false },
          at,
        )
        .to(targets.scannerBeam!, { autoAlpha: 0, duration: duration * 0.2, ease: "power1.out" }, at + duration * 0.8);
    });
  }

  // 5. Row-level lock pulse rings expanding on every boundary crossing
  if (targets.lockPulse) {
    timeline.set(targets.lockPulse, { autoAlpha: 0, scale: 0.4 }, 0);
    chapterOffsets.forEach((at, index) => {
      const isLockChapter = index === 1;
      timeline.fromTo(
        targets.lockPulse!,
        { autoAlpha: isLockChapter ? 1 : 0.75, scale: 0.4 },
        { autoAlpha: 0, scale: isLockChapter ? 2.2 : 1.8, duration: duration * (isLockChapter ? 0.9 : 0.65), ease: "power2.out", immediateRender: false },
        at,
      );
    });
  }

  // 6. Webhook packet travelling the ACID rail across transaction phases
  if (targets.packet) {
    const nodePositions = ["6.25%", "34.375%", "65.625%", "93.75%"];
    timeline.set(targets.packet, { autoAlpha: 1, left: nodePositions[0], scale: 1 }, 0);
    for (let i = 1; i < chapterOffsets.length; i++) {
      const at = chapterOffsets[i];
      const fromPos = nodePositions[i - 1];
      const toPos = nodePositions[i];
      timeline.fromTo(
        targets.packet,
        { left: fromPos, scale: 1, autoAlpha: 1 },
        { left: toPos, scale: 1.4, duration: duration * 0.8, ease: "power2.inOut", immediateRender: false },
        at,
      );
      timeline.to(
        targets.packet,
        { scale: 1, duration: duration * 0.2, ease: "power1.out", immediateRender: false },
        at + duration * 0.8,
      );
    }
  }

  // 7. Thermal receipt tape feeding out of the printer slot during chapter 04
  if (targets.receiptTape) {
    const finalAt = chapterOffsets[chapterOffsets.length - 1] ?? 0;
    timeline.set(targets.receiptTape, { yPercent: -102 }, 0);
    timeline.to(
      targets.receiptTape,
      { yPercent: 0, duration: duration * 1.15, ease: "power2.out", immediateRender: false },
      finalAt + duration * 0.1,
    );
  }

  // 8. "PAID & CAPTURED" cryptographic stamp slam at end of chapter 04
  if (targets.stamp) {
    const finalAt = chapterOffsets[chapterOffsets.length - 1] ?? 0;
    timeline.set(targets.stamp, { autoAlpha: 0, scale: 2.4, rotation: -18 }, 0);
    timeline.to(
      targets.stamp,
      { autoAlpha: 1, scale: 1, rotation: -6, duration: duration * 0.35, ease: "back.out(2)", immediateRender: false },
      finalAt + duration * 1.05,
    );
  }

  // 9. TTL reservation ring draining 120s -> 0 across chapter 02
  if (targets.ttlRing) {
    const lockAt = chapterOffsets[1] ?? 0;
    timeline.set(targets.ttlRing, { strokeDashoffset: 0 }, 0);
    timeline.to(
      targets.ttlRing,
      { strokeDashoffset: 176, duration: duration * 1.4, ease: "none", immediateRender: false },
      lockAt,
    );
  }

  // 10. HUD chip float-in + status meter brightness pop per phase
  if (targets.hudChip) {
    chapterOffsets.forEach((at) => {
      timeline.fromTo(
        targets.hudChip!,
        { autoAlpha: 0, yPercent: 18 },
        { autoAlpha: 1, yPercent: 0, duration: duration * 0.4, ease: "power2.out", immediateRender: false },
        at + duration * 0.3,
      );
    });
  }

  if (targets.statusMeter) {
    chapterOffsets.forEach((at) => {
      timeline.fromTo(
        targets.statusMeter!,
        { filter: "brightness(1.6)" },
        { filter: "brightness(1)", duration: duration * 0.45, ease: "power2.out", immediateRender: false },
        at,
      );
    });
  }

  return timeline;
}
