"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Layers,
  Server,
  ShieldCheck,
  ShoppingBag,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { projects, type Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import useClipboard from "@/hooks/useClipboard";

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
      label: "Session & Cart",
      shortLabel: "Cart State",
      headline: "Distributed cart state with instant synchronization.",
      description:
        "JWT-backed session management synchronizes shopping cart items across client state and database persistence, preventing race conditions during inventory lookup.",
      proof: project.summary ?? project.solution,
      tags: ["JWT Sessions", "Redis Cache", "Inventory Lookup"],
      icon: ShoppingBag,
      specs: [
        { label: "Session Store", val: "Signed JWT + Redis" },
        { label: "State Sync", val: "Optimistic React state" },
        { label: "Validation", val: "Stock availability check" },
      ],
      codeSnippet: `def get_or_create_cart(request):
    session_token = request.COOKIES.get('cart_token')
    cart, created = CartSession.objects.get_or_create(token=session_token)
    return cart`,
    },
    {
      id: "order",
      number: "02",
      label: "Order Commitment",
      shortLabel: "Atomic Locks",
      headline: "Atomic reservation locks prevent double-booking.",
      description:
        "Database-level transactions guarantee that stock reservation and order creation occur atomically. If payment fails, inventory is released immediately.",
      proof: project.keyDecisions[0] ?? "Isolated application boundaries",
      tags: ["Database Transactions", "Atomic Locks", "Stock Reservation"],
      icon: Layers,
      specs: [
        { label: "Transaction", val: "ACID Atomic Block" },
        { label: "Concurrency", val: "Row-level locking (SELECT FOR UPDATE)" },
        { label: "Rollback", val: "Automatic on exception" },
      ],
      codeSnippet: `@transaction.atomic
def commit_order(cart_id, shipping_address):
    cart = Cart.objects.select_for_update().get(id=cart_id)
    order = Order.objects.create_from_cart(cart, shipping_address)
    cart.clear()
    return order`,
    },
    {
      id: "payment",
      number: "03",
      label: "Payment Gateway",
      shortLabel: "Razorpay Flow",
      headline: "Cryptographically verified webhook payment commits.",
      description:
        "Razorpay payment signatures are validated via HMAC-SHA256 webhooks. Successful transactions immediately trigger order fulfillment status updates.",
      proof: project.highlights?.[3] ?? "Razorpay payment flow",
      tags: ["Razorpay", "HMAC Signatures", "Webhook Validation"],
      icon: Server,
      specs: [
        { label: "Gateway", val: "Razorpay API / Checkout" },
        { label: "Security", val: "HMAC-SHA256 signature verification" },
        { label: "Fulfillment", val: "Event-driven status update" },
      ],
      codeSnippet: `@csrf_exempt
def razorpay_webhook(request):
    signature = request.headers.get('X-Razorpay-Signature')
    verify_webhook_signature(request.body, signature)
    fulfill_order_from_payload(request.json())
    return HttpResponse(status=200)`,
    },
    {
      id: "ledger",
      number: "04",
      label: "Audit Ledger",
      shortLabel: "Admin Suite",
      headline: "Immutable order streams and administrative telemetry.",
      description:
        "A comprehensive admin suite monitors catalogue inventory, user reviews, and transactional audit logs across all store operations.",
      proof: project.highlights?.[2] ?? "Admin suite: products, categories, orders",
      tags: ["Audit Logging", "Admin Dashboard", "Review Moderation"],
      icon: Database,
      specs: [
        { label: "Auditing", val: "Append-only transaction log" },
        { label: "Dashboards", val: "Django Admin + React Views" },
        { label: "Moderation", val: "User review & rating pipeline" },
      ],
      codeSnippet: `class AuditLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=128)
    timestamp = models.DateTimeField(auto_now_add=True)
    payload = models.JSONField()`,
    },
  ];
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
          <div className="flex items-center gap-3">
            {project.links?.find((l) => l.kind === "live") && (
              <a
                href={project.links.find((l) => l.kind === "live")?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981] rounded-md text-xs font-mono uppercase hover:bg-[#10b981]/20 transition-colors flex items-center gap-1.5"
              >
                Live Storefront <ExternalLink size={13} />
              </a>
            )}
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
        <div className="mb-20">
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
