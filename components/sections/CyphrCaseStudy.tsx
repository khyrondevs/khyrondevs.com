"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Database,
  FileText,
  Lock,
  PanelsTopLeft,
  Pause,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useClipboard from "@/hooks/useClipboard";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import {
  createCyphrAmbientState,
  createCyphrChapterState,
  cyphrInlinePhaseAtProgress,
  cyphrPhaseAtPosition,
  CYPHR_STAGE_QUERY,
  scoreCyphrDocumentMovie,
} from "@/lib/cyphr-transition";

type NodeId = "data" | "api" | "retrieval" | "llm" | "interface";

type ArchitectureNode = {
  id: NodeId;
  number: string;
  label: string;
  shortLabel: string;
  headline: string;
  description: string;
  proof: string;
  tags: string[];
  icon: LucideIcon;
  codeSnippet: string;
  specs: { label: string; val: string }[];
};

const FILE_NAMES: Record<NodeId, string> = {
  data: "cyphr/ingestion/parser.py",
  api: "cyphr/gateway/router.py",
  retrieval: "cyphr/vector/search.py",
  llm: "cyphr/orchestrator/router.ts",
  interface: "cyphr/components/ChatWorkspace.tsx",
};

const getCyphrProject = (): Project => {
  const project = projects.find((item) => item.slug === "cyphr");
  if (!project) throw new Error("CYPHR project data is missing");
  return project;
};

const DEFAULT_PROJECT = getCyphrProject();

function getStackItem(project: Project, name: string, fallback: string) {
  return project.stack.find((item) => item.toLowerCase() === name.toLowerCase()) ?? fallback;
}

function getArchitectureNodes(project: Project): ArchitectureNode[] {
  const fastApi = getStackItem(project, "FastAPI", "FastAPI");
  const react = getStackItem(project, "React", "React");
  const mongo = getStackItem(project, "MongoDB Atlas", "MongoDB Atlas");
  const vectorSearch = getStackItem(project, "Vector Search", "Vector Search");
  const jina = getStackItem(project, "Jina Embeddings", "Jina Embeddings v3");
  const providerCount = project.metrics?.find((metric) => metric.label === "LLM providers")?.value ?? "6";

  return [
    {
      id: "data",
      number: "01",
      label: "Data Ingestion",
      shortLabel: "PDF Ingestion",
      headline: "Start with the source material.",
      description:
        "User-uploaded PDFs are extracted, divided into passages, embedded and indexed before retrieval. Source file and page metadata travel with each passage.",
      proof: project.summary ?? project.solution,
      tags: ["PDF Extraction", "Passage Chunking", "Source Metadata"],
      icon: Database,
      specs: [
        { label: "Input", val: "Uploaded PDFs" },
        { label: "Preparation", val: "Chunked passages" },
        { label: "Provenance", val: "Source file + page" },
      ],
      codeSnippet: `// Document Intake Pipeline
const chunks = partitionDocument(file, {
  chunkSize: 512,
  chunkOverlap: 64,
  extractMetadata: ["page", "filename", "section"]
});`,
    },
    {
      id: "api",
      number: "02",
      label: "API Gateway",
      shortLabel: "Trust Boundary",
      headline: "Make the boundary dependable.",
      description:
        `${fastApi} handles the application boundary, with Google OAuth, per-user tenant isolation, CSRF and origin validation, and tiered rate limits.`,
      proof: project.highlights?.[2] ?? `${fastApi} service layer`,
      tags: [fastApi, "OAuth 2.0", "CSRF Defense", "Rate Limits"],
      icon: Server,
      specs: [
        { label: "Framework", val: "FastAPI Async Router" },
        { label: "Security", val: "OAuth 2.0 + CSRF Shield" },
        { label: "Isolation", val: "Per-user retrieval scope" },
      ],
      codeSnippet: `@router.post("/query")
@limiter.limit("30/minute")
async def handle_rag_query(
    query: QueryRequest,
    user: User = Depends(get_current_authenticated_user)
):
    return await rag_service.query_tenant_store(user.tenant_id, query)`,
    },
    {
      id: "retrieval",
      number: "03",
      label: "Vector Retrieval",
      shortLabel: "Evidence Search",
      headline: "Retrieve evidence, not vibes.",
      description:
        `${mongo} ${vectorSearch} uses ${jina} to generate 1024-dimensional dense vectors, returning cosine-ranked passages to keep answers strictly grounded in verified facts.`,
      proof: project.highlights?.[0] ?? `${mongo} ${vectorSearch}`,
      tags: [mongo, vectorSearch, jina, "Cosine Sim"],
      icon: Search,
      specs: [
        { label: "Embeddings", val: "Jina v3 1024-Dimensional" },
        { label: "Index Engine", val: "MongoDB Atlas Vector Search" },
        { label: "Retrieval", val: "Ranked source passages" },
      ],
      codeSnippet: `pipeline = [
  {"$vectorSearch": {
    "index": "vector_index",
    "path": "embedding",
    "queryVector": jina_v3_embed(query.text),
    "numCandidates": 100,
    "limit": 5
  }}
]`,
    },
    {
      id: "llm",
      number: "04",
      label: "Grounded LLM",
      shortLabel: "Runtime Choice",
      headline: "Keep the model layer flexible.",
      description:
        "Six configurable LLM providers let the user choose a model at runtime. Retrieved passages supply the context for document-grounded answers with source citations.",
      proof: project.highlights?.[1] ?? "Configurable LLM providers with runtime model selection",
      tags: [`${providerCount} Providers`, "Dynamic Routing", "Strict Grounding"],
      icon: BrainCircuit,
      specs: [
        { label: "Model Routing", val: "6 Dynamic Providers" },
        { label: "Selection", val: "Runtime model choice" },
        { label: "Grounding", val: "Retrieved document context" },
      ],
      codeSnippet: `const response = await modelRouter.generate({
  provider: userSettings.provider,
  context: retrievedPassages,
  instruction: "Answer strictly from context. Cite [File, Page] on every claim."
});`,
    },
    {
      id: "interface",
      number: "05",
      label: "Client Interface",
      shortLabel: "Cited Answer",
      headline: "Make confidence visible.",
      description:
        `${react} presents a chat workspace with source-file and page citations, helping the reader check an answer against the uploaded material.`,
      proof: project.summary ?? project.solution,
      tags: [react, "Citations", "Chat Workspace"],
      icon: PanelsTopLeft,
      specs: [
        { label: "Frontend", val: "React chat workspace" },
        { label: "Citations", val: "Source file + page" },
        { label: "Verification", val: "Document provenance" },
      ],
      codeSnippet: `<CitationBadge
  document={chunk.source}
  page={chunk.pageNumber}
  onInspect={() => highlightSourcePassage(chunk.id)}
/>`,
    },
  ];
}

type CyphrCaseStudyProps = {
  /** Supplying a project keeps the section reusable while CYPHR remains the default case file. */
  project?: Project;
  embedded?: boolean;
  onBackToCard?: () => void;
  onNextProject?: () => void;
};

export function CyphrCaseStudyCover({ project = DEFAULT_PROJECT }: { project?: Project }) {
  return <div className="cyphr-cover-layout">
    <div className="cyphr-cover-copy">
      <span className="editorial-label">Inside {project.title} / an engineering case study</span>
      <p className="cyphr-cover-title">From source.<br /><span>To context.</span></p>
      <p>A closer look at the system behind every cited answer.</p>
      <div className="cyphr-cover-facts"><span>PDF → passages</span><span>Vector retrieval</span><span>Cited answers</span></div>
    </div>
    <div className="cyphr-cover-visual">
      <div className="cyphr-cover-document"><FileText size={18} /><span>source.pdf / page 14</span><i /><i /><i /></div>
      <div className="cyphr-cover-image"><Image src="/images/cyphr/light/6_chat_response.png" alt="" width={1920} height={994} sizes="(max-width: 1100px) 90vw, (max-width: 1600px) 850px, 940px" loading="lazy" /></div>
      <span className="cyphr-cover-citation">One answer. A path back to the source.</span>
    </div>
  </div>;
}

const MOVIE_CAPTIONS = [
  "The document is the beginning. File and page metadata stay attached.",
  "Passages cross an authenticated, per-user boundary before retrieval.",
  "A query searches the vector space. Relevant passages become evidence.",
  "Retrieved context travels to the model selected at runtime.",
  "The answer carries a citation back to the original file and page.",
];
const MOVIE_WORDS = ["SOURCE", "SCOPE", "RETRIEVE", "CONTEXT", "CITED"];
const CHAPTER_ROUTES = [
  ["Uploaded PDF", "Source-tagged passages"],
  ["Authenticated user", "Tenant-scoped context"],
  ["Query vector", "Ranked evidence"],
  ["Retrieved passages", "Runtime model choice"],
  ["Grounded answer", "File + page citation"],
];

/** Decorative planes only. The adjacent article owns all readable content. */
function CyphrDocumentScene({ phase = 0, stage = false }: { phase?: number; stage?: boolean }) {
  return (
    <div className="cyphr-movie-scene" data-phase={phase} data-cyphr-stage-scene={stage ? "" : undefined} aria-hidden="true">
      <div className="cyphr-movie-grid" />
      <div className="cyphr-movie-artboard">
      <div className="cyphr-movie-scope"><div className="cyphr-scope-orbit"><i /><i /></div><span>tenant / authenticated</span></div>
      <div className="cyphr-movie-beam"><div className="cyphr-beam-shimmer" /></div>
      <div className="cyphr-document-stack">
        {[0, 1, 2].map((page) => (
          <div key={page} className="cyphr-movie-page"><div className="cyphr-page-breathe">
            <span>source.pdf <b>0{page + 1}</b></span><FileText size={22} strokeWidth={1.2} />
            <i /><i /><i /><i /><i /><small>file + page / retained</small>
          </div></div>
        ))}
      </div>
      <div className="cyphr-chunk-stack">
        {[0, 1, 2, 3].map((chunk) => (
          <div key={chunk} className={`cyphr-movie-chunk${chunk === 1 ? " cyphr-chunk-selected" : ""}`}><div className="cyphr-chunk-feedback">
            <span>passage / {41 + chunk}</span><i /><i /><small>source.pdf · p.14</small>
          </div></div>
        ))}
      </div>
      <div className="cyphr-token-field">
        {["query", "1024-D", "cosine", "context", "model", "source"].map((token, index) => (
          <div className="cyphr-movie-token" key={token}><span className="cyphr-token-drift" style={{ animationDelay: `${index * -.8}s` }}>{token}</span></div>
        ))}
      </div>
      <div className="cyphr-movie-answer"><span><Sparkles size={13} /> Grounded answer</span><i /><i /><i /><div><FileText size={11} /> source.pdf / page 14 <Check size={12} /></div></div>
      <svg className="cyphr-citation-route" viewBox="0 0 400 320" fill="none"><path className="cyphr-movie-citation" pathLength="1" strokeDasharray="1" d="M 250 206 H 300 Q 320 206 320 226 V 260 Q 320 275 300 275 H 89 Q 70 275 70 257 V 100" /><circle cx="70" cy="100" r="4" /><circle cx="250" cy="206" r="4" /></svg>
      <span className="cyphr-scene-origin">provenance is never discarded</span>
      </div>
    </div>
  );
}

function getCyphrSceneTargets(scene: HTMLElement, progress?: HTMLElement) {
  const pages = Array.from(scene.querySelectorAll<HTMLElement>(".cyphr-movie-page"));
  const chunks = Array.from(scene.querySelectorAll<HTMLElement>(".cyphr-movie-chunk"));
  const tokens = Array.from(scene.querySelectorAll<HTMLElement>(".cyphr-movie-token"));
  const scope = scene.querySelector<HTMLElement>(".cyphr-movie-scope");
  const beam = scene.querySelector<HTMLElement>(".cyphr-movie-beam");
  const answer = scene.querySelector<HTMLElement>(".cyphr-movie-answer");
  const citation = scene.querySelector<SVGPathElement>(".cyphr-movie-citation");
  if (pages.length !== 3 || chunks.length !== 4 || tokens.length !== 6 || !scope || !beam || !answer || !citation) return null;
  return { pages, chunks, tokens, scope, beam, answer, citation, progress };
}

export default function CyphrCaseStudy({
  project = DEFAULT_PROJECT,
  embedded = false,
  onBackToCard,
  onNextProject,
}: CyphrCaseStudyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [copiedStageId, setCopiedStageId] = useState<NodeId | null>(null);
  const { copy, status: copyStatus } = useClipboard();
  const nodes = useMemo(() => getArchitectureNodes(project), [project]);

  /** Per-stage copy handler — no shared selected state needed */
  const handleCopyCode = (stageId: NodeId, code: string) => {
    setCopiedStageId(stageId);
    void copy(code);
  };

  /** Desktop follows measured native chapters; inline figures scrub local shots.
   * Refresh only measures/seeks, never allocates replacement contexts/tweens. */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-stage-id]"));
    const links = Array.from(root.querySelectorAll<HTMLElement>("[data-cyphr-chapter-link]"));
    const phaseLabels = Array.from(root.querySelectorAll<HTMLElement>("[data-cyphr-phase-label]"));
    const sequence = root.querySelector<HTMLElement>(".cyphr-stage-sequence");
    const stage = root.querySelector<HTMLElement>("[data-cyphr-movie-stage]");
    const scene = root.querySelector<HTMLElement>("[data-cyphr-stage-scene]");
    const readout = root.querySelector<HTMLElement>("[data-cyphr-readout]");
    const progress = root.querySelector<HTMLElement>("[data-cyphr-progress]");
    const toggle = root.querySelector<HTMLButtonElement>("[data-cyphr-motion-toggle]");
    const toggleLabel = root.querySelector<HTMLElement>("[data-cyphr-motion-label]");
    if (chapters.length !== 5 || links.length !== 5 || !sequence || !stage || !scene || !readout || !progress || !toggle || !toggleLabel) return;
    const stageTargets = getCyphrSceneTargets(scene, progress);
    if (!stageTargets) return;

    registerGsap();
    const inlineFigures = Array.from(root.querySelectorAll<HTMLElement>("[data-cyphr-inline-figure]"));
    const state = createCyphrChapterState({ root, chapters, links, readout, phaseLabels });
    const ambient = createCyphrAmbientState(root, toggle, toggleLabel);
    const visible = new Set<Element>();
    const aliveAreas = Array.from(root.querySelectorAll<HTMLElement>("[data-cyphr-alive]"));
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting);
        if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
      });
      ambient.setVisible(visible.size > 0);
    }, { threshold: 0 });
    aliveAreas.forEach((area) => observer?.observe(area));
    const visibility = () => ambient.setDocumentVisible(!document.hidden);
    const pause = () => ambient.togglePause();
    visibility();
    document.addEventListener("visibilitychange", visibility);
    toggle.addEventListener("click", pause);
    const mm = gsap.matchMedia();
    mm.add({ desktop: CYPHR_STAGE_QUERY, motion: "(prefers-reduced-motion: no-preference)", all: "(min-width: 0px)" }, (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      const motion = Boolean(context.conditions?.motion);
      stage.hidden = !desktop;
      inlineFigures.forEach((figure) => { figure.hidden = desktop; });
      if (desktop) root.setAttribute("data-cyphr-layout", "stage");
      ambient.setEnabled(motion);
      let offsets: number[] = [], distance = 1;
      const measure = () => {
        offsets = chapters.map((chapter) => chapter.offsetTop - chapters[0].offsetTop);
        distance = Math.max(1, sequence.offsetHeight);
      };
      measure();
      const movie = desktop ? scoreCyphrDocumentMovie(gsap.timeline({ paused: true }), stageTargets) : null;
      // Initialise every fromTo/startAt inside its owner, once. Later seeks and
      // refreshes cannot lazily append startAt tweens to a different context.
      movie?.progress(1).progress(0);
      const sync = (value: number) => {
        const phase = cyphrPhaseAtPosition(offsets, value * distance);
        state.activate(phase);
        movie?.time(phase);
      };
      const triggerOptions = {
        trigger: sequence, start: "top 48%", end: () => `+=${sequence.offsetHeight}`,
        onRefresh: (trigger: ScrollTrigger) => { measure(); sync(trigger.progress); },
      };
      if (desktop) {
        const clock = { progress: 0 };
        gsap.timeline({ scrollTrigger: { ...triggerOptions, scrub: .45 } })
          .to(clock, { progress: 1, duration: 1, ease: "none", onUpdate: () => sync(clock.progress) });
      } else {
        ScrollTrigger.create({ ...triggerOptions, onUpdate: (trigger) => sync(trigger.progress) });
      }
      if (motion) {
        const words = root.querySelectorAll<HTMLElement>(".cyphr-title-word");
        words.forEach((word, index) => {
          const title = gsap.fromTo(word, { scale: .84, rotation: index % 2 ? 3 : -3, xPercent: index % 2 ? 6 : -3 }, {
            scale: 1, rotation: 0, xPercent: 0, ease: "power2.out",
            scrollTrigger: { trigger: word, start: "top 94%", end: "top 44%", scrub: .5, invalidateOnRefresh: true },
          });
          title.progress(1).progress(title.scrollTrigger?.progress ?? 0);
        });
        const underline = root.querySelector<HTMLElement>(".cyphr-title-underline");
        const evidenceWord = root.querySelector<HTMLElement>(".cyphr-title-evidence");
        if (underline && evidenceWord) {
          const underAnim = gsap.fromTo(underline, { scaleX: 0 }, {
            scaleX: 1, ease: "power2.out",
            scrollTrigger: { trigger: evidenceWord, start: "top 94%", end: "top 44%", scrub: .5, invalidateOnRefresh: true },
          });
          underAnim.progress(1).progress(underAnim.scrollTrigger?.progress ?? 0);
        }
        if (!desktop) inlineFigures.forEach((figure, index) => {
          const inlineScene = figure.querySelector<HTMLElement>(".cyphr-movie-scene");
          const trace = figure.querySelector<HTMLElement>(".cyphr-inline-trace > span");
          const targets = inlineScene && getCyphrSceneTargets(inlineScene);
          if (!targets || !trace) return; // An incomplete figure retains its still.
          // Disable CSS still transforms BEFORE GSAP reads the outer planes.
          // Nested ambient children remain independent transform owners.
          figure.setAttribute("data-cyphr-inline-motion", "");
          const localMovie = scoreCyphrDocumentMovie(gsap.timeline({ paused: true }), targets);
          localMovie.progress(1).progress(0);
          const syncLocal = (value: number) => { localMovie.time(cyphrInlinePhaseAtProgress(index, value)); };
          const clock = { progress: 0 };
          const localClock = gsap.timeline({ paused: true })
            .to(clock, { progress: 1, duration: 1, ease: "none", onUpdate: () => syncLocal(clock.progress) }, 0)
            .fromTo(trace, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
          // Both scores (including the trace's startAt) initialise in this media
          // context. Geometry refreshes only update the existing playhead.
          localClock.progress(1).progress(0);
          ScrollTrigger.create({
            trigger: figure, start: "top 82%", end: "bottom 45%",
            animation: localClock, scrub: true,
            onRefresh: (trigger) => { localClock.progress(trigger.progress); syncLocal(trigger.progress); },
          });
        });
      }
      return () => {
        stage.hidden = true;
        inlineFigures.forEach((figure) => { figure.hidden = false; figure.removeAttribute("data-cyphr-inline-motion"); });
        root.removeAttribute("data-cyphr-layout");
        ambient.setEnabled(false);
      };
    }, root);
    let disposed = false;
    // Lazy media and font metrics get one settled refresh, never a scroll-frame rebuild.
    document.fonts?.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); }).catch(() => {});
    return () => {
      disposed = true;
      mm.revert();
      observer?.disconnect();
      aliveAreas.forEach((area) => area.classList.remove("is-in-view"));
      document.removeEventListener("visibilitychange", visibility);
      toggle.removeEventListener("click", pause);
      ambient.dispose();
      state.dispose();
    };
  }, [nodes]);

  return (
    <section
      ref={sectionRef}
      id="cyphr-case-study"
      className={cn("cyphr-case-study-redesign", embedded && "cyphr-embedded")}
      aria-labelledby="cyphr-story-title"
    >
      <div className="cyphr-inner-shell">
        {/* TOP STATUS BAR */}
        <header className="cyphr-portal-header">
          <div className="cyphr-header-left">
            <span className="cyphr-status-indicator">
              <span className="cyphr-status-pulse" />
              SYSTEM ONLINE
            </span>
            <span className="cyphr-header-sep">/</span>
            <span className="cyphr-header-sub">{project.title} &bull; Architecture Deep Dive</span>
          </div>

          <div className="cyphr-header-actions">
            <button type="button" className="cyphr-motion-toggle" data-cyphr-motion-toggle hidden aria-label="Pause ambient motion" aria-pressed="false"><Pause size={12} aria-hidden /><span data-cyphr-motion-label>Pause ambient</span></button>
            {!onBackToCard && <a className="cyphr-btn-ghost" href="#cyphr">Card overview</a>}
            {!onNextProject && <a className="cyphr-btn-accent" href="#project-eazyshop">Next project <ArrowRight size={13} aria-hidden /></a>}
            {onBackToCard && (
              <button
                type="button"
                onClick={onBackToCard}
                className="cyphr-btn-ghost"
                title="Scroll back to card summary"
              >
                Card Overview
              </button>
            )}
            {onNextProject && (
              <button
                type="button"
                onClick={onNextProject}
                className="cyphr-btn-accent"
                title="Proceed to next project"
              >
                <span>Next Project</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </header>

        {/* TELEMETRY STRIP */}
        <div className="cyphr-telemetry-banner">
          <div className="cyphr-telemetry-chip">
            <ShieldCheck size={14} className="cyphr-icon-lime" />
            <span>125 Tests Passing</span>
          </div>
          <div className="cyphr-telemetry-chip">
            <Cpu size={14} className="cyphr-icon-blue" />
            <span>Jina v3 1024-D Index</span>
          </div>
          <div className="cyphr-telemetry-chip">
            <Lock size={14} className="cyphr-icon-lime" />
            <span>Per-User Isolation</span>
          </div>
          <div className="cyphr-telemetry-chip">
            <CheckCircle2 size={14} className="cyphr-icon-blue" />
            <span>Source-File &amp; Page Citations</span>
          </div>
        </div>

        {/* HERO / MISSION STATEMENT */}
        <div className="cyphr-hero-statement" data-cyphr-alive>
          <div className="cyphr-kicker">
            <span className="cyphr-kicker-mark" aria-hidden />
            <span>Evidence-Led Engineering</span>
            <span className="cyphr-kicker-rule" aria-hidden />
            <span>{project.category}</span>
          </div>
          <h2 id="cyphr-story-title"><span className="cyphr-title-word">Every answer</span>{" "}<span className="cyphr-title-word">earns its</span>{" "}<span className="cyphr-title-word cyphr-title-evidence">evidence.<span className="cyphr-title-underline" aria-hidden="true" /></span></h2>
          <p className="cyphr-statement-body">
            A plausible answer is not the same as a supported one. CYPHR turns uploaded documents into a searchable knowledge base and brings source-file and page citations into the chat experience.
          </p>
        </div>

        {/* PROOF SHOWCASE: SOURCE -> VECTOR BRIDGE -> CITED ANSWER */}
        <div className="cyphr-showcase-panel" data-cyphr-alive>
          <div className="cyphr-card-label">
            <span>01</span>
            <span>Illustrative retrieval flow · sample data, not a benchmark</span>
          </div>

          <div className="cyphr-proof-layout">
            {/* Raw Ingestion Source */}
            <div className="cyphr-proof-col cyphr-proof-source" id="cyphr-example-source" tabIndex={-1}>
              <div className="cyphr-proof-header">
                <FileText size={15} className="cyphr-icon-blue" />
                <span className="font-mono text-xs font-semibold">Source: audit_report_2025.pdf</span>
                <span className="cyphr-mini-badge">p. 14</span>
              </div>
              <div className="cyphr-passage-box">
                  <span className="cyphr-token-tag">{"// Example source passage • Chunk #42"}</span>
                <p>
                  &ldquo;...Operating margins in Q3 reached 28.4%, representing a 14% efficiency gain in internal search operations.{" "}
                  <mark className="cyphr-proof-highlight">
                    The transition from sparse keyword search to localized dense vector retrieval reduced query latency from 320ms to 18ms across all enterprise tenants...
                  </mark>{" "}
                  Overall cash flow remains steady.&rdquo;
                </p>
              </div>
              <div className="cyphr-passage-footer">
                <span>PDF Header: Financial Performance &bull; Section 3.2</span>
              </div>
            </div>

            {/* Vector Bridge Indicator */}
            <div className="cyphr-proof-bridge">
              <div className="cyphr-bridge-chip">
                <BrainCircuit size={15} className="cyphr-icon-lime" />
                <span className="font-mono text-xs font-semibold">1024-D Vector Match</span>
                <div className="cyphr-bridge-metrics">
                  <span>Cosine: <strong>0.894</strong></span>
                  <span>Latency: <strong>18ms</strong></span>
                </div>
              </div>
              <div className="cyphr-bridge-vector-line" aria-hidden="true">
                <span className="cyphr-proof-packet" />
                <ArrowRight size={16} />
              </div>
            </div>

            {/* Grounded Cited Answer */}
            <div className="cyphr-proof-col cyphr-proof-answer">
              <div className="cyphr-proof-header">
                <Sparkles size={15} className="cyphr-icon-lime" />
                <span className="font-mono text-xs font-semibold">CYPHR Cited Answer</span>
                <span className="cyphr-mini-badge cyphr-badge-lime">Source Cited</span>
              </div>
              <div className="cyphr-answer-box">
                <p>
                  In Q3, operating margins expanded to <strong>28.4%</strong>, driven by a <strong>14% operational efficiency gain</strong> following the deployment of localized dense vector retrieval, which decreased search latency to 18ms.
                </p>
                <a className="cyphr-citation-pill" href="#cyphr-example-source" aria-label="Inspect illustrative source passage, audit report, page 14">
                  <FileText size={11} className="cyphr-icon-blue" />
                  <span>audit_report_2025.pdf &bull; Page 14</span>
                  <span className="cyphr-citation-score">Cosine: 0.894</span>
                </a>
              </div>
              <div className="cyphr-passage-footer">
                <span>Read the citation. Check the source.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CINEMATIC SCROLL-DRIVEN ARCHITECTURE — unfolds as you scroll, no clicks needed */}
        <div className="cyphr-architecture-section">
          <div className="cyphr-architecture-heading">
            <div>
              <div className="cyphr-card-label"><span>02</span><span>System Architecture • Unfolds as You Scroll</span></div>
              <h3>The 5 core layers of CYPHR.</h3>
            </div>
            <p>
              Follow one document through the system. The diagram evolves with each chapter; the engineering story stays in ordinary reading flow.
            </p>
          </div>

          {/* Scroll-progress rail — active stage updates automatically as you scroll */}
          <nav className="cyphr-pipeline-rail" aria-label="CYPHR architecture chapters">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <a
                  key={node.id}
                  data-cyphr-chapter-link
                  href={`#cyphr-stage-${node.id}`}
                  aria-current={index === 0 ? "step" : undefined}
                  className={cn("cyphr-rail-stop", index === 0 && "is-active")}
                >
                  <span className="cyphr-rail-icon"><Icon size={13} strokeWidth={1.8} /></span>
                  <span className="cyphr-rail-num">{node.number}</span>
                  <span className="cyphr-rail-name">{node.shortLabel}</span>
                </a>
              );
            })}
          </nav>

          <div className="cyphr-architecture-body">
            <aside className="cyphr-movie-stage" data-cyphr-movie-stage data-cyphr-alive hidden aria-hidden="true">
              <div className="cyphr-movie-topline"><span>Document → answer</span><span data-cyphr-readout>01 / 05</span></div>
              <div className="cyphr-movie-progress"><span data-cyphr-progress /></div>
              <div className="cyphr-movie-words">
                {MOVIE_WORDS.map((word, index) => <div key={word} data-cyphr-phase-label hidden={index !== 0}><strong>{word}</strong><p>{MOVIE_CAPTIONS[index]}</p></div>)}
              </div>
              <CyphrDocumentScene stage />
              <p className="cyphr-movie-note">Architecture illustration / not live telemetry</p>
            </aside>
          {/* Sequential chapters remain outside the sticky diagram. */}
          <div className="cyphr-stage-sequence">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const isCopied = copiedStageId === node.id && copyStatus === "copied";
              const copyFailed = copiedStageId === node.id && copyStatus === "error";
              return (
                <div key={node.id} className="cyphr-stage-entry">
                  <article
                    data-stage-id={node.id}
                    id={`cyphr-stage-${node.id}`}
                    tabIndex={-1}
                    aria-labelledby={`cyphr-stage-title-${node.id}`}
                    className={cn("cyphr-stage-panel", index === 0 && "is-active")}
                  >
                    <span className="cyphr-stage-ambient-num" aria-hidden="true">{node.number}</span>
                    <div className="cyphr-stage-panel-inner">
                      {/* Left: Narrative & Specs */}
                      <div className="cyphr-stage-narrative">
                        <div className="cyphr-stage-cap">
                          <div className="cyphr-stage-icon-wrap">
                            <Icon size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                            <span className="cyphr-stage-count">{node.number} of 05</span>
                            <div className="cyphr-stage-layer-label">{node.label}</div>
                          </div>
                        </div>

                        <h4 id={`cyphr-stage-title-${node.id}`} className="cyphr-stage-headline">{node.headline}</h4>
                        <p className="cyphr-stage-desc">{node.description}</p>
                        <div className="cyphr-chapter-route" aria-hidden="true"><span>{CHAPTER_ROUTES[index][0]}</span><ArrowRight size={16} /><strong>{CHAPTER_ROUTES[index][1]}</strong></div>

                        <div className="cyphr-specs-grid">
                          {node.specs.map((spec) => (
                            <div key={spec.label} className="cyphr-spec-item">
                              <span className="cyphr-spec-name">{spec.label}</span>
                              <strong className="cyphr-spec-value">{spec.val}</strong>
                            </div>
                          ))}
                        </div>

                        <div className="cyphr-detail-proof">
                          <span>Project Evidence</span>
                          <p>{node.proof}</p>
                        </div>

                        <div className="cyphr-chip-row cyphr-detail-tags">
                          {node.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      </div>

                      {/* Native-flow shots scrub locally; CSS stills survive no JS/reduced motion. */}
                      <div className="cyphr-stage-code-col">
                        <figure className="cyphr-inline-figure" data-cyphr-inline-figure={node.id} data-cyphr-alive>
                          <CyphrDocumentScene phase={index} />
                          <div className="cyphr-inline-trace" aria-hidden="true"><span /></div>
                          <figcaption>{MOVIE_CAPTIONS[index]}</figcaption>
                        </figure>
                        <div className="cyphr-code-window">
                          <div className="cyphr-code-window-bar">
                            <div className="cyphr-code-tab">
                              <Terminal size={11} className="cyphr-icon-lime" />
                              <span>Illustrative · {FILE_NAMES[node.id]}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(node.id, node.codeSnippet)}
                              className="cyphr-copy-code-btn"
                              title="Copy code snippet"
                              aria-label={`Copy illustrative ${node.label.toLowerCase()} snippet`}
                            >
                              {isCopied
                                ? <Check size={11} className="cyphr-icon-lime" />
                                : <Copy size={11} />}
                              <span aria-live="polite">{isCopied ? "Copied" : "Copy"}</span>
                            </button>
                          </div>

                          <pre className="cyphr-code-editor">
                            <code>{node.codeSnippet}</code>
                          </pre>
                          {copyFailed && <p role="status" className="cyphr-copy-error">Copy unavailable. Select the snippet to copy it manually.</p>}

                          <div className="cyphr-code-window-footer">
                            <span className="cyphr-code-status">
                              <span className="cyphr-status-dot-mini" /> 125 tests passing
                            </span>
                            <span className="cyphr-code-lang-tag">Conceptual example</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Inter-stage connector */}
                  {index < nodes.length - 1 && (
                    <div className="cyphr-stage-connector" aria-hidden="true">
                      <div className="cyphr-connector-line" />
                      <div className="cyphr-connector-badge">
                        <ArrowDown size={11} />
                        <span>Next: {nodes[index + 1].label}</span>
                      </div>
                      <div className="cyphr-connector-line" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>

        {/* PRODUCTION HARDENING BENTO GRID */}
        <div className="cyphr-bento-section">
          <div className="cyphr-card-label">
            <span>03</span>
            <span>Production Engineering Standards</span>
          </div>

          <div className="cyphr-bento-grid">
            <div className="cyphr-bento-card">
              <div className="cyphr-bento-icon"><ShieldCheck size={20} className="cyphr-icon-lime" /></div>
              <span className="cyphr-bento-stat">125</span>
              <h4>Automated Test Coverage</h4>
              <p>125 automated security and regression tests support the project&apos;s release workflow.</p>
              <div className="cyphr-bento-foot">Security &amp; regression coverage</div>
            </div>

            <div className="cyphr-bento-card">
              <div className="cyphr-bento-icon"><Lock size={20} className="cyphr-icon-blue" /></div>
              <span className="cyphr-bento-stat">Scoped</span>
              <h4>Per-User Tenant Isolation</h4>
              <p>Retrieval is scoped to the authenticated user, with CSRF and origin validation at the application boundary.</p>
              <div className="cyphr-bento-foot">Google OAuth · access boundaries</div>
            </div>

            <div className="cyphr-bento-card">
              <div className="cyphr-bento-icon"><BrainCircuit size={20} className="cyphr-icon-lime" /></div>
              <span className="cyphr-bento-stat">6</span>
              <h4>Supported Model Providers</h4>
              <p>Six configurable providers with runtime model selection keep the model layer flexible.</p>
              <div className="cyphr-bento-foot">Configurable model selection</div>
            </div>

            <div className="cyphr-bento-card">
              <div className="cyphr-bento-icon"><CheckCircle2 size={20} className="cyphr-icon-blue" /></div>
              <span className="cyphr-bento-stat">Cited</span>
              <h4>Evidentiary Verification</h4>
              <p>Source-file and page citations give readers a way to check responses against their uploaded documents.</p>
              <div className="cyphr-bento-foot">Source file &amp; page provenance</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="cyphr-footer">
          <div><span className="cyphr-footer-pulse" aria-hidden /> {project.title} &bull; Enterprise RAG System</div>
          <div className="cyphr-footer-links">
            {project.links?.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}<ArrowUpRight size={14} aria-hidden />
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
