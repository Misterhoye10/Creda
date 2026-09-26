"use client";

import Link from "next/link";
import { CredaLogo } from "@/components/CredaLogo";
import { Scale, ShieldAlert, Award, FileCheck, CheckCircle2, ArrowLeft, ArrowUpRight, Activity } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "September 26, 2026";
  const protocolVersion = "v2.4";

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: Scale,
      content: (
        <p className="text-sm leading-relaxed text-[#475569]">
          By creating an account, connecting a third-party developer service (including GitHub, GitLab, or Bitbucket), uploading credentials, or accessing the Creda Protocol (<strong className="text-[#0F172A]">creda.work</strong>), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or utilize the platform.
        </p>
      ),
    },
    {
      id: "free-forever",
      title: "2. The Talent Bill of Rights & Free Forever Tier",
      icon: Award,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            Creda is fundamentally committed to democratizing access to global opportunity for African software engineers, DevOps specialists, and cybersecurity practitioners:
          </p>
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs text-[#334155] leading-relaxed">
            <strong>Free For Talent Forever:</strong> Individual developers will never be charged to connect repositories, run algorithmic code analyses, earn proof-of-work badges, or share their verified Skill Passport with employers worldwide. Our revenue model is strictly enterprise-sponsored by recruiters and engineering leaders who pay for hiring access and verified talent search.
          </div>
        </>
      ),
    },
    {
      id: "anti-fraud",
      title: "3. Zero-Fraud Mandate & Anti-Gaming Policy",
      icon: ShieldAlert,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-4">
            Creda is a high-trust verification protocol. To maintain the integrity of credentials issued across global hiring markets:
          </p>
          <ul className="space-y-2.5 text-sm text-[#475569] pl-1">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>No Artificial Commit Inflation:</strong> Scripted green-square bot generation, dummy repository loops, or artificial contribution spam are automatically identified by our heuristic audit engine and stripped from scoring.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>No Plagiarism or False Authorship:</strong> Claiming authorship over upstream forked code without substantive engineering contributions constitutes fraud and triggers immediate credential revocation.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Revocation & Blacklisting:</strong> Fraudulent accounts will have their cryptographic passports invalidated and permanently flagged across our employer network.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "ip-ownership",
      title: "4. Intellectual Property & Code Ownership",
      icon: FileCheck,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            You retain <strong>100% complete ownership</strong> of your code, intellectual property, repositories, and documentation.
          </p>
          <p className="text-sm leading-relaxed text-[#475569]">
            Creda claims zero ownership, license rights, or commercial exploitation rights over any code analyzed. You grant Creda only the strictly limited, revocable right to parse metadata during the active verification process.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "5. Disclaimers & Governing Law",
      icon: Scale,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            While Creda’s algorithmic verification models represent rigorous heuristics on code quality, testing rigor, and systems architecture, we do not guarantee specific employment offers or hiring decisions by third-party partner companies.
          </p>
          <p className="text-sm leading-relaxed text-[#475569]">
            These Terms are governed by and construed in accordance with the laws of Delaware, United States, and the Federal Republic of Nigeria, without regard to conflict of law principles.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] selection:bg-[#4F46E5] selection:text-white flex flex-col justify-between">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center tracking-tight">
            <CredaLogo size={28} showTag={true} tagText="LEGAL" />
          </Link>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors">
            <ArrowLeft size={13} />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/signup"
            className="h-9 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono uppercase font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>CLAIM PASSPORT</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── Hero Editorial Header ── */}
      <section className="pt-16 pb-12 px-6 sm:px-10 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-[#FAFAF8] text-[11px] font-mono font-bold text-[#4F46E5] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            [ PROTOCOL TERMS // {protocolVersion} ]
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A]">
            Terms of Service & Talent Rights
          </h1>
          <p className="mt-4 text-base text-[#64748B] leading-relaxed">
            Transparent, developer-first principles. We believe talent verification must be free for practitioners, rigorous for employers, and uncompromised on intellectual property rights.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748B] border-t border-[#E5E7EB] pt-4">
            <div>EFFECTIVE DATE: <span className="text-[#0F172A] font-bold">{lastUpdated}</span></div>
            <span>•</span>
            <div>TALENT COST: <span className="text-[#4F46E5] font-bold">100% FREE FOREVER</span></div>
            <span>•</span>
            <div>ANTI-FRAUD: <span className="text-[#0F172A] font-bold">STRICTLY ENFORCED</span></div>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-12 flex-1 w-full">
        <div className="space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs transition-all hover:border-[#CBD5E1]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] shadow-2xs">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div>{section.content}</div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 sm:px-10 border-t border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center tracking-tight">
              <CredaLogo size={24} showTag={false} />
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="text-xs font-mono text-[#64748B]">
              © {new Date().getFullYear()} Creda Protocol. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <Activity size={13} className="text-[#4F46E5] animate-pulse" />
            <span className="text-[#0F172A] font-semibold">ALL PROTOCOLS OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-[#64748B]">
            <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[#4F46E5] font-bold">
              Terms
            </Link>
            <Link href="/security" className="hover:text-[#0F172A] transition-colors">
              Security
            </Link>
            <Link href="https://github.com/creda-protocol" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F172A] transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
