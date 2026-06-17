"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Profile, ProfileInput } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

type FormState = Omit<ProfileInput, never>;

const emptyForm: FormState = {
  fullName: "",
  nationality: "",
  preferredLanguage: "",
  occupation: "",
  prefecture: "",
};

function SkeletonField() {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-4 w-24 bg-neutral-border rounded animate-pulse" />
      <div className="h-11 w-full bg-neutral-border rounded-md animate-pulse" />
    </div>
  );
}

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

  const fields: { key: keyof FormState; label: string; autoComplete: string }[] = [
    { key: "fullName", label: "Full name", autoComplete: "name" },
    { key: "nationality", label: "Nationality", autoComplete: "off" },
    { key: "preferredLanguage", label: "Preferred language", autoComplete: "language" },
    { key: "occupation", label: "Occupation", autoComplete: "organization-title" },
    { key: "prefecture", label: "Prefecture", autoComplete: "address-level1" },
  ];

  return (
    <main className="min-h-full bg-surface p-4 md:p-8">
      <div className="max-w-lg mx-auto animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-h1">Your profile</h1>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>

        <Card padding="md">
          {loading ? (
            <div className="flex flex-col gap-4">
              {fields.map((f) => <SkeletonField key={f.key} />)}
              <div className="h-11 w-full bg-neutral-border rounded-md animate-pulse mt-2" />
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="mb-4">
                  Profile saved successfully.
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {fields.map(({ key, label, autoComplete }) => (
                  <FormInput
                    key={key}
                    id={key}
                    label={label}
                    type="text"
                    required={key === "fullName"}
                    autoComplete={autoComplete}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                ))}

                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  fullWidth
                  className="mt-2"
                >
                  {saving ? "Saving…" : "Save profile"}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
