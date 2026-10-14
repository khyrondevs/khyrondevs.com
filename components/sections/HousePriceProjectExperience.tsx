"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Terminal, Database, Cpu, Sliders, TrendingUp, Compass, Activity, ArrowDown } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import HousePriceCaseStudy from "@/components/sections/HousePriceCaseStudy";

type MLChapter = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  metric: string;
  status: string;
  valuation: string;
  confidence: string;
  icon: typeof Database;
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
    id: "features",
    number: "01",
    eyebrow: "01 / FEATURE VECTOR SPACE",
    title: "8-Dimensional district space normalized via StandardScaler.",
    desc: "Raw census records are transformed into continuous z-scores across median income, room ratios, household densities, and high-precision GPS coordinates.",
    image: "/images/aihouseprice/home.png",
    metric: "StandardScaler",
    status: "VECTORS_NORMALIZED",
    valuation: "$389,000",
    confidence: "91.8%",
    icon: Database,
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
    eyebrow: "02 / RANDOM FOREST ENSEMBLE",
    title: "200 bagged decision trees minimizing variance across clusters.",
    desc: "Bootstrapped decision trees vote on non-linear price splits, dampening outlier leverage in multi-modal California real estate sub-markets.",
    image: "/images/aihouseprice/sample_data_set.png",
    metric: "200 Bagged Trees",
    status: "ENSEMBLE_TRAINED",
    valuation: "$425,500",
    confidence: "93.4%",
    icon: Cpu,
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
    eyebrow: "03 / GRIDSEARCHCV OPTIMIZATION",
    title: "5-fold cross-validation reaching an R² of 0.8062 and MAE of 0.3261.",
    desc: "Systematic parameter exploration optimizes tree depth and minimum sample splits, verifying statistical generalization on held-out test folds.",
    image: "/images/aihouseprice/predicted_price.png",
    metric: "R² 0.8062",
    status: "WEIGHTS_OPTIMAL",
    valuation: "$512,800",
    confidence: "95.6%",
    icon: Sliders,
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
    eyebrow: "04 / FASTAPI REST INFERENCE",
    title: "Sub-10ms cloud prediction serving with serialized Joblib weights.",
    desc: "Tuned model matrices are serialized into low-overhead Joblib artifacts and served via asynchronous FastAPI endpoints with complete Swagger documentation.",
    image: "/images/aihouseprice/predicted_price.png",
    metric: "< 10ms Latency",
    status: "INFERENCE_LIVE",
    valuation: "$452,600",
    confidence: "94.2%",
    icon: TrendingUp,
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

export default function HousePriceProjectExperience({ project, children }: { project: Project; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    registerGsap();
    const container = root.current;
    if (!container) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const stage = container.querySelector<HTMLElement>(".houseprice-radar-stage");
      const panels = gsap.utils.toArray<HTMLElement>(".houseprice-display-screen-layer");
      if (!stage || !panels.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          pin: true,
          start: "top 80px",
          end: () => `+=${Math.round(chapters.length * 520)}`,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(
              chapters.length - 1,
              Math.floor(self.progress * chapters.length)
            );
            setActiveStep(step);
          },
        },
      });

      return () => {
        tl.kill();
      };
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
    };
  }, []);

  const activeChapter = chapters[activeStep] ?? chapters[0];

  return (
    <div ref={root} id="ai-house-price-estimator" className="houseprice-experience relative w-full">
      <div className="houseprice-project-card">{children}</div>

      {/* Intro Header */}
      <div className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#06b6d4] mb-6">
          <Terminal size={14} /> {project.title} &bull; Hyperdimensional Inference Engine
        </div>
        <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-6 text-fg">
          Applied machine learning <span className="text-[#06b6d4]">at production speed.</span>
        </h2>
        <p className="text-fg-muted max-w-2xl text-lg font-light leading-relaxed">
          From 8-dimensional spatial feature normalization and 200-tree bagging to cross-validated GridSearchCV hyperparameter optimization and sub-10ms FastAPI REST inference.
        </p>
      </div>

      {/* ── Pinned ML Radar Stage ── */}
      <div className="houseprice-stage-container">
        <div className="houseprice-radar-stage">
          {/* Header Telemetry Bar */}
          <div className="houseprice-radar-header">
            <div className="houseprice-telemetry-pill">
              <span className="houseprice-radar-pulse" />
              <span>GEOSPATIAL INFERENCE ENCLAVE // REGRESSION MATRIX</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs text-fg-muted">
              <span>MODEL: <strong className="text-[#06b6d4]">RANDOM FOREST (200 TREES)</strong></span>
              <span className="text-white/20">|</span>
              <span>STATE: <strong className="text-[#8b5cf6]">{activeChapter.status}</strong></span>
            </div>
          </div>

          <div className="houseprice-radar-grid">
            {/* ── Left Deck: Stepper Navigation & Feature Vector Matrix ── */}
            <div className="houseprice-phase-stepper">
              <div className="flex flex-col gap-2.5">
                {chapters.map((ch, idx) => {
                  const Icon = ch.icon;
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={ch.id}
                      className={`houseprice-stepper-btn ${isActive ? "is-active" : ""}`}
                      onClick={() => setActiveStep(idx)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="houseprice-step-number">{ch.number}</span>
                      <div className="houseprice-step-content">
                        <div className="houseprice-step-title">
                          <span className="flex items-center gap-2">
                            <Icon size={15} className={isActive ? "text-[#06b6d4]" : "text-fg-muted"} />
                            {ch.title.split(" ")[0]} {ch.title.split(" ")[1]}
                          </span>
                          <span className="houseprice-step-metric">{ch.metric}</span>
                        </div>
                        <p className="houseprice-step-desc">{ch.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live 8-Dimensional Feature Matrix HUD */}
              <div className="houseprice-feature-matrix">
                <div className="houseprice-feature-cell">
                  <span>MedInc:</span>
                  <strong>{activeChapter.features.medInc}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>HouseAge:</span>
                  <strong>{activeChapter.features.houseAge}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>AveRooms:</span>
                  <strong>{activeChapter.features.aveRooms}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>AveBedrms:</span>
                  <strong>{activeChapter.features.aveBedrms}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>Population:</span>
                  <strong>{activeChapter.features.population}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>AveOccup:</span>
                  <strong>{activeChapter.features.aveOccup}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>Latitude:</span>
                  <strong>{activeChapter.features.latitude}</strong>
                </div>
                <div className="houseprice-feature-cell">
                  <span>Longitude:</span>
                  <strong>{activeChapter.features.longitude}</strong>
                </div>
              </div>
            </div>

            {/* ── Right Deck: Geospatial Telemetry HUD & Holographic Valuation ── */}
            <div className="houseprice-hud-container houseprice-stage-viewport">
              {/* Telemetry Shell */}
              <div className="houseprice-hud-shell">
                <div className="houseprice-hud-topbar">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-fg-muted">
                    <Compass size={13} className="text-[#06b6d4]" />
                    <span>CALIFORNIA HOUSING RADAR HUD // LAYER 0{activeStep + 1}</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-2 py-0.5 rounded">
                    FASTAPI &lt; 10ms
                  </div>
                </div>

                {/* Viewport Screen */}
                <div className="houseprice-viewport-screen">
                  {/* Topographic & Crosshair Overlay */}
                  <div className="houseprice-crosshair-overlay" />

                  {/* Screenshot Layers */}
                  {chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      className={`houseprice-display-screen-layer absolute inset-0 w-full h-full ${activeStep === idx ? "is-active" : ""}`}
                    >
                      <Image
                        src={ch.image}
                        alt={ch.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 680px"
                        className="object-cover object-top"
                        priority={idx === 0}
                      />
                    </div>
                  ))}

                  {/* Floating Hologram Valuation Badge - Positioned inside viewport screen at bottom-right */}
                  <div className="houseprice-valuation-badge">
                    <div className="flex items-center gap-2 text-fg-muted">
                      <Activity size={12} className="text-[#06b6d4]" />
                      <span>DISTRICT VALUATION</span>
                    </div>
                    <div className="houseprice-valuation-amount">{activeChapter.valuation}</div>
                    <div className="text-[9px] text-[#06b6d4] mt-0.5 font-mono">
                      {activeChapter.confidence} Conf &bull; MAE 0.3261
                    </div>
                  </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-fg-muted pt-2 border-t border-white/5">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-ping" />
                    SCIKIT-LEARN 1.4 &bull; JOBLIB SERIALIZATION
                  </span>
                  <span>ESTIMATOR PIPELINE: <strong className="text-white">ACTIVE</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <a href="#houseprice-case-study" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-fg-muted hover:text-[#06b6d4] transition-colors">
          <span>Explore Architecture Deep Dive</span>
          <ArrowDown size={14} />
        </a>
      </div>

      <HousePriceCaseStudy project={project} embedded />
    </div>
  );
}
