"use client";

import { useState } from "react";
import Link from "next/link";
import { useInView, useCountUp, useScrolled } from "@/hooks/useAnimations";
import { CredaLogo } from "@/components/CredaLogo";
import {
  ShieldCheck,
  FileWarning,
  Clock,
  MapPinOff,
  GitBranch,
  Cpu,
  Fingerprint,
  AlertCircle,
  Sparkles,
  Code2,
  Crown,
  Terminal,
  Server,
  Database,
  Lock,
  ChevronDown,
  ArrowRight,
  Activity,
  Menu,
  X,
  Users,
  Building2,
  Zap,
  ExternalLink,
  Check,
  Quote,
  BadgeCheck,
} from "lucide-react";

// Suppress third-party browser extension errors (e.g. MetaMask inpage.js) from triggering Next.js dev overlay
if (typeof window !== "undefined") {
  const isExtensionError = (err: unknown, str?: string) => {
    const text = `${str || ""} ${err instanceof Error ? `${err.message} ${err.stack}` : String(err || "")}`;
    return (
      text.includes("MetaMask") ||
      text.includes("chrome-extension://") ||
      text.includes("moz-extension://") ||
      text.includes("extension not found")
    );
  };
  window.addEventListener(
    "unhandledrejection",
    (e) => {
      if (isExtensionError(e.reason, e.reason?.message)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );
  window.addEventListener(
    "error",
    (e) => {
      if (isExtensionError(e.error, `${e.filename || ""} ${e.message || ""}`)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true
  );
}

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const scrolled = useScrolled(20);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // ── Scroll-triggered sections ──
  const hero = useInView();
  const trustStrip = useInView();
  const problem = useInView();
  const protocol = useInView();
  const tiers = useInView();
  const audience = useInView();
  const testimonials = useInView();
  const pricing = useInView();
  const faq = useInView();
  const cta = useInView();
  const ledger = useInView();

  // ── Animated trust index counter ──
  const trustScore = useCountUp(96.4, 2200, ledger.inView);

  // ── Skill percentages ──
  const skills = [
    {
      name: "TypeScript & Node Engine",
      pct: 98,
      desc: "1,420 commits analyzed across 14 repositories. AST validation confirmed high-throughput API patterns & strict typing.",
      repos: "14 Repositories",
      tier: "Code-Proven Tier",
      icon: Terminal,
    },
    {
      name: "Distributed Go Microservices",
      pct: 94,
      desc: "Concurrency pipelines, gRPC services, and Redis caching. Commits verified with signed GPG keys on production branches.",
      repos: "26 Pull Requests",
      tier: "Code-Proven Tier",
      icon: Server,
    },
    {
      name: "PostgreSQL & DB Optimization",
      pct: 91,
      desc: "Complex indexing, connection pooling, and schema migration records verified from production repos.",
      repos: "Schema Audited",
      tier: "Code-Proven Tier",
      icon: Database,
    },
    {
      name: "System Architecture & Security",
      pct: 89,
      desc: "OWASP security hardening, Docker containers, and CI/CD pipelines verified against live deployed staging endpoints.",
      repos: "CI/CD Verified",
      tier: "Top Strength Tier",
      icon: Lock,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen selection:bg-[#4F46E5] selection:text-white">
      {/* ── Top Announcement Bar (AgentLab Style) ─────────── */}
      <div className="w-full bg-[#0F172A] text-white border-b border-neutral-800 py-2.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-mono tracking-tight">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
          <span className="text-[#818CF8] font-semibold">[ PROTOCOL V2.4 ]</span>
          <span className="text-neutral-300 hidden sm:inline">NOW VERIFYING SOFTWARE ENGINEERING, DEVOPS & CYBERSECURITY TALENT</span>
          <Link href="#protocol" className="text-white hover:text-[#818CF8] underline ml-1 cursor-pointer transition-colors">
            LEARN MORE →
          </Link>
        </div>
      </div>

      {/* ── Minimalist Architectural Header (Oberon Style) ── */}
      <nav className={`sticky top-0 z-50 w-full bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center tracking-tight">
            <CredaLogo size={34} showTag={true} tagText="CRD" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-10 text-xs font-mono text-[#475569] uppercase tracking-wider font-medium">
            {[
              { href: "#problem", label: "The Problem" },
              { href: "#protocol", label: "Protocol" },
              { href: "#tiers", label: "Trust Tiers" },
              { href: "#recruiters", label: "For Recruiters" },
              { href: "#testimonials", label: "Outcomes" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#0F172A] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#4F46E5] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-5">
            <Link
              href="/auth/login"
              className="text-xs font-mono uppercase text-[#475569] hover:text-[#0F172A] transition-colors font-medium hidden sm:block"
            >
              Sign In
            </Link>
            <Link href="/auth/signup" className="flex-shrink-0">
              <button className="px-5 py-2.5 rounded text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 shadow-xs hover:shadow-indigo-500/20 active:translate-y-0.5 active:shadow-none whitespace-nowrap flex-shrink-0">
                Claim Passport →
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Architectural Light Canvas) ──────── */}
      <section ref={hero.ref} className="relative w-full pt-24 pb-28 px-6 sm:px-8 border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Status Tag */}
          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded border border-neutral-300 bg-white text-xs font-mono text-[#475569] uppercase tracking-widest mb-10 shadow-xs reveal ${hero.inView ? 'revealed' : ''}`}>
            <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
            AI-Powered Proof-of-Work Verification
          </div>

          {/* Editorial Display Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#0F172A] mb-8 max-w-4xl leading-[1.12] reveal ${hero.inView ? 'revealed' : ''}`} style={{ transitionDelay: '120ms' }}>
            Prove what you can{" "}
            <span className="font-serif italic font-normal text-[#4F46E5]">
              actually do.
            </span>
          </h1>

          {/* Subheadline */}
          <p className={`text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto mb-12 leading-[1.75] font-normal reveal ${hero.inView ? 'revealed' : ''}`} style={{ transitionDelay: '240ms' }}>
            Traditional CVs are filled with unproven claims. Creda analyzes your real
            GitHub commits, PR velocity, and repository syntax trees to issue a
            cryptographically verifiable <strong className="text-[#0F172A] font-semibold">Skill Passport</strong> that
            global recruiters trust.
          </p>

          {/* Action Row */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto reveal ${hero.inView ? 'revealed' : ''}`} style={{ transitionDelay: '360ms' }}>
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-13 px-8 rounded text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 shadow-md active:translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20 whitespace-nowrap">
                Claim Free Passport →
              </button>
            </Link>
            <Link href="#ledger-preview" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-13 px-8 rounded text-xs font-mono uppercase font-semibold bg-white hover:bg-neutral-50 text-[#0F172A] border border-neutral-300 transition-all duration-200 shadow-xs hover:border-neutral-400 whitespace-nowrap">
                Explore Sample Ledger ↓
              </button>
            </Link>
          </div>

          {/* ── Central Architectural Artifact: Titanium Obsidian Ledger Card ── */}
          <div
            ref={ledger.ref}
            id="ledger-preview"
            className={`w-full max-w-4xl rounded-2xl border border-neutral-800 bg-[#0D1117] text-left overflow-hidden shadow-2xl relative reveal-scale ${ledger.inView ? 'revealed' : ''}`}
          >
            {/* Ledger Top Bar */}
            <div className="px-6 py-3.5 border-b border-neutral-800 bg-[#070A0F] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="text-[#818CF8] font-bold">● LEDGER ID:</span>
                <span className="text-white font-medium">CRD-2026-9042</span>
                <span className="text-neutral-600">|</span>
                <span>SHA-256: e8b94f1c7d20a</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
                <span className="text-[10px] uppercase font-bold text-[#818CF8] bg-[#4F46E5]/15 px-2.5 py-1 rounded border border-[#4F46E5]/40">
                  CODE-PROVEN LEDGER
                </span>
              </div>
            </div>

            {/* Candidate Header */}
            <div className="p-8 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl border border-neutral-700 bg-neutral-800 flex items-center justify-center font-mono font-bold text-xl text-white shadow-inner">
                  AA
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">Amina Adeleke</h3>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                      Lagos, Nigeria
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Senior Systems & Backend Engineer // 6 Years Production Experience
                  </p>
                </div>
              </div>

              {/* Overall Trust Index — Animated Counter */}
              <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-neutral-400 font-medium">Overall Trust Index</div>
                  <div className="text-xs font-mono font-bold text-[#818CF8]">Top 3% African Tech Talent</div>
                </div>
                <div className="text-3xl font-mono font-extrabold text-white pl-3 border-l border-neutral-800">
                  {trustScore}<span className="text-xs font-normal text-neutral-400">%</span>
                </div>
              </div>
            </div>

            {/* Verification Evidence Nodes (Oberon Style Grid) */}
            <div className={`p-8 grid grid-cols-1 md:grid-cols-2 gap-5 reveal-stagger`}>
              {skills.map((skill, i) => (
                <div
                  key={skill.name}
                  className={`p-5 rounded-xl border border-neutral-800 bg-[#070A0F]/70 flex flex-col justify-between card-hover-dark reveal ${ledger.inView ? 'revealed' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                        <span className="text-sm font-semibold text-white">{skill.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded">
                        {skill.pct}%
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-[1.6]">
                      {skill.desc}
                    </p>
                    {/* Animated skill bar */}
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        style={{ width: ledger.inView ? `${skill.pct}%` : '0%' }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>{skill.repos}</span>
                    <span className="text-[#818CF8] font-medium">{skill.tier}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ledger Footer Status — Blinking Cursor */}
            <div className="px-8 py-4 border-t border-neutral-800 bg-[#070A0F] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
                <span className="text-white font-medium cursor-blink">IN-MEMORY AST ANALYSIS // 0% SYNTHETIC INFLATION DETECTED</span>
              </div>
              <span className="text-[#818CF8] font-semibold">creda.app/p/amina-adeleke</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Monochrome Trust Strip: Animated Company Logos Carousel ─ */}
      <section ref={trustStrip.ref} className="py-20 border-b border-[#E5E7EB] bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-[#FAFAF8] text-[11px] font-mono text-[#64748B] uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            LIVE VERIFIED TALENT ECOSYSTEM
          </div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#0F172A] font-bold">
            TRUSTED BY ENGINEERS & TEAMS AT 200+ TECH LEADERS
          </p>
        </div>

        {/* Carousel Container with edge gradient masks */}
        <div className="relative w-full overflow-hidden marquee-container">
          {/* Left and right fade gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Continuous Left-to-Right Moving Track */}
          <div className="animate-marquee-right flex items-center gap-6 py-2">
            {[
              {
                name: "Paystack",
                category: "Fintech // Stripe",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="3" rx="1.5" />
                    <rect x="3" y="10.5" width="13" height="3" rx="1.5" />
                    <rect x="3" y="17" width="18" height="3" rx="1.5" />
                  </svg>
                ),
              },
              {
                name: "Moniepoint",
                category: "Business Banking",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14.5h-2.2v-5.2l-1.8 3.5h-1l-1.8-3.5v5.2H7.5V7.5h2.1l2.4 4.6 2.4-4.6h2.1v9z" />
                  </svg>
                ),
              },
              {
                name: "Flutterwave",
                category: "Global Payments",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4 12c1.8-4.2 6.2-7 11.2-7 2.1 0 4.1.5 5.8 1.4-1.2.6-2.5 1-3.8 1-3.8 0-7.2 2-9.1 5.1C7.2 14.8 6 17.5 5.5 20.5 4.9 17.8 4.5 15 4 12z" opacity="0.6" />
                    <path d="M7 15.5c1.4-2.8 4.2-4.7 7.5-4.7 1.8 0 3.5.6 4.9 1.6-1 .8-2.2 1.3-3.4 1.3-2.6 0-4.9 1.4-6.2 3.5-.8 1.4-1.4 3-1.7 4.8-.6-2.2-.9-4.3-1.1-6.5z" />
                  </svg>
                ),
              },
              {
                name: "Andela",
                category: "Global Talent",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M12 3L3.5 8V16L12 21L20.5 16V8L12 3Z" />
                    <path d="M12 7.5L7 16H17L12 7.5Z" />
                  </svg>
                ),
              },
              {
                name: "Chipper Cash",
                category: "Cross-Border",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <circle cx="8" cy="12" r="6" fillOpacity="0.35" />
                    <circle cx="16" cy="12" r="6" fillOpacity="0.85" />
                  </svg>
                ),
              },
              {
                name: "Kuda Bank",
                category: "Digital Bank",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 6v12M8 12l6.5-6M9.5 10.5l5.5 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                name: "Interswitch",
                category: "Switching Rails",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="7" cy="12" r="3" fill="currentColor" />
                    <circle cx="17" cy="12" r="3" fill="currentColor" />
                    <path d="M7 8c2.5-3.5 7.5-3.5 10 0M17 16c-2.5 3.5-7.5 3.5-10 0" />
                  </svg>
                ),
              },
              {
                name: "PiggyVest",
                category: "WealthTech",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="4" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 9v6M9 12h6" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                name: "OPay",
                category: "SuperApp & Pay",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                ),
              },
              {
                name: "Wave",
                category: "Mobile Money (YC)",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M2 12c3-3 6-3 9 0s6 3 9 0M2 17c3-3 6-3 9 0s6 3 9 0M2 7c3-3 6-3 9 0s6 3 9 0" />
                  </svg>
                ),
              },
              {
                name: "LemFi",
                category: "Diaspora Banking",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4 4h5l6.5 12h4.5v4h-7L6.5 8H4V4z" />
                  </svg>
                ),
              },
              {
                name: "Reliance Health",
                category: "HealthTech Infra",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10M7 12h10" strokeLinecap="round" />
                  </svg>
                ),
              },
              /* Duplicate sequence for seamless 100% infinite loop */
              {
                name: "Paystack",
                category: "Fintech // Stripe",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="3" rx="1.5" />
                    <rect x="3" y="10.5" width="13" height="3" rx="1.5" />
                    <rect x="3" y="17" width="18" height="3" rx="1.5" />
                  </svg>
                ),
              },
              {
                name: "Moniepoint",
                category: "Business Banking",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14.5h-2.2v-5.2l-1.8 3.5h-1l-1.8-3.5v5.2H7.5V7.5h2.1l2.4 4.6 2.4-4.6h2.1v9z" />
                  </svg>
                ),
              },
              {
                name: "Flutterwave",
                category: "Global Payments",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4 12c1.8-4.2 6.2-7 11.2-7 2.1 0 4.1.5 5.8 1.4-1.2.6-2.5 1-3.8 1-3.8 0-7.2 2-9.1 5.1C7.2 14.8 6 17.5 5.5 20.5 4.9 17.8 4.5 15 4 12z" opacity="0.6" />
                    <path d="M7 15.5c1.4-2.8 4.2-4.7 7.5-4.7 1.8 0 3.5.6 4.9 1.6-1 .8-2.2 1.3-3.4 1.3-2.6 0-4.9 1.4-6.2 3.5-.8 1.4-1.4 3-1.7 4.8-.6-2.2-.9-4.3-1.1-6.5z" />
                  </svg>
                ),
              },
              {
                name: "Andela",
                category: "Global Talent",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M12 3L3.5 8V16L12 21L20.5 16V8L12 3Z" />
                    <path d="M12 7.5L7 16H17L12 7.5Z" />
                  </svg>
                ),
              },
              {
                name: "Chipper Cash",
                category: "Cross-Border",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <circle cx="8" cy="12" r="6" fillOpacity="0.35" />
                    <circle cx="16" cy="12" r="6" fillOpacity="0.85" />
                  </svg>
                ),
              },
              {
                name: "Kuda Bank",
                category: "Digital Bank",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 6v12M8 12l6.5-6M9.5 10.5l5.5 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                name: "Interswitch",
                category: "Switching Rails",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                    <circle cx="7" cy="12" r="3" fill="currentColor" />
                    <circle cx="17" cy="12" r="3" fill="currentColor" />
                    <path d="M7 8c2.5-3.5 7.5-3.5 10 0M17 16c-2.5 3.5-7.5 3.5-10 0" />
                  </svg>
                ),
              },
              {
                name: "PiggyVest",
                category: "WealthTech",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="4" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
                    <path d="M12 9v6M9 12h6" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                name: "OPay",
                category: "SuperApp & Pay",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                ),
              },
              {
                name: "Wave",
                category: "Mobile Money (YC)",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M2 12c3-3 6-3 9 0s6 3 9 0M2 17c3-3 6-3 9 0s6 3 9 0M2 7c3-3 6-3 9 0s6 3 9 0" />
                  </svg>
                ),
              },
              {
                name: "LemFi",
                category: "Diaspora Banking",
                logo: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4 4h5l6.5 12h4.5v4h-7L6.5 8H4V4z" />
                  </svg>
                ),
              },
              {
                name: "Reliance Health",
                category: "HealthTech Infra",
                logo: (
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v10M7 12h10" strokeLinecap="round" />
                  </svg>
                ),
              },
            ].map((company, idx) => (
              <div
                key={`${company.name}-${idx}`}
                className="flex items-center gap-3.5 px-5 py-3 rounded-xl border border-neutral-200/90 bg-[#FAFAF8] hover:bg-white hover:border-[#4F46E5] hover:shadow-sm transition-all duration-200 group flex-shrink-0 cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-[#0F172A] group-hover:text-[#4F46E5] group-hover:border-[#4F46E5]/40 transition-colors shadow-2xs">
                  {company.logo}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-[#0F172A] tracking-tight group-hover:text-[#4F46E5] transition-colors">
                    {company.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                    {company.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter 2: The Problem (AgentLab Style) ────────── */}
      <section ref={problem.ref} id="problem" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-20 reveal ${problem.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 01 THE PROBLEM
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] max-w-3xl leading-[1.2]">
              Traditional CVs are 80% fiction. Tech hiring shouldn&apos;t rely on trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
            {[
              {
                num: "01 / UNVERIFIED NOISE",
                title: "The Self-Reported Lie",
                desc: "Anyone can list Kubernetes, Go, and Microservices on a PDF. Over 70% of tech resumes contain exaggerated proficiencies that crumble in real production environments.",
                impact: "Impact: High False Positives",
                icon: FileWarning,
              },
              {
                num: "02 / WASTED CYCLES",
                title: "40+ Hours of Screenings",
                desc: "Senior engineering leads spend dozens of hours screening applicants through redundant live-coding tests just to verify basic competence that should already be proven.",
                impact: "Impact: 45-Day Time-to-Hire",
                icon: Clock,
              },
              {
                num: "03 / THE ATS FILTER",
                title: "Geographic Blindspots",
                desc: "Brilliant African developers and designers frequently get filtered out by legacy recruitment software before a human engineering lead ever inspects their real code.",
                impact: "Impact: Top Talent Lost",
                icon: MapPinOff,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className={`p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs flex flex-col justify-between card-hover reveal ${problem.inView ? 'revealed' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono text-[#64748B] font-bold">{item.num}</span>
                      <div className="w-10 h-10 rounded-lg border border-neutral-200 bg-[#FAFAF8] flex items-center justify-center">
                        <Icon size={18} className="text-[#64748B]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-sm text-[#475569] leading-[1.75]">{item.desc}</p>
                  </div>
                  <div className="mt-10 pt-5 border-t border-neutral-100 text-xs font-mono text-[#64748B] font-medium">
                    {item.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Chapter 3: The Protocol (Oberon Style) ─────────── */}
      <section ref={protocol.ref} id="protocol" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-[#F4F4F0]">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-20 reveal ${protocol.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 02 THE VERIFICATION ENGINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] max-w-2xl leading-[1.2]">
              How Creda proves engineering capability.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
            {[
              {
                step: "01",
                title: "Multi-Source Evidence Ingestion",
                desc: "Connect your GitHub or GitLab profiles, upload your technical CV, and link verified production applications. Creda pulls real commit trees, PR comments, and architectural files.",
                meta: "OAuth Read-Only // GPG Signed Commits",
                icon: GitBranch,
              },
              {
                step: "02",
                title: "In-Memory AST & Semantic Audit",
                desc: "Our engine executes abstract syntax tree parsing to analyze code complexity, language idioms, test coverage, and contribution frequency — discarding copy-pasted or auto-generated noise.",
                meta: "Zero Code Stored // Privacy First",
                icon: Cpu,
              },
              {
                step: "03",
                title: "Cryptographic Skill Passport",
                desc: "Your verified capabilities are compiled into a shareable, tamper-proof Skill Passport with granular confidence scores (0–100%) that recruiters can independently audit in seconds.",
                meta: "Immutable SHA-256 Record // ATS Ready",
                icon: Fingerprint,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs flex flex-col justify-between card-hover reveal ${protocol.inView ? 'revealed' : ''}`}
                >
                  <div>
                    <div className="w-12 h-12 rounded border border-neutral-300 bg-[#FAFAF8] flex items-center justify-center mb-8 shadow-xs">
                      <Icon size={20} className="text-[#4F46E5]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-4 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#475569] leading-[1.75]">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-10 pt-5 border-t border-neutral-100 text-xs font-mono text-[#64748B] font-medium">
                    {item.meta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Chapter 4: Trust Tiers (The Ledger Breakdown) ──── */}
      <section ref={tiers.ref} id="tiers" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-20 reveal ${tiers.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 03 THE TRUST TIERS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] max-w-2xl leading-[1.2]">
              How skills graduate from claims into verified proof.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
            {[
              {
                tier: "Tier 01",
                name: "Self-Reported",
                confidence: "< 40%",
                desc: "Unverified baseline claims extracted from resumes and portfolios. Marked clearly as unverified.",
                tagColor: "text-neutral-500",
                icon: AlertCircle,
              },
              {
                tier: "Tier 02",
                name: "AI-Verified",
                confidence: "40% – 70%",
                desc: "Cross-referenced across documentation, project descriptions, and verified public work artifacts.",
                tagColor: "text-neutral-700",
                icon: Sparkles,
              },
              {
                tier: "Tier 03",
                name: "Code-Proven",
                confidence: "70% – 90%",
                desc: "Confirmed through real GitHub commit history, pull request contributions, and AST code complexity.",
                tagColor: "text-[#0F172A]",
                icon: Code2,
              },
              {
                tier: "Tier 04",
                name: "Top Strength",
                confidence: "90% – 100%",
                desc: "Sustained high-velocity production code, complex systems architecture, and verified peer code reviews.",
                tagColor: "text-[#4F46E5]",
                icon: Crown,
              },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.tier}
                  className={`p-8 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] flex flex-col justify-between card-hover reveal ${tiers.inView ? 'revealed' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-6 text-[#64748B]">
                      <span className="font-semibold">{t.tier}</span>
                      <span className="font-bold text-[#0F172A]">{t.confidence}</span>
                    </div>
                    <div className="mb-4">
                      <Icon size={20} className={t.tagColor} />
                    </div>
                    <h4 className={`text-xl font-bold mb-3 ${t.tagColor}`}>{t.name}</h4>
                    <p className="text-xs text-[#475569] leading-[1.7]">{t.desc}</p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-neutral-200 text-xs font-mono text-[#64748B]">
                    Objective Evidence Score
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Chapter 5: For Talent vs Recruiters ─────────────── */}
      <section ref={audience.ref} id="recruiters" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-20 reveal ${audience.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 04 BUILT FOR BOTH SIDES OF TECH
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] max-w-2xl leading-[1.2]">
              Designed for African talent. Trusted by global teams.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-stagger">
            {/* Left: For Talent */}
            <div className={`p-10 sm:p-12 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs flex flex-col justify-between card-hover reveal ${audience.inView ? 'revealed' : ''}`}>
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <Users size={14} className="text-[#4F46E5]" />
                  <span className="text-xs font-mono uppercase text-[#4F46E5] font-bold">
                    FOR AFRICAN TECH PROFESSIONALS
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-5 tracking-tight">
                  Stop writing CVs. Let your real work speak.
                </h3>
                <ul className="space-y-5 text-sm text-[#475569] leading-[1.7]">
                  <li className="flex items-start gap-3.5">
                    <span className="text-[#4F46E5] font-mono font-bold mt-0.5">→</span>
                    <span>Stand out against 1,000 generic applicants with an immutable, verifiable proof-of-work link.</span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="text-[#4F46E5] font-mono font-bold mt-0.5">→</span>
                    <span>Verify code repositories, Figma design systems, or cloud architectures with objective evidence scores.</span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="text-[#4F46E5] font-mono font-bold mt-0.5">→</span>
                    <span>Simulate job matches against any job description to discover verified strengths and skill gaps.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-10 pt-6 border-t border-neutral-100">
                <Link href="/auth/signup">
                  <button className="h-12 px-6 rounded text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 shadow-xs hover:shadow-md active:translate-y-0.5 whitespace-nowrap">
                    Claim Free Passport →
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: For Recruiters */}
            <div className={`p-10 sm:p-12 rounded-2xl border border-[#E5E7EB] bg-white shadow-xs flex flex-col justify-between card-hover reveal ${audience.inView ? 'revealed' : ''}`}>
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <Building2 size={14} className="text-[#4F46E5]" />
                  <span className="text-xs font-mono uppercase text-[#4F46E5] font-bold">
                    FOR HIRING MANAGERS & TEAMS
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-5 tracking-tight">
                  Zero resume fraud. 70% faster technical hiring.
                </h3>
                <ul className="space-y-5 text-sm text-[#475569] leading-[1.7]">
                  <li className="flex items-start gap-3.5">
                    <span className="text-[#4F46E5] font-mono font-bold mt-0.5">→</span>
                    <span>Search candidate pipelines by verified skill proficiency, not unproven keyword claims.</span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="text-[#4F46E5] font-mono font-bold mt-0.5">→</span>
                    <span>Click directly into code evidence, commit audit trails, and architecture complexity scores.</span>
                  </li>
                  <li className="flex items-start gap-3.5">
                    <span className="text-[#4F46E5] font-mono font-bold mt-0.5">→</span>
                    <span>Export candidates directly to Greenhouse, Lever, and PDF with cryptographic integrity intact.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-10 pt-6 border-t border-neutral-100">
                <Link href="/auth/signup">
                  <button className="h-12 px-6 rounded text-xs font-mono uppercase font-semibold bg-[#0F172A] hover:bg-neutral-800 text-white transition-all duration-200 shadow-xs hover:shadow-md active:translate-y-0.5 whitespace-nowrap">
                    Request Recruiter Access →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chapter 5: Verified Hiring Outcomes (Testimonials) ── */}
      <section ref={testimonials.ref} id="testimonials" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-20 reveal ${testimonials.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 05 VERIFIED PROOF IN PRODUCTION
            </span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] max-w-2xl leading-[1.2]">
                  Proven code. Real hires. Zero resume theater.
                </h2>
                <p className="mt-4 text-base sm:text-lg text-[#475569] max-w-xl">
                  African engineers and global engineering leaders share how cryptographic skill passports replaced 4-week screening loops.
                </p>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-neutral-200 bg-[#FAFAF8] text-xs font-mono text-[#0F172A]">
                <BadgeCheck size={16} className="text-[#4F46E5]" />
                <span>100% Cryptographically Verified Outcomes</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
            {[
              {
                name: "Adekunle Babatunde",
                role: "Senior Systems Engineer",
                location: "Lagos, Nigeria",
                company: "Hired at Series B Fintech (London)",
                score: "98.4%",
                domain: "Go & High-Throughput gRPC",
                hash: "c8f1...9a42",
                repos: "14 Repositories",
                timeSaved: "Bypassed 2 Technical Screening Rounds",
                avatar: "/testimonials/adekunle.jpg",
                quote:
                  "Instead of doing 3 rounds of take-home tests, I sent the VP of Engineering my Creda link. They audited my AST commit analysis and went straight to the final round.",
                tags: ["GPG Signed", "AST Validated", "Offer in 4 Days"],
              },
              {
                name: "Amina Mwangi",
                role: "Lead Frontend Architect",
                location: "Nairobi, Kenya",
                company: "Hired at AI Infra Co (San Francisco / Remote)",
                score: "96.1%",
                domain: "TypeScript & React Concurrency",
                hash: "4e1b...d309",
                repos: "22 Pull Requests",
                timeSaved: "Zero Rejections Across 6 Remote Applications",
                avatar: "/testimonials/amina.jpg",
                quote:
                  "Applying from East Africa, CVs frequently get blocked by ATS filters. Creda proved my architectural depth with real commit metrics that couldn't be faked.",
                tags: ["Top 2% Talent", "Zero ATS Friction", "Remote US Rate"],
              },
              {
                name: "David Ochieng",
                role: "VP of Engineering",
                location: "Pan-African PayTech Network",
                company: "Hiring Manager Perspective",
                score: "72%",
                domain: "Reduction in Time-to-Hire",
                hash: "d29c...88ff",
                repos: "12 Candidates Hired",
                timeSaved: "20+ Engineering Hours Saved Per Week",
                avatar: "/testimonials/david.jpg",
                quote:
                  "We used to spend hours reviewing embellished CVs. With Creda's Code-Proven tier, we know before the first interview that a candidate writes production-ready code.",
                tags: ["Lever ATS Synced", "Zero Resume Fraud", "Automated Proof"],
              },
            ].map((outcome, idx) => (
              <div
                key={idx}
                className={`p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] flex flex-col justify-between card-hover reveal ${testimonials.inView ? 'revealed' : ''}`}
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div>
                  {/* Top Bar: Verification Hash & Score */}
                  <div className="flex items-center justify-between gap-2 pb-5 border-b border-neutral-200 text-xs font-mono">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                      SHA: {outcome.hash}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[#4F46E5] font-bold">
                      {outcome.score}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="my-6">
                    <Quote size={20} className="text-[#4F46E5]/40 mb-3" />
                    <p className="text-sm text-[#0F172A] font-medium leading-[1.75] italic">
                      "{outcome.quote}"
                    </p>
                  </div>

                  {/* Impact Metric Pill */}
                  <div className="mb-6 p-3 rounded-lg bg-white border border-neutral-200/80">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] mb-1">
                      VERIFIED OUTCOME
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      {outcome.timeSaved}
                    </div>
                  </div>
                </div>

                {/* Author Credentials with Photo */}
                <div className="pt-5 border-t border-neutral-200">
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={outcome.avatar}
                      alt={outcome.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs flex-shrink-0"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                        {outcome.name}
                        <BadgeCheck size={14} className="text-[#4F46E5] flex-shrink-0" />
                      </div>
                      <div className="text-xs text-[#64748B] mt-0.5">
                        {outcome.role} • {outcome.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[#4F46E5] font-medium mb-3">
                    {outcome.company}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {outcome.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-[#64748B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter 6: Transparent Protocol Pricing ─────────── */}
      <section ref={pricing.ref} id="pricing" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto">
          <div className={`mb-20 text-center reveal ${pricing.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 06 TRANSPARENT PROTOCOL PRICING
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] max-w-3xl mx-auto leading-[1.2]">
              Free forever for African talent. Predictable for hiring teams.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-[1.75]">
              No hidden placement commissions. No paywalled certifications. Complete verification transparency for engineers and engineering leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch reveal-stagger">
            {/* Card 1: Talent Passport */}
            <div className={`p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col justify-between card-hover reveal ${pricing.inView ? 'revealed' : ''}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#4F46E5] font-bold whitespace-nowrap">
                    // FOR TALENT
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#64748B] whitespace-nowrap">
                    INDIVIDUAL
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">Talent Passport</h3>
                <p className="text-xs text-[#64748B] mt-2 mb-6 leading-relaxed">
                  Turn your code into your most valuable credential. Prove your real capability directly to global recruiters.
                </p>

                <div className="pb-6 border-b border-neutral-100 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#0F172A] tracking-tight">$0</span>
                  <span className="text-xs font-mono text-[#64748B] uppercase">/ FREE FOREVER</span>
                </div>

                <div className="py-6 space-y-3.5 text-xs text-[#475569] leading-relaxed">
                  {[
                    "Connect up to 4 GitHub/GitLab repositories",
                    "Public cryptographic passport URL (creda.work/p/you)",
                    "Tamper-proof SHA-256 verification hash",
                    "Unlimited job match simulations against real JDs",
                    "AST code complexity & syntax validation",
                    "Downloadable verified PDF passport",
                  ].map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100">
                <Link href="/auth/signup" className="block">
                  <button className="w-full h-12 rounded text-xs font-mono uppercase font-semibold border border-neutral-300 bg-white hover:border-[#4F46E5] hover:text-[#4F46E5] text-[#0F172A] transition-all duration-200 shadow-xs active:translate-y-0.5 whitespace-nowrap">
                    Claim Free Passport →
                  </button>
                </Link>
                <div className="text-[11px] font-mono text-center text-[#64748B] mt-3">
                  No credit card required // 60s setup
                </div>
              </div>
            </div>

            {/* Card 2: Hiring Teams (Featured) */}
            <div className={`p-8 sm:p-10 pt-12 sm:pt-12 rounded-2xl border-2 border-[#4F46E5] bg-white flex flex-col justify-between relative shadow-lg card-hover reveal ${pricing.inView ? 'revealed' : ''}`} style={{ transitionDelay: '120ms' }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#4F46E5] text-white text-[10px] font-mono uppercase tracking-widest font-semibold shadow-xs whitespace-nowrap">
                RECOMMENDED FOR TEAMS
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#4F46E5] font-bold whitespace-nowrap">
                    // FOR HIRING TEAMS
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[#4F46E5] font-semibold whitespace-nowrap">
                    SCALEUPS
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">Recruiter Engine</h3>
                <p className="text-xs text-[#64748B] mt-2 mb-6 leading-relaxed">
                  Search, verify, and hire pre-vetted African engineering talent with complete code evidence visibility.
                </p>

                <div className="pb-6 border-b border-neutral-100 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#0F172A] tracking-tight">$149</span>
                  <span className="text-xs font-mono text-[#64748B] uppercase">/ MONTH</span>
                </div>

                <div className="py-6 space-y-3.5 text-xs text-[#475569] leading-relaxed">
                  {[
                    "Everything in Talent Passport, plus:",
                    "Search talent directory by verified score (>90% Go/TS)",
                    "Inspect full AST syntax trees & commit velocity",
                    "50 candidate pipeline unlocks per month",
                    "1-Click ATS export (Greenhouse, Lever, Ashby)",
                    "Custom skill verification requests on applicant pools",
                    "Dedicated technical recruiter support",
                  ].map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span className={fIdx === 0 ? "font-semibold text-[#0F172A]" : ""}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100">
                <Link href="/auth/signup" className="block">
                  <button className="w-full h-12 rounded text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 shadow-md hover:shadow-indigo-500/25 active:translate-y-0.5 whitespace-nowrap">
                    Start 14-Day Team Trial →
                  </button>
                </Link>
                <div className="text-[11px] font-mono text-center text-[#64748B] mt-3">
                  Cancel anytime // Instant verification access
                </div>
              </div>
            </div>

            {/* Card 3: Enterprise Protocol */}
            <div className={`p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col justify-between card-hover reveal ${pricing.inView ? 'revealed' : ''}`} style={{ transitionDelay: '240ms' }}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#4F46E5] font-bold whitespace-nowrap">
                    // ENTERPRISE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[#64748B] whitespace-nowrap">
                    ORGANIZATIONS
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">Enterprise Protocol</h3>
                <p className="text-xs text-[#64748B] mt-2 mb-6 leading-relaxed">
                  Tailored technical auditing pipelines, private repository parsing, custom benchmarks, and dedicated SLA.
                </p>

                <div className="pb-6 border-b border-neutral-100 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#0F172A] tracking-tight">Custom</span>
                  <span className="text-xs font-mono text-[#64748B] uppercase">/ TAILORED VOLUME</span>
                </div>

                <div className="py-6 space-y-3.5 text-xs text-[#475569] leading-relaxed">
                  {[
                    "Unlimited candidate unlocks & deep audits",
                    "Private repo AST parsing in isolated VPC sandboxes",
                    "Custom internal technical competency benchmarks",
                    "SOC2 Type II compliance reports & audit trails",
                    "SSO (SAML, Okta) & role-based team management",
                    "Dedicated Account Executive & 99.9% uptime SLA",
                    "Direct API access & webhook event integration",
                  ].map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100">
                <Link href="/auth/signup" className="block">
                  <button className="w-full h-12 rounded text-xs font-mono uppercase font-semibold bg-[#0F172A] hover:bg-neutral-800 text-white transition-all duration-200 shadow-xs active:translate-y-0.5 whitespace-nowrap">
                    Contact Protocol Team →
                  </button>
                </Link>
                <div className="text-[11px] font-mono text-center text-[#64748B] mt-3">
                  Tailored contracts // Custom SLA & security
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chapter 7: Frequently Asked Questions ──────────── */}
      <section ref={faq.ref} id="faq" className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-[#F4F4F0]">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-20 text-center reveal ${faq.inView ? 'revealed' : ''}`}>
            <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-4">
              // 07 TRANSPARENCY & INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.2]">
              Frequently asked questions.
            </h2>
          </div>

          <div className="space-y-5">
            {[
              {
                q: "Does Creda store or train on my private repository code?",
                a: "Never. Creda connects via GitHub OAuth using strictly read-only permissions. Code parsing and AST complexity evaluation are executed entirely in-memory. Your proprietary code is never persisted to databases or used to train artificial intelligence models.",
              },
              {
                q: "How much does Creda cost for developers and tech talent?",
                a: "Creda is 100% free for African tech talent and individual professionals. You can connect up to 4 evidence sources, generate your public Skill Passport, and simulate job matches at zero cost forever. Hiring companies subscribe to access talent search and pipeline verification tools.",
              },
              {
                q: "What evidence sources does Creda accept?",
                a: "Creda currently ingests GitHub and GitLab repositories (commits, PRs, code files), technical CVs in PDF format, live production project URLs, and industry certifications. More data providers are continuously added to Protocol v2.",
              },
              {
                q: "How do recruiters verify that my passport hasn't been altered?",
                a: "Every passport is assigned a cryptographic SHA-256 verification hash and an immutable Creda URL. When recruiters open your link, the integrity of the ledger is instantly checked against our verified records.",
              },
              {
                q: "Can I use Creda if I am a designer or cybersecurity specialist?",
                a: "Yes. Creda Protocol v2.4 supports software engineers, DevOps/SREs, UI/UX designers (via Figma and design portfolio verification), and cybersecurity analysts (via CTF records, security repositories, and architecture proof).",
              },
            ].map((faqItem, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs card-hover reveal ${faq.inView ? 'revealed' : ''}`}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-8 text-left flex items-center justify-between gap-4 text-[#0F172A] hover:text-[#4F46E5] transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold">{faqItem.q}</span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 transition-all duration-300 ${activeFaq === i ? 'text-[#4F46E5] rotate-180' : 'text-[#64748B]'}`}
                  />
                </button>
                {/* Smooth accordion animation */}
                <div className={`accordion-content ${activeFaq === i ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="px-8 pb-8 text-sm text-[#475569] leading-[1.75] border-t border-neutral-100 pt-5">
                      {faqItem.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chapter 7: Final CTA Banner (Framed Canvas) ────── */}
      <section ref={cta.ref} className="py-32 px-6 sm:px-8 border-b border-[#E5E7EB] bg-[#FAFAF8]">
        <div className={`max-w-4xl mx-auto rounded-3xl border border-[#E5E7EB] bg-white p-12 sm:p-20 text-center shadow-lg relative overflow-hidden reveal-scale ${cta.inView ? 'revealed' : ''}`}>
          <span className="text-xs font-mono uppercase tracking-widest text-[#4F46E5] font-bold block mb-5">
            [ READY TO PROVE YOUR SKILLS? ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A] mb-6 leading-[1.2]">
            Turn your code into your most valuable credential.
          </h2>
          <p className="text-base sm:text-lg text-[#475569] max-w-xl mx-auto mb-12 leading-[1.75] font-normal">
            Join thousands of African developers, designers, and engineers who are proving what they can actually do.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <button className="h-14 px-10 rounded text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0.5 whitespace-nowrap">
                Claim Free Skill Passport →
              </button>
            </Link>
          </div>
          <p className="text-xs font-mono text-[#64748B] mt-8">
            Free Forever for Talent // 60-Second Setup // No Credit Card Required
          </p>
        </div>
      </section>

      {/* ── Minimalist Architectural Footer (Oberon Style) ─── */}
      <footer className="py-16 px-6 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center tracking-tight">
              <CredaLogo size={26} showTag={false} />
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="text-xs font-mono text-[#64748B]">
              © {new Date().getFullYear()} Creda Protocol. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono text-[#64748B]">
            <Activity size={14} className="text-[#4F46E5] animate-pulse" />
            <span className="text-[#0F172A] font-semibold">SYSTEM STATUS:</span>
            <span>ALL PROTOCOLS OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-8 text-xs font-mono text-[#64748B]">
            <Link href="#" className="hover:text-[#0F172A] transition-colors duration-200">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#0F172A] transition-colors duration-200">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#0F172A] transition-colors duration-200">
              Security
            </Link>
            <Link href="https://github.com/Misterhoye10/Creda" target="_blank" className="hover:text-[#0F172A] transition-colors duration-200 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
