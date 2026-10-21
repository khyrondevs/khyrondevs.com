"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import CyphrCaseStudy, { CyphrCaseStudyCover } from "@/components/sections/CyphrCaseStudy";
import { canPinCyphr, CYPHR_PORTAL_QUERY, scoreCyphrTransition } from "@/lib/cyphr-transition";

/** The article is never translated or clipped. Only the short opening is pinned. */
export default function CyphrProjectExperience({ project, children }: { project: Project; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const container = root.current, scene = stage.current;
    if (!container || !scene) return;
    let disposed = false;
    let mm = gsap.matchMedia();
    let geometry = "";
    const buildScene = () => {
      if (disposed) return false;
      const nextGeometry = `${window.innerWidth}:${window.innerHeight}:${scene.offsetHeight}`;
      if (geometry === nextGeometry) return false;
      geometry = nextGeometry;
      mm.revert();
      mm = gsap.matchMedia();
      mm.add(CYPHR_PORTAL_QUERY, () => {
        const ctx = gsap.context(() => {
          // Do not pin a card taller than the available reading area.
          if (!canPinCyphr(window.innerHeight, scene.offsetHeight)) return;
          const cover = scene.querySelector<HTMLElement>(".cyphr-portal-cover");
          const front = scene.querySelector<HTMLElement>(".cyphr-card-front");
          if (!cover || !front) return;
          gsap.set(cover, { opacity: 0 });
          container.dataset.enhanced = "true";
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: scene,
              start: "top 100px",
              end: () => `+=${Math.round(window.innerHeight * 0.9)}`,
              pin: scene,
              scrub: 0.35,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 1,
            },
          });
          scoreCyphrTransition(timeline, {
            shell: ".cyphr-portal-shell", cover, front,
            title: ".cyphr-cover-title", visual: ".cyphr-cover-visual",
          });
          const syncControls = () => {
            front.style.pointerEvents = timeline.time() >= .45 ? "none" : "";
          };
          timeline.eventCallback("onUpdate", syncControls);
          syncControls();
        }, container);
        return () => {
          ctx.revert();
          container.querySelector<HTMLElement>(".cyphr-card-front")?.style.removeProperty("pointer-events");
          delete container.dataset.enhanced;
        };
      }, container);
      ScrollTrigger.refresh();
      return true;
    };
    buildScene();
    // A resize may make the natural card too tall to pin. Rebuild rather than
    // retaining stale pin measurements; resize does not run on scroll frames.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const resize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { if (buildScene()) ScrollTrigger.refresh(); }, 180);
    };
    window.addEventListener("resize", resize);
    document.fonts?.ready.then(() => { if (!disposed) resize(); }).catch(() => {});
    return () => { disposed = true; clearTimeout(resizeTimer); window.removeEventListener("resize", resize); mm.revert(); };
  }, []);

  return (
    <div ref={root} id="cyphr" className="cyphr-portal-experience">
      <div ref={stage} className="cyphr-portal-stage">
        <div className="cyphr-portal-shell">
          <div className="cyphr-card-front"><div className="cyphr-card-arrival">{children}</div></div>
          <div className="cyphr-portal-cover" aria-hidden="true"><CyphrCaseStudyCover project={project} /></div>
        </div>
      </div>
      <a className="cyphr-dive-hint" href="#cyphr-case-study">Explore the architecture <ArrowDown size={14} aria-hidden /></a>
      <CyphrCaseStudy project={project} embedded />
    </div>
  );
}
