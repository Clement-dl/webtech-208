"use client";

import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // faux login : on marque l'utilisateur comme connecté dans localStorage
    login();
    // après connexion, on redirige vers les œuvres
    router.push("/works");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <section className="w-full max-w-md border border-neutral-800 rounded-lg px-6 py-8 bg-neutral-900">
        <h1 className="text-2xl font-bold text-center mb-4">
          Se connecter
        </h1>

        <p className="text-sm text-neutral-300 text-center mb-6">
          Pour l’instant, la connexion est simulée. Clique simplement
          sur le bouton ci-dessous pour accéder au site.
        </p>

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-4"
        >
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-white text-black font-semibold"
          >
            Se connecter
          </button>
        </form>
      </section>
    </main>
  );
}
