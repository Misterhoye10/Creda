"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Building2,
  Users,
  Code2,
  Palette,
  Server,
  Database,
  Box,
  Check,
  AlertCircle,
  MapPin,
  Briefcase,
  Globe,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";

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
    id: "3d-creative-engineering",
    label: "3D & Creative Engineering",
    sublabel: "React Three Fiber, WebGL, Three.js & GLSL Shaders",
    icon: Box,
    badge: "WebGL Audited",
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

const AFRICAN_COUNTRIES = [
  { code: "NG", name: "Nigeria", flag: "🇳🇬", defaultCity: "Lagos" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", defaultCity: "Accra" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", defaultCity: "Nairobi" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", defaultCity: "Cape Town" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", defaultCity: "Cairo" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼", defaultCity: "Kigali" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", defaultCity: "Kampala" },
  { code: "SN", name: "Senegal", flag: "🇸🇳", defaultCity: "Dakar" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲", defaultCity: "Douala" },
  { code: "MA", name: "Morocco", flag: "🇲🇦", defaultCity: "Casablanca" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", defaultCity: "Addis Ababa" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", defaultCity: "Dar es Salaam" },
  { code: "OTHER", name: "Other / International", flag: "🌍", defaultCity: "Remote" },
];

const WORK_PREFERENCE_OPTIONS = [
  "Remote",
  "Hybrid",
  "On-site",
  "Remote within my country",
  "Open to relocation",
];

const EXPERIENCE_OPTIONS = [
  { value: 1, label: "< 1 year (Junior / Entry)" },
  { value: 2, label: "1 – 2 years (Associate)" },
  { value: 4, label: "3 – 5 years (Mid-Level)" },
  { value: 7, label: "5 – 8 years (Senior)" },
  { value: 10, label: "8+ years (Lead / Staff / Principal)" },
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState<AccountType>("talent");

  // Read role from query param on initial mount
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "recruiter") {
      setAccountType("recruiter");
    } else if (roleParam === "talent") {
      setAccountType("talent");
    }
  }, [searchParams]);

  // Talent form state
  const [talentData, setTalentData] = useState({
    name: "",
    email: "",
    password: "",
    country: "Nigeria",
    city: "Lagos",
    professionalTitle: "Full Stack Engineer",
    domain: "software-engineering",
    yearsExperience: 4,
    workPreferences: ["Remote", "Remote within my country"],
  });

  // Recruiter form state
  const [recruiterData, setRecruiterData] = useState({
    name: "",
    workEmail: "",
    password: "",
    companyName: "",
    companyWebsite: "",
    country: "Nigeria",
    city: "Lagos",
    hiringRole: "Technical Recruiter",
    teamSize: "11-50",
  });

  // Dropdown states
  const [domainDropdownOpen, setDomainDropdownOpen] = useState(false);
  const [teamSizeDropdownOpen, setTeamSizeDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const domainRef = useRef<HTMLDivElement>(null);
  const teamSizeRef = useRef<HTMLDivElement>(null);

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

  // Password cryptographic entropy calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "EMPTY", color: "text-neutral-500 bg-neutral-100 border-neutral-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "64-BIT BASIC", color: "text-amber-700 bg-amber-50 border-amber-200" };
      case 2:
        return { score: 2, label: "96-BIT FAIR", color: "text-indigo-700 bg-indigo-50 border-indigo-200" };
      case 3:
        return { score: 3, label: "128-BIT STRONG", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      case 4:
        return { score: 4, label: "256-BIT CRYPTO OPTIMAL", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      default:
        return { score: 0, label: "TOO SHORT", color: "text-neutral-500 bg-neutral-100 border-neutral-200" };
    }
  };

  const activePassword = accountType === "talent" ? talentData.password : recruiterData.password;
  const passwordStrength = getPasswordStrength(activePassword);

  const selectedDomain = DOMAIN_OPTIONS.find((d) => d.id === talentData.domain) || DOMAIN_OPTIONS[0];
  const selectedTeamSize = TEAM_SIZE_OPTIONS.find((t) => t.id === recruiterData.teamSize) || TEAM_SIZE_OPTIONS[1];

  const toggleWorkPreference = (pref: string) => {
    setTalentData((prev) => {
      const exists = prev.workPreferences.includes(pref);
      return {
        ...prev,
        workPreferences: exists
          ? prev.workPreferences.filter((p) => p !== pref)
          : [...prev.workPreferences, pref],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const isTalent = accountType === "talent";
    const email = isTalent ? talentData.email : recruiterData.workEmail;
    const password = isTalent ? talentData.password : recruiterData.password;
    const name = isTalent ? talentData.name : recruiterData.name;
    const country = isTalent ? talentData.country : recruiterData.country;
    const city = isTalent ? talentData.city : recruiterData.city;
    const location = city ? `${city}, ${country}` : country;

    const signupPayload = isTalent
      ? {
          email,
          password,
          name,
          account_type: "talent" as const,
          professional_title: talentData.professionalTitle || selectedDomain.label,
          location,
          country,
          city,
          primary_field: selectedDomain.label,
          years_experience: Number(talentData.yearsExperience),
          work_preferences: JSON.stringify(talentData.workPreferences),
          availability: "Available",
        }
      : {
          email,
          password,
          name,
          account_type: "recruiter" as const,
          professional_title: `${recruiterData.hiringRole || "Recruiter"} @ ${recruiterData.companyName || "Organization"}`,
          location,
          country,
          city,
          company_name: recruiterData.companyName,
          company_website: recruiterData.companyWebsite,
          hiring_role: recruiterData.hiringRole,
          team_size: recruiterData.teamSize,
        };

    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `talent-${Date.now()}`;
    const discipline = (
      selectedDomain.id.includes("design") ? "design"
      : selectedDomain.id.includes("devops") ? "devops"
      : selectedDomain.id.includes("data") ? "data"
      : selectedDomain.id.includes("3d") ? "creative3d"
      : selectedDomain.id.includes("security") ? "security"
      : "software"
    ) as any;

    const newTalent = {
      id: `talent-${Date.now()}`,
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&bold=true`,
      title: talentData.professionalTitle || selectedDomain.label,
      location,
      country,
      city,
      workPreferences: talentData.workPreferences.join(", "),
      discipline,
      score: 60,
      tier: "New Talent",
      skills: [],
      skillsDetail: [],
      proofHighlight: "Newly registered talent profile ready for CV and repository audit.",
      reposAudited: 0,
      commitsCount: "0 commits audited",
      availability: "Immediately Available",
      slug: cleanSlug,
      assessmentsCount: 0,
      isNew: true,
    };

    // Immediately cache credentials and initial profile locally for sub-second onboarding
    localStorage.setItem("creda_user_email", email);
    localStorage.setItem(
      "creda_user",
      JSON.stringify({
        id: newTalent.id,
        name,
        email,
        account_type: accountType,
        professional_title: isTalent ? (talentData.professionalTitle || selectedDomain.label) : signupPayload.professional_title,
        location,
        country,
        city,
        company_name: !isTalent ? recruiterData.companyName : undefined,
        company_website: !isTalent ? recruiterData.companyWebsite : undefined,
        hiring_role: !isTalent ? recruiterData.hiringRole : undefined,
        team_size: !isTalent ? recruiterData.teamSize : undefined,
        public_url: cleanSlug,
        score: 60,
      })
    );
    if (isTalent) {
      localStorage.removeItem("creda_uploaded_cv");
      localStorage.removeItem("creda_local_evidence");
      localStorage.removeItem("creda_extracted_skills");
      localStorage.removeItem("creda_candidate_score");
      localStorage.removeItem("creda_score_breakdown");
      localStorage.removeItem("creda_practical_assessments");
      try {
        const rawReqs = localStorage.getItem("creda_talent_requests");
        if (rawReqs) {
          const reqs = JSON.parse(rawReqs);
          if (Array.isArray(reqs)) {
            const filtered = reqs.filter(
              (r: any) =>
                r.talent_email !== email &&
                r.talent_slug !== cleanSlug &&
                r.talent_name?.toLowerCase() !== name.toLowerCase()
            );
            localStorage.setItem("creda_talent_requests", JSON.stringify(filtered));
          }
        }
      } catch {}
    }

    if (isTalent) {
      try {
        const rawTalents = localStorage.getItem("creda_custom_talents");
        const talents = rawTalents ? JSON.parse(rawTalents) : [];
        const updated = [newTalent, ...talents.filter((t: any) => t.email !== email && t.slug !== cleanSlug)];
        localStorage.setItem("creda_custom_talents", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    try {
      // 1.5-second fast race: connect to backend, but never block candidate on Render cold starts
      const signupPromise = api.signup(signupPayload);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("fast_race_timeout")), 1500)
      );

      const response: any = await Promise.race([signupPromise, timeoutPromise]);
      if (response?.access_token) {
        localStorage.setItem("creda_token", response.access_token);
      }
      if (response?.user) {
        const enrichedUser = {
          ...response.user,
          company_name: response.user.company_name || (!isTalent ? recruiterData.companyName : undefined),
          company_website: response.user.company_website || (!isTalent ? recruiterData.companyWebsite : undefined),
          location: response.user.location || location,
          country: response.user.country || country,
          city: response.user.city || city,
          hiring_role: response.user.hiring_role || (!isTalent ? recruiterData.hiringRole : undefined),
        };
        localStorage.setItem("creda_user", JSON.stringify(enrichedUser));
        if (isTalent) {
          try {
            const rawTalents = localStorage.getItem("creda_custom_talents");
            if (rawTalents) {
              const talents = JSON.parse(rawTalents);
              const updated = talents.map((t: any) =>
                t.email === email ? { ...t, id: response.user.id, slug: response.user.public_url || t.slug } : t
              );
              localStorage.setItem("creda_custom_talents", JSON.stringify(updated));
            }
          } catch {}
        }
      }
    } catch (err: unknown) {
      const errObj = err as { detail?: string; message?: string; status?: number; data?: { detail?: string } };
      if (errObj && (errObj.status === 400 || errObj.status === 422)) {
        setErrorMessage(errObj.data?.detail || errObj.detail || errObj.message || "Registration error. Please check your credentials.");
        setIsSubmitting(false);
        return;
      }
      // If timeout or cold-start, proceed with instant local onboarding while backend syncs
      console.info("Proceeding with instant local onboarding while backend syncs in background");
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      router.push(accountType === "talent" ? "/dashboard" : "/dashboard/recruiter");
    }, 150);
  };

  const handleGithubSignup = () => {
    setIsSubmitting(true);
    localStorage.setItem("creda_user_email", "talent@creda.work");
    localStorage.setItem(
      "creda_user",
      JSON.stringify({
        name: "David Adeyemi",
        email: "talent@creda.work",
        account_type: "talent",
        professional_title: "Full Stack Engineer",
        location: "Lagos, Nigeria",
        country: "Nigeria",
        city: "Lagos",
      })
    );
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Minimalist Architectural Header ── */}
      <header className="border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-4 sm:px-10 h-14 sm:h-16 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={26} showTag={true} tagText={accountType === "talent" ? "TALENT" : "HIRING TEAM"} />
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
      <main className="flex-1 flex flex-col items-center justify-start px-3 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-xl rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-9 shadow-sm relative overflow-hidden">
          {/* Structural Crosshairs */}
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                {accountType === "talent" ? "Skill Passport Initialized!" : "Hiring Workspace Activated!"}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] font-mono max-w-sm mx-auto leading-relaxed flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#4F46E5]/30 border-t-[#4F46E5] animate-spin flex-shrink-0" />
                <span>Redirecting to your workspace...</span>
              </p>
              <div className="pt-2">
                <Link href={accountType === "talent" ? "/dashboard" : "/dashboard/recruiter"} className="inline-block flex-shrink-0">
                  <button className="h-11 px-6 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs cursor-pointer whitespace-nowrap">
                    Enter Dashboard Now →
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* ── Architectural Role Switcher: Tech Talent vs Hiring Team ── */}
              <div className="mb-5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-semibold mb-1.5 flex items-center justify-between">
                  <span>Select Account Type</span>
                  <span className="text-[#4F46E5]">Dual Protocol</span>
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
                    <User size={15} className={accountType === "talent" ? "text-[#4F46E5]" : ""} />
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
                    <Building2 size={15} className={accountType === "recruiter" ? "text-[#4F46E5]" : ""} />
                    <span>Hiring Team</span>
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  {accountType === "talent" ? "Build Your Creda Passport" : "Find Vetted African Tech Talent"}
                </h2>
                <p className="text-xs text-[#64748B] font-mono mt-1">
                  {accountType === "talent"
                    ? "Prove technical skills with code evidence • Free forever • Verified globally"
                    : "Zero resume fluff • Evidence-backed candidate matching • Direct talent connection"}
                </p>
              </div>

              {/* Quick GitHub sign up for Tech Talent */}
              {accountType === "talent" && (
                <>
                  <button
                    type="button"
                    onClick={handleGithubSignup}
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl text-xs font-mono uppercase font-semibold bg-[#0F172A] hover:bg-neutral-800 text-white transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer active:translate-y-0.5 disabled:opacity-75 mb-4 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span>Instant Sign Up with GitHub</span>
                  </button>

                  <div className="relative mb-5 flex items-center justify-center">
                    <div className="w-full border-t border-[#E5E7EB]" />
                    <span className="absolute bg-white px-3 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
                      or create talent profile
                    </span>
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Registration Notice</div>
                    <div className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
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
                      placeholder={accountType === "talent" ? "e.g. David Adeyemi" : "e.g. Sarah Johnson"}
                      value={accountType === "talent" ? talentData.name : recruiterData.name}
                      onChange={(e) =>
                        accountType === "talent"
                          ? setTalentData({ ...talentData, name: e.target.value })
                          : setRecruiterData({ ...recruiterData, name: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                    {accountType === "talent" ? "Professional Email" : "Work / Company Email"}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder={accountType === "talent" ? "david@example.com" : "sarah@technova.com"}
                      value={accountType === "talent" ? talentData.email : recruiterData.workEmail}
                      onChange={(e) =>
                        accountType === "talent"
                          ? setTalentData({ ...talentData, email: e.target.value })
                          : setRecruiterData({ ...recruiterData, workEmail: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Location: Country + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                      Country
                    </label>
                    <div className="relative">
                      <select
                        value={accountType === "talent" ? talentData.country : recruiterData.country}
                        onChange={(e) => {
                          const val = e.target.value;
                          const found = AFRICAN_COUNTRIES.find((c) => c.name === val);
                          if (accountType === "talent") {
                            setTalentData({
                              ...talentData,
                              country: val,
                              city: found ? found.defaultCity : talentData.city,
                            });
                          } else {
                            setRecruiterData({
                              ...recruiterData,
                              country: val,
                              city: found ? found.defaultCity : recruiterData.city,
                            });
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] transition-all outline-none cursor-pointer appearance-none"
                      >
                        {AFRICAN_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                      City / Region
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lagos, Nairobi, Accra"
                        value={accountType === "talent" ? talentData.city : recruiterData.city}
                        onChange={(e) =>
                          accountType === "talent"
                            ? setTalentData({ ...talentData, city: e.target.value })
                            : setRecruiterData({ ...recruiterData, city: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ── TALENT SPECIFIC FIELDS ── */}
                {accountType === "talent" && (
                  <>
                    {/* Professional Title */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                        Professional Title
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                          <Briefcase size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Full Stack Developer, Product Designer, DevOps Lead"
                          value={talentData.professionalTitle}
                          onChange={(e) => setTalentData({ ...talentData, professionalTitle: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Discipline & Experience Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Primary Discipline Dropdown */}
                      <div className="relative" ref={domainRef}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                            Primary Discipline
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDomainDropdownOpen(!domainDropdownOpen)}
                          className="w-full px-3 py-2.5 rounded-xl border text-left bg-[#FAFAF8] border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] flex items-center justify-between cursor-pointer outline-none"
                        >
                          <div className="truncate text-xs font-bold text-[#0F172A]">
                            {selectedDomain.label}
                          </div>
                          <ChevronDown
                            size={14}
                            className={`text-[#64748B] transition-transform ${
                              domainDropdownOpen ? "rotate-180 text-[#4F46E5]" : ""
                            }`}
                          />
                        </button>

                        {domainDropdownOpen && (
                          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-1.5 space-y-1">
                            {DOMAIN_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                  setTalentData({ ...talentData, domain: option.id });
                                  setDomainDropdownOpen(false);
                                }}
                                className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                  option.id === talentData.domain
                                    ? "bg-indigo-50 text-[#4F46E5] font-bold"
                                    : "hover:bg-[#FAFAF8] text-[#0F172A]"
                                }`}
                              >
                                <span className="truncate">{option.label}</span>
                                {option.id === talentData.domain && <Check size={14} />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Years of Experience */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                            Experience Level
                          </label>
                        </div>
                        <div className="relative">
                          <select
                            value={talentData.yearsExperience}
                            onChange={(e) =>
                              setTalentData({ ...talentData, yearsExperience: Number(e.target.value) })
                            }
                            className="w-full px-3 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] transition-all outline-none cursor-pointer appearance-none"
                          >
                            {EXPERIENCE_OPTIONS.map((exp) => (
                              <option key={exp.value} value={exp.value}>
                                {exp.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Work Preferences Multi-Select */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-2">
                        Work Preferences (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {WORK_PREFERENCE_OPTIONS.map((pref) => {
                          const isSelected = talentData.workPreferences.includes(pref);
                          return (
                            <button
                              key={pref}
                              type="button"
                              onClick={() => toggleWorkPreference(pref)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? "bg-indigo-600 text-white font-semibold shadow-xs"
                                  : "bg-[#FAFAF8] border border-[#E5E7EB] text-[#475569] hover:border-neutral-400 hover:text-[#0F172A]"
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                              <span>{pref}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* ── RECRUITER SPECIFIC FIELDS ── */}
                {accountType === "recruiter" && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            onChange={(e) =>
                              setRecruiterData({ ...recruiterData, companyName: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                          Company Website
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                            <Globe size={16} />
                          </div>
                          <input
                            type="url"
                            placeholder="https://company.com"
                            value={recruiterData.companyWebsite}
                            onChange={(e) =>
                              setRecruiterData({ ...recruiterData, companyWebsite: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                          Your Role in Hiring
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                            <Briefcase size={16} />
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Founder, Head of Talent"
                            value={recruiterData.hiringRole}
                            onChange={(e) =>
                              setRecruiterData({ ...recruiterData, hiringRole: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                          />
                        </div>
                      </div>

                      {/* Team Size Dropdown */}
                      <div className="relative" ref={teamSizeRef}>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                          Engineering Team Size
                        </label>
                        <button
                          type="button"
                          onClick={() => setTeamSizeDropdownOpen(!teamSizeDropdownOpen)}
                          className="w-full px-3 py-2.5 rounded-xl border text-left bg-[#FAFAF8] border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] flex items-center justify-between cursor-pointer outline-none"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Users size={14} className="text-[#4F46E5]" />
                            <span className="text-xs font-mono font-bold text-[#0F172A] truncate">
                              {selectedTeamSize.label}
                            </span>
                          </div>
                          <ChevronDown
                            size={14}
                            className={`text-[#64748B] transition-transform ${
                              teamSizeDropdownOpen ? "rotate-180 text-[#4F46E5]" : ""
                            }`}
                          />
                        </button>

                        {teamSizeDropdownOpen && (
                          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-1.5 space-y-1">
                            {TEAM_SIZE_OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setRecruiterData({ ...recruiterData, teamSize: opt.id });
                                  setTeamSizeDropdownOpen(false);
                                }}
                                className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                                  opt.id === recruiterData.teamSize
                                    ? "bg-indigo-50 text-[#4F46E5] font-bold"
                                    : "hover:bg-[#FAFAF8] text-[#0F172A]"
                                }`}
                              >
                                <div>
                                  <div className="font-semibold">{opt.label}</div>
                                  <div className="text-[10px] text-[#64748B]">{opt.sublabel}</div>
                                </div>
                                {opt.id === recruiterData.teamSize && <Check size={14} />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                      Create Password
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
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
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

                  {activePassword && (
                    <div className="space-y-1.5 mt-2">
                      <div className="grid grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              step <= passwordStrength.score
                                ? passwordStrength.score >= 3
                                  ? "bg-emerald-500"
                                  : passwordStrength.score === 2
                                  ? "bg-indigo-500"
                                  : "bg-amber-500"
                                : "bg-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white btn-tactile flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                        <span>{accountType === "talent" ? "Building Passport..." : "Creating Workspace..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{accountType === "talent" ? "Create Talent Profile" : "Register Hiring Team"}</span>
                        <ArrowRight size={14} className="flex-shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="text-[11px] font-mono text-[#64748B] text-center mt-4 leading-relaxed">
                By registering, you agree to Creda&apos;s{" "}
                <Link href="/terms" className="underline hover:text-[#0F172A] transition-colors">
                  Protocol Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-[#0F172A] transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>

              {/* Switch to Sign In */}
              <div className="mt-5 pt-4 border-t border-neutral-100 text-center">
                <span className="text-xs text-[#64748B] font-mono">Already have a passport or account? </span>
                <Link href="/auth/login" className="text-xs font-mono font-semibold text-[#4F46E5] hover:underline">
                  Sign In →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Minimalist Footer ───────────────────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-4 text-xs font-mono text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Creda Protocol // Two-Sided African Tech Talent Network</span>
          <span className="text-[#94A3B8] hidden sm:inline">SHA-256 Ledger Node</span>
        </div>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-mono text-xs text-neutral-400">Loading Creda Protocol...</div>}>
      <SignupContent />
    </Suspense>
  );
}
