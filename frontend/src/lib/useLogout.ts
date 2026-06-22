"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";

export function useLogout() {
  const router = useRouter();

  return async function logout() {
    try {
      await api.auth.logout();
    } catch {
      // Server-side invalidation failed (e.g. token already expired).
      // Client token is still cleared below — the user is logged out regardless.
    }
    auth.removeToken();
    router.push("/login");
  };
}
