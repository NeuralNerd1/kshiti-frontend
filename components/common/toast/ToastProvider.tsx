"use client";

import { createContext, useContext, useState } from "react";
import Toast from "./ToastView";
import type { ToastItem, ToastType } from "./types";

type ToastContextType = {
  show: (type: ToastType, message: string) => void;
};

const ToastContext =
  createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = (type: ToastType, message: string) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [
      ...prev,
      { id, type, message },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={(id) =>
              setToasts((prev) =>
                prev.filter((t) => t.id !== id)
              )
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }
  return ctx;

}

export type { ToastType };
