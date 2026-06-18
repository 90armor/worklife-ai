"use client";

import { useState } from "react";
import { api, SearchResult } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ResultCard({ result }: Readonly<{ result: SearchResult }>) {
  return (
    <Card className="animate-fadeIn">
      <h3 className="text-h3 mb-1">{result.title}</h3>
      <p className="text-sm text-body leading-relaxed mb-3">
        {result.content.slice(0, 200)}…
      </p>
      <span className="text-caption">
        Relevance: {(result.similarity * 100).toFixed(1)}%
      </span>
    </Card>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");
    setResults([]);
    try {
      const [search, ask] = await Promise.all([
        api.search(query),
        api.ask(query),
      ]);
      setResults(search.results);
      setAnswer(ask.answer);
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 animate-slideUp">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-display mb-3">WorkLife AI</h1>
        <p className="text-body text-muted max-w-md mx-auto">
          Ask anything about working and living in Japan — visa requirements,
          workplace culture, housing, and more.
        </p>
      </div>

      {/* Search */}
      <Card padding="md" className="mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
              placeholder="Ask a question…"
              aria-label="Search query"
              className="w-full h-11 pl-10 pr-3 rounded-md border border-neutral-border text-body bg-card transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus:border-primary-600 placeholder:text-muted"
            />
          </div>
          <Button
            variant="primary"
            loading={loading}
            onClick={handleSearch}
            disabled={!query.trim()}
            aria-label="Submit question"
          >
            Ask
          </Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* AI Answer */}
      {answer && (
        <Card padding="md" className="mb-6 animate-slideUp border-l-4 border-primary-400">
          <h2 className="text-h3 text-primary-600 dark:text-primary-400 mb-2">Answer</h2>
          <p className="text-body leading-relaxed">{answer}</p>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section aria-label="Search results">
          <h2 className="text-h2 mb-4">
            {results.length} related {results.length === 1 ? "result" : "results"}
          </h2>
          <div className="flex flex-col gap-3">
            {results.map((r) => (
              <ResultCard key={r.id} result={r} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && !answer && results.length === 0 && !error && (
        <p className="text-center text-caption mt-8">
          Try asking about visa requirements, salary expectations, or prefecture life.
        </p>
      )}
    </main>
  );
}
