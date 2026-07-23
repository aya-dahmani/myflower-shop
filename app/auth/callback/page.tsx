"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Le client Supabase détecte automatiquement le token dans l'URL
    // et crée la session. On attend juste que ce soit fait.
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/");
      }
    });

    // Filet de sécurité : si après 2 secondes rien ne s'est passé,
    // on vérifie manuellement la session et on redirige quand même.
    const timeout = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      router.replace(data.session ? "/" : "/login?error=auth-failed");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="text-ivy/60 text-sm">Signing you in...</p>
    </div>
  );
}