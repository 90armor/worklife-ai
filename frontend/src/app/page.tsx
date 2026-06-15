"use client";

import { useState } from "react";
import { api, SearchResult } from "@/lib/api";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const [search, ask] = await Promise.all([
        api.search(query),
        api.ask(query),
      ]);
      setResults(search.results);
      setAnswer(ask.answer);
    } catch (err) {
      setAnswer(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>
        Semantic Search + AI
      </h1>

      <div style={{ display: "flex", gap: ".5rem", marginBottom: "2rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ask a question..."
          style={{
            flex: 1,
            padding: ".75rem 1rem",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "#e2e8f0",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: ".75rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: "#6366f1",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {answer && (
        <section
          style={{
            background: "#1e293b",
            padding: "1.25rem",
            borderRadius: 12,
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", marginBottom: ".5rem", color: "#a5b4fc" }}>
            Answer
          </h2>
          <p>{answer}</p>
        </section>
      )}

      {results.map((r) => (
        <article
          key={r.id}
          style={{
            borderBottom: "1px solid #334155",
            padding: "1rem 0",
          }}
        >
          <h3 style={{ fontSize: "1rem" }}>{r.title}</h3>
          <p style={{ color: "#94a3b8", fontSize: ".9rem" }}>
            {r.content.slice(0, 160)}...
          </p>
          <span style={{ fontSize: ".75rem", color: "#64748b" }}>
            similarity: {r.similarity.toFixed(3)}
          </span>
        </article>
      ))}
    </main>
  );
}
