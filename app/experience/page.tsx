import Link from "next/link";
import { ArrowUpRight, Briefcase } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { experienceDuration, formatExperiencePeriod, getPortfolio } from "@/lib/portfolio";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Experience",
  description:
    "Work experience of Stephan Malobeka — telecommunications engineering, broadband deployment, and full-stack software development.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const { experiences, contact } = await getPortfolio(getDb());

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <p className="mb-2 font-mono text-sm text-brand">$ cat ./experience --work</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Job Experience
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Professional roles across telecommunications engineering, broadband
        deployment, and software development.
      </p>

      <div className="relative mt-12 space-y-4 border-l border-border pl-6 sm:pl-8">
        {experiences.map((job, i) => (
          <Reveal key={`${job.role}-${job.company}`} delay={i * 120}>
            <article className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <span
                className="absolute top-7 -left-[1.87rem] size-3 rounded-full border-2 border-background bg-brand sm:-left-[2.4rem]"
                aria-hidden="true"
              />
              {job.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.image}
                  alt={`${job.role} at ${job.company}`}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-muted/40 text-muted-foreground">
                  <div className="text-center">
                    <Briefcase className="mx-auto size-6" aria-hidden="true" />
                    <p className="mt-2 text-xs">Workplace photo coming soon</p>
                  </div>
                </div>
              )}
              <div className="p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-display text-lg font-semibold">{job.role}</h2>
                {formatExperiencePeriod(job) && (
                  <span className="font-mono text-xs text-brand">
                    {formatExperiencePeriod(job)}
                  </span>
                )}
                {experienceDuration(job) && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {experienceDuration(job)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
              <ul className="mt-4 space-y-2">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              {job.highlight && (
                <p className="mt-4 rounded-xl border border-brand/30 bg-brand/10 p-3 text-sm font-medium text-brand">
                  {job.highlight}
                </p>
              )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {experiences.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No experience entries yet.
        </p>
      )}

      <section className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
        <Briefcase className="mx-auto size-5 text-brand" aria-hidden="true" />
        <h2 className="mt-3 font-display text-xl font-bold sm:text-2xl">
          Full CV & detailed history
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Academic records, transcripts, and a complete résumé are available in
          my CV.
        </p>
        <Link
          href={contact.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim hover:shadow-[0_0_24px_oklch(0.88_0.22_150_/_35%)]"
        >
          Open CV
          <ArrowUpRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
