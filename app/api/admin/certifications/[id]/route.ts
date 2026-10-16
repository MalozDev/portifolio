import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { CertificationDoc } from "@/lib/portfolio";

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
  const updates: Partial<CertificationDoc> = {};

  if (typeof b.title === "string" && b.title.trim()) updates.title = b.title.trim();
  else return Response.json({ error: "Title required." }, { status: 400 });
  if (typeof b.issuer === "string") updates.issuer = b.issuer.trim();
  if (typeof b.href === "string") updates.href = b.href.trim() || undefined;
  if (b.pdfFileId === null) updates.pdfFileId = undefined;
  else if (typeof b.pdfFileId === "string" && /^[a-f0-9]{24}$/i.test(b.pdfFileId)) {
    updates.pdfFileId = new ObjectId(b.pdfFileId);
  }
  if (typeof b.order === "number" && Number.isFinite(b.order)) updates.order = b.order;

  const db = await getDb();
  const result = await db.collection<CertificationDoc>("certifications").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ error: "Certification not found." }, { status: 404 });
  }
  return Response.json({
    ...result,
    _id: result._id.toString(),
    pdfFileId: result.pdfFileId?.toString(),
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
    .collection<CertificationDoc>("certifications")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Certification not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
