"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserId } from "@/lib/auth";

/**
 * Props possibles :
 *  - endingId : id de la fin
 *  - votesCount OU initialVotesCount : nombre de votes au chargement
 *
 * Utilisation typique dans la page de l’œuvre :
 *   <VoteBox endingId={ending.id} votesCount={ending.votes_count} />
 */
export default function VoteBox({
  endingId,
  votesCount,
  initialVotesCount,
}) {
  const [userId, setUserId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [localVotes, setLocalVotes] = useState(
    votesCount ?? initialVotesCount ?? 0
  );

  // --- Récupérer l'utilisateur + savoir s'il a déjà voté ---
  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);

      const id = await getCurrentUserId().catch(() => null);
      if (!mounted) return;

      if (!id) {
        setUserId(null);
        setHasVoted(false);
        setLoading(false);
        return;
      }

      setUserId(id);

      // Chercher si un vote existe déjà pour (user_id, ending_id)
      const { data, error } = await supabase
        .from("votes")
        .select("user_id")
        .eq("ending_id", endingId)
        .eq("user_id", id);

      if (!mounted) return;

      if (error) {
        console.error("Erreur lecture votes :", error);
        setHasVoted(false);
      } else {
        setHasVoted(data && data.length > 0);
      }

      setLoading(false);
    }

    init();

    return () => {
      mounted = false;
    };
  }, [endingId]);

  // --- Gestion du clic : voter / supprimer son vote ---
  const handleClick = async () => {
    if (!userId) {
      // Bouton déjà désactivé si non connecté
      return;
    }

    setSaving(true);

    try {
      if (!hasVoted) {
        // ➕ L'utilisateur vote
        const { error: insertError } = await supabase.from("votes").insert({
          user_id: userId,
          ending_id: endingId,
        });

        if (insertError) {
          console.error("Erreur insert vote :", insertError);
          alert("Impossible d'enregistrer votre vote.");
        } else {
          // Mise à jour du compteur dans endings (simple mais suffisant ici)
          const newCount = localVotes + 1;
          setLocalVotes(newCount);

          await supabase
            .from("endings")
            .update({ votes_count: newCount })
            .eq("id", endingId);

          setHasVoted(true);
        }
      } else {
        // ❌ L'utilisateur supprime son vote
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", userId)
          .eq("ending_id", endingId);

        if (deleteError) {
          console.error("Erreur delete vote :", deleteError);
          alert("Impossible de supprimer votre vote.");
        } else {
          const newCount = Math.max(0, localVotes - 1);
          setLocalVotes(newCount);

          await supabase
            .from("endings")
            .update({ votes_count: newCount })
            .eq("id", endingId);

          setHasVoted(false);
        }
      }
    } finally {
      setSaving(false);
    }
  };

 const baseText = hasVoted
    ? "Supprimer mon vote"
    : "Voter pour cette fin";

  const buttonLabel = !userId
    ? "Vous devez vous connecter"
    : saving
    ? "En cours..."
    : baseText;

  const isDisabled = loading || saving || !userId;

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <span className="text-sm text-neutral-400">
        {localVotes} vote{localVotes > 1 ? "s" : ""}
      </span>

      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`px-4 py-2 rounded-md text-sm font-semibold border disabled:opacity-60 disabled:cursor-not-allowed
          ${
            !userId
              ? "bg-neutral-700 border-neutral-700 text-neutral-300"
              : hasVoted
              ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
              : "bg-white border-white text-black hover:bg-neutral-200"
          }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}