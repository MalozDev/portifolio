"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_SLIDES = [
  { src: "/welcome-image.jpeg", alt: "Stephan Malobeka" },
  {
    src: "/welcome-black-n-white.jpeg",
    alt: "Stephan Malobeka, black and white portrait",
  },
];

const INTERVAL_MS = 4000;

export interface SliderPhoto {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

/**
 * Full-bleed portrait slider for the About page — crossfades between photos.
 * Pass DB photos from the console, or it falls back to the defaults.
 */
export function PhotoSlider({ photos }: { photos?: SliderPhoto[] }) {
  const slides =
    photos && photos.length > 0
      ? photos.map((p) => ({ src: p.url, alt: p.alt }))
      : DEFAULT_SLIDES;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Clamp index during render if the photo list shrinks (React's
  // "adjust state when props change" pattern — no effect needed).
  const [prevLength, setPrevLength] = useState(slides.length);
  if (prevLength !== slides.length) {
    setPrevLength(slides.length);
    if (index >= slides.length) setIndex(0);
  }

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-label="Photo slider"
    >
      <div className="relative aspect-4/5 w-full">
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 40vw"
            className={`object-cover object-top transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Subtle bottom gradient for blending with the site */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* Caption */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="flex size-2">
            <span className="size-2 rounded-full bg-brand" />
          </span>
          <span className="font-mono text-xs text-foreground/90">
            systemCall()
          </span>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute right-4 bottom-4 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-6 bg-brand"
                : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
