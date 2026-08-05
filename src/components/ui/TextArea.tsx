import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ id, label, error, className = "", ...rest }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-neutral-300"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full resize-y rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:outline-none focus:ring-2 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-800"
              : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 dark:border-neutral-700 dark:focus:border-indigo-500 dark:focus:ring-indigo-800"
          } ${className}`}
          {...rest}
        />
        {error ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
