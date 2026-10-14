"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Terminal, ShieldCheck, Database, KeyRound, CheckCircle2, ArrowDown } from "lucide-react";
import Image from "next/image";
import type { Project } from "@/lib/content/projects";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import EazyShopCaseStudy from "@/components/sections/EazyShopCaseStudy";

const chapters = [
  {
    id: "session",
    number: "01",
    eyebrow: "01 / SESSION HYDRATION",
    title: "Distributed cart sync across unauthenticated edges.",
    copy: "JWT session tokens merge guest carts into persistent PostgreSQL records without race conditions when users authenticate midway through a checkout flow.",
    image: "/images/eazyshop/cart.png",
    metric: "Redis + JWT Claims",
    status: "SYNC_HYDRATED",
    icon: Database,
    code: `# store/cart/session_service.py
def merge_guest_cart(guest_token: str, user_id: int):
    guest_items = cache.get(f"cart:{guest_token}") or []
    with transaction.atomic():
        cart, _ = Cart.objects.select_for_update().get_or_create(user_id=user_id)
        for item in guest_items:
            cart.add_item(product_id=item['id'], qty=item['qty'])
    return cart`,
  },
  {
    id: "atomic",
    number: "02",
    eyebrow: "02 / ROW-LEVEL ATOMIC LOCK",
    title: "Two-phase commits prevent inventory double-booking.",
    copy: "Database row-level locks (SELECT ... FOR UPDATE) hold product units during payment initiation. Unpaid carts auto-release reservations after a strict 120s TTL.",
    image: "/images/eazyshop/checkout1.png",
    metric: "ACID Isolation",
    status: "LOCK_ACQUIRED",
    icon: ShieldCheck,
    code: `-- SQL: Row-Level Atomic Reservation
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT id, stock, price FROM store_product
WHERE id = 104 FOR UPDATE;

UPDATE store_product
SET stock = stock - 1
WHERE id = 104 AND stock >= 1;
COMMIT;`,
  },
  {
    id: "webhook",
    number: "03",
    eyebrow: "03 / CRYPTOGRAPHIC WEBHOOK",
    title: "HMAC-SHA256 signature verification at edge ingress.",
    copy: "Razorpay payment webhooks are mathematically verified using pre-shared HMAC secrets before order fulfillment fires, preventing replay attacks and forged payments.",
    image: "/images/eazyshop/rzp1.png",
    metric: "HMAC-SHA256",
    status: "SIG_VERIFIED",
    icon: KeyRound,
    code: `# store/payments/gateway_webhook.py
def verify_payment_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise SecurityException("Invalid webhook signature")
    return True`,
  },
  {
    id: "ledger",
    number: "04",
    eyebrow: "04 / IMMUTABLE AUDIT LEDGER",
    title: "Append-only order telemetry & administrative auditing.",
    copy: "Every status transition is logged to an immutable ledger stream. Administrators track catalogue changes, order fulfillment states, and user claims with full provenance.",
    image: "/images/eazyshop/admin_logs.png",
    metric: "Append-Only",
    status: "ORDER_COMMITTED",
    icon: CheckCircle2,
    code: `# store/admin/audit_ledger.py
class OrderAuditLedger(models.Model):
    order_id = models.UUIDField(db_index=True)
    previous_state = models.CharField(max_length=32)
    next_state = models.CharField(max_length=32)
    signature_hash = models.CharField(max_length=64, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)`,
  },
];

export default function EazyShopProjectExperience({ project, children }: { project: Project; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    registerGsap();
    const container = root.current;
    if (!container) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const stage = container.querySelector<HTMLElement>(".eazyshop-vault-stage");
      const panels = gsap.utils.toArray<HTMLElement>(".eazyshop-display-screen-layer");
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
  const ActiveIcon = activeChapter.icon;

  return (
    <div ref={root} id="eazyshop" className="eazyshop-experience relative w-full">
      <div className="eazyshop-project-card">{children}</div>

      {/* Intro Header */}
      <div className="pt-8 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#10b981] mb-6">
          <Terminal size={14} /> {project.title} &bull; High-Concurrency Transaction Engine
        </div>
        <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-6 text-fg">
          Commerce engineered for <span className="text-[#10b981]">absolute concurrency.</span>
        </h2>
        <p className="text-fg-muted max-w-2xl text-lg font-light leading-relaxed">
          From distributed cart state synchronization and two-phase atomic locking to HMAC webhook verification and immutable ledger auditing.
        </p>
      </div>

      {/* ── Pinned Transaction Stage ── */}
      <div className="eazyshop-stage-container">
        <div className="eazyshop-vault-stage">
          {/* Header Telemetry Bar */}
          <div className="eazyshop-vault-header">
            <div className="eazyshop-telemetry-pill">
              <span className="eazyshop-status-led" />
              <span>TRANSACTION PIPELINE // LIVE ENCLAVE</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs text-fg-muted">
              <span>ISOLATION: <strong className="text-[#10b981]">ACID REPEATABLE READ</strong></span>
              <span className="text-white/20">|</span>
              <span>STATE: <strong className="text-[#f59e0b]">{activeChapter.status}</strong></span>
            </div>
          </div>

          <div className="eazyshop-vault-grid">
            {/* ── Left Deck: Stepper Navigation & Stable Code Drawer ── */}
            <div className="eazyshop-phase-stepper">
              <div className="flex flex-col gap-2.5">
                {chapters.map((ch, idx) => {
                  const Icon = ch.icon;
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={ch.id}
                      className={`eazyshop-stepper-btn ${isActive ? "is-active" : ""}`}
                      onClick={() => setActiveStep(idx)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="eazyshop-step-number">{ch.number}</div>
                      <div className="eazyshop-step-content">
                        <div className="eazyshop-step-title">
                          <span className="flex items-center gap-2">
                            <Icon size={15} className={isActive ? "text-[#10b981]" : "text-fg-muted"} />
                            {ch.title}
                          </span>
                          <span className="eazyshop-step-metric">{ch.metric}</span>
                        </div>
                        <p className="eazyshop-step-desc">{ch.copy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dedicated Stable Code Drawer */}
              <div className="eazyshop-code-drawer">
                <div className="eazyshop-code-drawer-header">
                  <span className="flex items-center gap-2 text-xs font-mono text-[#10b981]">
                    <ActiveIcon size={13} /> {activeChapter.eyebrow}
                  </span>
                  <span className="text-[10px] font-mono text-fg-muted">{activeChapter.metric}</span>
                </div>
                <div className="eazyshop-code-box">
                  <pre><code>{activeChapter.code}</code></pre>
                </div>
              </div>
            </div>

            {/* ── Right Deck: POS Terminal & Live Thermal Receipt ── */}
            <div className="eazyshop-pos-container eazyshop-stage-viewport">
              <div className="eazyshop-terminal-shell">
                <div className="eazyshop-terminal-topbar">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-fg-muted uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    <span>POS_TERMINAL // STAGE {activeStep + 1} OF 4</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#f59e0b] px-2 py-0.5 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                    {activeChapter.status}
                  </span>
                </div>

                <div className="eazyshop-display-screen">
                  {/* Laser Scanning Line */}
                  <div className="eazyshop-scanner-beam" />

                  {chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      className={`eazyshop-display-screen-layer absolute inset-0 w-full h-full ${activeStep === idx ? "is-active" : ""}`}
                    >
                      <Image
                        src={ch.image}
                        alt={ch.title}
                        fill
                        sizes="(max-width: 1024px) 95vw, 650px"
                        className="object-cover object-top"
                        priority={idx === 0}
                      />
                    </div>
                  ))}

                  {/* Thermal Receipt Tape (Positioned at bottom-right of screen, NEVER blocking topbar) */}
                  <div className="eazyshop-receipt-ticket">
                    <div className="eazyshop-receipt-header">
                      KRYPTON // EAZYSHOP<br />
                      <span>TX#{9841 + activeStep * 112}-AUTH</span>
                    </div>
                    <div className="eazyshop-receipt-row">
                      <span>STATUS:</span>
                      <strong>{activeChapter.status}</strong>
                    </div>
                    <div className="eazyshop-receipt-row">
                      <span>LOCK_TTL:</span>
                      <span>120 SECONDS</span>
                    </div>
                    <div className="eazyshop-receipt-row">
                      <span>SECURITY:</span>
                      <span>HMAC-SHA256</span>
                    </div>
                    <div className="eazyshop-receipt-row">
                      <span>AMOUNT:</span>
                      <span>₹4,999.00</span>
                    </div>
                    <div className="eazyshop-receipt-stamp">
                      {activeStep >= 2 ? "✓ PAID & CAPTURED" : "HOLD RESERVED"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-8">
        <a href="#eazyshop-case-study" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-[#10b981] transition-colors">
          Explore Architecture Blueprint & Code <ArrowDown size={14} />
        </a>
      </div>

      {/* Deep-Dive Case Study Component */}
      <EazyShopCaseStudy project={project} embedded />
    </div>
  );
}
