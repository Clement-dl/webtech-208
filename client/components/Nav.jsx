"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { logout, getCurrentUserRole } from "@/lib/auth";

export default function Nav() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState(null);

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

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive(href)
        ? "text-white bg-[rgba(255,255,255,0.1)]"
        : "text-neutral-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
    }`;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logoaltendings.png"
            alt="Alt-Endings Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-2xl font-extrabold gradient-text">
            Alt-Endings
          </span>
        </div>
        <div className="flex items-center gap-2 glass-light px-4 py-2 rounded-2xl">
          <Link href="/" className={linkClass("/")}>
            Accueil
          </Link>
          <Link href="/works" className={linkClass("/works")}>
            Œuvres
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            À propos
          </Link>

          {role === "user" && (
            <Link href="/mes-fins" className={linkClass("/mes-fins")}>
              Mes fins
            </Link>
          )}

          {role === "admin" && (
            <>
              <Link href="/works/publish" className={linkClass("/works/publish")}>
                Publier
              </Link>
              <Link href="/works/my-works" className={linkClass("/works/my-works")}>
                Mes œuvres
              </Link>
              <Link href="/mes-fins" className={linkClass("/mes-fins")}>
                Mes fins
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {authed ? (
            <button
              onClick={handleLogout}
              className="btn-secondary glow"
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <Link href="/login" className="btn-primary glow">
                Se connecter
              </Link>
              <Link href="/signup" className="btn-secondary glow">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
