"use client";

import React, { useEffect, useState } from "react";
import QRCodeLib from "qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export function QRCode({
  value,
  size = 90,
  className = "",
  darkColor = "#0F172A",
  lightColor = "#FFFFFF",
}: QRCodeProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    QRCodeLib.toString(value, {
      type: "svg",
      margin: 1,
      width: size,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((svg) => {
        if (isMounted) setSvgMarkup(svg);
      })
      .catch((err) => {
        console.error("QR generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (!svgMarkup) {
    return (
      <div
        className={`bg-neutral-100 flex items-center justify-center animate-pulse rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[9px] text-neutral-400 font-mono">GEN...</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-block overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
