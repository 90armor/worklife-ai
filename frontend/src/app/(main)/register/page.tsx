"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError, googleOAuthRedirectUrl } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormInput, PasswordInput } from "@/components/ui/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useTranslations } from "next-intl";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isSoftDeletedConflict(err: unknown): boolean {
  if (!(err instanceof ApiError) || err.status !== 409) return false;
  return (err.body as { code?: string })?.code === "ACCOUNT_SOFT_DELETED";
}

// ── Sub-screens ───────────────────────────────────────────────────────────────

function SoftDeletedChoiceScreen({ email, error, onRestore, onFresh, onBack }: Readonly<{
  email: string; error: string;
  onRestore: () => void; onFresh: () => void; onBack: () => void;
}>) {
  const t = useTranslations("auth");
  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">{t("softDeleted.title")}</h1>
        <p className="mt-1 text-sm text-muted">
          {t.rich("softDeleted.subtitle", {
            email,
            strong: (chunks) => <strong className="text-body">{chunks}</strong>,
          })}
        </p>
      </div>
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}
      <div className="flex flex-col gap-3">
        <Button size="pill" fullWidth onClick={onRestore}>
          {t("softDeleted.restoreButton")}
        </Button>
        <button
          onClick={onFresh}
          className="flex h-[46px] w-full items-center justify-center rounded-pill border border-error-400 bg-error-50 text-sm font-medium text-error-600 transition-all hover:bg-error-50/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-400 focus-visible:ring-offset-2"
        >
          {t("softDeleted.startFreshButton")}
        </button>
        <button
          onClick={onBack}
          className="text-sm text-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm"
        >
          {t("softDeleted.useDifferentEmail")}
        </button>
      </div>
    </AuthLayout>
  );
}

function RestoreScreen({ email, error, loading, restorePwd, onPwdChange, onSubmit, onBack }: Readonly<{
  email: string; error: string; loading: boolean;
  restorePwd: string;
  onPwdChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void; onBack: () => void;
}>) {
  const t = useTranslations("auth");
  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">{t("restore.title")}</h1>
        <p className="mt-1 text-sm text-muted">
          {t.rich("restore.subtitle", {
            email,
            strong: (chunks) => <strong className="text-body">{chunks}</strong>,
          })}
        </p>
      </div>
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <PasswordInput
          id="restore-password"
          label={t("shared.passwordLabel")}
          value={restorePwd}
          autoComplete="current-password"
          required
          minLength={8}
          onChange={onPwdChange}
        />
        <Button type="submit" size="pill" loading={loading} fullWidth className="mt-1">
          {t("restore.restoreButton")}
        </Button>
      </form>
      <button
        onClick={onBack}
        className="mt-4 text-sm text-muted hover:text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm"
      >
        {t("restore.backButton")}
      </button>
    </AuthLayout>
  );
}

function FreshConfirmScreen({ email, error, loading, oldPwd, onOldPwdChange, onConfirm, onCancel }: Readonly<{
  email: string; error: string; loading: boolean;
  oldPwd: string;
  onOldPwdChange: (v: string) => void;
  onConfirm: () => void; onCancel: () => void;
}>) {
  const t = useTranslations("auth");
  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">{t("freshConfirm.title")}</h1>
      </div>
      <div className="rounded-lg border border-error-400 bg-error-50 p-4 mb-5">
        <p className="text-sm font-semibold text-error-600 mb-1">{t("freshConfirm.warningHeading")}</p>
        <p className="text-sm text-error-600">
          {t.rich("freshConfirm.warningBody", {
            email,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}
      <div className="flex flex-col gap-3 mb-5">
        <PasswordInput
          id="old-password-fresh"
          label={t("freshConfirm.confirmPasswordLabel")}
          value={oldPwd}
          autoComplete="current-password"
          onChange={onOldPwdChange}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          size="pill"
          variant="destructive"
          fullWidth
          loading={loading}
          disabled={loading || !oldPwd}
          onClick={onConfirm}
        >
          {t("freshConfirm.deleteButton")}
        </Button>
        <Button size="pill" variant="secondary" fullWidth disabled={loading} onClick={onCancel}>
          {t("freshConfirm.cancelButton")}
        </Button>
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
  const t = useTranslations("auth");

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [state, setState]             = useState<SignupState>("form");
  const [restorePwd, setRestorePwd]   = useState("");
  const [oldPwdForFresh, setOldPwdForFresh] = useState("");

  const [error, setError]   = useState(() => {
    const e = params.get("error");
    if (e === "google_auth_failed") return t("errors.googleSignInFailed");
    if (e === "account_deleted")    return t("errors.accountPreviouslyDeleted");
    return "";
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated()) router.replace("/chat");
  }, [router]);

  const handleGoogleSignIn = () => { globalThis.location.href = googleOAuthRedirectUrl; };

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
      else { setError(t("errors.couldNotCreateAccount")); }
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
      setError(t("errors.incorrectPassword"));
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
        ? t("errors.incorrectPreviousPassword")
        : t("errors.couldNotCreateAccountRetry");
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
    return <RestoreScreen email={email} error={error} loading={loading} restorePwd={restorePwd} onPwdChange={setRestorePwd} onSubmit={handleRestore} onBack={() => goTo("soft_deleted")} />;
  }

  if (state === "fresh_confirm") {
    return <FreshConfirmScreen email={email} error={error} loading={loading} oldPwd={oldPwdForFresh} onOldPwdChange={setOldPwdForFresh} onConfirm={handleFreshStart} onCancel={() => goTo("soft_deleted")} />;
  }

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">{t("register.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("register.subtitle")}</p>
      </div>

      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          id="fullName"
          label={t("register.fullNameLabel")}
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <FormInput
          id="email"
          label={t("shared.emailLabel")}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <PasswordInput
            id="password"
            label={t("shared.passwordLabel")}
            value={password}
            autoComplete="new-password"
            required
            minLength={8}
            onChange={setPassword}
          />
          <p className="text-[0.8125rem] text-muted">{t("register.passwordHint")}</p>
        </div>

        <Button type="submit" size="pill" loading={loading} fullWidth className="mt-1">
          {t("register.signUpButton")}
        </Button>
      </form>

      <p className="mt-4 text-center text-[0.8125rem] text-muted">
        {t("register.alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-medium text-primary-600 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm">
          {t("register.signInLink")}
        </Link>
      </p>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-border" />
        <span className="shrink-0 text-[0.8125rem] text-muted">{t("register.orContinueWith")}</span>
        <div className="h-px flex-1 bg-neutral-border" />
      </div>

      <GoogleButton onClick={handleGoogleSignIn} label={t("register.signUpWithGoogle")} disabled={loading} />
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
