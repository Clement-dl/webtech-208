"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth";
import Orb from "@/components/Background";

export default function LoginPage() {
  const router = useRouter();

  // États pour stocker les valeurs du formulaire et l'état de chargement
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fonction appelée lorsqu'on tente de se connecter
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");    
    setLoading(true); 

    const { user, error } = await login({ email, password });

    // Si erreur ou utilisateur non trouvé
    if (error || !user) {
      console.error(error);
      setErrorMsg(error?.message ?? "Erreur pendant la connexion.");
      setLoading(false);
      return;
    }

    // Si connexion réussie, redirection vers la page des œuvres
    setLoading(false);
    router.push("/works");
    router.refresh();
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden">

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
      <div className="flex flex-col items-center justify-start flex-1 w-full">
        <section className="glass w-full max-w-md rounded-2xl p-8 shadow-lg animate-fade-in-up -translate-y-32">
          <h1 className="text-2xl font-bold text-center mb-6 gradient-text">
            Se connecter
          </h1>

          {/* Formulaire de connexion */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
              />
            </div>
            {/* mot de passe */}
            <div>
              <label className="block text-sm mb-1">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}
            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
