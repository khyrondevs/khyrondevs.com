import type { gsap } from "gsap";

type StoryStateTargets = {
  root: HTMLElement;
  chapters: HTMLElement[];
  links: HTMLAnchorElement[];
  media: HTMLElement[];
  captions: HTMLElement[];
  stageFigure: HTMLElement;
  progressLabel: HTMLElement;
  phaseLabel: HTMLElement;
  ruleLabel: HTMLElement;
  valuationLabel: HTMLElement;
  readouts: readonly {
    id: string;
    phase: string;
    decisionRule: string;
    valuation: string;
  }[];
};

/** Resolve the last chapter whose reading boundary has been crossed. */
export function housepriceChapterAtTime(offsets: readonly number[], time: number, readingOffset: number) {
  let index = 0;
  for (let next = 1; next < offsets.length; next++) {
    if (time < offsets[next] + readingOffset) break;
    index = next;
  }
  return index;
}

/** One owner for chapter classes and accessible state. */
export function createHousePriceStoryState(targets: StoryStateTargets) {
  let activeIndex = -1;
  let desktop = false;

  const syncMedia = () => {
    [targets.media, targets.captions].forEach((elements) => {
      elements.forEach((element, index) => {
        element.classList.toggle("is-active", index === activeIndex);
        if (desktop && index !== activeIndex) element.setAttribute("aria-hidden", "true");
        else element.removeAttribute("aria-hidden");
      });
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
      targets.root.setAttribute("data-houseprice-active", readout.id);
      targets.phaseLabel.textContent = readout.phase;
      targets.ruleLabel.textContent = readout.decisionRule;
      targets.valuationLabel.textContent = readout.valuation;
    }
  };

  const setDesktop = (enabled: boolean) => {
    desktop = enabled;
    if (enabled) targets.root.setAttribute("data-houseprice-layout", "desktop");
    else targets.root.removeAttribute("data-houseprice-layout");
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
      targets.root.removeAttribute("data-houseprice-active");
    },
  };
}

export type HousePriceMotionTargets = {
  planes: gsap.TweenTarget[];
  progressFill: gsap.TweenTarget;
  railFill: gsap.TweenTarget;
  runtimeFill?: gsap.TweenTarget;
  reticle?: gsap.TweenTarget;
  laserScan?: gsap.TweenTarget;
  treeBranch?: gsap.TweenTarget;
  r2Meter?: gsap.TweenTarget;
  stageSweep?: gsap.TweenTarget;
  valuationCounter?: gsap.TweenTarget;
};

/**
 * Builds the continuous GSAP animation timeline scrubbed by scroll.
 * Drives 3D plane orbital perspective travel, laser scan sweeps,
 * decision tree vector growth, radar rotation, and telemetry meter fills.
 */
export function scoreHousePriceStory(
  timeline: gsap.core.Timeline,
  targets: HousePriceMotionTargets,
  chapterOffsets: readonly number[],
  viewportHeight: number,
  scrollDistance: number,
) {
  const duration = viewportHeight * 0.38;

  // 1. Progress Rail, Needle Travel, and Runtime Trace Scan Fill
  timeline
    .fromTo(targets.progressFill, { scaleX: 0 }, { scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false }, 0)
    .fromTo(targets.railFill, { scaleY: 0 }, { scaleY: 1, duration: scrollDistance, ease: "none", immediateRender: false }, 0);

  if (targets.runtimeFill) {
    timeline.fromTo(
      targets.runtimeFill,
      { scaleX: 0 },
      { scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false },
      0,
    );
  }

  // 2. Continuous Radar Reticle Rotation (360 degrees across full story scrub)
  if (targets.reticle) {
    timeline.fromTo(
      targets.reticle,
      { rotation: 0 },
      { rotation: 360, duration: scrollDistance, ease: "none", immediateRender: true },
      0,
    );
  }

  // 3. R² Accuracy Meter Curve Fill (climbs up to R² 0.8062)
  if (targets.r2Meter) {
    timeline.fromTo(
      targets.r2Meter,
      { strokeDashoffset: 283 },
      { strokeDashoffset: 55, duration: scrollDistance, ease: "power1.inOut", immediateRender: true },
      0,
    );
  }

  // 4. SVG Decision Tree Split Vector Path Growth
  if (targets.treeBranch) {
    timeline.fromTo(
      targets.treeBranch,
      { strokeDashoffset: 400 },
      { strokeDashoffset: 0, duration: scrollDistance, ease: "none", immediateRender: true },
      0,
    );
  }

  // 5. 3D Orbital Perspective Plane Transitions
  if (targets.planes.length) {
    timeline.set(targets.planes, { transformOrigin: "50% 50%" }, 0);
    // Initialize first plane
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
        // High-end 3D spatial entry & exit:
        // Enter: floats in from deeper Z with slight tilt
        // Leave: arcs forward and fades into upper orbit
        const enter = {
          autoAlpha: 0,
          scale: 0.92,
          rotationX: 8,
          rotationY: -6,
          z: -100,
          yPercent: 4,
        };
        const leave = {
          autoAlpha: 0,
          scale: 1.05,
          rotationX: -8,
          rotationY: 6,
          z: 60,
          yPercent: -4,
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
      timeline.addLabel(`chapter:${String(index + 1).padStart(2, "0")}`, index === 0 ? 0 : at + duration / 2);
    });
  }

  // 6. Laser Scan Sweep (sweeps vertically across active screen on every phase transition)
  if (targets.laserScan) {
    timeline.set(targets.laserScan, { autoAlpha: 0, yPercent: -120 }, 0);
    chapterOffsets.forEach((at) => {
      timeline
        .fromTo(
          targets.laserScan!,
          { autoAlpha: 0, yPercent: -120 },
          { autoAlpha: 1, yPercent: 450, duration: duration * 0.75, ease: "power1.inOut", immediateRender: false },
          at,
        )
        .to(targets.laserScan!, { autoAlpha: 0, duration: duration * 0.25, ease: "power1.out" }, at + duration * 0.75);
    });
  }

  // 7. Anamorphic Stage Sweep Beam across boundary crossings
  if (targets.stageSweep) {
    timeline.set(targets.stageSweep, { autoAlpha: 0, xPercent: -140 }, 0);
    chapterOffsets.forEach((at) => {
      timeline
        .fromTo(
          targets.stageSweep!,
          { autoAlpha: 0, xPercent: -140 },
          { autoAlpha: 0.9, xPercent: 550, duration: duration * 0.68, ease: "power2.inOut", immediateRender: false },
          at,
        )
        .to(targets.stageSweep!, { autoAlpha: 0, duration: duration * 0.32, ease: "power1.out" }, at + duration * 0.68);
    });
  }

  // 8. Valuation Counter / HUD Telemetry Pulse
  if (targets.valuationCounter) {
    chapterOffsets.forEach((at) => {
      timeline
        .fromTo(
          targets.valuationCounter!,
          { scale: 0.95, filter: "brightness(1.35)" },
          { scale: 1, filter: "brightness(1)", duration: duration * 0.45, ease: "power2.out", immediateRender: false },
          at,
        );
    });
  }

  return timeline;
}
