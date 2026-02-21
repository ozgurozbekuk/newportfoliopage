import { Bot, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const QUICK_PROMPTS = [
  "Can you introduce Özgür?",
  "What are Özgür’s main skills?",
  "Does Özgür build AI agents and RAG applications?",
  "Where can I see Özgür’s projects?",
  "How can I get in touch with Özgür?",
  "Tell me about Özgür’s experience",
];

const STATUS = {
  AI_ACTIVE: "ai_active",
  WAITING: "waiting_for_ozgur",
  HUMAN: "human_active",
  CLOSED: "closed",
};

const CONVERSATION_ID_KEY = "portfolio_chat_conversation_id";
const MESSAGES_KEY_PREFIX = "portfolio_chat_messages_";
const PARTICIPANT_TOKEN_KEY_PREFIX = "portfolio_chat_participant_token_";

const createConversationId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const getInitialConversationId = () => {
  if (typeof window === "undefined") {
    return createConversationId();
  }

  const existing = window.localStorage.getItem(CONVERSATION_ID_KEY);
  if (existing) return existing;

  const next = createConversationId();
  window.localStorage.setItem(CONVERSATION_ID_KEY, next);
  return next;
};

const getInitialMessages = (conversationId) => {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(`${MESSAGES_KEY_PREFIX}${conversationId}`);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getParticipantToken = (conversationId) => {
  if (typeof window === "undefined") return "";
  const key = `${PARTICIPANT_TOKEN_KEY_PREFIX}${conversationId}`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next =
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `pt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  window.localStorage.setItem(key, next);
  return next;
};

export default function ChatBox() {
  const [conversationId] = useState(getInitialConversationId);
  const [participantToken] = useState(() => getParticipantToken(conversationId));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationStatus, setConversationStatus] = useState(STATUS.AI_ACTIVE);
  const [messages, setMessages] = useState(() => getInitialMessages(conversationId));

  const isAdminSession = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("as") === "ozgur";
  }, []);

  const pushSystemMessage = (content) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === "system" && last?.content === content) {
        return prev;
      }
      return [...prev, { role: "system", content }];
    });
  };

  const mapServerMessageToUi = (item) => {
    if (item?.sender === "ozgur") return "ozgur";
    if (item?.sender === "assistant") return "assistant";
    return "user";
  };

  const syncConversationFromServer = async () => {
    try {
      const res = await fetch("/.netlify/functions/get-conversation-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, participantToken }),
      });

      if (!res.ok) return;
      const data = await res.json();

      if (data?.status) {
        setConversationStatus((prev) => {
          if (
            (prev === STATUS.WAITING || prev === STATUS.HUMAN) &&
            data.status === STATUS.AI_ACTIVE
          ) {
            return prev;
          }
          if (prev !== data.status && data.status === STATUS.HUMAN) {
            pushSystemMessage("You are now chatting directly with Özgür");
          }
          return data.status;
        });
      }

      const serverMessages = Array.isArray(data?.messages) ? data.messages : [];
      const mapped = serverMessages.map((item) => ({
        role: mapServerMessageToUi(item),
        content: item.content || "",
      }));

      setMessages((prev) => {
        const localNonSystem = prev.filter((m) => m.role !== "system");
        if (mapped.length <= localNonSystem.length) return prev;
        return [...prev, ...mapped.slice(localNonSystem.length)];
      });
    } catch {
      // ignore sync errors
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      `${MESSAGES_KEY_PREFIX}${conversationId}`,
      JSON.stringify(messages)
    );
  }, [messages, conversationId]);

  useEffect(() => {
    syncConversationFromServer();
  }, [conversationId]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await syncConversationFromServer();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [conversationId]);

  const requestHumanTakeover = async () => {
    if (loading || conversationStatus === STATUS.HUMAN) return;

    try {
      const res = await fetch("/.netlify/functions/request-human", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, participantToken }),
      });

      if (!res.ok) {
        let msg = "request-human failed";
        try {
          const err = await res.json();
          msg = err?.message || msg;
        } catch {
          // keep default
        }
        throw new Error(msg);
      }

      setConversationStatus(STATUS.WAITING);
      pushSystemMessage("Özgür has been notified. Please wait…");
    } catch (err) {
      pushSystemMessage(
        `Could not notify Özgür right now. ${err?.message || "Please try again."}`
      );
    }
  };

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const sender =
      conversationStatus === STATUS.HUMAN && isAdminSession ? "ozgur" : "user";

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content }));

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: sender === "ozgur" ? "ozgur" : "user", content: text },
    ]);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sender,
          message: text,
          history,
          participantToken,
          clientStatus: conversationStatus,
        }),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          msg = err?.message || msg;
        } catch {
          // keep default
        }
        throw new Error(msg);
      }

      const data = await res.json();

      if (data?.status) {
        setConversationStatus(data.status);
      }

      if (data?.reply) {
        if (sender === "ozgur" && data.sender === "ozgur") {
          return;
        }
        const role =
          data.sender === "ozgur"
            ? "ozgur"
            : data.sender === "system"
            ? "system"
            : "assistant";

        setMessages((prev) => [...prev, { role, content: data.reply }]);
      }
    } catch (err) {
      pushSystemMessage(
        `Something went wrong. ${err?.message || "Please try again."}`
      );
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
    <section className="h-full px-4 pt-3">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
        <div className="mb-2 flex items-center gap-3 rounded-xl p-2 sm:p-3">
          <Bot className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" />
          <div>
            <p className="text-base sm:text-lg md:text-xl font-medium leading-snug">
              Hi, I’m Özgür’s AI assistant. I can walk you through his full-stack
              skills, AI agent work, and RAG application projects. How can I help
              you today?
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Status: <span className="font-semibold">{conversationStatus}</span>
              {isAdminSession ? " (admin session)" : ""}
            </p>
          </div>
        </div>

        <div className="mb-2 flex-1 min-h-0 rounded-xl border border-slate-200 bg-slate-50 p-2 sm:p-3">
          <div className="h-full overflow-y-auto">
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:text-base leading-relaxed text-slate-900 shadow-sm">
                    <p className="text-slate-500 dark:text-slate-400">
                      Ask me about Ozgur’s skills, projects, or how to get in
                      touch.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  if (msg.role === "system") {
                    return (
                      <div key={`msg-${idx}`} className="flex justify-center">
                        <div className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  if (msg.role === "user") {
                    return (
                      <div key={`msg-${idx}`} className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl bg-slate-900 px-4 py-2 text-sm sm:text-base font-medium text-white shadow">
                          {msg.content}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={`msg-${idx}`} className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm sm:text-base leading-relaxed shadow-sm ${
                          msg.role === "ozgur"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                            : "border-slate-200 bg-white text-slate-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}

              {loading && conversationStatus === STATUS.AI_ACTIVE && (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm sm:text-base leading-relaxed text-slate-900 shadow-sm">
                    <p className="animate-pulse text-slate-500">Thinking…</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="px-4"
          style={{
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
            paddingTop: "4px",
            background:
              "color-mix(in srgb, var(--tw-bg-opacity, 1) transparent, transparent)",
          }}
        >
          <div className="-mx-4 px-4 mb-2">
            <div className="mx-auto mb-2 flex w-full max-w-3xl gap-2 overflow-x-auto whitespace-nowrap">
              {QUICK_PROMPTS.map((q, i) => (
                <button
                  key={`${q}-${i}`}
                  onClick={() => sendMessage(q)}
                  disabled={loading || conversationStatus !== STATUS.AI_ACTIVE}
                  className="shrink-0 cursor-pointer text-white rounded-full border border-slate-300 bg-gray-600 px-3 py-2 text-sm hover:bg-gray-300 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            <button
              onClick={requestHumanTakeover}
              disabled={loading || conversationStatus !== STATUS.AI_ACTIVE}
              className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              💬 Talk directly with Özgür
            </button>
          </div>

          <div className="mx-auto mt-2 flex w-full max-w-3xl flex-col gap-2 sm:flex-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about my skills, projects, contact…"
              aria-label="Ask the portfolio AI"
              className="w-full flex-1 rounded-xl border border-gray-600 bg-white px-4 py-3 outline-none focus:border-slate-300"
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
