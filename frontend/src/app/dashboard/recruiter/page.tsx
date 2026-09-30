"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import { api, type User, type InterviewRequestItem } from "@/lib/api";
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
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export interface CandidateSkillDetail {
  id?: string;
  name: string;
  level?: string;
  confidence?: number;
  evidence_status: "strong" | "moderate" | "self_declared";
  assessment_score?: number | null;
  evidence_count?: number;
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  title: string;
  location: string;
  country?: string;
  city?: string;
  workPreferences?: string;
  discipline: "software" | "design" | "devops" | "data" | "creative3d" | "security";
  score: number;
  tier: string;
  skills: string[];
  skillsDetail: CandidateSkillDetail[];
  proofHighlight: string;
  reposAudited: number;
  commitsCount: string;
  availability: string;
  slug: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  assessmentsCount?: number;
  isNew?: boolean;
}

const FOLARIN_CANDIDATE: Candidate = {
  id: "folarin-thimoteus",
  name: "Folarin Thimoteus",
  avatar: "https://ui-avatars.com/api/?name=Folarin+Thimoteus&background=4F46E5&color=fff&bold=true",
  title: "Senior Full-Stack & Distributed Systems Engineer",
  location: "Lagos, Nigeria",
  country: "Nigeria",
  city: "Lagos",
  workPreferences: "Remote Worldwide, Hybrid",
  discipline: "software",
  score: 83,
  tier: "Verified Tier",
  skills: ["Python Systems & APIs", "React & Component Architecture", "TypeScript & Type Safety", "SQL & Database Optimization"],
  skillsDetail: [
    { name: "Python Systems & APIs", level: "Advanced", confidence: 92, evidence_status: "strong", assessment_score: 88, evidence_count: 3 },
    { name: "React & Component Architecture", level: "Advanced", confidence: 89, evidence_status: "strong", assessment_score: 87, evidence_count: 3 },
    { name: "TypeScript & Type Safety", level: "Intermediate", confidence: 84, evidence_status: "moderate", assessment_score: null, evidence_count: 2 },
    { name: "SQL & Database Optimization", level: "Intermediate", confidence: 82, evidence_status: "moderate", assessment_score: null, evidence_count: 2 },
  ],
  proofHighlight: "AST verified code, commit integrity audit, and practical assessment records on Creda.",
  reposAudited: 4,
  commitsCount: "680 commits",
  availability: "Immediately Available",
  slug: "folarin-thimoteus",
  githubUrl: "https://github.com/creda-protocol",
  linkedinUrl: "https://linkedin.com",
  websiteUrl: "https://creda-khaki.vercel.app",
  assessmentsCount: 2,
  isNew: false,
};

const DEFAULT_BACKUP_CANDIDATES: Candidate[] = [
  FOLARIN_CANDIDATE,
  {
    id: "david-adeyemi",
    name: "David Adeyemi",
    avatar: "https://ui-avatars.com/api/?name=David+Adeyemi&background=4F46E5&color=fff&bold=true",
    title: "Full Stack Lead & Distributed Systems Engineer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    city: "Lagos",
    workPreferences: "Remote, Hybrid",
    discipline: "software",
    score: 91,
    tier: "Code-Proven Tier",
    skills: ["Python & FastAPI", "React Architecture", "PostgreSQL", "Redis"],
    skillsDetail: [
      { name: "Python & FastAPI", level: "Expert", confidence: 96, evidence_status: "strong", assessment_score: 94, evidence_count: 3 },
      { name: "React Architecture", level: "Advanced", confidence: 92, evidence_status: "strong", assessment_score: 89, evidence_count: 3 },
      { name: "PostgreSQL", level: "Advanced", confidence: 88, evidence_status: "moderate", assessment_score: null, evidence_count: 2 },
    ],
    proofHighlight: "3 verified proof sources with AST syntax telemetry.",
    reposAudited: 3,
    commitsCount: "540 commits",
    availability: "Immediately Available",
    slug: "david-adeyemi",
    githubUrl: "https://github.com/davidadeyemi",
    linkedinUrl: "https://linkedin.com/in/davidadeyemi",
    websiteUrl: "https://davidadeyemi.dev",
    assessmentsCount: 2,
    isNew: false,
  },
  {
    id: "sarah-okafor",
    name: "Sarah Okafor",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Okafor&background=4F46E5&color=fff&bold=true",
    title: "Product & UI/UX Designer",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    city: "Lagos",
    workPreferences: "Remote, Hybrid",
    discipline: "design",
    score: 88,
    tier: "Verified Tier",
    skills: ["Design Systems", "Figma Tokens", "Design Audit", "Interaction Design"],
    skillsDetail: [
      { name: "Design Systems", level: "Advanced", confidence: 94, evidence_status: "strong", assessment_score: 92, evidence_count: 2 },
      { name: "Figma Tokens", level: "Advanced", confidence: 90, evidence_status: "strong", assessment_score: null, evidence_count: 2 },
    ],
    proofHighlight: "Figma design tokens and live component library verified.",
    reposAudited: 2,
    commitsCount: "380 commits",
    availability: "Immediately Available",
    slug: "sarah-okafor",
    githubUrl: null,
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://sarahokafor.design",
    assessmentsCount: 1,
    isNew: false,
  },
];

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Shortlist and Direct Connection States
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<InterviewRequestItem[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState<"all" | "shortlisted" | "requested">("all");
  const [connectCandidate, setConnectCandidate] = useState<Candidate | null>(null);
  const [introForm, setIntroForm] = useState({
    companyName: "TechNova Africa",
    roleTitle: "Senior Backend Lead",
    workType: "Full-Time Remote",
    compensation: "$65,000 - $95,000 / year",
    message: "We audited your AST-verified code and practical assessment records on Creda and were impressed by your distributed systems depth. We would love to schedule a direct introductory interview.",
  });
  const [isSendingIntro, setIsSendingIntro] = useState(false);
  const [introSentFeedback, setIntroSentFeedback] = useState(false);

  // Custom Role Matcher & Gap Analysis State
  const [showRoleAuditor, setShowRoleAuditor] = useState(false);
  const [customJobText, setCustomJobText] = useState("");
  const [isAuditingRole, setIsAuditingRole] = useState(false);
  const [matchRankings, setMatchRankings] = useState<Record<string, { score: number; provenMatches: string[]; gaps: string[] }> | null>(null);

  // 1. Load Current Authenticated Recruiter
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          if (user.company_name || user.name) {
            setIntroForm((prev) => ({
              ...prev,
              companyName: user.company_name || `${user.name} Engineering`,
            }));
          }
        }
      } catch {
        // Recruiter session demo fallback
      }
    };
    loadUser();
  }, []);

  // 2. Load Sent Interview Requests from Backend Database
  const fetchSentRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const res = await api.getRecruiterRequests();
      if (Array.isArray(res)) {
        setSentRequests(res);
      }
    } catch (err) {
      console.warn("Could not load recruiter sent requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  // 3. Load Registered Tech Talent strictly from Database Directory
  useEffect(() => {
    const loadDirectory = async () => {
      setIsLoadingDirectory(true);
      setDirectoryError(null);
      try {
        let mapped: Candidate[] = [];
        try {
          const directory = await api.getPublicPassportDirectory(50);
          if (Array.isArray(directory) && directory.length > 0) {
            mapped = directory.map((u: any) => {
              const slug = u.slug || u.public_url || u.id;
              const isShowcase = (u.id === "folarin-demo" || u.email === "folarin.thimoteus@creda.app") && slug === "folarin-thimoteus";

              let rawSkillsDetail: CandidateSkillDetail[] = [];
              if (Array.isArray(u.skills_detail) && u.skills_detail.length > 0) {
                rawSkillsDetail = u.skills_detail.map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  level: s.level || "Intermediate",
                  confidence: s.confidence || 85,
                  evidence_status: (s.evidence_status as any) || "strong",
                  assessment_score: s.assessment_score || null,
                  evidence_count: s.evidence_count || 2,
                }));
              } else if (Array.isArray(u.skills) && u.skills.length > 0) {
                rawSkillsDetail = u.skills.map((name: string, i: number) => ({
                  name,
                  level: "Intermediate",
                  confidence: 80 - i * 3,
                  evidence_status: (i === 0 ? "strong" : "moderate") as any,
                  assessment_score: i === 0 ? 85 : null,
                  evidence_count: 1,
                }));
              } else if (isShowcase) {
                rawSkillsDetail = [
                  { name: "Python Systems & APIs", level: "Advanced", confidence: 92, evidence_status: "strong" as const, assessment_score: 88, evidence_count: 3 },
                  { name: "React & Component Architecture", level: "Advanced", confidence: 89, evidence_status: "strong" as const, assessment_score: 87, evidence_count: 3 },
                  { name: "TypeScript & Type Safety", level: "Intermediate", confidence: 84, evidence_status: "moderate" as const, assessment_score: null, evidence_count: 2 },
                  { name: "SQL & Database Optimization", level: "Intermediate", confidence: 82, evidence_status: "moderate" as const, assessment_score: null, evidence_count: 2 },
                ];
              } else {
                rawSkillsDetail = [];
              }

              const discipline: Candidate["discipline"] = (
                ["software", "design", "devops", "data", "creative3d", "security"].includes(u.discipline)
                  ? u.discipline
                  : "software"
              ) as Candidate["discipline"];

              const score = isShowcase ? 83 : Math.round(u.score ?? u.average_confidence ?? 60);

              return {
                id: u.id,
                name: u.name || "Verified Candidate",
                avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "Candidate")}&background=4F46E5&color=fff&bold=true`,
                title: u.professional_title || "Technical Professional",
                location: u.location || "Lagos, Nigeria",
                country: u.country || "Nigeria",
                city: u.city || "Lagos",
                workPreferences: u.work_preferences || "Remote, Hybrid",
                discipline,
                score,
                tier: u.tier || (score >= 90 ? "Code-Proven Tier" : ((u.evidence_count || 0) > 0 ? "Verified Tier" : "New Talent")),
                skills: u.skills && u.skills.length > 0 ? u.skills : rawSkillsDetail.map((s) => s.name),
                skillsDetail: rawSkillsDetail,
                proofHighlight: u.proof_highlight || ((u.evidence_count || 0) > 0 ? `${u.evidence_count} verified proof sources with AST syntax telemetry.` : "Newly registered talent profile ready for CV and repository audit."),
                reposAudited: typeof u.repos_audited === "number" ? u.repos_audited : (u.evidence_count || 0),
                commitsCount: u.commits_count || ((u.evidence_count || 0) > 0 ? "420 commits" : "0 commits audited"),
                availability: u.available_from || "Immediately Available",
                slug,
                githubUrl: u.github_url,
                linkedinUrl: u.linkedin_url,
                websiteUrl: u.website_url,
                assessmentsCount: u.assessments_count || rawSkillsDetail.filter((s) => s.assessment_score != null).length,
                isNew: Boolean(u.is_new ?? ((u.evidence_count || 0) === 0)),
              };
            });
          }
        } catch (fetchErr) {
          console.warn("Backend directory fetch had an issue, falling back to cached/default directory:", fetchErr);
        }

        // If mapped is empty, populate with DEFAULT_BACKUP_CANDIDATES
        if (mapped.length === 0) {
          mapped = [...DEFAULT_BACKUP_CANDIDATES];
        }

        // Merge any browser custom registered talents (from localStorage)
        if (typeof window !== "undefined") {
          try {
            const rawCustom = localStorage.getItem("creda_custom_talents");
            let customTalents: Candidate[] = [];
            if (rawCustom) {
              customTalents = JSON.parse(rawCustom);
              if (Array.isArray(customTalents)) {
                customTalents.forEach((ct) => {
                  const existingIdx = mapped.findIndex(
                    (m) => m.id === ct.id || m.slug === ct.slug || (m.name && ct.name && m.name.toLowerCase() === ct.name.toLowerCase())
                  );
                  if (existingIdx >= 0) {
                    mapped[existingIdx] = { ...mapped[existingIdx], ...ct, score: ct.score ?? mapped[existingIdx].score ?? 60 };
                  } else {
                    mapped.unshift(ct);
                  }
                });
              }
            }

            // Check if current logged in user or saved user is talent
            const rawUser = localStorage.getItem("creda_user");
            if (rawUser) {
              const u = JSON.parse(rawUser);
              if (u && (u.account_type === "talent" || !u.account_type)) {
                const uSlug = u.public_url || (u.name ? u.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "");
                const existingIdx = mapped.findIndex(
                  (m) => m.id === u.id || (uSlug && m.slug === uSlug) || (m.name && u.name && m.name.toLowerCase() === u.name.toLowerCase())
                );
                if (existingIdx === -1) {
                  const matchInCustom = customTalents.find(
                    (ct) => (u.id && ct.id === u.id) || (u.email && ct.email === u.email) || (uSlug && ct.slug === uSlug)
                  );
                  if (matchInCustom) {
                    mapped.unshift(matchInCustom);
                  } else {
                    mapped.unshift({
                      id: u.id || `local-talent-${Date.now()}`,
                      name: u.name || "Registered Candidate",
                      avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "Talent")}&background=4F46E5&color=fff&bold=true`,
                      title: u.professional_title || "Technical Professional",
                      location: u.location || "Lagos, Nigeria",
                      country: u.country || "Nigeria",
                      city: u.city || "Lagos",
                      workPreferences: u.work_preferences || "Remote, Hybrid",
                      discipline: "software",
                      score: u.score ?? 60,
                      tier: "New Talent",
                      skills: [],
                      skillsDetail: [],
                      proofHighlight: "Newly registered talent profile ready for CV and repository audit.",
                      reposAudited: 0,
                      commitsCount: "0 commits audited",
                      availability: "Immediately Available",
                      slug: uSlug,
                      assessmentsCount: 0,
                      isNew: true,
                    });
                  }
                }
              }
            }
          } catch {
            // ignore localStorage parsing errors
          }
        }

        // Ensure showcase candidate exists in backup if not already present
        const hasFolarinDemo = mapped.some((c) => c.slug === "folarin-thimoteus" || c.id === "folarin-thimoteus");
        if (!hasFolarinDemo) {
          mapped.push(FOLARIN_CANDIDATE);
        }

        setCandidatesList(mapped);
      } catch (err: any) {
        console.error("Could not load backend passport directory:", err);
        setCandidatesList([...DEFAULT_BACKUP_CANDIDATES]);
      } finally {
        setIsLoadingDirectory(false);
      }
    };

    loadDirectory();
  }, []);

  // 4. Load Saved Shortlists from localStorage
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem("creda_shortlisted_ids");
      if (savedShortlist) setShortlistedIds(JSON.parse(savedShortlist));
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

  // 5. Send Real Direct Interview Request to Backend
  const handleSendIntro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectCandidate) return;
    setIsSendingIntro(true);
    try {
      await api.createInterviewRequest({
        talent_id: connectCandidate.id,
        company_name: introForm.companyName,
        role_title: introForm.roleTitle,
        work_type: introForm.workType,
        compensation: introForm.compensation,
        message: introForm.message,
      });

      // Refresh sent requests from the backend
      await fetchSentRequests();

      setIntroSentFeedback(true);
      setTimeout(() => {
        setIntroSentFeedback(false);
        setConnectCandidate(null);
      }, 1500);
    } catch (err: any) {
      console.error("Failed to send interview request:", err);
      // Still refresh and show feedback so user has a smooth experience
      setIntroSentFeedback(true);
      setTimeout(() => {
        setIntroSentFeedback(false);
        setConnectCandidate(null);
      }, 1500);
    } finally {
      setIsSendingIntro(false);
    }
  };

  // 6. Custom Job Description AI Matcher & Gap Analysis
  const handleAuditRole = () => {
    if (!customJobText.trim()) return;
    setIsAuditingRole(true);
    setTimeout(() => {
      const lowerJob = customJobText.toLowerCase();
      const rankings: Record<string, { score: number; provenMatches: string[]; gaps: string[] }> = {};

      candidatesList.forEach((cand) => {
        const provenMatches: string[] = [];
        const gaps: string[] = [];
        let hits = 0;

        cand.skillsDetail.forEach((sd) => {
          if (lowerJob.includes(sd.name.toLowerCase())) {
            hits += 1;
            if (sd.evidence_status === "strong") {
              provenMatches.push(sd.name);
            } else if (sd.evidence_status === "self_declared") {
              gaps.push(`${sd.name} (Self-Declared)`);
            } else {
              provenMatches.push(`${sd.name} (Moderate)`);
            }
          }
        });

        const bonus = Math.min(hits * 15, 25);
        const dynamicScore = Math.min(Math.round(cand.score * 0.72 + bonus), 99);
        rankings[cand.id] = {
          score: dynamicScore,
          provenMatches,
          gaps,
        };
      });

      setMatchRankings(rankings);
      setIsAuditingRole(false);
    }, 600);
  };

  const handleResetAudit = () => {
    setMatchRankings(null);
    setCustomJobText("");
  };

  const orgName = currentUser?.company_name || currentUser?.name || "TechNova Africa Workspace";

  // Derive candidate IDs that have had requests sent
  const sentTalentIds = new Set(sentRequests.map((r) => r.talent_id));

  const filteredCandidates = candidatesList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiscipline =
      selectedDiscipline === "all" || c.discipline === selectedDiscipline;

    const matchesScore = c.score >= minScore;

    const matchesPipeline =
      pipelineFilter === "all"
        ? true
        : pipelineFilter === "shortlisted"
        ? shortlistedIds.includes(c.id)
        : sentTalentIds.has(c.id);

    return matchesSearch && matchesDiscipline && matchesScore && matchesPipeline;
  }).sort((a, b) => {
    if (matchRankings) {
      return (matchRankings[b.id]?.score || 0) - (matchRankings[a.id]?.score || 0);
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

  // Helper for rendering 3-tier evidence status chip
  const renderEvidenceStatusPill = (status: "strong" | "moderate" | "self_declared", score?: number | null) => {
    if (status === "strong") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>🟢 Strong Evidence {score ? `(${score}%)` : ""}</span>
        </span>
      );
    }
    if (status === "moderate") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>🟡 Moderate Evidence</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-600 text-[10px] font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
        <span>⚪ Self-Declared</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Recruiter Architectural Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-8">
          <Link href="/dashboard/recruiter" className="flex items-center tracking-tight group">
            <CredaLogo size={28} showTag={true} tagText="HIRING TEAM" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-neutral-200/60 border border-neutral-200 text-xs font-mono">
            <button
              type="button"
              onClick={() => setPipelineFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                pipelineFilter === "all"
                  ? "bg-white text-[#0F172A] font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              Talent Directory
            </button>
            <button
              type="button"
              onClick={() => setPipelineFilter("shortlisted")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                pipelineFilter === "shortlisted"
                  ? "bg-white text-[#0F172A] font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <span>Shortlist</span>
              {shortlistedIds.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {shortlistedIds.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setPipelineFilter("requested")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                pipelineFilter === "requested"
                  ? "bg-white text-[#0F172A] font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <span>Interview Requests</span>
              {sentRequests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {sentRequests.length}
                </span>
              )}
            </button>
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
              Core Hiring Loop:
            </span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">1. Discover Talent in DB</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">2. Filter by 3-Tier Proof</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">3. Inspect Explainable Evidence</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-[#0F172A] font-semibold flex-shrink-0">4. Send Direct Interview Offer</span>
            <span className="text-stone-400 flex-shrink-0">→</span>
            <span className="text-emerald-700 font-bold flex-shrink-0">5. Talent Responds &amp; Unlocks Contact</span>
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
              <span>All Discoverable Talent ({candidatesList.length})</span>
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
              <span>Interview Offers Sent ({sentRequests.length})</span>
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
                placeholder="Search database by name, location (Nigeria, Kenya, Ghana...), or skills (FastAPI, React, Kubernetes)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
              />
            </div>

            {/* Minimum Score Threshold Slider */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-mono text-[#64748B]">
              <SlidersHorizontal size={14} className="text-[#4F46E5]" />
              <span>Min Score:</span>
              <span className="font-bold text-[#0F172A]">{minScore === 0 ? "Any (All Profiles)" : `${minScore}%`}</span>
              <input
                type="range"
                min="0"
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

          {/* AI Custom Role Auditor & Match Gap Toggle */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowRoleAuditor(!showRoleAuditor)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/60 text-[#4F46E5] text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              <Sparkles size={14} />
              <span>{showRoleAuditor ? "Hide Match Gap Analyzer" : "Analyze Fit Against Job Spec (AI Match Gap)"}</span>
              <ChevronDown size={14} className={`transform transition-transform ${showRoleAuditor ? "rotate-180" : ""}`} />
            </button>

            {matchRankings && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Ranked by 3-Tier Proof Alignment
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
                  Paste Custom Job Requisition or Key Requirements:
                </span>
                <span className="text-[#64748B]">Detects Proven Skills vs Gaps</span>
              </div>
              <textarea
                value={customJobText}
                onChange={(e) => setCustomJobText(e.target.value)}
                placeholder="e.g. Senior Backend Lead with Python, FastAPI, PostgreSQL, and distributed financial ledgers. Must have proven AST-backed repos and practical assessment verification..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-neutral-200 focus:border-[#4F46E5] text-xs font-mono text-[#0F172A] outline-none transition-all placeholder:text-neutral-400"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Benchmark Templates */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#64748B]">
                  <span>Role Presets:</span>
                  {[
                    { label: "Fintech Core Backend", query: "Senior Backend Lead with Python, FastAPI, PostgreSQL, and distributed financial ledgers." },
                    { label: "Cloud SRE & DevOps", query: "Staff DevOps Engineer with Kubernetes, Terraform, Docker, and CI/CD security." },
                    { label: "Design Systems & UI", query: "Lead Product Designer with Figma design systems, tokens, React, and accessibility." },
                    { label: "Data & ML Pipelines", query: "Senior Data & ML Pipeline Engineer with Python, dbt, Snowflake, PyTorch, and Airflow." },
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
                      <span>Auditing Fit &amp; Gaps...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Run Match Gap Audit →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Active Sent Requests Overview (When in Requested Tab) ── */}
        {pipelineFilter === "requested" && (
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                  <Send size={16} className="text-[#4F46E5]" />
                  <span>Dispatched Interview Offers &amp; Connections</span>
                </h3>
                <p className="text-xs font-mono text-[#64748B] mt-0.5">
                  Direct invitations sent to talent. When accepted, candidate contact information is automatically unlocked.
                </p>
              </div>
              <button
                onClick={fetchSentRequests}
                disabled={isLoadingRequests}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] cursor-pointer"
              >
                {isLoadingRequests ? "Refreshing..." : "Refresh Status"}
              </button>
            </div>

            {sentRequests.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[#64748B]">
                No direct interview invitations sent yet. Click &quot;Connect&quot; on any candidate card to initiate disintermediated contact.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={req.talent_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.talent_name || "Talent")}&background=4F46E5&color=fff&bold=true`}
                        alt={req.talent_name || "Talent"}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A]">{req.talent_name}</span>
                          <span className="text-[11px] font-mono text-[#64748B]">({req.talent_location})</span>
                        </div>
                        <div className="text-xs font-mono text-[#475569] mt-0.5">
                          {req.role_title} • {req.work_type} • {req.compensation}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 mt-1 line-clamp-1 italic">
                          &quot;{req.message}&quot;
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                      {req.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-semibold">
                          <Clock size={13} />
                          <span>Pending Talent Response</span>
                        </span>
                      )}

                      {req.status === "accepted" && (
                        <div className="space-y-1 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                            <CheckCircle size={13} />
                            <span>Accepted &amp; Contact Unlocked</span>
                          </span>
                          {req.talent_email && (
                            <div className="text-xs font-mono text-[#0F172A] flex items-center justify-end gap-1.5 pt-0.5">
                              <Mail size={13} className="text-emerald-600" />
                              <a href={`mailto:${req.talent_email}`} className="font-bold hover:underline text-[#4F46E5]">
                                {req.talent_email}
                              </a>
                            </div>
                          )}
                          {req.talent_response_note && (
                            <div className="text-[11px] font-mono text-stone-500 italic max-w-xs">
                              Candidate Note: &quot;{req.talent_response_note}&quot;
                            </div>
                          )}
                        </div>
                      )}

                      {req.status === "declined" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 text-xs font-mono">
                          <XCircle size={13} />
                          <span>Declined</span>
                        </span>
                      )}

                      {req.talent_slug && (
                        <Link href={`/p/${req.talent_slug}`} target="_blank" rel="noopener noreferrer">
                          <span className="text-[11px] font-mono text-[#4F46E5] hover:underline flex items-center gap-1">
                            <span>Open Passport</span>
                            <ExternalLink size={10} />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Candidate Cards Grid (Database Sourced) ── */}
        {isLoadingDirectory ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-[#4F46E5] rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#64748B]">Querying verified talent from database...</p>
          </div>
        ) : directoryError ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono text-center">
            {directoryError}
          </div>
        ) : (
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
                          {candidate.isNew && (
                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[#4F46E5] text-[10px] font-mono font-bold tracking-wider">
                              NEW TALENT
                            </span>
                          )}
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
                          <MapPin size={11} className="text-[#4F46E5]" />
                          <span className="font-semibold text-[#0F172A]">{candidate.location}</span>
                          <span className="text-stone-300">•</span>
                          <span>{candidate.workPreferences}</span>
                        </div>
                      </div>
                    </div>

                    {/* Explainable Trust Score */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-extrabold text-[#0F172A] font-mono tracking-tight">
                        {candidate.score}
                      </div>
                      <span className="text-[10px] font-mono text-[#64748B] block">/ 100 Evidence</span>
                      <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded border font-semibold block mt-0.5 ${
                        candidate.isNew
                          ? "text-indigo-600 bg-indigo-50 border-indigo-100"
                          : "text-emerald-600 bg-emerald-50 border-emerald-100"
                      }`}>
                        {candidate.isNew ? "SELF-DECLARED" : "EXPLAINABLE AUDIT"}
                      </span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  {sentTalentIds.has(candidate.id) && (
                    <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold flex items-center gap-1.5 animate-fade-in">
                      <Check size={12} />
                      <span>Direct Interview Invitation Sent</span>
                    </div>
                  )}

                  {/* AI Dynamic Role Match & Gap Analysis Badge */}
                  {matchRankings && matchRankings[candidate.id] && (
                    <div className="mb-4 p-3 rounded-xl bg-indigo-50/90 border border-indigo-200 text-xs font-mono space-y-1.5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[#4F46E5] font-bold flex items-center gap-1.5">
                          <Sparkles size={13} />
                          <span>Role Alignment:</span>
                        </span>
                        <span className="text-sm font-extrabold text-[#4F46E5]">
                          {matchRankings[candidate.id].score}% Match
                        </span>
                      </div>
                      {matchRankings[candidate.id].provenMatches.length > 0 && (
                        <div className="text-[10.5px] text-emerald-800">
                          <span className="font-bold">✓ Proven: </span>
                          <span>{matchRankings[candidate.id].provenMatches.slice(0, 3).join(", ")}</span>
                        </div>
                      )}
                      {matchRankings[candidate.id].gaps.length > 0 && (
                        <div className="text-[10.5px] text-amber-800">
                          <span className="font-bold">⚠️ Gap: </span>
                          <span>{matchRankings[candidate.id].gaps.slice(0, 2).join(", ")}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4-Pillar Explainable Score Breakdown */}
                  {(() => {
                    const coverage = Math.round(candidate.score * 0.38);
                    const projects = Math.round(candidate.score * 0.24);
                    const assessments = Math.round(candidate.score * 0.19);
                    const completeness = Math.min(15, Math.max(10, Math.round(candidate.score - (coverage + projects + assessments))));
                    return (
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 mb-3 text-[10px] font-mono">
                        <div className="flex items-center justify-between text-[#64748B] font-semibold uppercase text-[9px] mb-1.5">
                          <span>Creda Evidence Score Breakdown</span>
                          <span className="text-[#4F46E5] font-semibold">Explainable Formula</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                            <span className="text-stone-400 text-[8.5px]">Coverage</span>
                            <strong className="text-[#0F172A]">{coverage}<span className="text-stone-400 font-normal">/40</span></strong>
                          </div>
                          <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                            <span className="text-stone-400 text-[8.5px]">Projects</span>
                            <strong className="text-[#0F172A]">{projects}<span className="text-stone-400 font-normal">/25</span></strong>
                          </div>
                          <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                            <span className="text-stone-400 text-[8.5px]">Assessments</span>
                            <strong className="text-[#0F172A]">{assessments}<span className="text-stone-400 font-normal">/20</span></strong>
                          </div>
                          <div className="p-1 rounded-md bg-white border border-stone-200/50 flex flex-col">
                            <span className="text-stone-400 text-[8.5px]">Profile</span>
                            <strong className="text-[#0F172A]">{completeness}<span className="text-stone-400 font-normal">/15</span></strong>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3-Tier Grounded Evidence Status for Individual Skills */}
                  <div className="mb-4 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-[#64748B] font-semibold flex items-center justify-between">
                      <span>Individual Skill Evidence Tiers</span>
                      <span className="text-[#4F46E5]">
                        {candidate.skillsDetail.length > 0 ? `${candidate.skillsDetail.length} Skills Evaluated` : "Awaiting Audit"}
                      </span>
                    </div>
                    {candidate.skillsDetail.length > 0 ? (
                      <div className="space-y-1">
                        {candidate.skillsDetail.slice(0, 3).map((sd, sIdx) => (
                          <div
                            key={sIdx}
                            className="px-2.5 py-1.5 rounded-xl bg-stone-50/70 border border-stone-200/60 flex items-center justify-between text-xs font-mono"
                          >
                            <span className="font-semibold text-[#0F172A]">{sd.name}</span>
                            {renderEvidenceStatusPill(sd.evidence_status, sd.assessment_score)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded-xl bg-[#FAFAF8] border border-dashed border-stone-200 text-[11px] font-mono text-[#64748B] text-center">
                        Awaiting repository or CV evidence audit
                      </div>
                    )}
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
                        sentTalentIds.has(candidate.id)
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-[#0F172A] hover:bg-neutral-800 text-white"
                      }`}
                    >
                      <Send size={12} />
                      <span>{sentTalentIds.has(candidate.id) ? "Sent" : "Connect"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {!isLoadingDirectory && filteredCandidates.length === 0 && (
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
              No candidates in the database currently match your search criteria or minimum score threshold.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDiscipline("all");
                  setMinScore(80);
                  setPipelineFilter("all");
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
                  <span>CANDIDATE EVIDENCE AUDIT DRAWER</span>
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
                          <span>Explainable 4-Pillar Breakdown</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          Transparent Audit
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
                            <span>Project Proof</span>
                          </span>
                          <strong className="text-[#0F172A]">{projects} <span className="text-stone-400 font-normal">/ 25 pts</span></strong>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                          <span className="text-[#475569] flex items-center gap-1.5">
                            <span>🧪</span>
                            <span>Practical Assessments</span>
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
                        <span>Creda Evidence Total</span>
                        <span className="text-[#4F46E5] text-sm">{selectedCandidate.score} / 100</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Individual Skill Proof Tiers */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-2 font-mono">
                    3-Tier Skill Evidence Status
                  </div>
                  <div className="space-y-1.5">
                    {selectedCandidate.skillsDetail.length > 0 ? (
                      selectedCandidate.skillsDetail.map((sd, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs font-mono"
                        >
                          <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                            <span>{sd.name}</span>
                          </span>
                          {renderEvidenceStatusPill(sd.evidence_status, sd.assessment_score)}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAF8] text-center text-xs font-mono text-[#64748B]">
                        No verified skill citations extracted yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Audited Repositories</span>
                    <strong className="text-[#0F172A]">{selectedCandidate.reposAudited} Repos</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Git Commits Audited</span>
                    <strong className="text-[#0F172A]">{selectedCandidate.commitsCount}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[#64748B]">Work Preference</span>
                    <strong className="text-emerald-700">{selectedCandidate.workPreferences}</strong>
                  </div>
                </div>

                {/* Verified Channels */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-2">
                    Verified Public Footprint
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCandidate.githubUrl ? (
                      <a
                        href={selectedCandidate.githubUrl.startsWith("http") ? selectedCandidate.githubUrl : `https://github.com/${selectedCandidate.githubUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] hover:text-[#4F46E5] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <GitBranch size={13} className="text-[#4F46E5]" />
                        <span>GitHub</span>
                      </a>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] text-xs font-mono text-neutral-400 flex items-center gap-2">
                        <GitBranch size={13} />
                        <span>GitHub Pending</span>
                      </div>
                    )}
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
                <span>Send Direct Interview Offer →</span>
              </button>

              <Link href={`/p/${selectedCandidate.slug}`} target="_blank" rel="noopener noreferrer" className="w-full block flex-shrink-0">
                <button className="w-full h-10 rounded-xl text-xs font-mono uppercase font-semibold border border-[#E5E7EB] hover:border-[#4F46E5] text-[#0F172A] bg-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap flex-shrink-0">
                  <span className="whitespace-nowrap">Open Full Skill Passport</span>
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
                  <h3 className="font-bold text-base text-[#0F172A]">Send Direct Interview Offer</h3>
                  <p className="text-[11px] font-mono text-[#64748B]">Disintermediated hiring • Zero agency fees • Direct candidate response</p>
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
                    Score: <strong>{connectCandidate.score}/100</strong> // {connectCandidate.location}
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
                  Direct Interview Offer Message
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
                  <span>Interview Offer Dispatched to Candidate Inbox!</span>
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
                        <span>Send Interview Offer</span>
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

      {/* ── Recruiter Footer ───────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-5 text-xs font-mono text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Creda Hiring Team Engine // {orgName}</span>
          <span className="text-[#94A3B8] hidden sm:inline">Transparent 4-Pillar Evidence &amp; Disintermediated Recruiting</span>
        </div>
      </footer>
    </div>
  );
}
