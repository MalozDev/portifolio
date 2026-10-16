import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { PhotoDoc } from "@/lib/portfolio";

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
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const updates: Partial<PhotoDoc> = {};

  if (typeof b.alt === "string" && b.alt.trim()) updates.alt = b.alt.trim();
  if (typeof b.caption === "string") updates.caption = b.caption.trim() || undefined;
  if (typeof b.order === "number" && Number.isFinite(b.order)) updates.order = b.order;

  const db = await getDb();
  const result = await db.collection<PhotoDoc>("photos").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ error: "Photo not found." }, { status: 404 });
  }
  return Response.json({
    _id: result._id.toString(),
    fileId: result.fileId.toString(),
    url: `/api/media/${result.fileId.toString()}`,
    alt: result.alt,
    caption: result.caption,
    order: result.order,
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
  const result = await db.collection<PhotoDoc>("photos").deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return Response.json({ error: "Photo not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
