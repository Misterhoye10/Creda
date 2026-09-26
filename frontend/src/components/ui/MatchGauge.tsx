"use client";

import { useEffect, useRef, useState } from "react";

interface MatchGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getMatchLabel(percentage: number): string {
  if (percentage >= 85) return "Excellent Match";
  if (percentage >= 70) return "Strong Match";
  if (percentage >= 40) return "Partial Match";
  return "Weak Match";
}

function getMatchColor(percentage: number): string {
  if (percentage >= 70) return "var(--color-success)";
  if (percentage >= 40) return "var(--color-warning)";
  return "var(--color-error)";
}

export function MatchGauge({
  percentage,
  size = 160,
  strokeWidth = 10,
  className = "",
}: MatchGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const hasAnimated = useRef(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
  const color = getMatchColor(percentage);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * percentage));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-tertiary)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0, 0, 0.2, 1)",
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-h1 font-bold"
            style={{ color }}
          >
            {animatedValue}%
          </span>
        </div>
      </div>
      <span
        className="text-body font-semibold"
        style={{ color }}
      >
        {getMatchLabel(percentage)}
      </span>
    </div>
  );
}
