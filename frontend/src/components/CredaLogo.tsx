"use client";

import React from "react";

/**
 * CredaMark — Precision Geometric Proof Monogram
 * Represents cryptographic verification, repository AST proof, and the Creda Protocol.
 */
export function CredaMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Obsidian Architectural Base Frame */}
      <rect width="32" height="32" rx="8" fill="#0F172A" />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="7.5"
        stroke="rgba(255, 255, 255, 0.1)"
      />

      {/* The Architectural 'C' Proof Ribbon */}
      <path
        d="M22 10.5H14C11.2386 10.5 9 12.7386 9 15.5V16.5C9 19.2614 11.2386 21.5 14 21.5H22"
        stroke="url(#creda-gradient)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Central Verification Nexus (AST Proof Node) */}
      <circle cx="16" cy="16" r="2.2" fill="#818CF8" />

      {/* Cryptographic verification crosshair tick */}
      <path
        d="M19.5 16H23"
        stroke="#4F46E5"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Subtle architectural gradient */}
      <defs>
        <linearGradient
          id="creda-gradient"
          x1="9"
          y1="10.5"
          x2="23"
          y2="21.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * CredaLogo — Full Brand Lockup (Mark + Modern Grotesque Typography + Monospace Tag)
 */
export function CredaLogo({
  size = 32,
  showTag = true,
  tagText = "PROTOCOL",
  light = false,
  className = "",
}: {
  size?: number;
  showTag?: boolean;
  tagText?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <div className="relative transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
        <CredaMark size={size} />
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`font-bold text-xl tracking-tight font-sans transition-colors ${
            light ? "text-white" : "text-[#0F172A]"
          }`}
        >
          Creda
        </span>
        {showTag && (
          <span
            className={`hidden sm:inline-flex items-center text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border tracking-wider ${
              light
                ? "bg-neutral-900 border-neutral-800 text-neutral-400"
                : "bg-neutral-100 border-neutral-200 text-[#64748B]"
            }`}
          >
            [{tagText}]
          </span>
        )}
      </div>
    </div>
  );
}

export default CredaLogo;
