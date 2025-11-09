"use client";

import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    // pour l’instant, on simule : inscription = login direct
    login();
    router.push("/works");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <section className="w-full max-w-md border border-neutral-800 rounded-lg px-6 py-8 bg-neutral-900">
        <h1 className="text-2xl font-bold text-center mb-4">
          Inscription
        </h1>

        <p className="text-sm text-neutral-300 text-center mb-6">
          Pour cette version de démo, l’inscription est simulée.
          Clique simplement sur le bouton ci-dessous pour entrer
          sur le site.
        </p>

        <form
          onSubmit={handleSignup}
          className="flex flex-col items-center gap-4"
        >
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-white text-black font-semibold"
          >
            S&apos;inscrire
          </button>
        </form>
      </section>
    </main>
  );
}
