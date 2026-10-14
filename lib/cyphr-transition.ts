import type { gsap } from "gsap";

export const CYPHR_PORTAL_QUERY = "(min-width: 1100px) and (min-height: 740px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
export const CYPHR_STAGE_QUERY = "(min-width: 1080px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";

export function canPinCyphr(viewportHeight: number, cardHeight: number) {
  return Number.isFinite(viewportHeight) && Number.isFinite(cardHeight)
    && cardHeight > 0 && cardHeight <= viewportHeight - 120;
}

type PortalTargets = { shell: gsap.TweenTarget; cover: gsap.TweenTarget; front: gsap.TweenTarget; title: gsap.TweenTarget; visual: gsap.TweenTarget };

/** Cover is fully opaque before the original card starts fading. This invariant
 * applies at every timeline position, including reverse/fast scroll seeks. */
export function scoreCyphrTransition(timeline: gsap.core.Timeline, targets: PortalTargets) {
  return timeline
    .addLabel("source", 0)
    .to(targets.shell, { scale: 1.015, duration: .45, ease: "power2.inOut" }, 0)
    .to(targets.cover, { opacity: 1, duration: .3, ease: "none" }, .15)
    .to(targets.front, { opacity: 0, duration: .25, ease: "none" }, .45)
    .addLabel("context", .45)
    .from(targets.title, { scale: .78, rotation: -3, transformOrigin: "0% 50%", duration: .6, ease: "power3.out" }, .15)
    .from(targets.visual, { rotationY: -18, rotationZ: 5, scale: .8, transformPerspective: 1100, duration: .65, ease: "power3.inOut" }, .2)
    .to(targets.shell, { scale: 1, duration: .2, ease: "power2.out" }, .8);
}

/** Map actual reading positions to a five-shot score, not equal scroll buckets.
 * The last shot holds; native chapter anchors and reverse seeks use the same clock. */
export function cyphrPhaseAtPosition(offsets: readonly number[], position: number) {
  if (!offsets.length || !Number.isFinite(position)) return 0;
  const at = Math.max(0, position);
  for (let index = 0; index < offsets.length - 1; index++) {
    const next = offsets[index + 1];
    if (at < next) return index + Math.max(0, Math.min(1, (at - offsets[index]) / Math.max(1, next - offsets[index])));
  }
  return offsets.length - 1;
}

const INLINE_MOVIE_RANGES = [[0, 1], [1, 2], [2, 3], [2.5, 3.4], [3, 4]] as const;

/** Each native-flow figure plays its own chapter's passage through the score.
 * Context overlaps retrieval/model assembly; the final shot starts BEFORE the
 * answer and citation reveal, rather than seeking the already-complete phase 4. */
export function cyphrInlinePhaseAtProgress(chapter: number, progress: number) {
  const index = Math.max(0, Math.min(4, Math.floor(Number.isFinite(chapter) ? chapter : 0)));
  const [from, to] = INLINE_MOVIE_RANGES[index];
  const at = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  return from + (to - from) * at;
}

type MovieTargets = {
  pages: gsap.TweenTarget[];
  chunks: gsap.TweenTarget[];
  tokens: gsap.TweenTarget[];
  scope: gsap.TweenTarget;
  beam: gsap.TweenTarget;
  answer: gsap.TweenTarget;
  citation: gsap.TweenTarget;
  progress?: gsap.TweenTarget;
};

/** A single persistent provenance object becomes an answer. Nothing in the
 * readable article is translated, masked or hidden by this score. Transforms
 * belong to these outer planes; CSS ambient movement belongs to their children. */
export function scoreCyphrDocumentMovie(timeline: gsap.core.Timeline, targets: MovieTargets) {
  timeline.addLabel("data", 0).addLabel("api", 1).addLabel("retrieval", 2).addLabel("llm", 3).addLabel("interface", 4);
  targets.pages.forEach((page, index) => {
    timeline.fromTo(page,
      { x: index * 8, y: index * -9, rotation: index * -5, scale: 1, opacity: 1 },
      { x: -80 + index * 14, y: -40 + index * 10, rotation: -12 + index * 6, scale: .7, duration: 1, ease: "power2.inOut" }, 0)
      .to(page, { x: -108 + index * 9, y: -82 + index * 7, scale: .5, opacity: .5, duration: 1, ease: "power2.inOut" }, 2);
  });
  targets.chunks.forEach((chunk, index) => {
    timeline.fromTo(chunk,
      { x: 0, y: index * 23, rotation: 0, scale: .7, opacity: 0 },
      { x: 90 + (index % 2) * 22, y: -75 + index * 48, rotation: index % 2 ? 5 : -4, scale: 1, opacity: 1, duration: .63, ease: "power2.inOut" }, .2 + index * .055)
      .to(chunk, { x: -10 + (index % 2) * 120, y: -72 + Math.floor(index / 2) * 98, rotation: 0, scale: .82, duration: 1, ease: "power2.inOut" }, 1)
      .to(chunk, { x: index === 1 ? 4 : -95 + index * 58, y: index === 1 ? -4 : -92 + index * 35, scale: index === 1 ? 1.08 : .6, opacity: index === 1 ? 1 : .25, duration: 1, ease: "power2.inOut" }, 2)
      .to(chunk, { x: -112 + index * 12, y: 70 + index * 9, scale: .48, opacity: .5, duration: .85, ease: "power2.inOut" }, 3);
  });
  timeline.fromTo(targets.scope, { scale: .6, rotation: -90, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .85, ease: "power2.inOut" }, .15)
    .to(targets.scope, { scale: 1.12, rotation: 90, duration: 1, ease: "none" }, 1)
    .to(targets.scope, { scale: .75, rotation: 180, opacity: .3, duration: 1, ease: "power2.inOut" }, 2)
    .fromTo(targets.beam, { scaleX: 0, rotation: -28, opacity: 0 }, { scaleX: 1, rotation: -28, opacity: 1, duration: .65, ease: "power2.inOut" }, 1.2)
    .to(targets.beam, { rotation: 14, duration: 1, ease: "power2.inOut" }, 2)
    .to(targets.beam, { scaleX: .5, opacity: .2, duration: 1, ease: "power2.inOut" }, 3);
  targets.tokens.forEach((token, index) => {
    const angle = index / targets.tokens.length * Math.PI * 2;
    timeline.fromTo(token,
      { x: Math.cos(angle) * 125, y: Math.sin(angle) * 105, scale: .5, opacity: 0 },
      { x: Math.cos(angle) * 105, y: Math.sin(angle) * 85, scale: 1, opacity: 1, duration: .5, ease: "power2.out" }, 1.5 + index * .04)
      // Finish the stagger before context assembly. Overlapping transforms on
      // one token otherwise depend on whether a local clock arrived forwards or backwards.
      .to(token, { x: -60 + index * 24, y: 35 + index % 2 * 18, scale: .8, duration: .8, ease: "power2.inOut" }, 2.2)
      .to(token, { x: -58 + index % 3 * 58, y: -33 + Math.floor(index / 3) * 38, scale: .75, opacity: .25, duration: 1, ease: "power2.inOut" }, 3);
  });
  timeline.fromTo(targets.answer, { scale: .65, rotationY: 24, rotationZ: -5, opacity: 0 }, { scale: 1, rotationY: 0, rotationZ: 0, opacity: 1, duration: .9, ease: "power2.inOut" }, 3)
    .fromTo(targets.citation, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .8, ease: "none" }, 3.2);
  // Inline figures own a local 0→1 trace, independent of the full movie clock.
  if (targets.progress) timeline.fromTo(targets.progress, { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "none" }, 0);
  return timeline;
}

type ChapterTargets = { root: HTMLElement; chapters: HTMLElement[]; links: HTMLElement[]; readout: HTMLElement; phaseLabels: HTMLElement[] };

export function createCyphrChapterState({ root, chapters, links, readout, phaseLabels }: ChapterTargets) {
  let current = -1;
  const activate = (phase: number) => {
    const next = Math.min(chapters.length - 1, Math.max(0, Math.floor(Number.isFinite(phase) ? phase : 0)));
    if (next === current) return;
    current = next;
    root.setAttribute("data-cyphr-chapter", String(next));
    chapters.forEach((chapter, index) => chapter.classList.toggle("is-active", index === next));
    links.forEach((link, index) => {
      link.classList.toggle("is-active", index === next);
      if (index === next) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
    phaseLabels.forEach((label, index) => { label.hidden = index !== next; });
    readout.textContent = `${String(next + 1).padStart(2, "0")} / 05`;
  };
  activate(0);
  return { activate, dispose() { current = -1; activate(0); root.removeAttribute("data-cyphr-chapter"); } };
}

/** Ambient loops are CSS compositor details, not another GSAP transform owner.
 * A person's pause survives media changes; offscreen and hidden tabs also pause. */
export function createCyphrAmbientState(root: HTMLElement, toggle: HTMLButtonElement, label: HTMLElement) {
  let enabled = false, visible = false, documentVisible = true, paused = false;
  const sync = () => {
    toggle.hidden = !enabled;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute("aria-label", paused ? "Resume ambient motion" : "Pause ambient motion");
    label.textContent = paused ? "Resume ambient" : "Pause ambient";
    if (enabled) {
      root.setAttribute("data-cyphr-motion", "enabled");
      root.setAttribute("data-cyphr-ambient", visible && documentVisible && !paused ? "running" : "paused");
    } else {
      root.removeAttribute("data-cyphr-motion");
      root.removeAttribute("data-cyphr-ambient");
    }
  };
  return {
    setEnabled(value: boolean) { enabled = value; sync(); },
    setVisible(value: boolean) { visible = value; sync(); },
    setDocumentVisible(value: boolean) { documentVisible = value; sync(); },
    togglePause() { paused = !paused; sync(); },
    dispose() { enabled = false; sync(); },
  };
}
