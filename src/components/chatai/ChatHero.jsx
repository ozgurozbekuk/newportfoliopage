// src/components/ChatBox.jsx
import { Bot, Send } from "lucide-react";
import { useState } from "react";

const QUICK_PROMPTS = [
  "Can you introduce Özgür?",
  "What are Özgür’s main skills?",
  "Where can I see Özgür’s projects?",
  "How can I get in touch with Özgür?",
  "Tell me about Özgür’s experience"
];


export default function ChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setAnswer(data.reply || "…");
    } catch {
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      if (!textOverride) setInput("");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="px-4 pt-8 pb-[240px] sm:pb-[220px] md:pb-[200px]">
      <div className="mx-auto w-full max-w-3xl">
        {/* Intro header */}
        <div className="mb-4 flex items-center gap-3 rounded-xl p-3 sm:p-4">
          <Bot className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          <p className="text-base sm:text-lg md:text-xl font-medium leading-snug">
            Hi, I’m Özgür’s AI assistant. I’m here to introduce Özgür — how can I help you today?
          </p>
        </div>

        {/* Answer — responsive height + inner scroll */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 ">
          <div className="min-h-[160px] max-h-[60vh] sm:min-h-[200px] sm:max-h-[56vh] md:min-h-[220px] md:max-h-[52vh] overflow-y-auto">
            {answer ? (
              <p className="whitespace-pre-wrap text-base sm:text-lg font-medium">-{answer}</p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                Ask me about the developer’s skills, projects, or how to get in touch.
              </p>
            )}
          </div>
        </div>

        {/* Fixed bottom bar */}
        <div
          className=" px-4"
          style={{
            // Safe area aware padding for iOS notch
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            paddingTop: "8px",
            background:
              "color-mix(in srgb, var(--tw-bg-opacity, 1) transparent, transparent)",
          }}
        >
          {/* Quick prompts: mobile horizontal scroll, larger screens wrap */}
          <div className="-mx-4 px-4 mb-2">
            <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">
              {QUICK_PROMPTS.map((q, i) => (
                <button
                  key={`${q}-${i}`}
                  onClick={() => sendMessage(q)}
                  className="shrink-0 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input row: stack on mobile, row on ≥sm */}
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about my skills, projects, contact…"
              aria-label="Ask the portfolio AI"
              className="w-full flex-1 rounded-xl border border-gray-600 bg-white px-4 py-3 outline-none focus:border-slate-300 dark:focus:border-slate-600"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="rounded-xl border border-gray-600 px-3 py-2 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-70 sm:min-w-[120px]"
            >
              {loading ? "Thinking…" : (
                <span className="inline-flex items-center gap-2">
                  <Send size={30} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
