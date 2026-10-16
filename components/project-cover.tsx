import Image from "next/image";

import type { Project } from "@/lib/data";

/**
 * Cover art for a project card. If the project has a real screenshot
 * (`project.image`), it is shown; otherwise unique generative artwork is
 * rendered from the project's accent colors and pattern.
 */
export function ProjectCover({ project }: { project: Project }) {
  const [a, b] = project.accent;

  if (project.image) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-background">
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden border-b border-border"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 180"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`g-${slug(project.title)}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} stopOpacity="0.22" />
            <stop offset="100%" stopColor={b} stopOpacity="0.06" />
          </linearGradient>
          <pattern
            id={`p-${slug(project.title)}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            {project.pattern === "dots" && (
              <circle cx="2" cy="2" r="1.2" fill={a} opacity="0.35" />
            )}
            {project.pattern === "grid" && (
              <>
                <path d="M20 0H0V20" fill="none" stroke={a} strokeWidth="0.5" opacity="0.3" />
              </>
            )}
            {project.pattern === "waves" && (
              <path
                d="M0 10 Q5 4 10 10 T20 10"
                fill="none"
                stroke={a}
                strokeWidth="0.8"
                opacity="0.3"
              />
            )}
            {project.pattern === "circles" && (
              <circle cx="10" cy="10" r="6" fill="none" stroke={a} strokeWidth="0.6" opacity="0.3" />
            )}
          </pattern>
        </defs>

        <rect width="320" height="180" fill="#0b0e14" />
        <rect width="320" height="180" fill={`url(#g-${slug(project.title)})`} />
        <rect width="320" height="180" fill={`url(#p-${slug(project.title)})`} />

        {/* Diagonal accent beam */}
        <polygon points="0,180 120,0 170,0 50,180" fill={a} opacity="0.08" />
        <polygon points="180,180 300,0 320,0 320,60 250,180" fill={b} opacity="0.07" />

        {/* Initials monogram */}
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="64"
          fontWeight="800"
          fill={a}
          opacity="0.9"
          fontFamily="var(--font-oxanium), sans-serif"
        >
          {initials(project.title)}
        </text>

        {/* Corner brackets */}
        <path d="M16 32V16H32" fill="none" stroke={a} strokeWidth="2" opacity="0.6" />
        <path d="M304 148V164H288" fill="none" stroke={b} strokeWidth="2" opacity="0.6" />
      </svg>
    </div>
  );
}

function slug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24);
}

function initials(title: string) {
  const words = title.replace(/[—–-]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return title.slice(0, 2).toUpperCase();
}
