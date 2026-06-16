"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Profile, ProfileInput } from "@/lib/api";
import { auth } from "@/lib/auth";

type FormState = Omit<ProfileInput, never>;

const emptyForm: FormState = {
  fullName: "",
  nationality: "",
  preferredLanguage: "",
  occupation: "",
  prefecture: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.replace("/login");
      return;
    }
    api.profile
      .get()
      .then((res: { success: boolean; data: Profile }) => {
        setForm({
          fullName: res.data.fullName ?? "",
          nationality: res.data.nationality ?? "",
          preferredLanguage: res.data.preferredLanguage ?? "",
          occupation: res.data.occupation ?? "",
          prefecture: res.data.prefecture ?? "",
        });
      })
      .catch(() => {
        auth.removeToken();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      await api.profile.update(form);
      setSuccess(true);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    auth.removeToken();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] bg-surface flex items-center justify-center">
        <p className="text-muted text-sm">Loading…</p>
      </main>
    );
  }

  const fields: { key: keyof FormState; label: string; autoComplete: string }[] =
    [
      { key: "fullName", label: "Full name", autoComplete: "name" },
      { key: "nationality", label: "Nationality", autoComplete: "off" },
      {
        key: "preferredLanguage",
        label: "Preferred language",
        autoComplete: "language",
      },
      { key: "occupation", label: "Occupation", autoComplete: "organization-title" },
      { key: "prefecture", label: "Prefecture", autoComplete: "address-level1" },
    ];

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-heading">Your profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-neutral-border rounded-md text-body text-sm hover:bg-surface transition-colors"
          >
            Sign out
          </button>
        </div>

        <div className="bg-white border border-neutral-border rounded-lg p-6">
          {error && (
            <div
              role="alert"
              className="mb-4 p-3 bg-error-50 border-l-4 border-error-400 text-error-900 text-sm rounded-md"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-4 p-3 bg-success-50 border-l-4 border-success-600 text-success-900 text-sm rounded-md"
            >
              Profile saved successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, autoComplete }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm text-body mb-1"
                >
                  {label}
                  {key === "fullName" && (
                    <span className="text-error-600 ml-1" aria-hidden="true">
                      *
                    </span>
                  )}
                </label>
                <input
                  id={key}
                  type="text"
                  required={key === "fullName"}
                  autoComplete={autoComplete}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-full h-11 px-3 border border-neutral-border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-600"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 bg-primary-600 text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity mt-2"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
