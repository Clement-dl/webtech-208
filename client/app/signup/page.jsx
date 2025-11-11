"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { user, error } = await signup({
      email,
      password,
      username,
      role,
    });

    if (error || !user) {
      console.error(error);
      setErrorMsg(error?.message ?? "Erreur pendant l'inscription.");
      setLoading(false);
      return;
    }

    // Succès
    router.push("/works");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <section className="w-full max-w-md border border-neutral-800 rounded-lg px-6 py-8 bg-neutral-900">
        <h1 className="text-2xl font-bold text-center mb-4">
          Inscription
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
            <p className="text-xs text-neutral-400 mt-1">
              Au moins 6 caractères (ex : <code>Test1234</code>).
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Pseudo</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <p className="block text-sm mb-1">Rôle</p>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                <span>Utilisateur</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                <span>Admin</span>
              </label>
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md bg-white text-black font-semibold disabled:opacity-60"
          >
            {loading ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>
      </section>
    </main>
  );
}
