import { use } from "react";
import Link from "next/link";
import Poster from "@/components/Poster";
import { WORKS, ENDINGS } from "@/lib/fakeDb";

function Pill({ href, active, children }) {
  return (
    <Link
      href={href}
      className={
        "px-3 py-1 rounded-full text-sm border " +
        (active
          ? "bg-white text-black border-white"
          : "border-neutral-700 hover:border-neutral-500")
      }
    >
      {children}
    </Link>
  );
}

export default function WorksPage({ searchParams }) {
  const sp = use(searchParams);

  const genre = (sp?.genre ?? "all").toLowerCase(); // drame, science-fiction, ...
  const type = (sp?.type ?? "all").toLowerCase();   // movie, series, all
  const query = (sp?.q ?? "").toLowerCase();        // recherche texte

  // genres uniques à partir des données
  const genres = Array.from(new Set(WORKS.map((w) => w.genre))).sort();

  // filtrage
  let list = WORKS.slice();

  if (genre !== "all") {
    list = list.filter(
      (w) => (w.genre || "").toLowerCase() === genre
    );
  }

  if (type !== "all") {
    list = list.filter(
      (w) => (w.type || "").toLowerCase() === type
    );
  }

  if (query) {
    list = list.filter((w) =>
      w.title.toLowerCase().includes(query)
    );
  }

  // petit label sympa pour le message "aucun résultat"
  const typeLabel =
    type === "movie" ? " (films)" :
    type === "series" ? " (séries)" :
    "";

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Œuvres</h2>

      {/* Barre genres */}
      <nav className="flex flex-wrap gap-2 mb-3">
        {/* Tous les genres */}
        <Pill
          href={`/works?${new URLSearchParams({
            ...(type !== "all" ? { type } : {}),
            ...(query ? { q: query } : {}),
          })}`}
          active={genre === "all"}
        >
          Tous
        </Pill>

        {/* Genres individuels */}
        {genres.map((g) => (
          <Pill
            key={g}
            href={`/works?${new URLSearchParams({
              genre: g,
              ...(type !== "all" ? { type } : {}),
              ...(query ? { q: query } : {}),
            })}`}
            active={genre === g.toLowerCase()}
          >
            {g}
          </Pill>
        ))}
      </nav>

      {/* Barre type film / série */}
      <nav className="flex flex-wrap gap-2 mb-3">
        <Pill
          href={`/works?${new URLSearchParams({
            ...(genre !== "all" ? { genre } : {}),
            ...(query ? { q: query } : {}),
          })}`}
          active={type === "all"}
        >
          Tous les types
        </Pill>
        <Pill
          href={`/works?${new URLSearchParams({
            type: "movie",
            ...(genre !== "all" ? { genre } : {}),
            ...(query ? { q: query } : {}),
          })}`}
          active={type === "movie"}
        >
          Films
        </Pill>
        <Pill
          href={`/works?${new URLSearchParams({
            type: "series",
            ...(genre !== "all" ? { genre } : {}),
            ...(query ? { q: query } : {}),
          })}`}
          active={type === "series"}
        >
          Séries
        </Pill>
      </nav>

      {/* Barre de recherche */}
      <form
        className="mb-6 flex items-center gap-2"
        method="GET"
        action="/works"
      >
        {/* On conserve le genre/type sélectionnés */}
        {genre && genre !== "all" && (
          <input type="hidden" name="genre" value={genre} />
        )}
        {type && type !== "all" && (
          <input type="hidden" name="type" value={type} />
        )}

        <input
          type="text"
          name="q"
          defaultValue={sp?.q ?? ""}
          placeholder="Rechercher un film ou une série…"
          className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded border bg-white text-black"
        >
          Chercher
        </button>
        {query && (
          <Link
            href={`/works?${new URLSearchParams({
              ...(genre !== "all" ? { genre } : {}),
              ...(type !== "all" ? { type } : {}),
            })}`}
            className="text-sm underline text-neutral-300"
            title="Effacer la recherche"
          >
            Effacer
          </Link>
        )}
      </form>

      {/* Grille 3 colonnes */}
      {list.length === 0 ? (
        <p className="text-neutral-300">
          Aucune œuvre
          {genre !== "all" ? ` dans le genre “${genre}”` : ""}
          {typeLabel}
          {query ? ` pour “${query}”` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((w) => {
            const endingsCount = ENDINGS.filter(
              (e) => e.workId === w.id
            ).length;
            return (
              <article
                key={w.id}
                className="border border-neutral-800 rounded overflow-hidden"
              >
                <Poster
                  workId={w.id}
                  alt={w.title}
                  className="w-full h-[360px] object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium">{w.title}</h3>
                  <div className="text-sm text-neutral-400 mb-2">
                    {w.year} · {w.type}
                    {w.genre ? ` · ${w.genre}` : ""}
                  </div>
                  <div className="text-sm text-neutral-400 mb-3">
                    {endingsCount} fin(s) proposée(s)
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/works/${w.id}`}
                      className="px-3 py-2 text-sm rounded border bg-white text-black"
                    >
                      Voir les fins
                    </Link>
                    <Link
                      href={`/works/${w.id}/submit`}
                      className="px-3 py-2 text-sm rounded border hover:border-neutral-500"
                    >
                      Proposer une fin
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
