// src/components/ChatBox.jsx
import { Bot, Send } from "lucide-react";
import { useState } from "react";

const QUICK_PROMPTS = [
  "Can you introduce Özgür?",
  "What are Özgür’s main skills?",
  "Where can I see Özgür’s projects?",
  "How can I get in touch with Özgür?",
  "Tell me about Özgür’s experience",
];

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [quickPrompt, setQuickPrompt] = useState("");

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    setLoading(true);
    setAnswer("");
    setQuickPrompt(text);
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
    <section className="h-full px-4 pt-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Intro header */}
        <div className="mb-4 flex items-center gap-3 rounded-xl p-3 sm:p-4">
          <Bot className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          <p className="text-base sm:text-lg md:text-xl font-medium leading-snug">
            Hi, I’m Özgür’s AI assistant. I’m here to introduce Özgür — how can
            I help you today?
          </p>
        </div>
        {/* Answer — chat-style bubbles with inner scroll */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="min-h-[160px] max-h-[60vh] sm:min-h-[200px] sm:max-h-[56vh] md:min-h-[220px] md:max-h-[52vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
              {quickPrompt && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-slate-900 px-4 py-2 text-sm sm:text-base font-medium text-white shadow">
                    {quickPrompt}
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="max-w-[85%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:text-base leading-relaxed text-slate-900 shadow-sm">
                  {loading ? (
                    <p className="animate-pulse text-slate-500">Thinking…</p>
                  ) : answer ? (
                    <p className="whitespace-pre-wrap font-medium">{answer}</p>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">
                      Ask me about the developer’s skills, projects, or how to
                      get in touch.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
          <div className="-mx-4 px-4 mb-2">
            <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">
              {QUICK_PROMPTS.map((q, i) => (
                <button
                  key={`${q}-${i}`}
                  onClick={() => sendMessage(q)}
                  className="shrink-0 cursor-pointer text-white rounded-full border border-slate-300 dark:border-slate-700 bg-gray-600 dark:bg-gray-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-gray-300 hover:text-black dark:hover:bg-gray-600"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input row: stack on mobile, row on ≥sm */}
          <div className="mx-auto mt-4 flex w-full max-w-3xl flex-col gap-2 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about my skills, projects, contact…"
              aria-label="Ask the portfolio AI"
              className="w-full flex-1 rounded-xl border border-gray-600 bg-white  px-4 py-3 outline-none focus:border-slate-300 dark:focus:border-slate-600"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="rounded-xl cursor-pointer border border-gray-600 px-3 py-2 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-70 sm:min-w-[100px]"
            >
              {loading ? (
                "Thinking…"
              ) : (
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
