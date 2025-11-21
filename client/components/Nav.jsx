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
      const userRole = await getCurrentUserRole();
      if (!mounted) return;
      setRole(userRole);
    }

    refreshAuth();

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

  const linkClass = (href) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");

    return `px-3 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "text-white bg-[rgba(139,92,246,0.2)] rounded-lg"
        : "text-neutral-300 hover:text-white hover:bg-[rgba(139,92,246,0.1)] rounded-lg"
    }`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="w-full glass shadow-md sticky top-0 z-50 backdrop-blur-lg border-b border-[rgba(139,92,246,0.1)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 md:px-4 sm:px-2">
        {/* Logo + liens */}
        <div className="flex items-center gap-8 md:gap-4 sm:gap-2 flex-wrap">
          <Link href="/" className="text-2xl font-extrabold gradient-text">
            Alt-Endings
          </Link>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/" className={linkClass("/")}>
              Accueil
            </Link>
            <Link href="/works" className={linkClass("/works")}>
              Œuvres
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              À propos
            </Link>

            {role === "admin" && (
              <>
                <Link
                  href="/works/publish"
                  className={linkClass("/works/publish")}
                >
                  Publier
                </Link>
                <Link
                  href="/works/my-works"
                  className={linkClass("/works/my-works")}
                >
                  Mes œuvres
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Droite : login / logout */}
        <div className="flex items-center gap-3 md:gap-2 sm:gap-1 flex-wrap text-sm">
          {authed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary glow transition-all duration-300"
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-primary glow transition-all duration-300"
              >
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="btn-secondary glow transition-all duration-300"
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
