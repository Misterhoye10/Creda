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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(90);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch {
        // Fallback to demo workspace
      }
    };
    loadUser();
  }, []);

  const orgName = currentUser?.name || "Enterprise Workspace";

  const filteredCandidates = CANDIDATES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline =
      selectedDiscipline === "all" || c.discipline === selectedDiscipline;

    const matchesScore = c.score >= minScore;

    return matchesSearch && matchesDiscipline && matchesScore;
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
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

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
                placeholder="Search candidates by name, tech stack (e.g. Go, Figma, Kubernetes, Python)..."
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
                min="80"
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
              { id: "all", label: "All Disciplines (5)" },
              { id: "software", label: "Software Engineering (1)" },
              { id: "creative3d", label: "3D & Creative Eng (1)" },
              { id: "design", label: "Product & UI/UX Design (1)" },
              { id: "devops", label: "DevOps & Cloud (1)" },
              { id: "data", label: "Data & AI (1)" },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedDiscipline(chip.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedDiscipline === chip.id
                    ? "bg-[#0F172A] text-white font-semibold shadow-xs"
                    : "bg-[#FAFAF8] text-[#64748B] border border-[#E5E7EB] hover:border-neutral-400 hover:text-[#0F172A]"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
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
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-base text-[#0F172A] tracking-tight">
                        {candidate.name}
                      </h3>
                      <p className="text-xs text-[#475569] font-mono mt-0.5 line-clamp-1">
                        {candidate.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] mt-1">
                        <MapPin size={11} />
                        <span>{candidate.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Badge */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-extrabold text-[#0F172A] font-mono tracking-tight">
                      {candidate.score}%
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold block mt-0.5">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Evidence Proof Banner */}
                <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] mb-5">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#4F46E5] font-semibold mb-1">
                    <ShieldCheck size={13} />
                    <span>CRYPTOGRAPHIC PROOF RECORD</span>
                  </div>
                  <p className="text-xs text-[#475569] font-mono leading-relaxed">
                    {candidate.proofHighlight}
                  </p>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {candidate.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 text-[11px] font-mono text-[#0F172A] border border-neutral-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {candidate.availability}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    Quick Audit
                  </button>

                  <Link href={`/p/${candidate.slug}`} target="_blank" className="flex-shrink-0">
                    <button className="px-3.5 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0">
                      <span className="whitespace-nowrap">Passport</span>
                      <ExternalLink size={12} className="flex-shrink-0" />
                    </button>
                  </Link>
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
                      Score: <strong>{selectedCandidate.score}%</strong> // {selectedCandidate.tier}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Audited Repositories</span>
                    <strong className="text-[#0F172A]">{selectedCandidate.reposAudited} Repos</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">GPG Signed Commits</span>
                    <strong className="text-[#0F172A]">{selectedCandidate.commitsCount}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Tamper-Proof Record</span>
                    <strong className="text-emerald-600">SHA-256 Validated</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E7EB] space-y-3">
              <Link href={`/p/${selectedCandidate.slug}`} target="_blank" className="w-full block flex-shrink-0">
                <button className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0">
                  <span className="whitespace-nowrap">Open Full Public Ledger</span>
                  <ExternalLink size={14} className="flex-shrink-0" />
                </button>
              </Link>
              <button
                onClick={() => handleExport("Greenhouse ATS")}
                className="w-full h-11 rounded-xl text-xs font-mono uppercase font-semibold border border-[#E5E7EB] hover:border-[#4F46E5] text-[#0F172A] bg-white transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                Send to Greenhouse Pipeline →
              </button>
            </div>
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
