import { ObjectId } from "mongodb";

import { getGridFS } from "@/lib/mongodb";

/** Fallback for files uploaded before content types were stored in metadata. */
function contentTypeFromFilename(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() ?? "";
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return new Response("Not found", { status: 404 });
  }

  const bucket = await getGridFS();
  const objectId = new ObjectId(id);

  const file = await bucket.find({ _id: objectId }).next();
  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const downloadStream = bucket.openDownloadStream(objectId);
  const chunks: Uint8Array[] = [];
  const data = await new Promise<Buffer>((resolve, reject) => {
    downloadStream.on("data", (c: Uint8Array) => chunks.push(c));
    downloadStream.on("end", () => resolve(Buffer.concat(chunks)));
    downloadStream.on("error", reject);
  });

  const contentType =
    (file.metadata as { contentType?: string } | undefined)?.contentType ??
    contentTypeFromFilename(file.filename);
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Length": String(file.length),
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (new URL(req.url).searchParams.get("download") === "1") {
    headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`;
  }

  return new Response(new Uint8Array(data), {
    headers,
  });
}
