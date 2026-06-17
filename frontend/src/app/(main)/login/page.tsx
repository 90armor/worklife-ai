"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { FormInput } from "@/components/ui/FormInput";
import { Alert } from "@/components/ui/Alert";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "").replace("/api", "") ?? "http://localhost:8000";

type Mode = "login" | "register";

// ── Icons ────────────────────────────────────────────────────────────────────

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ── Social auth buttons section ───────────────────────────────────────────────
// Structured so additional providers (Apple, GitHub, etc.) can be added below.

function SocialAuthSection({ loading }: Readonly<{ loading: boolean }>) {
  const handleGoogleSignIn = () => {
    globalThis.location.href = `${API_BASE}/auth/google/redirect`;
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="
          w-full h-11 flex items-center justify-center gap-3
          bg-white border border-[#D3D1C7] rounded-md
          text-[#444441] text-sm font-medium
          shadow-sm hover:shadow-md hover:bg-neutral-50
          transition-all duration-150 active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Space reserved for additional providers, e.g. Apple */}
      {/* <button type="button" className="...">
        <AppleIcon />
        Continue with Apple
      </button> */}
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      <span className="text-[0.8125rem] text-muted shrink-0">or</span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

function SubmitLabel({ isLogin, loading }: Readonly<{ isLogin: boolean; loading: boolean }>) {
  if (loading) return <>{isLogin ? "Signing in…" : "Creating account…"}</>;
  return <>{isLogin ? "Sign in" : "Create account"}</>;
}

// ── Main auth form ────────────────────────────────────────────────────────────

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();

  const initialMode: Mode = params.get("mode") === "register" ? "register" : "login";
  const errorParam  = params.get("error");

  const [mode, setMode]         = useState<Mode>(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(
    errorParam === "google_auth_failed"
      ? "Google sign-in was cancelled or failed. Please try again."
      : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated()) router.replace("/chat");
  }, [router]);

  // Keep URL in sync when toggling mode
  const switchMode = useCallback((next: Mode) => {
    setMode(next);
    setError("");
    setFullName("");
    setPassword("");
    const url = next === "register" ? "/login?mode=register" : "/login";
    globalThis.history.replaceState(null, "", url);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await api.auth.login(email, password);
        auth.setToken(res.accessToken);
        router.push("/chat");
      } else {
        await api.auth.register(email, password, fullName);
        // Auto-login after registration
        const res = await api.auth.login(email, password);
        auth.setToken(res.accessToken);
        router.push("/chat");
      }
    } catch {
      setError(
        mode === "login"
          ? "Incorrect email or password. Please try again."
          : "Could not create account. The email may already be in use."
      );
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-slideUp">

        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white mb-3">
            <BriefcaseIcon />
          </div>
          <span className="text-h2 text-heading">WorkLife AI</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-[var(--color-border)] rounded-lg shadow-sm p-8">

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-h1 mb-1">
              {isLogin ? "Sign in" : "Create your account"}
            </h1>
            <p className="text-sm text-muted">
              {isLogin
                ? "Your AI guide to life in Japan"
                : "Start your journey with WorkLife AI"}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <Alert variant="error" className="mb-5">
              {error}
            </Alert>
          )}

          {/* Social auth */}
          <SocialAuthSection loading={loading} />

          <OrDivider />

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <FormInput
                id="fullName"
                label="Full name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}

            <FormInput
              id="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={isLogin ? undefined : "Minimum 8 characters"}
            />

            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11 mt-1 flex items-center justify-center gap-2
                bg-primary-600 text-white text-sm font-medium rounded-md
                hover:bg-primary-800 active:scale-[0.98]
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
              "
            >
              <SubmitLabel isLogin={isLogin} loading={loading} />
            </button>
          </form>

          {/* Mode toggle */}
          <p className="mt-6 text-sm text-muted text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "register" : "login")}
              className="text-link font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[0.8125rem] text-muted">
          <Link href="/terms" className="hover:text-body transition-colors">Terms of Service</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-body transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}

// Suspense boundary required because useSearchParams is used inside AuthForm
export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
