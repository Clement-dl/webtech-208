"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logout, getCurrentUserRole } from "@/lib/auth";

export default function Nav() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState(null); // "user" | "admin" | null

  useEffect(() => {
    let mounted = true;

    async function refreshAuth() {
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !data?.user) {
        setAuthed(false);
        setRole(null);
        return;
      }

      setAuthed(true);

      // va lire profiles.role (helper défini dans lib/auth.js)
      const userRole = await getCurrentUserRole();
      if (!mounted) return;
      setRole(userRole);
    }

    refreshAuth();

    // se met à jour quand on se connecte / déconnecte
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setAuthed(false);
        setRole(null);
      } else {
        setAuthed(true);
        const userRole = await getCurrentUserRole();
        if (!mounted) return;
        setRole(userRole);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const linkClass = (href) =>
    `px-3 py-2 text-sm font-semibold ${
      pathname === href
        ? "text-white"
        : "text-neutral-300 hover:text-white"
    }`;

  const handleLogout = async () => {
    await logout();
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
            {role === "admin" && (
              <Link
                href="/works/publish"
                className={linkClass("/works/publish")}
              >
                Publier une œuvre
              </Link>
            )}
          </div>
        </div>

        {/* Droite : login / logout */}
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
