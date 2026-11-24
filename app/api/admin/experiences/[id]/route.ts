import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { isCurrentExperience, type ExperienceDoc } from "@/lib/portfolio";

function sanitizeExperience(body: unknown): Partial<ExperienceDoc> | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const out: Partial<ExperienceDoc> = {};

  if (typeof b.role === "string" && b.role.trim()) out.role = b.role.trim();
  else return null;

  if (typeof b.company === "string" && b.company.trim())
    out.company = b.company.trim();
  else return null;

  if (typeof b.period === "string") out.period = b.period.trim();
  if (typeof b.startDate === "string") out.startDate = b.startDate.trim() || undefined;
  if (typeof b.endDate === "string") out.endDate = b.endDate.trim() || undefined;
  if (b.startDate === null) out.startDate = undefined;
  if (b.endDate === null) out.endDate = undefined;
  if (Array.isArray(b.points)) {
    out.points = b.points
      .filter((p): p is string => typeof p === "string")
      .map((p) => p.trim())
      .filter(Boolean);
  } else if (typeof b.points === "string") {
    out.points = b.points
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
  }
  if (b.highlight === null) out.highlight = undefined;
  else if (typeof b.highlight === "string") out.highlight = b.highlight.trim() || undefined;
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
  const clean = sanitizeExperience(body);
  if (!clean) {
    return Response.json(
      { error: "Invalid experience data (role and company required)." },
      { status: 400 }
    );
  }

  const db = await getDb();
  const result = await db.collection<ExperienceDoc>("experiences").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...clean, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ error: "Experience not found." }, { status: 404 });
  }

  if (isCurrentExperience(clean.endDate)) {
    const base = clean.startDate || new Date().toISOString().slice(0, 7);
    const parsed = new Date(`${base.slice(0, 7)}-01T00:00:00`);
    parsed.setDate(0);
    const closeDate = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
    const db2 = await getDb();
    await db2.collection("experiences").updateMany(
      {
        _id: { $ne: new ObjectId(id) },
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: "" },
          { endDate: { $regex: /^present$/i } },
          { endDate: { $regex: /^current$/i } },
        ],
      },
      { $set: { endDate: closeDate, period: "", updatedAt: new Date() } }
    );
  }

  return Response.json({
    ...result,
    _id: result._id.toString(),
    imageFileId: result.imageFileId?.toString(),
    image: result.imageFileId ? `/api/media/${result.imageFileId.toString()}` : undefined,
    startDate: result.startDate,
    endDate: result.endDate,
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
    .collection<ExperienceDoc>("experiences")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Experience not found." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
