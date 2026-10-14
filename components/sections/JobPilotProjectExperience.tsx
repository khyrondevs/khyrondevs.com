"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowDown, ArrowRight, Check, Gauge, LockKeyhole, Pause, Play, Radio, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { createJobpilotAmbientState, createJobpilotStoryState, jobpilotChapterAtTime, scoreJobpilotStory } from "@/lib/jobpilot-story";

const chapters = [
  {
    id: "discover",
    eyebrow: "01 / discover",
    title: "A scheduled trigger becomes a useful shortlist.",
    copy: "JobPilot turns provider noise into a daily, fresher-friendly stream without asking the operator to manually search every source.",
    image: "/images/jobpilot/Today.png",
    label: "Today / live recommendations",
    icon: Radio,
    command: "discover --schedule daily --audience fresher",
    boundary: "provider signal → useful shortlist",
    input: "scheduled trigger",
    output: "fresh recommendations",
    contracts: ["multi-provider discovery", "fresher-first stream"],
  },
  {
    id: "normalize",
    eyebrow: "02 / normalize",
    title: "Every listing gets one canonical identity.",
    copy: "Provider IDs prevent replayed pulls, while canonical hashes link the same opportunity across providers without duplicating the job record.",
    image: "/images/jobpilot/Jobs.png",
    label: "Jobs / normalized archive",
    icon: Search,
    command: "normalize --identity canonical --dedupe providers",
    boundary: "provider records → canonical jobs",
    input: "provider records",
    output: "one canonical job",
    contracts: ["source-level replay protection", "cross-provider identity"],
  },
  {
    id: "decide",
    eyebrow: "03 / decide",
    title: "Eligibility, scoring and quotas stay server-authoritative.",
    copy: "FastAPI and PostgreSQL own the durable state: provider reservations, fresher gates, preference matching and notification claims. The scheduler only asks what to run next.",
    image: "/images/jobpilot/Search_Vectors.png",
    label: "Search vectors / operator intent",
    icon: Gauge,
    command: "match --gate eligibility --reserve quota",
    boundary: "operator intent → eligible match",
    input: "operator intent",
    output: "eligible matches",
    contracts: ["server-authoritative decisions", "durable quota reservations"],
  },
  {
    id: "operate",
    eyebrow: "04 / operate",
    title: "The system is built to fail closed.",
    copy: "SSRF defenses, leased enrichment work, idempotent notification state and exact-SHA deployment make the automation observable instead of mysterious.",
    image: "/images/jobpilot/System_Stats.png",
    label: "System stats / operational surface",
    icon: ShieldCheck,
    command: "operate --lease work --deploy exact-sha",
    boundary: "durable claims → observable delivery",
    input: "durable claims",
    output: "observable delivery",
    contracts: ["SSRF-safe enrichment", "idempotent notification claims"],
  },
] as const;

function ChapterIcon({ chapter }: { chapter: (typeof chapters)[number] }) {
  const Icon = chapter.icon;
  return <Icon size={17} strokeWidth={1.8} aria-hidden="true" />;
}

function DataRail({ consoleRail = false }: { consoleRail?: boolean }) {
  return (
    <div className={`jobpilot-data-rail${consoleRail ? " jobpilot-console-data-rail" : ""}`} aria-hidden="true">
      <div className="jobpilot-data-flow">
        {[0, 1].map((run) => (
          <div className="jobpilot-data-run" key={run}>
            {chapters.map((chapter) => (
              <span key={chapter.id}><i />{chapter.input}<ArrowRight size={12} />{chapter.output}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function JobPilotProjectExperience({ project, children }: { project: Project; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const container = root.current;
    if (!container) return;

    const chapterElements = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-chapter]"));
    const mediaElements = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-media]"));
    const planeElements = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-plane]"));
    const captionElements = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-caption]"));
    const inlineFigures = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-inline-figure]"));
    const inlineMedia = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-inline-media]"));
    const chapterLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>("[data-jobpilot-link]"));
    const chaptersContainer = container.querySelector<HTMLElement>("[data-jobpilot-chapters]");
    const stageFigure = container.querySelector<HTMLElement>("[data-jobpilot-stage-figure]");
    const progressFill = container.querySelector<HTMLElement>("[data-jobpilot-progress]");
    const railFill = container.querySelector<HTMLElement>("[data-jobpilot-rail-progress]");
    const progressLabel = container.querySelector<HTMLElement>("[data-jobpilot-progress-label]");
    const commandLabel = container.querySelector<HTMLElement>("[data-jobpilot-command]");
    const boundaryLabel = container.querySelector<HTMLElement>("[data-jobpilot-boundary]");
    const orbit = container.querySelector<HTMLElement>("[data-jobpilot-orbit]");
    const depthPlanes = Array.from(container.querySelectorAll<HTMLElement>("[data-jobpilot-depth-plane]"));
    const aperture = container.querySelector<HTMLElement>("[data-jobpilot-aperture]");
    const story = container.querySelector<HTMLElement>("[data-jobpilot-story]");
    const ambientToggle = container.querySelector<HTMLButtonElement>("[data-jobpilot-motion-toggle]");
    const ambientLabel = container.querySelector<HTMLElement>("[data-jobpilot-motion-label]");
    const runtimeFill = container.querySelector<HTMLElement>("[data-jobpilot-runtime-fill]");
    const stageSweep = container.querySelector<HTMLElement>("[data-jobpilot-stage-sweep]");

    if (
      chapterElements.length !== chapters.length ||
      mediaElements.length !== chapters.length ||
      planeElements.length !== chapters.length ||
      captionElements.length !== chapters.length ||
      inlineFigures.length !== chapters.length ||
      inlineMedia.length !== chapters.length ||
      chapterLinks.length !== chapters.length ||
      !chaptersContainer ||
      !stageFigure ||
      !progressFill ||
      !railFill ||
      !progressLabel ||
      !commandLabel ||
      !boundaryLabel ||
      !orbit ||
      depthPlanes.length !== 2 ||
      !aperture ||
      !story ||
      !ambientToggle ||
      !ambientLabel
    ) {
      return;
    }

    const state = createJobpilotStoryState({
      root: container,
      chapters: chapterElements,
      links: chapterLinks,
      media: mediaElements,
      captions: captionElements,
      inlineFigures,
      stageFigure,
      progressLabel,
      commandLabel,
      boundaryLabel,
      readouts: chapters,
    });
    const setActiveChapter = state.activate;
    const ambient = createJobpilotAmbientState({ root: container, toggle: ambientToggle, label: ambientLabel });
    const onVisibilityChange = () => ambient.setDocumentVisible(!document.hidden);
    const onAmbientToggle = () => ambient.togglePause();
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    ambientToggle.addEventListener("click", onAmbientToggle);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (entry) ambient.setVisible(entry.isIntersecting);
    });
    if (observer) observer.observe(story);
    else ambient.setVisible(true);

    const mm = gsap.matchMedia();
    mm.add({
      desktop: "(min-width: 901px) and (min-height: 800px)",
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const motion = Boolean(context.conditions?.motion);
      const desktop = Boolean(context.conditions?.desktop && motion);
      state.setDesktop(desktop);
      ambient.setEnabled(motion);

      const timeline = gsap.timeline({ paused: true });
      let chapterOffsets: number[] = [];
      let readingOffset = 0;
      const syncChapter = () => {
        setActiveChapter(jobpilotChapterAtTime(chapterOffsets, timeline.time(), readingOffset));
      };
      // Keep one child context for the score: timeline.clear() alone leaves
      // detached tweens retained by GSAP's context after every refresh.
      const scoringContext = gsap.context(() => {}, container);
      const scoreStory = scoringContext.add("scoreStory", () => {
        scoreJobpilotStory(timeline, {
          planes: desktop ? planeElements : [],
          progressFill,
          railFill,
          orbit: desktop ? orbit : undefined,
          depthPlanes: desktop ? depthPlanes : [],
          aperture: desktop ? aperture : undefined,
          runtimeFill: runtimeFill ?? undefined,
          stageSweep: desktop ? stageSweep ?? undefined : undefined,
        }, chapterOffsets, window.innerHeight, chaptersContainer.offsetHeight + window.innerHeight * .2);
      });
      // The same master timeline owns media, progress and activation, including seeks.
      const rebuildStory = () => {
        chapterOffsets = chapterElements.map((chapter) => chapter.offsetTop);
        readingOffset = window.innerHeight * (desktop ? .165 : .12);
        scoringContext.revert();
        timeline.clear();
        // Do not re-register the child with an active parent context on refresh.
        context.ignore(scoreStory);
      };
      rebuildStory();
      timeline.eventCallback("onUpdate", syncChapter);
      ScrollTrigger.create({
        animation: timeline,
        trigger: chaptersContainer,
        start: desktop ? "top 72%" : "top 82%",
        end: desktop ? "bottom 52%" : "bottom 62%",
        scrub: motion ? (desktop ? .7 : .55) : true,
        onRefresh: (self) => {
          rebuildStory();
          timeline.totalProgress(self.progress, true);
          syncChapter();
        },
      });
      syncChapter();

      if (motion) {
        chapterElements.forEach((chapter, index) => {
          const boundaryProgress = chapter.querySelector<HTMLElement>("[data-jobpilot-boundary-progress]");
          // Copy never fades or slides. A circuit trace measures the boundary.
          if (boundaryProgress) {
            gsap.fromTo(boundaryProgress, { scaleX: 0 }, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: chapter,
                start: desktop ? "top 72%" : "top 82%",
                end: "bottom 55%",
                scrub: .6,
              },
            });
          }

          if (!desktop) {
            gsap.fromTo(inlineMedia[index], { scale: .78, xPercent: -6, yPercent: 2, rotation: -3 }, {
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              ease: "none",
              scrollTrigger: {
                trigger: inlineFigures[index],
                start: "top 90%",
                end: "top 62%",
                scrub: .55,
              },
            });
          }
        });
      }

      return () => {
        state.setDesktop(false);
        ambient.setEnabled(false);
      };
    }, container);

    return () => {
      mm.revert();
      state.dispose();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      ambientToggle.removeEventListener("click", onAmbientToggle);
      ambient.dispose();
    };
  }, []);

  return (
    <div ref={root} id="jobpilot" className="jobpilot-experience">
      <div className="jobpilot-project-card">{children}</div>

      <section className="jobpilot-story" data-jobpilot-story aria-labelledby="jobpilot-story-title">
        <div className="jobpilot-reel-heading">
          <p className="jobpilot-kicker"><span className="jobpilot-pulse" aria-hidden="true" /> autonomous system / {project.title}</p>
        </div>
        <div className="jobpilot-story-intro">
          <div>
            <h2 id="jobpilot-story-title">Signal in.<br /><span>Shortlist out.</span></h2>
            <p className="jobpilot-reel-index">one control loop <span aria-hidden="true">/</span> four durable boundaries</p>
          </div>
          <p className="jobpilot-story-lead">
            Follow an opportunity through JobPilot. A scheduled signal becomes a canonical job, an eligible match, then an observable delivery. The system keeps moving. The decisions stay visible.
          </p>
        </div>

        <section className="jobpilot-runtime-panel" aria-labelledby="jobpilot-runtime-title">
          <div className="jobpilot-runtime-head">
            <div>
              <p className="jobpilot-runtime-kicker">autonomous runtime / presentation only</p>
            </div>
            <div className="jobpilot-runtime-state" aria-label="Architecture state: running and server-authoritative; not live telemetry">
              <span className="jobpilot-runtime-signal" aria-hidden="true" />
              <h3 id="jobpilot-runtime-title">RUNNING</h3>
              <span>server-authoritative</span>
            </div>
          </div>

          <ul className="jobpilot-runtime-metrics" aria-label="JobPilot project facts, not live telemetry">
            {project.metrics?.map((metric) => (
              <li className="jobpilot-runtime-metric" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </li>
            ))}
          </ul>

          <div className="jobpilot-runtime-trace-shell">
          <ol className="jobpilot-runtime-trace" aria-label="Ordered autonomous runtime trace">
            {chapters.map((chapter, index) => (
              <li
                className="jobpilot-runtime-trace-step"
                key={chapter.id}
                aria-label={`${chapter.id}: ${chapter.input} to ${chapter.output}`}
              >
                <div className="jobpilot-runtime-trace-node" aria-hidden="true">
                  <ChapterIcon chapter={chapter} />
                </div>
                <div className="jobpilot-runtime-trace-copy">
                  <h4>{chapter.id}</h4>
                  <p>
                    <span>{chapter.input}</span>
                    <ArrowRight size={13} aria-hidden="true" />
                    <strong>{chapter.output}</strong>
                  </p>
                </div>
                {index < chapters.length - 1 && (
                  <div className="jobpilot-runtime-trace-line" aria-hidden="true">
                    <span className="jobpilot-runtime-trace-packet" />
                  </div>
                )}
              </li>
            ))}
          </ol>
          <span className="jobpilot-runtime-trace-fill" data-jobpilot-runtime-fill aria-hidden="true" />
          </div>
        </section>

        <DataRail />
        <div className="jobpilot-story-body">
          <aside className="jobpilot-story-stage" data-jobpilot-stage aria-label="JobPilot story progress">
            <div className="jobpilot-console-heading">
              <div className="jobpilot-signal-orbit" data-jobpilot-orbit aria-hidden="true">
                <svg className="jobpilot-signal-rings" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="26" />
                  <circle cx="32" cy="32" r="18" />
                  <path d="M32 2v8M32 54v8M2 32h8M54 32h8" />
                </svg>
                <svg className="jobpilot-signal-runner" viewBox="0 0 64 64" fill="none">
                  <path d="M6 32a26 26 0 0 1 26-26" />
                  <circle cx="32" cy="6" r="3" />
                </svg>
              </div>
              <div aria-hidden="true"><span>command console / 01</span><strong>{project.title}</strong></div>
              <button
                className="jobpilot-motion-toggle"
                data-jobpilot-motion-toggle
                type="button"
                aria-label="Pause ambient motion"
                aria-pressed="false"
                hidden
              >
                <Pause size={12} className="jobpilot-pause-icon" aria-hidden="true" />
                <Play size={12} className="jobpilot-play-icon" aria-hidden="true" />
                <span data-jobpilot-motion-label>Pause ambient</span>
              </button>
              <p aria-hidden="true">story model<br /><span>scroll controlled</span></p>
            </div>
            <nav className="jobpilot-progress-nav" aria-label="JobPilot story chapters">
              <div className="jobpilot-progress-heading">
                <span>control loop / inspect</span>
                <span data-jobpilot-progress-label aria-live="polite">01 / 04</span>
              </div>
              <div className="jobpilot-progress-track" aria-hidden="true"><span data-jobpilot-progress /></div>
              <ol>
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#jobpilot-chapter-${chapter.id}`}
                      className={`jobpilot-progress-step${index === 0 ? " is-active" : ""}`}
                      data-jobpilot-link
                      aria-current={index === 0 ? "step" : undefined}
                    >
                      <span>{String(index + 1).padStart(2, "0")}<ArrowRight size={11} aria-hidden="true" /></span>
                      <strong>{chapter.id}</strong>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="jobpilot-stage-figure" data-jobpilot-stage-figure hidden>
              <div className="jobpilot-console-boundary" aria-hidden="true">
                <span>boundary</span><span data-jobpilot-boundary>{chapters[0].boundary}</span>
              </div>
              <div className="jobpilot-console-grid" data-jobpilot-aperture aria-hidden="true" />
              <div className="jobpilot-depth-stack" aria-hidden="true">
                <span className="jobpilot-depth-plane" data-jobpilot-depth-plane />
                <span className="jobpilot-depth-plane" data-jobpilot-depth-plane />
              </div>
              <div className="jobpilot-stage-sweep" data-jobpilot-stage-sweep aria-hidden="true" />
              <div className="jobpilot-stage-media-stack">
                {chapters.map((chapter, index) => (
                  <figure
                    key={chapter.id}
                    className={`jobpilot-stage-media${index === 0 ? " is-active" : ""}`}
                    data-jobpilot-media={chapter.id}
                    aria-labelledby={`jobpilot-chapter-title-${chapter.id}`}
                    aria-describedby={`jobpilot-stage-caption-${chapter.id}`}
                  >
                    <div className="jobpilot-stage-plane" data-jobpilot-plane>
                      <div className="jobpilot-stage-viewport">
                        <Image
                          src={chapter.image}
                          alt={`${project.title} — ${chapter.label}`}
                          fill
                          sizes="(min-width: 1400px) 680px, (min-width: 901px) 54vw, 1px"
                          data-jobpilot-image
                        />
                      </div>
                    </div>
                    <figcaption
                      id={`jobpilot-stage-caption-${chapter.id}`}
                      className={`jobpilot-stage-caption${index === 0 ? " is-active" : ""}`}
                      data-jobpilot-caption
                    >
                      <span>{chapter.label}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="jobpilot-command-line" aria-hidden="true">
                <span>&gt;</span><code data-jobpilot-command>{chapters[0].command}</code><i />
              </div>
              <DataRail consoleRail />
              <div className="jobpilot-stage-note">
                <span className="jobpilot-pulse" aria-hidden="true" />
                <span>system architecture / not live telemetry</span>
              </div>
            </div>
          </aside>

          <div className="jobpilot-chapters" data-jobpilot-chapters>
            <div className="jobpilot-story-rail" aria-hidden="true"><span data-jobpilot-rail-progress /></div>
            {chapters.map((chapter, index) => (
              <article
                key={chapter.id}
                id={`jobpilot-chapter-${chapter.id}`}
                className={`jobpilot-chapter${index === 0 ? " is-active" : ""}`}
                data-jobpilot-chapter={chapter.id}
                aria-labelledby={`jobpilot-chapter-title-${chapter.id}`}
                tabIndex={-1}
              >
                <div className="jobpilot-chapter-marker" data-jobpilot-marker>
                  <ChapterIcon chapter={chapter} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="jobpilot-chapter-copy" data-jobpilot-copy>
                  <p className="jobpilot-kicker">{chapter.eyebrow}</p>
                  <h3 id={`jobpilot-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                  <p>{chapter.copy}</p>
                  <div className="jobpilot-boundary-route" role="group" aria-label="System handoff">
                    <span>{chapter.input}</span><ArrowRight size={15} aria-hidden="true" /><strong>{chapter.output}</strong>
                    <i aria-hidden="true"><span data-jobpilot-boundary-progress /></i>
                  </div>
                  <ul>
                    {chapter.contracts.map((contract) => <li key={contract}><Check size={13} aria-hidden="true" />{contract}</li>)}
                  </ul>
                </div>
                <figure
                  className="jobpilot-stage-figure jobpilot-inline-figure"
                  data-jobpilot-inline-figure={chapter.id}
                  aria-labelledby={`jobpilot-chapter-title-${chapter.id}`}
                  aria-describedby={`jobpilot-inline-caption-${chapter.id}`}
                >
                  <div className="jobpilot-stage-viewport">
                    <div className="jobpilot-inline-media" data-jobpilot-inline-media>
                      <Image
                        src={chapter.image}
                        alt={`${project.title} — ${chapter.label}`}
                        fill
                        sizes="(max-width: 900px) 92vw, 1100px"
                        data-jobpilot-image
                      />
                    </div>
                  </div>
                  <figcaption className="jobpilot-stage-caption" id={`jobpilot-inline-caption-${chapter.id}`}>
                    <span>{chapter.label}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>

        <DataRail />
        <div className="jobpilot-story-close">
          <div className="jobpilot-close-icon"><LockKeyhole size={20} aria-hidden="true" /></div>
          <div>
            <p className="jobpilot-kicker">the operating contract</p>
            <p>FastAPI decides. PostgreSQL remembers. The scheduler keeps time.</p>
          </div>
          <ArrowDown size={18} aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
