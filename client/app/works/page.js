"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";
import Orb from "@/components/Background";
import { Menu } from "lucide-react";

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

  const [menuOpen, setMenuOpen] = useState(false);

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
    <main className="relative min-h-screen flex overflow-hidden text-foreground">
      {/* --- FOND ORB --- */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <aside className="fixed left-0 top-1/3 z-20 flex flex-col items-start">
        {/* BOUTON BURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-[rgba(17,24,39,0.7)] backdrop-blur-xl border border-[rgba(139,92,246,0.15)] rounded-r-xl text-white hover:bg-[rgba(139,92,246,0.1)] transition-all duration-300 z-30 shadow-md"
        >
          <Menu size={22} />
        </button>

        {/* MENU DEROULANT */}
        <div
          className={`
            bg-[rgba(17,24,39,0.7)] backdrop-blur-xl border border-[rgba(139,92,246,0.15)] rounded-r-xl
            overflow-hidden transition-all duration-300 mt-2 shadow-lg
            ${menuOpen ? "w-44 p-4 opacity-100" : "w-0 p-0 opacity-0"}
          `}
        >
          {menuOpen && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-300 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md ${
                    !genreFilter ? "ring-2 ring-purple-400 scale-105" : ""
                  }`}
                  onClick={() => setGenreFilter(null)}
                >
                  <Image src="/sort.png" width={18} height={18} alt="all" className="filter invert" />
                  Tous les genres
                </button>

                {genres.map((g) => (
                  <button
                    key={g}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-300 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md ${
                      genreFilter === g ? "ring-2 ring-purple-400 scale-105" : ""
                    }`}
                    onClick={() => setGenreFilter(genreFilter === g ? null : g)}
                  >
                    <Image src={`/${g}.png`} width={18} height={18} alt={g} className="filter invert" />
                    {titleCase(g)}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {["all", "film", "serie"].map((type) => {
                  const label = type === "all" ? "Tous les types" : type === "film" ? "Films" : "Séries";
                  const icon = type === "all" ? "/shapes.png" : type === "film" ? "/video.png" : "/episodes.png";
                  return (
                    <button
                      key={type}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-300 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-md ${
                        kindFilter === type ? "ring-2 ring-purple-400 scale-105" : ""
                      }`}
                      onClick={() => setKindFilter(type)}
                    >
                      <Image src={icon} width={18} height={18} alt={type} className="filter invert" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      <section className="flex-1 flex flex-col items-center px-4 py-8 w-full gap-8 pl-20">
        <h1 className="text-4xl font-bold mb-8 gradient-text text-center">Œuvres</h1>

        {/* --- BARRE DE RECHERCHE MODERNE --- */}
        <form
          className="flex max-w-xl w-full mb-8 relative"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Rechercher un film ou une série..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-5 py-3 rounded-full bg-gray-800/60 placeholder-gray-400 text-white
              shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500
              focus:shadow-lg transition-all duration-300 ease-in-out
            "
          />
          <button
            type="submit"
            className="
              absolute right-1 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full
              bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700
              hover:from-purple-600 hover:to-purple-800 text-white font-semibold
              shadow-md hover:scale-105 transform transition-all duration-300
              active:scale-95
            "
          >
            Chercher
          </button>
        </form>

        {loading && <p className="text-foreground/70 text-center">Chargement des œuvres...</p>}
        {errorMsg && <p className="text-red-400 mb-4 text-center">{errorMsg}</p>}
        {!loading && !errorMsg && filteredWorks.length === 0 && (
          <p className="text-foreground/70 text-center">Aucune œuvre trouvée.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
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
