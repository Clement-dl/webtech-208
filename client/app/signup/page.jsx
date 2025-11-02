"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAs, isAuthed } from "@/lib/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthed()) router.replace("/");
  }, [router]);

  const onSubmit = (e) => {
    e.preventDefault();
    // On simule : inscription = connexion directe
    loginAs(name || "newfan");
    router.replace("/");
  };

  return (
    <section className="max-w-md">
      <h2 className="text-xl font-semibold mb-2">Inscription</h2>
      <p className="text-sm text-neutral-400 mb-4">
        Inscription simulée (pas de BDD pour l’instant).
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Pseudo</span>
          <input
            className="mt-1 w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            placeholder="ex: cinephile"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-white text-black border border-neutral-800 rounded px-4 py-2 text-sm"
        >
          Créer mon compte
        </button>

        <p className="text-sm text-neutral-400">
          Déjà un compte ?{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </p>
      </form>
    </section>
  );
}
