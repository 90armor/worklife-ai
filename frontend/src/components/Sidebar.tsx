"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { auth } from "@/lib/auth";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

interface ConversationGroup {
  label: string;
  items: Conversation[];
}

interface SidebarContextValue {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => {},
  openMobile: () => {},
  closeMobile: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

// ── Mock conversations ────────────────────────────────────────────────────────

const DAY = 86_400_000;

const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "1", title: "Visa requirements for engineer role in Tokyo", updatedAt: new Date() },
  { id: "2", title: "Health insurance enrollment deadline for April", updatedAt: new Date() },
  { id: "3", title: "Salary negotiation tips in Japanese companies", updatedAt: new Date(Date.now() - DAY) },
  { id: "4", title: "Nenkin pension system explained for foreigners", updatedAt: new Date(Date.now() - DAY) },
  { id: "5", title: "Finding apartments near Shinjuku on a budget", updatedAt: new Date(Date.now() - 3 * DAY) },
  { id: "6", title: "Work-life balance expectations at Japanese startups", updatedAt: new Date(Date.now() - 4 * DAY) },
  { id: "7", title: "Best Japanese language learning resources for N3", updatedAt: new Date(Date.now() - 5 * DAY) },
  { id: "8", title: "Registering residence card at city hall process", updatedAt: new Date(Date.now() - 6 * DAY) },
  { id: "9", title: "Opening a Japanese bank account as a foreigner", updatedAt: new Date(Date.now() - 6 * DAY) },
];

function groupConversations(items: Conversation[]): ConversationGroup[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - DAY);
  const weekAgoStart = new Date(todayStart.getTime() - 7 * DAY);

  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const week: Conversation[] = [];

  for (const c of items) {
    const day = new Date(c.updatedAt.getFullYear(), c.updatedAt.getMonth(), c.updatedAt.getDate());
    if (day >= todayStart) today.push(c);
    else if (day >= yesterdayStart) yesterday.push(c);
    else if (day >= weekAgoStart) week.push(c);
  }

  const groups: ConversationGroup[] = [];
  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (week.length) groups.push({ label: "Previous 7 days", items: week });
  return groups;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ── SidebarProvider ───────────────────────────────────────────────────────────

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setIsCollapsed(stored === "true");
  }, []);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ── Mobile toggle button (rendered in chat header) ────────────────────────────

export function SidebarMobileToggle() {
  const { openMobile } = useSidebar();
  return (
    <button
      onClick={openMobile}
      aria-label="Open sidebar"
      className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-muted hover:text-heading hover:bg-neutral-border/30 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
    >
      <MenuIcon />
    </button>
  );
}

// ── Conversation item ─────────────────────────────────────────────────────────

function ConversationItem({ conv, isActive }: { conv: Conversation; isActive: boolean }) {
  return (
    <Link
      href={`/chat?id=${conv.id}`}
      className={[
        "block px-3 py-2 rounded-md text-sm truncate transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-inset",
        isActive
          ? "bg-primary-50 text-primary-800 dark:bg-primary-600/10 dark:text-primary-400 font-medium"
          : "text-body hover:bg-neutral-border/25 dark:hover:bg-white/5",
      ].join(" ")}
      title={conv.title}
    >
      {conv.title}
    </Link>
  );
}

// ── Inner sidebar (needs useSearchParams → wrapped in Suspense) ───────────────

function SidebarInner() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id");

  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close user menu when clicking outside
    function onPointerDown(e: PointerEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobile();
  }, [activeId, closeMobile]);

  const filtered = search.trim()
    ? MOCK_CONVERSATIONS.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : MOCK_CONVERSATIONS;

  const groups = groupConversations(filtered);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleSignOut() {
    auth.removeToken();
    setShowUserMenu(false);
    router.push("/login");
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] md:hidden animate-fadeIn"
          aria-hidden="true"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar panel */}
      <aside
        aria-label="Chat navigation"
        className={[
          "fixed top-0 left-0 z-40 h-screen flex flex-col select-none",
          "bg-card border-r border-neutral-border",
          // Width: desktop collapses to icon rail, mobile is always full width
          "w-sidebar",
          isCollapsed ? "md:w-sidebar-rail" : "md:w-sidebar",
          // Mobile: slide in/out
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // transition-all instead of transition-[width,transform] — comma in brackets breaks Tailwind parser
          "transition-all duration-300 ease-in-out",
        ].join(" ")}
      >
        {/* ── Top: brand + toggle ──────────────────────────────────────────── */}
        <div className={[
          "flex items-center gap-2 px-3 pt-4 pb-3 flex-shrink-0",
          isCollapsed ? "md:flex-col md:gap-1" : "",
        ].join(" ")}>
          {/* Logo mark */}
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
            W
          </div>

          <span className={[
            "flex-1 font-medium text-heading text-sm truncate overflow-hidden",
            "transition-all duration-300",
            isCollapsed ? "md:hidden" : "block",
          ].join(" ")}>
            WorkLife AI
          </span>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "hidden md:flex flex-shrink-0 items-center justify-center",
              "w-7 h-7 rounded-md text-muted hover:text-heading hover:bg-neutral-border/30",
              "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
            ].join(" ")}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>

          {/* Mobile close */}
          <button
            onClick={closeMobile}
            aria-label="Close sidebar"
            className="md:hidden flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-muted hover:text-heading hover:bg-neutral-border/30 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            <ChevronLeftIcon />
          </button>
        </div>

        {/* ── New Chat button ──────────────────────────────────────────────── */}
        <div className="px-3 mb-3 flex-shrink-0">
          <Link
            href="/chat"
            title={isCollapsed ? "New chat" : undefined}
            className={[
              "flex items-center gap-2 rounded-md font-medium text-sm",
              "bg-primary-600 text-white hover:bg-primary-800 dark:hover:bg-primary-400",
              "transition-all duration-150 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
              isCollapsed ? "md:w-9 md:h-9 md:justify-center md:p-0 w-full h-9 px-3" : "w-full h-9 px-3",
            ].join(" ")}
          >
            <PlusIcon />
            <span className={isCollapsed ? "md:hidden" : ""}> New chat</span>
          </Link>
        </div>

        {/* ── Search ──────────────────────────────────────────────────────── */}
        <div className={[
          "px-3 mb-3 flex-shrink-0 overflow-hidden",
          "transition-all duration-300",
          isCollapsed ? "md:opacity-0 md:pointer-events-none md:max-h-0 md:mb-0" : "opacity-100 max-h-20",
        ].join(" ")}>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <SearchIcon size={14} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              aria-label="Search conversations"
              className={[
                "w-full h-9 pl-8 pr-3 rounded-md text-sm",
                "bg-surface border border-neutral-border text-body placeholder:text-muted",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus:border-primary-400",
                "transition-all duration-150",
              ].join(" ")}
            />
          </div>
        </div>

        {/* ── Conversation list ────────────────────────────────────────────── */}
        <nav
          aria-label="Recent conversations"
          className="flex-1 overflow-y-auto px-2 min-h-0"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-border) transparent" }}
        >
          {/* Collapsed: icon-only list */}
          {isCollapsed ? (
            <div className="hidden md:flex flex-col items-center gap-1 mt-1">
              <button
                onClick={toggleCollapsed}
                title="Show conversations"
                aria-label="Show conversations"
                className="flex items-center justify-center w-9 h-9 rounded-md text-muted hover:text-heading hover:bg-neutral-border/25 dark:hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                <ChatBubbleIcon />
              </button>
              <button
                onClick={toggleCollapsed}
                title="Search"
                aria-label="Search conversations"
                className="flex items-center justify-center w-9 h-9 rounded-md text-muted hover:text-heading hover:bg-neutral-border/25 dark:hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                <SearchIcon size={16} />
              </button>
            </div>
          ) : groups.length > 0 ? (
            <div className="space-y-4 pb-2 pt-1">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted px-3 mb-1">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((conv) => (
                      <ConversationItem key={conv.id} conv={conv} isActive={activeId === conv.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-center py-10">No conversations found.</p>
          )}
        </nav>

        {/* ── User profile ─────────────────────────────────────────────────── */}
        <div
          ref={userMenuRef}
          className="relative px-2 py-3 border-t border-neutral-border flex-shrink-0"
        >
          <button
            onClick={() => setShowUserMenu((p) => !p)}
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={showUserMenu}
            title={isCollapsed ? userName : undefined}
            className={[
              "w-full flex items-center gap-2.5 rounded-md",
              "hover:bg-neutral-border/25 dark:hover:bg-white/5 transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
              isCollapsed ? "md:justify-center md:p-2 p-2" : "px-2 py-2",
            ].join(" ")}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-600/15 text-primary-600 dark:text-primary-400 flex items-center justify-center font-medium text-sm border border-primary-100 dark:border-primary-600/20">
              {initials}
            </div>

            <div className={[
              "flex-1 text-left min-w-0 overflow-hidden",
              "transition-all duration-300",
              isCollapsed ? "md:hidden" : "block",
            ].join(" ")}>
              <p className="text-sm font-medium text-heading truncate leading-tight">{userName}</p>
              <p className="text-[11px] text-muted truncate">Settings &amp; preferences</p>
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div
              role="menu"
              className={[
                "absolute bottom-full mb-1.5 rounded-lg border border-neutral-border bg-card shadow-lg overflow-hidden z-50",
                "animate-slideUp min-w-[180px]",
                isCollapsed ? "left-14" : "left-2 right-2",
              ].join(" ")}
            >
              <Link
                href="/profile"
                role="menuitem"
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-body hover:bg-surface dark:hover:bg-white/5 transition-colors duration-150"
                onClick={() => setShowUserMenu(false)}
              >
                <SettingsIcon />
                <span>Settings</span>
              </Link>
              <div className="h-px bg-neutral-border" />
              <button
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-body hover:bg-surface dark:hover:bg-white/5 transition-colors duration-150"
                onClick={handleSignOut}
              >
                <LogoutIcon />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Public Sidebar (Suspense boundary around useSearchParams) ─────────────────

export function Sidebar() {
  return (
    <Suspense fallback={null}>
      <SidebarInner />
    </Suspense>
  );
}
