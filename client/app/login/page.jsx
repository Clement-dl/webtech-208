"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { user, error } = await login({ email, password });

    if (error || !user) {
      console.error(error);
      setErrorMsg(error?.message ?? "Erreur pendant la connexion.");
      setLoading(false);
      return;
    }

    // Succès : on redirige vers les œuvres
    router.push("/works");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <section className="w-full max-w-md border border-neutral-800 rounded-lg px-6 py-8 bg-neutral-900">
        <h1 className="text-2xl font-bold text-center mb-4">
          Se connecter
        </h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-stretch gap-4"
        >
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md bg-white text-black font-semibold disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  );
}
