import type { gsap } from "gsap";

type StoryStateTargets = {
  root: HTMLElement;
  chapters: HTMLElement[];
  links: HTMLAnchorElement[];
  media: HTMLElement[];
  captions: HTMLElement[];
  inlineFigures: HTMLElement[];
  stageFigure: HTMLElement;
  progressLabel: HTMLElement;
  commandLabel: HTMLElement;
  boundaryLabel: HTMLElement;
  readouts: readonly { id: string; command: string; boundary: string }[];
};

/** Resolve the last chapter whose reading boundary has been crossed. Actual
 * chapter offsets, rather than equal progress buckets, also work after resize. */
export function jobpilotChapterAtTime(offsets: readonly number[], time: number, readingOffset: number) {
  let index = 0;
  for (let next = 1; next < offsets.length; next++) {
    if (time < offsets[next] + readingOffset) break;
    index = next;
  }
  return index;
}

/** One owner for chapter classes and accessible state. Hidden desktop replicas
 * are never used as the mobile, reduced-motion or server-rendered fallback. */
export function createJobpilotStoryState(targets: StoryStateTargets) {
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
    targets.progressLabel.textContent = `${String(next + 1).padStart(2, "0")} / ${String(targets.chapters.length).padStart(2, "0")}`;
    const readout = targets.readouts[next];
    if (readout) {
      targets.root.setAttribute("data-jobpilot-active", readout.id);
      targets.commandLabel.textContent = readout.command;
      targets.boundaryLabel.textContent = readout.boundary;
    }
  };

  const setDesktop = (enabled: boolean) => {
    desktop = enabled;
    if (enabled) targets.root.setAttribute("data-jobpilot-layout", "desktop");
    else targets.root.removeAttribute("data-jobpilot-layout");
    targets.stageFigure.hidden = !enabled;
    targets.inlineFigures.forEach((figure) => { figure.hidden = enabled; });
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
      targets.root.removeAttribute("data-jobpilot-active");
    },
  };
}

/** Ambient loops have a separate pause control from the user-driven scroll
 * score. No ticker or React render is needed; CSS only runs while in view. */
export function createJobpilotAmbientState(targets: { root: HTMLElement; toggle: HTMLButtonElement; label: HTMLElement }) {
  let enabled = false;
  let visible = false;
  let documentVisible = true;
  let paused = false;

  const sync = () => {
    targets.toggle.hidden = !enabled;
    targets.toggle.setAttribute("aria-pressed", String(paused));
    const label = paused ? "Resume ambient motion" : "Pause ambient motion";
    targets.toggle.setAttribute("aria-label", label);
    targets.label.textContent = paused ? "Resume ambient" : "Pause ambient";
    if (enabled) {
      targets.root.setAttribute("data-jobpilot-motion", "enabled");
      targets.root.setAttribute("data-jobpilot-ambient", visible && documentVisible && !paused ? "running" : "paused");
    } else {
      targets.root.removeAttribute("data-jobpilot-motion");
      targets.root.removeAttribute("data-jobpilot-ambient");
    }
  };

  sync();
  return {
    setEnabled(value: boolean) { enabled = value; sync(); },
    setVisible(value: boolean) { visible = value; sync(); },
    setDocumentVisible(value: boolean) { documentVisible = value; sync(); },
    togglePause() { paused = !paused; sync(); },
    dispose() { enabled = false; paused = false; sync(); },
  };
}

type StoryMotionTargets = {
  planes: gsap.TweenTarget[];
  progressFill: gsap.TweenTarget;
  railFill: gsap.TweenTarget;
  orbit?: gsap.TweenTarget;
  depthPlanes?: gsap.TweenTarget[];
  aperture?: gsap.TweenTarget;
  runtimeFill?: gsap.TweenTarget;
  stageSweep?: gsap.TweenTarget;
};

/** Route whole screenshot planes, never images or captions. The bolder .78
 * handoff scale, 7.5% lateral travel and 5deg tilt still fit inside the frame;
 * the deliberately smaller vertical travel protects the wide screenshot's
 * corners at every interpolated position. Holds trace a shallow inward arc.
 * Explicit starts keep arbitrary/reverse seeks and chapter readouts aligned. */
export function scoreJobpilotStory(
  timeline: gsap.core.Timeline,
  targets: StoryMotionTargets,
  chapterOffsets: readonly number[],
  viewportHeight: number,
  scrollDistance: number,
) {
  const full = { autoAlpha: 1, scale: 1, xPercent: 0, yPercent: 0, rotation: 0 };
  const duration = viewportHeight * .33;

  timeline
    .fromTo(targets.progressFill, { scaleX: 0 }, { scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false }, 0)
    .fromTo(targets.railFill, { scaleY: 0 }, { scaleY: 1, duration: scrollDistance, ease: "none", immediateRender: false }, 0);
  if (targets.runtimeFill) {
    timeline.fromTo(targets.runtimeFill, { scaleX: 0 }, {
      scaleX: 1, duration: scrollDistance, ease: "none", immediateRender: false,
    }, 0);
  }

  if (targets.orbit) {
    timeline.fromTo(targets.orbit, { rotation: -45 }, { rotation: 315, duration: scrollDistance, ease: "none", immediateRender: true }, 0);
  }
  targets.depthPlanes?.forEach((plane) => {
    timeline.set(plane, { scale: 1, xPercent: 0, yPercent: 0, rotation: 0 }, 0);
  });
  if (targets.aperture) {
    // The clip belongs only to the decorative circuit grid behind the planes.
    timeline.fromTo(targets.aperture, { clipPath: "inset(0 100% 0 0)" }, {
      clipPath: "inset(0 0% 0 0)", duration: scrollDistance, ease: "none", immediateRender: true,
    }, 0);
  }

  if (targets.planes.length) {
    timeline.set(targets.planes, { transformOrigin: "50% 50%" }, 0).set(targets.planes[0], { ...full, immediateRender: true }, 0);
    targets.planes.forEach((plane, index) => {
      const at = chapterOffsets[index] ?? 0;
      if (index > 0) {
        const enter = { autoAlpha: 0, scale: 0.985, yPercent: 1.5, xPercent: 0, rotation: 0 };
        const leave = { autoAlpha: 0, scale: 1.015, yPercent: -1.5, xPercent: 0, rotation: 0 };
        timeline
          .fromTo(targets.planes[index - 1], full, { ...leave, duration, ease: "none", immediateRender: false }, at)
          .fromTo(plane, enter, { ...full, duration, ease: "none", immediateRender: true }, at);
      }
      timeline.addLabel(`chapter:${String(index + 1).padStart(2, "0")}`, index === 0 ? 0 : at + duration / 2);
    });
  }
  if (targets.stageSweep) {
    timeline.set(targets.stageSweep, { autoAlpha: 0, xPercent: -130 }, 0);
    chapterOffsets.forEach((at) => {
      timeline.fromTo(targets.stageSweep!, { autoAlpha: 0, xPercent: -130 }, {
        autoAlpha: 1, xPercent: 650, duration: duration * .72, ease: "power2.inOut", immediateRender: false,
      }, at).to(targets.stageSweep!, { autoAlpha: 0, duration: duration * .28, ease: "power1.out" }, at + duration * .72);
    });
  }
  return timeline;
}
