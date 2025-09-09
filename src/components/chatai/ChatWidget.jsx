import { useState } from "react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      const aiMsg = { role: "assistant", content: data.reply || "…" };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "An error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      position: "fixed", right: 16, bottom: 16, width: 340,
      background: "#fff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,.1)",
      padding: 12, fontFamily: "system-ui, sans-serif", zIndex: 9999
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>💬 Chat with my AI Agent</div>

      <div style={{
        height: 280, overflowY: "auto", border: "1px solid #eee",
        borderRadius: 12, padding: 8, marginBottom: 8
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "6px 0", color: m.role === "user" ? "#1d4ed8" : "#047857" }}>
            <strong>{m.role === "user" ? "You:" : "AI:"}</strong> {m.content}
          </div>
        ))}
        {loading && <div>Typing…</div>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about my skills, projects, contact…"
          rows={2}
          style={{ flex: 1, border: "1px solid #eee", borderRadius: 8, padding: 8, resize: "none" }}
        />
        <button onClick={sendMessage} disabled={loading}
          style={{ padding: "0 14px", borderRadius: 10, border: 0, background: "#2563eb", color: "#fff" }}>
          Send
        </button>
      </div>
    </div>
  );
}
