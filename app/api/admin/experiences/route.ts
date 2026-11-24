import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import {
  isCurrentExperience,
  sortExperiencesByRecency,
  type ExperienceDoc,
} from "@/lib/portfolio";

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
  if (typeof b.highlight === "string") out.highlight = b.highlight.trim() || undefined;
  if (b.imageFileId === null) out.imageFileId = undefined;
  else if (typeof b.imageFileId === "string" && /^[a-f0-9]{24}$/i.test(b.imageFileId)) {
    out.imageFileId = new ObjectId(b.imageFileId);
  }
  if (typeof b.order === "number" && Number.isFinite(b.order)) out.order = b.order;

  return out;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = await getDb();
  const experiences = await db
    .collection<ExperienceDoc>("experiences")
    .find()
    .sort({ order: 1 })
    .toArray();

  const serialized = experiences.map((e) => ({
    ...e,
    _id: e._id.toString(),
    imageFileId: e.imageFileId?.toString(),
    image: e.imageFileId ? `/api/media/${e.imageFileId.toString()}` : undefined,
  }));

  return Response.json(sortExperiencesByRecency(serialized));
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const clean = sanitizeExperience(body);
  if (!clean) {
    return Response.json(
      { error: "Invalid experience data (role and company required)." },
      { status: 400 }
    );
  }

  const db = await getDb();
  const now = new Date();
  const doc: ExperienceDoc = {
    role: clean.role!,
    company: clean.company!,
    period: clean.period ?? "",
    startDate: clean.startDate,
    endDate: clean.endDate,
    points: clean.points ?? [],
    highlight: clean.highlight,
    imageFileId: clean.imageFileId,
    order: clean.order ?? Date.now(),
    createdAt: now,
    updatedAt: now,
  } as ExperienceDoc;

  const result = await db.collection<ExperienceDoc>("experiences").insertOne(doc);

  // When a new current job is added, close any other currently-open jobs so
  // there is only one "Present" entry. The previous job ends the month before
  // the new one starts (or today when no start date is given).
  if (isCurrentExperience(clean.endDate)) {
    const base = clean.startDate || new Date().toISOString().slice(0, 7);
    const parsed = new Date(`${base.slice(0, 7)}-01T00:00:00`);
    parsed.setDate(0);
    const closeDate = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
    await db.collection("experiences").updateMany(
      {
        _id: { $ne: result.insertedId },
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

  return Response.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 });
}
