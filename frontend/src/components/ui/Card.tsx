import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = { sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div
      className={`bg-card border border-neutral-border rounded-lg shadow-sm ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
