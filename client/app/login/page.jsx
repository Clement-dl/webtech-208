"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAs, isAuthed } from "@/lib/auth";
import { useEffect } from "react";

export default function LoginPage() {
  const [name, setName] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  // si déjà connecté, va sur Home
  useEffect(() => {
    if (isAuthed()) router.replace("/");
  }, [router]);

  const onSubmit = (e) => {
    e.preventDefault();
    loginAs(name || "fan");
    const next = params.get("next") || "/";
    router.replace(next);
  };

  return (
    <section className="max-w-md">
      <h2 className="text-xl font-semibold mb-2">Connexion</h2>
      <p className="text-sm text-neutral-400 mb-4">
        Pas de base de données pour le moment — on simule la connexion.
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Pseudo</span>
          <input
            className="mt-1 w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            placeholder="ex: filmlover92"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="bg-white text-black border border-neutral-800 rounded px-4 py-2 text-sm"
        >
          Se connecter
        </button>

        <p className="text-sm text-neutral-400">
          Pas de compte ?{" "}
          <Link href="/signup" className="underline">
            S’inscrire
          </Link>
        </p>
      </form>
    </section>
  );
}
