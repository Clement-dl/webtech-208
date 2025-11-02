import Link from "next/link";
import { WORKS, ENDINGS } from "@/lib/fakeDb";
import VoteBox from "@/components/VoteBox"; // client component

export default async function EndingPage({ params }) {
  const { workId, endingId } = await params;   
  const work = WORKS.find((w) => w.id === workId);
  const e    = ENDINGS.find((x) => x.id === endingId);
  if (!work || !e) return <p>Fin introuvable.</p>;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">{work.title}</h2>
      <div className="text-sm text-neutral-400 mb-4">Fin par {e.author}</div>

      <div className="rounded border border-yellow-600/50 bg-yellow-900/20 p-3 text-sm mb-3">
        ⚠ Spoilers pour {work.title}
      </div>

      <article className="prose prose-invert max-w-none">
        <p className="whitespace-pre-line">{e.content}</p>
      </article>

      <VoteBox endingId={e.id} initialVotes={e.votes} />

      <div className="mt-6">
        <Link href={`/works/${workId}`} className="underline text-sm">← Retour à l’œuvre</Link>
      </div>
    </section>
  );
}
