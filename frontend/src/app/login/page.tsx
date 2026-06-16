"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      auth.setToken(res.accessToken);
      router.push("/profile");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-neutral-border rounded-lg p-8">
          <h1 className="text-2xl font-medium text-heading mb-6">Sign in</h1>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3 bg-error-50 border-l-4 border-error-400 text-error-900 text-sm rounded-md"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-body mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 border border-neutral-border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-body mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 border border-neutral-border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary-600 text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
