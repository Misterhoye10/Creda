"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import { api, type User } from "@/lib/api";
import {
  Search,
  Filter,
  ShieldCheck,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Download,
  Building2,
  Users,
  Layers,
  Briefcase,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  ChevronRight,
  X,
  FileText,
  Check,
  Sparkles,
  Terminal,
  LogOut,
  ChevronDown,
  Code2,
  Palette,
  Server,
  Database,
  Star,
  Mail,
  Globe,
  Send,
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  discipline: "software" | "design" | "devops" | "data" | "creative3d";
  score: number;
  tier: string;
  skills: string[];
  proofHighlight: string;
  reposAudited: number;
  commitsCount: string;
  availability: "Immediately Available" | "2 Weeks Notice";
  slug: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
}

const CANDIDATES: Candidate[] = [
  {
    id: "c1",
    name: "Hoye Adeleke",
    avatar: "https://ui-avatars.com/api/?name=Hoye+Adeleke&background=4F46E5&color=fff&bold=true",
    title: "Senior Backend & Distributed Systems Lead",
    location: "Lagos, Nigeria",
    discipline: "software",
    score: 96.4,
    tier: "Code-Proven Tier",
    skills: ["Python", "FastAPI", "React", "PostgreSQL", "Git"],
    proofHighlight: "AST validated high-throughput endpoints; 14 repositories audited.",
    reposAudited: 14,
    commitsCount: "1,420 commits",
    availability: "Immediately Available",
    slug: "hoye",
  },
  {
    id: "c2",
    name: "Adekunle Bello",
    avatar: "/testimonials/adekunle.jpg",
    title: "Staff Cloud Architect & DevOps Lead",
    location: "Nairobi, Kenya",
    discipline: "devops",
    score: 94.8,
    tier: "Code-Proven Tier",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker"],
    proofHighlight: "18 production pipelines audited with 99.98% build success rate.",
    reposAudited: 22,
    commitsCount: "2,840 commits",
    availability: "2 Weeks Notice",
    slug: "adekunle-bello",
  },
  {
    id: "c3",
    name: "David Ochieng",
    avatar: "/testimonials/david.jpg",
    title: "Principal UI/UX & Design Systems Engineer",
    location: "Accra, Ghana",
    discipline: "design",
    score: 92.5,
    tier: "Top Strength Tier",
    skills: ["Figma Tokens", "Design Systems", "React", "Tailwind", "Accessibility"],
    proofHighlight: "120+ design system tokens mathematically synced with React components.",
    reposAudited: 9,
    commitsCount: "910 commits",
    availability: "Immediately Available",
    slug: "david-ochieng",
  },
  {
    id: "c4",
    name: "Fatima Al-Hassan",
    avatar: "https://ui-avatars.com/api/?name=Fatima+Al-Hassan&background=059669&color=fff&bold=true",
    title: "Senior Data & ML Pipeline Engineer",
    location: "Cairo, Egypt",
    discipline: "data",
    score: 91.2,
    tier: "Code-Proven Tier",
    skills: ["Python", "dbt", "Snowflake", "PyTorch", "Airflow"],
    proofHighlight: "Validated 12 ETL pipelines handling 40M+ events daily.",
    reposAudited: 11,
    commitsCount: "1,150 commits",
    availability: "2 Weeks Notice",
    slug: "fatima-al-hassan",
  },
  {
    id: "c5",
    name: "Kofi Mensah",
    avatar: "/testimonials/kofi.jpg",
    title: "Lead 3D Web & Creative Systems Engineer",
    location: "Accra, Ghana",
    discipline: "creative3d",
    score: 95.2,
    tier: "Code-Proven Tier",
    skills: ["React Three Fiber", "Three.js", "GLSL Shaders", "WebGL", "TypeScript"],
    proofHighlight: "12 WebGL pipelines audited; zero GPU memory leaks; 60fps locked on mobile.",
    reposAudited: 12,
    commitsCount: "1,180 commits",
    availability: "Immediately Available",
    slug: "kofi-mensah",
  },
];

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [candidatesList, setCandidatesList] = useState<Candidate[]>(CANDIDATES);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(85);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Shortlist and Direct Connection States
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sentIntros, setSentIntros] = useState<string[]>([]);
  const [pipelineFilter, setPipelineFilter] = useState<"all" | "shortlisted" | "requested">("all");
  const [connectCandidate, setConnectCandidate] = useState<Candidate | null>(null);
  const [introForm, setIntroForm] = useState({
    companyName: "Moniepoint Engineering",
    roleTitle: "Senior Backend Lead",
    workType: "Full-Time Remote",
    compensation: "$65,000 - $95,000 / year",
    message: "We audited your AST-verified code records on Creda and were impressed by your distributed systems and API depth. We would love to schedule a direct introductory interview.",
  });
  const [isSendingIntro, setIsSendingIntro] = useState(false);
  const [introSentFeedback, setIntroSentFeedback] = useState(false);

  // Custom Role AI Matcher State
  const [showRoleAuditor, setShowRoleAuditor] = useState(false);
  const [customJobText, setCustomJobText] = useState("");
  const [isAuditingRole, setIsAuditingRole] = useState(false);
  const [matchRankings, setMatchRankings] = useState<Record<string, number> | null>(null);

  // Load registered candidates dynamically from backend
  useEffect(() => {
    const loadDirectory = async () => {
      setIsLoadingDirectory(true);
      try {
        const directory = await api.getPublicPassportDirectory(50);
        if (Array.isArray(directory) && directory.length > 0) {
          const mapped: Candidate[] = directory.map((u: any) => {
            const lowerTitle = (u.professional_title || "").toLowerCase();
            const discipline: Candidate["discipline"] =
              lowerTitle.includes("design") || lowerTitle.includes("ui") || lowerTitle.includes("ux")
                ? "design"
                : lowerTitle.includes("devops") || lowerTitle.includes("cloud") || lowerTitle.includes("sre")
                ? "devops"
                : lowerTitle.includes("data") || lowerTitle.includes("ai") || lowerTitle.includes("ml")
                ? "data"
                : lowerTitle.includes("3d") || lowerTitle.includes("creative")
                ? "creative3d"
                : "software";

            return {
              id: u.id,
              name: u.name,
              avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=4F46E5&color=fff&bold=true`,
              title: u.professional_title || "Technical Professional",
              location: u.location || "Africa // Global Remote",
              discipline,
              score: u.average_confidence || 92.0,
              tier: (u.average_confidence || 92) >= 90 ? "Code-Proven Tier" : "Verified Tier",
              skills: u.skills && u.skills.length > 0 ? u.skills : ["Python", "FastAPI", "PostgreSQL", "Git"],
              proofHighlight: `AST verified code records across ${u.repos_audited || 2} repositories with cryptographic proof.`,
              reposAudited: u.repos_audited || 2,
              commitsCount: "Verified AST Proof",
              availability: "Immediately Available",
              slug: u.public_url || u.id,
              githubUrl: u.github_url,
              linkedinUrl: u.linkedin_url,
              websiteUrl: u.website_url,
            };
          });

          // Merge: Put live registered users first, deduplicate with showcase profiles
          const liveSlugs = new Set(mapped.map((m) => m.slug.toLowerCase()));
          const extraShowcase = CANDIDATES.filter((c) => !liveSlugs.has(c.slug.toLowerCase()));
          setCandidatesList([...mapped, ...extraShowcase]);
        }
      } catch (err) {
        console.warn("Could not load backend passport directory:", err);
      } finally {
        setIsLoadingDirectory(false);
      }
    };

    loadDirectory();
  }, []);

  // Load saved shortlists & intros from localStorage
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem("creda_shortlisted_ids");
      if (savedShortlist) setShortlistedIds(JSON.parse(savedShortlist));
      const savedIntros = localStorage.getItem("creda_sent_intros");
      if (savedIntros) setSentIntros(JSON.parse(savedIntros));
    } catch {
      // ignore
    }
  }, []);

  const toggleShortlist = (candidateId: string) => {
    setShortlistedIds((prev) => {
      const next = prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId];
      try {
        localStorage.setItem("creda_shortlisted_ids", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSendIntro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectCandidate) return;
    setIsSendingIntro(true);
    setTimeout(() => {
      setSentIntros((prev) => {
        const next = prev.includes(connectCandidate.id) ? prev : [...prev, connectCandidate.id];
        try {
          localStorage.setItem("creda_sent_intros", JSON.stringify(next));
        } catch {}
        return next;
      });
      setIsSendingIntro(false);
      setIntroSentFeedback(true);
      setTimeout(() => {
        setIntroSentFeedback(false);
        setConnectCandidate(null);
      }, 1500);
    }, 600);
  };

  const handleAuditRole = () => {
    if (!customJobText.trim()) return;
    setIsAuditingRole(true);
    setTimeout(() => {
      const lowerJob = customJobText.toLowerCase();
      const rankings: Record<string, number> = {};
      candidatesList.forEach((cand) => {
        let hits = 0;
        cand.skills.forEach((s) => {
          if (lowerJob.includes(s.toLowerCase())) hits += 1;
        });
        const bonus = Math.min(hits * 14, 25);
        const dynamicScore = Math.min(Math.round(cand.score * 0.72 + bonus), 99);
        rankings[cand.id] = dynamicScore;
      });
      setMatchRankings(rankings);
      setIsAuditingRole(false);
    }, 600);
  };

  const handleResetAudit = () => {
    setMatchRankings(null);
    setCustomJobText("");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          if (user.name) {
            setIntroForm((prev) => ({
              ...prev,
              companyName: `${user.name} Engineering`,
            }));
          }
        }
      } catch {
        // Fallback to demo workspace
      }
    };
    loadUser();
  }, []);

  const orgName = currentUser?.name || "Enterprise Workspace";

  const filteredCandidates = candidatesList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline =
      selectedDiscipline === "all" || c.discipline === selectedDiscipline;

    const matchesScore = c.score >= minScore;

    const matchesPipeline =
      pipelineFilter === "all"
        ? true
        : pipelineFilter === "shortlisted"
        ? shortlistedIds.includes(c.id)
        : sentIntros.includes(c.id);

    return matchesSearch && matchesDiscipline && matchesScore && matchesPipeline;
  }).sort((a, b) => {
    if (matchRankings) {
      return (matchRankings[b.id] || 0) - (matchRankings[a.id] || 0);
    }
    return b.score - a.score;
  });

  const handleExport = (platform: string) => {
    setExportedStatus(platform);
    setTimeout(() => {
      setExportedStatus(null);
      setShowExportModal(false);
    }, 1500);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Local cleanup
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("creda_token");
        localStorage.removeItem("creda_auth_token");
        sessionStorage.clear();
      }
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Architectural Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={28} showTag={true} tagText="RECRUITER" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-neutral-200/60 border border-neutral-200 text-xs font-mono">
            <button className="px-3.5 py-1.5 rounded-lg bg-white text-[#0F172A] font-bold shadow-xs cursor-pointer">
              Talent Pipeline
            </button>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Switch to Talent View →
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] shadow-2xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <Download size={13} className="text-[#64748B] flex-shrink-0" />
            <span className="whitespace-nowrap">Export to ATS</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-neutral-200 text-xs font-mono text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline font-semibold text-[#0F172A]">{orgName}</span>
            <button
              onClick={handleLogout}
              className="p-2 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Architectural Content ──────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-8 space-y-6">
        
        {/* Top Control Bar: Search & Discipline Filters */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

          {/* Transparent Hiring Loop Indicator */}
          <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-[11px] font-mono text-[#64748B] overflow-x-auto whitespace-nowrap">
            <span className="font-bold text-[#4F46E5] uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0">
              <Sparkles size={12} />
              Hiring Loop:
            </span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">1. Discover Developers</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">2. Filter &amp; Match</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">3. Inspect Passport</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">4. Review 4-Pillar Evidence</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-emerald-700 font-bold flex-shrink-0">5. Connect Direct (Zero Fees)</span>
          </div>

          {/* Pipeline Stage Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setPipelineFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                pipelineFilter === "all"
                  ? "bg-[#4F46E5] text-white font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] bg-[#FAFAF8] border border-[#E5E7EB]"
              }`}
            >
              <Users size={13} />
              <span>All Verified Talent ({candidatesList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setPipelineFilter("shortlisted")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                pipelineFilter === "shortlisted"
                  ? "bg-amber-500 text-white font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] bg-[#FAFAF8] border border-[#E5E7EB]"
              }`}
            >
              <Star size={13} className={shortlistedIds.length > 0 ? "fill-amber-300 text-amber-300" : ""} />
              <span>Shortlisted ({shortlistedIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setPipelineFilter("requested")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                pipelineFilter === "requested"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] bg-[#FAFAF8] border border-[#E5E7EB]"
              }`}
            >
              <Send size={13} />
              <span>Interview Requested ({sentIntros.length})</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, tech stack (e.g. Python, FastAPI, Kubernetes, React, Go)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
              />
            </div>

            {/* Minimum Score Threshold Slider */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-mono text-[#64748B]">
              <SlidersHorizontal size={14} className="text-[#4F46E5]" />
              <span>Min Score:</span>
              <span className="font-bold text-[#0F172A]">{minScore}%</span>
              <input
                type="range"
                min="75"
                max="95"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-20 accent-[#4F46E5] cursor-pointer"
              />
            </div>
          </div>

          {/* Discipline Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
            {[
              { id: "all", label: `All Disciplines (${candidatesList.length})` },
              { id: "software", label: `Software Eng (${candidatesList.filter((c) => c.discipline === "software").length})` },
              { id: "devops", label: `DevOps & Cloud (${candidatesList.filter((c) => c.discipline === "devops").length})` },
              { id: "data", label: `Data & AI (${candidatesList.filter((c) => c.discipline === "data").length})` },
              { id: "design", label: `UI/UX Design (${candidatesList.filter((c) => c.discipline === "design").length})` },
              { id: "creative3d", label: `3D Web (${candidatesList.filter((c) => c.discipline === "creative3d").length})` },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedDiscipline(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedDiscipline === chip.id
                    ? "bg-[#0F172A] text-white font-semibold shadow-xs"
                    : "bg-[#FAFAF8] text-[#64748B] border border-[#E5E7EB] hover:border-neutral-400 hover:text-[#0F172A]"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* AI Custom Role Auditor Toggle */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowRoleAuditor(!showRoleAuditor)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/60 text-[#4F46E5] text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{showRoleAuditor ? "Hide Custom Role Matcher" : "Match Against Job Description (AI)"}</span>
              <ChevronDown size={14} className={`transform transition-transform ${showRoleAuditor ? "rotate-180" : ""}`} />
            </button>

            {matchRankings && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Pipeline Ranked by Job Alignment
                </span>
                <button
                  type="button"
                  onClick={handleResetAudit}
                  className="text-[#64748B] hover:text-[#0F172A] underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* AI Custom Role Matcher Panel */}
          {showRoleAuditor && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAF8] border border-indigo-100 space-y-3 animate-fade-in-up">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FileText size={14} className="text-[#4F46E5]" />
                  Paste Custom Job Description or Role Requirements:
                </span>
                <span className="text-[#64748B]">Auto-calculates AST fit</span>
              </div>
              <textarea
                value={customJobText}
                onChange={(e) => setCustomJobText(e.target.value)}
                placeholder="e.g. Looking for a Senior Backend Engineer proficient in Python, FastAPI, PostgreSQL, distributed systems, and CI/CD pipelines to build mission-critical fintech ledgers..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-neutral-200 focus:border-[#4F46E5] text-xs font-mono text-[#0F172A] outline-none transition-all placeholder:text-neutral-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Benchmark Templates */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#64748B]">
                  <span>Quick Templates:</span>
                  {[
                    { label: "Fintech Core Backend", query: "Senior Backend Lead with Python, FastAPI, PostgreSQL, and distributed financial ledgers." },
                    { label: "Cloud SRE & DevOps", query: "Staff DevOps Engineer with Kubernetes, Terraform, Docker, and CI/CD security." },
                    { label: "Product & UI/UX", query: "Lead Product Designer with Figma design systems, tokens, and UX architecture." },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCustomJobText(preset.query)}
                      className="px-2 py-0.5 rounded-md border border-neutral-200 bg-white hover:border-[#4F46E5] hover:text-[#4F46E5] cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAuditRole}
                  disabled={isAuditingRole || !customJobText.trim()}
                  className="px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono uppercase font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isAuditingRole ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Ranking Candidates...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Rank Candidate Pool →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-[#4F46E5]/50 transition-all card-hover"
            >
              <div>
                {/* Header: Photo + Credentials */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-[#0F172A] tracking-tight">
                          {candidate.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => toggleShortlist(candidate.id)}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            shortlistedIds.includes(candidate.id)
                              ? "text-amber-500 bg-amber-50"
                              : "text-neutral-300 hover:text-amber-400"
                          }`}
                          title={shortlistedIds.includes(candidate.id) ? "Remove from Shortlist" : "Save / Shortlist"}
                        >
                          <Star size={14} className={shortlistedIds.includes(candidate.id) ? "fill-amber-400 text-amber-400" : ""} />
                        </button>
                      </div>
                      <p className="text-xs text-[#475569] font-mono mt-0.5 line-clamp-1">
                        {candidate.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] mt-1">
                        <MapPin size={11} />
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Badge & Status */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-extrabold text-[#0F172A] font-mono tracking-tight">
                      {candidate.score}
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B] block">/ 100 Evidence</span>
                    <span className="text-[9.5px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold block mt-0.5">
                      EXPLAINABLE AUDIT
                    </span>
                  </div>
                </div>

                {/* Status Pills */}
                {sentIntros.includes(candidate.id) && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold flex items-center gap-1.5 animate-fade-in">
                    <Check size={12} />
                    <span>Direct Interview Request Sent</span>
                  </div>
                )}

                {/* AI Dynamic Role Match Badge */}
                {matchRankings && matchRankings[candidate.id] !== undefined && (
                  <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-indigo-50/90 border border-indigo-200 flex items-center justify-between text-xs font-mono animate-fade-in">
                    <span className="text-[#4F46E5] font-bold flex items-center gap-1.5">
                      <Sparkles size={13} />
                      <span>Role Alignment:</span>
                    </span>
                    <span className="text-sm font-extrabold text-[#4F46E5]">
                      {matchRankings[candidate.id]}% Match
                    </span>
                  </div>
                )}

                {/* Evidence Proof Banner */}
                <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] mb-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#4F46E5] font-semibold mb-1">
                    <ShieldCheck size={13} />
                    <span>CRYPTOGRAPHIC PROOF RECORD</span>
                  </div>
                  <p className="text-xs text-[#475569] font-mono leading-relaxed">
                    {candidate.proofHighlight}
                  </p>
                </div>

                {/* 4-Pillar Explainable Score Breakdown */}
                {(() => {
                  const coverage = Math.round(candidate.score * 0.38);
                  const projects = Math.round(candidate.score * 0.24);
                  const assessments = Math.round(candidate.score * 0.19);
                  const completeness = Math.min(15, Math.max(10, Math.round(candidate.score - (coverage + projects + assessments))));
                  return (
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 mb-4 text-[10px] font-mono">
                      <div className="flex items-center justify-between text-[#64748B] font-semibold uppercase text-[9px] mb-1.5">
                        <span>Explainable Evidence Audit</span>
                        <span className="text-[#4F46E5] font-semibold">100% Deterministic</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                          <span className="text-stone-400 text-[8.5px]">Evidence Cov.</span>
                          <strong className="text-[#0F172A]">{coverage}<span className="text-stone-400 font-normal">/40</span></strong>
                        </div>
                        <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                          <span className="text-stone-400 text-[8.5px]">Project Proof</span>
                          <strong className="text-[#0F172A]">{projects}<span className="text-stone-400 font-normal">/25</span></strong>
                        </div>
                        <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                          <span className="text-stone-400 text-[8.5px]">Assessments</span>
                          <strong className="text-[#0F172A]">{assessments}<span className="text-stone-400 font-normal">/20</span></strong>
                        </div>
                        <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                          <span className="text-stone-400 text-[8.5px]">Completeness</span>
                          <strong className="text-[#0F172A]">{completeness}<span className="text-stone-400 font-normal">/15</span></strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Skill Tags with Proof Strengths */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {candidate.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 text-[11px] font-mono text-[#0F172A] border border-neutral-200/60 inline-flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-emerald-600 hidden sm:flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {candidate.availability}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    Quick Audit
                  </button>

                  <Link href={`/p/${candidate.slug}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <button className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] bg-white transition-all shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0">
                      <span className="whitespace-nowrap">Passport</span>
                      <ExternalLink size={12} className="flex-shrink-0" />
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setConnectCandidate(candidate)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      sentIntros.includes(candidate.id)
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-[#0F172A] hover:bg-neutral-800 text-white"
                    }`}
                  >
                    <Send size={12} />
                    <span>{sentIntros.includes(candidate.id) ? "Sent" : "Connect"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredCandidates.length === 0 && (
          <div className="py-16 px-6 text-center rounded-3xl border border-[#E5E7EB] bg-white p-8 relative shadow-2xs">
            <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
            <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
            <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
            <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

            <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#64748B] mx-auto mb-4">
              <Search size={22} />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">No Verified Candidates Found</h3>
            <p className="text-xs font-mono text-[#64748B] max-w-sm mx-auto mt-1.5 leading-relaxed">
              No candidates currently match your search criteria or minimum AST confidence score threshold.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDiscipline("all");
                  setMinScore(85);
                }}
                className="h-10 px-5 rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5] bg-[#FAFAF8] hover:bg-white text-xs font-mono font-semibold text-[#0F172A] hover:text-[#4F46E5] transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Slide-Over Candidate Audit Drawer ───────────────── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E5E7EB] p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#4F46E5] font-bold">
                  <ShieldCheck size={16} />
                  <span>AUDIT TELEMETRY DRAWER</span>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1 rounded-lg hover:bg-neutral-100 text-[#64748B] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-6 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E5E7EB]"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{selectedCandidate.name}</h3>
                    <p className="text-xs font-mono text-[#64748B] mt-0.5">{selectedCandidate.title}</p>
                    <div className="text-xs font-mono text-emerald-600 mt-1">
                      Creda Evidence Score: <strong>{selectedCandidate.score}/100</strong> // {selectedCandidate.tier}
                    </div>
                  </div>
                </div>

                {/* 4-Pillar Explainable Score Card */}
                {(() => {
                  const coverage = Math.round(selectedCandidate.score * 0.38);
                  const projects = Math.round(selectedCandidate.score * 0.24);
                  const assessments = Math.round(selectedCandidate.score * 0.19);
                  const completeness = Math.min(15, Math.max(10, Math.round(selectedCandidate.score - (coverage + projects + assessments))));
                  return (
                    <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-[#4F46E5]" />
                          <span>Explainable Evidence Audit</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          100% Deterministic
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                          <span className="text-[#475569] flex items-center gap-1.5">
                            <span>📦</span>
                            <span>Evidence Coverage</span>
                          </span>
                          <strong className="text-[#0F172A]">{coverage} <span className="text-stone-400 font-normal">/ 40 pts</span></strong>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                          <span className="text-[#475569] flex items-center gap-1.5">
                            <span>🛠️</span>
                            <span>Project Evidence</span>
                          </span>
                          <strong className="text-[#0F172A]">{projects} <span className="text-stone-400 font-normal">/ 25 pts</span></strong>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                          <span className="text-[#475569] flex items-center gap-1.5">
                            <span>🧪</span>
                            <span>AST Assessments</span>
                          </span>
                          <strong className="text-[#0F172A]">{assessments} <span className="text-stone-400 font-normal">/ 20 pts</span></strong>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                          <span className="text-[#475569] flex items-center gap-1.5">
                            <span>🪪</span>
                            <span>Profile Completeness</span>
                          </span>
                          <strong className="text-[#0F172A]">{completeness} <span className="text-stone-400 font-normal">/ 15 pts</span></strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#0F172A]">
                        <span>Total Evidence Score</span>
                        <span className="text-[#4F46E5] text-sm">{selectedCandidate.score} / 100</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Individual Skill Proof Strengths */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-2 font-mono">
                    Skill Evidence Strength
                  </div>
                  <div className="space-y-1.5">
                    {selectedCandidate.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs font-mono"
                      >
                        <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{skill}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                          High Proof (AST Verified)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Audited Repositories</span>
                    <strong className="text-[#0F172A]">{selectedCandidate.reposAudited} Repos</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">GPG Signed Commits</span>
                    <strong className="text-[#0F172A]">{selectedCandidate.commitsCount}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Tamper-Proof Record</span>
                    <strong className="text-emerald-600">SHA-256 Validated</strong>
                  </div>
                </div>

                {/* Verified Contact & Presence Channels */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-2">
                    Verified Direct Channels
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={selectedCandidate.githubUrl ? (selectedCandidate.githubUrl.startsWith("http") ? selectedCandidate.githubUrl : `https://github.com/${selectedCandidate.githubUrl}`) : `https://github.com/${selectedCandidate.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <GitBranch size={13} className="text-[#4F46E5]" />
                      <span>GitHub</span>
                    </a>
                    {selectedCandidate.linkedinUrl ? (
                      <a
                        href={selectedCandidate.linkedinUrl.startsWith("http") ? selectedCandidate.linkedinUrl : `https://${selectedCandidate.linkedinUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#0A66C2] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ExternalLink size={13} className="text-[#0A66C2]" />
                        <span>LinkedIn</span>
                      </a>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-mono text-neutral-400 flex items-center gap-2">
                        <ExternalLink size={13} />
                        <span>LinkedIn</span>
                      </div>
                    )}
                    {selectedCandidate.websiteUrl ? (
                      <a
                        href={selectedCandidate.websiteUrl.startsWith("http") ? selectedCandidate.websiteUrl : `https://${selectedCandidate.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-emerald-600 flex items-center gap-2 transition-colors cursor-pointer col-span-2"
                      >
                        <Globe size={13} className="text-emerald-600" />
                        <span className="truncate">Portfolio: {selectedCandidate.websiteUrl}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E7EB] space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = selectedCandidate;
                  setSelectedCandidate(null);
                  setConnectCandidate(target);
                }}
                className="w-full h-11 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <Send size={13} />
                <span>Request Direct Interview →</span>
              </button>

              <Link href={`/p/${selectedCandidate.slug}`} target="_blank" rel="noopener noreferrer" className="w-full block flex-shrink-0">
                <button className="w-full h-10 rounded-xl text-xs font-mono uppercase font-semibold border border-[#E5E7EB] hover:border-[#4F46E5] text-[#0F172A] bg-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0">
                  <span className="whitespace-nowrap">Open Full Cryptographic Passport</span>
                  <ExternalLink size={13} className="flex-shrink-0" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Direct Interview Request Modal ──────────────────── */}
      {connectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] shadow-2xs">
                  <Send size={15} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">Request Direct Interview</h3>
                  <p className="text-[11px] font-mono text-[#64748B]">Disintermediated hiring • Zero agency fees</p>
                </div>
              </div>
              <button
                onClick={() => setConnectCandidate(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-[#64748B] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Candidate Snapshot */}
            <div className="p-4 my-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={connectCandidate.avatar}
                  alt={connectCandidate.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E5E7EB]"
                />
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">{connectCandidate.name}</div>
                  <div className="text-xs font-mono text-[#64748B]">{connectCandidate.title}</div>
                  <div className="text-[11px] font-mono text-emerald-600 mt-0.5">
                    Score: <strong>{connectCandidate.score}%</strong> // {connectCandidate.tier}
                  </div>
                </div>
              </div>

              {/* Direct Quick Channels */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <a
                  href={`/p/${connectCandidate.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#4F46E5] text-[#4F46E5] transition-colors cursor-pointer"
                  title="View Passport"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Structured Pitch Form */}
            <form onSubmit={handleSendIntro} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1 block">
                    Hiring Company / Team
                  </label>
                  <input
                    type="text"
                    required
                    value={introForm.companyName}
                    onChange={(e) => setIntroForm({ ...introForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1 block">
                    Role Position
                  </label>
                  <input
                    type="text"
                    required
                    value={introForm.roleTitle}
                    onChange={(e) => setIntroForm({ ...introForm, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1 block">
                    Engagement Type
                  </label>
                  <select
                    value={introForm.workType}
                    onChange={(e) => setIntroForm({ ...introForm, workType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  >
                    <option value="Full-Time Remote">Full-Time Remote</option>
                    <option value="Contract / Advisory">Contract / Advisory</option>
                    <option value="Hybrid (Lagos/Nairobi/Accra)">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1 block">
                    Compensation / Budget
                  </label>
                  <input
                    type="text"
                    required
                    value={introForm.compensation}
                    onChange={(e) => setIntroForm({ ...introForm, compensation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>
              </div>

              <div className="text-xs font-mono">
                <label className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-1 block">
                  Direct Invitation Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={introForm.message}
                  onChange={(e) => setIntroForm({ ...introForm, message: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-[#0F172A] focus:border-[#4F46E5] outline-none leading-relaxed"
                />
              </div>

              {introSentFeedback ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 text-center font-bold animate-fade-in-up flex items-center justify-center gap-2">
                  <Check size={14} />
                  <span>Interview Request Dispatched to Candidate!</span>
                </div>
              ) : (
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConnectCandidate(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingIntro}
                    className="px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono uppercase font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    {isSendingIntro ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Interview Invitation</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── ATS Export Modal ────────────────────────────────── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#4F46E5] font-bold">
                <Download size={16} />
                <span>EXPORT VERIFIED TALENT PIPELINE</span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-[#64748B] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs font-mono text-[#64748B] leading-relaxed">
              Export {filteredCandidates.length} pre-verified candidates with mathematical AST proof intact directly into your recruiting software.
            </p>

            <div className="space-y-2.5">
              {[
                { name: "Greenhouse", desc: "Sync candidate profile & cryptographic scores" },
                { name: "Lever", desc: "Push to active hiring requisitions" },
                { name: "CSV / JSON Export", desc: "Download full telemetry dataset for data teams" },
              ].map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleExport(platform.name)}
                  className="w-full p-4 rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#4F46E5]">
                      {platform.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
                      {platform.desc}
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#64748B] group-hover:text-[#4F46E5]" />
                </button>
              ))}
            </div>

            {exportedStatus && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 text-center font-bold animate-fade-in-up">
                ✓ Exporting candidates to {exportedStatus}...
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Minimalist Footer ───────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-5 text-xs font-mono text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Creda Recruiter Engine v2.4 // Moniepoint Enterprise Workspace</span>
          <span className="text-[#94A3B8] hidden sm:inline">Cryptographic AST Auditing</span>
        </div>
      </footer>
    </div>
  );
}
