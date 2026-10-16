import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { defaultContent, defaultContact, type SiteContentDoc } from "@/lib/portfolio";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = await getDb();
  const content = await db
    .collection<SiteContentDoc>("content")
    .findOne({ _id: "site" });
  const fileId = content?.cvFileId?.toString() ?? null;

  return Response.json({
    fileId,
    url: fileId ? `/api/media/${fileId}` : defaultContact.cv,
  });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }

  const fileId = (body as Record<string, unknown>).fileId;
  if (fileId !== null && (typeof fileId !== "string" || !/^[a-f0-9]{24}$/i.test(fileId))) {
    return Response.json({ error: "Invalid CV file." }, { status: 400 });
  }

  const db = await getDb();
  const collection = db.collection<SiteContentDoc>("content");
  const existing =
    (await collection.findOne({ _id: "site" })) ?? defaultContent;
  const updates = { ...existing, updatedAt: new Date() } as Record<string, unknown>;
  delete updates._id;
  if (fileId === null) delete updates.cvFileId;
  else updates.cvFileId = new ObjectId(fileId);

  await collection.updateOne(
    { _id: "site" },
    {
      $set: updates,
      ...(fileId === null ? { $unset: { cvFileId: "" } } : {}),
    },
    { upsert: true }
  );

  return Response.json({
    fileId,
    url: fileId ? `/api/media/${fileId}` : defaultContact.cv,
  });
}