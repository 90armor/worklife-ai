import { auth } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

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
}

export interface ProfileInput {
  fullName: string;
  nationality: string;
  preferredLanguage: string;
  occupation: string;
  prefecture: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Destructure so we can merge headers instead of letting ...options replace them wholesale
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
    throw new Error(`API error ${res.status}: ${await res.text()}`);
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
    register: (email: string, password: string, fullName: string) =>
      request<{ success: boolean; userId: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      }),

    login: (email: string, password: string) =>
      request<{ accessToken: string }>("/auth/login", {
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
};
