"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  GitBranch,
  ChevronDown,
  Building2,
  Users,
  Layers,
  Search,
  Code2,
  Palette,
  Server,
  Database,
  Check,
} from "lucide-react";

type AccountType = "talent" | "recruiter";

interface DomainOption {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge: string;
}

interface TeamSizeOption {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
}

const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: "software-engineering",
    label: "Software Engineering",
    sublabel: "Full-Stack, Backend, Mobile & Distributed Systems",
    icon: Code2,
    badge: "AST Audited",
  },
  {
    id: "uiux-product-design",
    label: "Product & UI/UX Design",
    sublabel: "Design Systems, Figma Tokens & UX Architecture",
    icon: Palette,
    badge: "Token Audited",
  },
  {
    id: "devops-cloud",
    label: "DevOps & Cloud Architecture",
    sublabel: "Terraform, Kubernetes, CI/CD & SRE Reliability",
    icon: Server,
    badge: "IaC Verified",
  },
  {
    id: "data-ai",
    label: "Data Engineering & AI",
    sublabel: "Pipelines, Analytics, dbt & Machine Learning",
    icon: Database,
    badge: "Pipeline Verified",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity & Security Auditing",
    sublabel: "Penetration Testing, OWASP Hardening & CVEs",
    icon: ShieldCheck,
    badge: "Audit Verified",
  },
];

const TEAM_SIZE_OPTIONS: TeamSizeOption[] = [
  {
    id: "1-10",
    label: "1 – 10 Engineers",
    sublabel: "Seed / Early Stage Startup Squad",
    badge: "Startup",
  },
  {
    id: "11-50",
    label: "11 – 50 Engineers",
    sublabel: "Series A-B Growth Scale Engineering",
    badge: "Growth",
  },
  {
    id: "51-200",
    label: "51 – 200 Engineers",
    sublabel: "Scale-Up / Multi-Product Engineering Org",
    badge: "Scale-Up",
  },
  {
    id: "200+",
    label: "200+ Enterprise",
    sublabel: "Global Multinational / Banking Rails",
    badge: "Enterprise",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("talent");

  // Talent form state
  const [talentData, setTalentData] = useState({
    name: "",
    email: "",
    domain: "software-engineering",
    password: "",
  });

  // Recruiter form state
  const [recruiterData, setRecruiterData] = useState({
    name: "",
    workEmail: "",
    companyName: "",
    teamSize: "11-50",
    password: "",
  });

  // Custom architectural dropdown states
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [teamSizeDropdownOpen, setTeamSizeDropdownOpen] = useState(false);

  const domainRef = useRef<HTMLDivElement>(null);
  const teamSizeRef = useRef<HTMLDivElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (domainRef.current && !domainRef.current.contains(event.target as Node)) {
        setDomainDropdownOpen(false);
      }
      if (teamSizeRef.current && !teamSizeRef.current.contains(event.target as Node)) {
        setTeamSizeDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDomainDropdownOpen(false);
        setTeamSizeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-neutral-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 3, label: "Good", color: "bg-indigo-400" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "Too short", color: "bg-neutral-300" };
    }
  };

  const activePassword =
    accountType === "talent" ? talentData.password : recruiterData.password;
  const passwordStrength = getPasswordStrength(activePassword);

  const selectedDomain =
    DOMAIN_OPTIONS.find((d) => d.id === talentData.domain) || DOMAIN_OPTIONS[0];
  const selectedTeamSize =
    TEAM_SIZE_OPTIONS.find((t) => t.id === recruiterData.teamSize) || TEAM_SIZE_OPTIONS[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleGithubSignup = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Top Status Strip (AgentLab Style) ─────────────── */}
      <div className="w-full bg-[#0F172A] text-white border-b border-neutral-800 py-2.5 px-6 sm:px-10 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            <span className="text-[#818CF8] font-semibold">[ PROTOCOL V2.4 REGISTRATION ]</span>
            <span className="text-neutral-300 hidden md:inline">
              VERIFICATION ENGINE FOR AFRICAN TECH TALENT & GLOBAL HIRING TEAMS
            </span>
          </div>
          <span className="text-neutral-400 text-[11px]">
            60-SECOND ONBOARDING
          </span>
        </div>
      </div>

      {/* ── Minimalist Architectural Header (Oberon Style) ── */}
      <header className="border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={34} showTag={true} tagText={accountType === "talent" ? "TALENT" : "RECRUITER"} />
          </Link>
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-2">
            <span className="hidden sm:inline">Already registered?</span>
            <Link
              href="/auth/login"
              className="text-[#0F172A] hover:text-[#4F46E5] font-bold underline underline-offset-4 transition-colors"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ──────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 my-4 sm:my-8">
        <div className="w-full max-w-5xl rounded-3xl border border-[#E5E7EB] bg-white shadow-sm grid grid-cols-1 lg:grid-cols-12 relative">
          {/* Structural Crosshairs */}
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

          {/* ── Left Column: Value Prop & Telemetry ─────────────── */}
          <div className="lg:col-span-5 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] bg-[#FAFAF8] flex flex-col justify-between relative rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
            <div>
              {/* Protocol Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-[10px] font-mono text-[#4F46E5] font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                {accountType === "talent" ? "PROOF-OF-WORK PASSPORT" : "ENTERPRISE RECRUITER ENGINE"}
              </div>

              {/* Editorial Title */}
              {accountType === "talent" ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-4 leading-tight">
                    Turn your real work into{" "}
                    <span className="font-serif italic font-normal text-[#4F46E5]">
                      cryptographic proof.
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-[#475569] font-mono leading-relaxed mb-8">
                    Built for African software engineers, UI/UX designers, DevOps architects, and data teams who let authentic artifacts speak louder than keywords.
                  </p>

                  {/* Talent Verification Sequence */}
                  <div className="space-y-3.5">
                    {[
                      {
                        icon: GitBranch,
                        title: "Ingest Authentic Artifacts",
                        desc: "Connect GitHub repos, Figma design system tokens, or architecture specs.",
                      },
                      {
                        icon: Terminal,
                        title: "Multi-Disciplinary Verification",
                        desc: "In-memory AST code analysis, UI component hierarchy, and commit velocity.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Cryptographic Skill Passport",
                        desc: "Receive an immutable, tamper-proof passport link recruiters trust globally.",
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-2xs flex items-start gap-3.5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] flex-shrink-0 mt-0.5">
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0F172A] tracking-tight">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#64748B] font-mono leading-relaxed mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mb-4 leading-tight">
                    Hire verified talent with{" "}
                    <span className="font-serif italic font-normal text-[#4F46E5]">
                      zero resume spam.
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-[#475569] font-mono leading-relaxed mb-8">
                    Stop sifting through fraudulent and AI-generated CVs. Inspect mathematically proven skill passports backed by actual code, designs, and architecture.
                  </p>

                  {/* Recruiter Value Sequence */}
                  <div className="space-y-3.5">
                    {[
                      {
                        icon: Search,
                        title: "Pre-Verified Talent Ledger",
                        desc: "Direct access to top 5% African engineers, designers, and cloud architects.",
                      },
                      {
                        icon: Layers,
                        title: "Deep Evidence Inspection",
                        desc: "Audit actual syntax trees, test coverage, and design token consistency.",
                      },
                      {
                        icon: ShieldCheck,
                        title: "Automated Candidate Match Score",
                        desc: "Run role specs against verified passports with instant cryptographic match telemetry.",
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-[#E5E7EB] bg-white shadow-2xs flex items-start gap-3.5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] flex-shrink-0 mt-0.5">
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0F172A] tracking-tight">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#64748B] font-mono leading-relaxed mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Proof Tagline */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {accountType === "talent" ? "100% Free Forever for Talent" : "14-Day Free Evaluation"}
              </span>
              <span className="text-neutral-300">//</span>
              <span>Zero Data Resold</span>
            </div>
          </div>

          {/* ── Right Column: Clean Registration Form ─────────── */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in-up">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  {accountType === "talent"
                    ? "Skill Passport Initialized!"
                    : "Recruiter Engine Account Created!"}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] font-mono max-w-sm mx-auto leading-relaxed">
                  {accountType === "talent"
                    ? "Welcome to Creda Protocol. We are preparing your Evidence Ingestion Hub to verify your work."
                    : "Welcome to Creda Enterprise. Your workspace is ready to verify candidates and inspect proof ledgers."}
                </p>
                <div className="pt-4">
                  <Link href="/dashboard">
                    <button className="h-12 px-8 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs cursor-pointer">
                      Enter Protocol Dashboard →
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {/* ── Architectural Role Switcher (Talent vs Recruiter) ── */}
                <div className="mb-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-semibold mb-2">
                    Select Account Purpose
                  </div>
                  <div className="grid grid-cols-2 p-1 bg-[#FAFAF8] rounded-2xl border border-[#E5E7EB]">
                    <button
                      type="button"
                      onClick={() => setAccountType("talent")}
                      className={`h-11 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        accountType === "talent"
                          ? "bg-white text-[#0F172A] shadow-xs border border-[#E5E7EB]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      <User size={14} className={accountType === "talent" ? "text-[#4F46E5]" : ""} />
                      <span>Tech Talent</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("recruiter")}
                      className={`h-11 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        accountType === "recruiter"
                          ? "bg-white text-[#0F172A] shadow-xs border border-[#E5E7EB]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      <Building2 size={14} className={accountType === "recruiter" ? "text-[#4F46E5]" : ""} />
                      <span>Hiring Team</span>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    {accountType === "talent" ? "Claim Your Skill Passport" : "Set Up Recruiter Workspace"}
                  </h2>
                  <p className="text-xs text-[#64748B] font-mono mt-1">
                    {accountType === "talent"
                      ? "Free for engineers, designers & architects • No credit card required"
                      : "Start verifying candidates in under 60 seconds • 14-day free trial"}
                  </p>
                </div>

                {/* Quick GitHub sign up available for tech professionals */}
                {accountType === "talent" && (
                  <>
                    <button
                      type="button"
                      onClick={handleGithubSignup}
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#0F172A] hover:bg-neutral-800 text-white transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer active:translate-y-0.5 disabled:opacity-75 mb-6"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>Quick Sign Up with GitHub</span>
                    </button>

                    <div className="relative mb-6 flex items-center justify-center">
                      <div className="w-full border-t border-[#E5E7EB]" />
                      <span className="absolute bg-white px-3 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
                        or register with email
                      </span>
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Field 1: Full Name */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder={accountType === "talent" ? "e.g. Amina Adeleke" : "e.g. Tunde Balogun"}
                        value={accountType === "talent" ? talentData.name : recruiterData.name}
                        onChange={(e) =>
                          accountType === "talent"
                            ? setTalentData({ ...talentData, name: e.target.value })
                            : setRecruiterData({ ...recruiterData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 2: Email */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                      {accountType === "talent" ? "Professional Email" : "Work Email"}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder={accountType === "talent" ? "amina@domain.com" : "tunde@company.com"}
                        value={accountType === "talent" ? talentData.email : recruiterData.workEmail}
                        onChange={(e) =>
                          accountType === "talent"
                            ? setTalentData({ ...talentData, email: e.target.value })
                            : setRecruiterData({ ...recruiterData, workEmail: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* ── Custom Architectural Dropdown: Talent Discipline ── */}
                  {accountType === "talent" && (
                    <div className="relative" ref={domainRef}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                          Primary Discipline / Domain
                        </label>
                        <span className="text-[10px] font-mono text-[#4F46E5] font-semibold">
                          {selectedDomain.badge}
                        </span>
                      </div>

                      {/* Dropdown Trigger Button */}
                      {(() => {
                        const SelectedDomainIcon = selectedDomain.icon;
                        return (
                          <button
                            type="button"
                            onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
                            aria-expanded={domainDropdownOpen}
                            className={`w-full px-3.5 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer outline-none ${
                              domainDropdownOpen
                                ? "bg-white border-[#4F46E5] ring-2 ring-[#4F46E5]/15 shadow-sm"
                                : "bg-[#FAFAF8] border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5]"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] flex-shrink-0">
                                <SelectedDomainIcon size={16} />
                              </div>
                              <div className="truncate">
                                <div className="text-xs font-bold text-[#0F172A] truncate">
                                  {selectedDomain.label}
                                </div>
                                <div className="text-[10px] font-mono text-[#64748B] truncate">
                                  {selectedDomain.sublabel}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <ChevronDown
                                size={16}
                                className={`text-[#64748B] transition-transform duration-200 ${
                                  domainDropdownOpen ? "rotate-180 text-[#4F46E5]" : ""
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })()}

                      {/* Floating Architectural Dropdown Menu */}
                      {domainDropdownOpen && (
                        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl overflow-hidden animate-fade-in-up">
                          <div className="px-3.5 py-2 bg-[#FAFAF8] border-b border-[#E5E7EB] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                            <span>// VERIFICATION TRACK</span>
                            <span>SELECT ARCHITECTURAL DOMAIN</span>
                          </div>

                          <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 p-1.5 space-y-0.5">
                            {DOMAIN_OPTIONS.map((option) => {
                              const OptionIcon = option.icon;
                              const isSelected = option.id === talentData.domain;
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => {
                                    setTalentData({ ...talentData, domain: option.id });
                                    setDomainDropdownOpen(false);
                                  }}
                                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group ${
                                    isSelected
                                      ? "bg-indigo-50/70 border border-indigo-100/80"
                                      : "hover:bg-[#FAFAF8] border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0 pr-3">
                                    <div
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                        isSelected
                                          ? "bg-[#4F46E5] text-white"
                                          : "bg-neutral-100 text-[#0F172A] group-hover:bg-indigo-50 group-hover:text-[#4F46E5]"
                                      }`}
                                    >
                                      <OptionIcon size={16} />
                                    </div>
                                    <div className="truncate">
                                      <div
                                        className={`text-xs font-bold transition-colors truncate ${
                                          isSelected
                                            ? "text-[#4F46E5]"
                                            : "text-[#0F172A] group-hover:text-[#4F46E5]"
                                        }`}
                                      >
                                        {option.label}
                                      </div>
                                      <div className="text-[10px] font-mono text-[#64748B] truncate mt-0.5">
                                        {option.sublabel}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span
                                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline ${
                                        isSelected
                                          ? "bg-indigo-100 text-[#4F46E5] font-bold"
                                          : "bg-neutral-100 text-[#64748B]"
                                      }`}
                                    >
                                      {option.badge}
                                    </span>
                                    {isSelected && (
                                      <div className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center">
                                        <Check size={12} strokeWidth={3} />
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recruiter Company & Team Size Fields */}
                  {accountType === "recruiter" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                          Company Name
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                            <Building2 size={16} />
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Flutterwave, Paystack"
                            value={recruiterData.companyName}
                            onChange={(e) => setRecruiterData({ ...recruiterData, companyName: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Custom Architectural Dropdown: Team Size */}
                      <div className="relative" ref={teamSizeRef}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                            Hiring Team Size
                          </label>
                          <span className="text-[10px] font-mono text-[#4F46E5] font-semibold">
                            {selectedTeamSize.badge}
                          </span>
                        </div>

                        {/* Dropdown Trigger Button */}
                        <button
                          type="button"
                          onClick={() => setTeamSizeDropdownOpen(!teamSizeDropdownOpen)}
                          aria-expanded={teamSizeDropdownOpen}
                          className={`w-full px-3.5 py-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer outline-none ${
                            teamSizeDropdownOpen
                              ? "bg-white border-[#4F46E5] ring-2 ring-[#4F46E5]/15 shadow-sm"
                              : "bg-[#FAFAF8] border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <Users size={16} className="text-[#4F46E5] flex-shrink-0" />
                            <span className="text-xs font-mono font-bold text-[#0F172A] truncate">
                              {selectedTeamSize.label}
                            </span>
                          </div>

                          <ChevronDown
                            size={16}
                            className={`text-[#64748B] flex-shrink-0 transition-transform duration-200 ${
                              teamSizeDropdownOpen ? "rotate-180 text-[#4F46E5]" : ""
                            }`}
                          />
                        </button>

                        {/* Floating Team Size Dropdown */}
                        {teamSizeDropdownOpen && (
                          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl overflow-hidden animate-fade-in-up">
                            <div className="px-3.5 py-2 bg-[#FAFAF8] border-b border-[#E5E7EB] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                              <span>// TEAM BANDWIDTH</span>
                              <span>SELECT SCALE</span>
                            </div>

                            <div className="p-1.5 space-y-0.5">
                              {TEAM_SIZE_OPTIONS.map((option) => {
                                const isSelected = option.id === recruiterData.teamSize;
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => {
                                      setRecruiterData({ ...recruiterData, teamSize: option.id });
                                      setTeamSizeDropdownOpen(false);
                                    }}
                                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer group ${
                                      isSelected
                                        ? "bg-indigo-50/70 border border-indigo-100/80"
                                        : "hover:bg-[#FAFAF8] border border-transparent"
                                    }`}
                                  >
                                    <div>
                                      <div
                                        className={`text-xs font-bold transition-colors ${
                                          isSelected
                                            ? "text-[#4F46E5]"
                                            : "text-[#0F172A] group-hover:text-[#4F46E5]"
                                        }`}
                                      >
                                        {option.label}
                                      </div>
                                      <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                                        {option.sublabel}
                                      </div>
                                    </div>

                                    {isSelected && (
                                      <div className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center flex-shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                        Create Secure Password
                      </label>
                      {activePassword && (
                        <span className="text-[10px] font-mono text-[#64748B]">
                          Strength: <span className="font-semibold text-[#0F172A]">{passwordStrength.label}</span>
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={activePassword}
                        onChange={(e) =>
                          accountType === "talent"
                            ? setTalentData({ ...talentData, password: e.target.value })
                            : setRecruiterData({ ...recruiterData, password: e.target.value })
                        }
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors focus:outline-none cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {activePassword && (
                      <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              step <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs hover:shadow-md hover:shadow-indigo-500/20 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>
                            {accountType === "talent"
                              ? "Generating Skill Passport Ledger..."
                              : "Configuring Recruiter Workspace..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {accountType === "talent"
                              ? "Generate Skill Passport"
                              : "Launch Recruiter Verification Engine"}
                          </span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-[11px] font-mono text-[#64748B] text-center mt-5 leading-relaxed">
                  By registering, you agree to Creda&apos;s{" "}
                  <Link href="#" className="underline hover:text-[#0F172A] transition-colors">
                    Protocol Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline hover:text-[#0F172A] transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Minimalist Footer ───────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-5 text-xs font-mono text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Creda Protocol v2.4 // All Verification Systems Operational</span>
          <span className="text-[#94A3B8] hidden sm:inline">SHA-256 Ledger Node</span>
        </div>
      </footer>
    </div>
  );
}
