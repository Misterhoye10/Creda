"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface TooltipProps {
  /** The content shown inside the tooltip bubble */
  content: string;
  /** Where the tooltip appears relative to the trigger */
  position?: "top" | "bottom" | "left" | "right";
  /** The trigger element(s) */
  children: React.ReactNode;
  /** Optional extra className on the wrapper */
  className?: string;
  /** Delay in ms before tooltip appears (default 300) */
  delay?: number;
}

export function Tooltip({
  content,
  position = "top",
  children,
  className = "",
  delay = 300,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<string, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-[#0F172A] border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[#0F172A] border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-[#0F172A] border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-[#0F172A] border-y-transparent border-l-transparent",
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && content && (
        <div
          role="tooltip"
          className={`
            absolute z-50 ${positionClasses[position]}
            px-3 py-2 rounded-lg
            bg-[#0F172A] text-white
            text-[11px] font-sans font-medium leading-[1.5]
            max-w-[240px] w-max
            shadow-lg
            pointer-events-none select-none
            animate-fade-in-up
          `}
          style={{ animationDuration: "150ms" }}
        >
          {content}
          {/* Arrow */}
          <span
            className={`absolute w-0 h-0 border-[4px] ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
