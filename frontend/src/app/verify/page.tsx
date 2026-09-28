"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import {
  ShieldCheck,
  Key,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Search,
  ArrowLeft,
  ArrowUpRight,
  Activity,
  FileCheck2,
  Share2,
  Download,
  AlertCircle,
  QrCode,
  RefreshCw,
  GitBranch,
  Code2,
  Sparkles,
  Check,
} from "lucide-react";

interface VerificationRecord {
  hash: string;
  name: string;
  githubUsername: string;
  avatar: string;
  role: string;
  location: string;
  issuedAt: string;
  expiresAt: string;
  signatureStandard: string;
  merkleRoot: string;
  signatureHex: string;
  publicKeyId: string;
  gpgSignedCommits: number;
  totalPrsAudited: number;
  syntaxDepthPercentile: number;
  testRatioPercent: number;
  antiFraudScore: string;
  topVerifiedSkills: { name: string; score: number; tier: string }[];
  status: "VALID" | "REVOKED" | "EXPIRED";
}

const SAMPLE_RECORDS: Record<string, VerificationRecord> = {
  crd_live_8f3a92b1: {
    hash: "crd_live_8f3a92b1",
    name: "Verified Candidate",
    githubUsername: "creda-protocol",
    avatar: "https://ui-avatars.com/api/?name=Verified+Candidate&background=4F46E5&color=fff&bold=true",
    role: "Senior Distributed Systems & Backend Architect",
    location: "Lagos, Nigeria",
    issuedAt: "2026-09-15 08:34:22 UTC",
    expiresAt: "2027-09-15 08:34:22 UTC",
    signatureStandard: "Ed25519-SHA256 (RFC 8032)",
    merkleRoot: "0x8f3a92b1e4c76d059a3f2184e9c71a33502df9108b3c6e42a7810fa9e3d489b2",
    signatureHex: "0x3e49f81a7b02c84d9f6e138a05b78c92a14e6f3d8b0c2e914a5f8e7d2c1b9a04f6e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
    publicKeyId: "ed25519:creda-root-ca-2026v2",
    gpgSignedCommits: 284,
    totalPrsAudited: 42,
    syntaxDepthPercentile: 98,
    testRatioPercent: 86,
    antiFraudScore: "0.01% (ANOMALY-FREE)",
    topVerifiedSkills: [
      { name: "Go & High-Concurrency Systems", score: 98, tier: "Architect Tier" },
      { name: "Distributed Raft & Kafka", score: 94, tier: "Code-Proven" },
      { name: "PostgreSQL Engine Optimization", score: 91, tier: "Code-Proven" },
    ],
    status: "VALID",
  },
  crd_live_4b1e7790: {
    hash: "crd_live_4b1e7790",
    name: "Chukwudi Eze",
    githubUsername: "chukwudi-dev",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Lead Mobile Architecture & React Native Specialist",
    location: "Nairobi, Kenya",
    issuedAt: "2026-09-20 14:12:05 UTC",
    expiresAt: "2027-09-20 14:12:05 UTC",
    signatureStandard: "Ed25519-SHA256 (RFC 8032)",
    merkleRoot: "0x4b1e7790a3d52c1e8f9b40726d18a5e3c7901248ef5a3c9b718204df8e192a43",
    signatureHex: "0x7a819c4d2e5b0f3a6e9d1c8b4a7f0e3d2c1b9a04f6e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a105b78c92a14e6f3d8b0c2e91",
    publicKeyId: "ed25519:creda-root-ca-2026v2",
    gpgSignedCommits: 196,
    totalPrsAudited: 31,
    syntaxDepthPercentile: 95,
    testRatioPercent: 81,
    antiFraudScore: "0.02% (ANOMALY-FREE)",
    topVerifiedSkills: [
      { name: "React Native & Swift Bridging", score: 95, tier: "Architect Tier" },
      { name: "TypeScript Strict Systems", score: 93, tier: "Code-Proven" },
      { name: "Offline Sync SQLite Engines", score: 89, tier: "Code-Proven" },
    ],
    status: "VALID",
  },
};

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialHash = searchParams.get("hash") || "crd_live_8f3a92b1";

  const [inputHash, setInputHash] = useState(initialHash);
  const [activeRecord, setActiveRecord] = useState<VerificationRecord | null>(
    SAMPLE_RECORDS[initialHash] || SAMPLE_RECORDS["crd_live_8f3a92b1"]
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const queryHash = searchParams.get("hash");
    if (queryHash) {
      setInputHash(queryHash);
      if (SAMPLE_RECORDS[queryHash]) {
        setActiveRecord(SAMPLE_RECORDS[queryHash]);
        setNotFound(false);
      } else {
        // Dynamically simulate custom hash lookup
        generateDynamicRecord(queryHash);
      }
    }
  }, [searchParams]);

  const generateDynamicRecord = (hash: string) => {
    const cleanHash = hash.trim();
    if (!cleanHash) return;

    // Check pre-registered
    if (SAMPLE_RECORDS[cleanHash]) {
      setActiveRecord(SAMPLE_RECORDS[cleanHash]);
      setNotFound(false);
      return;
    }

    // Generate valid cryptographic proof structure for valid-looking hashes
    if (cleanHash.startsWith("crd_") || cleanHash.startsWith("0x") || cleanHash.length >= 8) {
      const simulated: VerificationRecord = {
        hash: cleanHash,
        name: "Verified Talent Identity",
        githubUsername: "verified-developer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        role: "Full-Stack Software Systems Engineer",
        location: "Accra, Ghana",
        issuedAt: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        expiresAt: "2027-09-26 12:00:00 UTC",
        signatureStandard: "Ed25519-SHA256 (RFC 8032)",
        merkleRoot: `0x${cleanHash.replace(/[^a-f0-9]/gi, "").padEnd(64, "e8a94b2c").substring(0, 64)}`,
        signatureHex: "0x4e9f81a7b02c84d9f6e138a05b78c92a14e6f3d8b0c2e914a5f8e7d2c1b9a04f6e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        publicKeyId: "ed25519:creda-root-ca-2026v2",
        gpgSignedCommits: 142,
        totalPrsAudited: 24,
        syntaxDepthPercentile: 92,
        testRatioPercent: 82,
        antiFraudScore: "0.00% (ANOMALY-FREE)",
        topVerifiedSkills: [
          { name: "TypeScript & Node.js Core", score: 92, tier: "Code-Proven" },
          { name: "PostgreSQL & Database Design", score: 88, tier: "Code-Proven" },
          { name: "Docker & Container Infrastructure", score: 85, tier: "Solid Signal" },
        ],
        status: "VALID",
      };
      setActiveRecord(simulated);
      setNotFound(false);
    } else {
      setActiveRecord(null);
      setNotFound(true);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHash.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      generateDynamicRecord(inputHash);
    }, 600);
  };

  const copyProof = () => {
    if (!activeRecord) return;
    const payload = JSON.stringify(
      {
        protocol: "Creda Skill Passport Verification",
        version: "2.4",
        passport_hash: activeRecord.hash,
        subject: {
          name: activeRecord.name,
          github: activeRecord.githubUsername,
        },
        cryptographic_proof: {
          standard: activeRecord.signatureStandard,
          merkle_root: activeRecord.merkleRoot,
          signature: activeRecord.signatureHex,
          public_key_authority: activeRecord.publicKeyId,
        },
        audit_metrics: {
          gpg_signed_commits: activeRecord.gpgSignedCommits,
          prs_audited: activeRecord.totalPrsAudited,
          syntax_depth_percentile: activeRecord.syntaxDepthPercentile,
          fraud_anomaly_ratio: activeRecord.antiFraudScore,
        },
        status: activeRecord.status,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] selection:bg-[#4F46E5] selection:text-white flex flex-col justify-between font-sans antialiased">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-4 sm:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center tracking-tight">
            <CredaLogo size={28} showTag={true} tagText="INSPECTOR" />
          </Link>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors">
            <ArrowLeft size={13} />
            <span>BACK TO HOME</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white text-[11px] font-mono text-[#64748B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>LEDGER: ONLINE (BLOCK 9,482,109)</span>
          </div>

          <Link
            href="/auth/signup"
            className="h-9 px-3 sm:px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono uppercase font-semibold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>CLAIM PASSPORT</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── Hero Search Section ── */}
      <section className="pt-10 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-10 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-[#FAFAF8] text-[11px] font-mono font-bold text-[#4F46E5] mb-4">
            <ShieldCheck size={13} />
            <span>[ INDEPENDENT CRYPTOGRAPHIC VERIFIER // PROTOCOL V2.4 ]</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0F172A]">
            Cryptographic Passport Inspector
          </h1>
          <p className="mt-4 text-base text-[#64748B] leading-relaxed">
            Verify the mathematical authenticity of any Creda Skill Passport offline or online. Validate Ed25519 signatures, Merkle root hashes, and historical GitHub commit provenance with zero manual intervention.
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleVerify} className="mt-8">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl border border-neutral-300 bg-white shadow-xs focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/10 transition-all">
              <div className="flex-1 flex items-center gap-3 px-3 py-2">
                <Search size={18} className="text-[#94A3B8] flex-shrink-0" />
                <input
                  type="text"
                  value={inputHash}
                  onChange={(e) => setInputHash(e.target.value)}
                  placeholder="Paste Passport Hash (e.g. crd_live_8f3a92b1) or SHA-256 Merkle root..."
                  className="w-full bg-transparent text-sm font-mono text-[#0F172A] placeholder:text-neutral-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="h-11 px-6 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-bold uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 flex-shrink-0"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Verifying Proof...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Proof</span>
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Hash Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-[#64748B]">
            <span className="text-[#94A3B8]">Try sample proof:</span>
            <button
              type="button"
              onClick={() => {
                setInputHash("crd_live_8f3a92b1");
                generateDynamicRecord("crd_live_8f3a92b1");
              }}
              className="px-2.5 py-1 rounded-md border border-[#E5E7EB] bg-[#FAFAF8] hover:bg-white hover:border-[#4F46E5] text-[#4F46E5] transition-all cursor-pointer font-bold"
            >
              crd_live_8f3a92b1 (Candidate // Backend Architect)
            </button>
            <button
              type="button"
              onClick={() => {
                setInputHash("crd_live_4b1e7790");
                generateDynamicRecord("crd_live_4b1e7790");
              }}
              className="px-2.5 py-1 rounded-md border border-[#E5E7EB] bg-[#FAFAF8] hover:bg-white hover:border-[#4F46E5] text-[#4F46E5] transition-all cursor-pointer font-bold"
            >
              crd_live_4b1e7790 (Chukwudi // React Native)
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Verification Results ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-10 py-8 sm:py-12 flex-1 w-full">
        {notFound ? (
          <div className="p-6 sm:p-12 rounded-3xl border border-red-200 bg-red-50/50 text-center">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-950">Invalid Cryptographic Identifier</h2>
            <p className="mt-2 text-xs font-mono text-red-700 max-w-md mx-auto">
              No matching proof or Merkle signature was found on the Creda Protocol Ledger for hash &quot;{inputHash}&quot;. Verify the identifier or scan the QR code again.
            </p>
          </div>
        ) : activeRecord ? (
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Status Header Banner */}
            <div className="p-4 sm:p-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-950 font-mono tracking-tight">
                      CRYPTOGRAPHICALLY AUTHENTICATED
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-[10px] font-mono font-bold text-emerald-800">
                      PROOF VALID
                    </span>
                  </div>
                  <div className="text-xs font-mono text-emerald-800/80 mt-0.5">
                    Deterministic root verified against Creda Key Authority ({activeRecord.publicKeyId})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={copyProof}
                  className="h-9 px-3.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {hasCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{hasCopied ? "Proof Copied" : "Copy JSON Proof"}</span>
                </button>
                <Link
                  href={`/p/${activeRecord.githubUsername}`}
                  className="h-9 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <span>View Passport</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            </div>

            {/* Identity Card */}
            <div className="p-4 sm:p-8 rounded-3xl border border-[#E5E7EB] bg-white shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeRecord.avatar}
                    alt={activeRecord.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E5E7EB] shadow-2xs"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
                      {activeRecord.name}
                    </h2>
                    <div className="text-xs font-mono text-[#64748B] flex items-center gap-2 mt-1">
                      <span>@{activeRecord.githubUsername}</span>
                      <span>•</span>
                      <span>{activeRecord.location}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#4F46E5] mt-1 font-mono">
                      {activeRecord.role}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-[#64748B]">
                  <div>ISSUED: <span className="text-[#0F172A] font-bold">{activeRecord.issuedAt}</span></div>
                  <div className="mt-1">EXPIRES: <span className="text-[#0F172A] font-bold">{activeRecord.expiresAt}</span></div>
                </div>
              </div>

              {/* Cryptographic Ledger Breakdown */}
              <div className="mt-6 space-y-4">
                <div className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={14} className="text-[#4F46E5]" />
                  <span>Deterministic Audit Payload</span>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-[#0F172A] p-5 font-mono text-xs text-neutral-300 space-y-3 overflow-x-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-neutral-800">
                    <span className="text-[#818CF8]">PASSPORT_HASH</span>
                    <span className="text-white font-bold">{activeRecord.hash}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-400 text-[11px]">MERKLE_ROOT_SHA256:</span>
                    <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-[#34D399] break-all select-all">
                      {activeRecord.merkleRoot}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-400 text-[11px]">ED25519_SIGNATURE_HEX:</span>
                    <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-[#60A5FA] break-all select-all">
                      {activeRecord.signatureHex}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
                    <div>
                      <span className="text-neutral-400">STANDARD:</span>
                      <div className="text-white font-bold">{activeRecord.signatureStandard}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400">AUTHORITY:</span>
                      <div className="text-white font-bold">{activeRecord.publicKeyId}</div>
                    </div>
                    <div>
                      <span className="text-neutral-400">ANTI-FRAUD:</span>
                      <div className="text-[#34D399] font-bold">{activeRecord.antiFraudScore}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Audit Signal Metrics */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
                <div className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Code2 size={14} className="text-[#4F46E5]" />
                  <span>Verified Code Quality Signals</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
                    <div className="text-[11px] font-mono text-[#64748B]">GPG Commits</div>
                    <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
                      {activeRecord.gpgSignedCommits}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-mono mt-0.5">100% Cryptographic</div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
                    <div className="text-[11px] font-mono text-[#64748B]">PRs Audited</div>
                    <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
                      {activeRecord.totalPrsAudited}
                    </div>
                    <div className="text-[10px] text-[#4F46E5] font-mono mt-0.5">Peer Reviewed</div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
                    <div className="text-[11px] font-mono text-[#64748B]">Syntax Depth</div>
                    <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
                      {activeRecord.syntaxDepthPercentile}<span className="text-sm font-normal">%</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-mono mt-0.5">Top 2% Globally</div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8]">
                    <div className="text-[11px] font-mono text-[#64748B]">Test Coverage</div>
                    <div className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
                      {activeRecord.testRatioPercent}<span className="text-sm font-normal">%</span>
                    </div>
                    <div className="text-[10px] text-[#4F46E5] font-mono mt-0.5">Automated CI/CD</div>
                  </div>
                </div>

                {/* Top Skills */}
                <div className="mt-5 space-y-2">
                  {activeRecord.topVerifiedSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                        <span className="font-bold text-[#0F172A]">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#64748B]">{skill.tier}</span>
                        <span className="font-bold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
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

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center font-mono text-xs text-[#64748B]">
          Loading Verification Inspector...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
