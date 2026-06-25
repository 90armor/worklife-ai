import { auth } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// Google OAuth lives on the web router (no /api/v1 prefix)
export const googleOAuthRedirectUrl = `${BACKEND_URL}/auth/google/redirect`;

export interface SearchResult {
  id: number;
  title: string;
  content: string;
  similarity: number;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  nationality: string | null;
  preferredLanguage: string | null;
  occupation: string | null;
  prefecture: string | null;
  hasPassword: boolean;
  hasGoogleConnected: boolean;
}

export interface ProfileInput {
  fullName: string;
  nationality: string;
  preferredLanguage: string;
  occupation: string;
  prefecture: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API error ${status}`);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers: extraHeaders, ...restOptions } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(extraHeaders as Record<string, string>),
    },
  });
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.status, body);
  }
  return res.json();
}

function authedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = auth.getToken();
  return request<T>(path, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

export const api = {
  // Existing methods — preserved
  search: (query: string, limit = 5) =>
    request<{ results: SearchResult[] }>("/documents/search", {
      method: "POST",
      body: JSON.stringify({ query, limit }),
    }),

  ask: (query: string) =>
    request<{ answer: string }>("/documents/ask", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),

  createDocument: (title: string, content: string) =>
    request<{ id: number; title: string }>("/documents", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    }),

  // Authentication
  auth: {
    register: (email: string, password: string, fullName: string, forceFresh = false, oldPassword?: string) =>
      request<{ success: boolean; userId: string }>("/auth/register", {
        method: "POST",
        // JSON.stringify silently drops undefined values, so forceFresh and
        // oldPassword are omitted from the payload when not supplied.
        body: JSON.stringify({
          email,
          password,
          fullName,
          forceFresh: forceFresh || undefined,
          oldPassword,
        }),
      }),

    login: (email: string, password: string) =>
      request<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      authedRequest<{ success: boolean }>("/auth/logout", { method: "POST" }),

    restore: (email: string, password: string) =>
      request<{ accessToken: string }>("/auth/restore", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },

  // Profile
  profile: {
    get: () =>
      authedRequest<{ success: boolean; data: Profile }>("/profile"),

    update: (data: Partial<ProfileInput>) =>
      authedRequest<{ success: boolean; data: Profile }>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Chat
  chat: {
    createSession: () =>
      authedRequest<{ sessionId: string }>("/chat/sessions", { method: "POST" }),

    sendMessage: (sessionId: string, message: string) =>
      authedRequest<{ answer: string; sources: unknown[] }>("/chat/messages", {
        method: "POST",
        body: JSON.stringify({ sessionId, message }),
      }),
  },

  // Account management
  account: {
    delete: () =>
      authedRequest<{ success: boolean }>("/account", { method: "DELETE" }),

    setPassword: (password: string, passwordConfirmation: string) =>
      authedRequest<{ success: boolean }>("/account/password", {
        method: "POST",
        body: JSON.stringify({ password, password_confirmation: passwordConfirmation }),
      }),

    disconnectGoogle: () =>
      authedRequest<{ success: boolean }>("/account/google", { method: "DELETE" }),
  },
};
