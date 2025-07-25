"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      if (mode === 'login') {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 8 }} />
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ width: '100%' }}>{mode === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
      <div style={{ marginTop: 16 }}>
        {mode === 'login' ? (
          <span>Don't have an account? <button onClick={() => setMode('signup')}>Sign Up</button></span>
        ) : (
          <span>Already have an account? <button onClick={() => setMode('login')}>Login</button></span>
        )}
      </div>
    </div>
  );
} 