"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    const fn = mode === "signup" ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { error } = await fn({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = "/admin";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF7F0", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "360px", background: "white", border: "1px solid #D8CFC0", borderRadius: "1rem", padding: "2rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", marginBottom: "1.5rem", color: "#1F2A24" }}>
          {mode === "signup" ? "Creá tu cuenta" : "Iniciá sesión"}
        </h1>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "0.75rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", padding: "0.6rem", marginBottom: "1rem", border: "1px solid #D8CFC0", borderRadius: "0.5rem" }}
        />
        {error && <p style={{ color: "#B3564A", fontSize: "0.8rem", marginBottom: "0.75rem" }}>{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          style={{ width: "100%", background: "#0F6E5C", color: "white", padding: "0.7rem", borderRadius: "0.5rem", border: "none", fontSize: "0.95rem" }}
        >
          {loading ? "Un momento..." : mode === "signup" ? "Crear cuenta" : "Entrar"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.8rem", marginTop: "1rem", color: "#5B6560" }}>
          {mode === "signup" ? "¿Ya tenés cuenta?" : "¿Todavía no tenés cuenta?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            style={{ background: "none", border: "none", color: "#0F6E5C", textDecoration: "underline", cursor: "pointer", padding: 0 }}
          >
            {mode === "signup" ? "Iniciá sesión" : "Creá una"}
          </button>
        </p>
      </div>
    </div>
  );
}
