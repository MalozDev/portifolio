import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { PhotoDoc } from "@/lib/portfolio";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = await getDb();
  const photos = await db
    .collection<PhotoDoc>("photos")
    .find()
    .sort({ order: 1 })
    .toArray();

  return Response.json(
    photos.map((p) => ({
      _id: p._id.toString(),
      fileId: p.fileId.toString(),
      url: `/api/media/${p.fileId.toString()}`,
      alt: p.alt,
      caption: p.caption,
      order: p.order,
    }))
  );
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const fileId = typeof body?.fileId === "string" ? body.fileId : "";
  if (!/^[a-f0-9]{24}$/i.test(fileId)) {
    return Response.json({ error: "Valid fileId required (upload media first)." }, { status: 400 });
  }
  const alt = typeof body?.alt === "string" && body.alt.trim() ? body.alt.trim() : "Photo";
  const caption = typeof body?.caption === "string" ? body.caption.trim() : undefined;
  const order = typeof body?.order === "number" && Number.isFinite(body.order) ? body.order : Date.now();

  const db = await getDb();
  const doc: PhotoDoc = {
    fileId: new ObjectId(fileId),
    alt,
    caption,
    order,
    createdAt: new Date(),
  };

  const result = await db.collection<PhotoDoc>("photos").insertOne(doc);
  return Response.json(
    { _id: result.insertedId.toString(), fileId, url: `/api/media/${fileId}`, alt, caption, order },
    { status: 201 }
  );
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = req.nextUrl.searchParams.get("id") ?? "";
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
