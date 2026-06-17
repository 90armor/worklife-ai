import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  helperText?: string;
  error?: string;
}

export function FormInput({
  label,
  id,
  helperText,
  error,
  required,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-body font-medium">
          {label}
          {required && (
            <span className="text-error-400 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        id={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-hint` : undefined}
        className={[
          "w-full h-11 px-3 rounded-md text-body bg-card",
          "border transition-all duration-150 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
          error
            ? "border-error-400 focus:border-error-400"
            : "border-neutral-border focus:border-primary-600",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-error-600 dark:text-error-900">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-hint`} className="text-caption">
          {helperText}
        </p>
      )}
    </div>
  );
}
