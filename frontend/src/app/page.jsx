"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import ChatPanel from "./ChatPanel";
import LivePreview from "./LivePreview";
import CodeTabs from "./CodeTabs";

export default function HomePage() {
  const { token, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load sessions");
        setLoading(false);
      });
  }, [token]);

  function loadSession(id) {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/sessions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setCurrent(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load session");
        setLoading(false);
      });
  }

  function createSession() {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSessions([data, ...sessions]);
        setCurrent(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to create session");
        setLoading(false);
      });
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 240, borderRight: "1px solid #eee", padding: 16 }}>
        <h3>Sessions</h3>
        <button onClick={createSession} style={{ width: "100%", marginBottom: 8 }}>+ New Session</button>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sessions.map(s => (
            <li key={s._id}>
              <button style={{ width: "100%", marginBottom: 4, background: current?._id === s._id ? "#eef" : undefined }} onClick={() => loadSession(s._id)}>
                {s._id.slice(-6)} <span style={{ fontSize: 10, color: "#888" }}>{new Date(s.updatedAt).toLocaleString()}</span>
              </button>
            </li>
          ))}
        </ul>
        <button onClick={logout} style={{ marginTop: 16, width: "100%" }}>Logout</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 200, borderBottom: "1px solid #eee", padding: 16 }}>
          {current && token ? (
            <ChatPanel session={current} setSession={setCurrent} token={token} />
          ) : (
            <b>Select or create a session to start chatting.</b>
          )}
        </div>
        <div style={{ flex: 1, borderBottom: "1px solid #eee", padding: 16 }}>
          {current ? (
            <LivePreview jsx={current.code?.jsx || ""} css={current.code?.css || ""} />
          ) : (
            <b>Live Preview (select a session)</b>
          )}
        </div>
        <div style={{ height: 200, padding: 16 }}>
          {current ? (
            <CodeTabs jsx={current.code?.jsx || ""} css={current.code?.css || ""} />
          ) : (
            <b>Code Tabs (select a session)</b>
          )}
        </div>
      </div>
    </div>
  );
} 