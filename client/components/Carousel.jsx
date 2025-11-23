"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Carousel() {
  const [works, setWorks] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

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
  useEffect(() => {
    if (paused || works.length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % works.length);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [works.length, paused]);

  const next = () => setIndex((i) => (i + 1) % works.length);
  const prev = () => setIndex((i) => (i - 1 + works.length) % works.length);

  if (works.length === 0) {
    return <p className="text-neutral-400 text-center mt-8">Chargement...</p>;
  }

  const getVisibleWorks = () => {
    const prevIndex = (index - 1 + works.length) % works.length;
    const nextIndex = (index + 1) % works.length;
    return [works[prevIndex], works[index], works[nextIndex]];
  };

  const visibleWorks = getVisibleWorks();

  return (
    <div
      className="relative w-full max-w-5xl mx-auto mt-16 mb-10 flex items-center justify-center gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {visibleWorks.map((work, i) => {
        const isCenter = i === 1;

        return (
          <div
            key={work.id}
            className={`card card-shine flex flex-col w-[220px] md:w-[280px] transition-transform ${
              isCenter ? "scale-100 shadow-2xl" : "scale-90 opacity-60"
            }`}
          >
            <Link href={`/works/${work.slug}`} className="flex-1">
              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                <Image
                  src={work.poster_path?.trim() || "/posters/placeholder.svg"}
                  alt={work.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              <p className="mt-3 text-center text-sm md:text-base font-semibold text-foreground">
                {work.title}
              </p>
            </Link>
          </div>
        );
      })}

      <button
        onClick={prev}
        className="
            absolute left-4 top-1/2 -translate-y-1/2 
            w-12 h-12 flex items-center justify-center 
            rounded-full glass-light glow
            text-white text-xl font-bold
            hover:bg-[var(--primary)]/30 transition-all duration-300
        "
        >
        ←
      </button>
      <button
        onClick={next}
        className="
            absolute right-4 top-1/2 -translate-y-1/2 
            w-12 h-12 flex items-center justify-center 
            rounded-full glass-light glow
            text-white text-xl font-bold
            hover:bg-[var(--primary)]/30 transition-all duration-300
        "
        >
        →
        </button>
    </div>
  );
}
