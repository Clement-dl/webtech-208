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
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="glass p-6 rounded-2xl flex flex-col items-center animate-fade-in-up shadow-lg">
          <div className="w-12 h-12 border-4 border-[rgba(139,92,246,0.2)] border-t-[var(--accent)] rounded-full animate-spin mb-4"></div>
          <span className="text-sm text-neutral-300">Vérification en cours...</span>
        </div>
      </div>
    );
  }

  return children;
}
