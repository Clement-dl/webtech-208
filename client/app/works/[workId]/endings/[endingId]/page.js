import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import VoteBox from "@/components/VoteBox";

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
    <section className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-2">{work.title}</h2>
      <div className="text-sm text-neutral-400 mb-4">
        Fin par {ending.author}
      </div>

      <div className="rounded border border-yellow-600/50 bg-yellow-900/20 p-3 text-sm mb-3">
        ⚠ Spoilers pour {work.title}
      </div>

      <article className="prose prose-invert max-w-none">
        <p className="whitespace-pre-line">{ending.content}</p>
      </article>

      {/* Vote (toujours localStorage pour l’instant) */}
      <VoteBox endingId={ending.id} initialVotes={ending.votes} />

      <div className="mt-6">
        <Link href={`/works/${workId}`} className="underline text-sm">
          ← Retour à l’œuvre
        </Link>
      </div>
    </section>
  );
}
