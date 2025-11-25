"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import VoteBox from "@/components/VoteBox";
import Orb from "@/components/Background";

export default async function EndingPage({ params }) {
  const { workId, endingId } = await params;

  const { data: work, error: workError } = await supabase
    .from("works")
    .select("*")
    .eq("id", workId)
    .single();

  const { data: ending, error: endingError } = await supabase
    .from("endings")
    .select("*")
    .eq("id", endingId)
    .single();

  if (workError || endingError || !work || !ending) {
    console.error(workError || endingError);
    return <p>Fin introuvable.</p>;
  }
  return (
    <main className="relative min-h-screen text-[var(--foreground)] px-4 py-6 overflow-auto flex justify-center">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <section className="glass rounded-2xl p-6 shadow-lg max-w-3xl w-full animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-2 gradient-text">{work.title}</h2>
        <div className="text-sm text-neutral-400 mb-4">
          Fin par <span className="font-semibold">{ending.author}</span>
        </div>

        <div className="rounded-lg border border-yellow-600/50 bg-yellow-900/20 p-3 text-sm mb-4 shadow-sm">
          ⚠ Spoilers pour {work.title}
        </div>

        <article className="prose prose-invert max-w-none mb-4">
          <p className="whitespace-pre-line">{ending.content}</p>
        </article>
        <VoteBox endingId={ending.id} initialVotesCount={ending.votes} />

        <div className="mt-6">
          <Link
            href={`/works/${workId}`}
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] underline transition-colors"
          >
            Retour à l œuvre
          </Link>
        </div>
      </section>
    </main>
  );
}
