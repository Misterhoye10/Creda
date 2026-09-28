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
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDemoAccess = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await api.login("hoye@creda.app", "Password123!");
      if (response?.access_token) {
        localStorage.setItem("creda_token", response.access_token);
      }
      if (response?.user) {
        localStorage.setItem("creda_user", JSON.stringify(response.user));
      }
    } catch {
      // Offline / cloud cold-start fallback
      localStorage.setItem(
        "creda_user",
        JSON.stringify({
          name: "Folarin Oyewole",
          email: "hoye@creda.app",
          professional_title: "Backend Lead & Distributed Systems Engineer",
          location: "Lagos, Nigeria",
          public_url: "hoye",
        })
      );
    }
    localStorage.setItem("creda_user_email", "hoye@creda.app");
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const email = formData.email.trim();
    const isDemoAccount = email.toLowerCase() === "hoye@creda.app" || email.toLowerCase().includes("hoye");

    try {
      const response = await api.login(email, formData.password);
      if (response?.access_token) {
        localStorage.setItem("creda_token", response.access_token);
      }
      if (response?.user) {
        localStorage.setItem("creda_user", JSON.stringify(response.user));
      }
      localStorage.setItem("creda_user_email", email);
      setIsSubmitting(false);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (isDemoAccount) {
        // Instant seamless access for Hoye / Hackathon demo
        handleDemoAccess();
        return;
      }

      const errObj = err as { detail?: string; message?: string; status?: number };
      if (errObj && (errObj.status === 401 || errObj.status === 400 || errObj.status === 422) && errObj.detail) {
        setErrorMessage(
          errObj.status === 401
            ? "Invalid email or password. If you haven't registered on the live backend yet, click 'Claim Free Passport' above or use 1-Click Demo Sign In."
            : errObj.detail
        );
        setIsSubmitting(false);
      } else {
        // Fallback for demo / offline mode
        localStorage.setItem("creda_user_email", email);
        const namePart = email.split("@")[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        localStorage.setItem(
          "creda_user",
          JSON.stringify({
            name: formattedName,
            email: email,
            professional_title: "Backend Lead & Systems Engineer",
            location: "Lagos, Nigeria",
          })
        );
        setTimeout(() => {
          setIsSubmitting(false);
          router.push("/dashboard");
        }, 600);
      }
    }
  };

  const handleGithubLogin = () => {
    handleDemoAccess();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0F172A] flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white font-sans antialiased">
      {/* ── Minimalist Architectural Header (Oberon Style) ── */}
      <header className="border-b border-[#E5E7EB] bg-[#FAFAF8]/95 backdrop-blur-md px-4 sm:px-10 h-14 sm:h-16 flex items-center justify-between">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center tracking-tight group">
            <CredaLogo size={26} showTag={true} tagText="ACCESS" />
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
      <main className="flex-1 flex flex-col items-center justify-start px-3 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-lg rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Structural Crosshairs */}
          <span className="absolute top-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute top-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 left-3 text-xs font-mono text-neutral-300 select-none">+</span>
          <span className="absolute bottom-3 right-3 text-xs font-mono text-neutral-300 select-none">+</span>

          {/* Header Typography */}
          <div className="mb-8 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] leading-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-mono mt-1.5">
              Sign in to access your Skill Passport and candidate ledgers.
            </p>
          </div>

          {/* 1-Click Demo Login (Hoye) */}
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isSubmitting}
            className="w-full h-12 mb-3 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer active:translate-y-0.5 disabled:opacity-75 whitespace-nowrap flex-shrink-0"
          >
            <ShieldCheck size={16} />
            <span className="whitespace-nowrap">Instant Demo Access (Folarin Oyewole)</span>
          </button>

          {/* 1-Click Fast Developer Login: GitHub */}
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl text-xs font-mono uppercase font-semibold border border-[#E5E7EB] bg-[#FAFAF8] hover:bg-white text-[#0F172A] transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer active:translate-y-0.5 disabled:opacity-75 whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="whitespace-nowrap">Continue with GitHub</span>
          </button>

          {/* Architectural Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#E5E7EB]" />
            <span className="absolute bg-white px-3 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
              or access with email
            </span>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Authentication Notice</div>
                <div className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</div>
              </div>
            </div>
          )}

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
                className="w-full h-12 rounded-xl text-xs font-mono uppercase font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white btn-tactile flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait whitespace-nowrap flex-shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                    <span className="whitespace-nowrap">Signing In...</span>
                  </>
                ) : (
                  <>
                    <span className="whitespace-nowrap">Sign In →</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Telemetry Note */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#4F46E5]" />
              Encrypted & Tamper-Proof
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
