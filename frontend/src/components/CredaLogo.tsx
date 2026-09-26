"use client";

import React from "react";

/**
 * CredaMark — Volumetric 3D Proof Ribbon Monogram
 * Inspired by tactile 3D minimalism (Smooth Bot aesthetic).
 * Represents continuous cryptographic verification, repository AST proof,
 * and the Creda Protocol as an illuminated 3D curved ribbon.
 */
export function CredaMark({
  size = 32,
  variant = "freestanding",
  className = "",
}: {
  size?: number;
  variant?: "freestanding" | "tile";
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Creda Mark"
    >
      <defs>
        {/* Top Upper Ribbon Gradient — Specular Periwinkle to Electric Indigo */}
        <linearGradient
          id="creda-vol-top"
          x1="6"
          y1="6"
          x2="30"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#C7D2FE" />
          <stop offset="60%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        {/* Lower Ribbon Gradient — Deep Architectural Cobalt to Obsidian Indigo */}
        <linearGradient
          id="creda-vol-bottom"
          x1="6"
          y1="16"
          x2="28"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="85%" stopColor="#3730A3" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Overlap Crease Shadow — Gives authentic 3D volumetric fold depth */}
        <linearGradient
          id="creda-vol-shadow"
          x1="12"
          y1="13"
          x2="16"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0F172A" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </linearGradient>

        {/* Specular Edge Highlight Gradient */}
        <linearGradient
          id="creda-vol-specular"
          x1="10"
          y1="5"
          x2="26"
          y2="9"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Cryptographic Core Nexus Gradient */}
        <radialGradient
          id="creda-nexus-radial"
          cx="0.35"
          cy="0.35"
          r="0.65"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#A5B4FC" />
          <stop offset="80%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#312E81" />
        </radialGradient>

        {/* Subtle Ambient Drop Shadow for tactile grounding */}
        <filter id="creda-mark-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#0F172A"
            floodOpacity="0.12"
          />
        </filter>
      </defs>

      {/* Optional Anodized Obsidian Tile Base */}
      {variant === "tile" && (
        <g>
          <rect
            width="36"
            height="36"
            rx="10"
            fill="#0F172A"
          />
          <rect
            x="0.5"
            y="0.5"
            width="35"
            height="35"
            rx="9.5"
            stroke="rgba(255, 255, 255, 0.12)"
          />
        </g>
      )}

      {/* Volumetric Ribbon Group with Filter */}
      <g filter="url(#creda-mark-shadow)">
        {/* ── Layer 1: Lower Ribbon Arc (Curves through bottom into aperture) ── */}
        <path
          d="M 27 25.5 C 27 27.5 25 29.5 22.5 29.5 C 14.5 29.5 7.5 24 7.5 17.5 C 7.5 14.5 9 12 11.5 10.5 C 13.5 9.5 15.5 10.5 15.5 12.8 C 15.5 14.5 13.5 16 13 17.5 C 12.5 19 13.5 23 18.5 23.8 C 21.5 24.2 24.5 23 25.8 22 C 26.8 21.2 27 23.5 27 25.5 Z"
          fill="url(#creda-vol-bottom)"
        />

        {/* ── Layer 2: 3D Occlusion Shadow between folds ── */}
        <path
          d="M 10 13 C 12.5 16 14.5 18 17 19.5 C 14.5 20.5 12 19 10 16.5 Z"
          fill="url(#creda-vol-shadow)"
        />

        {/* ── Layer 3: Upper Ribbon Arc (Illuminated top crest) ── */}
        <path
          d="M 27 10.5 C 27 8.2 25 6.5 22 6.5 C 14.5 6.5 7.5 12 7.5 18.5 C 7.5 21 8.5 23 10.5 23.5 C 12.2 24 14 22.8 14 21 C 14 19.5 12.5 18.2 12.5 16.5 C 12.5 13.5 15.5 11.5 19 11.5 C 22 11.5 24.5 12.5 25.8 13.5 C 26.8 14.2 27 12.5 27 10.5 Z"
          fill="url(#creda-vol-top)"
        />

        {/* ── Layer 4: Specular Lighting Sheen along Top Rim ── */}
        <path
          d="M 24 8.5 C 20.5 7.2 16.5 7.2 13 8.8 C 10.5 10 9 12 8.5 14.5"
          stroke="url(#creda-vol-specular)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* ── Layer 5: Central Proof Nexus (Floating Spherical AST Node) ── */}
        <circle
          cx="20.5"
          cy="18"
          r="3"
          fill="url(#creda-nexus-radial)"
        />
        <circle
          cx="19.5"
          cy="17"
          r="0.9"
          fill="#FFFFFF"
          opacity="0.8"
        />

        {/* ── Layer 6: Precision Micro-Crosshair Tick (Cryptographic Proof) ── */}
        <path
          d="M 24.5 18 H 28"
          stroke="#4F46E5"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/**
 * CredaLogo — Full Brand Lockup (Volumetric Mark + Modern Grotesque Typography + Technical Monospace Tag)
 */
export function CredaLogo({
  size = 28,
  variant = "freestanding",
  showTag = true,
  tagText = "PROTOCOL",
  light = false,
  className = "",
}: {
  size?: number;
  variant?: "freestanding" | "tile";
  showTag?: boolean;
  tagText?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Volumetric Mark with Smooth Hover Lift */}
      <div className="relative transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 flex-shrink-0">
        <CredaMark size={size} variant={variant} />
      </div>

      {/* Wordmark + Tag */}
      <div className="flex items-center gap-2">
        <span
          className={`font-bold text-[19px] tracking-tight font-sans transition-colors ${
            light ? "text-white" : "text-[#0F172A]"
          }`}
        >
          Creda
        </span>
        {showTag && (
          <span
            className={`hidden sm:inline-flex items-center text-[9.5px] font-mono font-medium px-1.5 py-0.5 rounded border tracking-wider transition-colors ${
              light
                ? "bg-neutral-900 border-neutral-800 text-neutral-400"
                : "bg-neutral-100/80 border-neutral-200 text-[#64748B] group-hover:border-[#4F46E5]/30 group-hover:text-[#4F46E5]"
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
