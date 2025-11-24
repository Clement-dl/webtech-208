"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import Carrousel from "@/components/Carousel";
import Orb from "@/components/Background";

export default function HomePage() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getCurrentUserId().then(setUserId);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center pt-16 overflow-hidden">
      
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <section className="glass p-8 md:p-6 sm:p-4 rounded-3xl shadow-lg flex flex-col items-center text-center animate-fade-in-up max-w-3xl">

        <h1 className="text-4xl md:text-3xl sm:text-2xl font-extrabold gradient-text mb-4">
          Alt-Endings
        </h1>

        <p className="text-md md:text-sm sm:text-sm text-neutral-300 mb-6">
          Réécris la fin. Vote pour la meilleure. Choisis une œuvre culte, propose ta fin alternative et découvre celles des autres.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-4">
          <Link href="/works" className="btn-primary">Voir les œuvres</Link>

          {userId ? (
            <Link href="/works" className="btn-secondary">Proposer une fin</Link>
          ) : (
            <button
              type="button"
              disabled
              className="btn-secondary bg-gray-800 border-gray-700 text-neutral-400 cursor-not-allowed disabled:opacity-60"
            >
              Proposer une fin
            </button>
          )}
        </div>

        <p className="text-xs text-neutral-400">
          Merci de marquer clairement vos spoilers et de rester respectueux.
        </p>

      </section>

      <Carrousel />
    </main>
  );
}
