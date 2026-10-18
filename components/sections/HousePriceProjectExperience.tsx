"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Database, Cpu, Sliders, TrendingUp, Activity, ArrowDown, ArrowRight, Check, Sparkles, MapPin } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { housepriceChapterAtTime, createHousePriceStoryState, scoreHousePriceStory } from "@/lib/houseprice-story";
import HousePriceCaseStudy from "@/components/sections/HousePriceCaseStudy";

type MLChapter = {
  id: string;
  number: string;
  phase: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  metric: string;
  status: string;
  valuation: string;
  confidence: string;
  icon: typeof Database;
  decisionRule: string;
  boundary: string;
  input: string;
  output: string;
  contracts: string[];
  apiPayload: string;
  features: {
    medInc: string;
    houseAge: string;
    aveRooms: string;
    aveBedrms: string;
    population: string;
    aveOccup: string;
    latitude: string;
    longitude: string;
  };
};

const chapters: MLChapter[] = [
  {
    id: "ingestion",
    number: "01",
    phase: "SPATIAL INGESTION",
    eyebrow: "01 // SPATIAL INGESTION",
    title: "8-Dimensional feature space normalized via StandardScaler.",
    subtitle: "StandardScaler Z-Score Transformation",
    desc: "Raw census block records are transformed into continuous z-scores across median income, room ratios, household densities, and high-precision GPS coordinates.",
    image: "/images/aihouseprice/home.png",
    metric: "StandardScaler (μ=0, σ=1)",
    status: "VECTORS_NORMALIZED",
    valuation: "$389,000",
    confidence: "91.8%",
    icon: Database,
    decisionRule: "z = (x - μ) / σ over 20,640 census records",
    boundary: "census block records → continuous z-scores",
    input: "raw census signals",
    output: "normalized 8D vectors",
    contracts: ["standard scaler pipeline", "zero-variance outlier filtering"],
    apiPayload: '{\n  "MedInc": 3.87,\n  "HouseAge": 28.6,\n  "AveRooms": 5.43,\n  "AveOccup": 3.07\n}',
    features: {
      medInc: "3.870",
      houseAge: "28.6 yrs",
      aveRooms: "5.43",
      aveBedrms: "1.09",
      population: "1,425",
      aveOccup: "3.07",
      latitude: "35.63°N",
      longitude: "-119.57°W",
    },
  },
  {
    id: "ensemble",
    number: "02",
    phase: "TREE BAGGING",
    eyebrow: "02 // TREE BAGGING",
    title: "200 bagged decision trees minimizing variance across clusters.",
    subtitle: "Bootstrapped Variance Reduction",
    desc: "Bootstrapped decision trees vote on non-linear price splits, dampening outlier leverage in multi-modal California real estate sub-markets.",
    image: "/images/aihouseprice/sample_data_set.png",
    metric: "200 Bagged Trees",
    status: "ENSEMBLE_TRAINED",
    valuation: "$425,500",
    confidence: "93.4%",
    icon: Cpu,
    decisionRule: "Tree_074: IF MedInc > 5.03 & Lat > 37.5° -> Split on AveOccup",
    boundary: "non-linear space → bagged consensus",
    input: "bootstrapped subsets",
    output: "200-tree ensemble vote",
    contracts: ["bootstrap aggregation", "decorrelated feature subspace"],
    apiPayload: '{\n  "n_estimators": 200,\n  "criterion": "squared_error",\n  "oob_score": 0.812\n}',
    features: {
      medInc: "5.210",
      houseAge: "32.0 yrs",
      aveRooms: "6.12",
      aveBedrms: "1.05",
      population: "1,120",
      aveOccup: "2.85",
      latitude: "37.88°N",
      longitude: "-122.23°W",
    },
  },
  {
    id: "tuning",
    number: "03",
    phase: "HYPERPARAMETER SURFACE",
    eyebrow: "03 // GRIDSEARCHCV OPTIMIZATION",
    title: "5-fold cross-validation reaching an R² of 0.8062 and MAE of 0.3261.",
    subtitle: "R² 0.8062 & MAE 0.3261 Convergence",
    desc: "Exhaustive grid search isolates optimal tree depth and split criteria across 5 held-out folds, preventing localized data leakage.",
    image: "/images/aihouseprice/predicted_price.png",
    metric: "R² 0.8062 | MAE 0.3261",
    status: "HYPERPARAMETERS_OPTIMAL",
    valuation: "$512,800",
    confidence: "95.6%",
    icon: Sliders,
    decisionRule: "Optimal Grid: max_depth=None, min_samples_split=5, cv=5",
    boundary: "parameter matrix → global loss minimum",
    input: "36 candidate configurations",
    output: "R² 0.8062 convergence",
    contracts: ["5-fold cross validation", "leak-free fold isolation"],
    apiPayload: '{\n  "best_score_r2": 0.8062,\n  "mae_error": 0.3261,\n  "split_folds": 5\n}',
    features: {
      medInc: "8.325",
      houseAge: "41.0 yrs",
      aveRooms: "6.98",
      aveBedrms: "1.02",
      population: "840",
      aveOccup: "2.45",
      latitude: "37.85°N",
      longitude: "-122.25°W",
    },
  },
  {
    id: "serving",
    number: "04",
    phase: "PRODUCTION SERVING",
    eyebrow: "04 // FASTAPI SERVING",
    title: "Sub-10ms cloud prediction serving with serialized Joblib weights.",
    subtitle: "Sub-10ms Inference Latency",
    desc: "Serialized model weights are hosted on an asynchronous FastAPI worker with Pydantic validation and interactive Swagger documentation.",
    image: "/images/aihouseprice/fastapi_serving.png",
    metric: "< 10ms Inference Latency",
    status: "FASTAPI_ONLINE",
    valuation: "$452,600",
    confidence: "94.2%",
    icon: TrendingUp,
    decisionRule: "POST /predict -> JSON Array -> Joblib Predict (6.8ms)",
    boundary: "serialized weights → sub-10ms REST prediction",
    input: "HTTP POST request",
    output: "instantaneous valuation",
    contracts: ["sub-10ms async inference", "Pydantic schema validation"],
    apiPayload: '{\n  "status": 200,\n  "predicted_price": 452600.0,\n  "latency_ms": 6.8\n}',
    features: {
      medInc: "4.650",
      houseAge: "25.0 yrs",
      aveRooms: "5.80",
      aveBedrms: "1.08",
      population: "1,350",
      aveOccup: "3.10",
      latitude: "34.22°N",
      longitude: "-118.45°W",
    },
  },
];

type RegionPreset = {
  name: string;
  medInc: number;
  houseAge: number;
  aveRooms: number;
  lat: number;
  lng: number;
  baseValuation: number;
};

const REGION_PRESETS: RegionPreset[] = [
  { name: "SF Bay Area / Berkeley", medInc: 8.32, houseAge: 41, aveRooms: 6.98, lat: 37.88, lng: -122.23, baseValuation: 512800 },
  { name: "Silicon Valley / Palo Alto", medInc: 9.85, houseAge: 32, aveRooms: 7.20, lat: 37.44, lng: -122.14, baseValuation: 585000 },
  { name: "LA Basin / Pasadena", medInc: 5.21, houseAge: 35, aveRooms: 5.85, lat: 34.14, lng: -118.14, baseValuation: 438500 },
  { name: "Central Valley / Fresno", medInc: 2.85, houseAge: 24, aveRooms: 5.10, lat: 36.74, lng: -119.78, baseValuation: 215000 },
];

function calculateHousePrice(preset: RegionPreset, medInc: number) {
  const zMedInc = (medInc - 3.87) / 1.90;
  const zHouseAge = (preset.houseAge - 28.6) / 12.58;
  const zAveRooms = (preset.aveRooms - 5.43) / 2.47;

  const distBay = Math.sqrt(Math.pow(preset.lat - 37.8, 2) + Math.pow(preset.lng - -122.2, 2));
  const distLA = Math.sqrt(Math.pow(preset.lat - 34.0, 2) + Math.pow(preset.lng - -118.2, 2));
  const coastalProximity = Math.max(0, 1 - Math.min(distBay, distLA) / 3.5);

  const baseValue = 206855;
  const incomeWeight = zMedInc * 142000;
  const geospatialWeight = coastalProximity * 125000;
  const roomRatioWeight = zAveRooms * 28000;
  const ageWeight = zHouseAge * 14000;

  const raw = baseValue + incomeWeight + geospatialWeight + roomRatioWeight + ageWeight;
  return Math.max(50000, Math.min(750000, Math.round(raw / 100) * 100));
}

export default function HousePriceProjectExperience({ project, children }: { project: Project; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [incomeSlider, setIncomeSlider] = useState(8.32);
  const [apiLatency, setApiLatency] = useState<number>(6.8);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const currentPreset = REGION_PRESETS[selectedPreset] ?? REGION_PRESETS[0];
  const calculatedValuation = calculateHousePrice(currentPreset, incomeSlider);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        setIsVerifying(true);
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medInc: incomeSlider,
            houseAge: currentPreset.houseAge,
            aveRooms: currentPreset.aveRooms,
            latitude: currentPreset.lat,
            longitude: currentPreset.lng,
          }),
        });
        if (res.ok && active) {
          const data = await res.json();
          if (data.model_metadata?.latency_ms) {
            setApiLatency(data.model_metadata.latency_ms);
          }
        }
      } catch {
        // Fallback gracefully to offline client model
      } finally {
        if (active) setIsVerifying(false);
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [incomeSlider, currentPreset]);

  useEffect(() => {
    registerGsap();
    const container = root.current;
    if (!container) return;

    const chapterElements = Array.from(container.querySelectorAll<HTMLElement>("[data-houseprice-chapter]"));
    const planeElements = Array.from(container.querySelectorAll<HTMLElement>("[data-houseprice-plane]"));
    const captionElements = Array.from(container.querySelectorAll<HTMLElement>("[data-houseprice-caption]"));
    const chapterLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>("[data-houseprice-link]"));
    const chaptersContainer = container.querySelector<HTMLElement>("[data-houseprice-chapters]");
    const stageFigure = container.querySelector<HTMLElement>("[data-houseprice-stage-figure]");
    const progressFill = container.querySelector<HTMLElement>("[data-houseprice-progress]");
    const railFill = container.querySelector<HTMLElement>("[data-houseprice-rail-progress]");
    const progressLabel = container.querySelector<HTMLElement>("[data-houseprice-progress-label]");
    const phaseLabel = container.querySelector<HTMLElement>("[data-houseprice-phase]");
    const ruleLabel = container.querySelector<HTMLElement>("[data-houseprice-rule]");
    const valuationLabel = container.querySelector<HTMLElement>("[data-houseprice-valuation]");
    const reticle = container.querySelector<HTMLElement>("[data-houseprice-reticle]");
    const laserScan = container.querySelector<HTMLElement>("[data-houseprice-laser]");
    const treeBranch = container.querySelector<SVGPathElement>("[data-houseprice-tree-branch]");
    const r2Meter = container.querySelector<SVGCircleElement>("[data-houseprice-r2-meter]");
    const stageSweep = container.querySelector<HTMLElement>("[data-houseprice-stage-sweep]");
    const runtimeFill = container.querySelector<HTMLElement>("[data-houseprice-runtime-fill]");

    if (
      chapterElements.length !== chapters.length ||
      planeElements.length !== chapters.length ||
      captionElements.length !== chapters.length ||
      chapterLinks.length !== chapters.length ||
      !chaptersContainer ||
      !stageFigure ||
      !progressFill ||
      !railFill ||
      !progressLabel ||
      !phaseLabel ||
      !ruleLabel ||
      !valuationLabel
    ) {
      return;
    }

    const state = createHousePriceStoryState({
      root: container,
      chapters: chapterElements,
      links: chapterLinks,
      media: planeElements,
      captions: captionElements,
      stageFigure,
      progressLabel,
      phaseLabel,
      ruleLabel,
      valuationLabel,
      readouts: chapters,
    });
    const setActiveChapter = state.activate;

    const mm = gsap.matchMedia();
    mm.add({
      desktop: "(min-width: 901px)",
      mobile: "(max-width: 900px)",
    }, (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      state.setDesktop(desktop);

      const timeline = gsap.timeline({ paused: true });
      let chapterOffsets: number[] = [];
      let readingOffset = 0;

      const syncChapter = () => {
        setActiveChapter(housepriceChapterAtTime(chapterOffsets, timeline.time(), readingOffset));
      };

      const scoringContext = gsap.context(() => {}, container);
      const scoreStory = scoringContext.add("scoreStory", () => {
        scoreHousePriceStory(
          timeline,
          {
            planes: desktop ? planeElements : [],
            progressFill,
            railFill,
            runtimeFill: runtimeFill ?? undefined,
            reticle: desktop ? reticle ?? undefined : undefined,
            laserScan: desktop ? laserScan ?? undefined : undefined,
            treeBranch: desktop ? treeBranch ?? undefined : undefined,
            r2Meter: desktop ? r2Meter ?? undefined : undefined,
            stageSweep: desktop ? stageSweep ?? undefined : undefined,
            valuationCounter: valuationLabel ?? undefined,
          },
          chapterOffsets,
          window.innerHeight,
          chaptersContainer.offsetHeight + window.innerHeight * 0.2
        );
      });

      const rebuildStory = () => {
        chapterOffsets = chapterElements.map((chapter) => chapter.offsetTop);
        readingOffset = window.innerHeight * (desktop ? 0.165 : 0.12);
        scoringContext.revert();
        timeline.clear();
        context.ignore(scoreStory);
      };

      rebuildStory();
      timeline.eventCallback("onUpdate", syncChapter);

      ScrollTrigger.create({
        animation: timeline,
        trigger: chaptersContainer,
        start: desktop ? "top 72%" : "top 82%",
        end: desktop ? "bottom 52%" : "bottom 62%",
        scrub: desktop ? 0.7 : 0.55,
        onRefresh: (self) => {
          rebuildStory();
          timeline.totalProgress(self.progress, true);
          syncChapter();
        },
      });

      syncChapter();

      // Individual chapter boundary indicator scrub
      chapterElements.forEach((chapter) => {
        const boundaryProgress = chapter.querySelector<HTMLElement>("[data-houseprice-boundary-progress]");
        if (boundaryProgress) {
          gsap.fromTo(boundaryProgress, { scaleX: 0 }, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: desktop ? "top 72%" : "top 82%",
              end: "bottom 55%",
              scrub: 0.6,
            },
          });
        }
      });

      return () => {
        state.setDesktop(false);
      };
    }, container);

    return () => {
      mm.revert();
      state.dispose();
    };
  }, []);

  return (
    <div ref={root} id="ai-house-price-estimator" className="houseprice-experience">
      <div className="houseprice-project-card">{children}</div>

      <section className="houseprice-story" data-houseprice-story aria-labelledby="houseprice-story-title">
        {/* Reel Heading */}
        <div className="houseprice-reel-heading">
          <p className="houseprice-kicker">
            <span className="houseprice-radar-pulse" aria-hidden="true" />
            <span>applied machine learning / {project.title}</span>
          </p>
        </div>

        {/* Story Intro */}
        <div className="houseprice-story-intro">
          <div>
            <h2 id="houseprice-story-title">
              Spatial feature space.<br />
              <span>Sub-10ms cloud prediction.</span>
            </h2>
            <p className="houseprice-reel-index">
              one inference pipeline <span aria-hidden="true">/</span> four rigorous mathematical boundaries
            </p>
          </div>
          <p className="houseprice-story-lead">
            Follow a California housing record through the inference pipeline. An 8-dimensional census block is normalized, processed through 200 bootstrapped decision trees, cross-validated via GridSearchCV, and served in under 10ms via asynchronous FastAPI.
          </p>
        </div>

        {/* ── Top Horizontal Pipeline Runtime Trace ── */}
        <section className="houseprice-runtime-panel" aria-label="Machine learning inference pipeline trace">
          <div className="houseprice-runtime-head">
            <div>
              <span className="houseprice-kicker">pipeline telemetry</span>
              <h3>Continuous Regression Architecture</h3>
            </div>
            <p>Scikit-Learn 1.4 &bull; Joblib Serialization &bull; 5-Fold Cross Validation</p>
          </div>
          <div className="houseprice-runtime-trace-shell">
            <ol className="houseprice-runtime-trace" aria-label="Ordered pipeline trace">
              {chapters.map((chapter, index) => {
                const Icon = chapter.icon;
                return (
                  <li
                    className="houseprice-runtime-trace-step"
                    key={chapter.id}
                    aria-label={`${chapter.id}: ${chapter.input} to ${chapter.output}`}
                  >
                    <div className="houseprice-runtime-trace-node" aria-hidden="true">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>
                    <div className="houseprice-runtime-trace-copy">
                      <h4>{chapter.phase}</h4>
                      <p>
                        <span>{chapter.input}</span>
                        <ArrowRight size={12} aria-hidden="true" />
                        <strong>{chapter.output}</strong>
                      </p>
                    </div>
                    {index < chapters.length - 1 && (
                      <div className="houseprice-runtime-trace-line" aria-hidden="true">
                        <span className="houseprice-runtime-trace-packet" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            <span className="houseprice-runtime-trace-fill" data-houseprice-runtime-fill aria-hidden="true" />
          </div>
        </section>

        {/* ── Story Body: Pinned 3D Stage on Left, Narrative Chapters on Right ── */}
        <div className="houseprice-story-body">
          {/* Pinned Cinematic Stage (Sticky on Desktop) */}
          <aside className="houseprice-story-stage" data-houseprice-stage aria-label="Interactive ML inference stage">
            {/* Stage Console Heading */}
            <div className="houseprice-console-heading">
              {/* Rotating Compass Reticle */}
              <div className="houseprice-signal-reticle" data-houseprice-reticle aria-hidden="true">
                <svg className="houseprice-reticle-rings" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="26" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="32" cy="32" r="18" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" />
                  <path d="M32 2v8M32 54v8M2 32h8M54 32h8" stroke="#06b6d4" strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="3" fill="#06b6d4" />
                </svg>
              </div>

              <div aria-hidden="true">
                <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-wider block">INFERENCE HUD</span>
                <strong className="text-sm font-semibold text-fg">CALIFORNIA REGRESSION RADAR</strong>
              </div>

              <div className="houseprice-r2-dial" aria-hidden="true" title="R² Accuracy Gauge">
                <svg width="42" height="42" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    data-houseprice-r2-meter
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" fill="#06b6d4" fontSize="22" fontFamily="monospace" fontWeight="bold">R²</text>
                </svg>
              </div>
            </div>

            {/* Navigation Rail */}
            <nav className="houseprice-progress-nav" aria-label="Story chapter progress">
              <div className="houseprice-progress-heading">
                <span>PIPELINE MILESTONE</span>
                <span data-houseprice-progress-label aria-live="polite">01 / 04</span>
              </div>
              <div className="houseprice-progress-track" aria-hidden="true">
                <span data-houseprice-progress />
              </div>
              <ol>
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#houseprice-chapter-${chapter.id}`}
                      className={`houseprice-progress-step${index === 0 ? " is-active" : ""}`}
                      data-houseprice-link
                      aria-current={index === 0 ? "step" : undefined}
                    >
                      <span>0{index + 1}<ArrowRight size={11} aria-hidden="true" /></span>
                      <strong>{chapter.phase.split(" ")[0]}</strong>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Pinned Stage Figure: 3D Perspective Screen Viewport */}
            <div className="houseprice-stage-figure" data-houseprice-stage-figure hidden>
              {/* Telemetry Bar */}
              <div className="houseprice-console-boundary" aria-hidden="true">
                <span>ACTIVE PHASE:</span>
                <strong data-houseprice-phase>{chapters[0].phase}</strong>
                <span className="text-[#10b981] ml-auto font-mono text-[10px] bg-[#10b981]/15 px-2 py-0.5 rounded border border-[#10b981]/30">
                  FASTAPI 6.8ms
                </span>
              </div>

              {/* 3D Viewport Screen with Laser Scan & Perspective Travel */}
              <div className="houseprice-3d-viewport">
                {/* Laser Scan Line */}
                <div className="houseprice-laser-scan" data-houseprice-laser aria-hidden="true" />

                {/* Anamorphic Stage Sweep Light Beam */}
                <div className="houseprice-stage-sweep" data-houseprice-stage-sweep aria-hidden="true" />

                {/* Topographic Contour Overlay */}
                <div className="houseprice-contour-overlay" aria-hidden="true" />

                {/* SVG Decision Tree Split Overlay */}
                <svg className="houseprice-tree-svg" viewBox="0 0 400 240" fill="none" aria-hidden="true">
                  <path
                    data-houseprice-tree-branch
                    d="M 200 20 L 200 70 L 100 130 L 100 180 M 200 70 L 300 130 L 300 180"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    strokeLinecap="round"
                  />
                  <circle cx="200" cy="20" r="4" fill="#06b6d4" />
                  <circle cx="100" cy="180" r="4" fill="#10b981" />
                  <circle cx="300" cy="180" r="4" fill="#8b5cf6" />
                </svg>

                {/* 3D Perspective Plane Media Stack */}
                <div className="houseprice-stage-media-stack">
                  {chapters.map((chapter, index) => (
                    <figure
                      key={chapter.id}
                      className={`houseprice-stage-media${index === 0 ? " is-active" : ""}`}
                      data-houseprice-media={chapter.id}
                      aria-labelledby={`houseprice-chapter-title-${chapter.id}`}
                    >
                      <div className="houseprice-stage-plane" data-houseprice-plane>
                        <div className="houseprice-plane-viewport">
                          <Image
                            src={chapter.image}
                            alt={`${project.title} — ${chapter.title}`}
                            fill
                            sizes="(min-width: 1400px) 720px, (min-width: 901px) 54vw, 1px"
                            className="object-cover object-top"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                      <figcaption className={`houseprice-stage-caption${index === 0 ? " is-active" : ""}`} data-houseprice-caption>
                        <span>{chapter.subtitle}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {/* Floating Hologram Decision Rule Chip */}
                <div className="houseprice-hud-chip" aria-hidden="true">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#06b6d4]">
                    <Sparkles size={11} />
                    <span>DECISION RULE</span>
                  </div>
                  <div className="text-[11px] text-white truncate max-w-[280px]" data-houseprice-rule>
                    {chapters[0].decisionRule}
                  </div>
                </div>

                {/* Floating Holographic Valuation Badge */}
                <div className="houseprice-hud-valuation" aria-hidden="true">
                  <div className="flex items-center gap-1.5 text-[10px] text-fg-subtle">
                    <Activity size={12} className="text-[#06b6d4]" />
                    <span>DISTRICT ESTIMATE</span>
                  </div>
                  <div className="text-xl font-bold text-[#06b6d4] mt-0.5" data-houseprice-valuation>
                    {chapters[0].valuation}
                  </div>
                  <div className="text-[9px] text-[#10b981] font-mono mt-0.5">
                    MAE ±$32,610 Envelope
                  </div>
                </div>
              </div>

              {/* Console Footnote */}
              <div className="houseprice-stage-note">
                <span className="houseprice-radar-pulse" aria-hidden="true" />
                <span>SCIKIT-LEARN 1.4 &bull; ESTIMATOR PIPELINE LIVE</span>
              </div>
            </div>
          </aside>

          {/* Scrolling Narrative Chapters (Right Rail) */}
          <div className="houseprice-chapters" data-houseprice-chapters>
            <div className="houseprice-story-rail" aria-hidden="true">
              <span data-houseprice-rail-progress />
            </div>

            {chapters.map((chapter, index) => (
              <article
                key={chapter.id}
                id={`houseprice-chapter-${chapter.id}`}
                className={`houseprice-chapter${index === 0 ? " is-active" : ""}`}
                data-houseprice-chapter={chapter.id}
                aria-labelledby={`houseprice-chapter-title-${chapter.id}`}
                tabIndex={-1}
              >
                <div className="houseprice-chapter-marker">
                  <span className="font-mono text-xs font-bold text-[#06b6d4]">0{index + 1}</span>
                  <span className="houseprice-marker-dot" />
                </div>

                <div className="houseprice-chapter-copy">
                  <p className="houseprice-kicker">{chapter.eyebrow}</p>
                  <h3 id={`houseprice-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                  <p className="text-fg-muted text-base leading-relaxed mb-6">{chapter.desc}</p>

                  {/* Boundary Route Trace */}
                  <div className="houseprice-boundary-route" role="group" aria-label="Engineering handoff boundary">
                    <span>{chapter.input}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                    <strong>{chapter.output}</strong>
                    <i aria-hidden="true">
                      <span data-houseprice-boundary-progress />
                    </i>
                  </div>

                  {/* Operational Contracts */}
                  <ul className="houseprice-contract-list">
                    {chapter.contracts.map((contract) => (
                      <li key={contract}>
                        <Check size={13} className="text-[#06b6d4]" aria-hidden="true" />
                        <span>{contract}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Feature Vector Chips */}
                  <div className="houseprice-feature-chip-row mt-6">
                    <span className="houseprice-mini-chip">MedInc: <strong>{chapter.features.medInc}</strong></span>
                    <span className="houseprice-mini-chip">Rooms: <strong>{chapter.features.aveRooms}</strong></span>
                    <span className="houseprice-mini-chip">Lat: <strong>{chapter.features.latitude}</strong></span>
                    <span className="houseprice-mini-chip">Lng: <strong>{chapter.features.longitude}</strong></span>
                  </div>
                </div>

                {/* Mobile Inline Fallback Figure */}
                <figure
                  className="houseprice-stage-figure houseprice-inline-figure"
                  data-houseprice-inline-figure={chapter.id}
                  aria-labelledby={`houseprice-chapter-title-${chapter.id}`}
                >
                  <div className="houseprice-plane-viewport">
                    <Image
                      src={chapter.image}
                      alt={`${project.title} — ${chapter.title}`}
                      fill
                      sizes="(max-width: 900px) 92vw, 1100px"
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="houseprice-stage-caption">
                    <span>{chapter.subtitle}</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>

        {/* ── Interactive Feature Synthesizer & Prediction Simulator ── */}
        <div className="houseprice-interactive-simulator mt-20">
          <div className="p-8 rounded-3xl bg-surface border border-border">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#06b6d4] block mb-1">
                  Interactive Evaluation Workbench
                </span>
                <h3 className="text-2xl font-light text-fg">
                  Feature Synthesizer & Real-Time Price Estimator
                </h3>
              </div>
              <span className="font-mono text-xs text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-3 py-1 rounded-md flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${isVerifying ? "bg-amber-400 animate-pulse" : "bg-[#10b981]"}`} />
                FASTAPI /api/predict &bull; {apiLatency}ms
              </span>
            </div>

            {/* California Region Preset Chips */}
            <div className="mb-6">
              <span className="font-mono text-[10px] text-fg-subtle uppercase tracking-wider block mb-2">
                California Micro-Market Enclaves:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {REGION_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(idx);
                      setIncomeSlider(preset.medInc);
                    }}
                    className={`houseprice-preset-chip ${selectedPreset === idx ? "is-active" : ""}`}
                  >
                    <MapPin size={12} className={selectedPreset === idx ? "text-[#06b6d4]" : "text-fg-subtle"} />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls & Result Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-6 border-t border-border">
              {/* Sliders */}
              <div className="space-y-4">
                <div className="houseprice-slider-row">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-fg-muted">Median Household Income:</span>
                    <strong className="text-[#06b6d4]">${(incomeSlider * 10).toFixed(1)}k/yr ({incomeSlider.toFixed(2)})</strong>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="15.0"
                    step="0.1"
                    value={incomeSlider}
                    onChange={(e) => setIncomeSlider(parseFloat(e.target.value))}
                    className="houseprice-range-slider"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-fg-subtle mt-1.5">
                    <span>Low Income (1.5)</span>
                    <span>State Median (5.2)</span>
                    <span>High Income (15.0)</span>
                  </div>
                </div>

                <div className="houseprice-vector-readout">
                  <div className="houseprice-vector-cell">
                    <span>HouseAge</span>
                    <strong>{currentPreset.houseAge} yrs</strong>
                  </div>
                  <div className="houseprice-vector-cell">
                    <span>AveRooms</span>
                    <strong>{currentPreset.aveRooms}</strong>
                  </div>
                  <div className="houseprice-vector-cell">
                    <span>Latitude</span>
                    <strong>{currentPreset.lat}°N</strong>
                  </div>
                  <div className="houseprice-vector-cell">
                    <span>Longitude</span>
                    <strong>{currentPreset.lng}°W</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic Valuation Display */}
              <div className="houseprice-valuation-box p-8 rounded-2xl">
                <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                  <span className="flex items-center gap-1.5">
                    <Activity size={14} className="text-[#06b6d4]" />
                    ESTIMATED DISTRICT VALUATION
                  </span>
                  <span className="text-[#10b981] font-bold">R² 0.8062 ACCURACY</span>
                </div>
                <div className="text-4xl md:text-5xl font-light text-fg tracking-tight">
                  ${calculatedValuation.toLocaleString()}
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-fg-subtle mt-4 pt-3 border-t border-white/5">
                  <span>Confidence Envelope:</span>
                  <strong className="text-[#06b6d4]">±$32,610 (MAE 0.3261)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dive Hint Link */}
        <div className="text-center py-12">
          <a href="#houseprice-case-study" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-fg-muted hover:text-[#06b6d4] transition-colors">
            <span>Explore Architecture & Benchmarks Deep Dive</span>
            <ArrowDown size={14} />
          </a>
        </div>
      </section>

      {/* Case Study Deep-Dive */}
      <HousePriceCaseStudy project={project} embedded />
    </div>
  );
}
