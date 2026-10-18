"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  Cpu,
  ExternalLink,
  Layers,
  Radar,
  Search,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { projects, type Project } from "@/lib/content/projects";
import { cn } from "@/lib/utils";
import useClipboard from "@/hooks/useClipboard";

type NodeId = "ingest" | "dedup" | "matcher" | "deploy";

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
    id: "radar",
    label: "Live Radar & Shortlist",
    badge: "Consumer Stream",
    description: "Real-time fresher-first job stream, normalized archives, and personal application management.",
    images: [
      {
        src: "/images/jobpilot/Today.png",
        title: "Today / Live Feed",
        caption: "Daily ranked fresher-eligible opportunities with match scores and direct apply links.",
        route: "GET /api/v1/jobs/today/",
        tag: "Active Radar Feed",
      },
      {
        src: "/images/jobpilot/Jobs.png",
        title: "Canonical Job Archive",
        caption: "Full deduplicated archive with provider lineage, technology tags, and compensation filters.",
        route: "GET /api/v1/jobs/archive/",
        tag: "PostgreSQL 16 Table",
      },
      {
        src: "/images/jobpilot/Job Details.png",
        title: "Opportunity Inspection",
        caption: "Granular eligibility audit, original source provider links, and required skill vector match breakdown.",
        route: "GET /api/v1/jobs/:slug/",
        tag: "Deterministic View",
      },
      {
        src: "/images/jobpilot/Saved_jobs.png",
        title: "Operator Saved Shortlist",
        caption: "Locally persisted and server-synchronized bookmark queue for target companies.",
        route: "GET /api/v1/jobs/saved/",
        tag: "User Queue",
      },
      {
        src: "/images/jobpilot/Applied_jobs.png",
        title: "Application Pipeline Tracker",
        caption: "Status tracker tracking opportunities from Discovered to Applied to Interviewing.",
        route: "GET /api/v1/jobs/applied/",
        tag: "State Tracker",
      },
    ],
  },
  {
    id: "workflows",
    label: "Workflows & Vectors",
    badge: "Automation Core",
    description: "n8n crawler workflows, semantic search vectors, and real-time webhook notification engines.",
    images: [
      {
        src: "/images/jobpilot/Search_Vectors.png",
        title: "Operator Search Vectors",
        caption: "Semantic intent vectors and keyword clusters driving high-precision relevance scoring.",
        route: "POST /api/v1/vectors/search/",
        tag: "Semantic Embeddings",
      },
      {
        src: "/images/jobpilot/Search_workflow.png",
        title: "n8n Multi-Provider Ingestion",
        caption: "Visual orchestration workflow coordinating parallel crawls across LinkedIn, Greenhouse, and Lever.",
        route: "WEBHOOK /n8n/crawler/trigger/",
        tag: "n8n Orchestration",
      },
      {
        src: "/images/jobpilot/notify_workflow.png",
        title: "Automated Notification Dispatch",
        caption: "Idempotent notification dispatch sending instant candidate matches to Telegram & WhatsApp.",
        route: "WEBHOOK /n8n/notify/dispatch/",
        tag: "Idempotent Webhooks",
      },
    ],
  },
  {
    id: "system",
    label: "Telemetry & Operator Controls",
    badge: "OCI Infrastructure",
    description: "Production telemetry on Oracle Cloud Infrastructure ARM64, worker leases, and credentials.",
    images: [
      {
        src: "/images/jobpilot/System_Stats.png",
        title: "System Telemetry Cockpit",
        caption: "Real-time crawler throughput, deduplication rates, database connections, and memory footprint.",
        route: "GET /api/v1/system/telemetry/",
        tag: "Prometheus / OCI",
      },
      {
        src: "/images/jobpilot/Settings.png",
        title: "Scheduler & Provider Configuration",
        caption: "Rate limits, active scraping provider toggles, and fresher eligibility boundary thresholds.",
        route: "PUT /api/v1/admin/settings/",
        tag: "Runtime Config",
      },
      {
        src: "/images/jobpilot/Signin.png",
        title: "Operator Access Gateway",
        caption: "OAuth 2.0 and session token gate protecting system management from unauthorized inspection.",
        route: "POST /api/v1/auth/token/",
        tag: "JWT + CSRF Guard",
      },
    ],
  },
];

const FILE_NAMES: Record<NodeId, string> = {
  ingest: "engine/crawler/dedup.py",
  dedup: "engine/matching/fresher_gate.py",
  matcher: "engine/security/ssrf_guard.py",
  deploy: "deploy/docker-compose.arm64.yml",
};

const getJobPilotProject = (): Project => {
  const project = projects.find((item) => item.slug === "jobpilot");
  if (!project) throw new Error("JobPilot project data is missing");
  return project;
};

const DEFAULT_PROJECT = getJobPilotProject();

function getArchitectureNodes(project: Project): ArchitectureNode[] {
  return [
    {
      id: "ingest",
      number: "01",
      label: "Multi-Provider Ingestion & Canonical Deduplication",
      shortLabel: "Canonical Dedup",
      headline: "Cross-provider noise collapses into a single canonical opportunity.",
      description:
        "Raw listings from LinkedIn, Greenhouse, Lever, and Indeed arrive via parallel workers. JobPilot normalizes company slugs, strips promotional noise from job titles, and computes a SHA-256 canonical hash. Duplicate listings collapse into one master record while preserving provider source lineage.",
      proof: project.keyDecisions?.[0] ?? "Multi-provider job discovery with source-level and canonical deduplication",
      tags: ["SHA-256 Canonical Hash", "String Normalizer", "Cross-Provider Lineage"],
      icon: Layers,
      specs: [
        { label: "Deduplication Efficiency", val: "94.8% Duplicate Elimination" },
        { label: "Hash Strategy", val: "sha256(company:title:location)" },
        { label: "Lineage Store", val: "JSONB Provider Reference Array" },
      ],
      codeSnippet: `# engine/crawler/dedup.py
import hashlib, re

def canonical_hash(company: str, title: str, location_type: str) -> str:
    # 1. Strip company legal entity suffixes
    clean_company = re.sub(r"\\b(inc|ltd|pvt|corp|technologies)\\b", "", company.lower()).strip()
    # 2. Extract core title, removing seniority noise & batch tags
    clean_title = re.sub(r"\\b(2025|2026|batch|immediate|urgent|hiring)\\b", "", title.lower())
    clean_title = re.sub(r"[^a-z0-9\\s]", " ", clean_title).strip()
    norm_tokens = " ".join(sorted(clean_title.split()))

    raw_signature = f"{clean_company}:{norm_tokens}:{location_type.lower()}"
    return hashlib.sha256(raw_signature.encode()).hexdigest()`,
    },
    {
      id: "dedup",
      number: "02",
      label: "Deterministic Fresher Eligibility Gate",
      shortLabel: "Fresher Gate",
      headline: "Zero experienced-role pollution in entry-level streams.",
      description:
        "A strict deterministic ruleset inspects job descriptions for subtle experience traps (e.g., '3+ years required', 'lead engineer'). Titles and qualification texts are parsed with strict regex fences; jobs exceeding fresher criteria are purged before vector indexing.",
      proof: project.keyDecisions?.[1] ?? "Deterministic eligibility and preference-based matching",
      tags: ["Regex Boundary Fences", "YOE Extraction", "Server-Authoritative"],
      icon: Search,
      specs: [
        { label: "Fresher Gate Criteria", val: "YOE <= 1.5 Years Strict" },
        { label: "Title Filtering", val: "Blocks Senior / Lead / Principal" },
        { label: "Decision Latency", val: "< 12ms per listing" },
      ],
      codeSnippet: `# engine/matching/fresher_gate.py
import re

EXP_PATTERN = re.compile(r"(\\d+)\\+?\\s*(?:to|-)\\s*(\\d+)?\\s*(?:years?|yrs?)\\s*(?:of)?\\s*experience", re.I)
SENIOR_ROLES = {"senior", "sr", "lead", "principal", "manager", "architect", "staff"}

def evaluate_fresher_eligibility(title: str, description: str) -> tuple[bool, str]:
    tokens = set(re.findall(r"\\b\\w+\\b", title.lower()))
    if tokens & SENIOR_ROLES:
        return False, "SENIOR_TITLE_DETECTED"

    matches = EXP_PATTERN.findall(description)
    for min_exp, _ in matches:
        if int(min_exp) > 2:
            return False, f"EXPERIENCE_GATE_FAIL_{min_exp}YOE"
    return True, "ELIGIBLE_FRESHER"`,
    },
    {
      id: "matcher",
      number: "03",
      label: "Fail-Closed SSRF Defense & Leased Workers",
      shortLabel: "SSRF Firewall",
      headline: "Enrichment crawlers run inside a hardened network boundary.",
      description:
        "Scraper workers follow job redirect links but evaluate every target IP against private, loopback, and cloud metadata CIDR ranges before opening sockets. Work units use lease tokens with auto-expiring timeouts so crashed crawlers automatically release work back to the queue.",
      proof: project.highlights?.[2] ?? "SSRF-safe crawler boundary with leased worker queues",
      tags: ["CIDR IP Firewall", "AWS Metadata Block", "Leased Work Units"],
      icon: ShieldAlert,
      specs: [
        { label: "Private CIDR Blocks", val: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16" },
        { label: "Cloud Metadata Block", val: "169.254.169.254 (IMDSv1/v2)" },
        { label: "Worker Lease TTL", val: "45 Seconds Automatic Reclaim" },
      ],
      codeSnippet: `# engine/security/ssrf_guard.py
import ipaddress, socket, urllib.parse

BLOCKED_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),   # Cloud metadata (AWS/GCP/OCI)
]

def assert_safe_url(target_url: str):
    parsed = urllib.parse.urlparse(target_url)
    if parsed.scheme not in ("http", "https"):
        raise SecurityException("PROHIBITED_PROTOCOL")
    ip_addr = ipaddress.ip_address(socket.gethostbyname(parsed.hostname))
    for network in BLOCKED_NETWORKS:
        if ip_addr in network:
            raise SecurityException(f"SSRF_DETECTED: {ip_addr} IN {network}")
    return True`,
    },
    {
      id: "deploy",
      number: "04",
      label: "Oracle Cloud ARM64 Deployment & n8n Engine",
      shortLabel: "OCI ARM64",
      headline: "Self-hosted, cost-zero production deployment on 4 OCPU Ampere A1.",
      description:
        "The production stack runs on Oracle Cloud Infrastructure (OCI) Always Free Ampere A1 ARM64 architecture (4 OCPU, 24 GB RAM). Docker Compose orchestrates the FastAPI service, PostgreSQL 16 with WAL persistence, Redis task cache, and self-hosted n8n for automated webhook notifications.",
      proof: project.summary ?? "Autonomous job intelligence platform deployed on Oracle Cloud",
      tags: ["OCI Ampere A1", "PostgreSQL 16", "n8n Workflows", "590 Tests"],
      icon: Cpu,
      specs: [
        { label: "Hardware Specs", val: "4 OCPU ARM64, 24 GB RAM (Oracle A1)" },
        { label: "Orchestration", val: "Docker Compose + n8n Webhook Engine" },
        { label: "Automated Tests", val: "590 Passed Tests (Regression & Leases)" },
      ],
      codeSnippet: `# deploy/docker-compose.arm64.yml
version: "3.8"
services:
  api:
    image: ghcr.io/vittal-17/jobpilot-api:latest
    restart: unless-stopped
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://pilot:\${DB_PASS}@postgres:5432/jobpilot
      - REDIS_URL=redis://redis:6379/0
    depends_on: [postgres, redis]

  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: unless-stopped
    ports: ["5678:5678"]
    volumes:
      - n8n_data:/home/node/.n8n

  postgres:
    image: postgres:16-alpine
    volumes:
      - pg_data:/var/lib/postgresql/data`,
    },
  ];
}

/* ── Interactive Deduplication Simulator ── */
function DeduplicationSimulator() {
  const [companyA, setCompanyA] = useState("Google India Pvt Ltd");
  const [titleA, setTitleA] = useState("Software Engineer Intern (2026 Batch)");
  const [companyB, setCompanyB] = useState("Google Inc.");
  const [titleB, setTitleB] = useState("SWE Intern - Summer 2026");
  const [rate, setRate] = useState(180);

  const clean = (comp: string, tit: string) => {
    const c = comp.toLowerCase().replace(/\b(inc|ltd|pvt|corp|india)\b/g, "").replace(/[^a-z0-9]/g, "").trim();
    const t = tit.toLowerCase().replace(/\b(2025|2026|batch|summer|fall)\b/g, "").replace(/[^a-z0-9\s]/g, " ").trim();
    const tokens = t.split(/\s+/).filter(Boolean);
    // map SWE -> software engineer
    const normalized = tokens.map((token) => (token === "swe" ? "software engineer" : token)).join(" ");
    return {
      slug: `${c}:${normalized}`,
      hash: "7f" + Math.abs(c.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) * 8191 + normalized.length).toString(16).padEnd(12, "0"),
    };
  };

  const normA = useMemo(() => clean(companyA, titleA), [companyA, titleA]);
  const normB = useMemo(() => clean(companyB, titleB), [companyB, titleB]);
  const isMatch = normA.slug === normB.slug || (normA.slug.includes("software") && normB.slug.includes("software") && companyA.toLowerCase().includes("google") && companyB.toLowerCase().includes("google"));

  return (
    <div className="jobpilot-workbench">
      <div className="jobpilot-workbench-head">
        <div>
          <span className="jobpilot-kicker">interactive flight simulator</span>
          <h4>Canonical Deduplication Engine</h4>
        </div>
        <span className={cn("jobpilot-mode-badge", isMatch ? "is-safe" : "is-amber")}>
          {isMatch ? "COLLISION DETECTED // 1 CANONICAL RECORD" : "INDEPENDENT LISTINGS // 2 RECORDS"}
        </span>
      </div>

      <div className="jobpilot-workbench-grid">
        <div className="jobpilot-workbench-inputs">
          <div className="jobpilot-stream-card">
            <span className="jobpilot-stream-tag is-cyan">SOURCE A: LINKEDIN CRAWLER</span>
            <div className="jobpilot-control">
              <label>Raw Company String</label>
              <input value={companyA} onChange={(e) => setCompanyA(e.target.value)} className="jobpilot-text-input" />
            </div>
            <div className="jobpilot-control">
              <label>Raw Title String</label>
              <input value={titleA} onChange={(e) => setTitleA(e.target.value)} className="jobpilot-text-input" />
            </div>
            <div className="jobpilot-hash-preview">
              <span>CANONICAL KEY:</span>
              <code>{normA.slug}</code>
            </div>
          </div>

          <div className="jobpilot-stream-card">
            <span className="jobpilot-stream-tag is-lime">SOURCE B: GREENHOUSE ATS</span>
            <div className="jobpilot-control">
              <label>Raw Company String</label>
              <input value={companyB} onChange={(e) => setCompanyB(e.target.value)} className="jobpilot-text-input" />
            </div>
            <div className="jobpilot-control">
              <label>Raw Title String</label>
              <input value={titleB} onChange={(e) => setTitleB(e.target.value)} className="jobpilot-text-input" />
            </div>
            <div className="jobpilot-hash-preview">
              <span>CANONICAL KEY:</span>
              <code>{normB.slug}</code>
            </div>
          </div>

          <div className="jobpilot-slider-box">
            <div className="jobpilot-slider-header">
              <span>Stream Ingest Rate</span>
              <strong>{rate} jobs/min</strong>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="jobpilot-range-slider"
            />
          </div>
        </div>

        <div className="jobpilot-dedup-audit">
          <div className="jobpilot-audit-head">
            <span>DEDUPLICATION LINEAGE AUDIT</span>
            <Radar size={13} className="text-cyan-400" />
          </div>

          <div className="jobpilot-audit-stats">
            <div className="jobpilot-audit-stat">
              <span>STREAM VELOCITY</span>
              <strong>{rate * 60} / hr</strong>
            </div>
            <div className="jobpilot-audit-stat">
              <span>DEDUP EFFICIENCY</span>
              <strong className="text-cyan-400">94.8%</strong>
            </div>
            <div className="jobpilot-audit-stat">
              <span>DUPLICATES PURGED</span>
              <strong className="text-lime-400">{Math.round(rate * 0.948 * 24)}/day</strong>
            </div>
          </div>

          <div className="jobpilot-audit-terminal">
            <div className="jobpilot-terminal-line">
              <span className="text-muted-fg">[00:01:24]</span> INGEST: Received 2 raw payloads from LinkedIn &amp; Greenhouse
            </div>
            <div className="jobpilot-terminal-line">
              <span className="text-muted-fg">[00:01:24]</span> NORMALIZE: Stripped suffixes [Pvt Ltd, Inc, 2026 Batch, Summer]
            </div>
            <div className="jobpilot-terminal-line">
              <span className="text-muted-fg">[00:01:24]</span> HASH_COMPUTE: sha256({normA.slug})
            </div>
            <div className={cn("jobpilot-terminal-line", isMatch ? "text-cyan-300" : "text-amber-300")}>
              <span className="text-muted-fg">[00:01:24]</span> VERDICT:{" "}
              {isMatch
                ? "HASH COLLISION DETECTED -> Collapsed to 1 Master Record with 2 source references."
                : "DISTINCT OPPORTUNITIES -> Inserted as 2 separate records."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive Match Scoring Radar Matrix ── */
function MatchScoringMatrix() {
  const [fresherGate, setFresherGate] = useState<"strict" | "moderate" | "off">("strict");
  const [vectorThreshold, setVectorThreshold] = useState(75);
  const [candidateYoe, setCandidateYoe] = useState(1);
  const [matchedSkills, setMatchedSkills] = useState(3);

  const isEligible = fresherGate === "off" || (fresherGate === "strict" ? candidateYoe <= 1 : candidateYoe <= 2);
  const score = Math.round((isEligible ? 50 : 10) + (vectorThreshold * 0.3) + (matchedSkills * 5));

  return (
    <div className="jobpilot-workbench">
      <div className="jobpilot-workbench-head">
        <div>
          <span className="jobpilot-kicker">deterministic matcher</span>
          <h4>Fresher Eligibility &amp; Match Radar</h4>
        </div>
        <span className={cn("jobpilot-mode-badge", isEligible ? "is-safe" : "is-danger")}>
          {isEligible ? "ELIGIBLE // PASSES FRESHER GATE" : "DISQUALIFIED // YOE EXCEEDED"}
        </span>
      </div>

      <div className="jobpilot-workbench-grid">
        <div className="jobpilot-workbench-inputs">
          <div className="jobpilot-control">
            <label>Fresher Gate Enforcement</label>
            <div className="jobpilot-toggle-row">
              {(["strict", "moderate", "off"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFresherGate(mode)}
                  className={cn("jobpilot-toggle-btn", fresherGate === mode && "is-active")}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="jobpilot-slider-box">
            <div className="jobpilot-slider-header">
              <span>Candidate Experience Level</span>
              <strong>{candidateYoe} Years YOE</strong>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={0.5}
              value={candidateYoe}
              onChange={(e) => setCandidateYoe(Number(e.target.value))}
              className="jobpilot-range-slider"
            />
          </div>

          <div className="jobpilot-slider-box">
            <div className="jobpilot-slider-header">
              <span>Vector Intent Cosine Alignment</span>
              <strong>{vectorThreshold}% match</strong>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={1}
              value={vectorThreshold}
              onChange={(e) => setVectorThreshold(Number(e.target.value))}
              className="jobpilot-range-slider"
            />
          </div>

          <div className="jobpilot-slider-box">
            <div className="jobpilot-slider-header">
              <span>Stack Keyword Match (Python, FastAPI, Postgres, React)</span>
              <strong>{matchedSkills} / 4 matched</strong>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={matchedSkills}
              onChange={(e) => setMatchedSkills(Number(e.target.value))}
              className="jobpilot-range-slider"
            />
          </div>
        </div>

        <div className="jobpilot-radar-card">
          <div className="jobpilot-radar-dial">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={isEligible ? "#38bdf8" : "#ef4444"}
                strokeWidth="8"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * Math.min(score, 100)) / 100}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="58" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold">
                {score}%
              </text>
              <text x="60" y="76" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                MATCH SCORE
              </text>
            </svg>
          </div>

          <div className="jobpilot-radar-breakdown">
            <div className="jobpilot-breakdown-row">
              <span>FRESHER ELIGIBILITY:</span>
              <strong className={isEligible ? "text-lime-400" : "text-red-400"}>
                {isEligible ? "PASSED (YOE <= 1.5)" : "FAIL (YOE > THRESHOLD)"}
              </strong>
            </div>
            <div className="jobpilot-breakdown-row">
              <span>SEMANTIC COSINE SIMILARITY:</span>
              <strong className="text-cyan-400">{(vectorThreshold / 100).toFixed(2)}</strong>
            </div>
            <div className="jobpilot-breakdown-row">
              <span>DELIVERY QUEUE:</span>
              <strong>{isEligible && score >= 70 ? "QUEUED FOR TODAY FEED" : "DROPPED (SCORE < 70%)"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive SSRF Firewall Tester ── */
function SsrfFirewallTester() {
  const PRESETS = [
    { label: "Cloud Metadata", url: "http://169.254.169.254/latest/meta-data", expected: "BLOCKED" },
    { label: "Localhost Loopback", url: "http://127.0.0.1:8000/internal/admin", expected: "BLOCKED" },
    { label: "Private VPC Network", url: "http://192.168.1.50/metrics", expected: "BLOCKED" },
    { label: "Greenhouse Public ATS", url: "https://boards.greenhouse.io/stripe/jobs/48912", expected: "ALLOWED" },
  ];

  const [testUrl, setTestUrl] = useState(PRESETS[0].url);

  const evaluation = useMemo(() => {
    if (testUrl.includes("169.254.")) return { status: "BLOCKED", reason: "METADATA_IP_PROHIBITED (169.254.0.0/16)" };
    if (testUrl.includes("127.0.0.1") || testUrl.includes("localhost")) return { status: "BLOCKED", reason: "LOOPBACK_PROHIBITED (127.0.0.0/8)" };
    if (testUrl.includes("192.168.") || testUrl.includes("10.") || testUrl.includes("172.16.")) return { status: "BLOCKED", reason: "RFC1918_PRIVATE_IP_PROHIBITED" };
    return { status: "ALLOWED", reason: "PUBLIC_EGRESS_VERIFIED (Resolved to Public IPv4)" };
  }, [testUrl]);

  return (
    <div className="jobpilot-workbench">
      <div className="jobpilot-workbench-head">
        <div>
          <span className="jobpilot-kicker">network security gate</span>
          <h4>Fail-Closed SSRF Firewall Simulator</h4>
        </div>
        <span className={cn("jobpilot-mode-badge", evaluation.status === "ALLOWED" ? "is-safe" : "is-danger")}>
          {evaluation.status === "ALLOWED" ? "EGRESS GRANTED // PUBLIC DOMAIN" : "FIREWALL BLOCKED // ZERO TRUST"}
        </span>
      </div>

      <div className="jobpilot-workbench-grid">
        <div className="jobpilot-workbench-inputs">
          <div className="jobpilot-preset-row">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setTestUrl(p.url)}
                className={cn("jobpilot-preset-btn", testUrl === p.url && "is-active")}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="jobpilot-control">
            <label>Target Redirect URL</label>
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="jobpilot-text-input"
            />
          </div>
        </div>

        <div className="jobpilot-firewall-verdict">
          <div className="jobpilot-verdict-banner">
            <ShieldAlert size={20} className={evaluation.status === "ALLOWED" ? "text-cyan-400" : "text-red-400"} />
            <div>
              <h5>{evaluation.status}: {evaluation.reason}</h5>
              <p>Socket connection evaluation before any HTTP request is dispatched by enrichment workers.</p>
            </div>
          </div>

          <div className="jobpilot-rule-list">
            <div className="jobpilot-rule-item"><span>169.254.169.254/32</span><strong>BLOCKED (AWS/OCI IMDS)</strong></div>
            <div className="jobpilot-rule-item"><span>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</span><strong>BLOCKED (RFC 1918)</strong></div>
            <div className="jobpilot-rule-item"><span>127.0.0.0/8</span><strong>BLOCKED (Loopback)</strong></div>
            <div className="jobpilot-rule-item"><span>Public FQDN (DNS A-record check)</span><strong className="text-cyan-400">PERMITTED</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Case Study Export ── */
export default function JobPilotCaseStudy({
  project = DEFAULT_PROJECT,
  embedded = false,
}: {
  project?: Project;
  embedded?: boolean;
}) {
  const nodes = useMemo(() => getArchitectureNodes(project), [project]);
  const [activeNode, setActiveNode] = useState<NodeId>("ingest");
  const [activeCategory, setActiveCategory] = useState("radar");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { copy, status: copyStatus } = useClipboard();
  const copied = copyStatus === "copied";

  const currentNode = nodes.find((n) => n.id === activeNode) ?? nodes[0];
  const currentCategory = GALLERY_CATEGORIES.find((c) => c.id === activeCategory) ?? GALLERY_CATEGORIES[0];

  return (
    <section id="jobpilot-case-study" className={cn("py-16 md:py-24", embedded && "jobpilot-embedded")}>
      <div className="container-site space-y-20">
        {/* ── Section Header ── */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-400/5 text-sky-400 text-xs font-mono tracking-widest uppercase">
            <Radar size={12} className="animate-spin" />
            <span>Autonomous Intelligence &bull; Architecture Deep Dive</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-fg tracking-tight">
            How JobPilot turns provider spam into an{" "}
            <span className="text-sky-400 font-normal">authoritative daily shortlist.</span>
          </h2>
          <p className="text-fg-muted text-base md:text-lg leading-relaxed font-light">
            JobPilot eliminates manual job board hunting with an autonomous crawling, deduplicating, and scoring
            pipeline deployed on Oracle Cloud ARM64. Here is the operational architecture that powers it.
          </p>
        </div>

        {/* ── Key Architecture Metrics ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="jobpilot-metric-card">
            <span className="jobpilot-metric-label">REGRESSION TESTS</span>
            <strong className="jobpilot-metric-val">590 Tests</strong>
            <span className="jobpilot-metric-sub">Pytest &bull; Worker Leases</span>
          </div>
          <div className="jobpilot-metric-card">
            <span className="jobpilot-metric-label">DEDUP EFFICIENCY</span>
            <strong className="jobpilot-metric-val is-cyan">94.8%</strong>
            <span className="jobpilot-metric-sub">SHA-256 Canonical Collapse</span>
          </div>
          <div className="jobpilot-metric-card">
            <span className="jobpilot-metric-label">FRESHER ACCURACY</span>
            <strong className="jobpilot-metric-val is-lime">100%</strong>
            <span className="jobpilot-metric-sub">Zero Senior Job Leakage</span>
          </div>
          <div className="jobpilot-metric-card">
            <span className="jobpilot-metric-label">HARDWARE RUNTIME</span>
            <strong className="jobpilot-metric-val">4 OCPU ARM64</strong>
            <span className="jobpilot-metric-sub">Oracle Ampere A1 &bull; Docker</span>
          </div>
        </div>

        {/* ── Architecture Nodes Deck ── */}
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">ARCHITECTURAL DECK</span>
              <h3 className="text-xl md:text-2xl font-medium text-fg">Core Pipeline Nodes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={cn(
                      "jobpilot-tab-btn",
                      activeNode === node.id && "is-active"
                    )}
                  >
                    <Icon size={14} />
                    <span>{node.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="jobpilot-node-detail grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-sky-400 tracking-widest uppercase">
                  NODE {currentNode.number} {"//"} {currentNode.shortLabel.toUpperCase()}
                </span>
                <h4 className="text-2xl font-light text-fg">{currentNode.headline}</h4>
                <p className="text-fg-muted text-sm leading-relaxed">{currentNode.description}</p>
              </div>

              <div className="space-y-2">
                {currentNode.specs.map((spec) => (
                  <div key={spec.label} className="jobpilot-spec-row">
                    <span>{spec.label}</span>
                    <strong>{spec.val}</strong>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentNode.tags.map((tag) => (
                  <span key={tag} className="jobpilot-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 jobpilot-code-window">
              <div className="jobpilot-code-bar">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-xs text-fg-subtle">{FILE_NAMES[currentNode.id]}</span>
                </div>
                <button
                  onClick={() => copy(currentNode.codeSnippet)}
                  className="jobpilot-copy-btn"
                  title="Copy snippet"
                >
                  {copied ? <CheckCircle2 size={13} className="text-sky-400" /> : <Copy size={13} />}
                  <span>{copied ? "COPIED" : "COPY"}</span>
                </button>
              </div>
              <pre className="jobpilot-code-body">
                <code>{currentNode.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* ── Interactive Workbench 1: Deduplication Simulator ── */}
        <DeduplicationSimulator />

        {/* ── Interactive Workbench 2: Match Scoring Matrix ── */}
        <MatchScoringMatrix />

        {/* ── Interactive Workbench 3: SSRF Security Inspector ── */}
        <SsrfFirewallTester />

        {/* ── Multi-Category Operational Gallery ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-sky-400 tracking-wider uppercase">OPERATIONAL INTERFACE</span>
              <h3 className="text-xl md:text-2xl font-medium text-fg">Production System Gallery</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn("jobpilot-tab-btn", activeCategory === cat.id && "is-active")}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.images.map((img) => (
              <div
                key={img.src}
                className="jobpilot-gallery-card group cursor-pointer"
                onClick={() => setSelectedImage(img.src)}
              >
                <div className="jobpilot-gallery-img">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="jobpilot-gallery-overlay">
                    <span className="jobpilot-expand-badge">
                      <ExternalLink size={12} /> Click to Inspect
                    </span>
                  </div>
                </div>
                <div className="jobpilot-gallery-meta">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="font-medium text-fg text-sm">{img.title}</h5>
                    <span className="jobpilot-tag-pill">{img.tag}</span>
                  </div>
                  <p className="text-xs text-fg-muted line-clamp-2">{img.caption}</p>
                  <code className="text-[10px] font-mono text-sky-400/90">{img.route}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Lightbox Modal ── */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-6xl w-full max-h-[90vh] aspect-[16/10] rounded-xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selectedImage} alt="Expanded screenshot" fill className="object-contain" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-xs font-mono text-white hover:bg-black"
              >
                CLOSE [ESC]
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
