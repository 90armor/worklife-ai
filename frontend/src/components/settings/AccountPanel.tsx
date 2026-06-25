"use client";

import { useEffect, useState } from "react";
import { api, ApiError, Profile, googleOAuthRedirectUrl } from "@/lib/api";
import { useLogout } from "@/lib/useLogout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LogoutIcon } from "@/components/ui/icons";

// ── Types ─────────────────────────────────────────────────────────────────────

type DeleteStep = null | "confirm" | "deleting";
type SetPasswordStep = null | "form" | "saving";

export interface AccountPanelProps {
  onPreventClose: (prevent: boolean) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AccountPanel({ onPreventClose }: AccountPanelProps) {
  const logout = useLogout();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  const [deleteStep, setDeleteStep] = useState<DeleteStep>(null);
  const [deleteError, setDeleteError] = useState("");

  const [setPasswordStep, setSetPasswordStep] = useState<SetPasswordStep>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setPasswordError, setSetPasswordError] = useState("");

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

  const inputClass = [
    "h-11 w-full rounded-md border border-neutral-border bg-surface px-3",
    "text-body placeholder:text-muted/60 transition-all duration-150",
    "focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
  ].join(" ");

  const sectionHeading = "text-base font-semibold text-heading mb-5";

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
