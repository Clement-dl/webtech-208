"use client";
import { use } from "react";
import { useState } from "react";
import Link from "next/link";
import { WORKS } from "@/lib/fakeDb";

// Client Component, on utilise React.use() pour déballer params
export default function SubmitEndingPage({ params }) {
  const { workId } = use(params); //  déballage côté client

  const work = WORKS.find((w) => w.id === workId);
  if (!work) return <p>Œuvre introuvable.</p>;

  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [ok, setOk] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setOk(true);
    // plus tard: POST vers Supabase
  };

  return (
    <section className="max-w-xl">
      <h2 className="text-xl font-semibold mb-2">
        Proposer une fin — {work.title}
      </h2>

      {ok && (
        <div className="rounded border border-green-700 bg-green-900/30 p-3 mb-3">
          Fin envoyée (simulation). On branchera Supabase ensuite.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Auteur</span>
          <input
            className="mt-1 w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm">Votre fin</span>
          <textarea
            className="mt-1 w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-white text-black border rounded px-4 py-2 text-sm"
        >
          Publier
        </button>
      </form>

      <div className="mt-6">
        <Link href={`/works/${workId}`} className="underline text-sm">
          ← Retour à l’œuvre
        </Link>
      </div>
    </section>
  );
}
