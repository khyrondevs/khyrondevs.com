"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Check,
  Database,
  Fingerprint,
  Lock,
  ReceiptText,
  ScanLine,
  ScrollText,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  createEazyShopStoryState,
  eazyshopChapterAtTime,
  scoreEazyShopStory,
} from "@/lib/eazyshop-story";
import EazyShopCaseStudy from "@/components/sections/EazyShopCaseStudy";

type TransactionChapter = {
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
  gateway: string;
  valuation: string;
  lockState: string;
  icon: typeof Database;
  decisionRule: string;
  input: string;
  output: string;
  contracts: string[];
  telemetry: { label: string; value: string }[];
};

const chapters: TransactionChapter[] = [
  {
    id: "session",
    number: "01",
    phase: "SESSION HYDRATION",
    eyebrow: "01 // GUEST SESSION HYDRATION",
    title: "JWT claims merge guest carts without race conditions.",
    subtitle: "Signed claim set + Redis cart stream merge",
    desc: "A guest token carries a signed claim set while the live cart lives in Redis. On authentication, both hydrate into one PostgreSQL row inside a locked transaction — double submits collapse to a single merge.",
    image: "/images/eazyshop/cart.png",
    metric: "Redis + JWT Claims",
    status: "SYNC_HYDRATED",
    gateway: "POST /api/cart/sync/",
    valuation: "₹4,999.00",
    lockState: "UNLOCKED",
    icon: Database,
    decisionRule: "IF exp > now AND sig_valid -> MERGE guest_cart INTO user_cart",
    input: "guest token + redis stream",
    output: "hydrated persistent cart",
    contracts: ["idempotent merge on replayed auth", "claim expiry checked before hydration", "guest key burned after commit"],
    telemetry: [
      { label: "TOKEN", value: "HS256 · 3 claims" },
      { label: "CACHE", value: "redis GET cart:{t}" },
      { label: "MERGE", value: "atomic block" },
    ],
  },
  {
    id: "lock",
    number: "02",
    phase: "ROW-LEVEL LOCK",
    eyebrow: "02 // SELECT ... FOR UPDATE",
    title: "One row, one writer: zero overselling under load.",
    subtitle: "Row-exclusive lock with 120s reservation TTL",
    desc: "Checkout takes SELECT ... FOR UPDATE on the product row. Competing sessions queue behind the lock holder while a strict 120-second TTL guarantees unpaid reservations release themselves automatically.",
    image: "/images/eazyshop/checkout2.png",
    metric: "ACID Isolation",
    status: "LOCK_ACQUIRED",
    gateway: "POST /api/orders/reserve/",
    valuation: "₹4,999.00",
    lockState: "HELD BY TX#9841",
    icon: Lock,
    decisionRule: "SELECT stock FROM store_product WHERE id=104 FOR UPDATE",
    input: "concurrent reserve requests",
    output: "serialized stock decrement",
    contracts: ["repeatable-read isolation level", "stock >= qty guard clause", "TTL sweeper releases expired locks"],
    telemetry: [
      { label: "ISOLATION", value: "REPEATABLE READ" },
      { label: "LOCK MODE", value: "ROW EXCLUSIVE" },
      { label: "TTL", value: "120s countdown" },
    ],
  },
  {
    id: "webhook",
    number: "03",
    phase: "WEBHOOK INGRESS",
    eyebrow: "03 // HMAC-SHA256 INGRESS",
    title: "Every payment webhook is mathematically proven.",
    subtitle: "HMAC-SHA256 verification + replay nonce gate",
    desc: "Razorpay posts the capture event; the edge recomputes the HMAC over the raw body and compares digests in constant time. Forged payloads fail verification; replays die at the nonce ledger before fulfillment fires.",
    image: "/images/eazyshop/rzp1.png",
    metric: "HMAC-SHA256",
    status: "SIG_VERIFIED",
    gateway: "POST /api/payments/webhook/",
    valuation: "₹4,999.00",
    lockState: "HELD · CAPTURED",
    icon: ShieldCheck,
    decisionRule: "compare_digest(hmac_sha256(secret, body), signature)",
    input: "raw payload + X-Razorpay-Signature",
    output: "verified capture event",
    contracts: ["constant-time digest compare", "event.id nonce replay ledger", "fulfillment gated on VERIFY only"],
    telemetry: [
      { label: "ALG", value: "HMAC-SHA256" },
      { label: "COMPARE", value: "constant time" },
      { label: "NONCE", value: "evt_1k... unique" },
    ],
  },
  {
    id: "ledger",
    number: "04",
    phase: "ORDER EMISSION",
    eyebrow: "04 // IMMUTABLE AUDIT LEDGER",
    title: "The order commits to an append-only ledger.",
    subtitle: "State-machine emit + Brevo confirmation dispatch",
    desc: "PAID advances the order through the state machine, each transition hashed into an immutable audit chain. Stock finalizes, the Brevo confirmation email dispatches, and full provenance is frozen forever.",
    image: "/images/eazyshop/order_success.png",
    metric: "Append-Only Ledger",
    status: "ORDER_COMMITTED",
    gateway: "GET /api/orders/:id/confirmation/",
    valuation: "₹4,999.00",
    lockState: "RELEASED · COMMITTED",
    icon: ScrollText,
    decisionRule: "TRANSITION PAID -> PROCESSED (hash chained, never mutated)",
    input: "captured payment event",
    output: "committed order + receipt",
    contracts: ["append-only transition rows", "sha256 hash-chained provenance", "Brevo dispatch on commit"],
    telemetry: [
      { label: "LEDGER", value: "append-only WAL" },
      { label: "CHAIN", value: "sha256(prev‖row)" },
      { label: "EMAIL", value: "brevo queued" },
    ],
  },
];

const PIPELINE_STEPS = [
  { label: "SESSION", detail: "jwt + redis hydrate", icon: Fingerprint },
  { label: "RESERVE", detail: "for update · ttl 120s", icon: Lock },
  { label: "CAPTURE", detail: "hmac verify ingress", icon: ScanLine },
  { label: "COMMIT", detail: "ledger + brevo emit", icon: ReceiptText },
] as const;

export default function EazyShopProjectExperience({ project, children }: { project: Project; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    registerGsap();
    const container = root.current;
    if (!container) return;

    const chapterElements = Array.from(container.querySelectorAll<HTMLElement>("[data-eazyshop-chapter]"));
    const planeElements = Array.from(container.querySelectorAll<HTMLElement>("[data-eazyshop-plane]"));
    const captionElements = Array.from(container.querySelectorAll<HTMLElement>("[data-eazyshop-caption]"));
    const chapterLinks = Array.from(container.querySelectorAll<HTMLAnchorElement>("[data-eazyshop-link]"));
    const chaptersContainer = container.querySelector<HTMLElement>("[data-eazyshop-chapters]");
    const stageFigure = container.querySelector<HTMLElement>("[data-eazyshop-stage-figure]");
    const progressFill = container.querySelector<HTMLElement>("[data-eazyshop-progress]");
    const railFill = container.querySelector<HTMLElement>("[data-eazyshop-rail-progress]");
    const progressLabel = container.querySelector<HTMLElement>("[data-eazyshop-progress-label]");
    const phaseLabel = container.querySelector<HTMLElement>("[data-eazyshop-phase]");
    const statusLabel = container.querySelector<HTMLElement>("[data-eazyshop-status]");
    const gatewayLabel = container.querySelector<HTMLElement>("[data-eazyshop-gateway]");
    const pipelineFill = container.querySelector<HTMLElement>("[data-eazyshop-pipeline-fill]");
    const terminal = container.querySelector<HTMLElement>("[data-eazyshop-terminal]");
    const scannerBeam = container.querySelector<HTMLElement>("[data-eazyshop-scanner]");
    const lockPulse = container.querySelector<HTMLElement>("[data-eazyshop-lock-pulse]");
    const packet = container.querySelector<HTMLElement>("[data-eazyshop-packet]");
    const receiptTape = container.querySelector<HTMLElement>("[data-eazyshop-receipt-tape]");
    const stamp = container.querySelector<HTMLElement>("[data-eazyshop-stamp]");
    const ttlRing = container.querySelector<SVGCircleElement>("[data-eazyshop-ttl-ring]");
    const hudChip = container.querySelector<HTMLElement>("[data-eazyshop-hud-chip]");
    const statusMeter = container.querySelector<HTMLElement>("[data-eazyshop-status-meter]");

    if (
      chapterElements.length !== chapters.length ||
      planeElements.length !== chapters.length ||
      chapterLinks.length !== chapters.length ||
      !chaptersContainer ||
      !stageFigure ||
      !progressFill ||
      !railFill ||
      !progressLabel ||
      !phaseLabel ||
      !statusLabel ||
      !gatewayLabel
    ) {
      return;
    }

    const state = createEazyShopStoryState({
      root: container,
      chapters: chapterElements,
      links: chapterLinks,
      planes: planeElements,
      captions: captionElements,
      stageFigure,
      progressLabel,
      phaseLabel,
      statusLabel,
      gatewayLabel,
      readouts: chapters,
    });

    const mm = gsap.matchMedia();
    mm.add({
      desktop: "(min-width: 1024px)",
      mobile: "(max-width: 1023px)",
    }, (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      state.setDesktop(desktop);

      const timeline = gsap.timeline({ paused: true });
      let chapterOffsets: number[] = [];
      let readingOffset = 0;

      const syncChapter = () => {
        const index = eazyshopChapterAtTime(chapterOffsets, timeline.time(), readingOffset);
        state.activate(index);
        setActiveChapter((previous) => (previous === index ? previous : index));
      };

      const scoringContext = gsap.context(() => {}, container);
      const scoreStory = scoringContext.add("scoreStory", () => {
        scoreEazyShopStory(
          timeline,
          {
            planes: desktop ? planeElements : [],
            progressFill,
            railFill,
            pipelineFill: pipelineFill ?? undefined,
            terminal: desktop ? terminal ?? undefined : undefined,
            scannerBeam: desktop ? scannerBeam ?? undefined : undefined,
            lockPulse: desktop ? lockPulse ?? undefined : undefined,
            packet: desktop ? packet ?? undefined : undefined,
            receiptTape: desktop ? receiptTape ?? undefined : undefined,
            stamp: desktop ? stamp ?? undefined : undefined,
            ttlRing: desktop ? ttlRing ?? undefined : undefined,
            hudChip: desktop ? hudChip ?? undefined : undefined,
            statusMeter: statusMeter ?? undefined,
          },
          chapterOffsets,
          window.innerHeight,
          chaptersContainer.offsetHeight + window.innerHeight * 0.2,
        );
      });

      const rebuildStory = () => {
        chapterOffsets = chapterElements.map((chapter) => chapter.offsetTop);
        readingOffset = window.innerHeight * (desktop ? 0.18 : 0.12);
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

      // Per-chapter boundary trace scrub
      chapterElements.forEach((chapter) => {
        const boundaryProgress = chapter.querySelector<HTMLElement>("[data-eazyshop-boundary-progress]");
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

      // Mobile inline-screen entrance scrub
      if (!desktop) {
        chapterElements.forEach((chapter) => {
          const inlineScreen = chapter.querySelector<HTMLElement>(".eazyshop-inline-screen");
          if (inlineScreen) {
            gsap.fromTo(
              inlineScreen,
              { opacity: 0.75, scale: 0.96, y: 18 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: inlineScreen,
                  start: "top 88%",
                  end: "top 58%",
                  scrub: 0.5,
                },
              },
            );
          }
        });
      }

      return () => {
        state.setDesktop(false);
      };
    }, container);

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      state.dispose();
    };
  }, []);

  const current = chapters[activeChapter] ?? chapters[0];
  const CurrentIcon = current.icon;

  return (
    <div ref={root} id="eazyshop" className="eazyshop-experience">
      <div className="eazyshop-project-card">{children}</div>

      <section className="eazyshop-story" aria-labelledby="eazyshop-story-title">
        {/* ── Reel Heading ── */}
        <div className="eazyshop-reel-heading">
          <p className="eazyshop-kicker">
            <span className="eazyshop-status-led" aria-hidden="true" />
            <span>high-concurrency transaction engine / {project.title}</span>
          </p>
        </div>

        <div className="eazyshop-story-intro">
          <div>
            <h2 id="eazyshop-story-title">
              One checkout.<br />
              <span>Four cryptographic guarantees.</span>
            </h2>
            <p className="eazyshop-reel-index">
              a single order <span aria-hidden="true">/</span> scrubbed through session, lock, signature, ledger
            </p>
          </div>
          <p className="eazyshop-story-lead">
            Follow ₹4,999 through the EazyShop transaction pipeline. A guest cart hydrates from JWT claims and Redis,
            inventory serializes behind a row-level lock with a 120-second TTL, the Razorpay capture survives HMAC
            verification and the replay gate, and the order freezes into an append-only audit ledger.
          </p>
        </div>

        {/* ── Pipeline Runtime Trace ── */}
        <section className="eazyshop-pipeline-panel" aria-label="Transaction pipeline trace">
          <div className="eazyshop-pipeline-head">
            <div>
              <span className="eazyshop-kicker">pipeline telemetry</span>
              <h3>Order Lifecycle Trace</h3>
            </div>
            <p>Django REST &bull; PostgreSQL Row Locks &bull; Razorpay Webhooks &bull; Brevo Dispatch</p>
          </div>
          <div className="eazyshop-pipeline-shell">
            <ol className="eazyshop-pipeline-trace" aria-label="Ordered transaction stages">
              {PIPELINE_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.label}
                    className={`eazyshop-pipeline-step${index <= activeChapter ? " is-passed" : ""}${index === activeChapter ? " is-current" : ""}`}
                    aria-label={`${step.label}: ${step.detail}`}
                  >
                    <div className="eazyshop-pipeline-node" aria-hidden="true">
                      <Icon size={15} strokeWidth={1.8} />
                    </div>
                    <div className="eazyshop-pipeline-copy">
                      <h4>{step.label}</h4>
                      <p>{step.detail}</p>
                    </div>
                    {index < PIPELINE_STEPS.length - 1 && (
                      <div className="eazyshop-pipeline-line" aria-hidden="true">
                        <span className="eazyshop-pipeline-spark" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            <span className="eazyshop-pipeline-fill" data-eazyshop-pipeline-fill aria-hidden="true" />
          </div>
        </section>

        {/* ── Story Body: Pinned Hardware Terminal Stage + Narrative Chapters ── */}
        <div className="eazyshop-story-body">
          <aside className="eazyshop-story-stage" aria-label="Interactive POS transaction stage">
            {/* Console heading with TTL gauge */}
            <div className="eazyshop-console-heading">
              <div aria-hidden="true">
                <span className="eazyshop-console-eyebrow">POS TERMINAL HUD</span>
                <strong className="eazyshop-console-title">EAZYSHOP TRANSACTION ENCLAVE</strong>
              </div>
              <div className="eazyshop-ttl-dial" aria-hidden="true" title="Reservation TTL gauge">
                <svg width="44" height="44" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    data-eazyshop-ttl-ring
                    cx="50"
                    cy="50"
                    r="28"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    strokeDasharray="176"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" fill="#f59e0b" fontSize="20" fontFamily="monospace" fontWeight="bold">TTL</text>
                </svg>
              </div>
            </div>

            {/* Chapter navigation rail */}
            <nav className="eazyshop-progress-nav" aria-label="Transaction chapter progress">
              <div className="eazyshop-progress-heading">
                <span>TX MILESTONE</span>
                <span data-eazyshop-progress-label aria-live="polite">01 / 04</span>
              </div>
              <div className="eazyshop-progress-track" aria-hidden="true">
                <span data-eazyshop-progress />
              </div>
              <ol>
                {chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <a
                      href={`#eazyshop-chapter-${chapter.id}`}
                      className={`eazyshop-progress-step${index === 0 ? " is-active" : ""}`}
                      data-eazyshop-link
                      aria-current={index === 0 ? "step" : undefined}
                    >
                      <span>{chapter.number}<ArrowRight size={11} aria-hidden="true" /></span>
                      <strong>{chapter.phase.split(" ")[0]}</strong>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Pinned 3D hardware terminal */}
            <div className="eazyshop-stage-figure" data-eazyshop-stage-figure hidden>
              <div className="eazyshop-console-boundary" aria-hidden="true">
                <span>ACTIVE PHASE:</span>
                <strong data-eazyshop-phase>{chapters[0].phase}</strong>
                <span className="eazyshop-console-gateway" data-eazyshop-gateway>{chapters[0].gateway}</span>
              </div>

              <div className="eazyshop-terminal-viewport">
                <div className="eazyshop-terminal" data-eazyshop-terminal>
                  {/* Bezel + status lamps */}
                  <div className="eazyshop-terminal-bezel">
                    <div className="eazyshop-terminal-topbar">
                      <span className="eazyshop-lamp-row" aria-hidden="true">
                        <i className="eazyshop-lamp is-emerald" />
                        <i className="eazyshop-lamp is-amber" />
                        <i className="eazyshop-lamp" />
                      </span>
                      <span className="eazyshop-model-tag">KRYPTON·POS-4</span>
                      <span className="eazyshop-status-meter" data-eazyshop-status-meter data-eazyshop-status>
                        {chapters[0].status}
                      </span>
                    </div>

                    {/* Screen: depth planes + laser + overlays */}
                    <div className="eazyshop-display-screen">
                      <div className="eazyshop-scanner-beam" data-eazyshop-scanner aria-hidden="true" />
                      <div className="eazyshop-scan-grid" aria-hidden="true" />

                      <div className="eazyshop-depth-stack">
                        {chapters.map((chapter, index) => (
                          <figure
                            key={chapter.id}
                            className={`eazyshop-depth-plane${index === 0 ? " is-active" : ""}`}
                            data-eazyshop-plane
                            aria-labelledby={`eazyshop-chapter-title-${chapter.id}`}
                          >
                            <Image
                              src={chapter.image}
                              alt={`${project.title} — ${chapter.title}`}
                              fill
                              sizes="(min-width: 1024px) 620px, 1px"
                              className="object-cover object-top"
                              priority={index === 0}
                            />
                          </figure>
                        ))}
                      </div>

                      {/* Row-lock pulse ring centered on screen */}
                      <div className="eazyshop-lock-pulse" data-eazyshop-lock-pulse aria-hidden="true">
                        <Lock size={18} />
                      </div>

                      {/* Floating decision-rule chip */}
                      <div className="eazyshop-hud-chip" data-eazyshop-hud-chip aria-hidden="true">
                        <div className="eazyshop-hud-chip-head">
                          <Fingerprint size={11} />
                          <span>ENGINE RULE</span>
                        </div>
                        <div className="eazyshop-hud-chip-body">{current.decisionRule}</div>
                      </div>

                      {/* Thermal receipt tape feeding from printer slot */}
                      <div className="eazyshop-receipt-slot" aria-hidden="true" />
                      <div className="eazyshop-receipt-tape" data-eazyshop-receipt-tape aria-hidden="true">
                        <div className="eazyshop-receipt-header">
                          KRYPTON // EAZYSHOP
                          <span>TX#9841-AUTH · RAZORPAY</span>
                        </div>
                        <div className="eazyshop-receipt-row"><span>STATUS</span><strong>{current.status}</strong></div>
                        <div className="eazyshop-receipt-row"><span>LOCK_TTL</span><span>120 SECONDS</span></div>
                        <div className="eazyshop-receipt-row"><span>SECURITY</span><span>HMAC-SHA256</span></div>
                        <div className="eazyshop-receipt-row"><span>AMOUNT</span><span>₹4,999.00</span></div>
                        <div className="eazyshop-receipt-hash">sha256: 7f3a9c…{current.id.toUpperCase()}</div>
                        <div className="eazyshop-receipt-barcode" />
                        <div className="eazyshop-receipt-stamp" data-eazyshop-stamp>✓ PAID &amp; CAPTURED</div>
                      </div>
                    </div>

                    {/* Keyboard deck */}
                    <div className="eazyshop-terminal-deck" aria-hidden="true">
                      <span className="eazyshop-keypad">
                        {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
                      </span>
                      <span className="eazyshop-card-swipe" />
                    </div>
                  </div>
                </div>

                {/* ACID state machine SVG rail under the terminal */}
                <div className="eazyshop-acid-rail" aria-hidden="true">
                  <svg viewBox="0 0 640 64" fill="none" preserveAspectRatio="none">
                    <path
                      d="M40 32 H200 M240 32 H400 M440 32 H600"
                      stroke="rgba(255,255,255,0.14)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                    <circle cx="40" cy="32" r="9" fill="#0d1017" stroke="#10b981" strokeWidth="2" />
                    <circle cx="220" cy="32" r="9" fill="#0d1017" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="420" cy="32" r="9" fill="#0d1017" stroke="#10b981" strokeWidth="2" />
                    <circle cx="600" cy="32" r="9" fill="#0d1017" stroke="#10b981" strokeWidth="2" />
                    <text x="40" y="58" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">HYDRATE</text>
                    <text x="220" y="58" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">LOCK</text>
                    <text x="420" y="58" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">VERIFY</text>
                    <text x="600" y="58" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">COMMIT</text>
                  </svg>
                  <span className="eazyshop-acid-packet" data-eazyshop-packet />
                </div>
              </div>

              <div className="eazyshop-stage-note">
                <span className="eazyshop-status-led" aria-hidden="true" />
                <span>POSTGRES 15 &bull; REPLICATION-LAG 3ms &bull; TX ENGINE LIVE</span>
              </div>
            </div>
          </aside>

          {/* Scrolling narrative chapters */}
          <div className="eazyshop-chapters" data-eazyshop-chapters>
            <div className="eazyshop-story-rail" aria-hidden="true">
              <span data-eazyshop-rail-progress />
            </div>

            {chapters.map((chapter, index) => {
              const Icon = chapter.icon;
              return (
                <article
                  key={chapter.id}
                  id={`eazyshop-chapter-${chapter.id}`}
                  className={`eazyshop-chapter${index === 0 ? " is-active" : ""}`}
                  data-eazyshop-chapter={chapter.id}
                  aria-labelledby={`eazyshop-chapter-title-${chapter.id}`}
                  tabIndex={-1}
                >
                  <div className="eazyshop-chapter-marker">
                    <span className="eazyshop-chapter-number">{chapter.number}</span>
                    <span className="eazyshop-chapter-icon" aria-hidden="true"><Icon size={13} /></span>
                    <span className="eazyshop-marker-dot" aria-hidden="true" />
                  </div>

                  <div className="eazyshop-chapter-copy">
                    <p className="eazyshop-kicker">{chapter.eyebrow}</p>
                    <h3 id={`eazyshop-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                    <p className="eazyshop-chapter-desc">{chapter.desc}</p>

                    {/* Boundary route trace */}
                    <div className="eazyshop-boundary-route" role="group" aria-label="Pipeline handoff boundary">
                      <span>{chapter.input}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                      <strong>{chapter.output}</strong>
                      <i aria-hidden="true">
                        <span data-eazyshop-boundary-progress />
                      </i>
                    </div>

                    {/* Operational contracts */}
                    <ul className="eazyshop-contract-list">
                      {chapter.contracts.map((contract) => (
                        <li key={contract}>
                          <Check size={13} aria-hidden="true" />
                          <span>{contract}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Telemetry chips */}
                    <div className="eazyshop-telemetry-row">
                      {chapter.telemetry.map((cell) => (
                        <span key={cell.label} className="eazyshop-mini-chip">
                          {cell.label}: <strong>{cell.value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mobile inline fallback figure */}
                  <figure
                    className="eazyshop-inline-figure"
                    data-eazyshop-inline-figure={chapter.id}
                    aria-labelledby={`eazyshop-chapter-title-${chapter.id}`}
                  >
                    <div className="eazyshop-inline-screen">
                      <Image
                        src={chapter.image}
                        alt={`${project.title} — ${chapter.title}`}
                        fill
                        sizes="(max-width: 1023px) 92vw, 1px"
                        className="object-cover object-top"
                      />
                    </div>
                    <figcaption className="eazyshop-inline-caption" data-eazyshop-caption>
                      <span>{chapter.subtitle}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </figcaption>
                  </figure>
                </article>
              );
            })}
          </div>
        </div>

        {/* ── Live Transaction Summary Bar ── */}
        <section className="eazyshop-summary-bar" aria-label="Current transaction state summary">
          <div className="eazyshop-summary-cell">
            <span className="eazyshop-summary-label"><Terminal size={12} aria-hidden="true" /> PHASE</span>
            <strong>{current.phase}</strong>
          </div>
          <div className="eazyshop-summary-cell">
            <span className="eazyshop-summary-label"><Activity size={12} aria-hidden="true" /> STATE</span>
            <strong className="is-emerald">{current.status}</strong>
          </div>
          <div className="eazyshop-summary-cell">
            <span className="eazyshop-summary-label"><Lock size={12} aria-hidden="true" /> ROW LOCK</span>
            <strong className="is-amber">{current.lockState}</strong>
          </div>
          <div className="eazyshop-summary-cell">
            <span className="eazyshop-summary-label"><CurrentIcon size={12} aria-hidden="true" /> METRIC</span>
            <strong>{current.metric}</strong>
          </div>
          <div className="eazyshop-summary-cell">
            <span className="eazyshop-summary-label"><ShieldCheck size={12} aria-hidden="true" /> AMOUNT</span>
            <strong className="is-emerald">{current.valuation}</strong>
          </div>
        </section>

        <div className="eazyshop-dive-hint">
          <a href="#eazyshop-case-study">
            <span>Explore Architecture, ACID State Machine &amp; SQL Workbench</span>
            <ArrowDown size={14} />
          </a>
        </div>
      </section>

      <EazyShopCaseStudy project={project} embedded />
    </div>
  );
}
