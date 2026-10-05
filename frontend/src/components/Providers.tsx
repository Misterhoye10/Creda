"use client";

import React, { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

function isExtensionError(err: unknown, str?: string): boolean {
  let text = "";
  if (str) text += str + " ";
  if (err && typeof err === "object") {
    const errorObj = err as { message?: string; stack?: string; reason?: { message?: string; stack?: string } };
    if (errorObj.message) text += errorObj.message + " ";
    if (errorObj.stack) text += errorObj.stack + " ";
    if (errorObj.reason) {
      if (errorObj.reason.message) text += errorObj.reason.message + " ";
      if (errorObj.reason.stack) text += errorObj.reason.stack + " ";
    }
  }
  try {
    text += String(err || "");
  } catch {
    // Ignore stringify error
  }

  return (
    text.includes("MetaMask") ||
    text.includes("Failed to connect to MetaMask") ||
    text.includes("nkbihfbeogaeaoehlefnkodbefgpgknn") ||
    text.includes("chrome-extension://") ||
    text.includes("moz-extension://") ||
    text.includes("safari-extension://") ||
    text.includes("extension not found") ||
    text.includes("inpage.js")
  );
}

// Module-level guard: runs immediately upon bundle execution
if (typeof window !== "undefined") {
  // 1. Intercept addEventListener so Next.js error overlay listeners never receive extension errors
  const rawAddEventListener = window.addEventListener;
  window.addEventListener = function (this: any, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    if ((type === "unhandledrejection" || type === "error") && typeof listener === "function") {
      const wrappedListener = function (this: any, event: any) {
        const err = event?.reason || event?.error || event;
        const msg = event?.message || "";
        if (isExtensionError(err, msg)) {
          if (event?.preventDefault) event.preventDefault();
          if (event?.stopImmediatePropagation) event.stopImmediatePropagation();
          return false;
        }
        return listener.apply(this, arguments as any);
      };
      return rawAddEventListener.call(this, type, wrappedListener as EventListener, options);
    }
    return rawAddEventListener.apply(this, arguments as any);
  };

  // 2. Direct capture-phase listeners on window
  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      const err = event?.reason;
      if (isExtensionError(err, err?.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    "error",
    (event: ErrorEvent) => {
      const err = event?.error;
      const msg = event?.message || event?.filename || "";
      if (isExtensionError(err, msg)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  // 3. Dynamic getter/setter on console.error
  let currentConsoleError = console.error;
  try {
    Object.defineProperty(console, "error", {
      configurable: true,
      enumerable: true,
      get: () => {
        return function (...args: any[]) {
          for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (isExtensionError(arg, typeof arg === "string" ? arg : "")) {
              return;
            }
          }
          return currentConsoleError.apply(console, args);
        };
      },
      set: (newFn) => {
        currentConsoleError = newFn;
      },
    });
  } catch {
    console.error = function (...args: any[]) {
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (isExtensionError(arg, typeof arg === "string" ? arg : "")) {
          return;
        }
      }
      return currentConsoleError.apply(console, args);
    };
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleRejection = (e: PromiseRejectionEvent) => {
      if (isExtensionError(e.reason, e.reason?.message)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    const handleError = (e: ErrorEvent) => {
      if (isExtensionError(e.error, `${e.filename || ""} ${e.message || ""}`)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection, true);
    window.addEventListener("error", handleError, true);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection, true);
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
