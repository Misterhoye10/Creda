"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CredaLogo } from "@/components/CredaLogo";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 750);
  };

  const handleGithubLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Top Announcement / Status Strip ───────────────── */}
      <div className="w-full bg-[#0F172A] text-white border-b border-neutral-800 py-2.5 px-6 sm:px-10 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            <span className="text-[#818CF8] font-semibold">[ PASSPORT VERIFICATION GATEWAY ]</span>
            <span className="text-neutral-300 hidden md:inline">
              SECURE ACCESS TO CRYPTOGRAPHIC SKILL LEDGERS
            </span>
          </div>
          <span className="text-neutral-400 text-[11px]">
            SHA-256 LEDGER NODE
          </span>
        </div>
      </div>

      {/* ── Minimalist Architectural Header (Oberon Style) ── */}
      <header className="border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={34} showTag={true} tagText="ACCESS" />
          </Link>
          <div className="text-xs font-mono text-[#64748B] flex items-center gap-2">
            <span className="hidden sm:inline">Don&apos;t have a passport?</span>
            <Link
              href="/auth/signup"
              className="text-[#0F172A] hover:text-[#4F46E5] font-bold underline underline-offset-4 transition-colors"
            >
              Claim Free Passport →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Architectural Card Container ───────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 my-4 sm:my-8">
        <div className="w-full max-w-lg rounded-3xl border border-[#E5E7EB] bg-white p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Structural Crosshairs */}
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

          {/* Header Typography */}
          <div className="mb-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-[10px] font-mono text-[#4F46E5] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
              AUTHENTICATED ACCESS
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Access your verified ledger.
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] font-mono mt-2 leading-relaxed">
              Sign in to manage your Skill Passport, inspect candidate ledgers, or simulate technical job matches.
            </p>
          </div>

          {/* 1-Click Fast Developer Login: GitHub */}
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#0F172A] hover:bg-neutral-800 text-white transition-all shadow-xs flex items-center justify-center gap-3 cursor-pointer active:translate-y-0.5 disabled:opacity-75"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          {/* Architectural Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#E5E7EB]" />
            <span className="absolute bg-white px-3 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
              or access with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Email */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold mb-1.5">
                Work or Professional Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#E5E7EB] hover:border-neutral-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 focus:bg-white text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] transition-all outline-none"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[11px] font-mono text-[#64748B] hover:text-[#4F46E5] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#4F46E5] transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs hover:shadow-md hover:shadow-indigo-500/20 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Access Skill Passport</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Telemetry Note */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#4F46E5]" />
              SHA-256 Sealed
            </span>
            <span className="text-neutral-300">//</span>
            <span>Zero Code Persisted</span>
          </div>
        </div>
      </main>

      {/* ── Architectural Minimalist Footer ─────────────────── */}
      <footer className="border-t border-[#E5E7EB] px-6 sm:px-10 py-5 text-xs font-mono text-[#64748B] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Creda Protocol. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#0F172A] transition-colors">
              Home
            </Link>
            <Link href="/auth/signup" className="hover:text-[#0F172A] transition-colors font-semibold text-[#4F46E5]">
              Claim Free Passport
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
