"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Carrousel() {
  const [works, setWorks] = useState([]);
  const [index, setIndex] = useState(0);

  const intervalRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Charger les œuvres
  useEffect(() => {
    async function loadWorks() {
      const { data, error } = await supabase
        .from("works")
        .select("id, slug, title, poster_path")
        .order("title", { ascending: true });

      if (error) {
        console.error("Erreur Supabase (carrousel):", error);
        return;
      }

      setWorks(data ?? []);
    }

    loadWorks();
  }, []);

  // Autoplay
  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % works.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [works.length, paused]);

  const next = () => {
    setIndex((i) => (i + 1) % works.length);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + works.length) % works.length);
  };

  if (works.length === 0) {
    return <p className="text-neutral-400">Chargement...</p>;
  }

  const work = works[index];
  const posterSrc = work.poster_path?.trim() || "/posters/placeholder.svg";

  return (
    <div
      className="relative w-full max-w-4xl mx-auto mt-16 mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Affiche */}
      <Link href={`/works/${work.slug}`}>
        <div className="relative mx-auto h-[480px] w-[320px] sm:h-[540px] sm:w-[360px] md:h-[620px] md:w-[410px] 
                        rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer">
          <Image
            src={posterSrc}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 300px, 400px"
          />
        </div>
      </Link>

      {/* Boutons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-xl text-white hover:bg-black/80"
      >
        ←
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-xl text-white hover:bg-black/80"
      >
        →
      </button>

      {/* Titre */}
      <p className="text-center text-neutral-300 mt-4 text-lg font-medium">
        {work.title}
      </p>
    </div>
  );
}
