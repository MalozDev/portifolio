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
  if (b.imageFileId === null) out.imageFileId = undefined;
  else if (typeof b.imageFileId === "string" && /^[a-f0-9]{24}$/i.test(b.imageFileId)) {
    out.imageFileId = new ObjectId(b.imageFileId);
  }
  if (typeof b.order === "number" && Number.isFinite(b.order)) out.order = b.order;

  return out;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const clean = sanitizeProject(body);
  if (!clean) {
    return Response.json({ error: "Invalid project data (title required)." }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection<ProjectDoc>("projects").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...clean, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }
  return Response.json({
    ...result,
    _id: result._id.toString(),
    imageFileId: result.imageFileId?.toString(),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid id." }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection<ProjectDoc>("projects")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
