"use client";

import { useState, useEffect } from "react";

export function ProtocolStatusTicker() {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toISOString().replace("T", " ").slice(0, 19) + " UTC";
      setTimeStr(utc);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0B1120] text-stone-300 border-b border-neutral-800 py-1.5 px-4 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-emerald-400 font-semibold tracking-wider">CREDA PROTOCOL v2.4</span>
          <span className="text-neutral-600 hidden sm:inline">•</span>
          <span className="text-neutral-300 hidden sm:inline">LEDGER: OPERATIONAL</span>
          <span className="text-neutral-600 hidden md:inline">•</span>
          <span className="text-neutral-400 hidden md:inline">ED25519 CA ROOT</span>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] text-neutral-400 ml-auto">
          {timeStr && (
            <span className="hidden sm:inline text-neutral-400 font-mono tracking-tight text-[11px]">
              {timeStr}
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-700 text-stone-200 text-[10px] font-semibold tracking-wider uppercase">
            AST PROOF ENGINE LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
