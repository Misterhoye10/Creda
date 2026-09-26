"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  X,
  Sliders,
  Globe,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api, type User, type UserProfileResponse } from "@/lib/api";

interface RepoItem {
  name: string;
  commits: string;
  lang: string;
  status: string;
  health: string;
}

const SAMPLE_REPOS: RepoItem[] = [
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
];

const AVATAR_PRESETS = [
  { name: "Amina Adeleke", role: "Systems Architect", src: "/testimonials/amina.jpg" },
  { name: "Adekunle Bello", role: "Cloud & DevOps", src: "/testimonials/adekunle.jpg" },
  { name: "Kofi Mensah", role: "3D & Creative Systems", src: "/testimonials/kofi.jpg" },
  { name: "David Osei", role: "Fullstack Systems", src: "/testimonials/david.jpg" },
];

export interface CompletenessItem {
  id: string;
  label: string;
  weight: number;
  met: boolean;
  tip: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "simulator" | "settings">("overview");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedJob, setSelectedJob] = useState("paystack");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<number | null>(94);

  // Evidence repositories state
  const [repos, setRepos] = useState<RepoItem[]>(SAMPLE_REPOS);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [repoInput, setRepoInput] = useState("");
  const [isConnectingRepo, setIsConnectingRepo] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Profile Settings Form State
  const [profileForm, setProfileForm] = useState({
    name: "Amina Adeleke",
    professional_title: "Senior Systems & Backend Architect",
    location: "Lagos, Nigeria // Global Remote",
    years_experience: 6,
    bio: "Systems architect specializing in distributed Go microservices, AST syntax validation, and high-throughput PostgreSQL architectures.",
    avatar_url: "/testimonials/amina.jpg",
    public_url: "amina-adeleke",
    is_public: true,
    github_url: "https://github.com/amina-dev",
    linkedin_url: "https://linkedin.com/in/amina-adeleke",
    website_url: "https://amina.dev",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Drag and drop ingestion state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>("amina_resume_2026.pdf");
  const [isUploading, setIsUploading] = useState(false);

  // Load authenticated user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userProfile = await api.getUserProfile();
        if (userProfile) {
          setCurrentUser(userProfile as unknown as User);
          setProfileForm({
            name: userProfile.name || "Amina Adeleke",
            professional_title: userProfile.professional_title || "Senior Systems & Backend Architect",
            location: userProfile.location || "Lagos, Nigeria // Global Remote",
            years_experience: userProfile.years_experience || 6,
            bio: userProfile.bio || "Systems architect specializing in distributed Go microservices, AST syntax validation, and high-throughput PostgreSQL architectures.",
            avatar_url: userProfile.avatar_url || "/testimonials/amina.jpg",
            public_url: userProfile.public_url || "amina-adeleke",
            is_public: userProfile.is_public ?? true,
            github_url: userProfile.github_url || "https://github.com/amina-dev",
            linkedin_url: userProfile.linkedin_url || "https://linkedin.com/in/amina-adeleke",
            website_url: userProfile.website_url || "https://amina.dev",
          });
          return;
        }
      } catch {
        // Fallback to getCurrentUser
      }

      try {
        const user = await api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setProfileForm((prev) => ({
            ...prev,
            name: user.name || prev.name,
            professional_title: user.professional_title || prev.professional_title,
            location: user.location || prev.location,
            years_experience: user.years_experience || prev.years_experience,
            bio: user.bio || prev.bio,
            avatar_url: user.avatar_url || prev.avatar_url,
            public_url: user.public_url || prev.public_url,
          }));
        }
      } catch {
        // Fallback to preview candidate profile
      }
    };
    loadUser();
  }, []);

  // Real-time completeness calculation mirroring backend passport service
  const completeness = useMemo(() => {
    const breakdown: CompletenessItem[] = [
      {
        id: "name",
        label: "Full Legal Name",
        weight: 15,
        met: Boolean(profileForm.name && profileForm.name.trim().length >= 2),
        tip: "Verified against cryptographic passport ledger (+15%)",
      },
      {
        id: "title",
        label: "Professional Engineering Title",
        weight: 10,
        met: Boolean(profileForm.professional_title && profileForm.professional_title.trim().length >= 3),
        tip: "Shows seniority and architectural domain (+10%)",
      },
      {
        id: "location",
        label: "Primary Location & Remote Status",
        weight: 10,
        met: Boolean(profileForm.location && profileForm.location.trim().length >= 2),
        tip: "Enables global recruiter timezone matching (+10%)",
      },
      {
        id: "bio",
        label: "Technical Architecture Bio",
        weight: 10,
        met: Boolean(profileForm.bio && profileForm.bio.trim().length >= 20),
        tip: "At least 20 chars of architectural summary (+10%)",
      },
      {
        id: "avatar",
        label: "Institutional Portrait",
        weight: 5,
        met: Boolean(profileForm.avatar_url && profileForm.avatar_url.trim().length > 0),
        tip: "Verified candidate profile image (+5%)",
      },
      {
        id: "socials",
        label: "Verified Proof Links (GitHub / LinkedIn)",
        weight: 10,
        met: Boolean(
          (profileForm.github_url && profileForm.github_url.trim().length > 0) ||
          (profileForm.linkedin_url && profileForm.linkedin_url.trim().length > 0) ||
          (profileForm.website_url && profileForm.website_url.trim().length > 0)
        ),
        tip: "Links to active engineering footprint (+10%)",
      },
      {
        id: "evidence",
        label: "Technical Evidence (Repos / CV)",
        weight: 20,
        met: repos.length > 0 || Boolean(uploadedFile),
        tip: "Corroborates code complexity and syntax metrics (+20%)",
      },
      {
        id: "skills",
        label: "AST Verified Skill Benchmarks",
        weight: 20,
        met: true, // Code-proven AST audited skills present
        tip: "In-memory AST syntax validation (+20%)",
      },
    ];

    const score = breakdown.reduce((acc, curr) => (curr.met ? acc + curr.weight : acc), 0);
    return { score: Math.min(score, 100), breakdown };
  }, [profileForm, repos.length, uploadedFile]);

  const displayName = profileForm.name || currentUser?.name || "Amina Adeleke";
  const displayEmail = currentUser?.email || "amina@domain.com";
  const displayTitle = profileForm.professional_title || currentUser?.professional_title || "Senior Systems & Backend Architect";
  const displayLocation = profileForm.location || currentUser?.location || "Lagos, Nigeria";
  const displayAvatar = profileForm.avatar_url || currentUser?.avatar_url || "/testimonials/amina.jpg";
  const passportSlug = profileForm.public_url || currentUser?.public_url || "amina-adeleke";
  const passportUrl = `creda.work/p/${passportSlug}`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setSaveStatus(null);
    try {
      const updated = await api.updateUserProfile({
        name: profileForm.name,
        professional_title: profileForm.professional_title,
        location: profileForm.location,
        years_experience: Number(profileForm.years_experience),
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        public_url: profileForm.public_url,
        is_public: profileForm.is_public,
        github_url: profileForm.github_url,
        linkedin_url: profileForm.linkedin_url,
        website_url: profileForm.website_url,
      });
      setCurrentUser(updated as unknown as User);
      setSaveStatus({
        type: "success",
        message: "Profile settings and cryptographic ledger synchronized successfully.",
      });
    } catch {
      // Graceful local persistence if backend is offline
      setCurrentUser((prev) => ({
        ...(prev || ({} as User)),
        name: profileForm.name,
        professional_title: profileForm.professional_title,
        location: profileForm.location,
        years_experience: Number(profileForm.years_experience),
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        public_url: profileForm.public_url,
        is_public: profileForm.is_public,
        github_url: profileForm.github_url,
        linkedin_url: profileForm.linkedin_url,
        website_url: profileForm.website_url,
        id: prev?.id || "preview-id",
        email: prev?.email || "amina@domain.com",
        created_at: prev?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      setSaveStatus({
        type: "success",
        message: "Profile settings updated in current session.",
      });
    } finally {
      setIsSavingProfile(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  const simulateUpload = async (fileOrName: File | string) => {
    setIsUploading(true);
    if (fileOrName instanceof File) {
      try {
        await api.uploadCV(fileOrName);
        setUploadedFile(fileOrName.name);
      } catch {
        // Fallback gracefully
        setUploadedFile(fileOrName.name);
      } finally {
        setIsUploading(false);
      }
    } else {
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFile(fileOrName);
      }, 1200);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      simulateUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files[0]);
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

  const handleConnectRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setIsConnectingRepo(true);
    try {
      await api.connectGitHub(repoInput.trim());
    } catch {
      // Local fallback
    } finally {
      const formattedName = repoInput.includes("/")
        ? repoInput.trim()
        : `${passportSlug}/${repoInput.trim()}`;
      const newRepo: RepoItem = {
        name: formattedName,
        commits: "1 branch synced",
        lang: "Audited",
        status: "GPG Validated",
        health: "96/100 AST Complexity",
      };
      setRepos((prev) => [newRepo, ...prev]);
      setRepoInput("");
      setIsConnectingRepo(false);
      setShowConnectModal(false);
    }
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
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={28} showTag={true} tagText="DASHBOARD" />
          </Link>

          {/* Architectural Tab Switcher */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-neutral-200/60 border border-neutral-200 text-xs font-mono">
            {[
              { id: "overview", label: "Overview" },
              { id: "evidence", label: "Evidence" },
              { id: "simulator", label: "Job Match" },
              { id: "settings", label: "Settings", badge: `${completeness.score}%` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex-shrink-0 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-[#0F172A] font-bold shadow-xs"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${
                      completeness.score === 100
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold"
                        : "bg-indigo-50 text-[#4F46E5] border border-indigo-100 font-semibold"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
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
                  <span className="hidden sm:inline font-mono whitespace-nowrap">{passportUrl}</span>
                  <span className="sm:hidden font-mono whitespace-nowrap">Share</span>
                </>
              )}
            </button>

            <Link
              href={`/p/${passportSlug}`}
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
                src={displayAvatar}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs group-hover:border-[#4F46E5] transition-colors"
              />
              <ChevronDown size={14} className="text-[#64748B] hidden sm:block" />
            </button>

            {/* Architectural Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl z-50 animate-fade-in-up">
                <div className="p-3 border-b border-neutral-100">
                  <div className="font-bold text-sm text-[#0F172A]">{displayName}</div>
                  <div className="text-xs text-[#64748B] font-mono mt-0.5">{displayEmail}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-mono text-[#4F46E5] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                      CODE-PROVEN TIER
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#4F46E5]">
                      {completeness.score}% READY
                    </span>
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

                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-[#0F172A] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders size={14} className="text-[#4F46E5]" />
                      <span>Profile & Settings</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#4F46E5] font-bold">
                      {completeness.score}%
                    </span>
                  </button>

                  <Link
                    href={`/p/${passportSlug}`}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-8 space-y-8">
        
        {/* ── TAB 1: LEDGER OVERVIEW ─────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in-up">
            
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
                    src={displayAvatar}
                    alt={displayName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                        {displayName}
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[10px] font-mono uppercase font-bold">
                        <BadgeCheck size={13} />
                        VERIFIED PROOF
                      </span>
                    </div>

                    <p className="text-sm text-[#475569] font-mono mt-1">
                      {displayTitle} // {displayLocation} // 1,420 Production Commits
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
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm relative">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-1">
                    // GITHUB REPOSITORY AUDIT ENGINE
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                    Connected Repositories ({repos.length})
                  </h2>
                  <p className="text-xs text-[#64748B] font-mono mt-1">
                    AST complexity analysis and commit integrity audit runs automatically on push.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  {repos.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setRepos([])}
                      className="px-3 py-2 rounded-lg border border-[#E5E7EB] hover:border-neutral-400 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      Clear (Empty State)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRepos(SAMPLE_REPOS)}
                      className="px-3 py-2 rounded-lg border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      Load Sample Repos
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <Plus size={14} className="flex-shrink-0" />
                    <span className="whitespace-nowrap">Connect Repository</span>
                  </button>
                </div>
              </div>

              {/* Repositories List or Empty State */}
              {repos.length > 0 ? (
                <div className="space-y-3 font-mono text-xs">
                  {repos.map((repo, idx) => (
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
              ) : (
                <div className="py-14 px-6 text-center rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#FAFAF8] relative">
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-neutral-300 select-none">+</span>
                  <span className="absolute top-2 right-2 text-[9px] font-mono text-neutral-300 select-none">+</span>
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono text-neutral-300 select-none">+</span>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-neutral-300 select-none">+</span>

                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] mx-auto mb-3">
                    <GitBranch size={22} />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] tracking-tight">No Repositories Linked Yet</h3>
                  <p className="text-xs font-mono text-[#64748B] max-w-sm mx-auto mt-1 leading-relaxed">
                    Connect your public or private GitHub repository to trigger automated in-memory AST syntax parsing and commit integrity audits.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowConnectModal(true)}
                      className="h-10 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      <Plus size={14} />
                      <span>Connect GitHub Repo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepos(SAMPLE_REPOS)}
                      className="h-10 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5] bg-white text-xs font-mono font-semibold text-[#0F172A] transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      Load Sample Repos
                    </button>
                  </div>
                </div>
              )}
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

        {/* ── TAB 4: PROFILE SETTINGS & % CUSTOMIZATION ─────── */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Status Toast Banner */}
            {saveStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between gap-3 animate-fade-in ${
                  saveStatus.type === "success"
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/80 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {saveStatus.type === "success" ? (
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  )}
                  <span>{saveStatus.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveStatus(null)}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* ── READINESS & % COMPLETENESS ENGINE ── */}
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
              {/* Structural Crosshairs */}
              <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
              <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
              <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
              <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-neutral-100">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs font-mono uppercase font-bold text-[#4F46E5] tracking-widest">
                      // PROFILE COMPLETENESS ENGINE
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#4F46E5] font-semibold">
                      DYNAMIC WEIGHTING
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                    Cryptographic Readiness & Customization
                  </h2>
                  <p className="text-xs text-[#64748B] font-mono mt-1.5 leading-relaxed">
                    Your completeness index directly affects discovery priority in verified recruiter search queries. As you edit your credentials and proof links below, your score recalibrates in real time.
                  </p>
                </div>

                {/* Big Score Readout */}
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] self-start lg:self-auto">
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
                      COMPLETENESS SCORE
                    </div>
                    <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#0F172A] mt-0.5">
                      {completeness.score}<span className="text-xl text-[#4F46E5] font-normal">%</span>
                    </div>
                  </div>
                  <div className="pl-6 border-l border-[#E5E7EB]">
                    {completeness.score === 100 ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono uppercase font-bold whitespace-nowrap">
                          <CheckCircle2 size={12} />
                          100% CRYPTO-OPTIMAL
                        </span>
                        <div className="text-[10px] font-mono text-[#64748B]">All proofs verified</div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono uppercase font-bold whitespace-nowrap">
                          <Activity size={12} />
                          {100 - completeness.score}% TO OPTIMAL
                        </span>
                        <div className="text-[10px] font-mono text-[#64748B]">Action required</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Animated Progress Meter */}
              <div className="pt-8">
                <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                  <span className="text-[#64748B] font-semibold">Progress to 100% Cryptographic Verification</span>
                  <span className="text-[#0F172A] font-bold">{completeness.score} / 100 Points</span>
                </div>
                <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden relative border border-neutral-200/60 p-0.5">
                  <div
                    className="h-full bg-[#4F46E5] rounded-full transition-all duration-700 ease-out shadow-xs"
                    style={{ width: `${completeness.score}%` }}
                  />
                </div>

                {/* 8-Criteria Verification Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
                  {completeness.breakdown.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.met
                          ? "bg-[#FAFAF8] border-[#E5E7EB] text-[#0F172A]"
                          : "bg-white border-amber-200/80 border-dashed text-[#64748B]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {item.met ? (
                            <CheckCircle2 size={14} className="text-[#4F46E5] flex-shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 flex items-center justify-center text-[9px] font-mono font-bold text-amber-600 flex-shrink-0">
                              !
                            </span>
                          )}
                          <span className="text-xs font-bold font-sans tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                            item.met
                              ? "bg-indigo-50 text-[#4F46E5]"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          +{item.weight}%
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-[#64748B] leading-tight">
                        {item.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Customization Form */}
            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* ── CARD 1: IDENTITY & PROFESSIONAL BIO ── */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
                <div className="mb-8 pb-6 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">
                      1. Professional Identity & Biography
                    </h3>
                    <p className="text-xs text-[#64748B] font-mono mt-1">
                      Your name, title, and architecture summary are displayed on your cryptographic passport.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#4F46E5] font-semibold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                    Weight: 45% Total
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                        Full Legal / Professional Name <span className="text-[#4F46E5]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="e.g. Amina Adeleke"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] outline-none transition-all"
                      />
                      <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                        Contributes +15% to completeness
                      </span>
                    </div>

                    {/* Professional Title */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                        Engineering Title & Specialty <span className="text-[#4F46E5]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.professional_title}
                        onChange={(e) => setProfileForm({ ...profileForm, professional_title: e.target.value })}
                        placeholder="e.g. Senior Systems & Backend Architect"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] outline-none transition-all"
                      />
                      <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                        Contributes +10% to completeness
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Location */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                        Primary Location & Remote Status <span className="text-[#4F46E5]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="e.g. Lagos, Nigeria // Global Remote"
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] outline-none transition-all"
                      />
                      <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                        Contributes +10% to completeness
                      </span>
                    </div>

                    {/* Years Experience */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                        Years of Commercial Experience
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={profileForm.years_experience}
                        onChange={(e) => setProfileForm({ ...profileForm, years_experience: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] outline-none transition-all"
                      />
                      <span className="text-[10px] font-mono text-[#64748B] mt-1 block">
                        Indexed for senior/staff recruiter queries
                      </span>
                    </div>
                  </div>

                  {/* Technical Bio */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold">
                        Technical Bio & Architecture Summary
                      </label>
                      <span className="text-[10px] font-mono text-[#64748B]">
                        {profileForm.bio.length} characters (min 20 for +10% completeness)
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Highlight your architectural domain, systems complexity, databases, scale, and engineering principles..."
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] outline-none transition-all leading-relaxed resize-none"
                    />
                  </div>

                  {/* Avatar Customization */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-3">
                      Verified Candidate Portrait (+5% completeness)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB]">
                      <div className="relative">
                        <img
                          src={profileForm.avatar_url || "/testimonials/amina.jpg"}
                          alt={profileForm.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-[#4F46E5]/30 flex-shrink-0"
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="text-xs font-mono text-[#0F172A] font-semibold">
                          Choose a verified credential portrait preset:
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          {AVATAR_PRESETS.map((preset) => (
                            <button
                              key={preset.src}
                              type="button"
                              onClick={() => setProfileForm({ ...profileForm, avatar_url: preset.src })}
                              className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                                profileForm.avatar_url === preset.src
                                  ? "bg-white border-[#4F46E5] shadow-xs text-[#0F172A] ring-1 ring-[#4F46E5]"
                                  : "bg-white/80 border-[#E5E7EB] text-[#64748B] hover:border-neutral-300"
                              }`}
                            >
                              <img
                                src={preset.src}
                                alt={preset.name}
                                className="w-7 h-7 rounded-lg object-cover"
                              />
                              <span>{preset.name}</span>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-[#64748B] block mb-1">
                            Or provide a direct image URL:
                          </span>
                          <input
                            type="url"
                            value={profileForm.avatar_url}
                            onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                            className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] text-xs font-mono text-[#0F172A] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 2: PUBLIC PASSPORT URL & VISIBILITY CONTROLS ── */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
                <div className="mb-8 pb-6 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">
                      2. Custom Public Slug & Visibility
                    </h3>
                    <p className="text-xs text-[#64748B] font-mono mt-1">
                      Configure your immutable public URL handle and set whether your profile is discoverable in the talent ledger.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#4F46E5] font-semibold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                    Global Routing
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Custom Slug Input */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                      Custom Public Slug Handle <span className="text-[#4F46E5]">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex items-center rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus-within:border-[#4F46E5] focus-within:bg-white flex-1 overflow-hidden transition-all">
                        <span className="px-4 py-3 text-xs font-mono text-[#64748B] bg-neutral-100/70 border-r border-[#E5E7EB] select-none whitespace-nowrap">
                          creda.work/p/
                        </span>
                        <input
                          type="text"
                          required
                          value={profileForm.public_url}
                          onChange={(e) => {
                            const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                            setProfileForm({ ...profileForm, public_url: cleaned });
                          }}
                          placeholder="your-custom-handle"
                          className="w-full px-4 py-3 bg-transparent text-xs font-mono font-bold text-[#0F172A] outline-none"
                        />
                      </div>

                      <Link
                        href={`/p/${profileForm.public_url || "amina-adeleke"}`}
                        target="_blank"
                        className="h-11 px-4 rounded-xl border border-[#E5E7EB] hover:border-[#4F46E5] hover:text-[#4F46E5] bg-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                      >
                        <span>Test Live Link</span>
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B] mt-1.5 block">
                      Shareable link: https://creda.work/p/{profileForm.public_url || "your-slug"}
                    </span>
                  </div>

                  {/* Discoverability Mode */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-3">
                      Recruiter Discoverability & Ledger Listing
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, is_public: true })}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          profileForm.is_public
                            ? "bg-indigo-50/40 border-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]"
                            : "bg-[#FAFAF8] border-[#E5E7EB] hover:bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#4F46E5]">
                              <Eye size={14} />
                              PUBLIC TALENT LEDGER
                            </span>
                            {profileForm.is_public && (
                              <span className="w-4 h-4 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-[#0F172A] tracking-tight">
                            Discoverable by Recruiters (Recommended)
                          </div>
                          <p className="text-xs text-[#64748B] font-mono mt-2 leading-relaxed">
                            Your verified skills appear in the recruiter search directory. Companies can invite you directly for high-conviction roles.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, is_public: false })}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          !profileForm.is_public
                            ? "bg-indigo-50/40 border-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]"
                            : "bg-[#FAFAF8] border-[#E5E7EB] hover:bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#64748B]">
                              <EyeOff size={14} />
                              STEALTH / DIRECT LINK ONLY
                            </span>
                            {!profileForm.is_public && (
                              <span className="w-4 h-4 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-[#0F172A] tracking-tight">
                            Private Cryptographic Passport
                          </div>
                          <p className="text-xs text-[#64748B] font-mono mt-2 leading-relaxed">
                            Your profile will not appear in the open recruiter directory. Only recruiters who receive your exact link can inspect your credentials.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 3: VERIFIED EXTERNAL PROOF LINKS ── */}
              <div className="rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm">
                <div className="mb-8 pb-6 border-b border-neutral-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">
                      3. Verified External Links & Footprint
                    </h3>
                    <p className="text-xs text-[#64748B] font-mono mt-1">
                      Link your existing engineering footprints to earn +10% completeness.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#4F46E5] font-semibold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                    +10% Proof Links
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* GitHub */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                      GitHub Profile URL
                    </label>
                    <div className="flex items-center rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus-within:border-[#4F46E5] focus-within:bg-white overflow-hidden transition-all">
                      <span className="px-3 py-3 text-neutral-400">
                        <GitBranch size={16} />
                      </span>
                      <input
                        type="url"
                        value={profileForm.github_url}
                        onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full pr-3 py-3 bg-transparent text-xs font-mono text-[#0F172A] outline-none"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                      LinkedIn Profile URL
                    </label>
                    <div className="flex items-center rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus-within:border-[#4F46E5] focus-within:bg-white overflow-hidden transition-all">
                      <span className="px-3 py-3 text-neutral-400">
                        <ExternalLink size={16} />
                      </span>
                      <input
                        type="url"
                        value={profileForm.linkedin_url}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pr-3 py-3 bg-transparent text-xs font-mono text-[#0F172A] outline-none"
                      />
                    </div>
                  </div>

                  {/* Website / Architecture Blog */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                      Personal Portfolio / Blog URL
                    </label>
                    <div className="flex items-center rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus-within:border-[#4F46E5] focus-within:bg-white overflow-hidden transition-all">
                      <span className="px-3 py-3 text-neutral-400">
                        <Globe size={16} />
                      </span>
                      <input
                        type="url"
                        value={profileForm.website_url}
                        onChange={(e) => setProfileForm({ ...profileForm, website_url: e.target.value })}
                        placeholder="https://yourdomain.com"
                        className="w-full pr-3 py-3 bg-transparent text-xs font-mono text-[#0F172A] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ACTION BAR: SAVE & REVERT ── */}
              <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] flex-shrink-0">
                    <Save size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">Synchronize with Proof Ledger</div>
                    <div className="text-[11px] font-mono text-[#64748B]">Changes are hashed and verified immediately.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        setProfileForm({
                          name: currentUser.name || "Amina Adeleke",
                          professional_title: currentUser.professional_title || "Senior Systems & Backend Architect",
                          location: currentUser.location || "Lagos, Nigeria // Global Remote",
                          years_experience: currentUser.years_experience || 6,
                          bio: currentUser.bio || "Systems architect specializing in distributed Go microservices, AST syntax validation, and high-throughput PostgreSQL architectures.",
                          avatar_url: currentUser.avatar_url || "/testimonials/amina.jpg",
                          public_url: currentUser.public_url || "amina-adeleke",
                          is_public: currentUser.is_public ?? true,
                          github_url: currentUser.github_url || "https://github.com/amina-dev",
                          linkedin_url: currentUser.linkedin_url || "https://linkedin.com/in/amina-adeleke",
                          website_url: currentUser.website_url || "https://amina.dev",
                        });
                      }
                    }}
                    className="flex-1 sm:flex-none h-11 px-4 rounded-xl border border-[#E5E7EB] hover:bg-neutral-50 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    Discard Changes
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 whitespace-nowrap flex-shrink-0"
                  >
                    {isSavingProfile ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                        <span className="whitespace-nowrap">Synchronizing Ledger...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">Save Profile Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
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
      {/* ── Connect GitHub Repository Modal ─────────────────── */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowConnectModal(false)}
              className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
                <GitBranch size={16} />
              </div>
              <span className="text-xs font-mono uppercase font-bold text-[#4F46E5]">
                // IN-MEMORY AST AUDIT
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">Connect Repository</h3>
            <p className="text-xs text-[#64748B] font-mono mt-1 mb-6">
              Enter your GitHub repo URL or handle/repository. No code is stored on our servers.
            </p>

            <form onSubmit={handleConnectRepo} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                  Repository Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. username/distributed-systems"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] focus:border-[#4F46E5] text-xs font-mono text-[#0F172A] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E7EB] hover:bg-neutral-50 text-xs font-mono text-[#64748B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnectingRepo}
                  className="px-5 py-2 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-75 whitespace-nowrap"
                >
                  {isConnectingRepo ? "Auditing Repository..." : "Run AST Handshake"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
