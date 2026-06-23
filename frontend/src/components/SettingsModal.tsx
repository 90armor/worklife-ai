"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { api, Profile, ProfileInput } from "@/lib/api";
import { useLogout } from "@/lib/useLogout";

// ── Types ─────────────────────────────────────────────────────────────────────

type Panel = "general" | "account";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

// ── Focus trap ─────────────────────────────────────────────────────────────────

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

function useFocusTrap(
  ref: React.RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;

    // Focus the dialog itself so screen readers announce it
    el.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === el) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref, active]);
}

// ── General panel ─────────────────────────────────────────────────────────────

const GENERAL_FIELDS: {
  key: keyof Omit<ProfileInput, never>;
  label: string;
  autoComplete: string;
}[] = [
  { key: "fullName", label: "Full name", autoComplete: "name" },
  { key: "nationality", label: "Nationality", autoComplete: "off" },
  { key: "preferredLanguage", label: "Preferred language", autoComplete: "language" },
  { key: "occupation", label: "Occupation", autoComplete: "organization-title" },
  { key: "prefecture", label: "Prefecture", autoComplete: "address-level1" },
];

const emptyForm: ProfileInput = {
  fullName: "",
  nationality: "",
  preferredLanguage: "",
  occupation: "",
  prefecture: "",
};

interface GeneralPanelProps {
  onDirty: () => void;
}

function GeneralPanel({ onDirty }: GeneralPanelProps) {
  const [form, setForm] = useState<ProfileInput>(emptyForm);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.profile
      .get()
      .then((res: { success: boolean; data: Profile }) => {
        setEmail(res.data.email ?? "");
        setForm({
          fullName: res.data.fullName ?? "",
          nationality: res.data.nationality ?? "",
          preferredLanguage: res.data.preferredLanguage ?? "",
          occupation: res.data.occupation ?? "",
          prefecture: res.data.prefecture ?? "",
        });
      })
      .catch(() => setError("Could not load profile. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof ProfileInput, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
    onDirty();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      await api.profile.update(form);
      setSuccess(true);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = [
    "h-11 w-full rounded-md border border-neutral-border bg-surface px-3",
    "text-body placeholder:text-muted/60 transition-all duration-150",
    "focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
  ].join(" ");

  return (
    <div>
      <h2 className="text-base font-semibold text-heading mb-5">General</h2>

      {loading ? (
        <div className="flex flex-col gap-4">
          {GENERAL_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <div className="h-4 w-24 bg-neutral-border rounded animate-pulse" />
              <div className="h-11 w-full bg-neutral-border rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email — read-only */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8125rem] font-medium text-muted">
              Email
            </label>
            <input
              type="email"
              disabled
              value={email}
              className={[inputClass, "opacity-60 cursor-not-allowed"].join(" ")}
            />
          </div>

          {GENERAL_FIELDS.map(({ key, label, autoComplete }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label
                htmlFor={`settings-${key}`}
                className="text-[0.8125rem] font-medium text-muted"
              >
                {label}
              </label>
              <input
                id={`settings-${key}`}
                type="text"
                required={key === "fullName"}
                autoComplete={autoComplete}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className={inputClass}
              />
            </div>
          ))}

          {error && (
            <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-success-700 bg-success-50 border border-success-200 rounded-md px-3 py-2">
              Profile saved.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className={[
              "mt-1 h-11 w-full rounded-md font-medium text-sm transition-all duration-150",
              "bg-primary-600 text-white hover:bg-primary-800 active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
            ].join(" ")}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Account panel ─────────────────────────────────────────────────────────────

type DeleteStep = null | "confirm" | "deleting";

interface AccountPanelProps {
  onPreventClose: (prevent: boolean) => void;
}

function AccountPanel({ onPreventClose }: AccountPanelProps) {
  const logout = useLogout();
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleteStep, setDeleteStep] = useState<DeleteStep>(null);
  const [deleteError, setDeleteError] = useState("");

  function startDelete() {
    setDeleteStep("confirm");
    onPreventClose(true);
  }

  function cancelDelete() {
    setDeleteStep(null);
    setDeleteError("");
    onPreventClose(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    // redirect happens inside logout(); no need to reset state
  }

  async function handleDeleteConfirm() {
    setDeleteError("");
    setDeleteStep("deleting");
    try {
      await api.account.delete();
      // Token cleared by server; remove locally too before redirect
      await logout();
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
      setDeleteStep("confirm");
    }
  }

  const btnBase = [
    "flex items-center justify-center gap-2 h-11 w-full rounded-md font-medium text-sm transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  ].join(" ");

  return (
    <div>
      <h2 className="text-base font-semibold text-heading mb-5">Account</h2>

      <div className="flex flex-col gap-3">
        {/* Log out */}
        <button
          disabled={loggingOut || deleteStep !== null}
          onClick={handleLogout}
          className={[
            btnBase,
            "border border-neutral-border bg-surface text-body hover:bg-neutral-border/40",
            "focus-visible:ring-primary-400",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <LogoutIcon />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>

        {/* Delete account */}
        {deleteStep === null && (
          <button
            disabled={loggingOut}
            onClick={startDelete}
            className={[
              btnBase,
              "border border-error-300 bg-error-50 text-error-700 hover:bg-error-100",
              "focus-visible:ring-error-400",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            <TrashIcon />
            Delete account
          </button>
        )}

        {/* Delete confirmation */}
        {(deleteStep === "confirm" || deleteStep === "deleting") && (
          <div className="rounded-lg border border-error-300 bg-error-50 p-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-error-700">
              Delete your account?
            </p>
            <p className="text-sm text-error-600">
              Your account will be soft-deleted. All your data is preserved and
              you can restore it later using the same email and password. This
              action cannot be undone from the app — contact support to
              permanently erase data.
            </p>

            {deleteError && (
              <p className="text-sm text-error-700 font-medium">{deleteError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={cancelDelete}
                disabled={deleteStep === "deleting"}
                className={[
                  "flex-1 h-10 rounded-md border border-neutral-border bg-surface text-body text-sm font-medium",
                  "hover:bg-neutral-border/40 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteStep === "deleting"}
                className={[
                  "flex-1 h-10 rounded-md bg-error-600 text-white text-sm font-medium",
                  "hover:bg-error-700 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-400 focus-visible:ring-offset-2",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {deleteStep === "deleting" ? "Deleting…" : "Yes, delete my account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings modal ─────────────────────────────────────────────────────────────

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activePanel, setActivePanel] = useState<Panel>("general");
  const [preventClose, setPreventClose] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen);

  // Esc → close (blocked mid-confirmation)
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape" || preventClose) return;
      onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, preventClose, onClose]);

  // Reset panel when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setActivePanel("general");
      setPreventClose(false);
    }
  }, [isOpen]);

  const handleBackdrop = useCallback(() => {
    if (!preventClose) onClose();
  }, [preventClose, onClose]);

  if (!isOpen) return null;

  const navBtnBase = [
    "flex items-center gap-2.5 w-full px-3 min-h-[40px] rounded-md text-sm transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
  ].join(" ");
  const navBtnActive = "bg-primary-50 text-primary-800 dark:bg-primary-600/10 dark:text-primary-400 font-medium";
  const navBtnInactive = "text-body hover:bg-neutral-border/25 dark:hover:bg-white/5";

  const NAV_ITEMS: { id: Panel; label: string; Icon: React.FC }[] = [
    { id: "general", label: "General", Icon: UserIcon },
    { id: "account", label: "Account", Icon: ShieldIcon },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={handleBackdrop}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        tabIndex={-1}
        className={[
          "fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none",
        ].join(" ")}
      >
        <div
          className={[
            "relative pointer-events-auto",
            "w-full max-w-2xl max-h-[85vh]",
            "bg-card border border-neutral-border rounded-xl shadow-2xl",
            "flex flex-col overflow-hidden",
            "animate-slideUp",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border flex-shrink-0">
            <h1 id="settings-modal-title" className="text-base font-semibold text-heading">
              Settings
            </h1>
            <button
              onClick={preventClose ? undefined : onClose}
              disabled={preventClose}
              aria-label="Close settings"
              className={[
                "flex items-center justify-center w-8 h-8 rounded-md text-muted",
                "hover:text-heading hover:bg-neutral-border/30 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                "disabled:opacity-40 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              <XIcon />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="flex flex-1 min-h-0">
            {/* Sidebar nav — hidden on mobile, shown as top tabs instead */}
            <nav
              aria-label="Settings sections"
              className="hidden md:flex flex-col gap-0.5 w-44 p-3 border-r border-neutral-border flex-shrink-0"
            >
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActivePanel(id)}
                  aria-current={activePanel === id ? "page" : undefined}
                  className={[
                    navBtnBase,
                    activePanel === id ? navBtnActive : navBtnInactive,
                  ].join(" ")}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </nav>

            {/* Mobile tab row */}
            <div
              role="tablist"
              aria-label="Settings sections"
              className="md:hidden absolute top-[57px] left-0 right-0 flex border-b border-neutral-border bg-card"
            >
              {NAV_ITEMS.map(({ id, label }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activePanel === id}
                  onClick={() => setActivePanel(id)}
                  className={[
                    "flex-1 py-2.5 text-sm font-medium transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400",
                    activePanel === id
                      ? "text-primary-600 border-b-2 border-primary-600 -mb-px"
                      : "text-muted hover:text-body",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 mt-[41px] md:mt-0">
              {activePanel === "general" && (
                <GeneralPanel onDirty={() => {}} />
              )}
              {activePanel === "account" && (
                <AccountPanel onPreventClose={setPreventClose} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
