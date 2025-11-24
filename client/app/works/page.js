"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";
import Orb from "@/components/Background";

// helpers
const norm = (s) => (s ? s.trim().toLowerCase() : "");
const titleCase = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase());

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [genreFilter, setGenreFilter] = useState(null);
  const [kindFilter, setKindFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [userId, setUserId] = useState(null);
  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  useEffect(() => {
    async function loadWorks() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("works")
        .select(
          `id, slug, title, year, kind, genre, description, poster_path, endings ( id )`
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

  const genres = useMemo(() => {
    const set = new Set();
    for (const w of works) {
      const g = norm(w.genre);
      if (g) set.add(g);
    }
    return Array.from(set).sort();
  }, [works]);

  const filteredWorks = works
    .filter((w) => (genreFilter ? norm(w.genre) === genreFilter : true))
    .filter((w) => (kindFilter === "all" ? true : w.kind === kindFilter))
    .filter((w) =>
      search.trim()
        ? w.title.toLowerCase().includes(search.trim().toLowerCase())
        : true
    );

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-8 overflow-hidden text-foreground">
      {/* Orb en fond */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <section className="w-full max-w-7xl flex flex-col gap-8">
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Œuvres</h1>

        {/* Filtres */}
        <div className="flex flex-col gap-4 mb-8 items-center">
          {/* Genres */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              className={`btn-secondary ${!genreFilter ? "bg-white/10 text-white border-white/50" : ""}`}
              onClick={() => setGenreFilter(null)}
            >
              Tous les genres
            </button>
            {genres.map((g) => (
              <button
                key={g}
                className={`btn-secondary capitalize ${genreFilter === g ? "bg-white/10 text-white border-white/50" : ""}`}
                onClick={() => setGenreFilter(genreFilter === g ? null : g)}
              >
                {titleCase(g)}
              </button>
            ))}
          </div>

          {/* Types */}
          <div className="flex flex-wrap gap-3 justify-center">
            {["all", "film", "serie"].map((type) => (
              <button
                key={type}
                className={`btn-secondary ${kindFilter === type ? "bg-white/10 text-white border-white/50" : ""}`}
                onClick={() => setKindFilter(type)}
              >
                {type === "all" ? "Tous les types" : type === "film" ? "Films" : "Séries"}
              </button>
            ))}
          </div>

          {/* Search */}
          <form
            className="flex gap-3 max-w-xl justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Rechercher un film ou une série..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Chercher
            </button>
          </form>
        </div>

        {loading && <p className="text-foreground/70 text-center">Chargement des œuvres...</p>}
        {errorMsg && <p className="text-red-400 mb-4 text-center">{errorMsg}</p>}
        {!loading && !errorMsg && filteredWorks.length === 0 && (
          <p className="text-foreground/70 text-center">Aucune œuvre trouvée.</p>
        )}

        {/* Grille des œuvres */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorks.map((work) => {
            const endingsCount = work.endings?.length ?? 0;
            const posterSrc = work.poster_path?.trim() || "/posters/placeholder.svg";

            return (
              <article
                key={work.id}
                className="card card-shine flex flex-col w-full max-w-xs mx-auto"
              >
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                  <Image
                    src={posterSrc}
                    alt={work.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2 flex-1">
                  <h2 className="text-lg font-semibold">{work.title}</h2>
                  <p className="text-sm text-foreground/60">
                    {work.year ?? "—"} · {work.kind === "film" ? "movie" : "serie"} · {work.genre ?? "—"}
                  </p>
                  <p className="text-sm text-foreground/60">{endingsCount} fin(s) proposée(s)</p>

                  <div className="mt-auto flex gap-3 pt-4">
                    <Link
                      href={`/works/${work.slug}`}
                      className="btn-primary flex-1 text-center"
                    >
                      Voir les fins
                    </Link>
                    {userId ? (
                      <Link
                        href={`/works/${work.slug}/submit`}
                        className="btn-secondary flex-1 text-center"
                      >
                        Proposer une fin
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="btn-secondary flex-1 text-center bg-gray-800 border-gray-700 text-neutral-400 cursor-not-allowed disabled:opacity-60"
                      >
                        Proposer une fin
                      </button>
                    )}
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
