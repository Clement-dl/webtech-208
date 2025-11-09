"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const GENRES = ["drame", "science-fiction", "space opera"];

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [genreFilter, setGenreFilter] = useState(null);
  const [kindFilter, setKindFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadWorks() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("works")
        .select(
          `
          id,
          slug,
          title,
          year,
          kind,
          genre,
          description,
          poster_path,
          endings ( id )
        `
        )
        .order("title", { ascending: true });

      if (error) {
        console.error("Erreur Supabase (works):", error);
        setErrorMsg("Erreur en chargeant les œuvres.");
      } else {
        setWorks(data ?? []);
      }

      setLoading(false);
    }

    loadWorks();
  }, []);

  const filteredWorks = works
    .filter((w) => (genreFilter ? w.genre === genreFilter : true))
    .filter((w) =>
      kindFilter === "all" ? true : w.kind === kindFilter
    )
    .filter((w) =>
      search.trim()
        ? w.title.toLowerCase().includes(search.trim().toLowerCase())
        : true
    );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Œuvres</h1>

        {/* Filtres */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Genres */}
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-full border ${
                !genreFilter ? "bg-white text-black" : "bg-transparent"
              }`}
              onClick={() => setGenreFilter(null)}
            >
              Tous les genres
            </button>

            {GENRES.map((g) => (
              <button
                key={g}
                className={`px-4 py-2 rounded-full border capitalize ${
                  genreFilter === g ? "bg-white text-black" : "bg-transparent"
                }`}
                onClick={() =>
                  setGenreFilter(genreFilter === g ? null : g)
                }
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          {/* Types (film / série) */}
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-full border ${
                kindFilter === "all" ? "bg-white text-black" : "bg-transparent"
              }`}
              onClick={() => setKindFilter("all")}
            >
              Tous les types
            </button>
            <button
              className={`px-4 py-2 rounded-full border ${
                kindFilter === "film" ? "bg-white text-black" : "bg-transparent"
              }`}
              onClick={() => setKindFilter("film")}
            >
              Films
            </button>
            <button
              className={`px-4 py-2 rounded-full border ${
                kindFilter === "serie" ? "bg-white text-black" : "bg-transparent"
              }`}
              onClick={() => setKindFilter("serie")}
            >
              Séries
            </button>
          </div>

          {/* Barre de recherche */}
          <form
            className="flex gap-3 max-w-xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Rechercher un film ou une série..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-white text-black font-semibold"
            >
              Chercher
            </button>
          </form>
        </div>

        {loading && <p>Chargement des œuvres...</p>}
        {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}

        {!loading && !errorMsg && filteredWorks.length === 0 && (
          <p>Aucune œuvre.</p>
        )}

        {/* Grille des œuvres : cartes plus petites */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorks.map((work) => {
            const endingsCount = work.endings?.length ?? 0;
            const posterSrc =
              work.poster_path && work.poster_path.trim() !== ""
                ? work.poster_path
                : "/posters/placeholder.svg";

            return (
              <article
                key={work.id}
                className="bg-neutral-900 rounded-lg overflow-hidden flex flex-col w-full max-w-xs mx-auto"
              >
                <div className="relative w-full aspect-[2/3] bg-neutral-800">
                  <Image
                    src={posterSrc}
                    alt={work.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h2 className="text-lg font-semibold">{work.title}</h2>
                  <p className="text-sm text-neutral-400">
                    {work.year ?? "—"} ·{" "}
                    {work.kind === "film" ? "movie" : "serie"} ·{" "}
                    {work.genre ?? "—"}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {endingsCount} fin(s) proposée(s)
                  </p>

                  <div className="mt-auto flex gap-3 pt-4">
                    <Link
                      href={`/works/${work.slug}`}
                      className="flex-1 text-center px-3 py-2 rounded-md bg-white text-black text-sm font-semibold"
                    >
                      Voir les fins
                    </Link>
                    <Link
                      href={`/works/${work.slug}/submit`}
                      className="flex-1 text-center px-3 py-2 rounded-md border border-white text-sm font-semibold"
                    >
                      Proposer une fin
                    </Link>
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
