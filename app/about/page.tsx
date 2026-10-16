import Link from "next/link";
import {
  Award,
  Download,
  Languages,
  Mail,
  MapPin,
  Phone,
  Trophy,
  Users,
} from "lucide-react";

import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/social-icons";
import { PhotoSlider } from "@/components/photo-slider";
import { Terminal } from "@/components/terminal";
import { Reveal } from "@/components/reveal";
import { contact } from "@/lib/data";
import { getPortfolio } from "@/lib/portfolio";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "About Stephan Malobeka — Computer Systems Engineering graduate (UNZA) from Ndola, Zambia with experience in telecommunications, full-stack JavaScript development, networking and IoT.",
  alternates: { canonical: "/about" },
};

const experience = [
  {
    role: "Home Broadband ODU Installer",
    company: "Telecommunications Operator (Confidential)",
    period: "2025 — Present",
    points: [
      "Install and commission outdoor unit broadband systems.",
      "Site surveys, signal optimization, and network troubleshooting.",
      "Configure customer equipment and validate connectivity end-to-end.",
    ],
    highlight:
      "🏆 Mukali Award — top-performing installer of the quarter.",
  },
  {
    role: "Telecommunications Engineering Intern",
    company: "Baicells Technologies",
    period: "Internship",
    points: [
      "Supported engineers on the Zedmobile Core Network.",
      "Assisted core network monitoring and incident resolution.",
      "Infrastructure maintenance alongside senior network engineers.",
    ],
  },
];

export default async function AboutPage() {
  const { photos, content, contact: portfolioContact } = await getPortfolio(await getDb());
  const learningPath = content.journey;
  const leadership = content.leadership;
  const languages = content.languages;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      {/* Hero: intro + terminal */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-sm text-brand">$ whoami</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Hey, I&apos;m{" "}
            <span className="text-brand">Steph</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <code className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-sm text-brand">
              systemCall()
            </code>{" "}
            {content.about.intro.join(" ")}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-brand" aria-hidden="true" />
              {contact.location}
            </span>
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <Phone className="size-3.5 text-brand" aria-hidden="true" />
              {contact.phone}
            </a>
            <a
              href={contact.emailHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <Mail className="size-3.5 text-brand" aria-hidden="true" />
              {contact.email}
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <GitHubIcon className="size-3.5 text-brand" aria-hidden="true" />
              MalozDev
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <LinkedInIcon className="size-3.5 text-brand" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <WhatsAppIcon className="size-3.5 text-brand" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Photo slider */}
        <Reveal>
          <PhotoSlider photos={photos} />
        </Reveal>
      </section>

      {/* Interactive terminal */}
      <section className="mt-12 md:mt-16">
        <Reveal>
          <Terminal />
        </Reveal>
      </section>

      {/* Why */}
      <section className="mt-20 md:mt-28">
        <Reveal>
          <p className="mb-2 font-mono text-sm text-brand">{"// why I build"}</p>
          <blockquote className="max-w-3xl font-display text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl">
            “{content.about.quote}”
          </blockquote>
        </Reveal>
      </section>

      {/* Learning journey — replaces the plain coursework list */}
      <section className="mt-20 md:mt-28">
        <p className="mb-2 font-mono text-sm text-brand">{"// the journey"}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          BSc Computer Systems Engineering
          <span className="ml-2 text-base font-normal text-muted-foreground">
            UNZA · 2026
          </span>
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {learningPath.map((step, i) => (
            <Reveal key={step.stage} delay={i * 120}>
              <div className="group relative h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40">
                <span
                  className="pointer-events-none absolute -top-4 right-4 font-display text-5xl font-bold text-brand/15 transition-colors group-hover:text-brand/30"
                  aria-hidden="true"
                >
                  {step.stage}
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-1 font-mono text-xs italic text-brand/80">
                  {step.note}
                </p>
                <ul className="mt-4 space-y-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section className="mt-20 md:mt-28">
        <p className="mb-2 font-mono text-sm text-brand">{"// experience"}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Where I&apos;ve worked
        </h2>

        <div className="relative mt-8 space-y-4 border-l border-border pl-6 sm:pl-8">
          {experience.map((job, i) => (
            <Reveal key={job.role} delay={i * 120}>
              <article className="relative rounded-2xl border border-border bg-card p-6">
                {/* Timeline dot */}
                <span
                  className="absolute top-7 -left-[1.87rem] size-3 rounded-full border-2 border-background bg-brand sm:-left-[2.4rem]"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    {job.role}
                  </h3>
                  <span className="font-mono text-xs text-brand">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.company}
                </p>
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
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Beyond the code */}
      <section className="mt-20 md:mt-28">
        <p className="mb-2 font-mono text-sm text-brand">{"// beyond the code"}</p>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Leadership & volunteering
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {leadership.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40">
                <Users className="size-5 text-brand" aria-hidden="true" />
                <h3 className="mt-3 font-display text-base font-semibold">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={4 * 80} className="sm:col-span-2">
            <div className="rounded-2xl border border-brand/30 bg-brand/10 p-6">
              <Trophy className="size-5 text-brand" aria-hidden="true" />
              <h3 className="mt-3 font-display text-base font-semibold text-brand">
                <Award className="mr-1 inline size-4" aria-hidden="true" />
                Mukali Award
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-brand/80">
                Awarded for exceptional performance as a top-performing broadband
                installer — outstanding service delivery, quarter award.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Languages + CV */}
      <section className="mt-20 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-border bg-card p-6">
            <Languages className="size-5 text-brand" aria-hidden="true" />
            <h2 className="mt-3 font-display text-base font-semibold">
              Languages I speak
            </h2>
            <ul className="mt-4 space-y-3">
              {languages.map((l) => (
                <li key={l.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{l.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {l.label}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-[oklch(0.75_0.15_200)]"
                      style={{ width: `${l.level}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6">
            <div>
              <Download className="size-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 font-display text-base font-semibold">
                The paper version
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Full CV with academic results, transcripts, and detailed work
                history.
              </p>
            </div>
            <Link
              href={portfolioContact.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim hover:shadow-[0_0_24px_oklch(0.88_0.22_150_/_35%)]"
            >
              <Download className="size-4" />
              Download CV
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
