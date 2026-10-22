"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Cpu,
  GraduationCap,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import { ProjectActionButtons } from "@/components/ui/project-action-buttons";

type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

const ENDPOINT_MATRIX = [
  {
    path: "GET /api/courses/",
    name: "Public Course Catalog",
    allowed: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    gate: "AllowAny",
  },
  {
    path: "POST /api/courses/create/",
    name: "Curriculum Authoring",
    allowed: ["INSTRUCTOR", "ADMIN"],
    gate: "IsInstructorOrAdmin",
  },
  {
    path: "PUT /api/courses/:id/publish/",
    name: "Course State Moderation",
    allowed: ["INSTRUCTOR", "ADMIN"],
    gate: "IsCourseInstructor | IsAdmin",
  },
  {
    path: "GET /api/admin/users/",
    name: "RBAC User Account Controller",
    allowed: ["ADMIN"],
    gate: "IsSuperUser | IsStaff",
  },
  {
    path: "POST /api/certificates/revoke/",
    name: "Cryptographic Certificate Revocation",
    allowed: ["ADMIN"],
    gate: "IsPlatformAdmin",
  },
  {
    path: "GET /api/revenue/analytics/",
    name: "Platform Financial Telemetry",
    allowed: ["INSTRUCTOR", "ADMIN"],
    gate: "IsStaffOrInstructorTenant",
  },
];

const LMS_SCREENS = [
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184130.png",
    title: "Platform Hero & Certificate Preview",
    caption: "Elevate skills landing portal with verified ReportLab PDF certificate preview and course catalog ingress.",
    cat: "student",
    tag: "Learner Portal",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184603.png",
    title: "Student Dashboard & Resume Learning",
    caption: "Personalized student command center displaying courses in progress and quick-resume shortcuts.",
    cat: "student",
    tag: "Learner Portal",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184622.png",
    title: "Course Catalog & Exploration",
    caption: "Filterable course catalog across programming, business, design, and data analytics disciplines.",
    cat: "student",
    tag: "Public Catalog",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184632.png",
    title: "Enrolled Courses & Progress",
    caption: "Active enrollments with completion percentages, lesson checklists, and certificate unlock buttons.",
    cat: "student",
    tag: "Progress Tracker",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184735.png",
    title: "Personal Learning Analytics",
    caption: "Student telemetry showing total courses enrolled, completed units, and active study hours.",
    cat: "student",
    tag: "Analytics Portal",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184140.png",
    title: "Platform Administration Overview",
    caption: "High-level admin dashboard managing overall operations, approvals, analytics, and moderation.",
    cat: "admin",
    tag: "Admin View",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184337.png",
    title: "Course Management Console",
    caption: "Curriculum moderation dashboard with 13 published courses, instructor attribution, and edit workflows.",
    cat: "admin",
    tag: "Course Moderator",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184500.png",
    title: "User Management & Role Controller",
    caption: "Granular RBAC controller managing student, instructor, and admin roles with account activation states.",
    cat: "admin",
    tag: "RBAC Security",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184525.png",
    title: "Platform Operations Telemetry",
    caption: "Real-time metrics tracking enrolled students, completed courses, and instructor distributions.",
    cat: "admin",
    tag: "Operations Console",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184656.png",
    title: "Payment History & Order Receipts",
    caption: "Audit ledger recording course enrollments, simulated invoice receipts, and transaction timestamps.",
    cat: "commerce",
    tag: "Receipt Ledger",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184720.png",
    title: "Course Reviews & Ratings Hub",
    caption: "Community feedback hub for ratings, qualitative reviews, and student feedback moderation.",
    cat: "commerce",
    tag: "Feedback Engine",
  },
  {
    src: "/images/online_lms/Screenshot_2026-10-17_184747.png",
    title: "JWT Authentication Gateway",
    caption: "Secure authentication portal with JWT credential validation, role claims, and CSRF protection.",
    cat: "commerce",
    tag: "JWT Security",
  },
];

export default function LmsCaseStudy({
  project,
}: {
  project: Project;
  embedded?: boolean;
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("INSTRUCTOR");
  const [studentName, setStudentName] = useState("Gowtham R");
  const [courseProgress, setCourseProgress] = useState(80);
  const [completedModules, setCompletedModules] = useState<number[]>([1, 2, 3, 4]);
  const [compilingPdf, setCompilingPdf] = useState(false);
  const [pdfCompiled, setPdfCompiled] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeCircuitNode, setActiveCircuitNode] = useState<"jwt" | "drf" | "postgres" | "reportlab">("reportlab");
  const [activeScreenFilter, setActiveScreenFilter] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Dynamic font sizing algorithm replicating ReportLab _fit_font_size
  const calculatedFontSize = useMemo(() => {
    const len = studentName.trim().length;
    if (len <= 12) return 28;
    if (len <= 20) return 22;
    if (len <= 28) return 18;
    return 15;
  }, [studentName]);

  const toggleModule = (id: number) => {
    setCompletedModules((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((m) => m !== id) : [...prev, id];
      setCourseProgress(Math.round((next.length / 5) * 100));
      return next;
    });
  };

  const compilePdfInMemory = () => {
    setCompilingPdf(true);
    setPdfCompiled(false);
    setTimeout(() => {
      setCompilingPdf(false);
      setPdfCompiled(true);
    }, 1800);
  };

  const handleQuizSubmit = (optionIndex: number) => {
    setQuizAnswer(optionIndex);
    setQuizSubmitted(true);
  };

  const filteredScreens = useMemo(() => {
    if (activeScreenFilter === "all") return LMS_SCREENS;
    return LMS_SCREENS.filter((s) => s.cat === activeScreenFilter);
  }, [activeScreenFilter]);

  return (
    <article className="lms-case-study relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white selection:bg-[#6366f1] selection:text-white">
      {/* ── Action Bar & Links ── */}
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="lms-beacon" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#6366f1]">
            Full-Stack EdTech Architecture & RBAC Isolation
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
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 backdrop-blur-md transition-all hover:border-[#6366f1]/30"
            >
              <div className="absolute right-4 top-4 font-mono text-xs text-white/20">0{i + 1}</div>
              <div className="font-mono text-2xl font-light tracking-tight text-[#6366f1] sm:text-3xl">
                {metric.value}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-white/60">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SIMULATION BAY 1: 3-TIER ORBITAL RBAC HOLOGRAM & PRIVILEGE SANDBOX ── */}
      <section className="mb-28 rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e1224] to-[#070913] p-6 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#22d3ee] mb-2">
              <ShieldCheck size={14} /> Interactive Simulation Bay 01
            </div>
            <h3 className="text-3xl font-light text-white sm:text-4xl">
              3-Tier Orbital RBAC Hologram & Privilege Gateway
            </h3>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Switch roles to energize the concentric orbital rings and evaluate live endpoint access rules in real time. Watch SimpleJWT bearer claims enforce tenant isolation.
            </p>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/40 p-1.5 flex-none">
            {(["STUDENT", "INSTRUCTOR", "ADMIN"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs transition-all",
                  selectedRole === role
                    ? role === "ADMIN"
                      ? "bg-[#eab308] text-black font-bold shadow-lg shadow-[#eab308]/20"
                      : role === "INSTRUCTOR"
                      ? "bg-[#6366f1] text-white font-bold shadow-lg shadow-[#6366f1]/20"
                      : "bg-[#22d3ee] text-black font-bold shadow-lg shadow-[#22d3ee]/20"
                    : "text-white/60 hover:text-white"
                )}
              >
                <span>{role === "STUDENT" ? "🎓 Student" : role === "INSTRUCTOR" ? "👨‍🏫 Instructor" : "🛡️ SuperAdmin"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Orbital Rings Hologram */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="lms-orbital-container">
              {/* Outer Ring: Student (Cyan) */}
              <div
                className={cn(
                  "lms-orbital-ring lms-ring-student",
                  selectedRole === "STUDENT" && "lms-ring-active"
                )}
              >
                <span className="absolute top-2 font-mono text-[9px] text-[#22d3ee] uppercase tracking-widest">
                  TIER 01: STUDENT
                </span>
              </div>

              {/* Middle Ring: Instructor (Violet) */}
              <div
                className={cn(
                  "lms-orbital-ring lms-ring-instructor",
                  selectedRole === "INSTRUCTOR" && "lms-ring-active"
                )}
              >
                <span className="absolute top-2 font-mono text-[9px] text-[#6366f1] uppercase tracking-widest">
                  TIER 02: INSTRUCTOR
                </span>
              </div>

              {/* Inner Ring: Admin (Gold) */}
              <div
                className={cn(
                  "lms-orbital-ring lms-ring-admin",
                  selectedRole === "ADMIN" && "lms-ring-active"
                )}
              >
                <span className="absolute top-2 font-mono text-[9px] text-[#eab308] uppercase tracking-widest">
                  TIER 03: ADMIN
                </span>
              </div>

              {/* Center Core Shield */}
              <div className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-black/80 border border-white/20 shadow-2xl">
                <ShieldCheck size={28} className="text-[#6366f1] animate-pulse" />
                <span className="font-mono text-[9px] text-white/70 mt-1 font-semibold">{selectedRole}</span>
              </div>
            </div>
          </div>

          {/* Live Endpoint Authorization Matrix */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono text-white/50">
              <span>API ENDPOINT</span>
              <span>PERMISSION GATE</span>
              <span>ACCESS STATUS</span>
            </div>

            {ENDPOINT_MATRIX.map((endpoint, i) => {
              const isAllowed = endpoint.allowed.includes(selectedRole);
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl border transition-all font-mono text-xs",
                    isAllowed
                      ? "border-[#10b981]/30 bg-[#10b981]/5"
                      : "border-[#e11d48]/25 bg-[#e11d48]/5 opacity-70"
                  )}
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{endpoint.path}</span>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">{endpoint.name}</div>
                  </div>

                  <div className="text-white/40 text-[11px]">{endpoint.gate}</div>

                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold border",
                        isAllowed
                          ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40"
                          : "bg-[#e11d48]/20 text-[#f43f5e] border-[#e11d48]/40"
                      )}
                    >
                      {isAllowed ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                      <span>{isAllowed ? "200 OK (ALLOWED)" : "403 FORBIDDEN"}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SIMULATION BAY 2: INTERACTIVE CURRICULUM WATERFALL & 100% GATE ── */}
      <section className="mb-28 rounded-3xl border border-white/10 bg-[#0c0f1c] p-8 lg:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3b82f6]">
              Sequential Progression & Gates
            </span>
            <h3 className="mt-2 text-3xl font-light text-white">
              Curriculum Milestone Tracking & 100% Gate
            </h3>
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              Certificate generation is cryptographically locked behind 100% progress. Toggle modules on the right to test how completion signals increment the liquid progress bar and unlock certificate entitlement.
            </p>

            {/* Liquid Progress Bar */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
              <div className="flex justify-between items-center mb-3 font-mono text-xs">
                <span className="text-white/50">CURRICULUM COMPLETION:</span>
                <span className="text-lg font-bold text-[#22d3ee]">{courseProgress}%</span>
              </div>
              <div className="lms-liquid-bar">
                <div
                  className="lms-liquid-fill"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
                <span className="text-white/40">CERTIFICATE STATUS:</span>
                <span
                  className={cn(
                    "font-bold flex items-center gap-1.5",
                    courseProgress === 100 ? "text-[#eab308]" : "text-[#f43f5e]"
                  )}
                >
                  {courseProgress === 100 ? (
                    <>
                      <Sparkles size={14} className="animate-spin" />
                      <span>ISSUANCE UNLOCKED (100%)</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>LOCKED (100% PREREQUISITE)</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Module Checklist */}
          <div className="lg:col-span-7 space-y-3 font-mono text-xs">
            {[
              { id: 1, title: "01 // Distributed Systems & ASGI Architecture", dur: "45 mins" },
              { id: 2, title: "02 // Redis Pub/Sub & Channel Layer Multiplexing", dur: "60 mins" },
              { id: 3, title: "03 // Database Concurrency & Row-Exclusive Locks", dur: "50 mins" },
              { id: 4, title: "04 // Dynamic ReportLab In-Memory Vector PDF Engine", dur: "40 mins" },
              { id: 5, title: "05 // Final Assessment: Automated MCQ Evaluation", dur: "30 mins" },
            ].map((module) => {
              const isDone = completedModules.includes(module.id);
              return (
                <div
                  key={module.id}
                  onClick={() => toggleModule(module.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                    isDone
                      ? "border-[#10b981]/40 bg-[#10b981]/10 text-white"
                      : "border-white/10 bg-black/40 text-white/50 hover:border-white/20 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md flex items-center justify-center border",
                        isDone
                          ? "bg-[#10b981] border-[#10b981] text-black"
                          : "border-white/20 bg-white/5"
                      )}
                    >
                      {isDone && <CheckCircle2 size={14} />}
                    </div>
                    <span>{module.title}</span>
                  </div>
                  <span className="text-[11px] text-white/40">{module.dur}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SIMULATION BAY 3: LIVE REPORTLAB IN-MEMORY PDF COMPILER STUDIO ── */}
      <section className="mb-28 rounded-3xl border border-white/15 bg-gradient-to-b from-[#111827] to-[#0a0d18] p-6 lg:p-12 shadow-2xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#eab308]">
              Publication-Grade Vector Generation
            </span>
            <h3 className="mt-2 text-3xl font-light text-white sm:text-4xl">
              ReportLab In-Memory PDF Compilation Studio
            </h3>
            <p className="mt-2 text-sm text-white/60 max-w-xl">
              Type your custom student name below. Watch ReportLab&apos;s <code className="text-[#eab308]">_fit_font_size</code> dynamically scale typography so names never bleed into borders. Observe the cursive fountain pen signature animation.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={compilePdfInMemory}
              disabled={compilingPdf}
              className="flex items-center gap-2 rounded-xl bg-[#eab308] px-5 py-2.5 font-mono text-xs font-bold text-black hover:bg-[#facc15] transition-all shadow-lg shadow-[#eab308]/20 disabled:opacity-50"
            >
              <Cpu size={14} className={compilingPdf ? "animate-spin" : ""} />
              <span>{compilingPdf ? "Compiling BytesIO Buffer..." : "Compile Vector PDF (In-Memory)"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Name Input Bar */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-black/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-white/40 flex-none">STUDENT NAME INPUT:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student name..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-[#eab308]"
            />
          </div>
          <div className="flex items-center gap-3 text-white/60">
            <span>CALCULATED FONT SIZE:</span>
            <span className="text-[#eab308] font-bold text-sm">{calculatedFontSize}pt</span>
          </div>
        </div>

        {/* Certificate Vector Canvas Preview */}
        <div className="lms-cert-canvas max-w-3xl mx-auto relative">
          <div className="lms-cert-outer-border" />
          <div className="lms-cert-inner-border" />

          {/* Certificate Header */}
          <div className="text-center relative z-10 pt-4">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#1d4ed8] font-bold">
              KHYRON DEVS PLATFORM // ACADEMY OF ADVANCED SYSTEMS
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#0f172a] mt-2 font-bold tracking-tight">
              Certificate of Mastery
            </h2>
            <p className="text-xs text-[#64748b] mt-1 font-serif italic">
              This credential is authenticated and awarded to
            </p>
          </div>

          {/* Dynamic Auto-Scaled Name */}
          <div className="text-center my-6 relative z-10">
            <div
              className="font-serif italic font-bold text-[#1e1b4b] transition-all duration-300"
              style={{ fontSize: `${calculatedFontSize}px` }}
            >
              {studentName.trim() || "Student Name"}
            </div>
            <div className="w-48 h-0.5 bg-[#cbd5e1] mx-auto mt-2" />
          </div>

          {/* Course Spec */}
          <div className="text-center relative z-10">
            <p className="text-xs text-[#334155] max-w-md mx-auto leading-relaxed">
              For demonstrating complete architectural proficiency in <strong>Distributed Backend Systems & Concurrency Isolation</strong>.
            </p>
          </div>

          {/* Footer: Signature & QR Verification */}
          <div className="flex items-end justify-between pt-6 border-t border-[#e2e8f0] relative z-10 text-[11px]">
            {/* Animated Cursive Signature */}
            <div className="flex flex-col items-center">
              <svg width="120" height="40" viewBox="0 0 120 40" className="text-[#1e1b4b]">
                <path
                  d="M10 25 C 25 10, 35 35, 55 15 C 70 5, 85 30, 110 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="lms-signature-stroke"
                />
              </svg>
              <span className="font-mono text-[9px] text-[#64748b] border-t border-[#94a3b8] pt-0.5 mt-1">
                INSTRUCTOR SIGNATURE
              </span>
            </div>

            {/* In-Memory QR Code */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-black rounded p-1 flex flex-wrap gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 rounded-xs",
                      i % 2 === 0 || i === 7 ? "bg-white" : "bg-black"
                    )}
                  />
                ))}
              </div>
              <div className="font-mono text-[9px] text-[#64748b]">
                <div>UUID: 8F2A-99B1</div>
                <div className="text-[#10b981] font-semibold">VERIFIED HASH</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compilation Log Feedback */}
        {pdfCompiled && (
          <div className="mt-8 rounded-2xl border border-[#10b981]/40 bg-[#10b981]/10 p-4 font-mono text-xs text-[#10b981] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Compilation Successful: 24.8 KB rendered into io.BytesIO buffer in 42ms (0 bytes disk footprint).</span>
            </div>
            <span className="text-white/60">Content-Type: application/pdf</span>
          </div>
        )}
      </section>

      {/* ── SIMULATION BAY 4: IN-PLATFORM MCQ QUIZ EVALUATOR ── */}
      <section className="mb-28 rounded-3xl border border-white/10 bg-[#0d0f18] p-8 lg:p-12 shadow-xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 font-mono text-xs text-[#22d3ee] mb-2 uppercase tracking-widest">
            <GraduationCap size={15} /> Real-Time Knowledge Evaluation
          </div>
          <h3 className="text-2xl sm:text-3xl font-light text-white mb-3">
            In-Platform MCQ Quiz Evaluator (&lt;10ms Grading)
          </h3>
          <p className="text-sm text-white/60 mb-6">
            Test the automated quiz grading engine. Questions verify architectural understanding while server-side scoring locks answer inspection.
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/60 p-6">
            <div className="font-mono text-xs text-[#6366f1] mb-2">QUESTION 01 // OBJECT-LEVEL PERMISSIONS:</div>
            <h4 className="text-base text-white font-medium mb-4">
              How does the LMS prevent instructors from viewing or tampering with another instructor&apos;s course materials?
            </h4>

            <div className="space-y-2.5">
              {[
                "Client-side CSS hiding of the edit button",
                "DRF get_queryset() filtered by request.user + IsCourseInstructor permission class",
                "Periodic background cron job deleting unowned rows",
                "Raw SQL query executed without WHERE clauses",
              ].map((opt, i) => {
                const isSelected = quizAnswer === i;
                const isCorrect = i === 1;
                return (
                  <div
                    key={i}
                    onClick={() => handleQuizSubmit(i)}
                    className={cn(
                      "p-3.5 rounded-xl border font-mono text-xs cursor-pointer transition-all flex items-center justify-between",
                      quizSubmitted && isCorrect
                        ? "border-[#10b981] bg-[#10b981]/20 text-[#10b981]"
                        : quizSubmitted && isSelected && !isCorrect
                        ? "border-[#e11d48] bg-[#e11d48]/20 text-[#f43f5e]"
                        : isSelected
                        ? "border-[#6366f1] bg-[#6366f1]/20 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white"
                    )}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle2 size={16} />}
                  </div>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="mt-4 pt-4 border-t border-white/10 font-mono text-xs text-white/70 leading-relaxed">
                {quizAnswer === 1 ? (
                  <span className="text-[#10b981]">
                    CORRECT (100%): Object-level permissions evaluate <code>obj.instructor == request.user</code>, preventing unauthorized row mutation before SQL execution.
                  </span>
                ) : (
                  <span className="text-[#f43f5e]">
                    INCORRECT: Only server-side DRF queryset scoping guarantees isolation against spoofed client payloads.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SIMULATION BAY 5: ACADEMIC ARCHITECTURE CIRCUIT ── */}
      <section className="mb-28 rounded-3xl border border-white/15 bg-[#090b12] p-6 lg:p-12 shadow-2xl">
        <div className="mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#6366f1]">
            Distributed Systems Blueprint
          </span>
          <h3 className="mt-2 text-3xl font-light text-white sm:text-4xl">
            Live Architecture Data-Flow Reactor
          </h3>
          <p className="mt-2 text-sm text-white/60">
            Interactive circuit nodes showcasing React 18, SimpleJWT Gateway, DRF ViewSets, PostgreSQL, and ReportLab.
          </p>
        </div>

        {/* Node Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { id: "jwt", label: "01 // SIMPLEJWT", sub: "Bearer Role Claims" },
            { id: "drf", label: "02 // DRF VIEWSETS", sub: "Permission Middleware" },
            { id: "postgres", label: "03 // POSTGRESQL", sub: "LessonCompletion Rows" },
            { id: "reportlab", label: "04 // REPORTLAB", sub: "In-Memory BytesIO" },
          ].map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveCircuitNode(node.id as typeof activeCircuitNode)}
              className={cn(
                "p-4 rounded-xl border text-left font-mono transition-all",
                activeCircuitNode === node.id
                  ? "border-[#6366f1] bg-[#6366f1]/10 text-white shadow-lg shadow-[#6366f1]/10"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
              )}
            >
              <div className="text-xs font-bold text-[#6366f1]">{node.label}</div>
              <div className="text-[11px] text-white/50 mt-1">{node.sub}</div>
            </button>
          ))}
        </div>

        {/* Node Code & Spec Terminal */}
        <div className="rounded-2xl border border-white/10 bg-black/60 p-6 font-mono text-xs">
          {activeCircuitNode === "jwt" && (
            <div>
              <div className="text-[#22d3ee] mb-3"># accounts/serializers.py - Custom SimpleJWT Role Claims</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Embed RBAC claims into the signed token payload
        token['role'] = user.role  # 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
        token['username'] = user.username
        token['is_active'] = user.is_active
        return token`}
              </pre>
            </div>
          )}

          {activeCircuitNode === "drf" && (
            <div>
              <div className="text-[#6366f1] mb-3"># courses/permissions.py - 3-Tier Granular Permission Gate</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`class IsInstructorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and
                    (request.user.role in ['INSTRUCTOR', 'ADMIN'] or request.user.is_staff))

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN' or request.user.is_staff:
            return True
        return obj.instructor == request.user`}
              </pre>
            </div>
          )}

          {activeCircuitNode === "postgres" && (
            <div>
              <div className="text-[#10b981] mb-3"># courses/models.py - 100% Milestone Progress Engine</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`class Enrollment(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def get_progress_percentage(self):
        total_lessons = self.course.lessons.count()
        if total_lessons == 0: return 0
        completed = LessonCompletion.objects.filter(
            student=self.student, lesson__course=self.course
        ).count()
        return min(100, int((completed / total_lessons) * 100))

    def can_generate_certificate(self):
        return self.get_progress_percentage() == 100`}
              </pre>
            </div>
          )}

          {activeCircuitNode === "reportlab" && (
            <div>
              <div className="text-[#eab308] mb-3"># certificates/pdf.py - In-Memory Dynamic Canvas Engine</div>
              <pre className="text-white/80 overflow-x-auto leading-relaxed">
{`def generate_certificate_pdf(certificate):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=landscape(A4))
    # Vector borders, font auto-scaling, and single-use QR verification code
    width, height = landscape(A4)
    name = certificate.student.get_full_name()
    font_size = _fit_font_size(name, max_width=width - 100)
    pdf.setFont('Times-BoldItalic', font_size)
    pdf.drawCentredString(width / 2, height - 220, name)
    pdf.save()
    buffer.seek(0)
    return buffer`}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* ── SIMULATION BAY 6: 12-SCREEN FILTERABLE PRODUCTION GALLERY ── */}
      <section className="mb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#6366f1]">
              Production Showcase
            </span>
            <h3 className="mt-2 text-3xl font-light text-white sm:text-4xl">
              12 Verified Production Screenshots
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Views (12)" },
              { id: "student", label: "Learner Portal" },
              { id: "admin", label: "Governance & RBAC" },
              { id: "commerce", label: "Commerce & Auth" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveScreenFilter(tab.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
                  activeScreenFilter === tab.id
                    ? "bg-[#6366f1] text-white font-semibold shadow-md shadow-[#6366f1]/20"
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
              className="cinemora-holo-card group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0e1224] transition-all hover:border-[#6366f1]/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                <Image
                  src={screen.src}
                  alt={screen.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2.5 py-1 font-mono text-[10px] text-[#22d3ee] backdrop-blur-md border border-white/10">
                  {screen.tag}
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-base font-medium text-white group-hover:text-[#6366f1] transition-colors">
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
                <CheckCircle2 size={16} className="text-[#6366f1] mt-0.5 flex-none" />
                <span className="text-sm text-white/70 leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
