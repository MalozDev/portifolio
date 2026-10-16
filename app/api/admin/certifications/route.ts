import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { CertificationDoc } from "@/lib/portfolio";

function sanitizeCert(body: unknown): Partial<CertificationDoc> | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const out: Partial<CertificationDoc> = {};

  if (typeof b.title === "string" && b.title.trim()) out.title = b.title.trim();
  else return null;

  if (typeof b.issuer === "string") out.issuer = b.issuer.trim();
  if (typeof b.href === "string") out.href = b.href.trim() || undefined;
  if (typeof b.pdfFileId === "string" && /^[a-f0-9]{24}$/i.test(b.pdfFileId)) {
    out.pdfFileId = new ObjectId(b.pdfFileId);
  }
  if (typeof b.order === "number" && Number.isFinite(b.order)) out.order = b.order;

  return out;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const db = await getDb();
  const certs = await db
    .collection<CertificationDoc>("certifications")
    .find()
    .sort({ order: 1 })
    .toArray();

  return Response.json(
    certs.map((c) => ({
      ...c,
      _id: c._id.toString(),
      pdfFileId: c.pdfFileId?.toString(),
      href: c.pdfFileId ? `/api/media/${c.pdfFileId.toString()}` : c.href,
    }))
  );
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const clean = sanitizeCert(body);
  if (!clean) {
    return Response.json({ error: "Invalid certification data (title required)." }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  const doc: CertificationDoc = {
    title: clean.title!,
    issuer: clean.issuer ?? "",
    href: clean.href,
    pdfFileId: clean.pdfFileId,
    order: clean.order ?? Date.now(),
    createdAt: now,
    updatedAt: now,
  } as CertificationDoc;

  const result = await db.collection<CertificationDoc>("certifications").insertOne(doc);
  return Response.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 });
}
