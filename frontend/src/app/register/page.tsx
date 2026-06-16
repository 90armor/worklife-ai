"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.auth.register(email, password, fullName);
      router.push("/login");
    } catch {
      setError("Registration failed. The email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-neutral-border rounded-lg p-8">
          <h1 className="text-2xl font-medium text-heading mb-6">
            Create account
          </h1>

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
                htmlFor="fullName"
                className="block text-sm text-body mb-1"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3 border border-neutral-border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-600"
              />
            </div>

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
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 border border-neutral-border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-600"
              />
              <p className="mt-1 text-xs text-muted">Minimum 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary-600 text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-muted text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
