"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAuthed, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href} className={`mr-4 text-sm ${active ? "underline" : "hover:underline"}`}>
      {children}
    </Link>
  );
};

export default function Nav() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAuthed());
  }, []);

  return (
    <nav className="mt-2 mb-3">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/works">Œuvres</NavLink>
      <NavLink href="/about">About</NavLink>
      <span className="mx-2 text-neutral-600">|</span>

      {!mounted ? null : !authed ? (
        <>
          <NavLink href="/login">Connexion</NavLink>
          <NavLink href="/signup">Inscription</NavLink>
        </>
      ) : (
        <button
          onClick={() => { logout(); router.replace("/login"); }}
          className="text-sm hover:underline"
        >
          Se déconnecter
        </button>
      )}
    </nav>
  );
}
