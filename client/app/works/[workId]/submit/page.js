"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";
import Orb from "@/components/Background";

export default function SubmitEndingPage() {
  const { workId } = useParams();
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

    if (workId) loadWork();
  }, [workId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!work) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const userId = await getCurrentUserId();

      if (!userId) {
        setErrorMsg("Vous devez être connecté pour publier une fin.");
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("endings").insert({
        work_id: work.id,
        title: title || null,
        author_name: authorName || "Anonyme",
        content,
        created_by: userId,
      });

      if (error) {
        console.error("Erreur insert Supabase (ending):", error);
        setErrorMsg("Impossible d'enregistrer la fin (erreur Supabase).");
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
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
        <p className="text-[var(--foreground)]">Chargement...</p>
      </main>
    );
  }

  if (loadError || !work) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
        <p className="mb-4 text-[var(--foreground)]">{loadError || "Œuvre introuvable."}</p>
        <Link href="/works" className="btn-secondary">
          Retour aux œuvres
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex justify-center overflow-hidden px-4 py-6">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <section className="glass w-full max-w-3xl p-6 rounded-2xl shadow-lg animate-fade-in-up">
        <Link
          href={`/works/${work.slug}`}
          className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] underline transition-colors mb-4 block"
        >
          ← Retour aux fins
        </Link>

        <h1 className="text-2xl font-bold mb-4 gradient-text">
          Proposer une fin pour &laquo; {work.title} &raquo;
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Titre de la fin (optionnel)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Auteur (optionnel)</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="input-field w-full"
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
              className="input-field w-full"
            />
          </div>

          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full mt-2 text-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Enregistrement..." : "Publier la fin"}
          </button>
        </form>
      </section>
    </main>
  );
}
