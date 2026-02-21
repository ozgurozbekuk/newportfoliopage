import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function AdminChat() {
  const [params] = useSearchParams();
  const [conversationId, setConversationId] = useState(params.get("cid") || "");
  const [adminToken, setAdminToken] = useState(params.get("adminToken") || "");
  const [status, setStatus] = useState("ai_active");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadConversation = async () => {
    const cid = conversationId.trim();
    const token = adminToken.trim();
    if (!cid || !token) return;

    try {
      const res = await fetch("/.netlify/functions/get-conversation-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ conversationId: cid, adminToken: token }),
      });

      if (!res.ok) return;
      const data = await res.json();
      setStatus(data?.status || "ai_active");
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
    } catch {
      // ignore polling errors
    }
  };

  useEffect(() => {
    loadConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, adminToken]);

  useEffect(() => {
    const cid = conversationId.trim();
    if (!cid) return;

    const intervalId = setInterval(loadConversation, 3000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, adminToken]);

  const sendAsOzgur = async () => {
    const text = message.trim();
    const cid = conversationId.trim();
    if (!cid || !text || loading) return;

    setLoading(true);
    try {
      await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          conversationId: cid,
          sender: "ozgur",
          message: text,
          history: [],
          adminToken,
        }),
      });
      setMessage("");
      await loadConversation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Chat</h1>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          placeholder="Conversation ID"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <input
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="Admin token"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          onClick={loadConversation}
          className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100"
        >
          Load
        </button>
      </div>

      <p className="mb-3 text-sm text-slate-600">
        Status: <span className="font-semibold">{status}</span>
      </p>

      <div className="mb-4 h-[55vh] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet.</p>
          ) : (
            messages.map((item, idx) => (
              <div key={`m-${idx}`}>
                <p className="text-xs text-slate-500">
                  {(item.sender || item.role || "unknown").toUpperCase()} - {item.createdAt || ""}
                </p>
                <p className="rounded-lg bg-white px-3 py-2 text-sm text-slate-900">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendAsOzgur();
            }
          }}
          placeholder="Write as Özgür..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          onClick={sendAsOzgur}
          disabled={loading || !conversationId.trim() || !adminToken.trim()}
          className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </main>
  );
}
