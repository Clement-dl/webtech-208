export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center py-20">
      <section className="glass p-10 md:p-8 sm:p-6 rounded-3xl shadow-lg max-w-3xl animate-fade-in-up">
        <h2 className="text-3xl font-bold gradient-text mb-4 md:text-2xl sm:text-xl">
          À propos
        </h2>
        <p className="text-neutral-300 text-lg md:text-base sm:text-sm leading-relaxed">
          Alt-Endings est un espace participatif pour imaginer des fins
          alternatives à des œuvres cultes. Version MVP sans base de données
          pour le moment. Prochaine étape : Supabase + RLS.
        </p>
      </section>
    </main>
  );
}
