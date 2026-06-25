import { ReactNode } from "react";

interface AlertProps {
  variant: "error" | "success" | "warning" | "info";
  children: ReactNode;
  className?: string;
}

const styles = {
  error:   { bg: "bg-[var(--color-error-50)]",   border: "border-l-4 border-error-400",   text: "text-[var(--color-error-900)]"   },
  success: { bg: "bg-[var(--color-success-50)]", border: "border-l-4 border-success-600", text: "text-[var(--color-success-900)]" },
  warning: { bg: "bg-[var(--color-warning-50)]", border: "border-l-4 border-warning-600", text: "text-[var(--color-warning-900)]" },
  info:    { bg: "bg-[var(--color-primary-50)]", border: "border-l-4 border-primary-400", text: "text-[var(--color-primary-900)]" },
};

const icons: Record<AlertProps["variant"], ReactNode> = {
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const inner = (icon: ReactNode, children: ReactNode) => (
  <>
    <span className="mt-[1px] shrink-0">{icon}</span>
    <span>{children}</span>
  </>
);

export function Alert({ variant, children, className = "" }: Readonly<AlertProps>) {
  const { bg, border, text } = styles[variant];
  const base = `flex items-start gap-2 p-3 rounded-md text-sm ${bg} ${border} ${text} ${className}`;

  // Errors are urgent — assertive live region announced immediately.
  // All other variants are polite — announced at the next idle moment.
  if (variant === "error") {
    return (
      <div role="alert" aria-live="assertive" className={base}>
        {inner(icons.error, children)}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className={base}>
      {inner(icons[variant], children)}
    </div>
  );
}
