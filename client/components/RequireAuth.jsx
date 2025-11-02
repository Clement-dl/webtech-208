"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // pages publiques autorisées sans login
    // pour le moment avant d'inclure la bdd sur notre projet 
    const publicPaths = ["/login", "/signup"];
    if (!isAuthed() && !publicPaths.includes(pathname)) {
      router.replace("/login");
    }
  }, [router, pathname]);

  return children;
}
