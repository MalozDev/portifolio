import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { defaultContent, type SiteContentDoc } from "@/lib/portfolio";

function deepMerge<T>(base: T, patch: unknown): T {
  if (Array.isArray(patch)) return patch as T;
  if (patch !== null && typeof patch === "object" && base !== null && typeof base === "object" && !Array.isArray(base)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
      out[k] = deepMerge((base as Record<string, unknown>)[k], v);
    }
    return out as T;
  }
  return (patch === undefined ? base : patch) as T;
}

function sanitizeStringArray(value: unknown, max = 100): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = await getDb();
  const content =
    (await db.collection<SiteContentDoc>("content").findOne({ _id: "site" })) ??
    defaultContent;

  return Response.json(content);
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;

  // Whitelist + sanitize each editable section.
  const patch: Partial<SiteContentDoc> = {};

  if (typeof b.hero === "object" && b.hero !== null) {
    const h = b.hero as Record<string, unknown>;
    patch.hero = {
      roles: sanitizeStringArray(h.roles, 20) ?? defaultContent.hero.roles,
      bio: typeof h.bio === "string" ? h.bio.trim() : defaultContent.hero.bio,
      availability:
        typeof h.availability === "string"
          ? h.availability.trim()
          : defaultContent.hero.availability,
    };
  }

  if (typeof b.about === "object" && b.about !== null) {
    const a = b.about as Record<string, unknown>;
    patch.about = {
      intro: sanitizeStringArray(a.intro, 10) ?? defaultContent.about.intro,
      quote: typeof a.quote === "string" ? a.quote.trim() : defaultContent.about.quote,
    };
  }

  if (Array.isArray(b.journey)) {
    patch.journey = (b.journey as unknown[]).flatMap((stage) => {
      if (typeof stage !== "object" || stage === null) return [];
      const s = stage as Record<string, unknown>;
      if (typeof s.title !== "string" || !s.title.trim()) return [];
      return [
        {
          stage: typeof s.stage === "string" ? s.stage : "",
          title: s.title.trim(),
          note: typeof s.note === "string" ? s.note : "",
          items: sanitizeStringArray(s.items, 30) ?? [],
        },
      ];
    });
  }

  if (Array.isArray(b.leadership)) {
    patch.leadership = (b.leadership as unknown[]).flatMap((item) => {
      if (typeof item !== "object" || item === null) return [];
      const l = item as Record<string, unknown>;
      if (typeof l.title !== "string" || !l.title.trim()) return [];
      return [
        {
          title: l.title.trim(),
          detail: typeof l.detail === "string" ? l.detail : "",
        },
      ];
    });
  }

  if (Array.isArray(b.languages)) {
    patch.languages = (b.languages as unknown[]).flatMap((item) => {
      if (typeof item !== "object" || item === null) return [];
      const l = item as Record<string, unknown>;
      if (typeof l.name !== "string" || !l.name.trim()) return [];
      const level = typeof l.level === "number" ? Math.min(100, Math.max(0, l.level)) : 100;
      return [
        {
          name: l.name.trim(),
          label: typeof l.label === "string" ? l.label : "",
          level,
        },
      ];
    });
  }

  const competencies = sanitizeStringArray(b.competencies, 50);
  if (competencies) patch.competencies = competencies;

  const marquee = sanitizeStringArray(b.marquee, 60);
  if (marquee) patch.marquee = marquee;

  patch.updatedAt = new Date();

  const db = await getDb();
  const existing =
    (await db.collection<SiteContentDoc>("content").findOne({ _id: "site" })) ??
    defaultContent;
  const result = await db.collection<SiteContentDoc>("content").findOneAndUpdate(
    { _id: "site" },
    { $set: deepMerge(existing, patch) as SiteContentDoc },
    { returnDocument: "after", upsert: true }
  );

  return Response.json(result);
}
