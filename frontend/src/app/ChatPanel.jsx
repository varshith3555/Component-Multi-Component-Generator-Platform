"use client";
import { useState } from "react";

export default function ChatPanel({ session, setSession, token }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendPrompt(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const newChat = [...(session.chat || []), { role: "user", content: input }];
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: input, code: session.code, chat: session.chat }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "AI error");
      const aiMsg = { role: "ai", content: data.ai };
      const updatedChat = [...newChat, aiMsg];
      let updatedCode = session.code;
      if (data.code) updatedCode = data.code;
      const saveRes = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/sessions/${session._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chat: updatedChat, code: updatedCode, uiState: session.uiState }),
      });
      const saved = await saveRes.json();
      setSession(saved);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
        {(session.chat || []).map((msg, i) => (
          <div key={i} style={{ marginBottom: 4, textAlign: msg.role === "user" ? "right" : "left" }}>
            <span style={{ fontWeight: msg.role === "user" ? "bold" : undefined }}>
              {msg.role === "user" ? "You" : "AI"}:
            </span> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendPrompt} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your prompt..."
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
} 