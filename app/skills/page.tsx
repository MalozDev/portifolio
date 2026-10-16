import { getPortfolio, staticSkillGroups } from "@/lib/portfolio";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Skills",
  description:
    "Technical skills of Stephan Malobeka — JavaScript, React, Node.js, PostgreSQL, MongoDB, computer networks, telecommunications and cloud technologies.",
  alternates: { canonical: "/skills" },
};

export default async function SkillsPage() {
  const { content } = await getPortfolio(await getDb());
  const skillGroups = staticSkillGroups;
  const competencies = content.competencies;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <p className="mb-2 font-mono text-sm text-brand">$ cat skills.json</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Technical skills
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A snapshot of the technologies and tools I work with across full-stack
        development, systems engineering, and telecommunications.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {skillGroups.map((group, gi) => (
          <section
            key={group.label}
            className="rounded-2xl border border-border bg-card p-6 animate-fade-in-up"
            style={{ animationDelay: `${gi * 0.08}s` }}
          >
            <h2 className="font-display text-base font-semibold text-brand">
              {group.label}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Core competencies */}
      <section className="mt-16">
        <p className="mb-2 font-mono text-sm text-brand">{"// core competencies"}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          What I bring to a team
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {competencies.map((c) => (
            <span
              key={c}
              className="rounded-full border border-brand/25 bg-brand/10 px-4 py-2 text-sm font-medium text-brand"
            >
              {c}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
