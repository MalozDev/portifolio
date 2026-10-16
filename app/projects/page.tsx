import { ArrowUpRight, ExternalLink } from "lucide-react";

import { ProjectCover } from "@/components/project-cover";
import { getPortfolio } from "@/lib/portfolio";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
  description:
    "Live projects by Stephan Malobeka — prospect management, personal finance tracking, corporate sites, marketplaces and AI-powered apps built with React, Node.js and more.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const { projects } = await getPortfolio(await getDb());
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <p className="mb-2 font-mono text-sm text-brand">$ ls ./projects --live</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Selected work — real products built, shipped, and used. From sales
        tooling and finance trackers to local marketplaces and AI-powered
        journaling.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {projects.map((project, i) => (
          <a
            key={project.title}
            href={project.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card animate-fade-in-up transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_40px_oklch(0.88_0.22_150_/_12%)] focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none md:p-8"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <ProjectCover project={project} />
            <span className="pointer-events-none absolute -top-6 -right-4 font-display text-7xl font-bold text-foreground/5 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex items-start justify-between gap-3 p-6 pb-0 md:p-8 md:pb-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold text-balance md:text-xl">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-brand uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <ExternalLink className="size-3" aria-hidden="true" />
                  {project.href?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </p>
              </div>
              <ArrowUpRight
                className="mt-1 size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                aria-hidden="true"
              />
            </div>

            <p className="px-6 pt-4 text-sm leading-relaxed text-muted-foreground md:px-8">
              {project.description}
            </p>

            <div className="mt-auto flex flex-wrap gap-1.5 px-6 pt-5 pb-6 md:px-8 md:pb-8">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {/* More on GitHub */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Want to see more?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Experimentation, open-source contributions, and works in progress live
          on my GitHub.
        </p>
        <a
          href="https://github.com/MalozDev"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim hover:shadow-[0_0_24px_oklch(0.88_0.22_150_/_35%)]"
        >
          Explore GitHub
          <ArrowUpRight className="size-4" />
        </a>
      </section>
    </div>
  );
}
