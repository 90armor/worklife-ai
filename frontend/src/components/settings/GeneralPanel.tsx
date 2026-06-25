"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { api, Profile, ProfileInput } from "@/lib/api";
import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
import {
  SelectOption,
  NATIONALITY_OPTIONS,
  LANGUAGE_OPTIONS,
  OCCUPATION_OPTIONS,
  PREFECTURE_OPTIONS,
} from "@/lib/constants/profileOptions";

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldStatus = "idle" | "saving" | "saved" | "error";

export interface GeneralPanelProps {
  onDirty: () => void;
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

// ── Component ─────────────────────────────────────────────────────────────────

export function GeneralPanel({ onDirty }: GeneralPanelProps) {
  const t = useTranslations("settings");
  const tOpts = useTranslations("options");

  const [form, setForm] = useState<ProfileInput>(emptyForm);
  const [otherText, setOtherText] = useState<Partial<Record<keyof ProfileInput, string>>>({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [fieldStatus, setFieldStatus] = useState<Partial<Record<keyof ProfileInput, FieldStatus>>>({});

  const savedValues = useRef<Record<keyof ProfileInput, string>>({
    fullName: "", nationality: "", preferredLanguage: "", occupation: "", prefecture: "",
  });

  const debounceTimers = useRef<Partial<Record<keyof ProfileInput, ReturnType<typeof setTimeout>>>>({});
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
              newForm[field.key] = "other";
              newOther[field.key] = raw === "other" ? "" : raw;
            }
          }
        }

        setForm(newForm);
        setOtherText(newOther);

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

  const saveFieldWithValue = useCallback(async (key: keyof ProfileInput, resolvedValue: string) => {
    if (key === "fullName" && !resolvedValue.trim()) return;
    if (resolvedValue === savedValues.current[key]) return;

    if (clearSavedTimers.current[key]) clearTimeout(clearSavedTimers.current[key]);
    setStatus(key, "saving");

    try {
      await api.profile.update({ [key]: resolvedValue } as Partial<ProfileInput>);
      savedValues.current[key] = resolvedValue;
      setStatus(key, "saved");
      clearSavedTimers.current[key] = setTimeout(() => setStatus(key, "idle"), 2500);
    } catch {
      setStatus(key, "error");
    }
  }, []);

  function scheduleFieldSave(key: keyof ProfileInput, resolvedValue: string, delayMs = 700) {
    if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
    debounceTimers.current[key] = setTimeout(
      () => void saveFieldWithValue(key, resolvedValue),
      delayMs,
    );
  }

  function handleSelectChange(key: keyof ProfileInput, newValue: string) {
    setForm((prev) => ({ ...prev, [key]: newValue }));
    setOtherText((prev) => ({ ...prev, [key]: "" }));
    onDirty();

    if (newValue !== "other") {
      void saveFieldWithValue(key, newValue);
    }
  }

  function handleOtherChange(key: keyof ProfileInput, newText: string) {
    setOtherText((prev) => ({ ...prev, [key]: newText }));
    onDirty();
    scheduleFieldSave(key, newText.trim());
  }

  function handleOtherBlur(key: keyof ProfileInput, currentText: string) {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
      delete debounceTimers.current[key];
    }
    void saveFieldWithValue(key, currentText.trim());
  }

  function handleTextChange(key: keyof ProfileInput, newValue: string) {
    setForm((prev) => ({ ...prev, [key]: newValue }));
    onDirty();
    scheduleFieldSave(key, newValue.trim());
  }

  function handleTextBlur(key: keyof ProfileInput, currentValue: string) {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
      delete debounceTimers.current[key];
    }
    void saveFieldWithValue(key, currentValue.trim());
  }

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

  return (
    <div>
      <h2 className="text-base font-semibold text-heading mb-0.5">{t("panels.general")}</h2>
      <p className="text-[0.8125rem] text-muted mb-6">{t("generalSubtitle")}</p>

      {loading ? (
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
        <div className="rounded-lg border border-neutral-border overflow-hidden divide-y divide-neutral-border">
          {/* Email — read-only */}
          <div className="flex items-center min-h-[52px] px-4 gap-4">
            <span className="w-36 flex-shrink-0 text-sm font-medium text-body select-none">
              {t("fields.email")}
            </span>
            <span className="flex-1 text-sm text-muted text-right truncate select-all pr-[22px]">
              {email}
            </span>
          </div>

          {GENERAL_FIELDS.map((field) => {
            const labelText = t(`fields.${field.i18nKey}`);

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

            const selectValue = deriveSelectValue(form[field.key], field.options);
            const showOtherInput = field.allowOther && selectValue === "other";

            return (
              <div key={field.key}>
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

                {showOtherInput && (
                  <div className="flex items-center px-4 py-2.5 border-t border-neutral-border/50 bg-neutral-border/5 hover:bg-primary-50/20 dark:hover:bg-white/[0.02] has-[:focus-visible]:bg-primary-50/30 dark:has-[:focus-visible]:bg-white/[0.03] transition-colors duration-100">
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
