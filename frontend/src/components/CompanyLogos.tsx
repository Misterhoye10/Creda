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

/** ── 6. MONIEPOINT ── */
export function MoniepointMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Moniepoint"
    >
      {/* Curved Cushion / Squircle Body */}
      <path
        d="M5 3C10.5 1.5 21.5 1.5 27 3C30.5 6.5 31 11.5 31 16C31 20.5 30.5 25.5 27 29C21.5 30.5 10.5 30.5 5 29C1.5 25.5 1 20.5 1 16C1 11.5 1.5 6.5 5 3Z"
        fill="#0066F5"
      />
      {/* Bold White Monogram M */}
      <path
        d="M8.2 22.8V9.2H12.2L16 15.6L19.8 9.2H23.8V22.8H20.4V14.2L17.2 19.4H14.8L11.6 14.2V22.8H8.2Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function MoniepointLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <MoniepointMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-sm tracking-tight text-[#0A0E1A] font-sans">
        Moniepoint
      </span>
    </div>
  );
}

/** ── 7. LEMFI ── */
export function LemFiMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="LemFi"
    >
      {/* Isometric / 3D Shadow Extrusion */}
      <path
        d="M7 6H15V18H25V24H7V6Z"
        transform="translate(2, 2.5)"
        fill="#050505"
      />
      {/* Collegiate Mint Green Front Face */}
      <path
        d="M7 6H15V18H25V24H7V6Z"
        fill="#52C997"
        stroke="#0A0A0A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LemFiLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-auto"
        aria-label="LEMFi"
      >
        {/* Full 3D Isometric LEMFi Wordmark */}
        {/* L 3D Shadow */}
        <path d="M4 6H12V20H20V26H4V6Z" transform="translate(1.5, 2)" fill="#000" />
        {/* L Face */}
        <path d="M4 6H12V20H20V26H4V6Z" fill="#52C997" stroke="#000" strokeWidth="1.2" />

        {/* E 3D Shadow */}
        <path d="M23 6H38V12H29V14H36V18H29V20H38V26H23V6Z" transform="translate(1.5, 2)" fill="#000" />
        {/* E Face */}
        <path d="M23 6H38V12H29V14H36V18H29V20H38V26H23V6Z" fill="#52C997" stroke="#000" strokeWidth="1.2" />

        {/* M 3D Shadow */}
        <path d="M41 6H48L53 14L58 6H65V26H58V14L54.5 20H51.5L48 14V26H41V6Z" transform="translate(1.5, 2)" fill="#000" />
        {/* M Face */}
        <path d="M41 6H48L53 14L58 6H65V26H58V14L54.5 20H51.5L48 14V26H41V6Z" fill="#52C997" stroke="#000" strokeWidth="1.2" />

        {/* F 3D Shadow */}
        <path d="M68 6H83V12H75V14H82V19H75V26H68V6Z" transform="translate(1.5, 2)" fill="#000" />
        {/* F Face */}
        <path d="M68 6H83V12H75V14H82V19H75V26H68V6Z" fill="#52C997" stroke="#000" strokeWidth="1.2" />

        {/* i 3D Shadow */}
        <path d="M86 6H92V11H86V6ZM86 14H92V26H86V14Z" transform="translate(1.5, 2)" fill="#000" />
        {/* i Face */}
        <path d="M86 6H92V11H86V6ZM86 14H92V26H86V14Z" fill="#52C997" stroke="#000" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/** ── 8. KUDA BANK ── */
export function KudaMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Kuda"
    >
      {/* 3 Iconic Dynamic Purple Strokes forming the 'K' mark */}
      {/* Leftmost thin vertical pillar */}
      <rect x="5" y="6" width="2.4" height="20" rx="1.2" fill="#40196D" />
      {/* Middle curved vertical ribbon */}
      <path
        d="M10.5 5.5C12 9 12 23 10.5 26.5H13.8C15.8 22.5 15.8 9.5 13.8 5.5H10.5Z"
        fill="#40196D"
      />
      {/* Right chevron arms */}
      <path
        d="M17.5 15.2L25 5.5H28.5L20 16.2L28.5 26.5H25L17.5 16.8V15.2Z"
        fill="#40196D"
      />
    </svg>
  );
}

export function KudaLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <KudaMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-sm tracking-tight text-[#40196D] font-sans">
        kuda.
      </span>
    </div>
  );
}

/** ── 9. ANDELA ── */
export function AndelaMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Andela"
    >
      {/* 8-pointed starburst / 16-facet geometric rosette with circular center aperture */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 2.5L19.8 6.8L25.5 6.4L25.2 12.2L29.5 16L25.2 19.8L25.5 25.6L19.8 25.2L16 29.5L12.2 25.2L6.5 25.6L6.8 19.8L2.5 16L6.8 12.2L6.5 6.4L12.2 6.8L16 2.5ZM16 10C12.7 10 10 12.7 10 16C10 19.3 12.7 22 16 22C19.3 22 22 19.3 22 16C22 12.7 19.3 10 16 10Z"
        fill="#335EEA"
      />
    </svg>
  );
}

export function AndelaLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <AndelaMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-sm tracking-tight text-[#335EEA] font-sans">
        Andela
      </span>
    </div>
  );
}

/** ── 10. PIGGYVEST ── */
export function PiggyVestMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="PiggyVest"
    >
      {/* Padlock / Piggy Bank Blue Emblem */}
      {/* Arch / Shackle */}
      <path
        d="M6 10.5C6 5 10.5 2 16 2C21.5 2 26 5 26 10.5"
        stroke="#083E9E"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Round Body with bottom left foot notch */}
      <path
        d="M16 9C9 9 3.5 14.5 3.5 21.5C3.5 24 4.5 26.5 6 28L6 30H10V28.8C11.8 29.6 13.8 30 16 30C23 30 28.5 24.5 28.5 17.5C28.5 10.5 23 9 16 9Z"
        fill="#083E9E"
      />
      {/* White Keyhole in Center */}
      <circle cx="16" cy="18" r="2.2" fill="#FFFFFF" />
      <polygon points="14.8,19 17.2,19 17.9,23.5 14.1,23.5" fill="#FFFFFF" />
    </svg>
  );
}

export function PiggyVestLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <PiggyVestMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-extrabold text-sm tracking-tight text-[#083E9E] font-sans">
        piggyvest
      </span>
    </div>
  );
}

/** ── 11. RELIANCE HEALTH / RELIANCE HMO ── */
export function RelianceMark({ className = "w-5 h-5", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Reliance Health"
    >
      {/* Deep Navy Left and Bottom Cross Arms */}
      <rect x="2" y="12" width="18" height="8" rx="4" fill="#0A3C5F" />
      <rect x="12" y="12" width="8" height="18" rx="4" fill="#0A3C5F" />

      {/* Sky Blue Top and Right Cross Arms */}
      <rect x="12" y="2" width="8" height="18" rx="4" fill="#78C4F4" />
      <rect x="12" y="12" width="18" height="8" rx="4" fill="#78C4F4" />

      {/* Soft Overlap Blend in Center Square */}
      <rect x="12" y="12" width="8" height="8" rx="2" fill="#3D7DAB" opacity="0.9" />
    </svg>
  );
}

export function RelianceLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <RelianceMark className="w-5 h-5 flex-shrink-0" />
      <span className="font-semibold text-sm tracking-tight text-[#0A3C5F] font-sans">
        Reliance<span className="font-normal text-[#78C4F4]">HMO</span>
      </span>
    </div>
  );
}


