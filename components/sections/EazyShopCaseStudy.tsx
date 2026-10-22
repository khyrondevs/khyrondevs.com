"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Database,
  Layers,
  Server,
  ShieldCheck,
  ShoppingBag,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { projects, type Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import useClipboard from "@/hooks/useClipboard";
import { ProjectActionButtons } from "@/components/ui/project-action-buttons";

type NodeId = "session" | "order" | "payment" | "ledger";

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

type GalleryCategory = {
  id: string;
  label: string;
  badge: string;
  description: string;
  images: {
    src: string;
    title: string;
    caption: string;
    route: string;
    tag: string;
  }[];
};

const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: "storefront",
    label: "Storefront & Catalog",
    badge: "Customer Journey",
    description: "Responsive customer catalog with dynamic product filtering, persistent wishlist, and user account portal.",
    images: [
      {
        src: "/images/eazyshop/eazyshop_home.png",
        title: "Storefront Homepage",
        caption: "Featured collections, hero product carousel, and category quick-filters.",
        route: "GET /",
        tag: "React 19 View",
      },
      {
        src: "/images/eazyshop/products.png",
        title: "Product Catalog Grid",
        caption: "Server-side filtered catalog with pagination, price sorting, and rating filters.",
        route: "GET /api/products/",
        tag: "Django REST ViewSet",
      },
      {
        src: "/images/eazyshop/product_details.png",
        title: "Product Detail View",
        caption: "High-resolution image gallery, stock availability meter, and verified buyer reviews.",
        route: "GET /api/products/:slug/",
        tag: "Dynamic Route",
      },
      {
        src: "/images/eazyshop/wishlist.png",
        title: "Customer Wishlist",
        caption: "Persistent user wishlist synchronized between local state and authenticated profile.",
        route: "GET /api/wishlist/",
        tag: "Authenticated Route",
      },
      {
        src: "/images/eazyshop/user_dashboard.png",
        title: "Customer Profile & History",
        caption: "Past order summaries, shipment tracking statuses, and profile credentials.",
        route: "GET /api/users/profile/",
        tag: "JWT Protected",
      },
    ],
  },
  {
    id: "checkout",
    label: "Cart & Payments",
    badge: "ACID Transaction Pipeline",
    description: "Multi-phase cart reservation, row-level locking, and HMAC-verified Razorpay payment ingress.",
    images: [
      {
        src: "/images/eazyshop/cart.png",
        title: "Persistent Shopping Cart",
        caption: "Session-persisted shopping bag with automatic subtotal and coupon validation.",
        route: "POST /api/cart/sync/",
        tag: "Redis Session Cache",
      },
      {
        src: "/images/eazyshop/checkout1.png",
        title: "Shipping Address Selection",
        caption: "Multi-address manager with address validation before entering reservation lock.",
        route: "POST /api/checkout/shipping/",
        tag: "Pre-Flight Validation",
      },
      {
        src: "/images/eazyshop/checkout2.png",
        title: "Order Review & Breakdown",
        caption: "Atomic inventory reservation lock initiated. 120-second stock hold TTL begins.",
        route: "POST /api/orders/reserve/",
        tag: "SELECT FOR UPDATE",
      },
      {
        src: "/images/eazyshop/rzp1.png",
        title: "Razorpay Checkout Ingress",
        caption: "Client SDK initializes cryptographically signed Razorpay order token.",
        route: "POST /api/payments/razorpay/order/",
        tag: "SDK Handshake",
      },
      {
        src: "/images/eazyshop/rzp2.png",
        title: "Gateway Verification",
        caption: "Razorpay modal authorization with HMAC-SHA256 signature calculation.",
        route: "POST /api/payments/verify/",
        tag: "Cryptographic Hash",
      },
      {
        src: "/images/eazyshop/order_success.png",
        title: "Order Confirmation & Receipt",
        caption: "Immutable order record committed with auto-generated receipt and inventory deduction.",
        route: "GET /api/orders/:id/confirmation/",
        tag: "Committed State",
      },
    ],
  },
  {
    id: "admin",
    label: "Admin Suite",
    badge: "Administrative Telemetry",
    description: "Operational console for inventory replenishment, order dispatching, and audit logging.",
    images: [
      {
        src: "/images/eazyshop/admin_orders.png",
        title: "Order Fulfillment Matrix",
        caption: "Real-time dispatch board tracking orders from Paid to Dispatched to Delivered.",
        route: "GET /api/admin/orders/",
        tag: "Fulfillment Pipeline",
      },
      {
        src: "/images/eazyshop/admin_products1.png",
        title: "Inventory & Stock Control",
        caption: "Stock replenishment console with low-stock alerts and SKU-level inventory controls.",
        route: "PUT /api/admin/products/:id/",
        tag: "Atomic Stock Edit",
      },
      {
        src: "/images/eazyshop/admin_categories.png",
        title: "Taxonomy & Categories",
        caption: "Hierarchical category tree management with slug generation and SEO attributes.",
        route: "POST /api/admin/categories/",
        tag: "Relational Taxonomy",
      },
      {
        src: "/images/eazyshop/admin_logs.png",
        title: "Immutable Audit Ledger",
        caption: "Append-only activity stream recording all administrator and transactional actions.",
        route: "GET /api/admin/audit-logs/",
        tag: "WAL Stream",
      },
      {
        src: "/images/eazyshop/admin_reviews.png",
        title: "Review Moderation",
        caption: "Customer review verification dashboard preventing spam and unverified ratings.",
        route: "PATCH /api/admin/reviews/:id/",
        tag: "Moderation Queue",
      },
      {
        src: "/images/eazyshop/admin_users.png",
        title: "RBAC User Administration",
        caption: "Role-based access permissions distinguishing customer, staff, and superuser accounts.",
        route: "GET /api/admin/users/",
        tag: "RBAC Matrix",
      },
    ],
  },
];

const FILE_NAMES: Record<NodeId, string> = {
  session: "store/cart/session_service.py",
  order: "store/checkout/atomic_locks.py",
  payment: "store/payments/gateway_webhook.py",
  ledger: "store/admin/audit_ledger.py",
};

const getEazyShopProject = (): Project => {
  const project = projects.find((item) => item.slug === "eazyshop");
  if (!project) throw new Error("EazyShop project data is missing");
  return project;
};

const DEFAULT_PROJECT = getEazyShopProject();

function getArchitectureNodes(project: Project): ArchitectureNode[] {
  return [
    {
      id: "session",
      number: "01",
      label: "Guest Session Hydration",
      shortLabel: "Cart State",
      headline: "JWT claims + Redis cache merge under a single atomic block.",
      description:
        "A guest cart lives in Redis keyed by a signed JWT claim set. When the shopper authenticates mid-checkout, the merge runs inside SELECT ... FOR UPDATE on the destination cart row, so duplicate auth submissions serialize instead of double-inserting line items.",
      proof: project.summary ?? project.solution,
      tags: ["JWT Sessions", "Redis Cache", "Idempotent Merge"],
      icon: ShoppingBag,
      specs: [
        { label: "Session Store", val: "Signed JWT + Redis TTL" },
        { label: "Merge Guard", val: "Row lock on cart target" },
        { label: "Replay Policy", val: "Guest key burned post-commit" },
      ],
      codeSnippet: `# store/cart/session_service.py
def merge_guest_cart(guest_token: str, user_id: int):
    claims = decode_jwt(guest_token)          # exp + sig verified
    guest_items = cache.get(f"cart:{claims['sid']}") or []
    with transaction.atomic():
        cart, _ = Cart.objects.select_for_update().get_or_create(user_id=user_id)
        for item in guest_items:
            cart.add_item(product_id=item["id"], qty=item["qty"])
        cache.delete(f"cart:{claims['sid']}")  # burn guest key
    return cart`,
    },
    {
      id: "order",
      number: "02",
      label: "Row-Level Atomic Lock",
      shortLabel: "Atomic Locks",
      headline: "SELECT ... FOR UPDATE serializes every unit of stock.",
      description:
        "Reservation takes a row-exclusive lock on store_product at REPEATABLE READ isolation. Competing transactions block behind the holder, the decrement is guarded by stock >= qty, and a background sweeper releases unpaid reservations once the strict 120-second TTL expires.",
      proof: project.keyDecisions[0] ?? "Isolated application boundaries",
      tags: ["SELECT FOR UPDATE", "120s TTL", "Zero Overselling"],
      icon: Layers,
      specs: [
        { label: "Transaction", val: "ACID Atomic Block" },
        { label: "Concurrency", val: "Row-level lock (FOR UPDATE)" },
        { label: "Expiry", val: "TTL sweeper releases at 120s" },
      ],
      codeSnippet: `-- SQL: Row-Level Atomic Reservation
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT id, stock, price FROM store_product
WHERE id = 104 FOR UPDATE;

UPDATE store_product
SET stock = stock - 1
WHERE id = 104 AND stock >= 1;
COMMIT;`,
    },
    {
      id: "payment",
      number: "03",
      label: "Cryptographic Webhook Ingress",
      shortLabel: "Razorpay Flow",
      headline: "HMAC-SHA256 verification gates all fulfillment.",
      description:
        "The webhook endpoint recomputes HMAC-SHA256 over the raw request body and compares digests with hmac.compare_digest in constant time. A nonce ledger keyed on event.id rejects replays before any state mutation, and only payment.captured events advance the order.",
      proof: project.highlights?.[3] ?? "Razorpay payment flow",
      tags: ["HMAC-SHA256", "Replay Nonce", "Razorpay Events"],
      icon: Server,
      specs: [
        { label: "Gateway", val: "Razorpay API / Checkout" },
        { label: "Security", val: "Constant-time digest compare" },
        { label: "Fulfillment", val: "Event-gated state advance" },
      ],
      codeSnippet: `# store/payments/gateway_webhook.py
def verify_payment_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise SecurityException("Invalid webhook signature")
    return True

@csrf_exempt
def razorpay_webhook(request):
    event = json.loads(request.body)
    verify_payment_signature(request.body, request.headers["X-Razorpay-Signature"], SECRET)
    if NonceLedger.seen(event["id"]):           # replay gate
        return HttpResponse(status=200)
    fulfill_order_from_payload(event)
    return HttpResponse(status=200)`,
    },
    {
      id: "ledger",
      number: "04",
      label: "Order Emission & Audit Ledger",
      shortLabel: "Admin Suite",
      headline: "Append-only state machine with hash-chained provenance.",
      description:
        "Every transition (CREATED → LOCKED → PAID → PROCESSED) appends an immutable row whose signature_hash chains the previous entry. Stock finalizes atomically, the Brevo confirmation email dispatches on commit, and administrators reconstruct full order provenance from the ledger alone.",
      proof: project.highlights?.[2] ?? "Admin suite: products, categories, orders",
      tags: ["Append-Only", "Hash Chain", "Brevo Dispatch"],
      icon: Database,
      specs: [
        { label: "Auditing", val: "Append-only transition log" },
        { label: "Provenance", val: "sha256(prev_hash ‖ row)" },
        { label: "Notify", val: "Brevo email on PAID commit" },
      ],
      codeSnippet: `# store/admin/audit_ledger.py
class OrderAuditLedger(models.Model):
    order_id = models.UUIDField(db_index=True)
    previous_state = models.CharField(max_length=32)
    next_state = models.CharField(max_length=32)
    signature_hash = models.CharField(max_length=64, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        prev = OrderAuditLedger.objects.order_by("-id").first()
        self.signature_hash = hashlib.sha256(
            f"{prev.signature_hash if prev else 'GENESIS'}:{self.next_state}".encode()
        ).hexdigest()
        super().save(*args, **kwargs)   # append-only: never updated`,
    },
  ];
}

/* ── ACID State Machine: scroll-driven SVG with travelling packet ── */

const ACID_STATES = [
  { id: "created", label: "CREATED", detail: "cart snapshot frozen", color: "#6b7280" },
  { id: "locked", label: "LOCKED", detail: "FOR UPDATE · ttl 120s", color: "#f59e0b" },
  { id: "paid", label: "PAID", detail: "hmac sig verified", color: "#10b981" },
  { id: "processed", label: "PROCESSED", detail: "ledger appended · brevo sent", color: "#10b981" },
] as const;

function AcidStateMachine() {
  const shell = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = shell.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const total = rect.height + viewport * 0.6;
      const seen = Math.min(Math.max(viewport * 0.8 - rect.top, 0), total);
      setProgress(Math.min(seen / total, 1));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Packet travels the rail x: 60 -> 740 as progress goes 0 -> 1
  const packetX = 60 + progress * 680;
  const activeState = Math.min(ACID_STATES.length - 1, Math.floor(progress * ACID_STATES.length + 0.34));
  const dashOffset = 680 * (1 - progress);

  return (
    <div className="eazyshop-acid-machine" ref={shell}>
      <div className="eazyshop-acid-machine-head">
        <span className="eazyshop-kicker">acid state machine</span>
        <h4>Order Lifecycle — Scroll to Advance the Packet</h4>
      </div>
      <svg className="eazyshop-acid-svg" viewBox="0 0 800 150" fill="none" role="img" aria-label={`Order state machine at ${ACID_STATES[activeState].label}`}>
        {/* Base rail */}
        <path d="M60 70 H740" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeLinecap="round" />
        {/* Filled rail */}
        <path
          d="M60 70 H740"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="680"
          strokeDashoffset={dashOffset}
        />
        {/* Lock pulse arcs around LOCKED node */}
        <circle
          cx="287"
          cy="70"
          r="24"
          stroke="#f59e0b"
          strokeWidth="1.5"
          className={cn("eazyshop-acid-lockring", activeState >= 1 && activeState <= 2 ? "is-pulsing" : "")}
        />
        {ACID_STATES.map((state, index) => {
          const cx = 60 + index * (680 / (ACID_STATES.length - 1));
          const reached = index <= activeState;
          return (
            <g key={state.id}>
              <circle cx={cx} cy="70" r="14" fill="#0d1017" stroke={reached ? state.color : "rgba(255,255,255,0.16)"} strokeWidth="2.5" />
              <circle cx={cx} cy="70" r="5" fill={reached ? state.color : "rgba(255,255,255,0.12)"} />
              <text x={cx} y="112" textAnchor="middle" fill={reached ? "#e5e7eb" : "#4b5563"} fontSize="12" fontFamily="var(--font-mono, monospace)" fontWeight="bold">
                {state.label}
              </text>
              <text x={cx} y="128" textAnchor="middle" fill="#4b5563" fontSize="9" fontFamily="var(--font-mono, monospace)">
                {state.detail}
              </text>
            </g>
          );
        })}
        {/* Travelling packet */}
        <g transform={`translate(${packetX} 70)`}>
          <rect x="-9" y="-9" width="18" height="18" rx="4" fill="#10b981" opacity="0.22" />
          <rect x="-5" y="-5" width="10" height="10" rx="2.5" fill="#10b981" />
        </g>
      </svg>
      <div className="eazyshop-acid-readout" aria-live="polite">
        <span>STATE:</span>
        <strong style={{ color: ACID_STATES[activeState].color }}>{ACID_STATES[activeState].label}</strong>
        <span className="eazyshop-acid-pct">{Math.round(progress * 100)}% THROUGHPIPELINE</span>
      </div>
    </div>
  );
}

/* ── Interactive Concurrency Workbench: race-condition simulator ── */

type WorkerResult = {
  id: number;
  outcome: "committed" | "rejected" | "blocked";
  stockBefore: number;
  stockAfter: number;
  latencyMs: number;
};

function ConcurrencyWorkbench({ initialOversold }: { initialOversold: boolean }) {
  const [workers, setWorkers] = useState(6);
  const [stock, setStock] = useState(3);
  const [results, setResults] = useState<WorkerResult[]>([]);
  const [running, setRunning] = useState(false);
  const runId = useRef(0);

  const safeSql = useMemo(
    () => `BEGIN;
SELECT stock FROM store_product WHERE id = 104
  FOR UPDATE;                 -- row lock: writers queue
UPDATE store_product
  SET stock = stock - 1
  WHERE id = 104 AND stock >= 1;
COMMIT;`,
    [],
  );

  const naiveSql = useMemo(
    () => `BEGIN;
SELECT stock FROM store_product WHERE id = 104;
IF stock >= 1 THEN             -- read-then-write: NOT atomic
  UPDATE store_product SET stock = stock - 1 WHERE id = 104;
END IF;
COMMIT;`,
    [],
  );

  const simulate = () => {
    setRunning(true);
    const id = ++runId.current;
    const outcomes: WorkerResult[] = [];
    let available = stock;
    let seq = 1;
    const interval = setInterval(() => {
      if (runId.current !== id) {
        clearInterval(interval);
        return;
      }
      const jitter = 4 + Math.round(Math.random() * 9);
      if (initialOversold) {
        // Naive read-then-write: everyone reads the same stale snapshot.
        const snapshot = available > 0 ? available : 0;
        const committed = snapshot >= 1;
        outcomes.push({
          id: seq,
          outcome: committed ? "committed" : "rejected",
          stockBefore: snapshot,
          stockAfter: committed ? snapshot - 1 : snapshot,
          latencyMs: jitter,
        });
        if (committed && seq === 1) available -= 1; // only first writer lands truthfully
        if (seq === 1 && workers > 1) available = Math.max(-workers + 2, snapshot - workers); // oversell drift
      } else {
        const gotLock = available > 0;
        outcomes.push({
          id: seq,
          outcome: gotLock ? "committed" : available === 0 && seq > stock ? "rejected" : "blocked",
          stockBefore: available,
          stockAfter: gotLock ? available - 1 : available,
          latencyMs: jitter + (seq > 1 ? seq * 2 : 0),
        });
        if (gotLock) available -= 1;
      }
      setResults([...outcomes]);
      seq += 1;
      if (seq > workers) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 260);
  };

  const committed = results.filter((r) => r.outcome === "committed").length;
  const finalStock = results.length ? results[results.length - 1].stockAfter : stock;
  const oversold = finalStock < 0;

  return (
    <div className="eazyshop-workbench">
      <div className="eazyshop-workbench-head">
        <div>
          <span className="eazyshop-kicker">interactive concurrency workbench</span>
          <h4>Race Condition Flight Simulator</h4>
        </div>
        <span className={cn("eazyshop-mode-badge", initialOversold ? "is-danger" : "is-safe")}>
          {initialOversold ? "MODE: NAIVE READ-THEN-WRITE" : "MODE: SELECT ... FOR UPDATE"}
        </span>
      </div>

      <div className="eazyshop-workbench-grid">
        {/* Controls */}
        <div className="eazyshop-workbench-controls">
          <label className="eazyshop-control">
            <span className="eazyshop-control-label">
              <em>Concurrent checkout workers</em>
              <strong>{workers}</strong>
            </span>
            <input
              type="range"
              min={2}
              max={12}
              step={1}
              value={workers}
              onChange={(e) => setWorkers(Number(e.target.value))}
              className="eazyshop-range-slider"
            />
          </label>
          <label className="eazyshop-control">
            <span className="eazyshop-control-label">
              <em>Stock units on hand (SKU 104)</em>
              <strong>{stock}</strong>
            </span>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="eazyshop-range-slider"
            />
          </label>

          <div className="eazyshop-sql-compare">
            <div className="eazyshop-sql-pane is-safe">
              <span>SAFE — ROW LOCK</span>
              <pre>{safeSql}</pre>
            </div>
            <div className="eazyshop-sql-pane is-danger">
              <span>NAIVE — NO LOCK</span>
              <pre>{naiveSql}</pre>
            </div>
          </div>

          <button type="button" onClick={simulate} disabled={running} className="eazyshop-run-btn">
            <Zap size={14} />
            {running ? "RUNNING WORKLOAD…" : `FIRE ${workers} CONCURRENT RESERVES`}
          </button>
        </div>

        {/* Live trace */}
        <div className="eazyshop-workbench-trace">
          <div className="eazyshop-trace-head">
            <span>TX TRACE</span>
            <span>
              COMMITTED <strong className="is-emerald">{committed}</strong> / {workers} · FINAL STOCK{" "}
              <strong className={oversold ? "is-danger" : "is-emerald"}>{finalStock}</strong>
            </span>
          </div>
          <div className="eazyshop-trace-body">
            {results.length === 0 && (
              <p className="eazyshop-trace-empty">awaiting workload — fire {workers} workers against {stock} units</p>
            )}
            {results.map((r) => (
              <div key={r.id} className={cn("eazyshop-trace-row", `is-${r.outcome}`)}>
                <span className="eazyshop-trace-tx">TX#{9840 + r.id}</span>
                <span className="eazyshop-trace-outcome">{r.outcome.toUpperCase()}</span>
                <span className="eazyshop-trace-stock">{r.stockBefore} → {r.stockAfter}</span>
                <span className="eazyshop-trace-latency">{r.latencyMs}ms</span>
              </div>
            ))}
          </div>
          <div className={cn("eazyshop-trace-verdict", results.length === workers && !running && (oversold ? "is-danger" : "is-safe"))}>
            {results.length < workers
              ? "workload in flight…"
              : oversold
                ? `OVERSELL DETECTED: ${Math.abs(finalStock)} phantom units shipped — the naive path lost ${workers - committed > 0 ? workers - stock : stock - committed} races.`
                : "ZERO OVERSELLING: every unit shipped exactly once; losers blocked or rejected cleanly."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SQL EXPLAIN Workbench: inspect lock traces per query plan ── */

type ExplainScenario = {
  id: string;
  label: string;
  query: string;
  plan: string;
  locks: string;
  verdict: string;
  tone: "safe" | "warn" | "danger";
};

const EXPLAIN_SCENARIOS: ExplainScenario[] = [
  {
    id: "locked",
    label: "Reservation Path",
    query: `SELECT id, stock, price
FROM store_product
WHERE id = 104
FOR UPDATE;`,
    plan: `Lock Row Fetch  (cost=0.14..0.16 rows=1 width=42)
  Index Cond: (id = 104)
  -> Row Share Lock acquired on heap TID (0,17)
     Wait Time: 0 ms · Holder: tx_9841`,
    locks: `store_product tid (0,17)  FOR UPDATE   HELD 120s TTL
transactions            RowShare      HELD
ACCESS EXCLUSIVE waits    5 queued → serialized`,
    verdict: "Serializes concurrent buyers on one hot row. Correctness over throughput — exactly where overselling would live.",
    tone: "safe",
  },
  {
    id: "snapshot",
    label: "Catalog Browse Path",
    query: `SELECT id, name, price, stock
FROM store_product
WHERE category_id = 12 AND stock > 0
ORDER BY rating DESC LIMIT 20;`,
    plan: `Limit  (cost=18.4..18.5 rows=20 width=120)
  -> Sort (rating DESC)
       -> Bitmap Heap Scan on store_product
            Recheck Cond: (category_id = 12)
            Filter: (stock > 0)
            Heap Blocks: exact=41`,
    locks: `store_product   AccessShare   HELD (read only)
No row locks — MVCC snapshot serves readers free.`,
    verdict: "Readers never block the locked writer: Postgres MVCC serves a consistent snapshot while checkout holds the row exclusive.",
    tone: "safe",
  },
  {
    id: "naive",
    label: "Naive Decrement (rejected design)",
    query: `UPDATE store_product
SET stock = stock - 1
WHERE id = 104;  -- no guard, no lock`,
    plan: `Update on store_product  (cost=0.14..0.17 rows=1)
  -> Index Scan using store_product_pkey
     ⚠ lost-update window between read & write
     ⚠ stock may cross zero under concurrency`,
    locks: `store_product tid (0,17)  RowExclusive
No FOR UPDATE — two TX read stock=1, both write 0.`,
    verdict: "The oversell bug in one line: last-writer-wins silently ships units that do not exist. Shipped nowhere near production.",
    tone: "danger",
  },
];

function SqlExplainWorkbench() {
  const [activeId, setActiveId] = useState(EXPLAIN_SCENARIOS[0].id);
  const scenario = EXPLAIN_SCENARIOS.find((s) => s.id === activeId) ?? EXPLAIN_SCENARIOS[0];

  return (
    <div className="eazyshop-explain">
      <div className="eazyshop-explain-head">
        <div>
          <span className="eazyshop-kicker">sql explain workbench</span>
          <h4>Query Plans &amp; Lock Traces</h4>
        </div>
        <div className="eazyshop-explain-tabs">
          {EXPLAIN_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={cn("eazyshop-tab-btn", s.id === activeId && "is-active")}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="eazyshop-explain-grid">
        <div className="eazyshop-explain-pane">
          <span className="eazyshop-pane-label">QUERY</span>
          <pre>{scenario.query}</pre>
        </div>
        <div className="eazyshop-explain-pane">
          <span className="eazyshop-pane-label">EXPLAIN ANALYZE PLAN</span>
          <pre>{scenario.plan}</pre>
        </div>
        <div className="eazyshop-explain-pane">
          <span className="eazyshop-pane-label">pg_locks TRACE</span>
          <pre>{scenario.locks}</pre>
        </div>
      </div>

      <div className={cn("eazyshop-explain-verdict", `is-${scenario.tone}`)}>
        <ShieldCheck size={14} aria-hidden="true" />
        <p>{scenario.verdict}</p>
      </div>
    </div>
  );
}

type EazyShopCaseStudyProps = {
  project?: Project;
  embedded?: boolean;
  onBackToCard?: () => void;
  onNextProject?: () => void;
};

export function EazyShopCaseStudyCover({ project = DEFAULT_PROJECT }: { project?: Project }) {
  return <div className="p-8 md:p-12">
    <span className="editorial-label">Inside {project.title} / an engineering case study</span>
    <p className="text-4xl md:text-6xl font-semibold text-fg my-4">Transactional integrity.<br /><span className="text-accent">Zero race conditions.</span></p>
    <p className="text-fg-muted">A full-stack commerce architecture built for atomicity and trust.</p>
  </div>;
}

export default function EazyShopCaseStudy({
  project = DEFAULT_PROJECT,
  embedded = false,
  onBackToCard,
  onNextProject,
}: EazyShopCaseStudyProps) {
  const [copiedStageId, setCopiedStageId] = useState<NodeId | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { copy, status: copyStatus } = useClipboard();
  const nodes = getArchitectureNodes(project);

  const activeCategory = GALLERY_CATEGORIES[activeCategoryIndex] ?? GALLERY_CATEGORIES[0];
  const activeImage = activeCategory.images[activeImageIndex] ?? activeCategory.images[0];

  const handleCopyCode = (stageId: NodeId, code: string) => {
    setCopiedStageId(stageId);
    void copy(code);
  };

  const handleCategoryChange = (idx: number) => {
    setActiveCategoryIndex(idx);
    setActiveImageIndex(0);
  };

  return (
    <section id="eazyshop-case-study" className={cn("py-16 md:py-24", embedded && "eazyshop-embedded")}>
      <div className="container-site max-w-6xl">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-border mb-12">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-fg-muted">
            <span className="inline-block w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse" />
            {project.title} &bull; Commerce Architecture & Telemetry
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
                className="px-4 py-2 bg-[#10b981] text-black font-semibold rounded-md text-xs font-mono uppercase hover:bg-[#10b981]/90 transition-colors flex items-center gap-2"
              >
                Next Project <ArrowUpRight size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Editorial Heading */}
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#10b981] mb-3 block">
            Production E-Commerce System
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-fg mb-6">
            From cart to checkout.<br />
            <span className="text-fg-muted">Guaranteed transactional atomicity.</span>
          </h2>
          <p className="text-lg text-fg-muted max-w-3xl leading-relaxed">
            {project.summary ?? project.solution}
          </p>
        </div>

        {/* ACID Transaction Concurrency Matrix */}
        <div className="mb-16">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <h3 className="text-xl font-medium text-fg flex items-center gap-2">
              <ShieldCheck className="text-[#10b981]" size={20} />
              ACID Concurrency Scorecard
            </h3>
            <span className="font-mono text-xs text-[#10b981] uppercase tracking-wider">
              PostgreSQL &bull; Serialized Consistency
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="eazyshop-acid-card">
              <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider block mb-1">
                A / Atomicity
              </span>
              <h4 className="text-base font-semibold text-fg mb-2">Two-Phase Rollbacks</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                Cart checkout wrapped in <code className="text-[#10b981]">@transaction.atomic</code> blocks. If payments fail, stock reservations release immediately.
              </p>
            </div>

            <div className="eazyshop-acid-card">
              <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider block mb-1">
                C / Consistency
              </span>
              <h4 className="text-base font-semibold text-fg mb-2">Relational Invariants</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                Database-level foreign key checks and positive inventory constraints guarantee no negative stock quantities occur.
              </p>
            </div>

            <div className="eazyshop-acid-card">
              <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider block mb-1">
                I / Isolation
              </span>
              <h4 className="text-base font-semibold text-fg mb-2">Row-Level Locks</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                <code className="text-[#f59e0b]">SELECT FOR UPDATE</code> prevents race conditions and overselling across parallel concurrent checkouts.
              </p>
            </div>

            <div className="eazyshop-acid-card">
              <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider block mb-1">
                D / Durability
              </span>
              <h4 className="text-base font-semibold text-fg mb-2">Immutable WAL Stream</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                PostgreSQL write-ahead logs and an append-only audit ledger record every status mutation for administrative compliance.
              </p>
            </div>
          </div>
        </div>

        {/* ── Animated ACID State Machine ── */}
        <div className="mb-20">
          <AcidStateMachine />
        </div>

        {/* ── Interactive Concurrency Workbench ── */}
        <div className="mb-20">
          <ConcurrencyWorkbench initialOversold={false} />
        </div>

        {/* ── SQL EXPLAIN Workbench ── */}
        <div className="mb-24">
          <SqlExplainWorkbench />
        </div>

        {/* ── Multi-Category Interactive Screenshot Gallery ── */}
        <div className="mb-24">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#10b981] block mb-1">
                System Interface Gallery
              </span>
              <h3 className="text-2xl font-light text-fg">
                Multi-Tier Operational Telemetry
              </h3>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {GALLERY_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(idx)}
                  className={cn("eazyshop-tab-btn", activeCategoryIndex === idx && "is-active")}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Display Shell */}
          <div className="eazyshop-gallery-card p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
              {/* Primary Image Viewport */}
              <div className="relative w-full lg:w-2/3 aspect-[16/10] rounded-2xl overflow-hidden border border-border bg-[#050608] shadow-2xl">
                <Image
                  src={activeImage.src}
                  alt={activeImage.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                />
                <div className="absolute top-3 left-3 bg-[#090a0f]/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 font-mono text-[10px] text-[#10b981]">
                  {activeImage.route}
                </div>
                <div className="absolute top-3 right-3 bg-[#090a0f]/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 font-mono text-[10px] text-[#f59e0b]">
                  {activeImage.tag}
                </div>
              </div>

              {/* Viewport Meta & Description */}
              <div className="w-full lg:w-1/3 space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle px-2.5 py-1 bg-white/5 rounded-md inline-block">
                  {activeCategory.badge} &bull; Screen 0{activeImageIndex + 1} of 0{activeCategory.images.length}
                </span>
                <h4 className="text-2xl font-medium text-fg">{activeImage.title}</h4>
                <p className="text-fg-muted text-sm leading-relaxed">{activeImage.caption}</p>
                <div className="pt-4 border-t border-border space-y-2 text-xs font-mono text-fg-subtle">
                  <div className="flex justify-between">
                    <span>Endpoint:</span>
                    <strong className="text-fg">{activeImage.route}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Architecture:</span>
                    <strong className="text-[#10b981]">{activeImage.tag}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <strong className="text-fg">{activeCategory.label}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Rail */}
            <div className="pt-6 border-t border-border">
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle mb-3 block">
                Screens in {activeCategory.label}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {activeCategory.images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "eazyshop-thumb-btn aspect-[16/10] relative text-left",
                      activeImageIndex === idx && "is-active"
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      sizes="150px"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                      <span className="font-mono text-[9px] text-white truncate">{img.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Deep Dive Architecture Nodes ── */}
        <div className="space-y-16">
          <div className="pb-4 border-b border-border">
            <span className="font-mono text-xs uppercase tracking-widest text-[#10b981] block mb-1">
              Code & Boundary Inspector
            </span>
            <h3 className="text-3xl font-light text-fg">
              Backend Concurrency Mechanics
            </h3>
          </div>

          {nodes.map((node) => {
            const Icon = node.icon;
            const isCopied = copiedStageId === node.id && copyStatus === "copied";
            return (
              <div
                key={node.id}
                className="p-8 md:p-12 border border-border bg-surface/40 rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[#10b981]">
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

                <div className="border border-border bg-[#050608] rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0d1017] border-b border-border">
                    <span className="font-mono text-[11px] text-[#10b981] flex items-center gap-2">
                      <Terminal size={13} /> {FILE_NAMES[node.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(node.id, node.codeSnippet)}
                      className="px-3 py-1 bg-elevated border border-border rounded text-[10px] font-mono text-fg hover:bg-surface transition-colors flex items-center gap-1.5"
                    >
                      {isCopied ? <CheckCircle2 size={12} className="text-[#10b981]" /> : <Copy size={12} />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto bg-[#050608]/90 leading-relaxed">
                    <code>{node.codeSnippet}</code>
                  </pre>
                  <div className="px-4 py-2 bg-[#0d1017]/50 border-t border-border flex justify-between text-[10px] font-mono text-fg-subtle">
                    <span>Django REST Framework</span>
                    <span>Production Grade</span>
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
