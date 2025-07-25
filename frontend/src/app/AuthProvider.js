"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (!t && window.location.pathname !== "/auth") {
      router.push("/auth");
    }
  }, [router]);

  function login(token) {
    localStorage.setItem("token", token);
    setToken(token);
    router.push("/");
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/auth");
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 