import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ id, label, className = "", children, ...rest }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-neutral-300"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-800 ${className}`}
          {...rest}
        >
          {children}
        </select>
      </div>
    );
  }
);
