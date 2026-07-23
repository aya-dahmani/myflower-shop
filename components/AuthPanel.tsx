"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Account created — check your email to confirm, then sign in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <section className="mx-auto max-w-6xl px-6 min-h-screen flex items-center py-8">
      <div className="grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-sm border border-ivy/10 bg-white w-full">
        {/* Left: image panel */}
        <div className="relative hidden md:block bg-blush/50 min-h-140">
          <Image
            src="/images/auth-flowers.jpg"
            alt="Fresh flowers"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ivy/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-display italic text-cream text-2xl leading-snug">
              Every order starts
              <br />
              with fresh stems.
            </p>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Link href="/" className="font-display italic text-2xl mb-8 inline-block w-fit">
            Petal & Stem
          </Link>

          <div className="flex items-center gap-6 mb-5 border-b border-ivy/10">
            <button
              onClick={() => setMode("signin")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                mode === "signin" ? "text-ivy" : "text-ivy/40"
              }`}
            >
              Sign in
              {mode === "signin" && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-burgundy rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                mode === "signup" ? "text-ivy" : "text-ivy/40"
              }`}
            >
              Create account
              {mode === "signup" && (
                <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-burgundy rounded-full" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-fit flex items-center gap-2 border border-ivy/15 rounded-full pl-2.5 pr-4 py-1.5 mb-6 text-xs font-medium text-ivy/80 hover:bg-cream transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            or continue with Google
          </button>

          <h1 className="font-display text-3xl mb-2">
            {mode === "signin" ? (
              <>Welcome <span className="italic text-burgundy">back</span></>
            ) : (
              <>Join <span className="italic text-burgundy">Petal & Stem</span></>
            )}
          </h1>
          <p className="text-ivy/60 text-sm mb-6">
            {mode === "signin"
              ? "Sign in to track orders and manage your account."
              : "Create an account to start shopping or selling."}
          </p>

          {mode === "signup" && (
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  role === "customer"
                    ? "bg-ivy text-cream border-ivy"
                    : "border-ivy/20 text-ivy/70 hover:border-ivy/40"
                }`}
              >
                I&apos;m a customer
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                  role === "seller"
                    ? "bg-ivy text-cream border-ivy"
                    : "border-ivy/20 text-ivy/70 hover:border-ivy/40"
                }`}
              >
                I&apos;m a seller
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}
          {message && (
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs text-ivy/60 mb-1.5 block">Full name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-ivy/60 mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-ivy/60 mb-1.5 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-burgundy text-cream py-3.5 rounded-full text-sm font-medium hover:bg-ivy transition-colors mt-2 disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-xs text-ivy/50 mt-6 text-center">
            {mode === "signin" ? (
              <>Don&apos;t have an account?{" "}
                <button onClick={() => setMode("signup")} className="text-burgundy underline underline-offset-4">
                  Create one
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-burgundy underline underline-offset-4">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}