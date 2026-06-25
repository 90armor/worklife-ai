import { InputHTMLAttributes, useState } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  helperText?: string;
  error?: string;
}

const inputBase = [
  "w-full h-11 px-3 rounded-md text-body bg-surface-raised",
  "border transition-all duration-150 ease-out",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
].join(" ");

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
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
        <label htmlFor={id} className="text-[0.8125rem] text-muted font-medium">
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
          inputBase,
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
        <p id={`${id}-error`} role="alert" className="text-xs text-error-600 dark:text-error-900">
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

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  onChange: (value: string) => void;
}

export function PasswordInput({
  id,
  label,
  value,
  autoComplete = "current-password",
  disabled,
  required,
  minLength,
  onChange,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[0.8125rem] text-muted font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder="••••••••"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={[
            inputBase,
            "pr-10 border-neutral-border focus:border-primary-600",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-r-md"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
