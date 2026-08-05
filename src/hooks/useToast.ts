import { useToastStore } from "@/store/toastStore";
import type { ToastType } from "@/store/toastStore";

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (message: string) => addToast("success", message),
    error: (message: string) => addToast("error", message),
    info: (message: string) => addToast("info", message),
  };
}

export type { ToastType };
