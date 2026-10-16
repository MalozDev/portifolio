import { Award, ExternalLink, FileText } from "lucide-react";

import { getPortfolio } from "@/lib/portfolio";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Certifications",
  description:
    "Certifications earned by Stephan Malobeka — CCNA, Cisco Packet Tracer, networking, Linux and cloud credentials with verifiable certificates.",
  alternates: { canonical: "/certification" },
};

export default async function CertificationPage() {
  const { certifications, contact } = await getPortfolio(getDb());
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-20">
      <p className="mb-2 font-mono text-sm text-brand">$ ls ~/.certs</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        Certifications
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Industry-recognized credentials in networking, Linux, and cloud — backed
        by verifiable certificates you can open directly from this page.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => {
          const Wrapper = cert.href ? "a" : "div";
          const wrapperProps = cert.href
            ? {
                href: cert.href,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {};
          return (
            <Wrapper
              key={cert.title}
              {...wrapperProps}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 animate-fade-in-up transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_40px_oklch(0.88_0.22_150_/_12%)] focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              style={{
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-brand/10 text-brand">
                  <Award className="size-5" aria-hidden="true" />
                </div>
                {cert.href && (
                  <FileText
                    className="size-4 text-muted-foreground transition-colors group-hover:text-brand"
                    aria-hidden="true"
                  />
                )}
              </div>

              <h2 className="mt-4 font-display text-base font-semibold text-balance">
                {cert.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>

              {cert.href ? (
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-xs font-semibold text-brand">
                  View certificate
                  <ExternalLink className="size-3" aria-hidden="true" />
                </span>
              ) : (
                <span className="mt-auto pt-5 text-xs text-muted-foreground">
                  Listed on CV
                </span>
              )}
            </Wrapper>
          );
        })}
      </div>

      {/* CV download */}
      <section className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="font-display text-xl font-bold sm:text-2xl">
          Full CV & academic results
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Detailed academic records, transcripts, and a complete résumé are
          available in my CV.
        </p>
        <a
          href={contact.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim hover:shadow-[0_0_24px_oklch(0.88_0.22_150_/_35%)]"
        >
          <FileText className="size-4" />
          Open CV
        </a>
      </section>
    </div>
  );
}
