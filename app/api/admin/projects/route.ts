import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { ProjectDoc } from "@/lib/portfolio";

const PATTERNS = new Set(["dots", "grid", "waves", "circles"]);

function sanitizeProject(body: unknown): Partial<ProjectDoc> | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const out: Partial<ProjectDoc> = {};

  if (typeof b.title === "string" && b.title.trim()) out.title = b.title.trim();
  else return null;

  if (typeof b.description === "string") out.description = b.description.trim();
  if (typeof b.href === "string") out.href = b.href.trim() || undefined;
  if (Array.isArray(b.tech))
    out.tech = b.tech.filter((t): t is string => typeof t === "string").map((t) => t.trim()).filter(Boolean);
  out.featured = Boolean(b.featured);

  if (
    Array.isArray(b.accent) &&
    b.accent.length === 2 &&
    b.accent.every((c) => typeof c === "string")
  ) {
    out.accent = [b.accent[0], b.accent[1]] as [string, string];
  }
  if (typeof b.pattern === "string" && PATTERNS.has(b.pattern)) {
    out.pattern = b.pattern as ProjectDoc["pattern"];
  }
  if (typeof b.imageFileId === "string" && /^[a-f0-9]{24}$/i.test(b.imageFileId)) {
    out.imageFileId = new ObjectId(b.imageFileId);
  }
  if (typeof b.order === "number" && Number.isFinite(b.order)) out.order = b.order;

  return out;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = await getDb();
  const projects = await db
    .collection<ProjectDoc>("projects")
    .find()
    .sort({ order: 1 })
    .toArray();

  return Response.json(
    projects.map((p) => ({
      ...p,
      _id: p._id.toString(),
      imageFileId: p.imageFileId?.toString(),
      image: p.imageFileId ? `/api/media/${p.imageFileId.toString()}` : undefined,
    }))
  );
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const clean = sanitizeProject(body);
  if (!clean) {
    return Response.json({ error: "Invalid project data (title required)." }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  const doc: ProjectDoc = {
    title: clean.title!,
    description: clean.description ?? "",
    href: clean.href,
    tech: clean.tech ?? [],
    featured: clean.featured ?? false,
    accent: clean.accent ?? ["#45fe84", "#22d3ee"],
    pattern: clean.pattern ?? "grid",
    imageFileId: clean.imageFileId,
    order: clean.order ?? Date.now(),
    createdAt: now,
    updatedAt: now,
  } as ProjectDoc;

  const result = await db.collection<ProjectDoc>("projects").insertOne(doc);
  return Response.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 });
}
