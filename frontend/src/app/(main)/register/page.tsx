"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Alert } from "@/components/ui/Alert";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "").replace("/api", "") ??
  "http://localhost:8000";

// ── Icons ─────────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isSoftDeletedConflict(err: unknown): boolean {
  if (!(err instanceof ApiError) || err.status !== 409) return false;
  return (err.body as { code?: string })?.code === "ACCOUNT_SOFT_DELETED";
}

function PasswordInput({
  id, value, show, label, autoComplete = "current-password",
  onChange, onToggle,
}: Readonly<{
  id: string; value: string; show: boolean; label: string;
  autoComplete?: string;
  onChange: (v: string) => void; onToggle: () => void;
}>) {
  const inputClass = [
    "h-11 w-full rounded-md border border-[var(--color-border)] bg-card px-3 pr-10",
    "text-body placeholder:text-muted/60 transition-all duration-150",
    "focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
  ].join(" ");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-muted">{label}</label>
      <div className="relative">
        <input
          id={id} type={show ? "text" : "password"} required minLength={8}
          autoComplete={autoComplete} placeholder="••••••••" value={value}
          onChange={(e) => onChange(e.target.value)} className={inputClass}
        />
        <button type="button" onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-r-md"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

// ── Sub-screens (extracted to keep RegisterForm complexity low) ───────────────

function SoftDeletedChoiceScreen({ email, error, onRestore, onFresh, onBack }: Readonly<{
  email: string; error: string;
  onRestore: () => void; onFresh: () => void; onBack: () => void;
}>) {
  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">Account found</h1>
        <p className="mt-1 text-sm text-muted">
          A deleted account exists for <strong className="text-body">{email}</strong>. Choose how to proceed.
        </p>
      </div>
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}
      <div className="flex flex-col gap-3">
        <button onClick={onRestore}
          className="flex h-[46px] w-full items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white transition-all hover:bg-primary-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2">
          Restore my existing account
        </button>
        <button onClick={onFresh}
          className="flex h-[46px] w-full items-center justify-center rounded-full border border-error-300 bg-error-50 text-sm font-medium text-error-700 transition-all hover:bg-error-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-400 focus-visible:ring-offset-2">
          Start fresh with a new account
        </button>
        <button onClick={onBack} className="text-sm text-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm">
          ← Use a different email
        </button>
      </div>
    </AuthLayout>
  );
}

function RestoreScreen({ email, error, loading, restorePwd, showPwd, onPwdChange, onToggle, onSubmit, onBack }: Readonly<{
  email: string; error: string; loading: boolean;
  restorePwd: string; showPwd: boolean;
  onPwdChange: (v: string) => void; onToggle: () => void;
  onSubmit: (e: React.FormEvent) => void; onBack: () => void;
}>) {
  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">Restore your account</h1>
        <p className="mt-1 text-sm text-muted">
          Enter the password for <strong className="text-body">{email}</strong> to restore your account and all previous data.
        </p>
      </div>
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <PasswordInput id="restore-password" value={restorePwd} show={showPwd} label="Password" onChange={onPwdChange} onToggle={onToggle} />
        <button type="submit" disabled={loading}
          className="mt-1 flex h-[46px] w-full items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white transition-all hover:bg-primary-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
          {loading ? "Restoring…" : "Restore account"}
        </button>
      </form>
      <button onClick={onBack} className="mt-4 text-sm text-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm">
        ← Back
      </button>
    </AuthLayout>
  );
}

function FreshConfirmScreen({ email, error, loading, oldPwd, showOldPwd, onOldPwdChange, onToggle, onConfirm, onCancel }: Readonly<{
  email: string; error: string; loading: boolean;
  oldPwd: string; showOldPwd: boolean;
  onOldPwdChange: (v: string) => void; onToggle: () => void;
  onConfirm: () => void; onCancel: () => void;
}>) {
  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">Start fresh?</h1>
      </div>
      <div className="rounded-lg border border-error-300 bg-error-50 p-4 mb-5">
        <p className="text-sm font-semibold text-error-700 mb-1">This will permanently delete all previous data</p>
        <p className="text-sm text-error-600">
          All documents, chat history, saved guides, and profile data linked to{" "}
          <strong>{email}</strong> will be erased and cannot be recovered.
        </p>
      </div>
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}
      <div className="mb-5">
        <PasswordInput id="old-password-fresh" value={oldPwd} show={showOldPwd} label="Confirm with your previous password" autoComplete="current-password" onChange={onOldPwdChange} onToggle={onToggle} />
      </div>
      <div className="flex flex-col gap-3">
        <button disabled={loading || !oldPwd} onClick={onConfirm}
          className="flex h-[46px] w-full items-center justify-center rounded-full bg-error-600 text-sm font-medium text-white transition-all hover:bg-error-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
          {loading ? "Creating account…" : "Yes, delete everything and start fresh"}
        </button>
        <button disabled={loading} onClick={onCancel}
          className="flex h-[46px] w-full items-center justify-center rounded-full border border-neutral-border bg-surface text-sm font-medium text-body transition-all hover:bg-neutral-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:opacity-60">
          Cancel
        </button>
      </div>
    </AuthLayout>
  );
}

// ── State machine ─────────────────────────────────────────────────────────────

type SignupState = "form" | "soft_deleted" | "restore" | "fresh_confirm";

// ── Register form ─────────────────────────────────────────────────────────────

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  const [state, setState]                   = useState<SignupState>("form");
  const [restorePwd, setRestorePwd]         = useState("");
  const [showRestorePwd, setShowRestorePwd] = useState(false);
  const [oldPwdForFresh, setOldPwdForFresh] = useState("");
  const [showOldPwdForFresh, setShowOldPwdForFresh] = useState(false);

  const [error, setError]   = useState(
    params.get("error") === "google_auth_failed"
      ? "Google sign-in was cancelled or failed. Please try again."
      : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated()) router.replace("/chat");
  }, [router]);

  const handleGoogleSignIn = () => { globalThis.location.href = `${API_BASE}/auth/google/redirect`; };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.register(email, password, fullName);
      const res = await api.auth.login(email, password);
      auth.setToken(res.accessToken);
      router.push("/chat");
    } catch (err) {
      if (isSoftDeletedConflict(err)) { setState("soft_deleted"); }
      else { setError("Could not create account. The email may already be in use."); }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.restore(email, restorePwd);
      auth.setToken(res.accessToken);
      router.push("/chat");
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFreshStart() {
    setError("");
    setLoading(true);
    try {
      await api.auth.register(email, password, fullName, true, oldPwdForFresh);
      const res = await api.auth.login(email, password);
      auth.setToken(res.accessToken);
      router.push("/chat");
    } catch (err) {
      const msg = err instanceof ApiError && err.status === 401
        ? "Incorrect previous password. Please try again."
        : "Could not create account. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function goTo(next: SignupState) { setState(next); setError(""); }

  if (state === "soft_deleted") {
    return <SoftDeletedChoiceScreen email={email} error={error} onRestore={() => goTo("restore")} onFresh={() => goTo("fresh_confirm")} onBack={() => goTo("form")} />;
  }

  if (state === "restore") {
    return <RestoreScreen email={email} error={error} loading={loading} restorePwd={restorePwd} showPwd={showRestorePwd} onPwdChange={setRestorePwd} onToggle={() => setShowRestorePwd((v) => !v)} onSubmit={handleRestore} onBack={() => goTo("soft_deleted")} />;
  }

  if (state === "fresh_confirm") {
    return <FreshConfirmScreen email={email} error={error} loading={loading} oldPwd={oldPwdForFresh} showOldPwd={showOldPwdForFresh} onOldPwdChange={setOldPwdForFresh} onToggle={() => setShowOldPwdForFresh((v) => !v)} onConfirm={handleFreshStart} onCancel={() => goTo("soft_deleted")} />;
  }

  const inputClass = [
    "h-11 w-full rounded-md border border-[var(--color-border)] bg-card px-3",
    "text-body placeholder:text-muted/60 transition-all duration-150",
    "focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
  ].join(" ");

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start understanding your life in Japan.</p>
      </div>

      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-[0.8125rem] font-medium text-muted">Full name</label>
          <input id="fullName" type="text" required autoComplete="name" placeholder="XXX" value={fullName}
            onChange={(e) => setFullName(e.target.value)} className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[0.8125rem] font-medium text-muted">Email</label>
          <input id="email" type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>

        <PasswordInput id="password" value={password} show={showPwd} label="Password" autoComplete="new-password" onChange={setPassword} onToggle={() => setShowPwd((v) => !v)} />
        <p className="-mt-3 text-[0.8125rem] text-muted">Minimum 8 characters</p>

        <button type="submit" disabled={loading}
          className="mt-1 flex h-[46px] w-full items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white transition-all hover:bg-primary-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100">
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-center text-[0.8125rem] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary-600 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm">
          Sign in
        </Link>
      </p>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="shrink-0 text-[0.8125rem] text-muted">Or continue with</span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <GoogleButton onClick={handleGoogleSignIn} label="Sign up with Google" disabled={loading} />
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
