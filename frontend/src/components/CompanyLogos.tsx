"use client";

import React from "react";

/**
 * Authentic African Fintech & Tech Leader Vector Logos
 * Faithfully crafted to match official brand specifications for:
 * OPay, Paystack, Flutterwave, Interswitch, and Chipper Cash.
 */

interface LogoProps {
  className?: string;
  size?: number;
}

/** ── 1. PAYSTACK ── */
export function PaystackMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Paystack"
    >
      <rect x="2" y="4" width="22" height="4.5" rx="2.25" fill="#0BA4DB" />
      <rect x="2" y="11" width="28" height="4.5" rx="2.25" fill="#0BA4DB" />
      <rect x="2" y="18" width="25" height="4.5" rx="2.25" fill="#0BA4DB" />
      <rect x="2" y="25" width="14" height="4.5" rx="2.25" fill="#0BA4DB" />
    </svg>
  );
}

export function PaystackLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <PaystackMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-bold text-sm tracking-tight text-[#0F172A] font-sans">
        paystack
      </span>
    </div>
  );
}

/** ── 2. OPAY ── */
export function OPayMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="OPay"
    >
      {/* Outer Emerald / Teal Ring */}
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="#00D287"
        strokeWidth="4.2"
        fill="none"
      />
      {/* Navy Embedded Accent Block on Left */}
      <rect
        x="2.5"
        y="13.5"
        width="6.5"
        height="5"
        rx="1.2"
        fill="#1A0B66"
      />
    </svg>
  );
}

export function OPayLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <OPayMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-sm tracking-tight text-[#1A0B66] font-sans">
        Pay
      </span>
    </div>
  );
}

/** ── 3. FLUTTERWAVE ── */
export function FlutterwaveMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Flutterwave"
    >
      {/* Left green loop segment */}
      <path
        d="M9 10C5 13 4 19 8 22C11 24.5 16 23 18 19"
        stroke="#00A859"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Top pink/coral loop segment */}
      <path
        d="M10 11C13 7 19 6.5 22.5 10C25 12.5 25 17 21 21"
        stroke="#FF6384"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Bottom orange loop segment */}
      <path
        d="M19 19.5C16 23.5 11 24 8 21.5C6 19.5 7 14 11.5 11.5"
        stroke="#F58220"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FlutterwaveLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <FlutterwaveMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-xs tracking-tight text-[#1B1C4B] font-sans lowercase">
        flutterwave
      </span>
    </div>
  );
}

/** ── 4. INTERSWITCH ── */
export function InterswitchMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Interswitch"
    >
      {/* Red Jumping Head */}
      <circle cx="24" cy="7.5" r="3.2" fill="#E41B13" />
      {/* Red Dynamic Jumping Body Swoosh */}
      <path
        d="M8 17.5C11.5 17.5 16 16.5 20.5 14C23.5 12.5 24 10.5 24 10.5C24 10.5 22 17 17.5 22C14.5 25.5 10.5 29 7 29C10.5 24.5 13.5 20.5 8 17.5Z"
        fill="#E41B13"
      />
    </svg>
  );
}

export function InterswitchLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-extrabold text-sm tracking-tight text-[#003853] font-sans">
        Interswitch
      </span>
      <InterswitchMark className="w-4 h-4 flex-shrink-0" />
    </div>
  );
}

/** ── 5. CHIPPER CASH ── */
export function ChipperCashMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Chipper Cash"
    >
      {/* Outer Monogram 'C' Ring (gap on right) */}
      <path
        d="M23.5 11.5 A 10.5 10.5 0 1 0 23.5 20.5"
        stroke="#1E224F"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      {/* Center Circle Hub */}
      <circle cx="15.5" cy="16" r="4.2" fill="#1E224F" />
      {/* Top and Bottom Vertical Connecting Spokes */}
      <line
        x1="15.5"
        y1="5.5"
        x2="15.5"
        y2="11.8"
        stroke="#1E224F"
        strokeWidth="2.8"
      />
      <line
        x1="15.5"
        y1="20.2"
        x2="15.5"
        y2="26.5"
        stroke="#1E224F"
        strokeWidth="2.8"
      />
      {/* Horizontal Spoke pointing right into the aperture */}
      <line
        x1="18.5"
        y1="16"
        x2="25"
        y2="16"
        stroke="#1E224F"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChipperCashLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <ChipperCashMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-sm tracking-tight text-[#1E224F] font-sans">
        Chipper
      </span>
      <span className="text-[8px] font-mono text-[#1E224F] -mt-2">®</span>
    </div>
  );
}
