import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

import { TypingAnimation } from "@/components/ui/typing-animation";
import { PendingArrow } from "@/components/link-pending";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/social-icons";
import { ProjectCover } from "@/components/project-cover";
import { contact, type Project } from "@/lib/data";
import { getPortfolio } from "@/lib/portfolio";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const stats = [
  { icon: Briefcase, value: "8+", label: "Live projects" },
  { icon: GraduationCap, value: "BSc", label: "Computer Systems Eng." },
  { icon: Award, value: "5", label: "Certifications" },
  { icon: MapPin, value: "ZM", label: "Based in Zambia" },
];

export default async function Home() {
  const { projects, content, contact: portfolioContact } = await getPortfolio(getDb());
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const marqueeItems = content.marquee;
  const heroRoles = content.hero.roles;

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Backdrop: grid + glows */}
        <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/25 animate-glow-pulse md:h-96 md:w-96"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-40 -left-24 h-64 w-64 rounded-full bg-[oklch(0.7_0.16_200)]/20 animate-glow-pulse [animation-delay:2s]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-16 sm:px-6 md:pt-24 md:pb-24">
          {/* Availability pill */}
          <div className="mb-6 flex justify-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {content.hero.availability}
            </span>
          </div>

          <div className="text-center">
            <p className="mb-3 font-mono text-sm text-muted-foreground animate-fade-in-up [animation-delay:0.05s]">
              $ whoami
            </p>
            <h1 className="font-display text-4xl leading-[1.1] font-bold tracking-tight text-balance animate-fade-in-up [animation-delay:0.1s] sm:text-5xl md:text-7xl">
              Stephan{" "}
              <span className="text-brand [text-shadow:0_0_40px_oklch(0.88_0.22_150_/_40%)]">
                Malobeka
              </span>
            </h1>

            <div className="mt-4 flex justify-center animate-fade-in-up [animation-delay:0.2s]">
              <TypingAnimation
                words={heroRoles}
                typeSpeed={70}
                deleteSpeed={40}
                pauseDelay={1400}
                loop
                className="font-display text-lg font-medium text-muted-foreground sm:text-xl md:text-2xl"
              />
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-balance animate-fade-in-up [animation-delay:0.3s] md:text-lg">
              {content.hero.bio}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-stretch gap-3 animate-fade-in-up [animation-delay:0.4s] sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/projects"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim hover:shadow-[0_0_24px_oklch(0.88_0.22_150_/_35%)] focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                View my work
                <PendingArrow />
              </Link>
              <Link
                href={portfolioContact.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                Download CV
              </Link>
              <a
                href={contact.emailHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                <Mail className="size-4" />
                Get in touch
              </a>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center justify-center gap-4 animate-fade-in-up [animation-delay:0.5s]">
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-lg border border-border bg-card/50 p-2.5 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <GitHubIcon className="size-5" />
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg border border-border bg-card/50 p-2.5 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <LinkedInIcon className="size-5" />
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="rounded-lg border border-border bg-card/50 p-2.5 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <WhatsAppIcon className="size-5" />
              </a>
              <a
                href={contact.emailHref}
                aria-label="Email"
                className="rounded-lg border border-border bg-card/50 p-2.5 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <Mail className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Quick stats" className="border-y border-border bg-card/40">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-border px-4 sm:px-6 md:grid-cols-4 md:divide-x">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 px-4 py-6 text-center"
            >
              <stat.icon className="mb-1 size-4 text-brand" aria-hidden="true" />
              <span className="font-display text-2xl font-bold md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground md:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech marquee */}
      <section
        aria-label="Technologies I work with"
        className="overflow-hidden border-b border-border py-5"
      >
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-muted-foreground"
              aria-hidden={i >= marqueeItems.length}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div>
            <p className="mb-2 font-mono text-sm text-brand">{"// featured work"}</p>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Things I&apos;ve built
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
          >
            All projects
            <PendingArrow icon="arrow-up" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 md:py-24">
          <p className="mb-2 font-mono text-sm text-brand">{"// let's connect"}</p>
          <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl md:text-4xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            I&apos;m always open to discussing new products, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <a
            href={contact.emailHref}
            className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim hover:shadow-[0_0_24px_oklch(0.88_0.22_150_/_35%)]"
          >
            <Send className="size-4" />
            {contact.email}
          </a>
        </div>
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={project.href ?? "/projects"}
      {...(project.href
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_40px_oklch(0.88_0.22_150_/_12%)] focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
    >
      <ProjectCover project={project} />
      <span className="pointer-events-none absolute -top-6 -right-4 font-display text-7xl font-bold text-foreground/5 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex items-start justify-between gap-3 p-6 pb-0">
        <h3 className="font-display text-lg font-semibold text-balance">
          {project.title}
        </h3>
        <ArrowUpRight
          className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
          aria-hidden="true"
        />
      </div>
      <p className="px-6 pt-2 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5 px-6 pb-6">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
