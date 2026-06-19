import { NavWrapper } from "@/components/layout/NavWrapper";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to content
      </a>
      <NavWrapper />
      <div id="main">{children}</div>
    </>
  );
}
