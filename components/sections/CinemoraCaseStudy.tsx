"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  QrCode,
  Radio,
  ShieldAlert,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import { ProjectActionButtons } from "@/components/ui/project-action-buttons";

type SeatState = "available" | "selected" | "held" | "locked";

type Seat = {
  id: string;
  row: string;
  number: number;
  tier: "VIP" | "Premium" | "Standard" | "Economy";
  price: number;
  state: SeatState;
  client?: string;
};

const INITIAL_SEATS: Seat[] = [
  // Row A: VIP ($30)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `A${i + 1}`,
    row: "A",
    number: i + 1,
    tier: "VIP" as const,
    price: 30,
    state: (i === 1 ? "locked" : i === 5 ? "held" : "available") as SeatState,
    client: i === 5 ? "User_Tokyo" : undefined,
  })),
  // Row B: Premium ($22)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `B${i + 1}`,
    row: "B",
    number: i + 1,
    tier: "Premium" as const,
    price: 22,
    state: (i === 2 || i === 7 ? "locked" : i === 4 ? "held" : "available") as SeatState,
    client: i === 4 ? "User_Berlin" : undefined,
  })),
  // Row C: Standard ($16)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `C${i + 1}`,
    row: "C",
    number: i + 1,
    tier: "Standard" as const,
    price: 16,
    state: (i === 0 || i === 8 ? "locked" : "available") as SeatState,
  })),
  // Row D: Economy ($12)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `D${i + 1}`,
    row: "D",
    number: i + 1,
    tier: "Economy" as const,
    price: 12,
    state: (i === 3 || i === 9 ? "locked" : "available") as SeatState,
  })),
];

const CINEMORA_SCREENS = [
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185403.png",
    title: "Real-Time Seating Layout & WebSocket Map",
    caption: "Interactive theatre seating plan synchronizing seat selection states with PostgreSQL and Redis Pub/Sub.",
    cat: "seating",
    tag: "Real-Time Seating",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185206.png",
    title: "Booking Checkout & Seat Reservation",
    caption: "Serialized checkout pipeline with 15-minute temporary holds backed by compound-indexed TTL sweeps.",
    cat: "booking",
    tag: "Booking Flow",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185221.png",
    title: "Razorpay Payment Gateway Modal",
    caption: "Transactional payment handling verifying webhook cryptographic signatures prior to row commit.",
    cat: "booking",
    tag: "Payment Gateway",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185235.png",
    title: "Cryptographic QR Ticket Generation",
    caption: "High-entropy gatekeeper ticket rendered with single-use verification token and anti-tamper watermark.",
    cat: "verification",
    tag: "QR Gatekeeper",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185247.png",
    title: "Booking Confirmation & Download Pass",
    caption: "Customer receipt portal with wallet refund eligibility tracker and instant PDF/Wallet download pass.",
    cat: "booking",
    tag: "Booking Flow",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185301.png",
    title: "Customer Booking Ledger & Order History",
    caption: "Auditable booking history showing showtime metadata, transaction IDs, and active ticket states.",
    cat: "booking",
    tag: "Booking History",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185315.png",
    title: "Instant Wallet Refund Execution",
    caption: "Automated tiered cancellation engine calculating penalty windows and crediting the user balance instantly.",
    cat: "booking",
    tag: "Refund Engine",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185332.png",
    title: "User Profile & Loyalty Rewards Balance",
    caption: "Integrated user management tracking verified bookings, stored cards, and accumulated points.",
    cat: "booking",
    tag: "Customer Profile",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_184922.png",
    title: "Multiplex Movie Discovery Catalog",
    caption: "Filterable cinema showtime portal with multi-genre filters, language selectors, and trailer embeds.",
    cat: "admin",
    tag: "Movie Catalog",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_184930.png",
    title: "Movie Showtime Details & Cast Overview",
    caption: "Detailed showtime landing view with synopsis, cast credits, age rating, and auditorium selection.",
    cat: "admin",
    tag: "Showtime Portal",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_184942.png",
    title: "Theater Screen Selection & Schedule",
    caption: "Multi-screen scheduling interface displaying IMAX, 4DX, and Dolby Atmos audio-visual formats.",
    cat: "admin",
    tag: "Multiplex Screens",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185116.png",
    title: "Date & Showtime Reservation Matrix",
    caption: "Interactive calendar picker routing viewers to active auditoriums with real-time seat availability.",
    cat: "seating",
    tag: "Schedule Matrix",
  },
  {
    src: "/images/cinemora/Screenshot_2026-10-17_185153.png",
    title: "Auditorium Seating Matrix Configurator",
    caption: "Theater configuration engine supporting tiered pricing, wheelchair accessibility, and VIP lounges.",
    cat: "admin",
    tag: "Admin Config",
  },
];

export default function CinemoraCaseStudy({
  project,
}: {
  project: Project;
  embedded?: boolean;
}) {
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [raceTriggered, setRaceTriggered] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [turnstileOpen, setTurnstileOpen] = useState(false);
  const [scanResult, setScanResult] = useState<"ready" | "granted" | "denied">("ready");
  const [refundHours, setRefundHours] = useState(36);
  const [walletBalance, setWalletBalance] = useState(120.0);
  const [refundCelebration, setRefundCelebration] = useState(false);
  const [activeCircuitNode, setActiveCircuitNode] = useState<"daphne" | "redis" | "postgres" | "razorpay">("daphne");
  const [activeScreenFilter, setActiveScreenFilter] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [wsLogs, setWsLogs] = useState<string[]>([
    "19:42:01 [DAPHNE_ASGI] Handshake accepted on /ws/showtimes/104/seats/",
    "19:42:02 [REDIS_LAYER] Client subscribed to channel group 'showtime_104'",
    "19:42:03 [HEARTBEAT] 42 clients connected with zero delta drift",
  ]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.state === "locked") return;
    if (seat.state === "held" && seat.client !== "You") return;

    const nextState: SeatState = seat.state === "available" ? "selected" : "available";
    setSeats((prev) =>
      prev.map((s) => (s.id === seat.id ? { ...s, state: nextState, client: nextState === "selected" ? "You" : undefined } : s))
    );
    setSelectedSeatId(nextState === "selected" ? seat.id : null);

    const timestamp = new Date().toISOString().substring(11, 23);
    if (nextState === "selected") {
      setWsLogs((prev) => [
        `${timestamp} [TX_LOCK] SELECT ... FOR UPDATE locked seat ${seat.id} (${seat.tier})`,
        `${timestamp} [WSS_PUSH] transaction.on_commit -> group_send('showtime_104', state=HELD)`,
        ...prev.slice(0, 5),
      ]);
    } else {
      setWsLogs((prev) => [
        `${timestamp} [TX_RELEASE] Seat ${seat.id} released back to public pool`,
        `${timestamp} [WSS_PUSH] group_send('showtime_104', state=AVAILABLE)`,
        ...prev.slice(0, 5),
      ]);
    }
  };

  const simulateRaceCondition = () => {
    setRaceTriggered(true);
    const timestamp = new Date().toISOString().substring(11, 23);

    setWsLogs((prev) => [
      `${timestamp} [DUEL] User_Tokyo (TX#9841) & User_London (TX#9842) targeted Seat A4 concurrently`,
      `${timestamp} [LOCK_ACQUIRED] User_Tokyo obtained row lock on A4. Status: 200 OK`,
      `${timestamp} [CONFLICT_409] User_London blocked by row lock: 409 Conflict (Seat Held)`,
      ...prev.slice(0, 5),
    ]);

    setSeats((prev) =>
      prev.map((s) => (s.id === "A4" ? { ...s, state: "selected", client: "User_Tokyo" } : s))
    );

    setTimeout(() => {
      setRaceTriggered(false);
    }, 4500);
  };

  const simulateBurstTraffic = () => {
    setBurstActive(true);
    const timestamp = new Date().toISOString().substring(11, 23);

    setWsLogs((prev) => [
      `${timestamp} [BURST_TRAFFIC] 50 simulated users connecting across 4 ASGI worker pools`,
      `${timestamp} [CONCURRENCY] Batch processing seat reservation queue via Redis Pub/Sub`,
      ...prev.slice(0, 5),
    ]);

    const targetIds = ["A3", "B5", "B6", "C3", "C4", "C5", "D2", "D7"];
    setSeats((prev) =>
      prev.map((s) => (targetIds.includes(s.id) ? { ...s, state: "held", client: "Burst_Client" } : s))
    );

    setTimeout(() => {
      setBurstActive(false);
      setWsLogs((prev) => [
        `${new Date().toISOString().substring(11, 23)} [BURST_COMPLETE] 8 seats locked atomically with 0 collisions`,
        ...prev.slice(0, 5),
      ]);
    }, 3000);
  };

  const scanTurnstileTicket = (mode: "valid" | "duplicate") => {
    if (mode === "valid") {
      setScanResult("granted");
      setTurnstileOpen(true);
      const timestamp = new Date().toISOString().substring(11, 23);
      setWsLogs((prev) => [
        `${timestamp} [QR_GATE] BK9X4M2QW7 signature verified via secrets.token_urlsafe`,
        `${timestamp} [TURNSTILE] Gate arms unlatched. Single-use timestamp written to DB`,
        ...prev.slice(0, 5),
      ]);
      setTimeout(() => {
        setTurnstileOpen(false);
        setScanResult("ready");
      }, 4000);
    } else {
      setScanResult("denied");
      setTurnstileOpen(false);
      const timestamp = new Date().toISOString().substring(11, 23);
      setWsLogs((prev) => [
        `${timestamp} [SECURITY_ALERT] BK9X4M2QW7 was already redeemed at 19:42:01`,
        `${timestamp} [FRAUD_BLOCKED] Entry denied at Turnstile 01. Strobe alarm triggered`,
        ...prev.slice(0, 5),
      ]);
      setTimeout(() => {
        setScanResult("ready");
      }, 4000);
    }
  };

  const refundCalculation = useMemo(() => {
    const ticketPrice = 25.0;
    if (refundHours >= 48) {
      return { refund: ticketPrice, fee: 0, percent: "100%", status: "FULL REFUND (NO PENALTY)" };
    } else if (refundHours >= 24) {
      return { refund: ticketPrice * 0.75, fee: ticketPrice * 0.25, percent: "75%", status: "75% REFUND (25% FEE)" };
    } else if (refundHours >= 2) {
      return { refund: ticketPrice * 0.5, fee: ticketPrice * 0.5, percent: "50%", status: "50% LATE CANCELLATION FEE" };
    }
    return { refund: 0, fee: ticketPrice, percent: "0%", status: "SHOWTIME LOCKED (NON-REFUNDABLE)" };
  }, [refundHours]);

  const executeInstantRefund = () => {
    if (refundCalculation.refund <= 0) return;
    setWalletBalance((prev) => prev + refundCalculation.refund);
    setRefundCelebration(true);
    const timestamp = new Date().toISOString().substring(11, 23);
    setWsLogs((prev) => [
      `${timestamp} [WALLET_CREDIT] +$${refundCalculation.refund.toFixed(2)} refunded to customer ledger`,
      `${timestamp} [ACID_TX] Row lock released on booked seats. Returned to public pool`,
      ...prev.slice(0, 5),
    ]);
    setTimeout(() => setRefundCelebration(false), 2500);
  };

  const filteredScreens = useMemo(() => {
    if (activeScreenFilter === "all") return CINEMORA_SCREENS;
    return CINEMORA_SCREENS.filter((s) => s.cat === activeScreenFilter);
  }, [activeScreenFilter]);

  return (
    <article className="cinemora-case-study relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ── 35mm Film Strip Header Decorator ── */}
      <div className="mb-12 overflow-hidden rounded-xl border border-white/10 bg-black/80">
        <div className="cinemora-film-strip">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="cinemora-sprocket" />
          ))}
        </div>
      </div>

      {/* ── Action Bar & Links ── */}
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="cinemora-live-beacon" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#f59e0b]">
            Distributed Real-Time Concurrency System
          </span>
        </div>
        <ProjectActionButtons project={project} size="sm" />
      </div>

      {/* ── High-Impact KPI Metrics Strip ── */}
      {project.metrics && project.metrics.length > 0 && (
        <div className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {project.metrics.map((metric, i) => (
            <div
              key={metric.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 backdrop-blur-md transition-all hover:border-[#f59e0b]/30"
            >
              <div className="absolute right-4 top-4 font-mono text-xs text-white/20">0{i + 1}</div>
              <div className="font-mono text-2xl font-light tracking-tight text-[#f59e0b] sm:text-3xl">
                {metric.value}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-white/60">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SIMULATION BAY 1: LIVE 3D IMAX AUDITORIUM & CONCURRENCY DUEL ── */}
      <section className="mb-28 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c0f18] to-[#06070a] p-6 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="cinemora-projector-ray" />

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#06b6d4] mb-2">
              <Zap size={14} /> Interactive Simulation Bay 01
            </div>
            <h3 className="text-3xl font-light text-white sm:text-4xl">
              Real-Time IMAX Seating Map & WebSocket Bus
            </h3>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Click any seat to acquire a row-exclusive PostgreSQL lock. Or test the concurrent race condition and watch Daphne ASGI serialize reservations with mathematical precision.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={simulateRaceCondition}
              disabled={raceTriggered}
              className="flex items-center gap-2 rounded-xl border border-[#e11d48]/40 bg-[#e11d48]/10 px-4 py-2.5 font-mono text-xs text-[#f43f5e] hover:bg-[#e11d48]/20 transition-all shadow-lg shadow-[#e11d48]/20 disabled:opacity-50"
            >
              <Lock size={14} />
              <span>Simulate Concurrency Race (409)</span>
            </button>
            <button
              onClick={simulateBurstTraffic}
              disabled={burstActive}
              className="flex items-center gap-2 rounded-xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 px-4 py-2.5 font-mono text-xs text-[#06b6d4] hover:bg-[#06b6d4]/20 transition-all shadow-lg shadow-[#06b6d4]/20 disabled:opacity-50"
            >
              <Users size={14} />
              <span>Simulate 50-User Burst Swarm</span>
            </button>
          </div>
        </div>

        {/* Race Condition Visual Clash Banner */}
        {raceTriggered && (
          <div className="mb-6 rounded-2xl border border-[#e11d48]/50 bg-[#e11d48]/10 p-4 font-mono text-xs text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <ShieldAlert size={20} className="text-[#e11d48] animate-bounce" />
              <div>
                <div className="font-semibold text-[#f43f5e]">RACE DETECTED: 2 USERS CLICKED SEAT A4 AT t=0ms</div>
                <div className="text-white/60 text-[11px]">User_Tokyo (TX#9841) vs User_London (TX#9842)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-[#10b981]/20 px-2.5 py-1 text-[#10b981] border border-[#10b981]/40">
                User_Tokyo: 200 OK (LOCK ACQUIRED)
              </span>
              <span className="rounded-md bg-[#e11d48]/20 px-2.5 py-1 text-[#f43f5e] border border-[#e11d48]/40">
                User_London: 409 CONFLICT (BLOCKED)
              </span>
            </div>
          </div>
        )}

        {/* Curved Screen */}
        <div className="cinemora-imax-screen">
          <span className="cinemora-screen-label">IMAX LASER CURVED SCREEN // SOUNDSTAGE 01</span>
        </div>

        {/* 3D Auditorium Seat Grid */}
        <div className="cinemora-auditorium-stage my-8">
          <div className="cinemora-seat-grid-3d flex flex-col items-center gap-3">
            {["A", "B", "C", "D"].map((rowLabel) => {
              const rowSeats = seats.filter((s) => s.row === rowLabel);
              return (
                <div key={rowLabel} className="flex items-center gap-3">
                  <span className="w-6 font-mono text-xs text-white/40 text-right">{rowLabel}</span>
                  <div className="flex gap-2">
                    {rowSeats.map((seat) => (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                          "cinemora-seat-node",
                          seat.state === "available" && "cinemora-seat-available",
                          seat.state === "selected" && "cinemora-seat-selected",
                          seat.state === "held" && "cinemora-seat-held",
                          seat.state === "locked" && "cinemora-seat-locked"
                        )}
                        title={`${seat.id} (${seat.tier}) - $${seat.price}`}
                      >
                        {seat.state === "locked" ? (
                          <Lock size={12} className="opacity-80" />
                        ) : seat.state === "selected" ? (
                          <CheckCircle2 size={12} />
                        ) : seat.state === "held" ? (
                          <span className="font-mono text-[8px] font-bold text-[#f59e0b]">
                            {seat.client?.substring(0, 3)}
                          </span>
                        ) : (
                          <span className="font-mono text-[9px]">{seat.number}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seat Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/10 text-xs font-mono text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-white/10 border border-white/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
            <span className="text-white">Your Hold {selectedSeatId ? `(${selectedSeatId})` : "(Click to Lock)"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#f59e0b]/30 border border-[#f59e0b]" />
            <span className="text-[#f59e0b]">Remote Client Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#e11d48]/40 border border-[#e11d48]" />
            <span className="text-[#e11d48]">Committed Ticket</span>
          </div>
        </div>

        {/* Live Rolling WebSocket Terminal */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#06070a] p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/40">
            <div className="flex items-center gap-2">
              <Radio size={13} className="text-[#06b6d4] animate-pulse" />
              <span>Daphne ASGI WebSocket Terminal Stream</span>
            </div>
            <span>PORT 8000 // REDIS PUB-SUB LAYER</span>
          </div>
          <div className="space-y-1.5 min-h-[90px]">
            {wsLogs.map((log, i) => (
              <div key={i} className={cn("text-xs leading-relaxed", i === 0 ? "text-[#f59e0b]" : "text-white/60")}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIMULATION BAY 2: CRYPTOGRAPHIC QR GATEKEEPER & TURNSTILE ── */}
      <section className="mb-28 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        <div className="rounded-3xl border border-white/10 bg-[#0d0f18] p-8 shadow-xl relative overflow-hidden">
          <div className="cinemora-laser-scanner" />
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 font-mono text-xs text-[#e11d48]">
              <QrCode size={15} />
              <span>HTML5 OPTICAL LASER SCANNER</span>
            </div>
            <span className="font-mono text-xs text-white/40">LATENCY: 3.2ms</span>
          </div>

          <div className="aspect-square max-w-[280px] mx-auto rounded-2xl border-2 border-dashed border-[#e11d48]/40 bg-black/60 p-6 flex flex-col items-center justify-center relative shadow-inner">
            <div className="p-4 bg-white rounded-xl shadow-2xl">
              <div className="w-36 h-36 bg-black relative flex flex-wrap p-1.5 gap-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 rounded-xs",
                      i % 2 === 0 || i % 5 === 0 ? "bg-white" : "bg-transparent"
                    )}
                  />
                ))}
              </div>
            </div>
            <span className="font-mono text-xs text-white/80 mt-4 tracking-widest font-semibold">
              BK9X4M2QW7
            </span>
          </div>

          {/* Turnstile Physical Gate Visualizer */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between mb-2 font-mono text-xs">
              <span className="text-white/40">
                AUDITORIUM TURNSTILE:{" "}
                <span className={cn(scanResult === "granted" ? "text-[#10b981]" : scanResult === "denied" ? "text-[#f43f5e]" : "text-white/60")}>
                  [{scanResult.toUpperCase()}]
                </span>
              </span>
              <span
                className={cn(
                  "font-bold",
                  turnstileOpen ? "text-[#10b981]" : "text-[#f43f5e]"
                )}
              >
                {turnstileOpen ? "OPEN (UNLATCHED)" : "LOCKED (BARRIER ACTIVE)"}
              </span>
            </div>
            <div className="relative h-6 w-full bg-white/5 rounded-full overflow-hidden flex items-center px-2">
              <div
                className={cn(
                  "cinemora-turnstile-arm h-2 w-32 bg-[#e11d48] rounded-full",
                  turnstileOpen && "is-open !bg-[#10b981]"
                )}
              />
            </div>
          </div>

          {/* Scanner Interactive Controls */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={() => scanTurnstileTicket("valid")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#10b981] px-4 py-2.5 font-mono text-xs font-semibold text-black hover:bg-[#34d399] transition-all"
            >
              <CheckCircle2 size={14} />
              <span>Scan Valid Ticket</span>
            </button>
            <button
              onClick={() => scanTurnstileTicket("duplicate")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#e11d48]/40 bg-[#e11d48]/10 px-4 py-2.5 font-mono text-xs text-[#f43f5e] hover:bg-[#e11d48]/20 transition-all"
            >
              <AlertTriangle size={14} />
              <span>Simulate Duplicate Scan</span>
            </button>
          </div>
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#e11d48]">
            Physical Entry Security
          </span>
          <h3 className="mt-2 text-3xl font-light text-white sm:text-4xl">
            Cryptographic QR Gatekeeper with &lt;5ms Lookup
          </h3>
          <p className="mt-4 leading-relaxed text-white/60">
            Tickets encode unguessable cryptographic credentials generated via Python&apos;s{" "}
            <code className="text-[#f59e0b]">secrets</code> module rather than pseudo-random numbers. Ambiguous characters (I, O, 0, 1) are excluded so tickets remain readable even off cracked smartphone screens.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="font-mono text-xs text-white/40">SINGLE-USE GUARD</div>
              <div className="mt-1 font-mono text-sm text-white">checked_in_at timestamp</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="font-mono text-xs text-white/40">GATE LOOKUP</div>
              <div className="mt-1 font-mono text-sm text-[#06b6d4]">&lt;5ms indexed hit</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIMULATION BAY 3: DYNAMIC TIERED REFUND ENGINE ── */}
      <section className="mb-28 rounded-3xl border border-white/10 bg-[#0d0f18] p-8 lg:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-[#f59e0b]">
              Financial Integrity & Wallet
            </span>
            <h3 className="mt-2 text-3xl font-light text-white">
              Automated Tiered Cancellation & Wallet Ledger
            </h3>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Drag the proximity slider to test cancellation settlement rules. Full 100% refunds apply &gt;48h prior, scaling to 75% (&gt;24h) and 50% (&gt;2h), instantly crediting the customer wallet.
            </p>

            <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/40 font-mono text-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-white/40">
                <span>CUSTOMER WALLET BALANCE:</span>
                <Wallet size={14} className="text-[#f59e0b]" />
              </div>
              <div className="text-3xl font-light text-[#f59e0b] mt-1 flex items-baseline gap-2">
                ${walletBalance.toFixed(2)}
                {refundCelebration && (
                  <span className="cinemora-money-float text-sm text-[#10b981] font-bold">
                    +${refundCalculation.refund.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-xs text-white/40">HOURS BEFORE SHOWTIME:</span>
              <span className="font-mono text-xl font-bold text-[#f59e0b]">{refundHours}h</span>
            </div>

            <input
              type="range"
              min="0"
              max="72"
              value={refundHours}
              onChange={(e) => setRefundHours(parseInt(e.target.value, 10))}
              className="w-full accent-[#f59e0b] cursor-pointer"
            />

            <div className="mt-6 grid grid-cols-3 gap-3 text-center font-mono text-xs">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="text-white/40">REFUND RATE</div>
                <div className="mt-1 text-lg font-bold text-[#10b981]">{refundCalculation.percent}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="text-white/40">CANCELLATION FEE</div>
                <div className="mt-1 text-lg font-bold text-[#f43f5e]">${refundCalculation.fee.toFixed(2)}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="text-white/40">NET PAYOUT</div>
                <div className="mt-1 text-lg font-bold text-[#f59e0b]">${refundCalculation.refund.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="font-mono text-xs text-white/70">
                STATUS: <span className="text-[#06b6d4] font-semibold">{refundCalculation.status}</span>
              </div>
              <button
                onClick={executeInstantRefund}
                disabled={refundCalculation.refund <= 0}
                className="w-full sm:w-auto rounded-xl bg-[#f59e0b] px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-[#fbbf24] transition-all disabled:opacity-40"
              >
                Execute Instant Cancellation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIMULATION BAY 4: DISTRIBUTED ARCHITECTURE CIRCUIT REACTOR ── */}
      <section className="mb-28 rounded-3xl border border-white/15 bg-[#090b12] p-6 lg:p-12 shadow-2xl">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#06b6d4]">
            Distributed Systems Blueprint
          </span>
          <h3 className="mt-2 text-3xl font-light text-white sm:text-4xl">
            Live Architecture Data-Flow Reactor
          </h3>
          <p className="mt-2 text-sm text-white/60">
            Interactive circuit nodes showcasing Django Channels, Daphne ASGI, Redis Pub/Sub, and PostgreSQL row serialization.
          </p>
        </div>

        {/* Node Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { id: "daphne", label: "01 // DAPHNE ASGI", sub: "Async WebSocket Multiplex" },
            { id: "redis", label: "02 // REDIS LAYER", sub: "Pub/Sub Fan-Out" },
            { id: "postgres", label: "03 // POSTGRESQL", sub: "SELECT FOR UPDATE" },
            { id: "razorpay", label: "04 // RAZORPAY", sub: "Webhook Verification" },
          ].map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveCircuitNode(node.id as typeof activeCircuitNode)}
              className={cn(
                "p-4 rounded-xl border text-left font-mono transition-all",
                activeCircuitNode === node.id
                  ? "border-[#f59e0b] bg-[#f59e0b]/10 text-white shadow-lg shadow-[#f59e0b]/10"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
              )}
            >
              <div className="text-xs font-bold text-[#f59e0b]">{node.label}</div>
              <div className="text-[11px] text-white/50 mt-1">{node.sub}</div>
            </button>
          ))}
        </div>

        {/* Node Code & Spec Terminal */}
        <div className="rounded-2xl border border-white/10 bg-black/60 p-6 font-mono text-xs">
          {activeCircuitNode === "daphne" && (
            <div>
              <div className="text-[#06b6d4] mb-3"># cinemora/consumers.py - Real-Time Daphne WebSocket Consumer</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`class SeatMapConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.showtime_id = self.scope['url_route']['kwargs']['showtime_id']
        self.room_group_name = f'showtime_{self.showtime_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send authoritative derived state on connection (zero delta drift)
        seat_state = await self.get_seat_state(self.showtime_id)
        await self.send_json({'type': 'STATE_INIT', 'seats': seat_state})`}
              </pre>
            </div>
          )}

          {activeCircuitNode === "redis" && (
            <div>
              <div className="text-[#f59e0b] mb-3"># cinemora/signals.py - Redis Pub/Sub Broadcast on Durable Commit</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`def broadcast_seat_update(showtime_id, seat_data):
    """Guarantees messages fire ONLY after the DB transaction has fully committed."""
    channel_layer = get_channel_layer()
    transaction.on_commit(
        lambda: async_to_sync(channel_layer.group_send)(
            f'showtime_{showtime_id}',
            {'type': 'seat_update', 'data': seat_data}
        )
    )`}
              </pre>
            </div>
          )}

          {activeCircuitNode === "postgres" && (
            <div>
              <div className="text-[#10b981] mb-3"># bookings/services.py - Row-Exclusive Lock Serialization</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`@transaction.atomic
def reserve_seat(user, showtime_id, seat_id):
    # Acquire exclusive row lock. Concurrent transactions queue behind this lock.
    seat = Seat.objects.select_for_update().get(id=seat_id, showtime_id=showtime_id)
    if seat.status != SeatStatus.AVAILABLE:
        raise ConcurrencyConflictError("Seat already claimed or held by another viewer.")

    seat.status = SeatStatus.HELD
    seat.held_by = user
    seat.hold_expires_at = timezone.now() + timedelta(minutes=15)
    seat.save()`}
              </pre>
            </div>
          )}

          {activeCircuitNode === "razorpay" && (
            <div>
              <div className="text-[#e11d48] mb-3"># payments/webhooks.py - HMAC-SHA256 Signature Verification</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`def verify_razorpay_webhook(request):
    payload = request.body.decode('utf-8')
    signature = request.headers.get('X-Razorpay-Signature')
    client.utility.verify_webhook_signature(
        payload, signature, settings.RAZORPAY_WEBHOOK_SECRET
    )
    # Payment authentic. Commit ticket and generate cryptographic QR pass.`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* ── SIMULATION BAY 5: 13-SCREEN FILTERABLE PRODUCTION GALLERY ── */}
      <section className="mb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#f59e0b]">
              Production Showcase
            </span>
            <h3 className="mt-2 text-3xl font-light text-white sm:text-4xl">
              13 Verified Production Screenshots
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Views (13)" },
              { id: "seating", label: "Real-Time Seating" },
              { id: "booking", label: "Booking & Checkout" },
              { id: "verification", label: "QR Gatekeeper" },
              { id: "admin", label: "Multiplex Management" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveScreenFilter(tab.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
                  activeScreenFilter === tab.id
                    ? "bg-[#f59e0b] text-black font-semibold shadow-md shadow-[#f59e0b]/20"
                    : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScreens.map((screen, idx) => (
            <div
              key={idx}
              onClick={() => setLightboxImage(screen.src)}
              className="cinemora-holo-card group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f18] transition-all hover:border-[#f59e0b]/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <Image
                  src={screen.src}
                  alt={screen.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2.5 py-1 font-mono text-[10px] text-[#f59e0b] backdrop-blur-md border border-white/10">
                  {screen.tag}
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-medium text-white group-hover:text-[#f59e0b] transition-colors">
                  {screen.title}
                </h4>
                <p className="mt-2 text-xs text-white/60 leading-relaxed">
                  {screen.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
          >
            <div className="relative max-w-5xl w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image src={lightboxImage} alt="Expanded Preview" fill sizes="100vw" className="object-contain" />
            </div>
          </div>
        )}
      </section>

      {/* ── Architectural Highlights ── */}
      {project.highlights && (
        <section className="mb-24 rounded-3xl border border-white/10 bg-white/[0.02] p-8 lg:p-12">
          <h3 className="mb-6 text-2xl font-light text-white">Engineering Architectural Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                <CheckCircle2 size={16} className="text-[#f59e0b] mt-0.5 flex-none" />
                <span className="text-sm text-white/70 leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
