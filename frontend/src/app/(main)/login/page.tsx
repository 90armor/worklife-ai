"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, googleOAuthRedirectUrl } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormInput, PasswordInput } from "@/components/ui/FormInput";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useTranslations } from "next-intl";

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("auth");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(
    params.get("error") === "google_auth_failed"
      ? t("errors.googleSignInFailed")
      : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated()) router.replace("/chat");
  }, [router]);

  const handleGoogleSignIn = () => {
    globalThis.location.href = googleOAuthRedirectUrl;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      auth.setToken(res.accessToken);
      router.push("/chat");
    } catch {
      setError(t("errors.incorrectEmailOrPassword"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>

      {/* ── Heading ── */}
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-semibold leading-tight text-heading">
          {t("login.title")}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {t("login.subtitle")}
        </p>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      {/* ── Social login (above fold, primary entry point) ── */}
      <GoogleButton
        onClick={handleGoogleSignIn}
        label={t("login.continueWithGoogle")}
        disabled={loading}
      />

      {/* ── Divider ── */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-border" />
        <span className="shrink-0 text-[0.8125rem] text-muted">{t("login.orSignInWithEmail")}</span>
        <div className="h-px flex-1 bg-neutral-border" />
      </div>

      {/* ── Email / password form ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          id="email"
          label={t("shared.emailLabel")}
          type="email"
          required
          autoComplete="email"
          placeholder={t("shared.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          id="password"
          label={t("shared.passwordLabel")}
          value={password}
          autoComplete="current-password"
          onChange={setPassword}
        />

        <Button type="submit" size="pill" loading={loading} fullWidth className="mt-1">
          {t("login.loginButton")}
        </Button>
      </form>

      {/* ── Account switcher ── */}
      <p className="mt-6 text-center text-[0.8125rem] text-muted">
        {t("login.noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary-600 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm"
        >
          {t("login.createOneFree")}
        </Link>
      </p>

    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
