"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { api, ApiError, Profile, ProfileInput, googleOAuthRedirectUrl } from "@/lib/api";
import { useLogout } from "@/lib/useLogout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  SelectOption,
  NATIONALITY_OPTIONS,
  LANGUAGE_OPTIONS,
  OCCUPATION_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/lib/constants/profileOptions";

// ── Types ─────────────────────────────────────────────────────────────────────

type Panel = "general" | "account";
type FieldStatus = "idle" | "saving" | "saved" | "error";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Field definitions ─────────────────────────────────────────────────────────

type TextField = {
  key: keyof ProfileInput;
  i18nKey: string;
  autoComplete: string;
  type: "text";
};

type SelectField = {
  key: keyof ProfileInput;
  i18nKey: string;
  autoComplete: string;
  type: "select";
  options: readonly SelectOption[];
  optionsNs: string;
  allowOther?: boolean;
};

type FieldDef = TextField | SelectField;

const GENERAL_FIELDS: FieldDef[] = [
  { key: "fullName", i18nKey: "fullName", autoComplete: "name", type: "text" },
  {
    key: "nationality",
    i18nKey: "nationality",
    autoComplete: "off",
    type: "select",
    options: NATIONALITY_OPTIONS,
    optionsNs: "nationality",
    allowOther: true,
  },
  {
    key: "preferredLanguage",
    i18nKey: "preferredLanguage",
    autoComplete: "language",
    type: "select",
    options: LANGUAGE_OPTIONS,
    optionsNs: "language",
  },
  {
    key: "occupation",
    i18nKey: "occupation",
    autoComplete: "organization-title",
    type: "select",
    options: OCCUPATION_OPTIONS,
    optionsNs: "occupation",
    allowOther: true,
  },
  {
    key: "prefecture",
    i18nKey: "prefecture",
    autoComplete: "address-level1",
    type: "select",
    options: PREFECTURE_OPTIONS,
    optionsNs: "prefecture",
  },
];

const emptyForm: ProfileInput = {
  fullName: "",
  nationality: "",
  preferredLanguage: "",
  occupation: "",
  prefecture: "",
};

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

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function isKnownValue(value: string, options: readonly SelectOption[]): boolean {
  return options.some((o) => o.value === value);
}

// Maps a stored profile value to the select element's displayed value.
// Unknown stored strings (legacy free-text) are shown as "other" so the
// custom-text input becomes visible, preserving the data without crashing.
function deriveSelectValue(stored: string, options: readonly SelectOption[]): string {
  if (!stored) return "";
  if (isKnownValue(stored, options)) return stored;
  return "other";
}

// ── General panel ─────────────────────────────────────────────────────────────

interface GeneralPanelProps {
  onDirty: () => void;
}

function GeneralPanel({ onDirty }: GeneralPanelProps) {
  const t = useTranslations("settings");
  const tOpts = useTranslations("options");

  // UI state: form holds select values (may be "other"); otherText holds free-text
  const [form, setForm] = useState<ProfileInput>(emptyForm);
  const [otherText, setOtherText] = useState<Partial<Record<keyof ProfileInput, string>>>({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Per-field save status for inline indicators
  const [fieldStatus, setFieldStatus] = useState<Partial<Record<keyof ProfileInput, FieldStatus>>>({});

  // Last successfully persisted resolved values — used to skip no-op saves
  const savedValues = useRef<Record<keyof ProfileInput, string>>({
    fullName: "", nationality: "", preferredLanguage: "", occupation: "", prefecture: "",
  });

  // Per-field debounce timers (text inputs)
  const debounceTimers = useRef<Partial<Record<keyof ProfileInput, ReturnType<typeof setTimeout>>>>({});
  // Timers that revert "saved" → "idle" after a short delay
  const clearSavedTimers = useRef<Partial<Record<keyof ProfileInput, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    setLoading(true);
    api.profile
      .get()
      .then((res: { success: boolean; data: Profile }) => {
        setEmail(res.data.email ?? "");

        const newForm: ProfileInput = {
          fullName: res.data.fullName ?? "",
          nationality: "",
          preferredLanguage: res.data.preferredLanguage ?? "",
          occupation: "",
          prefecture: res.data.prefecture ?? "",
        };
        const newOther: Partial<Record<keyof ProfileInput, string>> = {};

        for (const field of GENERAL_FIELDS) {
          if (field.type === "select" && field.allowOther) {
            const raw = (res.data[field.key] as string | null) ?? "";
            if (!raw || isKnownValue(raw, field.options)) {
              newForm[field.key] = raw;
              newOther[field.key] = "";
            } else {
              // Legacy free-text: show "other" in select, restore text in the input
              newForm[field.key] = "other";
              newOther[field.key] = raw === "other" ? "" : raw;
            }
          }
        }

        setForm(newForm);
        setOtherText(newOther);

        // Initialise savedValues with resolved values so first auto-save skips no-ops
        savedValues.current = {
          fullName: newForm.fullName,
          nationality: newForm.nationality === "other"
            ? (newOther.nationality ?? "")
            : newForm.nationality,
          preferredLanguage: newForm.preferredLanguage,
          occupation: newForm.occupation === "other"
            ? (newOther.occupation ?? "")
            : newForm.occupation,
          prefecture: newForm.prefecture,
        };
      })
      .catch(() => setLoadError(t("messages.loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  // Cleanup pending timers on unmount
  useEffect(() => {
    const dts = debounceTimers.current;
    const cts = clearSavedTimers.current;
    return () => {
      Object.values(dts).forEach((id) => id && clearTimeout(id));
      Object.values(cts).forEach((id) => id && clearTimeout(id));
    };
  }, []);

  function setStatus(key: keyof ProfileInput, status: FieldStatus) {
    setFieldStatus((prev) => ({ ...prev, [key]: status }));
  }

  async function saveFieldWithValue(key: keyof ProfileInput, resolvedValue: string) {
    // fullName is required — never send an empty value
    if (key === "fullName" && !resolvedValue.trim()) return;
    // Nothing changed since last successful save — skip the round-trip
    if (resolvedValue === savedValues.current[key]) return;

    if (clearSavedTimers.current[key]) clearTimeout(clearSavedTimers.current[key]);
    setStatus(key, "saving");

    try {
      await api.profile.update({ [key]: resolvedValue } as Partial<ProfileInput>);
      savedValues.current[key] = resolvedValue;
      setStatus(key, "saved");
      // Auto-revert the "saved" badge to idle after 2.5 s
      clearSavedTimers.current[key] = setTimeout(() => setStatus(key, "idle"), 2500);
    } catch {
      setStatus(key, "error");
    }
  }

  function scheduleFieldSave(key: keyof ProfileInput, resolvedValue: string, delayMs = 700) {
    if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
    debounceTimers.current[key] = setTimeout(
      () => void saveFieldWithValue(key, resolvedValue),
      delayMs,
    );
  }

  // Select changed — save immediately unless "other" was chosen (wait for text input)
  function handleSelectChange(key: keyof ProfileInput, newValue: string) {
    setForm((prev) => ({ ...prev, [key]: newValue }));
    setOtherText((prev) => ({ ...prev, [key]: "" }));
    onDirty();

    if (newValue !== "other") {
      void saveFieldWithValue(key, newValue);
    }
    // If "other" is selected, the user must type in the free-text input — save fires there.
  }

  // Free-text ("other") changed — debounce the save
  function handleOtherChange(key: keyof ProfileInput, newText: string) {
    setOtherText((prev) => ({ ...prev, [key]: newText }));
    onDirty();
    scheduleFieldSave(key, newText.trim());
  }

  // Free-text blurred — cancel debounce and save immediately
  function handleOtherBlur(key: keyof ProfileInput, currentText: string) {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
      delete debounceTimers.current[key];
    }
    void saveFieldWithValue(key, currentText.trim());
  }

  // Text input changed — debounce the save
  function handleTextChange(key: keyof ProfileInput, newValue: string) {
    setForm((prev) => ({ ...prev, [key]: newValue }));
    onDirty();
    scheduleFieldSave(key, newValue.trim());
  }

  // Text input blurred — cancel debounce and save immediately
  function handleTextBlur(key: keyof ProfileInput, currentValue: string) {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
      delete debounceTimers.current[key];
    }
    void saveFieldWithValue(key, currentValue.trim());
  }

  // ── Per-field save status badge ───────────────────────────────────────────

  function renderStatusBadge(key: keyof ProfileInput) {
    const status = fieldStatus[key];
    if (!status || status === "idle") return <span aria-live="polite" />;

    return (
      <span
        role="status"
        aria-live="polite"
        className={[
          "inline-flex items-center gap-1 text-[0.6875rem] font-medium",
          status === "saving" ? "text-muted" : "",
          status === "saved" ? "text-success-600" : "",
          status === "error" ? "text-error-600" : "",
        ].join(" ")}
      >
        {status === "saving" && t("messages.saving")}
        {status === "saved" && (
          <>
            <CheckIcon />
            {t("messages.fieldSaved")}
          </>
        )}
        {status === "error" && t("messages.fieldError")}
      </span>
    );
  }

  // ── Load error ────────────────────────────────────────────────────────────

  if (loadError) {
    return (
      <div>
        <h2 className="text-base font-semibold text-heading mb-1">{t("panels.general")}</h2>
        <p className="mt-4 text-sm text-error-600 bg-error-50 border border-error-200 rounded-md px-3 py-2">
          {loadError}
        </p>
      </div>
    );
  }

  // ── Shared inline control classes ─────────────────────────────────────────

  const inlineInputClass = [
    "bg-transparent border-0 text-sm text-left text-body placeholder:text-muted/40",
    "min-w-0 w-full max-w-[200px]",
    "focus:outline-none",
  ].join(" ");

  const inlineSelectClass = [
    "appearance-none bg-transparent border-0 text-sm text-right text-body cursor-pointer",
    "max-w-[190px] w-full",
    "focus:outline-none",
  ].join(" ");

  const rowClass = [
    "flex items-center min-h-[52px] px-4 gap-4",
    "hover:bg-primary-50/20 dark:hover:bg-white/[0.02] transition-colors duration-100",
    "has-[:focus-visible]:bg-primary-50/30 dark:has-[:focus-visible]:bg-white/[0.03]",
  ].join(" ");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <h2 className="text-base font-semibold text-heading mb-0.5">{t("panels.general")}</h2>
      <p className="text-[0.8125rem] text-muted mb-6">{t("generalSubtitle")}</p>

      {loading ? (
        /* Loading skeletons — row-shaped to match new layout */
        <div className="rounded-lg border border-neutral-border overflow-hidden divide-y divide-neutral-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3.5">
              <div className="w-32 h-3.5 bg-neutral-border rounded animate-pulse flex-shrink-0" />
              <div className="flex-1 flex justify-end">
                <div className="w-28 h-3.5 bg-neutral-border/60 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* One card, rows divided by hairlines — no per-field box borders */
        <div className="rounded-lg border border-neutral-border overflow-hidden divide-y divide-neutral-border">

          {/* ── Email — read-only row ── */}
          <div className="flex items-center min-h-[52px] px-4 gap-4">
            <span className="w-36 flex-shrink-0 text-sm font-medium text-body select-none">
              {t("fields.email")}
            </span>
            <span className="flex-1 text-sm text-muted text-right truncate select-all pr-[22px]">
              {email}
            </span>
          </div>

          {/* ── Editable fields ── */}
          {GENERAL_FIELDS.map((field) => {
            const labelText = t(`fields.${field.i18nKey}`);

            // ── Text field ──
            if (field.type === "text") {
              return (
                <div key={field.key} className={rowClass}>
                  <label
                    htmlFor={`settings-${field.key}`}
                    className="w-36 flex-shrink-0 text-sm font-medium text-body cursor-default"
                  >
                    {labelText}
                  </label>
                  <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                    {renderStatusBadge(field.key)}
                    <div className="relative pr-[22px]">
                      <input
                        id={`settings-${field.key}`}
                        type="text"
                        autoComplete={field.autoComplete}
                        value={form[field.key]}
                        onChange={(e) => handleTextChange(field.key, e.target.value)}
                        onBlur={(e) => handleTextBlur(field.key, e.target.value)}
                        placeholder="—"
                        className={inlineInputClass}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            // ── Select field ──
            const selectValue = deriveSelectValue(form[field.key], field.options);
            const showOtherInput = field.allowOther && selectValue === "other";

            return (
              <div key={field.key}>
                {/* Main row: label left, select+chevron right */}
                <div className={rowClass}>
                  <label
                    htmlFor={`settings-${field.key}`}
                    className="w-36 flex-shrink-0 text-sm font-medium text-body cursor-default"
                  >
                    {labelText}
                  </label>
                  <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                    {renderStatusBadge(field.key)}
                    <div className="relative flex items-center pr-[22px]">
                      <select
                        id={`settings-${field.key}`}
                        value={form[field.key]}
                        autoComplete={field.autoComplete}
                        onChange={(e) => handleSelectChange(field.key, e.target.value)}
                        className={inlineSelectClass}
                      >
                        <option value="" disabled>
                          {t("fields.placeholder")}
                        </option>
                        {field.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {tOpts.has(`${field.optionsNs}.${o.value}`)
                              ? tOpts(`${field.optionsNs}.${o.value}`)
                              : o.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-0 flex items-center text-muted">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                </div>

                {/* "Other" sub-row: appears inline within the same field group */}
                {showOtherInput && (
                  <div className="flex items-center px-4 py-2.5 border-t border-neutral-border/50 bg-neutral-border/5 hover:bg-primary-50/20 dark:hover:bg-white/[0.02] has-[:focus-visible]:bg-primary-50/30 dark:has-[:focus-visible]:bg-white/[0.03] transition-colors duration-100">
                    {/* Spacer aligns the input with the right column */}
                    <div className="w-36 flex-shrink-0" aria-hidden="true" />
                    <input
                      type="text"
                      value={otherText[field.key] ?? ""}
                      onChange={(e) => handleOtherChange(field.key, e.target.value)}
                      onBlur={(e) => handleOtherBlur(field.key, e.target.value)}
                      placeholder={t("fields.otherPlaceholder")}
                      aria-label={`${labelText} — ${t("fields.otherPlaceholder")}`}
                      className={[
                        "flex-1 bg-transparent border-0 text-sm text-body text-left placeholder:text-muted/50",
                        "focus:outline-none pr-[22px]",
                      ].join(" ")}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Account panel ─────────────────────────────────────────────────────────────

type DeleteStep = null | "confirm" | "deleting";
type SetPasswordStep = null | "form" | "saving";

interface AccountPanelProps {
  onPreventClose: (prevent: boolean) => void;
}

function AccountPanel({ onPreventClose }: AccountPanelProps) {
  const logout = useLogout();

  // Profile data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  // Logout
  const [loggingOut, setLoggingOut] = useState(false);

  // Delete account
  const [deleteStep, setDeleteStep] = useState<DeleteStep>(null);
  const [deleteError, setDeleteError] = useState("");

  // Set password (Google-only users)
  const [setPasswordStep, setSetPasswordStep] = useState<SetPasswordStep>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setPasswordError, setSetPasswordError] = useState("");

  // Disconnect Google
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectError, setDisconnectError] = useState("");

  useEffect(() => {
    setProfileLoading(true);
    api.profile
      .get()
      .then((res) => setProfile(res.data))
      .catch(() => setProfileError("Could not load account details."))
      .finally(() => setProfileLoading(false));
  }, []);

  function refreshProfile() {
    api.profile
      .get()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }

  // ── Delete handlers (existing behavior preserved) ──

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
  }

  async function handleDeleteConfirm() {
    setDeleteError("");
    setDeleteStep("deleting");
    try {
      await api.account.delete();
      await logout();
    } catch {
      setDeleteError("Failed to delete account. Please try again.");
      setDeleteStep("confirm");
    }
  }

  // ── Set password handlers ──

  function openSetPasswordForm() {
    setSetPasswordStep("form");
    setNewPassword("");
    setConfirmPassword("");
    setSetPasswordError("");
  }

  function cancelSetPassword() {
    setSetPasswordStep(null);
    setNewPassword("");
    setConfirmPassword("");
    setSetPasswordError("");
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setSetPasswordError("");
    setSetPasswordStep("saving");
    try {
      await api.account.setPassword(newPassword, confirmPassword);
      refreshProfile();
      setSetPasswordStep(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSetPasswordError(
        err instanceof ApiError && err.status === 409
          ? "Password is already set."
          : "Failed to set password. Please try again.",
      );
      setSetPasswordStep("form");
    }
  }

  // ── Disconnect Google handler ──

  async function handleDisconnectGoogle() {
    setDisconnecting(true);
    setDisconnectError("");
    try {
      await api.account.disconnectGoogle();
      refreshProfile();
    } catch (err) {
      setDisconnectError(
        err instanceof ApiError && err.status === 409
          ? "Set a password before disconnecting Google."
          : "Failed to disconnect. Please try again.",
      );
    } finally {
      setDisconnecting(false);
    }
  }

  // ── Shared class strings ──

  const inputClass = [
    "h-11 w-full rounded-md border border-neutral-border bg-surface px-3",
    "text-body placeholder:text-muted/60 transition-all duration-150",
    "focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
  ].join(" ");

  const sectionHeading = "text-base font-semibold text-heading mb-5";

  // ── Loading / error states ──

  if (profileLoading) {
    return (
      <div>
        <h2 className="text-base font-semibold text-heading mb-5">Account</h2>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-neutral-border rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div>
        <h2 className={sectionHeading}>Account</h2>
        <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-md px-3 py-2">
          {profileError || "Could not load account details."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Section 1 — Account ── */}
      <section aria-labelledby="acct-s1">
        <h2 id="acct-s1" className={sectionHeading}>Account</h2>

        {/* Info rows */}
        <div className="rounded-lg border border-neutral-border overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-3 border-b border-neutral-border">
            <span className="text-sm text-muted">Full name</span>
            <span className="text-sm text-body font-medium">{profile.fullName || "—"}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-3">
            <div>
              <p className="text-sm font-medium text-body">Email</p>
              <p className="text-xs text-muted mt-0.5">{profile.email}</p>
            </div>
            <button
              disabled
              title="Coming soon"
              className={[
                "h-9 px-3 rounded-md font-medium text-sm transition-all duration-150",
                "border border-neutral-border bg-surface text-body",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                "opacity-60 cursor-not-allowed",
              ].join(" ")}
            >
              Update
            </button>
          </div>
        </div>

        {/* Sign out */}
        <button
          disabled={loggingOut || deleteStep !== null}
          onClick={handleLogout}
          className={[
            "flex items-center justify-center gap-2 h-11 w-full rounded-md font-medium text-sm transition-all duration-150",
            "border border-neutral-border bg-surface text-body hover:bg-neutral-border/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          <LogoutIcon />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>

        {/* Delete account */}
        <div className="mt-3">
          {deleteStep === null && (
            <div className="rounded-lg border border-neutral-border p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-body">Delete account</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  Delete your account and associated data from the WorkLife AI platform. You can restore your account using the same email and password.
                </p>
              </div>
              <button
                disabled={loggingOut}
                onClick={startDelete}
                className={[
                  "flex-shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-md font-medium text-sm transition-all duration-150",
                  "border border-error-600 bg-transparent text-error-600 hover:bg-error-600/[0.06]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-400 focus-visible:ring-offset-2",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                Delete
              </button>
            </div>
          )}

          {(deleteStep === "confirm" || deleteStep === "deleting") && (
            <div className="rounded-lg border border-neutral-border bg-surface p-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-heading">Delete your account?</p>

              <Alert variant="error">
                Delete your account and associated data from the WorkLife AI platform. You can restore your account using the same email and password.
              </Alert>

              {deleteError && (
                <Alert variant="error">{deleteError}</Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelDelete}
                  disabled={deleteStep === "deleting"}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  loading={deleteStep === "deleting"}
                  onClick={handleDeleteConfirm}
                  disabled={deleteStep === "deleting"}
                  className="flex-1 border-error-400 text-[var(--color-error-600)] hover:bg-[var(--color-error-50)]"
                >
                  {deleteStep === "deleting" ? "Deleting…" : "Yes, delete my account"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Section 2 — Security and login (Google-only users) ── */}
      {!profile.hasPassword && (
        <section aria-labelledby="acct-s2" className="mt-6 pt-6 border-t border-neutral-border">
          <h2 id="acct-s2" className={sectionHeading}>Security and login</h2>

          {setPasswordStep === null && (
            <div className="rounded-lg border border-neutral-border p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-body">Login with password</p>
                <p className="text-xs text-muted mt-0.5">Add a password so you can sign in without Google.</p>
              </div>
              <button
                onClick={openSetPasswordForm}
                className={[
                  "flex-shrink-0 h-9 px-3 rounded-md font-medium text-sm transition-all duration-150",
                  "bg-primary-600 text-white hover:bg-primary-800",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                ].join(" ")}
              >
                Set password
              </button>
            </div>
          )}

          {(setPasswordStep === "form" || setPasswordStep === "saving") && (
            <form
              onSubmit={handleSetPassword}
              className="rounded-lg border border-neutral-border p-4 flex flex-col gap-3"
            >
              <p className="text-sm font-medium text-body">Set a password</p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="acct-pw-new" className="text-[0.8125rem] font-medium text-muted">
                  New password
                </label>
                <input
                  id="acct-pw-new"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={setPasswordStep === "saving"}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="acct-pw-confirm" className="text-[0.8125rem] font-medium text-muted">
                  Confirm password
                </label>
                <input
                  id="acct-pw-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={setPasswordStep === "saving"}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              {setPasswordError && (
                <p className="text-sm text-error-600 bg-error-50 border border-error-200 rounded-md px-3 py-2">
                  {setPasswordError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={cancelSetPassword}
                  disabled={setPasswordStep === "saving"}
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
                  type="submit"
                  disabled={setPasswordStep === "saving" || !newPassword || !confirmPassword}
                  className={[
                    "flex-1 h-10 rounded-md bg-primary-600 text-white text-sm font-medium",
                    "hover:bg-primary-800 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  {setPasswordStep === "saving" ? "Saving…" : "Set password"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* ── Section 3 — Sign-in methods ── */}
      <section aria-labelledby="acct-s3" className="mt-6 pt-6 border-t border-neutral-border">
        <h2 id="acct-s3" className={sectionHeading}>Sign-in methods</h2>

        <div className="rounded-lg border border-neutral-border overflow-hidden">
          {/* Email and password row */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-neutral-border">
            <div>
              <p className="text-sm font-medium text-body">Email and password</p>
              <p className="text-xs text-muted mt-0.5">Enable login with email</p>
            </div>
            <span
              className={[
                "text-xs font-medium px-2 py-1 rounded-md",
                profile.hasPassword
                  ? "text-[var(--color-success-900)] bg-[var(--color-success-50)]"
                  : "text-muted bg-neutral-border/40",
              ].join(" ")}
            >
              {profile.hasPassword ? "Enabled" : "Not set"}
            </span>
          </div>

          {/* Google row */}
          <div className="flex items-center justify-between px-3 py-3">
            <div>
              <p className="text-sm font-medium text-body">Google</p>
              {profile.hasGoogleConnected && (
                <p className="text-xs text-muted mt-0.5">{profile.email}</p>
              )}
              {!profile.hasGoogleConnected && (
                <p className="text-xs text-muted mt-0.5">Connect your Google account</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {profile.hasGoogleConnected ? (
                <button
                  onClick={handleDisconnectGoogle}
                  disabled={disconnecting}
                  className={[
                    "h-9 px-3 rounded-md font-medium text-sm transition-all duration-150",
                    "border border-neutral-border bg-surface text-body hover:bg-neutral-border/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  ].join(" ")}
                >
                  {disconnecting ? "Disconnecting…" : "Disconnect"}
                </button>
              ) : (
                <button
                  onClick={() => { window.location.href = googleOAuthRedirectUrl; }}
                  className={[
                    "h-9 px-3 rounded-md font-medium text-sm transition-all duration-150",
                    "border border-neutral-border bg-surface text-body hover:bg-neutral-border/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                  ].join(" ")}
                >
                  Connect
                </button>
              )}
              {disconnectError && (
                <p className="text-xs text-error-600">{disconnectError}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Settings modal ─────────────────────────────────────────────────────────────

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const t = useTranslations("settings");
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

  const NAV_ITEMS: { id: Panel; labelKey: string; Icon: React.FC }[] = [
    { id: "general", labelKey: "panels.general", Icon: UserIcon },
    { id: "account", labelKey: "panels.account", Icon: ShieldIcon },
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
            "w-full max-w-2xl h-[min(85vh,680px)]",
            "bg-card border border-neutral-border rounded-xl shadow-2xl",
            "flex flex-col overflow-hidden",
            "animate-slideUp",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-border flex-shrink-0">
            <h1 id="settings-modal-title" className="text-base font-semibold text-heading">
              {t("title")}
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
              {NAV_ITEMS.map(({ id, labelKey, Icon }) => (
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
                  {t(labelKey)}
                </button>
              ))}
            </nav>

            {/* Mobile tab row */}
            <div
              role="tablist"
              aria-label="Settings sections"
              className="md:hidden absolute top-[57px] left-0 right-0 flex border-b border-neutral-border bg-card"
            >
              {NAV_ITEMS.map(({ id, labelKey }) => (
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
                  {t(labelKey)}
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
