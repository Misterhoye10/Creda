"use client";

import Link from "next/link";
import { CredaLogo } from "@/components/CredaLogo";
import { Shield, Lock, EyeOff, Server, FileText, CheckCircle2, ArrowLeft, ArrowUpRight, Activity } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "September 26, 2026";
  const protocolVersion = "v2.4-audit";

  const sections = [
    {
      id: "zero-code-retention",
      title: "1. Zero Code Retention Guarantee",
      icon: EyeOff,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-4">
            Creda operates on a strict <strong className="text-[#0F172A]">ephemeral analysis architecture</strong>. When you connect your GitHub account or link a repository for verification:
          </p>
          <ul className="space-y-2.5 text-sm text-[#475569] font-sans pl-1">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
              <span><strong>No Source Code Storage:</strong> We never copy, clone, mirror, or persistently store your source code files on any persistent disk or database.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
              <span><strong>Ephemeral AST Analysis:</strong> Repositories are streamed into secure, memory-isolated runtime sandboxes that parse syntax trees (ASTs), commit graphs, and PR merges. Once metrics are computed, the runtime container is destroyed and memory is zeroed.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
              <span><strong>Zero AI Training on Private Code:</strong> Your proprietary algorithms, business logic, or customer data will never be used to train, fine-tune, or calibrate artificial intelligence models.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "data-collection",
      title: "2. Information We Collect",
      icon: FileText,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            To generate and issue your cryptographically verifiable Skill Passport, Creda processes the following categories of data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
              <div className="text-xs font-mono font-bold text-[#4F46E5] uppercase mb-1">Public Developer Data</div>
              <div className="text-xs text-[#475569] leading-relaxed">
                GitHub public profile username, display avatar, repository commit frequency, language distributions, PR review activity, and verified commit GPG signatures.
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
              <div className="text-xs font-mono font-bold text-[#4F46E5] uppercase mb-1">CV & Artifact Uploads</div>
              <div className="text-xs text-[#475569] leading-relaxed">
                Work experience history, title progressions, and educational background provided by you. Sensitive identifiers like home addresses are automatically scrubbed before ledger commitment.
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "data-usage",
      title: "3. How Verification Data Is Used",
      icon: Server,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            We use your data strictly to power your proof-of-work credibility:
          </p>
          <ul className="space-y-2 text-sm text-[#475569]">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#4F46E5] flex-shrink-0" />
              <span>Computing objective skill percentile rankings across technical languages and frameworks.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#4F46E5] flex-shrink-0" />
              <span>Generating tamper-evident cryptographic passport signatures verifiable by prospective employers.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#4F46E5] flex-shrink-0" />
              <span>Providing role-fit simulations with African and global tech employers (e.g., Paystack, Moniepoint, Flutterwave).</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "sovereignty",
      title: "4. Talent Sovereignty & Deletion",
      icon: Shield,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            You own your reputation. At any point, you retain the legal and architectural right to:
          </p>
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs text-[#334155] leading-relaxed">
            <strong>Revocation at Any Time:</strong> You can disconnect your GitHub integration and trigger an immediate hard delete of your profile metrics directly from your account settings. This will deactivate your public passport URL (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200">creda.work/p/username</code>) and purge cached cryptographic hashes.
          </div>
        </>
      ),
    },
    {
      id: "compliance",
      title: "5. Regulatory Compliance (NDPR & GDPR)",
      icon: Lock,
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            Creda is designed to meet international standards for privacy, including the <strong>Nigeria Data Protection Regulation (NDPR)</strong>, the <strong>African Union Convention on Cyber Security and Personal Data Protection</strong>, and the <strong>EU General Data Protection Regulation (GDPR)</strong>.
          </p>
          <p className="text-sm leading-relaxed text-[#475569]">
            For data inquiries, access requests, or official regulatory audits, contact our designated Data Protection Officer at <a href="mailto:privacy@creda.work" className="text-[#4F46E5] underline font-mono">privacy@creda.work</a>.
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
            [ PROTOCOL PRIVACY POLICY // {protocolVersion} ]
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A]">
            Privacy Policy & Zero-Code Guarantees
          </h1>
          <p className="mt-4 text-base text-[#64748B] leading-relaxed">
            Creda is engineered around a fundamental commitment: you should never have to sacrifice repository secrecy to prove your technical competence. Read how our zero-code-retention protocol protects your IP.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748B] border-t border-[#E5E7EB] pt-4">
            <div>EFFECTIVE DATE: <span className="text-[#0F172A] font-bold">{lastUpdated}</span></div>
            <span>•</span>
            <div>COMPLIANCE: <span className="text-[#0F172A] font-bold">NDPR & GDPR ALIGNED</span></div>
            <span>•</span>
            <div>AUDIT STATUS: <span className="text-[#0F172A] font-bold">PASSED</span></div>
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
            <Link href="/verify" className="hover:text-[#0F172A] transition-colors">
              Verify
            </Link>
            <Link href="/privacy" className="text-[#4F46E5] font-bold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#0F172A] transition-colors">
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
