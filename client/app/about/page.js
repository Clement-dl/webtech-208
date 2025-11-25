"use client";

import Orb from "@/components/Background";

export default function AboutPage() {
  const teamMembers = [
    "Omar El Alami El Fellousse",
    "Clément D'Alberto",
    "Luc Bernard Fernand BANAG LIBITE"
  ];
  return (
    // Structure principale de la page
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-hidden px-4 py-10">
      {/* Fond anime */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      {/* Conteneur principal */}
      <div className="flex flex-col items-center justify-start flex-1 gap-8">
        {/* Section présentation du projet */}
        <section className="glass p-8 md:p-6 sm:p-4 rounded-3xl shadow-lg max-w-3xl animate-fade-in-up text-center -translate-y-24">
          {/* Titre */}
          <h2 className="text-3xl font-bold gradient-text mb-6 md:text-2xl sm:text-xl">
            A propos d Alt-Endings
          </h2>
          {/* Texte d'introduction */}
          <p className="text-neutral-300 text-lg md:text-base sm:text-sm leading-relaxed mb-4">
            Alt-Endings est une plateforme interactive dédiée à la créativité et à
            l imagination des fans. Ici, vous pouvez réécrire ou proposer des fins
            alternatives pour vos films, séries ou œuvres préférées, donnant vie
            à vos idées et explorant des scénarios que vous auriez aimé voir.
          </p>
          {/* Description du MVP et des futures fonctionnalités */}
          <p className="text-neutral-300 text-lg md:text-base sm:text-sm leading-relaxed mb-4">
            Le projet est en version MVP : il permet de découvrir et publier des fins
            alternatives dans un espace simple et immersif. Les prochaines étapes
            incluent l intégration d une base de données Supabase avec des règles
            RLS, un système de votes pour mettre en avant les meilleures fins,
            et la possibilité de suivre vos œuvres favorites et leurs contributeurs.
          </p>
          {/* Vision globale du projet */}
          <p className="text-neutral-300 text-lg md:text-base sm:text-sm leading-relaxed">
            Notre objectif est de créer une communauté dynamique où les fans
            peuvent échanger, partager leurs idées et célébrer leur passion pour
            les histoires qui les inspirent. Chaque fin proposée est une
            contribution à un univers alternatif où votre imagination est la seule
            limite.
          </p>
        </section>
        <section className="glass p-6 md:p-4 sm:p-3 rounded-3xl shadow-lg max-w-3xl animate-fade-in-up text-center">
          <h3 className="text-2xl font-bold gradient-text mb-4 md:text-xl sm:text-lg">
            L equipe derrière Alt-Endings
          </h3>
          <ul className="flex flex-col gap-2 text-neutral-300 text-lg md:text-base sm:text-sm">
            {teamMembers.map((member) => (
              <li key={member} className="py-1 px-2 bg-white/10 rounded-lg">
                {member}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
