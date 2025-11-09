"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthed, logout } from "@/lib/auth";

export default function Nav() {
  const pathname = usePathname();
  const authed = isAuthed();

  const linkClass = (href) =>
    `px-3 py-2 text-sm font-semibold ${
      pathname === href
        ? "text-white"
        : "text-neutral-300 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    // on renvoie vers la page de connexion
    window.location.href = "/login";
  };

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
