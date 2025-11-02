"use client";
import { useEffect, useState } from "react";

// anti multi-vote local (remplacé plus tard par contrainte Supabase)
function alreadyVoted(endingId) {
  if (typeof window === "undefined") return false;
  const voted = JSON.parse(localStorage.getItem("alt_endings_votes") || "[]");
  return voted.includes(endingId);
}
function markVoted(endingId) {
  const key = "alt_endings_votes";
  const voted = JSON.parse(localStorage.getItem(key) || "[]");
  if (!voted.includes(endingId)) {
    voted.push(endingId);
    localStorage.setItem(key, JSON.stringify(voted));
  }
}

export default function VoteBox({ endingId, initialVotes }) {
  const [votes, setVotes] = useState(initialVotes);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setLocked(alreadyVoted(endingId));
  }, [endingId]);

  const vote = () => {
    if (locked) return;
    setVotes((v) => v + 1);
    setLocked(true);
    markVoted(endingId);
    // TODO: POST /api/votes => Supabase
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        onClick={vote}
        disabled={locked}
        className="bg-white text-black border rounded px-3 py-1 text-sm disabled:opacity-50"
        title={locked ? "Vous avez déjà voté pour cette fin" : "Ajouter 1 vote"}
      >
        +1 vote
      </button>
      <span className="text-sm text-neutral-300">★ {votes}</span>
    </div>
  );
}
