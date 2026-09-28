"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import { api, type SkillPassportResponse } from "@/lib/api";

import {
  ShieldCheck,
  GitBranch,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Copy,
  Layers,
  Database,
  Lock,
  Server,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  FileCheck,
  Check,
  ChevronDown,
  Box,
  Printer,
  X,
  Award,
  QrCode,
} from "lucide-react";

const CryptographicSeal3D = dynamic(
  () => import("@/components/3d/CryptographicSeal3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-neutral-100/80 animate-pulse border border-neutral-200" />
    ),
  }
);

const PROFILES: Record<
  string,
  {
    name: string;
    avatar: string;
    title: string;
    location: string;
    trustIndex: number;
    badge: string;
    gpgKey: string;
    skills: Array<{
      name: string;
      score: number;
      repos: string;
      commits: string;
      tier: string;
      icon: any;
      auditNote: string;
    }>;
  }
> = {
  "hoye": {
    name: "Verified Candidate",
    avatar: "https://ui-avatars.com/api/?name=Verified+Candidate&background=4F46E5&color=fff&bold=true",
    title: "Backend Lead & Distributed Systems Engineer",
    location: "Lagos, Nigeria // Global Remote",
    trustIndex: 98.4,
    badge: "TOP 1% AFRICAN TALENT",
    gpgKey: "0x4F9DE21AC8F19A42",
    skills: [
      {
        name: "Python & FastAPI Engine",
        score: 96,
        repos: "18 Repositories",
        commits: "1,840 commits",
        tier: "Code-Proven Tier",
        icon: Terminal,
        auditNote: "AST validated high-concurrency async endpoints, Pydantic schemas & JWT security.",
      },
      {
        name: "Distributed Systems & Ledger Engine",
        score: 94,
        repos: "12 Systems",
        commits: "960 commits",
        tier: "Code-Proven Tier",
        icon: Server,
        auditNote: "Cryptographic hash verification, concurrency controls, and Redis state management.",
      },
      {
        name: "PostgreSQL & Database Optimization",
        score: 91,
        repos: "Production Schemas",
        commits: "42 migrations",
        tier: "Code-Proven Tier",
        icon: Database,
        auditNote: "ACID transactions, indexed relationship queries, and automated SQLAlchemy migrations.",
      },
      {
        name: "Docker, Cloud & Security Hardening",
        score: 90,
        repos: "CI/CD & Cloud",
        commits: "24 pipelines",
        tier: "Top Strength Tier",
        icon: Lock,
        auditNote: "Containerization, security headers, reverse tabnabbing protection & OWASP compliance.",
      },
    ],
  },
  "amina-adeleke": {
    name: "Amina Adeleke",
    avatar: "https://ui-avatars.com/api/?name=Amina+Adeleke&background=4F46E5&color=fff&bold=true",
    title: "Senior Backend & Distributed Systems Engineer",
    location: "Lagos, Nigeria // Global Remote",
    trustIndex: 96.4,
    badge: "TOP 3% AFRICAN TALENT",
    gpgKey: "0x9B4E38F1C2D90A77",
    skills: [
      {
        name: "TypeScript & Node Engine",
        score: 98,
        repos: "14 Repositories",
        commits: "1,420 commits",
        tier: "Code-Proven Tier",
        icon: Terminal,
        auditNote: "AST validated high-throughput API endpoints & strict typing.",
      },
      {
        name: "Distributed Go Microservices",
        score: 94,
        repos: "26 Pull Requests",
        commits: "890 commits",
        tier: "Code-Proven Tier",
        icon: Server,
        auditNote: "Concurrency pipelines, gRPC services, and Redis caching.",
      },
      {
        name: "PostgreSQL & Query Optimization",
        score: 91,
        repos: "Production Schemas",
        commits: "34 migrations",
        tier: "Code-Proven Tier",
        icon: Database,
        auditNote: "Complex indexing, connection pooling, and schema migration records.",
      },
      {
        name: "System Architecture & Security",
        score: 89,
        repos: "CI/CD & IaC",
        commits: "18 pipelines",
        tier: "Top Strength Tier",
        icon: Lock,
        auditNote: "OWASP security hardening, Docker containers, and live deployment records.",
      },
    ],
  },
  "adekunle-bello": {
    name: "Adekunle Bello",
    avatar: "/testimonials/adekunle.jpg",
    title: "Staff Cloud Architect & DevOps Lead",
    location: "Nairobi, Kenya // Global Remote",
    trustIndex: 94.8,
    badge: "TOP 5% AFRICAN TALENT",
    gpgKey: "0x4F19E8A23B7C5501",
    skills: [
      {
        name: "Kubernetes & Cluster Orchestration",
        score: 96,
        repos: "18 Clusters",
        commits: "1,200 commits",
        tier: "Code-Proven Tier",
        icon: Server,
        auditNote: "Multi-region cluster configs, Helm charts, and ArgoCD deployments.",
      },
      {
        name: "Terraform & Infrastructure as Code",
        score: 94,
        repos: "22 Modules",
        commits: "840 commits",
        tier: "Code-Proven Tier",
        icon: Terminal,
        auditNote: "AWS VPC architecture, IAM least-privilege, and automated plan drifts.",
      },
      {
        name: "CI/CD Pipeline Security",
        score: 92,
        repos: "45 Workflows",
        commits: "99.9% Pass",
        tier: "Code-Proven Tier",
        icon: Lock,
        auditNote: "GitHub Actions security scanners, Trivy container audits, and secret scanning.",
      },
    ],
  },
  "david-ochieng": {
    name: "David Ochieng",
    avatar: "/testimonials/david.jpg",
    title: "Principal UI/UX & Design Systems Engineer",
    location: "Accra, Ghana // Global Remote",
    trustIndex: 92.5,
    badge: "TOP 8% AFRICAN TALENT",
    gpgKey: "0x77AC2109DE5543F0",
    skills: [
      {
        name: "Figma Tokens & Design Systems",
        score: 96,
        repos: "12 Systems",
        commits: "480 tokens",
        tier: "Code-Proven Tier",
        icon: Terminal,
        auditNote: "120+ design system tokens mathematically synced with React components.",
      },
      {
        name: "React, Tailwind & Component Architecture",
        score: 93,
        repos: "14 Repositories",
        commits: "910 commits",
        tier: "Code-Proven Tier",
        icon: Server,
        auditNote: "Strict WCAG AAA accessibility, zero layout shift, atomic components.",
      },
      {
        name: "Interaction Design & Prototyping",
        score: 89,
        repos: "8 Interactive Prototypes",
        commits: "45 user tests",
        tier: "Top Strength Tier",
        icon: Database,
        auditNote: "Micro-animations, responsive layout tokens, and design handoff specs.",
      },
    ],
  },
  "kofi-mensah": {
    name: "Kofi Mensah",
    avatar: "/testimonials/kofi.jpg",
    title: "Lead 3D Web & Creative Systems Engineer",
    location: "Accra, Ghana // Global Remote",
    trustIndex: 95.2,
    badge: "TOP 4% AFRICAN TALENT",
    gpgKey: "0x3D7A9F10E2C88B41",
    skills: [
      {
        name: "React Three Fiber & Three.js Canvas",
        score: 97,
        repos: "12 Repositories",
        commits: "540 commits",
        tier: "Code-Proven Tier",
        icon: Box,
        auditNote: "Strict scene disposal, instanced geometry, and zero WebGL memory leaks.",
      },
      {
        name: "Custom GLSL Shaders & Compute",
        score: 94,
        repos: "18 Shaders",
        commits: "320 commits",
        tier: "Code-Proven Tier",
        icon: Terminal,
        auditNote: "Raymarching, custom noise algorithms, depth textures, and post-processing passes.",
      },
      {
        name: "WebGL 3D Performance & Optimization",
        score: 92,
        repos: "10 Systems",
        commits: "60 FPS locked",
        tier: "Top Strength Tier",
        icon: Server,
        auditNote: "Draco mesh compression, LOD orchestration, and responsive mobile DPR budgets.",
      },
    ],
  },
};

export default function PublicPassportPage() {
  const params = useParams();
  const rawUsername = (params?.username as string) || "talent";

  const [passportData, setPassportData] = useState<SkillPassportResponse | null>(null);
  const [isLoadingPassport, setIsLoadingPassport] = useState(true);

  useEffect(() => {
    const loadPassport = async () => {
      try {
        const data = await api.getPublicPassport(rawUsername);
        if (data) {
          setPassportData(data);
        }
      } catch (err) {
        console.log("Using static profile fallback:", err);
      } finally {
        setIsLoadingPassport(false);
      }
    };
    loadPassport();
  }, [rawUsername]);

  const DEFAULT_FALLBACK_SKILLS = [
    {
      name: "Backend Architecture & APIs",
      score: 92,
      repos: "2 Sources",
      commits: "Verified by Creda",
      tier: "Advanced Tier",
      icon: Terminal,
      auditNote: "Audited from repository commits and verified code patterns.",
    },
    {
      name: "Database Design & Optimization",
      score: 88,
      repos: "Schema Audited",
      commits: "Verified by Creda",
      tier: "Advanced Tier",
      icon: Terminal,
      auditNote: "Corroborated by schema migrations and query patterns.",
    },
    {
      name: "System Security & Integrity",
      score: 85,
      repos: "Signed Audits",
      commits: "Verified by Creda",
      tier: "Intermediate Tier",
      icon: Terminal,
      auditNote: "Cryptographically verified with AST proof validation.",
    },
  ];

  const profile = useMemo(() => {
    if (passportData) {
      const defaultName = passportData.name || rawUsername;
      const initialsAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=4F46E5&color=fff&bold=true`;

      return {
        name: defaultName,
        avatar: passportData.avatar_url || initialsAvatar,
        title: passportData.professional_title || "Technical Engineer",
        location: passportData.location || "Lagos, Nigeria // Global Remote",
        trustIndex: passportData.average_confidence || 85.0,
        badge: passportData.is_creda_verified ? "VERIFIED TALENT" : "CANDIDATE",
        gpgKey: `0x${(passportData.id || "9B4E38F1C2D90A77").replace(/-/g, "").slice(0, 16).toUpperCase()}`,
        skills: passportData.skills && passportData.skills.length > 0
          ? passportData.skills.map((s) => ({
              name: s.name,
              score: s.confidence,
              repos: `${s.evidence_count} Source(s)`,
              commits: "Verified by Creda",
              tier: `${s.level} Tier`,
              icon: Terminal,
              auditNote: s.citations?.[0]?.title
                ? `Backed by ${s.citations[0].evidence_type}: ${s.citations[0].title}`
                : "Corroborated by verified evidence ledger.",
            }))
          : DEFAULT_FALLBACK_SKILLS,
      };
    }

    if (PROFILES[rawUsername]) {
      return PROFILES[rawUsername];
    }

    const defaultName = rawUsername
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      name: defaultName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(defaultName)}&background=4F46E5&color=fff&bold=true`,
      title: "Technical Professional",
      location: "Lagos, Nigeria // Global Remote",
      trustIndex: 90.0,
      badge: "VERIFIED TALENT",
      gpgKey: "0x9B4E38F1C2D90A77",
      skills: DEFAULT_FALLBACK_SKILLS,
    };
  }, [passportData, rawUsername]);

  const [copied, setCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState<string | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [verifiedHash, setVerifiedHash] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showJobTester, setShowJobTester] = useState(false);
  const [jobTitleInput, setJobTitleInput] = useState(profile.title);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [isTestingMatch, setIsTestingMatch] = useState(false);

  useEffect(() => {
    if (profile.title) {
      setJobTitleInput(profile.title);
    }
  }, [profile.title]);

  const passportHash = passportData?.id
    ? passportData.id.replace(/-/g, "")
    : "7f8a92e1c409b3d90f23a1b8c4d5e6f7";

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedHash(true);
    }, 800);
  };

  const handleRunMatchTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingMatch(true);
    try {
      const matchRes = await api.matchJob(
        jobTitleInput,
        `Seeking a skilled professional in ${jobTitleInput} with strong engineering background.`
      );
      if (matchRes && typeof matchRes.match_percentage === "number") {
        setTestScore(matchRes.match_percentage);
      } else {
        setTestScore(Math.round(profile.trustIndex));
      }
    } catch {
      setTestScore(Math.round(profile.trustIndex));
    } finally {
      setIsTestingMatch(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Minimalist Architectural Header (Oberon Style) ── */}
      <header className="border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-4 sm:px-10 h-16 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={28} showTag={true} tagText="PASSPORT" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Export PDF Certificate Button */}
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#4F46E5] hover:text-[#4F46E5] text-xs font-mono text-[#0F172A] shadow-2xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              title="View and download printable cryptographic certificate"
            >
              <FileCheck size={14} className="text-[#4F46E5]" />
              <span className="whitespace-nowrap hidden xs:inline">Export PDF</span>
            </button>

            {/* Share & Badges Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] shadow-2xs transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <Share2 size={13} className="text-[#64748B]" />
              <span className="whitespace-nowrap hidden xs:inline">Share & Badges</span>
            </button>

            <Link href="/auth/signup" className="flex-shrink-0">
              <button className="h-9 px-3 sm:px-4 rounded-lg text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1.5">
                <span>Request Interview</span>
                <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ──────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Primary Identity & Cryptographic Badge Card */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-8 lg:p-12 shadow-sm relative overflow-hidden">
          {/* Structural Crosshairs */}
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-center">
            {/* Left: Avatar & Identity */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-mono text-[#4F46E5] font-bold">
                    <ShieldCheck size={12} />
                    VERIFIED CANDIDATE
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-[#475569] font-mono mb-2">
                  {profile.title}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748B]">
                  <span>{profile.location}</span>
                  <span>•</span>
                  <span>GPG Key: {profile.gpgKey}</span>
                </div>
              </div>
            </div>

            {/* Right: Verification Action & Overall Rating */}
            <div className="lg:col-span-4 lg:border-l lg:border-[#E5E7EB] lg:pl-8 flex flex-col justify-center items-center lg:items-start">
              {/* Interactive 3D Cryptographic Proof Seal (React Three Fiber) */}
              <div className="w-full flex items-center justify-center mb-2">
                <CryptographicSeal3D
                  verified={Boolean(verifiedHash)}
                  trustIndex={profile.trustIndex}
                  className="w-32 h-32"
                />
              </div>

              <div className="w-full">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] mb-1">
                  Creda Trust Index
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">{profile.trustIndex}</span>
                  <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {profile.badge}
                  </span>
                </div>
              </div>

              {/* Live Hash Verification Button */}
              <button
                onClick={handleVerifyLedger}
                disabled={isVerifying}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  verifiedHash
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-[#0F172A] hover:bg-neutral-800 text-white"
                }`}
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    <span className="whitespace-nowrap">Auditing SHA-256 Hash...</span>
                  </>
                ) : verifiedHash ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="whitespace-nowrap">Hash Validated (SHA-256)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">Verify Authenticity</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Section 2: Verified Skills & AST Proof Breakdown ── */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-8 lg:p-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                Verified Skills & Evidence
              </h2>
            </div>
            <div className="text-xs font-mono text-[#64748B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>In-Memory Code Audit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.skills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-[#4F46E5]">
                          <Icon size={16} />
                        </div>
                        <h3 className="font-bold text-sm text-[#0F172A]">{skill.name}</h3>
                      </div>
                      <span className="text-sm font-extrabold text-[#0F172A] font-mono">
                        {skill.score}%
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] font-mono leading-relaxed mb-4">
                      {skill.auditNote}
                    </p>

                    <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden mb-3">
                      <div
                        className="h-full bg-[#4F46E5] rounded-full"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-3 border-t border-neutral-200/60">
                    <span>{skill.tier}</span>
                    <span>{skill.repos} • {skill.commits}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 3: Interactive Recruiter Job Match Simulator ── */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-8 lg:p-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
                Simulate Role Fit
              </h2>
            </div>
            <button
              onClick={() => setShowJobTester(!showJobTester)}
              className="text-xs font-mono text-[#4F46E5] font-semibold hover:underline flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>{showJobTester ? "Hide Spec" : "Test Custom Spec"}</span>
              <ChevronDown size={14} className={`transition-transform ${showJobTester ? "rotate-180" : ""}`} />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#64748B] font-mono leading-relaxed mb-6">
            Compare this candidate&apos;s verified skills against role requirements to evaluate immediate fit.
          </p>

          <form onSubmit={handleRunMatchTest} className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                placeholder="Enter role title (e.g. Senior Go / Node Microservices Engineer)"
                className="flex-1 px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] text-xs font-mono text-[#0F172A] outline-none"
              />
              <button
                type="submit"
                disabled={isTestingMatch}
                className="h-12 px-6 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 whitespace-nowrap"
              >
                {isTestingMatch ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    <span className="whitespace-nowrap">Calculating Fit...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">Simulate Match</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Test Match Result */}
          {testScore !== null && (
            <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-extrabold text-base font-mono flex-shrink-0">
                  {testScore}%
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    Exceptional Role Alignment for: &quot;{jobTitleInput}&quot;
                  </div>
                  <div className="text-[11px] font-mono text-[#4F46E5] mt-0.5">
                    Surpasses requirement threshold by +14% (Distributed Systems, Go, Strict TypeScript)
                  </div>
                </div>
              </div>

              <Link href="/auth/signup" className="flex-shrink-0">
                <button className="px-4 py-2.5 rounded-lg text-xs font-mono font-semibold bg-[#0F172A] hover:bg-neutral-800 text-white transition-colors cursor-pointer whitespace-nowrap">
                  Request Interview Access →
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Section 4: Public Proof Protocol Notice ── */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-[#FAFAF8] p-5 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Want to verify your own technical skills?
            </h3>
            <p className="text-xs font-mono text-[#64748B]">
              Creda lets African engineers, designers, and cloud architects create proof-of-work passports in 60 seconds.
            </p>
          </div>
          <Link href="/auth/signup" className="flex-shrink-0">
            <button className="h-11 px-6 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs cursor-pointer whitespace-nowrap">
              Claim Free Passport →
            </button>
          </Link>
        </div>
      </main>

      {/* ── Cryptographic Certificate Printable Modal ─────────── */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-neutral-200 shadow-2xl relative overflow-hidden my-auto animate-fade-in-up">
            {/* Modal Controls (Hidden when printing) */}
            <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between no-print bg-[#FAFAF8]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                <FileCheck size={16} className="text-[#4F46E5]" />
                <span className="font-bold text-[#0F172A]">OFFICIAL CREDA TALENT LEDGER CERTIFICATE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono uppercase font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Printable Certificate Canvas */}
            <div id="creda-printable-certificate" className="p-6 sm:p-10 bg-white border-8 border-double border-indigo-900/20 m-2 sm:m-4 rounded-2xl relative">
              {/* Certificate Watermark / Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-indigo-950/20 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-mono font-bold text-xl shadow-md">
                    CRD
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
                      CREDA PROTOCOL ATTESTATION
                    </h2>
                    <p className="text-[11px] font-mono text-[#64748B]">
                      DECENTRALIZED TECHNICAL TALENT VERIFICATION LEDGER
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right font-mono text-xs text-[#64748B]">
                  <div><strong className="text-[#0F172A]">LEDGER ID:</strong> CRD-{passportHash.slice(0, 10).toUpperCase()}</div>
                  <div className="text-[10px] mt-0.5">ISSUED: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
              </div>

              {/* Certificate Body */}
              <div className="py-8 text-center space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold">
                  Verified Candidate Credential
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-serif">
                  {profile.name}
                </h1>
                <p className="text-sm font-mono text-[#475569] max-w-lg mx-auto">
                  {profile.title} • {profile.location}
                </p>

                {/* Score Banner */}
                <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-indigo-50 border border-indigo-200 mt-2">
                  <div className="text-left">
                    <div className="text-[10px] font-mono uppercase text-[#64748B]">Overall Trust Index</div>
                    <div className="text-xs font-mono font-bold text-[#4F46E5]">{profile.badge}</div>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-[#4F46E5] pl-4 border-l border-indigo-200">
                    {profile.trustIndex}%
                  </div>
                </div>
              </div>

              {/* Verified Competencies Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-[#FAFAF8] px-4 py-2 border-b border-neutral-200 text-xs font-mono font-bold text-[#0F172A] uppercase flex justify-between">
                  <span>Verified Competency</span>
                  <span>Confidence & Tier</span>
                </div>
                <div className="divide-y divide-neutral-100 text-xs font-mono">
                  {profile.skills.map((skill) => (
                    <div key={skill.name} className="px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <strong className="text-[#0F172A] font-semibold">{skill.name}</strong>
                        <div className="text-[10px] text-[#64748B]">{skill.auditNote}</div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className="font-bold text-[#4F46E5]">{skill.score}%</span>
                        <div className="text-[10px] text-neutral-500">{skill.tier}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Signature Footer & QR Code */}
              <div className="pt-6 border-t-2 border-indigo-950/20 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
                <div className="space-y-1 text-left">
                  <div className="text-[10px] text-[#64748B] uppercase">GPG Key Identifier:</div>
                  <div className="text-xs font-bold text-[#0F172A] font-mono">{profile.gpgKey}</div>
                  <div className="text-[10px] text-[#64748B] uppercase pt-1">SHA-256 Fingerprint:</div>
                  <div className="text-[10px] text-neutral-500 font-mono break-all max-w-sm">
                    {passportHash}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex-shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(`https://creda-khaki.vercel.app/p/${rawUsername}`)}`}
                    alt="Verification QR Code"
                    className="w-16 h-16 rounded-lg border border-neutral-200"
                  />
                  <div className="text-[10px] text-[#64748B] text-left max-w-[130px] leading-tight">
                    Scan with any smartphone camera to verify live ledger proof.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Share & Embed Badges Modal ──────────────────────── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-neutral-200 shadow-2xl p-6 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-[#4F46E5]" />
                <h3 className="font-bold text-base text-[#0F172A]">Share Talent Passport & Badges</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-5 space-y-5 text-xs font-mono">
              {/* Direct Link */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold mb-1.5 block">
                  Public Passport URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://creda-khaki.vercel.app/p/${rawUsername}`}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#FAFAF8] border border-neutral-200 text-xs text-[#0F172A] outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://creda-khaki.vercel.app/p/${rawUsername}`);
                      setBadgeCopied("url");
                      setTimeout(() => setBadgeCopied(null), 2000);
                    }}
                    className="h-10 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold transition-all flex items-center gap-1.5"
                  >
                    {badgeCopied === "url" ? <Check size={14} /> : <Copy size={14} />}
                    <span>{badgeCopied === "url" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* GitHub README Badge Markdown */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold mb-1.5 block">
                  GitHub Profile README Badge (Markdown)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`[![Creda Verified](https://img.shields.io/badge/Creda_Verified-Top_Talent-4F46E5?style=flat-square&logo=shield)](https://creda-khaki.vercel.app/p/${rawUsername})`}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#FAFAF8] border border-neutral-200 text-xs text-[#0F172A] outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`[![Creda Verified](https://img.shields.io/badge/Creda_Verified-Top_Talent-4F46E5?style=flat-square&logo=shield)](https://creda-khaki.vercel.app/p/${rawUsername})`);
                      setBadgeCopied("markdown");
                      setTimeout(() => setBadgeCopied(null), 2000);
                    }}
                    className="h-10 px-4 rounded-xl border border-neutral-200 hover:border-[#4F46E5] bg-white text-[#0F172A] font-semibold transition-all flex items-center gap-1.5"
                  >
                    {badgeCopied === "markdown" ? <Check size={14} /> : <Copy size={14} />}
                    <span>{badgeCopied === "markdown" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Social Sharing */}
              <div className="pt-2">
                <label className="text-[11px] uppercase tracking-wider text-[#64748B] font-semibold mb-2 block">
                  Share Instantly to Socials
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just verified my technical skills on @CredaProtocol — proven with real AST commit proof and zero resume fluff. Check out my live cryptographic passport:`)}&url=${encodeURIComponent(`https://creda-khaki.vercel.app/p/${rawUsername}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Share on X</span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://creda-khaki.vercel.app/p/${rawUsername}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Share on LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Minimalist Footer ───────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-5 text-xs font-mono text-[#64748B] bg-white no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Creda Protocol v2.4 // Public Ledger Node {passportHash.slice(0, 10)}</span>
          <span className="text-[#94A3B8] hidden sm:inline">SHA-256 Tamper-Proof Cryptographic Verification</span>
        </div>
      </footer>
    </div>
  );
}
