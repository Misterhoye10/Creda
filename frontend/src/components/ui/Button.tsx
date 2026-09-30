"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-primary-hover)] active:brightness-90",
  secondary:
    "bg-[var(--bg-primary)] text-[var(--brand-primary)] border border-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]",
  ghost:
    "bg-[var(--brand-primary-ghost)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]",
  destructive:
    "bg-[var(--color-error)] text-white hover:brightness-90 active:brightness-85",
  outline:
    "bg-transparent text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-[0.875rem] gap-1.5",
  md: "h-10 px-5 text-[1rem] gap-2",
  lg: "h-12 px-6 text-[1.125rem] gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-medium whitespace-nowrap flex-shrink-0
          rounded-[var(--radius-md)] cursor-pointer
          transition-all duration-[var(--duration-fast)] active:scale-[0.98]
          focus-ring
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
