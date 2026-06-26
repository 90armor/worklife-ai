"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/auth";
import { useTranslations } from "next-intl";

function OAuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("auth");

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      auth.setToken(token);
      // Remove the token from the URL immediately to avoid it persisting in browser history
      globalThis.history.replaceState(null, "", "/auth/callback");
      router.replace("/chat");
    } else {
      const reason = error ?? "unknown";
      router.replace(`/login?error=${reason}`);
    }
  }, [params, router]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <p className="text-sm text-muted">{t("callback.signingIn")}</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallback />
    </Suspense>
  );
}
