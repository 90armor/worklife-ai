"use client";

import { Sidebar, SidebarProvider, SidebarMobileToggle, useSidebar } from "@/components/Sidebar";

function ChatLayoutInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main content shifts right to make room for sidebar on desktop */}
      <div
        className={[
          "flex-1 flex flex-col min-w-0 overflow-hidden",
          // transition-all instead of transition-[margin] — arbitrary transition property has parsing issues
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "md:ml-sidebar-rail" : "md:ml-sidebar",
        ].join(" ")}
      >
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-2 px-3 h-14 border-b border-neutral-border bg-surface-raised flex-shrink-0">
          <SidebarMobileToggle />
          <span className="font-medium text-heading text-sm">WorkLife AI</span>
        </header>

        <main id="main" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ChatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <ChatLayoutInner>{children}</ChatLayoutInner>
    </SidebarProvider>
  );
}
