"use client";

import Link from "next/link";
import { CredaLogo } from "@/components/CredaLogo";
import { ShieldCheck, Lock, Key, Terminal, Cpu, Database, CheckCircle2, ArrowLeft, ArrowUpRight, Activity, Bug } from "lucide-react";

export default function SecurityPage() {
  const protocolVersion = "v2.4-production";
  const signatureAlgorithm = "Ed25519 + SHA-256";

  const securityPillars = [
    {
      id: "cryptographic-proof",
      title: "1. Cryptographic Skill Signatures",
      icon: Key,
      badge: "ALGORITHMIC VERIFICATION",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-4">
            Creda Skill Passports do not rely on centralized trust or subjective manual claims. Each verified credential is deterministically hashed and signed using asymmetric cryptography:
          </p>
          <div className="rounded-xl border border-neutral-800 bg-[#0F172A] p-4 text-xs font-mono text-neutral-300 space-y-2 mb-4">
            <div className="flex items-center justify-between text-[#818CF8]">
              <span>[ PASSPORT PROOF STRUCTURE ]</span>
              <span>STANDARD: ED25519</span>
            </div>
            <div className="text-neutral-400">
              merkle_root: <span className="text-[#34D399]">sha256(ast_syntax_depth + pr_velocity + test_ratio)</span>
            </div>
            <div className="text-neutral-400">
              signature: <span className="text-[#60A5FA]">ed25519_sign(merkle_root, creda_root_authority_key)</span>
            </div>
            <div className="text-neutral-400">
              offline_verification: <span className="text-[#FBBF24]">public_key_verifiable(true)</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#475569]">
            This ensures that any recruiter, hiring manager, or partner institution can independently verify a developer’s passport integrity offline without depending on proprietary Creda servers.
          </p>
        </>
      ),
    },
    {
      id: "ephemeral-compute",
      title: "2. Ephemeral Ingestion & Zero-Storage Sandbox",
      icon: Cpu,
      badge: "RUNTIME ISOLATION",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            To guarantee your proprietary repository source code remains 100% private:
          </p>
          <ul className="space-y-2.5 text-sm text-[#475569]">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
              <span><strong>Isolated MicroVM Execution:</strong> AST code parsing and commit graph analysis execute in ephemeral, single-tenant sandboxes with zero external network egress.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
              <span><strong>Memory Zeroing:</strong> The moment complexity, test ratio, and commit frequency signals are extracted, the container memory space is securely scrubbed and the instance is terminated.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] mt-2 flex-shrink-0" />
              <span><strong>No Disk Persistence:</strong> Raw repository files are never written to long-term block storage or persistent database volumes.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "provenance-verification",
      title: "3. Commit Provenance & Anti-Spoofing",
      icon: Terminal,
      badge: "ANTI-FRAUD AUDIT",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            Our multi-signal verification engine protects against fraudulent claims:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
              <div className="text-xs font-mono font-bold text-[#0F172A] mb-1">GPG Commit Audits</div>
              <div className="text-xs text-[#64748B] leading-relaxed">
                Verifies cryptographic signatures on Git commits to ensure code was authentically authored by the identity holder.
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
              <div className="text-xs font-mono font-bold text-[#0F172A] mb-1">Topology & Timing Analysis</div>
              <div className="text-xs text-[#64748B] leading-relaxed">
                Cross-references commit timing distributions against automated bot anomalies and upstream fork duplication.
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "infrastructure-security",
      title: "4. Infrastructure Hardening & Encryption",
      icon: Database,
      badge: "DATA AT REST & IN TRANSIT",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            All data in transit is encrypted using <strong>TLS 1.3</strong> with strict forward secrecy and HTTP Strict Transport Security (HSTS). All credential hashes and audit logs at rest are encrypted with <strong>AES-256</strong>.
          </p>
          <p className="text-sm leading-relaxed text-[#475569]">
            Access to production infrastructure requires hardware-backed multi-factor authentication (WebAuthn/FIDO2) and is governed by strict principle-of-least-privilege access control.
          </p>
        </>
      ),
    },
    {
      id: "vulnerability-disclosure",
      title: "5. Responsible Disclosure & Bug Bounty",
      icon: Bug,
      badge: "COMMUNITY AUDITING",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[#475569] mb-3">
            We welcome responsible security research from developers and ethical penetration testers across the ecosystem.
          </p>
          <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAF8] text-xs font-mono text-[#334155] leading-relaxed">
            Report vulnerabilities directly to: <a href="mailto:security@creda.work" className="text-[#4F46E5] font-bold underline">security@creda.work</a>.
            <div className="mt-2 text-neutral-500">
              PGP Key ID: <span className="text-[#0F172A] font-bold">4B89 F821 73A0 9C4E</span> // Response SLA: &lt; 24 hours.
            </div>
          </div>
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
            <CredaLogo size={28} showTag={true} tagText="SECURITY" />
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
            [ PROTOCOL SECURITY ARCHITECTURE // {protocolVersion} ]
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A]">
            Cryptographic Security & Verification Proof
          </h1>
          <p className="mt-4 text-base text-[#64748B] leading-relaxed">
            How Creda utilizes asymmetric signatures, ephemeral MicroVMs, and Merkle tree roots to create tamper-evident technical passports without ever retaining private source code.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748B] border-t border-[#E5E7EB] pt-4">
            <div>SIGNATURE ALGORITHM: <span className="text-[#0F172A] font-bold">{signatureAlgorithm}</span></div>
            <span>•</span>
            <div>STORAGE MODEL: <span className="text-[#4F46E5] font-bold">ZERO-PERSISTENCE EPHEMERAL</span></div>
            <span>•</span>
            <div>SOC2 READINESS: <span className="text-[#0F172A] font-bold">ACTIVE</span></div>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 py-12 flex-1 w-full">
        <div className="space-y-10">
          {securityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={pillar.id}
                className="p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs transition-all hover:border-[#CBD5E1]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5] shadow-2xs">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
                      {pillar.title}
                    </h2>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full border border-neutral-200 bg-[#FAFAF8] text-[10px] font-mono text-[#64748B]">
                    {pillar.badge}
                  </span>
                </div>
                <div>{pillar.content}</div>
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
            <Link href="/terms" className="hover:text-[#0F172A] transition-colors">
              Terms
            </Link>
            <Link href="/security" className="text-[#4F46E5] font-bold">
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
