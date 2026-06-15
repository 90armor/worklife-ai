const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface SearchResult {
  id: number;
  title: string;
  content: string;
  similarity: number;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export const api = {
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
};
