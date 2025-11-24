"use client";

import Orb from "@/components/Background";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-hidden">
      
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      <div className="flex flex-col items-center justify-start flex-1 pt-10">
        <section className="glass p-8 md:p-6 sm:p-4 rounded-3xl shadow-lg max-w-3xl animate-fade-in-up text-center -translate-y-24">
          <h2 className="text-3xl font-bold gradient-text mb-4 md:text-2xl sm:text-xl">
            À propos
          </h2>
          <p className="text-neutral-300 text-lg md:text-base sm:text-sm leading-relaxed">
            Alt-Endings est un espace participatif pour imaginer des fins
            alternatives à des œuvres cultes. Version MVP sans base de données
            pour le moment. Prochaine étape : Supabase + RLS.
          </p>
        </section>
      </div>
    </main>
  );
}
