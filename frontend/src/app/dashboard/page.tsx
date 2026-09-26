"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import {
  ShieldCheck,
  GitBranch,
  Terminal,
  UploadCloud,
  ExternalLink,
  CheckCircle2,
  Copy,
  Layers,
  Database,
  Lock,
  LogOut,
  ChevronDown,
  Sparkles,
  Server,
  Plus,
  ArrowRight,
  Activity,
  FileText,
  BadgeCheck,
  Building2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "simulator">("overview");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedJob, setSelectedJob] = useState("paystack");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<number | null>(94);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passportUrl = "creda.work/p/amina-adeleke";

  // Drag and drop ingestion state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>("amina_resume_2026.pdf");
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = (fileName: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFile(fileName);
    }, 1200);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      simulateUpload(files[0].name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0].name);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${passportUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("creda_auth_token");
      sessionStorage.clear();
    }
    router.push("/auth/login");
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult(selectedJob === "paystack" ? 94 : selectedJob === "moniepoint" ? 91 : 88);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Minimalist Architectural Header (Oberon Style) ── */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-20 flex items-center justify-between transition-all">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={34} showTag={true} tagText="DASHBOARD" />
          </Link>

          {/* Architectural Tab Switcher */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-neutral-200/60 border border-neutral-200 text-xs font-mono">
            {[
              { id: "overview", label: "Overview" },
              { id: "evidence", label: "Evidence" },
              { id: "simulator", label: "Job Match" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-white text-[#0F172A] font-bold shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/recruiter"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-[#FAFAF8] hover:bg-white hover:border-[#4F46E5] text-xs font-mono text-[#64748B] hover:text-[#4F46E5] transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Building2 size={13} className="flex-shrink-0" />
            <span className="whitespace-nowrap">Recruiter View →</span>
          </Link>
          {/* Public Link Share & View */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] shadow-2xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="Copy public passport URL"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={13} className="text-[#4F46E5] flex-shrink-0" />
                  <span className="text-[#4F46E5] font-semibold whitespace-nowrap">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-[#64748B] flex-shrink-0" />
                  <span className="hidden sm:inline font-mono whitespace-nowrap">creda.work/p/amina-adeleke</span>
                  <span className="sm:hidden font-mono whitespace-nowrap">Share</span>
                </>
              )}
            </button>

            <Link
              href="/p/amina-adeleke"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 bg-[#FAFAF8] hover:bg-white hover:border-[#4F46E5] hover:text-[#4F46E5] text-xs font-mono text-[#0F172A] shadow-2xs transition-all whitespace-nowrap flex-shrink-0"
              title="Open public passport in new tab"
            >
              <span className="whitespace-nowrap">View</span>
              <ExternalLink size={12} className="flex-shrink-0" />
            </Link>
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-[#4F46E5]/20 transition-all cursor-pointer group"
              aria-label="User account menu"
            >
              <img
                src="/testimonials/amina.jpg"
                alt="Amina Adeleke"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs group-hover:border-[#4F46E5] transition-colors"
              />
              <ChevronDown size={14} className="text-[#64748B] hidden sm:block" />
            </button>

            {/* Architectural Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl z-50 animate-fade-in-up">
                <div className="p-3 border-b border-neutral-100">
                  <div className="font-bold text-sm text-[#0F172A]">Amina Adeleke</div>
                  <div className="text-xs text-[#64748B] font-mono mt-0.5">amina@domain.com</div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-mono text-[#4F46E5] font-semibold mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                    CODE-PROVEN TIER
                  </div>
                </div>

                <div className="py-1 text-xs font-mono text-[#475569]">
                  <button
                    onClick={() => {
                      setActiveTab("overview");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-[#0F172A] transition-colors text-left cursor-pointer"
                  >
                    <Layers size={14} className="text-[#4F46E5]" />
                    <span>Ledger Overview</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("evidence");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-[#0F172A] transition-colors text-left cursor-pointer"
                  >
                    <GitBranch size={14} className="text-[#4F46E5]" />
                    <span>Evidence Repositories</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("simulator");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-[#0F172A] transition-colors text-left cursor-pointer"
                  >
                    <Sparkles size={14} className="text-[#4F46E5]" />
                    <span>Job Match Simulator</span>
                  </button>

                  <Link
                    href="/p/amina-adeleke"
                    target="_blank"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-[#0F172A] transition-colors text-left"
                  >
                    <ShieldCheck size={14} className="text-[#4F46E5]" />
                    <span>View Public Passport ↗</span>
                  </Link>

                  <Link
                    href="/"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-[#0F172A] transition-colors text-left"
                  >
                    <ExternalLink size={14} className="text-[#64748B]" />
                    <span>Public Landing Page</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-neutral-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-xs font-mono text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out of Creda</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Architectural Content ──────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-10 space-y-10">
        
        {/* ── TAB 1: LEDGER OVERVIEW ─────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-10 animate-fade-in-up">
            
            {/* Primary Proof Document: Architectural Credential Card */}
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
              {/* Structural Crosshairs */}
              <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
              <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
              <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
              <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Candidate Credentials */}
                <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <img
                    src="/testimonials/amina.jpg"
                    alt="Amina Adeleke"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                        Amina Adeleke
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[10px] font-mono uppercase font-bold">
                        <BadgeCheck size={13} />
                        VERIFIED PROOF
                      </span>
                    </div>

                    <p className="text-sm text-[#475569] font-mono mt-1">
                      Senior Systems & Backend Architect // Lagos, Nigeria // 1,420 Production Commits
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {["TypeScript Engine", "Distributed Go", "PostgreSQL", "OWASP Hardening"].map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#FAFAF8] border border-[#E5E7EB] text-[#475569]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Overall Trust Index Meter */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#64748B] font-semibold">
                      OVERALL TRUST INDEX
                    </div>
                    <div className="text-xs font-mono text-[#4F46E5] font-bold mt-0.5">
                      Top 2% African Talent
                    </div>
                    <div className="text-[11px] font-mono text-[#64748B] mt-2">
                      Zero synthetic inflation
                    </div>
                  </div>
                  <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#0F172A] pl-5 border-l border-[#E5E7EB]">
                    96.4<span className="text-sm text-[#64748B] font-normal">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AST Code-Proven Skills Grid (Oberon Architectural Nodes) */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                    Verified Skills
                  </h2>
                </div>
                <span className="text-xs font-mono text-[#64748B]">
                  Audited from 14 repositories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "TypeScript & Node Engine",
                    pct: 98,
                    desc: "14 repositories analyzed. AST validation confirms strict typing, concurrency models & high-throughput API patterns.",
                    icon: Terminal,
                    tier: "Top Strength Tier",
                    repos: "14 Repositories",
                  },
                  {
                    name: "Distributed Go Microservices",
                    pct: 94,
                    desc: "Concurrency channels, gRPC endpoints, and Redis caching. Commits verified with signed GPG keys on production branches.",
                    icon: Server,
                    tier: "Code-Proven Tier",
                    repos: "26 Pull Requests",
                  },
                  {
                    name: "PostgreSQL & Index Optimization",
                    pct: 91,
                    desc: "Complex query plans, connection pooling, and schema migration records verified from production repos.",
                    icon: Database,
                    tier: "Code-Proven Tier",
                    repos: "Schema Audited",
                  },
                  {
                    name: "System Architecture & Security",
                    pct: 89,
                    desc: "OWASP hardening, Docker containers, and CI/CD pipelines verified against live deployed endpoints.",
                    icon: Lock,
                    tier: "Top Strength Tier",
                    repos: "CI/CD Verified",
                  },
                ].map((skill, idx) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs hover:border-[#4F46E5]/40 transition-all card-hover"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
                            <Icon size={16} />
                          </div>
                          <span className="font-bold text-base text-[#0F172A] tracking-tight">
                            {skill.name}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-lg text-[#0F172A]">
                          {skill.pct}%
                        </span>
                      </div>

                      <p className="text-xs text-[#475569] leading-relaxed mb-4">
                        {skill.desc}
                      </p>

                      <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden mb-3">
                        <div
                          className="h-full bg-[#4F46E5] rounded-full transition-all duration-1000"
                          style={{ width: `${skill.pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-2 border-t border-neutral-100">
                        <span>{skill.tier}</span>
                        <span>{skill.repos}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evidence Ingestion Sources */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                  Connected Evidence
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Source 1: GitHub */}
                <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs flex flex-col justify-between card-hover">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
                        <GitBranch size={17} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                        CONNECTED
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A] tracking-tight">GitHub Repositories</h3>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                      14 public and connected repositories actively audited. Code complexity calculated in-memory on push.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#64748B]">github.com/amina-dev</span>
                    <button
                      onClick={() => setActiveTab("evidence")}
                      className="text-[#4F46E5] font-semibold hover:underline cursor-pointer"
                    >
                      Manage →
                    </button>
                  </div>
                </div>

                {/* Source 2: Technical CV */}
                <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs flex flex-col justify-between card-hover">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
                        <UploadCloud size={17} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#64748B] font-semibold">
                        INGESTED
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A] tracking-tight">Technical CV PDF</h3>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                      Extracted claim records verified against production commit history and dependency lockfiles.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#64748B]">amina_resume_2026.pdf</span>
                    <button
                      onClick={() => setActiveTab("evidence")}
                      className="text-[#4F46E5] font-semibold hover:underline cursor-pointer"
                    >
                      Update →
                    </button>
                  </div>
                </div>

                {/* Source 3: Cryptographic Passport */}
                <div className="p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs flex flex-col justify-between card-hover">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
                        <ShieldCheck size={17} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-[#4F46E5] font-semibold">
                        IMMUTABLE
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A] tracking-tight">Public Passport Link</h3>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                      Cryptographically sealed link for recruiters to inspect verified skill breakdown and code audit trails.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#4F46E5] font-medium">{passportUrl}</span>
                    <button
                      onClick={handleCopy}
                      className="text-[#0F172A] font-semibold hover:text-[#4F46E5] cursor-pointer"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: EVIDENCE INGESTION ──────────────────────── */}
        {activeTab === "evidence" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-1">
                    // GITHUB REPOSITORY AUDIT ENGINE
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                    Connected Repositories (14)
                  </h2>
                  <p className="text-xs text-[#64748B] font-mono mt-1">
                    AST complexity analysis and commit integrity audit runs automatically on push.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0">
                  <Plus size={14} className="flex-shrink-0" />
                  <span className="whitespace-nowrap">Connect Repository</span>
                </button>
              </div>

              {/* Repositories List */}
              <div className="space-y-3 font-mono text-xs">
                {[
                  {
                    name: "amina-dev/distributed-go-microservices",
                    commits: "482 commits",
                    lang: "Go 96%",
                    status: "GPG Signed",
                    health: "98/100 AST Complexity",
                  },
                  {
                    name: "amina-dev/typescript-ast-engine",
                    commits: "340 commits",
                    lang: "TypeScript 94%",
                    status: "CI/CD Pass",
                    health: "96/100 AST Complexity",
                  },
                  {
                    name: "amina-dev/postgres-indexing-pool",
                    commits: "295 commits",
                    lang: "SQL & Python",
                    status: "Verified Schema",
                    health: "92/100 AST Complexity",
                  },
                  {
                    name: "amina-dev/owasp-security-guard",
                    commits: "185 commits",
                    lang: "Go & Docker",
                    status: "Signed Audit",
                    health: "94/100 AST Complexity",
                  },
                ].map((repo, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] hover:bg-white hover:border-[#4F46E5]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <GitBranch size={16} className="text-[#4F46E5] flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-[#0F172A] tracking-tight text-sm font-sans">{repo.name}</div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">{repo.commits} • {repo.lang}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[11px] font-semibold">
                        {repo.status}
                      </span>
                      <span className="text-[#64748B] text-[11px]">{repo.health}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Technical Evidence Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`rounded-3xl border-2 border-dashed p-10 sm:p-12 text-center transition-all ${
                isDragging
                  ? "border-[#4F46E5] bg-indigo-50/50 scale-[1.01]"
                  : "border-[#E5E7EB] bg-white hover:border-[#4F46E5]/50 shadow-xs"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.json,.md,.txt"
                onChange={handleFileInput}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] mx-auto mb-4">
                <UploadCloud size={28} />
              </div>

              <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
                {isUploading ? "Ingesting & Analyzing Syntax Tree..." : "Upload Technical CV, Architecture PDF or Figma Tokens"}
              </h3>

              <p className="text-xs text-[#64748B] font-mono max-w-md mx-auto mt-1 leading-relaxed">
                Drag and drop your technical CV (.pdf) or design tokens (.json). Our in-memory engine extracts project claims and verifies them against live code.
              </p>

              {isUploading ? (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#4F46E5]/30 border-t-[#4F46E5] rounded-full animate-spin" />
                  <span className="text-xs font-mono text-[#4F46E5]">Processing In-Memory AST Audit...</span>
                </div>
              ) : uploadedFile ? (
                <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-mono text-[#0F172A]">
                  <FileText size={15} className="text-[#4F46E5]" />
                  <span className="font-semibold">{uploadedFile}</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
                    VERIFIED IN-MEMORY
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#4F46E5] hover:underline cursor-pointer ml-1"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 rounded-xl text-xs font-mono uppercase font-semibold border border-[#E5E7EB] hover:border-[#4F46E5] hover:text-[#4F46E5] text-[#0F172A] bg-[#FAFAF8] hover:bg-white transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    Select File From Device
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: JOB MATCH SIMULATOR ─────────────────────── */}
        {activeTab === "simulator" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                  Simulate Role Fit
                </h2>
                <p className="text-xs text-[#64748B] font-mono mt-1">
                  Test your verified skills against engineering role requirements.
                </p>
              </div>

              {/* Preset Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    id: "paystack",
                    company: "Paystack",
                    role: "Senior Backend Systems Engineer",
                    reqs: "Go, Concurrency, Distributed Systems",
                  },
                  {
                    id: "moniepoint",
                    company: "Moniepoint",
                    role: "Staff Infrastructure Engineer",
                    reqs: "PostgreSQL, Redis, Microservices",
                  },
                  {
                    id: "flutterwave",
                    company: "Flutterwave",
                    role: "Core Payments Engineer",
                    reqs: "High Throughput, GPG, Security",
                  },
                ].map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job.id);
                      setSimulationResult(job.id === "paystack" ? 94 : job.id === "moniepoint" ? 91 : 88);
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedJob === job.id
                        ? "border-[#4F46E5] bg-indigo-50/50 shadow-xs"
                        : "border-[#E5E7EB] bg-[#FAFAF8] hover:bg-white"
                    }`}
                  >
                    <div className="text-[11px] font-mono text-[#4F46E5] font-bold">{job.company}</div>
                    <div className="text-sm font-bold text-[#0F172A] mt-1">{job.role}</div>
                    <div className="text-xs text-[#64748B] font-mono mt-2">{job.reqs}</div>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="h-12 px-6 rounded-lg text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-75 whitespace-nowrap flex-shrink-0"
              >
                {isSimulating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    <span className="whitespace-nowrap">Analyzing Syntax Match...</span>
                  </>
                ) : (
                  <>
                    <span className="whitespace-nowrap">Run Match Analysis</span>
                    <Sparkles size={14} className="flex-shrink-0" />
                  </>
                )}
              </button>

              {/* Simulation Result */}
              {simulationResult && (
                <div className="mt-8 pt-8 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] text-center">
                    <div className="text-[10px] font-mono text-[#64748B] uppercase">OBJECTIVE MATCH SCORE</div>
                    <div className="text-5xl font-mono font-extrabold text-[#4F46E5] my-2">
                      {simulationResult}%
                    </div>
                    <div className="text-xs font-mono text-[#0F172A] font-semibold">High Confidence Technical Fit</div>
                  </div>

                  <div className="md:col-span-8 space-y-3 text-xs font-mono">
                    <div className="flex items-start gap-2.5 text-[#475569]">
                      <CheckCircle2 size={15} className="text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#0F172A]">Verified Strengths:</strong> 1,420 production commits match required concurrency and distributed systems criteria.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[#475569]">
                      <CheckCircle2 size={15} className="text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#0F172A]">Screening Bypass:</strong> Candidate qualifies for fast-track 1-round technical screening.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[#475569]">
                      <CheckCircle2 size={15} className="text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-[#0F172A]">Tamper-Proof Guarantee:</strong> All AST complexity data cryptographically sealed with SHA-256 hash.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Minimalist Architectural Footer ─────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-6 text-xs font-mono text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Creda Protocol. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">
              Public Home
            </Link>
            <button onClick={handleLogout} className="hover:text-rose-600 transition-colors cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
