import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading fallback. Shows instantly (after a 150ms debounce so
 * fast navigations never flash) whenever a page is navigating or streaming,
 * giving immediate feedback that the interaction is underway.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20 animate-fade-in-up [animation-delay:150ms] [animation-fill-mode:backwards]"
    >
      <span className="sr-only">Loading page…</span>

      <Skeleton className="h-4 w-44" />
      <Skeleton className="mt-4 h-9 w-64 sm:h-11 sm:w-80" />
      <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-lg" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
