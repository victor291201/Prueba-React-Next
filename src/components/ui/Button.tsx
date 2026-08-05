import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: cn(
      "bg-indigo-600 text-white",
      "hover:bg-indigo-500",
      "focus:ring-indigo-500"
    ),
    secondary: cn(
      "border border-slate-300 bg-white text-slate-700",
      "hover:bg-slate-50",
      "focus:ring-indigo-500",
      "dark:border-neutral-700 dark:bg-neutral-800",
      "dark:text-neutral-200 dark:hover:bg-neutral-700"
    ),
    danger: cn(
      "bg-red-600 text-white",
      "hover:bg-red-500",
      "focus:ring-red-500"
    ),
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "focus:ring-offset-white dark:focus:ring-offset-neutral-900",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        size === "sm" && "px-2.5 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "icon" && "p-2",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
