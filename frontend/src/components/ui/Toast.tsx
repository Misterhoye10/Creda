"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const variantStyles: Record<
  ToastVariant,
  { borderColor: string; icon: string; iconColor: string }
> = {
  success: {
    borderColor: "border-l-[var(--color-success)]",
    icon: "✓",
    iconColor: "text-[var(--color-success)]",
  },
  error: {
    borderColor: "border-l-[var(--color-error)]",
    icon: "✕",
    iconColor: "text-[var(--color-error)]",
  },
  warning: {
    borderColor: "border-l-[var(--color-warning)]",
    icon: "⚠",
    iconColor: "text-[var(--color-warning)]",
  },
  info: {
    borderColor: "border-l-[var(--color-info)]",
    icon: "ℹ",
    iconColor: "text-[var(--color-info)]",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const style = variantStyles[toast.variant];
          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto
                animate-slide-in-right
                bg-[var(--bg-elevated)] border border-[var(--border-default)]
                border-l-4 ${style.borderColor}
                rounded-[var(--radius-md)]
                shadow-[var(--shadow-modal)]
                p-4 flex items-start gap-3
              `}
            >
              <span className={`text-lg flex-shrink-0 ${style.iconColor}`}>
                {style.icon}
              </span>
              <p className="text-body-sm text-[var(--text-primary)] flex-1">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
