"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";

export default function ConsoleLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/console");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-blue-950 via-purple-600 to-indigo-800 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl"
      >
        <h1 className="font-display text-2xl font-bold">{"<console/>"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Portfolio admin — sign in to manage content.
        </p>

        <label className="mt-6 block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="you@example.com"
          />
        </div>

        <label className="mt-4 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim disabled:pointer-events-none disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
