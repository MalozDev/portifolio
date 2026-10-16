"use client";

import { Loader2 } from "lucide-react";

/** Small labeled field used across console forms. */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && (
        <span className="ml-2 text-xs text-muted-foreground">{hint}</span>
      )}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/** Primary action button with a loading state. */
export function SubmitButton({
  loading,
  children,
  disabled,
}: {
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim disabled:pointer-events-none disabled:opacity-60"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Error banner for failed operations. */
export function ErrorBanner({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {error}
    </p>
  );
}

/** Success flash banner. */
export function SuccessBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
      {message}
    </p>
  );
}
