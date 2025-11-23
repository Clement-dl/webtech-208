"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";

export default function MyEndingsPage() {
  const router = useRouter();

  const [confirmId, setConfirmId] = useState(null);
  const [endings, setEndings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadEndings() {
      setLoading(true);
      setErrorMsg("");

      const userId = await getCurrentUserId();
      if (!userId) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("endings")
        .select(
          `
          id,
          title,
          content,
          created_at,
          votes_count,
          work:works (
            id,
            title,
            slug
          )
        `
        )
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error("Erreur chargement fins:", error);
        setErrorMsg("Impossible de charger vos fins.");
      } else {
        const withLocalFields = (data ?? []).map((e) => ({
          ...e,
          editTitle: e.title ?? "",
          editContent: e.content ?? "",
        }));
        setEndings(withLocalFields);
      }

      setLoading(false);
    }

    loadEndings();

    return () => {
      mounted = false;
    };
  }, [router]);

  function updateLocalEnding(id, patch) {
    setEndings((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }

  async function handleSave(ending) {
    setSavingId(ending.id);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("endings")
        .update({
          title: ending.editTitle || null,
          content: ending.editContent,
        })
        .eq("id", ending.id);

      if (error) {
        console.error("Erreur update ending:", error);
        setErrorMsg("Impossible d'enregistrer les modifications.");
      } else {
        updateLocalEnding(ending.id, {
          title: ending.editTitle,
          content: ending.editContent,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Une erreur inattendue est survenue.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("endings")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erreur delete ending:", error);
        setErrorMsg("Impossible de supprimer cette fin.");
      } else {
        setEndings((prev) => prev.filter((e) => e.id !== id));
        setConfirmId(null); // fermer la confirmation
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Une erreur inattendue est survenue.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center px-4">
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-6">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 gradient-text">Mes fins</h1>
        <p className="text-sm text-neutral-300 mb-6">
          Retrouvez ici toutes les fins alternatives que vous avez proposées.
          Vous pouvez les modifier ou les supprimer.
        </p>

        {errorMsg && (
          <p className="text-sm text-red-400 mb-4">{errorMsg}</p>
        )}

        {endings.length === 0 && (
          <p className="text-sm text-neutral-400">
            Vous n&apos;avez pas encore proposé de fin.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {endings.map((ending) => (
            <article
              key={ending.id}
              className="glass p-4 rounded-xl shadow-md flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-lg">
                    {ending.work?.title || "Œuvre inconnue"}
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Proposée le{" "}
                    {new Date(ending.created_at).toLocaleString("fr-FR")}
                    {typeof ending.votes_count === "number" && (
                      <>
                        {" "}
                        — {ending.votes_count} vote
                        {ending.votes_count !== 1 ? "s" : ""}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  value={ending.editTitle}
                  onChange={(e) =>
                    updateLocalEnding(ending.id, { editTitle: e.target.value })
                  }
                  placeholder="Titre de la fin (optionnel)"
                  className="w-full bg-[rgba(15,23,42,0.9)] border border-[rgba(148,163,184,0.4)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <textarea
                  rows={4}
                  value={ending.editContent}
                  onChange={(e) =>
                    updateLocalEnding(ending.id, {
                      editContent: e.target.value,
                    })
                  }
                  className="w-full bg-[rgba(15,23,42,0.9)] border border-[rgba(148,163,184,0.4)] rounded-lg px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] whitespace-pre-wrap"
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setConfirmId(ending.id)}
                  disabled={deletingId === ending.id || savingId === ending.id}
                  className="btn-secondary text-sm bg-red-900/40 border-red-500/60 text-red-200 hover:bg-red-700/60 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Supprimer
                </button>

                <button
                  type="button"
                  onClick={() => handleSave(ending)}
                  disabled={savingId === ending.id || deletingId === ending.id}
                  className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingId === ending.id ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>

              {confirmId === ending.id && (
                <div className="mt-3 text-sm flex flex-wrap items-center gap-3 text-neutral-200">
                  <span>
                    Êtes-vous sûr de votre choix ? Cette action est définitive.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(ending.id)}
                    disabled={deletingId === ending.id}
                    className="btn-secondary text-xs bg-red-900/60 border-red-500/80 text-red-100 hover:bg-red-700/80 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="btn-secondary text-xs"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
