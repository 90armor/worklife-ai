import { BrandPanel } from "./BrandPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">

      {/* Brand panel — hidden below md */}
      <div className="hidden md:flex flex-1 min-h-screen">
        <BrandPanel />
      </div>

      {/* Form panel */}
      <div className="flex-[1.05] flex items-center justify-center min-h-screen overflow-y-auto bg-white dark:bg-surface-raised py-12 px-6 md:px-10">
        <div className="w-full max-w-sm animate-slideUp">
          {children}
        </div>
      </div>
    </div>
  );
}
