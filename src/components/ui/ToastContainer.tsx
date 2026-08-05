"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import type { Toast, ToastType } from "@/store/toastStore";
import {
  CheckIcon,
  XCircleIcon,
  InfoIcon,
  XIcon,
} from "@/components/ui/icons";

const TOAST_DURATION = 3000;

const typeStyles: Record<ToastType, string> = {
  success:
    "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
  info:
    "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300",
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckIcon className="h-4 w-4" />,
  error: <XCircleIcon className="h-4 w-4" />,
  info: <InfoIcon className="h-4 w-4" />,
};

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div
      aria-live="polite"
      aria-label="Notificaciones"
      className="fixed right-4 top-4 z-[100] flex flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${typeStyles[toast.type]}`}
    >
      {typeIcons[toast.type]}
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="-mr-1 ml-2 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Cerrar notificación"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
