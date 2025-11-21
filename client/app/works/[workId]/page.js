"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";
import VoteBox from "@/components/VoteBox";

export default function WorkPage() {
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [endings, setEndings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [votingFor, setVotingFor] = useState(null);
  const [voteError, setVoteError] = useState("");
  const [userId, setUserId] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());

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

    if (workId) loadWork();
  }, [workId]);

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

  async function handleVote(endingId) {
    if (!work || !userId) {
      setVoteError("Vous devez être connecté pour voter.");
      return;
    }

    if (userVotes.has(endingId)) {
      setVoteError("Vous avez déjà voté pour cette fin.");
      return;
    }

    setVotingFor(endingId);
    setVoteError("");

    try {
      const { error: upsertError } = await supabase
        .from("votes")
        .upsert(
          { user_id: userId, ending_id: endingId },
          { onConflict: "user_id,ending_id" }
        );

      if (upsertError) throw upsertError;

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

      if (endingsError) throw endingsError;

      const normalized = (endingsData ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        author_name: e.author_name,
        content: e.content,
        created_at: e.created_at,
        votes_count: e.votes?.[0]?.count ?? 0,
      }));

      setEndings(normalized);
      setUserVotes((prev) => new Set(prev).add(endingId));
    } catch (err) {
      console.error("Erreur lors du vote :", err);
      setVoteError("Impossible d'enregistrer le vote.");
    } finally {
      setVotingFor(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
        <p>Chargement...</p>
      </main>
    );
  }

  if (errorMsg || !work) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center px-4">
        <p className="mb-4">{errorMsg || "Œuvre introuvable."}</p>
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
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] px-4 py-6">
      <Link
        href="/works"
        className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] underline mb-4 inline-block"
      >
        ← Retour aux œuvres
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster + infos */}
        <div className="w-full md:w-1/3 glass p-4 rounded-xl shadow-md">
          <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden">
            <Image
              src={posterSrc}
              alt={work.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <h1 className="text-2xl font-bold mt-4">{work.title}</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {work.year ?? "—"} · {work.kind === "film" ? "movie" : "serie"} ·{" "}
            {work.genre ?? "—"}
          </p>
          {work.description && (
            <p className="text-sm text-neutral-200 mt-4">{work.description}</p>
          )}
          <Link
            href={`/works/${work.slug}/submit`}
            className="btn-primary mt-6 w-full text-center"
          >
            Proposer une fin
          </Link>
        </div>

        {/* Liste des fins */}
        <section className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4">Fins proposées</h2>
          {endings.length === 0 && (
            <p className="text-sm text-neutral-400">Aucune fin n’a encore été proposée.</p>
          )}
          {voteError && (
            <p className="text-sm text-red-400 mb-2">{voteError}</p>
          )}
          {endings.map((ending) => (
            <article
              key={ending.id}
              className="glass p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-1">
                {ending.title || "Fin sans titre"}
              </h3>
              <p className="text-sm text-neutral-400 mb-2">
                Proposée par{" "}
                <span className="font-medium">{ending.author_name || "Anonyme"}</span> —{" "}
                {ending.votes_count} vote{ending.votes_count !== 1 ? "s" : ""}
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
