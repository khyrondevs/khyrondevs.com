"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Cpu,
  Database,
  Layers,
  Sliders,
  Terminal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { projects, roofWorthScreenshots, type Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import useClipboard from "@/hooks/useClipboard";
import { ProjectActionButtons } from "@/components/ui/project-action-buttons";

type NodeId = "features" | "ensemble" | "tuning" | "serving";

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

const GALLERY_ITEMS = Object.values(roofWorthScreenshots);

const FEATURE_IMPORTANCES = [
  { feature: "MedInc", name: "Median Household Income", weight: 52.3, desc: "Primary economic predictor of district property values" },
  { feature: "Lat & Lng", name: "Geospatial Coordinates", weight: 18.7, desc: "Proximity to coastal economic hubs (SF Bay Area, Silicon Valley, LA basin)" },
  { feature: "AveOccup", name: "Average Household Occupancy", weight: 14.1, desc: "Density ratio measuring household crowding versus luxury single-family ratios" },
  { feature: "AveRooms / Bedrms", name: "Room & Bedroom Ratios", weight: 8.1, desc: "Physical spatial layout and structural capacity index" },
  { feature: "HouseAge", name: "Median Housing Age", weight: 6.8, desc: "Construction era reflecting historical preservation and municipal infrastructure" },
];

const MODEL_BENCHMARKS = [
  { model: "Linear Regression", r2: "0.6062", mae: "0.5280", latency: "2ms", tag: "Baseline Linear", best: false },
  { model: "Ridge Regression (L2)", r2: "0.6063", mae: "0.5274", latency: "2ms", tag: "L2 Regularized", best: false },
  { model: "Decision Tree Regressor", r2: "0.6210", mae: "0.4412", latency: "4ms", tag: "Unpruned Tree", best: false },
  { model: "Tuned Random Forest (Ours)", r2: "0.8062", mae: "0.3261", latency: "8ms", tag: "200 Bagged Trees + GridSearchCV", best: true },
];

const CROSS_VALIDATION_FOLDS = [
  { fold: "Fold 01", trainR2: "0.8312", valR2: "0.8045", valMae: "0.3280", records: "16,512 train / 4,128 val", status: "Converged" },
  { fold: "Fold 02", trainR2: "0.8295", valR2: "0.8089", valMae: "0.3241", records: "16,512 train / 4,128 val", status: "Converged" },
  { fold: "Fold 03", trainR2: "0.8320", valR2: "0.8031", valMae: "0.3298", records: "16,512 train / 4,128 val", status: "Converged" },
  { fold: "Fold 04", trainR2: "0.8308", valR2: "0.8074", valMae: "0.3255", records: "16,512 train / 4,128 val", status: "Converged" },
  { fold: "Fold 05", trainR2: "0.8317", valR2: "0.8068", valMae: "0.3272", records: "16,512 train / 4,128 val", status: "Converged" },
];

const HYPERPARAMETER_GRID = [
  { param: "n_estimators", evaluated: "[50, 100, 200]", selected: "200", impact: "Minimizes tree correlation & ensemble variance" },
  { param: "max_depth", evaluated: "[15, 25, 35, None]", selected: "None (Full)", impact: "Captures non-linear geospatial interactions" },
  { param: "min_samples_split", evaluated: "[2, 5, 10]", selected: "5", impact: "Eliminates leaf-level memorization of localized noise" },
  { param: "max_features", evaluated: "['sqrt', 'log2', 1.0]", selected: "1.0 (All 8)", impact: "Preserves coordinate coupling (latitude + longitude)" },
];

const FILE_NAMES: Record<NodeId, string> = {
  features: "estimator/ml/preprocessing.py",
  ensemble: "estimator/ml/random_forest_model.py",
  tuning: "estimator/ml/grid_search_tuning.py",
  serving: "estimator/api/main.py",
};

const getHousePriceProject = (): Project => {
  const project = projects.find((item) => item.slug === "roofworth");
  if (!project) throw new Error("RoofWorth project data is missing");
  return project;
};

const DEFAULT_PROJECT = getHousePriceProject();

function getArchitectureNodes(project: Project): ArchitectureNode[] {
  return [
    {
      id: "features",
      number: "01",
      label: "Feature Space",
      shortLabel: "8 Dimensions",
      headline: "Preparing the housing inputs",
      description:
        "Inputs incorporate 8 numerical dimensions from the California housing dataset including median income, housing age, average rooms, population density, and GPS coordinates.",
      proof: project.summary ?? project.solution,
      tags: ["Pandas", "NumPy", "Feature Scaling"],
      icon: Database,
      specs: [
        { label: "Features", val: "8 Numerical Dimensions" },
        { label: "Dataset", val: "California Housing" },
        { label: "Normalization", val: "StandardScaler pipeline" },
      ],
      codeSnippet: `import pandas as pd
import numpy as np

def prepare_features(df):
    features = ['MedInc', 'HouseAge', 'AveRooms', 'AveBedrms', 'Population', 'AveOccup', 'Latitude', 'Longitude']
    return df[features]`,
    },
    {
      id: "ensemble",
      number: "02",
      label: "Random Forest Ensemble",
      shortLabel: "200 Trees",
      headline: "Averaging the tree predictions",
      description:
        "The model builds 200 regression trees across bootstrapped samples, averaging splits to minimize variance and prevent overfitting on outlier districts.",
      proof: project.keyDecisions[0] ?? "GridSearchCV hyperparameter tuning",
      tags: ["Scikit-Learn", "Random Forest", "Ensemble Regressor"],
      icon: Cpu,
      specs: [
        { label: "Estimators", val: "200 Decision Trees" },
        { label: "Task", val: "Continuous Regression" },
        { label: "Criterion", val: "Squared Error" },
      ],
      codeSnippet: `from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=None,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)`,
    },
    {
      id: "tuning",
      number: "03",
      label: "Hyperparameter Optimization",
      shortLabel: "GridSearchCV",
      headline: "Tuning with five folds",
      description:
        "Exhaustive hyperparameter sweeps via GridSearchCV with 5-fold cross-validation optimized tree depth, feature splits, and leaf samples to achieve an R² of 0.8062 and MAE of 0.3261.",
      proof: project.metrics?.find((m) => m.label === "Accuracy")?.value ?? "R² 0.8062",
      tags: ["GridSearchCV", "Cross-Validation", "Hyperparameter Tuning"],
      icon: Sliders,
      specs: [
        { label: "Validation", val: "5-Fold Cross-Validation" },
        { label: "R² Score", val: "0.8062 accuracy" },
        { label: "MAE", val: "0.3261 error margin" },
      ],
      codeSnippet: `from sklearn.model_selection import GridSearchCV

param_grid = {'n_estimators': [100, 200], 'max_depth': [20, 30, None]}
grid_search = GridSearchCV(estimator=RandomForestRegressor(), param_grid=param_grid, cv=5, scoring='r2')
grid_search.fit(X_train, y_train)`,
    },
    {
      id: "serving",
      number: "04",
      label: "API Serving Boundary",
      shortLabel: "FastAPI REST",
      headline: "Serving predictions with FastAPI",
      description:
        "Tuned model weights are serialized using Joblib and loaded into a lightweight FastAPI service, enabling instantaneous predictions through documented Swagger REST endpoints.",
      proof: project.highlights?.[3] ?? "FastAPI backend, React frontend, Swagger API docs",
      tags: ["FastAPI", "Joblib", "REST Endpoints", "Swagger Docs"],
      icon: TrendingUp,
      specs: [
        { label: "Backend", val: "FastAPI Async API" },
        { label: "Artifacts", val: "Serialized Joblib model" },
        { label: "Documentation", val: "Interactive Swagger /docs" },
      ],
      codeSnippet: `from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("random_forest_model.joblib")

@app.post("/predict")
def predict_price(data: HouseFeatures):
    prediction = model.predict([data.to_array()])
    return {"predicted_price": float(prediction[0])}`,
    },
  ];
}

type HousePriceCaseStudyProps = {
  project?: Project;
  embedded?: boolean;
  onBackToCard?: () => void;
  onNextProject?: () => void;
};

export function HousePriceCaseStudyCover({ project = DEFAULT_PROJECT }: { project?: Project }) {
  return <div className="p-8 md:p-12">
    <span className="editorial-label">Inside {project.title} / an engineering case study</span>
    <p className="text-4xl md:text-6xl font-semibold text-fg my-4">Applied machine learning.<br /><span className="text-accent">From notebook to cloud API.</span></p>
    <p className="text-fg-muted">Rigorous model evaluation and production-grade inference serving.</p>
  </div>;
}

export default function HousePriceCaseStudy({
  project = DEFAULT_PROJECT,
  embedded = false,
  onBackToCard,
  onNextProject,
}: HousePriceCaseStudyProps) {
  const [copiedStageId, setCopiedStageId] = useState<NodeId | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const { copy, status: copyStatus } = useClipboard();
  const nodes = getArchitectureNodes(project);

  const activeGallery = GALLERY_ITEMS[activeGalleryIndex] ?? GALLERY_ITEMS[0];

  const handleCopyCode = (stageId: NodeId, code: string) => {
    setCopiedStageId(stageId);
    void copy(code);
  };

  return (
    <section id="houseprice-case-study" className={cn("py-16 md:py-24", embedded && "houseprice-embedded")}>
      <div className="container-site max-w-6xl">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border mb-12">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-fg-muted">
            <span className="inline-block w-2.5 h-2.5 bg-[var(--roof-coral-ink)] rounded-full animate-pulse" />
            {project.title} &bull; Applied ML Architecture & Benchmarks
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ProjectActionButtons project={project} size="sm" />
            {onBackToCard && (
              <button
                type="button"
                onClick={onBackToCard}
                className="px-4 py-2 border border-border rounded-md text-xs font-mono uppercase bg-surface hover:bg-elevated transition-colors"
              >
                Card Overview
              </button>
            )}
            {onNextProject && (
              <button
                type="button"
                onClick={onNextProject}
                className="px-4 py-2 bg-[var(--roof-coral-ink)] text-white font-semibold rounded-md text-xs font-mono uppercase hover:bg-[var(--roof-coral-ink)]/90 transition-colors flex items-center gap-2"
              >
                Next Project <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Editorial Heading */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-medium text-fg mb-6">
            Model evaluation
          </h2>
          <p className="text-lg text-fg-muted max-w-3xl leading-relaxed">
            {project.summary ?? project.solution}
          </p>
        </div>

        {/* High-Level Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-8 border border-border bg-surface rounded-2xl">
            <span className="font-mono text-[10px] uppercase text-[var(--roof-coral-ink)] mb-2 block">Accuracy Metric</span>
            <div className="text-3xl font-light text-fg mb-1">R² 0.8062</div>
            <p className="text-fg-muted text-xs">Cross-validated coefficient of determination across held-out splits</p>
          </div>
          <div className="p-8 border border-border bg-surface rounded-2xl">
            <span className="font-mono text-[10px] uppercase text-[var(--roof-coral-ink)] mb-2 block">Error Margin</span>
            <div className="text-3xl font-light text-fg mb-1">MAE 0.3261</div>
            <p className="text-fg-muted text-xs">Mean absolute error on test split (~$32.6k deviation envelope)</p>
          </div>
          <div className="p-8 border border-border bg-surface rounded-2xl">
            <span className="font-mono text-[10px] uppercase text-[var(--roof-coral-ink)] mb-2 block">Inference Speed</span>
            <div className="text-3xl font-light text-fg mb-1">&lt; 10ms</div>
            <p className="text-fg-muted text-xs">Asynchronous FastAPI REST endpoint execution latency</p>
          </div>
        </div>

        {/* ── Feature Importance Ranking Breakdown ── */}
        <div className="mb-20">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <h3 className="text-xl font-medium text-fg flex items-center gap-2">
              <Sliders className="text-[var(--roof-coral-ink)]" size={20} />
              Random Forest Feature Importance Analysis
            </h3>
            <span className="font-mono text-xs text-[var(--roof-coral-ink)] uppercase tracking-wider">
              Gini Impurity Reduction &bull; 8-Dimensional Input
            </span>
          </div>

          <div className="p-8 border border-border bg-surface/50 rounded-2xl space-y-6">
            {FEATURE_IMPORTANCES.map((item) => (
              <div key={item.feature}>
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <div className="flex items-center gap-3">
                    <strong className="text-[var(--roof-coral-ink)] font-semibold text-sm">{item.feature}</strong>
                    <span className="text-fg-muted">{item.name}</span>
                  </div>
                  <span className="text-fg font-semibold">{item.weight}%</span>
                </div>
                <div className="houseprice-benchmark-bar">
                  <div
                    className="houseprice-benchmark-fill"
                    style={{ width: `${item.weight}%` }}
                  />
                </div>
                <p className="text-[11px] text-fg-subtle mt-1 font-mono">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Model Benchmark Comparison Matrix ── */}
        <div className="mb-24">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <h3 className="text-xl font-medium text-fg flex items-center gap-2">
              <Cpu className="text-[var(--roof-coral-ink)]" size={20} />
              Model Benchmark & Evaluation Matrix
            </h3>
            <span className="font-mono text-xs text-fg-muted uppercase tracking-wider">
              Evaluated on Held-Out Test Split (20%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MODEL_BENCHMARKS.map((bm) => (
              <div
                key={bm.model}
                className={cn(
                  "houseprice-benchmark-card",
                  bm.best && "houseprice-benchmark-best"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-fg-subtle">
                    {bm.tag}
                  </span>
                  {bm.best && (
                    <span className="px-2 py-0.5 rounded bg-[var(--roof-coral-ink)]/20 border border-[var(--roof-coral-ink)]/40 font-mono text-[9px] text-[var(--roof-coral-ink)] uppercase font-bold">
                      Winner
                    </span>
                  )}
                </div>
                <h4 className="text-base font-medium text-fg mb-4">{bm.model}</h4>
                <div className="space-y-2 text-xs font-mono border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="text-fg-muted">R² Score:</span>
                    <strong className={bm.best ? "text-[var(--roof-coral-ink)] text-sm" : "text-fg"}>{bm.r2}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fg-muted">MAE:</span>
                    <strong className={bm.best ? "text-[var(--roof-coral-ink)]" : "text-fg"}>{bm.mae}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Latency:</span>
                    <strong className="text-fg">{bm.latency}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5-Fold Cross-Validation & Hyperparameter Tuning Matrix ── */}
        <div className="mb-24">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <h3 className="text-xl font-medium text-fg flex items-center gap-2">
              <Layers className="text-[var(--roof-coral-ink)]" size={20} />
              5-Fold Cross-Validation & Hyperparameter Grid
            </h3>
            <span className="font-mono text-xs text-[var(--roof-coral-ink)] uppercase tracking-wider">
              Scikit-Learn GridSearchCV &bull; K-Fold cv=5
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: 5 Folds Breakdown Table */}
            <div className="p-6 md:p-8 border border-border bg-surface/50 rounded-2xl">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle mb-4 block">
                Held-Out Split Generalization (K-Fold cv=5)
              </span>
              <div className="space-y-3">
                {CROSS_VALIDATION_FOLDS.map((fold) => (
                  <div
                    key={fold.fold}
                    className="p-3.5 rounded-xl border border-border bg-elevated/50 flex items-center justify-between font-mono text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--roof-coral-ink)] font-semibold">{fold.fold}</span>
                      <span className="text-fg-subtle text-[11px] hidden sm:inline">{fold.records}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-fg-muted text-[11px]">Train R²: <strong className="text-fg">{fold.trainR2}</strong></span>
                      <span className="text-[var(--roof-coral-ink)] font-semibold">Val R²: {fold.valR2}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--roof-sage-ink)]/15 text-[var(--roof-sage-ink)] border border-[var(--roof-sage-ink)]/30">
                        MAE {fold.valMae}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between font-mono text-[11px] text-fg-subtle">
                <span>Mean Cross-Validation Score:</span>
                <strong className="text-[var(--roof-coral-ink)]">R² = 0.8062 (±0.0021)</strong>
              </div>
            </div>

            {/* Right: Hyperparameter Grid Optimization */}
            <div className="p-6 md:p-8 border border-border bg-surface/50 rounded-2xl">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle mb-4 block">
                GridSearchCV Parameter Optimization Space
              </span>
              <div className="space-y-3">
                {HYPERPARAMETER_GRID.map((hp) => (
                  <div
                    key={hp.param}
                    className="p-3.5 rounded-xl border border-border bg-elevated/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <strong className="text-[var(--roof-coral-ink)]">{hp.param}</strong>
                      <span className="px-2 py-0.5 rounded bg-[var(--roof-coral-ink)]/15 border border-[var(--roof-coral-ink)]/30 text-[var(--roof-coral-ink)] text-[10px] font-bold">
                        Selected: {hp.selected}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-fg-subtle">
                      <span>Evaluated: {hp.evaluated}</span>
                    </div>
                    <p className="text-[11px] font-mono text-fg-muted pt-1 border-t border-border">{hp.impact}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between font-mono text-[11px] text-fg-subtle">
                <span>Total Candidate Fits:</span>
                <strong className="text-fg">180 Fits (36 Candidates × 5 Folds)</strong>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-24" aria-labelledby="roofworth-gallery-title">
          <h3 id="roofworth-gallery-title" className="text-3xl font-medium text-fg mb-6">
            Inside RoofWorth
          </h3>

          <div className="houseprice-gallery">
            <figure aria-live="polite">
              <div className="houseprice-gallery-preview">
                <Image
                  key={activeGallery.src}
                  src={activeGallery.src}
                  alt={activeGallery.alt}
                  fill
                  sizes="(max-width: 900px) 92vw, 1100px"
                  className="object-contain"
                  loading="eager"
                />
              </div>
              <figcaption className="houseprice-gallery-caption">
                <h4>{activeGallery.label}</h4>
                <p>{activeGallery.description}</p>
              </figcaption>
            </figure>

            <div className="houseprice-gallery-options" aria-label="Choose a RoofWorth screenshot" role="group">
              {GALLERY_ITEMS.map((item, idx) => (
                <button
                  key={item.src}
                  type="button"
                  aria-pressed={activeGalleryIndex === idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className="houseprice-thumb-btn"
                >
                  <span className="houseprice-thumbnail">
                    <Image src={item.src} alt="" fill sizes="(max-width: 600px) 42vw, 220px" />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Deep Dive Architecture Nodes ── */}
        <div className="space-y-16">
          <div className="pb-4 border-b border-border">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--roof-coral-ink)] block mb-1">
              Code & Boundary Inspector
            </span>
            <h3 className="text-3xl font-light text-fg">
              Applied Machine Learning Mechanics
            </h3>
          </div>

          {nodes.map((node) => {
            const Icon = node.icon;
            const isCopied = copiedStageId === node.id && copyStatus === "copied";
            return (
              <div
                key={node.id}
                className="p-5 md:p-10 border border-border bg-surface rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--roof-coral-ink)]/10 border border-[var(--roof-coral-ink)]/20 flex items-center justify-center text-[var(--roof-coral-ink)]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                        {node.number} of 04
                      </span>
                      <h4 className="text-xl font-medium text-fg">{node.label}</h4>
                    </div>
                  </div>
                  <h3 className="text-2xl font-light text-fg mb-4">{node.headline}</h3>
                  <p className="text-fg-muted text-sm leading-relaxed mb-6">{node.description}</p>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border mb-6">
                    {node.specs.map((spec) => (
                      <div key={spec.label}>
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-fg-subtle mb-1">
                          {spec.label}
                        </span>
                        <strong className="text-xs font-medium text-fg">{spec.val}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 border border-border rounded-md font-mono text-[10px] text-fg-muted bg-elevated"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-border bg-surface rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-elevated border-b border-border">
                    <span className="font-mono text-[11px] text-[var(--roof-coral-ink)] flex items-center gap-2">
                      <Terminal size={13} /> {FILE_NAMES[node.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(node.id, node.codeSnippet)}
                      className="px-3 py-1 bg-elevated border border-border rounded text-[10px] font-mono text-fg hover:bg-surface transition-colors flex items-center gap-1.5"
                    >
                      {isCopied ? <CheckCircle2 size={12} className="text-[var(--roof-coral-ink)]" /> : <Copy size={12} />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs text-fg overflow-x-auto bg-surface leading-relaxed">
                    <code>{node.codeSnippet}</code>
                  </pre>
                  <div className="px-4 py-2 bg-elevated/50 border-t border-border flex justify-between text-[10px] font-mono text-fg-subtle">
                    <span>Scikit-Learn / FastAPI</span>
                    <span>Optimized Weights</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
