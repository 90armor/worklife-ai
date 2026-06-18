"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  );
}

// ── Suggested prompts ─────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "What visa do I need for a software engineering job in Japan?",
  "How does the Japanese health insurance (kenko hoken) work?",
  "What's the average salary for foreigners in Tokyo?",
  "How do I open a bank account as a new resident?",
];

// ── Chat inner (needs useSearchParams) ───────────────────────────────────────

function ChatPageInner() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function handleSend(text: string = input) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.ask(trimmed);
      const aiMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content: res.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: `e-${Date.now()}`,
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5">
              <SparkleIcon />
            </div>
            <h1 className="text-h1 mb-2">
              {conversationId ? "Continue the conversation" : "What can I help you with?"}
            </h1>
            <p className="text-body text-muted max-w-sm mb-8">
              Ask anything about working and living in Japan — visas, housing, workplace culture, and more.
            </p>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left px-4 py-3 rounded-lg border border-neutral-border bg-card text-sm text-body hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-600/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 active:scale-[0.99]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={["flex gap-3 animate-slideUp", msg.role === "user" ? "flex-row-reverse" : ""].join(" ")}>
                {/* Avatar */}
                <div className={[
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  msg.role === "assistant"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-border text-heading",
                ].join(" ")}>
                  {msg.role === "assistant" ? "W" : "Y"}
                </div>

                {/* Bubble */}
                <div className={[
                  "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-card border border-neutral-border text-body rounded-tl-sm"
                    : "bg-primary-600 text-white rounded-tr-sm",
                ].join(" ")}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-medium">
                  W
                </div>
                <div className="bg-card border border-neutral-border px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-neutral-border bg-card px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 rounded-xl border border-neutral-border bg-surface px-3 py-2 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/20 transition-all duration-150">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              aria-label="Chat input"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm text-body placeholder:text-muted focus:outline-none leading-relaxed min-h-[24px] disabled:opacity-60"
              style={{ overflowY: "hidden" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className={[
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                input.trim() && !loading
                  ? "bg-primary-600 text-white hover:bg-primary-800 active:scale-95"
                  : "bg-neutral-border/50 text-muted cursor-not-allowed",
              ].join(" ")}
            >
              <SendIcon />
            </button>
          </div>
          <p className="text-[11px] text-muted text-center mt-2">
            Press <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
