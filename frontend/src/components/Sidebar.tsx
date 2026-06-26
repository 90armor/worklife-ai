"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import {
  PlusIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon,
  MenuIcon, ChatBubbleIcon, SettingsIcon, LogoutIcon,
  GlobeIcon, SunIcon, MoonIcon, MonitorIcon, CheckIcon,
} from "@/components/ui/icons";
import { api } from "@/lib/api";
import { useLogout } from "@/lib/useLogout";
import { SettingsModal } from "@/components/SettingsModal";

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

type ActiveSubmenu = "language" | "appearance";

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

// ── Utilities ─────────────────────────────────────────────────────────────────

function clearTimerRef(ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) {
  if (ref.current !== null) { clearTimeout(ref.current); ref.current = null; }
}

function ThemeOptionIcon({ value }: Readonly<{ value: "light" | "dark" | "system" }>) {
  if (value === "dark") return <MoonIcon />;
  if (value === "system") return <MonitorIcon />;
  return <SunIcon />;
}

function deriveInitials(name: string): string {
  if (!name) return "··";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function calcSubmenuFlipped(ref: React.RefObject<HTMLDivElement>): boolean {
  if (!ref.current) return false;
  return ref.current.getBoundingClientRect().right + 180 > globalThis.innerWidth;
}

// ── Menu data ─────────────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS = [
  { code: "en", native: "English" },
  { code: "ja", native: "日本語" },
  { code: "vi", native: "Tiếng Việt" },
  { code: "id", native: "Bahasa Indonesia" },
  { code: "ne", native: "नेपाली" },
  { code: "my", native: "မြန်မာဘာသာ" },
] as const;

const THEME_OPTIONS = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "System" },
] as const;

// ── SidebarProvider ───────────────────────────────────────────────────────────

export function SidebarProvider({ children }: Readonly<{ children: React.ReactNode }>) {
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

  const value = useMemo(
    () => ({ isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile }),
    [isCollapsed, isMobileOpen, toggleCollapsed, openMobile, closeMobile]
  );

  return (
    <SidebarContext.Provider value={value}>
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

function ConversationItem({ conv, isActive }: Readonly<{ conv: Conversation; isActive: boolean }>) {
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
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id");
  const { theme, setTheme } = useTheme();

  const logout = useLogout();
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [activeSubmenu, setActiveSubmenu] = useState<ActiveSubmenu | null>(null);
  const [submenuFlipped, setSubmenuFlipped] = useState(false);
  const [language, setLanguage] = useState("");
  const [langError, setLangError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const submenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFinePointer = useRef(false);
  const profileFetched = useRef(false);
  const submenuOpenSource = useRef<"pointer" | "click">("click");
  const langSubmenuRef = useRef<HTMLDivElement>(null);
  const appSubmenuRef = useRef<HTMLDivElement>(null);

  // Detect pointer capability once on mount
  useEffect(() => {
    isFinePointer.current = globalThis.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  // Outside-click closes everything
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // Esc → close submenu first, then main menu
  useEffect(() => {
    if (!showUserMenu) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (activeSubmenu === null) {
        setShowUserMenu(false);
      } else {
        setActiveSubmenu(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showUserMenu, activeSubmenu]);

  // Focus first item in submenu only when opened via keyboard/click (not hover)
  useEffect(() => {
    if (submenuOpenSource.current === "pointer") return;
    if (activeSubmenu === "language") {
      langSubmenuRef.current?.querySelector<HTMLElement>("button")?.focus();
    } else if (activeSubmenu === "appearance") {
      appSubmenuRef.current?.querySelector<HTMLElement>("button")?.focus();
    }
  }, [activeSubmenu]);

  // Fetch profile once on mount; cache result so re-opening the menu is instant
  useEffect(() => {
    if (profileFetched.current) return;
    profileFetched.current = true;
    api.profile.get().then((res) => {
      setUserName(res.data.fullName ?? "");
      setUserEmail(res.data.email ?? "");
      setLanguage(res.data.preferredLanguage ?? "");
    }).catch(() => {
      profileFetched.current = false; // allow one retry on next render
    });
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobile();
  }, [activeId, closeMobile]);

  const filtered = search.trim()
    ? MOCK_CONVERSATIONS.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : MOCK_CONVERSATIONS;

  const groups = groupConversations(filtered);

  const initials = deriveInitials(userName);

  function openMenu() {
    setShowUserMenu(true);
  }

  function closeMenu() {
    setShowUserMenu(false);
    setActiveSubmenu(null);
  }

  function computeAndSetFlip() {
    setSubmenuFlipped(calcSubmenuFlipped(userMenuRef));
  }

  function openSubmenu(name: ActiveSubmenu) {
    clearTimerRef(submenuCloseTimerRef);
    computeAndSetFlip();
    submenuOpenSource.current = "pointer";
    setActiveSubmenu(name);
  }

  function scheduleSubmenuClose() {
    clearTimerRef(submenuCloseTimerRef);
    submenuCloseTimerRef.current = setTimeout(() => setActiveSubmenu(null), 180);
  }

  function cancelSubmenuClose() {
    clearTimerRef(submenuCloseTimerRef);
  }

  async function handleLanguageSave(code: string) {
    const prev = language;
    setLanguage(code);
    setLangError(null);
    setSaving(true);
    try {
      await api.profile.update({ preferredLanguage: code });
    } catch {
      setLanguage(prev);
      setLangError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    closeMenu();
    await logout();
  }

  // Shared submenu panel classes — flip to left when there's no room on the right
  const submenuPanel = [
    "absolute bottom-0 min-w-[180px] rounded-lg border border-neutral-border bg-surface-raised shadow-lg overflow-hidden z-50 animate-slideUp",
    submenuFlipped ? "right-full mr-1.5" : "left-full ml-1.5",
  ].join(" ");
  const menuRowBase = [
    "flex w-full items-center gap-2.5 px-3 min-h-[44px] text-sm transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400",
  ].join(" ");
  const menuRowSelected = "bg-primary-50 text-primary-800 dark:bg-primary-600/10 dark:text-primary-400 font-medium";
  const menuRowDefault = "text-body hover:bg-surface dark:hover:bg-white/5";

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
          "bg-surface-raised border-r border-neutral-border",
          "w-sidebar",
          isCollapsed ? "md:w-sidebar-rail" : "md:w-sidebar",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "transition-all duration-300 ease-in-out",
        ].join(" ")}
      >
        {/* ── Top: brand + toggle ──────────────────────────────────────────── */}
        <div className={[
          "flex items-center gap-2 px-3 pt-4 pb-3 flex-shrink-0",
          isCollapsed ? "md:flex-col md:gap-1" : "",
        ].join(" ")}>
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
          {isCollapsed && (
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
          )}
          {!isCollapsed && groups.length > 0 && (
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
          )}
          {!isCollapsed && groups.length === 0 && (
            <p className="text-caption text-center py-10">No conversations found.</p>
          )}
        </nav>

        {/* ── User profile ─────────────────────────────────────────────────── */}
        <div
          ref={userMenuRef}
          className="relative px-2 py-3 border-t border-neutral-border flex-shrink-0"
        >
          <button
            onClick={() => (showUserMenu ? closeMenu() : openMenu())}
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={showUserMenu}
            title={isCollapsed ? userName : undefined}
            className={[
              "w-full flex items-center gap-2.5 rounded-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
              isCollapsed ? "md:justify-center md:p-2 p-2" : "px-2 py-2",
            ].join(" ")}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-600/15 text-primary-600 dark:text-primary-400 flex items-center justify-center font-medium text-sm border border-primary-100 dark:border-primary-600/20">
              {initials}
            </div>
            <div className={[
              "flex-1 text-left min-w-0 overflow-hidden",
              "transition-all duration-300",
              isCollapsed ? "md:hidden" : "block",
            ].join(" ")}>
              <p className="text-sm font-medium text-heading truncate leading-tight">{userName || "···"}</p>
              <p className="text-[11px] text-muted truncate">{userEmail || "Settings & preferences"}</p>
            </div>
          </button>

          {/* ── Main dropdown ─────────────────────────────────────────────── */}
          {showUserMenu && (
            <div
              role="menu"
              aria-label="User menu"
              className={[
                // overflow-visible so absolute submenus escape the clipping box
                "absolute bottom-full mb-1.5 rounded-lg border border-neutral-border bg-surface-raised shadow-lg overflow-visible z-50",
                "animate-slideUp min-w-[180px]",
                isCollapsed ? "left-14" : "left-2 right-2",
              ].join(" ")}
            >
              {/* ── Language row ─────────────────────────────────────────── */}
              <div
                className="relative rounded-t-lg"
                onPointerEnter={(e) => { if (isFinePointer.current && e.pointerType !== "touch") openSubmenu("language"); }}
                onPointerLeave={(e) => { if (isFinePointer.current && e.pointerType !== "touch") scheduleSubmenuClose(); }}
              >
                <button
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={activeSubmenu === "language"}
                  onClick={() => { cancelSubmenuClose(); computeAndSetFlip(); submenuOpenSource.current = "click"; setActiveSubmenu((v) => (v === "language" ? null : "language")); }}
                  className={[menuRowBase, menuRowDefault, "justify-between w-full"].join(" ")}
                >
                  <span className="flex items-center gap-2.5">
                    <GlobeIcon />
                    <span>Language</span>
                  </span>
                  <ChevronRightIcon />
                </button>

                {activeSubmenu === "language" && (
                  <div
                    ref={langSubmenuRef}
                    role="menu"
                    aria-label="Language"
                    className={submenuPanel}
                    onPointerEnter={() => cancelSubmenuClose()}
                    onPointerLeave={() => { if (isFinePointer.current) scheduleSubmenuClose(); }}
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        role="menuitemradio"
                        aria-checked={language === opt.code}
                        onClick={() => handleLanguageSave(opt.code)}
                        disabled={saving}
                        className={[
                          menuRowBase,
                          "justify-between",
                          language === opt.code ? menuRowSelected : menuRowDefault,
                          saving ? "opacity-50 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        <span>{opt.native}</span>
                        {language === opt.code && <CheckIcon />}
                      </button>
                    ))}
                    {langError && (
                      <p className="px-3 py-2 text-xs text-error-600 border-t border-neutral-border">
                        {langError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Appearance row ───────────────────────────────────────── */}
              <div
                className="relative"
                onPointerEnter={(e) => { if (isFinePointer.current && e.pointerType !== "touch") openSubmenu("appearance"); }}
                onPointerLeave={(e) => { if (isFinePointer.current && e.pointerType !== "touch") scheduleSubmenuClose(); }}
              >
                <button
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={activeSubmenu === "appearance"}
                  onClick={() => { cancelSubmenuClose(); computeAndSetFlip(); submenuOpenSource.current = "click"; setActiveSubmenu((v) => (v === "appearance" ? null : "appearance")); }}
                  className={[menuRowBase, menuRowDefault, "justify-between w-full"].join(" ")}
                >
                  <span className="flex items-center gap-2.5">
                    <SunIcon />
                    <span>Appearance</span>
                  </span>
                  <ChevronRightIcon />
                </button>

                {activeSubmenu === "appearance" && (
                  <div
                    ref={appSubmenuRef}
                    role="menu"
                    aria-label="Appearance"
                    className={submenuPanel}
                    onPointerEnter={() => cancelSubmenuClose()}
                    onPointerLeave={() => { if (isFinePointer.current) scheduleSubmenuClose(); }}
                  >
                    {THEME_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        role="menuitemradio"
                        aria-checked={theme === opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={[
                          menuRowBase,
                          "justify-between",
                          theme === opt.value ? menuRowSelected : menuRowDefault,
                        ].join(" ")}
                      >
                        <span className="flex items-center gap-2.5">
                          <ThemeOptionIcon value={opt.value} />
                          <span>{opt.label}</span>
                        </span>
                        {theme === opt.value && <CheckIcon />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-neutral-border" />

              {/* ── Settings ─────────────────────────────────────────────── */}
              <button
                role="menuitem"
                className={[menuRowBase, menuRowDefault, "w-full"].join(" ")}
                onClick={() => { closeMenu(); setShowSettingsModal(true); }}
              >
                <SettingsIcon />
                <span>Settings</span>
              </button>

              <div className="h-px bg-neutral-border" />

              {/* ── Sign out ─────────────────────────────────────────────── */}
              <div className="rounded-b-lg overflow-hidden">
                <button
                  role="menuitem"
                  className={[menuRowBase, menuRowDefault, "w-full"].join(" ")}
                  onClick={handleSignOut}
                >
                  <LogoutIcon />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
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
