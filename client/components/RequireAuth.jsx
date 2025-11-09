"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Pour l'instant isAuthed() renvoie toujours true,
    // mais la structure est prête pour une vraie auth plus tard.
    if (!isAuthed()) {
      router.push("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return null; // écran vide pendant la "vérification"
  }

  return children;
}
