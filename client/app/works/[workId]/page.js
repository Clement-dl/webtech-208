"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";

export default function WorkPage() {
  const { workId } = useParams(); // slug : "w1", "w2"...

  const [work, setWork] = useState(null);
  const [endings, setEndings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // états pour le vote
  const [votingFor, setVotingFor] = useState(null);
  const [voteError, setVoteError] = useState("");

  // utilisateur courant + fins déjà votées
  const [userId, setUserId] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());

  // ─────────────────────────────────────────────
  // 1. Chargement de l’œuvre + fins (avec nombre de votes)
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function loadWork() {
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
          endings (
            id,
            title,
            author_name,
            content,
            created_at,
            votes:votes(count)
          )
        `
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

    if (workId) {
      loadWork();
    }
  }, [workId]);

  // ─────────────────────────────────────────────
  // 2. Chargement de l’utilisateur + des fins qu’il a déjà votées
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function loadUserAndVotes() {
      const id = await getCurrentUserId();
      setUserId(id);

      if (!id) {
        setUserVotes(new Set());
        return;
      }

      const { data, error } = await supabase
        .from("votes")
        .select("ending_id")
        .eq("user_id", id);

      if (error) {
        console.error("Erreur chargement votes utilisateur:", error);
        setUserVotes(new Set());
        return;
      }

      setUserVotes(new Set(data.map((v) => v.ending_id)));
    }

    loadUserAndVotes();
  }, []);

  // ─────────────────────────────────────────────
  // 3. Gestion du vote
  // ─────────────────────────────────────────────
  async function handleVote(endingId) {
    if (!work) return;

    // pas connecté
    if (!userId) {
      setVoteError("Vous devez être connecté pour voter.");
      return;
    }

    // déjà voté pour cette fin
    if (userVotes.has(endingId)) {
      setVoteError("Vous avez déjà voté pour cette fin.");
      return;
    }

    setVotingFor(endingId);
    setVoteError("");

    try {
      // 1) enregistre le vote (PK = user_id + ending_id)
      const { error: upsertError } = await supabase
        .from("votes")
        .upsert(
          {
            user_id: userId,
            ending_id: endingId,
          },
          {
            onConflict: "user_id,ending_id",
          }
        );

      if (upsertError) {
        console.error("Supabase vote error:", upsertError);
        throw upsertError;
      }

      // 2) recharge les fins avec le nombre de votes à jour
      const { data: endingsData, error: endingsError } = await supabase
        .from("endings")
        .select(
          `
          id,
          title,
          author_name,
          content,
          created_at,
          votes:votes(count)
        `
        )
        .eq("work_id", work.id)
        .order("created_at", { ascending: true });

      if (endingsError) {
        console.error("Supabase endings reload error:", endingsError);
        throw endingsError;
      }

      const normalized = (endingsData ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        author_name: e.author_name,
        content: e.content,
        created_at: e.created_at,
        votes_count: e.votes?.[0]?.count ?? 0,
      }));

      setEndings(normalized);

      // 3) on marque la fin comme déjà votée côté client
      setUserVotes((prev) => {
        const next = new Set(prev);
        next.add(endingId);
        return next;
      });
    } catch (err) {
      console.error("Erreur lors du vote :", err);
      setVoteError("Impossible d'enregistrer le vote.");
    } finally {
      setVotingFor(null);
    }
  }

  // ─────────────────────────────────────────────
  // 4. Rendu
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-8 py-6">
        <p>Chargement...</p>
      </main>
    );
  }

  if (errorMsg || !work) {
    return (
      <main className="min-h-screen bg-black text-white px-8 py-6">
        <p className="mb-4">{errorMsg || "Œuvre introuvable."}</p>
        <Link
          href="/works"
          className="inline-block px-4 py-2 rounded-md bg-white text-black font-semibold"
        >
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
    <main className="min-h-screen bg-black text-white px-8 py-6">
      <Link
        href="/works"
        className="inline-block mb-4 text-sm text-neutral-300 hover:underline"
      >
        ← Retour aux œuvres
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster + infos de base */}
        <div className="w-full md:w-1/3">
          <div className="relative w-full aspect-[2/3] bg-neutral-800 rounded-md overflow-hidden">
            <Image
              src={posterSrc}
              alt={work.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">{work.title}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {work.year ?? "—"} ·{" "}
            {work.kind === "film" ? "movie" : "serie"} ·{" "}
            {work.genre ?? "—"}
          </p>
          {work.description && (
            <p className="text-sm text-neutral-200 mt-4">
              {work.description}
            </p>
          )}

          <Link
            href={`/works/${work.slug}/submit`}
            className="inline-block mt-6 px-4 py-2 rounded-md border border-white text-sm font-semibold"
          >
            Proposer une fin
          </Link>
        </div>

        {/* Liste des fins */}
        <section className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Fins proposées</h2>

          {endings.length === 0 && (
            <p>Aucune fin n’a encore été proposée.</p>
          )}

          {voteError && (
            <p className="mb-3 text-sm text-red-400">{voteError}</p>
          )}

          <div className="flex flex-col gap-4">
            {endings.map((ending) => {
              const alreadyVoted = userVotes.has(ending.id);

              return (
                <article
                  key={ending.id}
                  className="border border-neutral-700 rounded-md p-4 bg-neutral-900"
                >
                  <h3 className="font-semibold text-lg mb-1">
                    {ending.title || "Fin sans titre"}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-2">
                    Proposée par{" "}
                    <span className="font-medium">
                      {ending.author_name || "Anonyme"}
                    </span>
                    {ending.votes_count != null && (
                      <> — {ending.votes_count} vote(s)</>
                    )}
                  </p>
                  <p className="text-sm whitespace-pre-wrap mb-3">
                    {ending.content}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleVote(ending.id)}
                    disabled={
                      votingFor === ending.id || !userId || alreadyVoted
                    }
                    className="px-3 py-1 rounded-md bg-white text-black text-sm font-semibold disabled:opacity-60"
                  >
                    {alreadyVoted
                      ? "Vous avez déjà voté pour cette fin"
                      : votingFor === ending.id
                      ? "Enregistrement du vote..."
                      : !userId
                      ? "Connectez-vous pour voter"
                      : "Voter pour cette fin"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
