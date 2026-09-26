"use client";

type BadgeTier = "self-reported" | "ai-verified" | "code-proven" | "top-strength";
type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

interface SkillBadgeProps {
  name: string;
  level: SkillLevel;
  confidence: number;
  tier: BadgeTier;
  sourceDescription?: string;
  className?: string;
}

const tierConfig: Record<
  BadgeTier,
  {
    label: string;
    borderColor: string;
    bgColor: string;
    barColor: string;
    icon: string;
  }
> = {
  "self-reported": {
    label: "Self-Reported",
    borderColor: "border-l-[var(--text-tertiary)]",
    bgColor: "bg-[var(--bg-tertiary)]",
    barColor: "bg-[var(--text-tertiary)]",
    icon: "◯",
  },
  "ai-verified": {
    label: "AI-Verified",
    borderColor: "border-l-[var(--color-info)]",
    bgColor: "bg-[var(--color-info-light)]",
    barColor: "bg-[var(--color-info)]",
    icon: "📄",
  },
  "code-proven": {
    label: "Code-Proven",
    borderColor: "border-l-[var(--color-success)]",
    bgColor: "bg-[var(--color-success-light)]",
    barColor: "bg-[var(--color-success)]",
    icon: "🟢",
  },
  "top-strength": {
    label: "Top Strength",
    borderColor: "border-l-[var(--color-warning)]",
    bgColor: "bg-[var(--color-warning-light)]",
    barColor: "bg-[var(--color-warning)]",
    icon: "⭐",
  },
};

const levelColors: Record<SkillLevel, string> = {
  Beginner: "text-[var(--color-info)] bg-[var(--color-info-light)]",
  Intermediate: "text-[var(--color-warning)] bg-[var(--color-warning-light)]",
  Advanced: "text-[var(--color-success)] bg-[var(--color-success-light)]",
};

export function SkillBadge({
  name,
  level,
  confidence,
  tier,
  sourceDescription,
  className = "",
}: SkillBadgeProps) {
  const config = tierConfig[tier];

  return (
    <div
      className={`
        card border-l-4 ${config.borderColor}
        p-4 transition-all duration-[var(--duration-fast)]
        hover:shadow-[var(--shadow-elevated)] hover:scale-[1.02]
        ${tier === "top-strength" ? "ring-1 ring-[var(--color-warning)]/20" : ""}
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{config.icon}</span>
          <span className="text-body font-semibold text-[var(--text-primary)]">
            {name}
          </span>
        </div>
        <span
          className={`text-caption px-2 py-0.5 rounded-[var(--radius-full)] font-medium ${levelColors[level]}`}
        >
          {level}
        </span>
      </div>

      {/* Confidence Bar */}
      <div className="flex items-center gap-3 mb-1.5">
        <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-[var(--radius-full)] overflow-hidden">
          <div
            className={`h-full rounded-[var(--radius-full)] transition-all duration-[var(--duration-extra-slow)] ${config.barColor}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <span className="text-caption font-semibold text-[var(--text-primary)] min-w-[36px] text-right">
          {confidence}%
        </span>
      </div>

      {/* Source Description */}
      {sourceDescription && (
        <p className="text-caption text-[var(--text-tertiary)]">
          {config.label} · {sourceDescription}
        </p>
      )}
      {!sourceDescription && tier === "self-reported" && (
        <p className="text-caption text-[var(--color-warning)]">
          Add proof to verify this skill →
        </p>
      )}
    </div>
  );
}

export type { SkillBadgeProps, BadgeTier, SkillLevel };
