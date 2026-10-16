import { NextRequest } from "next/server";
import { Readable } from "stream";

import { requireAdmin } from "@/lib/auth";
import { getGridFS } from "@/lib/mongodb";

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "application/pdf",
]);

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return Response.json(
      { error: `Unsupported type ${file.type}. Allowed: images and PDFs.` },
      { status: 415 }
    );
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File exceeds 15 MB limit." }, { status: 413 });
  }

  const bucket = await getGridFS();
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadStream = bucket.openUploadStream(file.name || "upload", {
    metadata: { contentType: file.type, uploadedAt: new Date() },
  });

  await new Promise<void>((resolve, reject) => {
    Readable.from(buffer)
      .pipe(uploadStream)
      .on("finish", () => resolve())
      .on("error", reject);
  });

  return Response.json(
    { id: uploadStream.id.toString(), url: `/api/media/${uploadStream.id.toString()}` },
    { status: 201 }
  );
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const bucket = await getGridFS();
  const files = await bucket
    .find({}, { sort: { uploadDate: -1 } })
    .limit(100)
    .toArray();

  return Response.json(
    files.map((f) => ({
      id: f._id.toString(),
      name: f.filename,
      contentType: (f.metadata as { contentType?: string } | undefined)?.contentType,
      size: f.length,
      url: `/api/media/${f._id.toString()}`,
    }))
  );
}
