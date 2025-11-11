"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthed, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Nav() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  // 1) éviter l’erreur d’hydratation : on ne rend rien tant qu’on n’est pas monté
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2) à chaque changement de page, on relit le statut d’auth
  useEffect(() => {
    if (!mounted) return;
    setAuthed(isAuthed());
  }, [pathname, mounted]);

  const linkClass = (href) =>
    `px-3 py-2 text-sm font-semibold ${
      pathname === href
        ? "text-white"
        : "text-neutral-300 hover:text-white"
    }`;

  const handleLogout = async () => {
    await logout();
    setAuthed(false);
    window.location.href = "/login";
  };

  if (!mounted) {
    // même HTML côté serveur et client → pas d’erreur d’hydratation
    return null;
  }

  return (
    <nav className="w-full border-b border-neutral-800 bg-black text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo + liens de gauche */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Alt-Endings
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className={linkClass("/")}>
              Alt-Endings
            </Link>
            <Link href="/works" className={linkClass("/works")}>
              Œuvres
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>
          </div>
        </div>

        {/* Liens de droite : login / logout / inscription */}
        <div className="flex items-center gap-4 text-sm">
          {authed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1 rounded-md border border-white hover:bg-white hover:text-black font-semibold"
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1 rounded-md border border-white hover:bg-white hover:text-black font-semibold"
              >
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1 rounded-md border border-neutral-500 text-neutral-300 hover:border-white hover:text-white font-semibold"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
