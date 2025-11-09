"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabaseClient";

export default function SubmitEndingPage() {
  const { workId } = useParams(); // slug
  const router = useRouter();

  const [work, setWork] = useState(null);
  const [loadingWork, setLoadingWork] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadWork() {
      setLoadingWork(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("works")
        .select("id, slug, title")
        .eq("slug", workId) 
        .single();

      if (error) {
        console.error("Erreur Supabase (work submit):", error);
        setLoadError("Impossible de charger cette œuvre.");
      } else if (!data) {
        setLoadError("Œuvre introuvable.");
      } else {
        setWork(data);
      }

      setLoadingWork(false);
    }

    if (workId) {
      loadWork();
    }
  }, [workId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!work) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.from("endings").insert({
        work_id: work.id,
        title: title || null,
        author_name: authorName || "Anonyme",
        content,
      });

      if (error) {
        console.error("Erreur insert Supabase (ending):", error);
        setErrorMsg(
          "Impossible d'enregistrer la fin (erreur Supabase)."
        );
      } else {
        setSuccessMsg("Fin enregistrée avec succès !");
        setTitle("");
        setAuthorName("");
        setContent("");

        
        router.push(`/works/${work.slug}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Une erreur inattendue est survenue lors de l'enregistrement."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingWork) {
    return (
      <main className="min-h-screen bg-black text-white px-8 py-6">
        <p>Chargement...</p>
      </main>
    );
  }

  if (loadError || !work) {
    return (
      <main className="min-h-screen bg-black text-white px-8 py-6">
        <p className="mb-4">{loadError || "Œuvre introuvable."}</p>
        <Link
          href="/works"
          className="inline-block px-4 py-2 rounded-md bg-white text-black font-semibold"
        >
          Retour aux œuvres
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-8 py-6 max-w-3xl">
      <Link
        href={`/works/${work.slug}`}
        className="inline-block mb-4 text-sm text-neutral-300 hover:underline"
      >
        ← Retour aux fins
      </Link>

      <h1 className="text-2xl font-bold mb-2">
        Proposer une fin pour &laquo; {work.title} &raquo;
      </h1>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1">
            Titre de la fin (optionnel)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Auteur (optionnel)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Contenu de la fin <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {errorMsg && (
          <p className="text-red-400 text-sm">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-400 text-sm">{successMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="self-start px-4 py-2 rounded-md bg-white text-black font-semibold disabled:opacity-60"
        >
          {submitting ? "Enregistrement..." : "Publier la fin"}
        </button>
      </form>
    </main>
  );
}
