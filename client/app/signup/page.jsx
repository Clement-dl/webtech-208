"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup, login } from "@/lib/auth";

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

    // 🔹 On force une vraie connexion juste après l'inscription
    const { user: loggedInUser, error: loginError } = await login({
      email,
      password,
    });

    if (loginError || !loggedInUser) {
      console.error(loginError);
      setErrorMsg(
        loginError?.message ??
          "Compte créé, mais erreur pendant la connexion automatique."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/works");
    router.refresh(); 
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-4">
      <section className="glass w-full max-w-md rounded-2xl p-8 shadow-lg animate-fade-in-up">
        <h1 className="text-2xl font-bold text-center mb-6 gradient-text">
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
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
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
              className="input-field w-full"
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
                  className="accent-[var(--accent)]"
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
                  className="accent-[var(--accent)]"
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
            className="btn-primary w-full mt-2 text-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Création du compte..." : "S'inscrire"}
          </button>
        </form>
      </section>
    </main>
  );
}
