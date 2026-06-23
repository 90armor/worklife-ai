"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
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

// ── Login form ─────────────────────────────────────────────────────────────────

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState(
    params.get("error") === "google_auth_failed"
      ? "Google sign-in was cancelled or failed. Please try again."
      : ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated()) router.replace("/chat");
  }, [router]);

  const handleGoogleSignIn = () => {
    globalThis.location.href = `${API_BASE}/auth/google/redirect`;
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
      setError("Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[1.375rem] font-medium leading-snug text-heading">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to continue.</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      {/* Email / password form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[0.8125rem] font-medium text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-md border border-[var(--color-border)] bg-card px-3 text-body transition-all duration-150 focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[0.8125rem] font-medium text-muted">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-[var(--color-border)] bg-card px-3 pr-10 text-body transition-all duration-150 focus:border-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-r-md"
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex h-[46px] w-full items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white transition-all duration-150 hover:bg-primary-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      {/* Link to register */}
      <p className="mt-4 text-center text-[0.8125rem] text-muted">
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-primary-600 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-sm"
        >
          Create an account
        </Link>
      </p>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="shrink-0 text-[0.8125rem] text-muted">Or continue with</span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* Google */}
      <GoogleButton
        onClick={handleGoogleSignIn}
        label="Continue with Google"
        disabled={loading}
      />
    </AuthLayout>
  );
}

// Suspense boundary required for useSearchParams
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
