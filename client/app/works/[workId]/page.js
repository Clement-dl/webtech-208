import Link from "next/link";
import Poster from "@/components/Poster";
import { WORKS, ENDINGS } from "@/lib/fakeDb";

export default async function WorkPage({ params }) {
  const { workId } = await params;    

  const work = WORKS.find((w) => w.id === workId);
  const endings = ENDINGS
    .filter((e) => e.workId === workId)
    .sort((a, b) => b.votes - a.votes);

  if (!work) return <p>Œuvre introuvable.</p>;

  return (
    <section>
      <div className="flex items-start gap-4 mb-4">
        <Poster workId={workId} alt={work.title} className="rounded" width={120} height={180} />
        <div>
          <h2 className="text-xl font-semibold mb-1">{work.title}</h2>
          <div className="text-sm text-neutral-400 mb-3">{work.year} · {work.type}</div>

          <Link
            href={`/works/${workId}/submit`}
            className="inline-block mb-2 bg-white text-black border rounded px-4 py-2 text-sm"
          >
            Proposer une fin
          </Link>
        </div>
      </div>

      {endings.length === 0 ? (
        <p className="text-neutral-300">Aucune fin proposée pour le moment.</p>
      ) : (
        <ul className="space-y-3">
          {endings.map((e) => (
            <li key={e.id} className="border border-neutral-800 rounded p-3">
              <div className="font-medium">par {e.author}</div>
              <div className="text-sm text-neutral-300 line-clamp-2">{e.content}</div>
              <div className="text-sm text-neutral-400 mt-1">★ {e.votes} votes</div>
              <Link href={`/works/${workId}/endings/${e.id}`} className="inline-block mt-2 underline text-sm">
                Lire la fin
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
