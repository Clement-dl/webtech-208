"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserRole } from "@/lib/auth";

export default function MyWorksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [works, setWorks] = useState([]);

  // pour l’édition inline
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    title: "",
    year: "",
    kind: "film",
    genre: "",
    description: "",
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMsg("");

      // 1) vérifier l’utilisateur
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        if (!mounted) return;
        setErrorMsg("Vous devez être connecté·e.");
        router.push("/login");
        return;
      }
      const userId = userData.user.id;

      // 2) vérifier le rôle admin
      const role = await getCurrentUserRole();
      if (!mounted) return;
      if (role !== "admin") {
        setErrorMsg("Accès réservé aux administrateurs.");
        router.push("/");
        return;
      }

      // 3) charger les œuvres créées par cet utilisateur
      const { data, error } = await supabase
        .from("works")
        .select("id, slug, title, year, kind, genre, description, poster_path, created_at")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        console.error("Erreur chargement works:", error);
        setErrorMsg("Impossible de charger vos œuvres.");
      } else {
        setWorks(data ?? []);
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [router]);

  // Quand on clique sur "Modifier"
  const startEdit = (work) => {
    setEditingId(work.id);
    setEditFields({
      title: work.title || "",
      year: work.year || "",
      kind: work.kind || "film",
      genre: work.genre || "",
      description: work.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleFieldChange = (field, value) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (workId) => {
    setErrorMsg("");

    const payload = {
      title: editFields.title.trim(),
      year: editFields.year ? Number(editFields.year) : null,
      kind: editFields.kind,
      genre: editFields.genre.trim() || null,
      description: editFields.description.trim() || null,
    };

    const { data, error } = await supabase
      .from("works")
      .update(payload)
      .eq("id", workId)
      .select("*")
      .single();

    if (error) {
      console.error("Erreur update work:", error);
      setErrorMsg("Impossible de mettre à jour l'œuvre.");
      return;
    }

    // remplacer l’élément dans le state
    setWorks((prev) =>
      prev.map((w) => (w.id === workId ? data : w))
    );
    setEditingId(null);
  };

  const handleDelete = async (workId) => {
    setErrorMsg("");
    const ok = window.confirm("Supprimer définitivement cette œuvre ?");
    if (!ok) return;

    const { error } = await supabase
      .from("works")
      .delete()
      .eq("id", workId);

    if (error) {
      console.error("Erreur delete work:", error);
      setErrorMsg("Impossible de supprimer l'œuvre.");
      return;
    }

    setWorks((prev) => prev.filter((w) => w.id !== workId));
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mes œuvres publiées</h1>

        {errorMsg && (
          <p className="mb-4 text-sm text-red-400">{errorMsg}</p>
        )}

        {loading && <p>Chargement…</p>}

        {!loading && works.length === 0 && (
          <p>Vous n&apos;avez encore publié aucune œuvre.</p>
        )}

        <div className="flex flex-col gap-6 mt-4">
          {works.map((work) => {
            const posterSrc =
              work.poster_path && work.poster_path.trim() !== ""
                ? work.poster_path
                : "/posters/placeholder.svg";

            const isEditing = editingId === work.id;

            return (
              <article
                key={work.id}
                className="flex flex-col md:flex-row gap-4 border border-neutral-800 rounded-lg p-4 bg-neutral-900"
              >
                {/* Affiche */}
                <div className="w-full md:w-1/4">
                  <div className="relative w-full aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden">
                    <Image
                      src={posterSrc}
                      alt={work.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* Contenu + actions */}
                <div className="flex-1 flex flex-col gap-3">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editFields.title}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm"
                      />
                      <div className="flex flex-wrap gap-3">
                        <input
                          type="number"
                          value={editFields.year}
                          onChange={(e) =>
                            handleFieldChange("year", e.target.value)
                          }
                          className="px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm w-24"
                          placeholder="Année"
                        />
                        <select
                          value={editFields.kind}
                          onChange={(e) =>
                            handleFieldChange("kind", e.target.value)
                          }
                          className="px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm"
                        >
                          <option value="film">Film</option>
                          <option value="serie">Série</option>
                        </select>
                        <input
                          type="text"
                          value={editFields.genre}
                          onChange={(e) =>
                            handleFieldChange("genre", e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm"
                          placeholder="Genre"
                        />
                      </div>
                      <textarea
                        value={editFields.description}
                        onChange={(e) =>
                          handleFieldChange("description", e.target.value)
                        }
                        className="w-full min-h-[80px] px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-sm"
                        placeholder="Description"
                      />

                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(work.id)}
                          className="px-4 py-2 rounded-md bg-white text-black text-sm font-semibold"
                        >
                          Enregistrer
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-2 rounded-md border border-neutral-500 text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold">
                        {work.title}
                      </h2>
                      <p className="text-sm text-neutral-400">
                        {work.year ?? "—"} ·{" "}
                        {work.kind === "film" ? "movie" : "serie"} ·{" "}
                        {work.genre ?? "—"}
                      </p>
                      {work.description && (
                        <p className="text-sm text-neutral-200">
                          {work.description}
                        </p>
                      )}
                    </>
                  )}

                  {/* Liens & boutons */}
                  <div className="flex flex-wrap gap-3 mt-auto pt-2">
                    <Link
                      href={`/works/${work.slug}`}
                      className="px-3 py-2 rounded-md border border-white text-sm font-semibold"
                    >
                      Voir la fiche
                    </Link>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(work)}
                        className="px-3 py-2 rounded-md bg-white text-black text-sm font-semibold"
                      >
                        Modifier
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(work.id)}
                      className="px-3 py-2 rounded-md border border-red-500 text-red-400 text-sm font-semibold"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
