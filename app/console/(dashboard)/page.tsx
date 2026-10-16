"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FolderKanban, GraduationCap, ImageIcon, RefreshCw, Type } from "lucide-react";

import { ErrorBanner } from "@/components/console/fields";
import { useConsoleApi } from "@/components/console/use-console-api";

interface ProjectItem {
  _id: string;
  title: string;
  featured: boolean;
}
interface CertItem {
  _id: string;
  title: string;
}
interface PhotoItem {
  _id: string;
  url: string;
}

export default function ConsoleDashboardPage() {
  const api = useConsoleApi();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certs, setCerts] = useState<CertItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [p, c, ph] = await Promise.all([
        api.get<ProjectItem[]>("/api/admin/projects"),
        api.get<CertItem[]>("/api/admin/certifications"),
        api.get<PhotoItem[]>("/api/admin/photos"),
      ]);
      setProjects(p);
      setCerts(c);
      setPhotos(ph);
    } catch (e) {
      if (!(e instanceof Error && e.message === "Unauthorized")) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Kick off in a microtask so no setState runs synchronously in the effect.
    Promise.resolve().then(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    {
      href: "/console/projects",
      label: "Projects",
      count: projects.length,
      icon: FolderKanban,
      note: `${projects.filter((p) => p.featured).length} featured`,
    },
    {
      href: "/console/certifications",
      label: "Certifications",
      count: certs.length,
      icon: GraduationCap,
    },
    {
      href: "/console/photos",
      label: "Photos",
      count: photos.length,
      icon: ImageIcon,
    },
    {
      href: "/console/content",
      label: "Site Content",
      count: null,
      icon: Type,
      note: "Hero, About, skills text",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage everything on your portfolio from here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void load();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <ErrorBanner error={error} />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand/40"
          >
            <card.icon className="size-5 text-brand" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl font-bold">
              {card.count === null ? "—" : loading ? "…" : card.count}
            </p>
            <p className="text-sm font-medium">{card.label}</p>
            {card.note && (
              <p className="mt-0.5 text-xs text-muted-foreground">{card.note}</p>
            )}
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-semibold">How it works</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Projects & certifications</strong>{" "}
            — add, edit, reorder, and delete. Upload images/PDFs; they&apos;re
            stored in MongoDB (GridFS).
          </li>
          <li>
            <strong className="text-foreground">Photos</strong> — the slider on
            your About page. Upload in any order; first photo shows first.
          </li>
          <li>
            <strong className="text-foreground">Site Content</strong> — hero
            roles, bio, About intro/quote, learning journey, leadership,
            languages, skills marquee.
          </li>
          <li>
            Changes go live immediately — every page reads from the database on
            each request.
          </li>
        </ul>
      </section>
    </div>
  );
}
