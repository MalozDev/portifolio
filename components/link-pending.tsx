"use client";

import { useLinkStatus } from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";

/**
 * Inline pending feedback for Next.js <Link> navigations.
 * These must be rendered as descendants of the Link (per useLinkStatus).
 * All indicators are fixed-size swaps so there is no layout shift.
 */

/** Label that pulses while its link's navigation is in flight. */
export function PendingLabel({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span className={pending ? "inline-flex animate-pulse" : "inline-flex"}>
      {children}
    </span>
  );
}

/** Swaps the trailing arrow for a spinner while navigating. */
export function PendingArrow({
  icon = "arrow",
}: {
  icon?: "arrow" | "arrow-up";
}) {
  const { pending } = useLinkStatus();
  if (pending) {
    return <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />;
  }
  return icon === "arrow-up" ? (
    <ArrowUpRight
      className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  ) : (
    <ArrowRight
      className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  );
}
