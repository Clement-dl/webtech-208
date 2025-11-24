"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";
import VoteBox from "@/components/VoteBox";
import Orb from "@/components/Background";

export default function WorkPage() {
  const { workId } = useParams();

  const [work, setWork] = useState(null);
  const [endings, setEndings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function loadWork() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("works")
        .select(
          `id, slug, title, year, kind, genre, description, poster_path,
           endings (id, title, author_name, content, created_at, votes:votes(count))`
        )
        .eq("slug", workId)
        .single();

      if (error) {
        console.error("Erreur Supabase (work):", error);
        setErrorMsg("Impossible de charger cette œuvre.");
      } else if (!data) {
        setErrorMsg("Œuvre introuvable.");
      } else {
        const endingsWithCounts = (data.endings ?? []).map((e) => ({
          id: e.id,
          title: e.title,
          author_name: e.author_name,
          content: e.content,
          created_at: e.created_at,
          votes_count: e.votes?.[0]?.count ?? 0,
        }));

        setWork({
          id: data.id,
          slug: data.slug,
          title: data.title,
          year: data.year,
          kind: data.kind,
          genre: data.genre,
          description: data.description,
          poster_path: data.poster_path,
        });

        setEndings(endingsWithCounts);
      }

      setLoading(false);
    }

    if (workId) loadWork();
  }, [workId]);

  useEffect(() => {
    async function loadUser() {
      const id = await getCurrentUserId();
      setUserId(id);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
        <p className="text-[var(--foreground)]">Chargement...</p>
      </main>
    );
  }

  if (errorMsg || !work) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
        </div>
        <p className="mb-4 text-[var(--foreground)]">{errorMsg || "Œuvre introuvable."}</p>
        <Link href="/works" className="btn-secondary">
          Retour aux œuvres
        </Link>
      </main>
    );
  }

  const posterSrc =
    work.poster_path && work.poster_path.trim() !== ""
      ? work.poster_path
      : "/posters/placeholder.svg";

  return (
    <main className="relative min-h-screen px-4 py-6 overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <Link
        href="/works"
        className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] underline mb-4 inline-block"
      >
        ← Retour aux œuvres
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster + infos */}
        <div className="w-full md:w-1/3 glass p-4 rounded-xl shadow-md flex flex-col">
          <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden">
            <Image src={posterSrc} alt={work.title} fill style={{ objectFit: "cover" }} />
          </div>

          <h1 className="text-2xl font-bold mt-4">{work.title}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {work.year ?? "—"} · {work.kind === "film" ? "movie" : "serie"} · {work.genre ?? "—"}
          </p>

          {work.description && (
            <p className="text-sm text-neutral-200 mt-4">{work.description}</p>
          )}

          <div className="mt-6 w-full flex justify-center md:justify-start">
            {userId ? (
              <Link
                href={`/works/${work.slug}/submit`}
                className="btn-primary w-full md:w-auto text-center"
              >
                Proposer une fin
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="btn-primary w-full md:w-auto text-center bg-gray-800 border-gray-700 text-neutral-400 cursor-not-allowed hover:bg-gray-800 disabled:opacity-60"
              >
                Connectez-vous pour publier une fin
              </button>
            )}
          </div>
        </div>

        {/* Liste des fins */}
        <section className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4">Fins proposées</h2>

          {endings.length === 0 && (
            <p className="text-sm text-neutral-400">Aucune fin n’a encore été proposée.</p>
          )}

          {endings.map((ending) => (
            <article
              key={ending.id}
              className="glass p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-1">{ending.title || "Fin sans titre"}</h3>
              <p className="text-sm text-neutral-400 mb-2">
                Proposée par <span className="font-medium">{ending.author_name || "Anonyme"}</span> — {ending.votes_count} vote{ending.votes_count !== 1 ? "s" : ""}
              </p>
              <p className="text-sm whitespace-pre-wrap mb-3">{ending.content}</p>
              <VoteBox endingId={ending.id} votesCount={ending.votes_count} />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
