"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { XIcon, UserIcon, ShieldIcon } from "@/components/ui/icons";
import { GeneralPanel } from "@/components/settings/GeneralPanel";
import { AccountPanel } from "@/components/settings/AccountPanel";

// ── Types ─────────────────────────────────────────────────────────────────────

type Panel = "general" | "account";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
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

// ── Modal ─────────────────────────────────────────────────────────────────────

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const t = useTranslations("settings");
  const [activePanel, setActivePanel] = useState<Panel>("general");
  const [preventClose, setPreventClose] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape" || preventClose) return;
      onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, preventClose, onClose]);

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className={[
            "relative pointer-events-auto",
            "w-full max-w-2xl h-[min(85vh,680px)]",
            "bg-surface-raised border border-neutral-border rounded-xl shadow-2xl",
            "flex flex-col overflow-hidden",
            "animate-slideUp",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
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

          {/* Body */}
          <div className="flex flex-1 min-h-0">
            {/* Sidebar nav */}
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
              className="md:hidden absolute top-[57px] left-0 right-0 flex border-b border-neutral-border bg-surface-raised"
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
