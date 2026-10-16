import { Db, Document, GridFSBucket, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI. Add it to .env — this project connects directly to the production MongoDB cluster."
  );
}

declare global {
  var __mongoClient: MongoClient | undefined;
}

/**
 * Cached MongoClient — reuses the connection across hot reloads in dev and
 * across invocations in serverless/production. Connects directly to the
 * production cluster (no local database).
 */
export function getMongoClient(): MongoClient {
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
  }
  return global.__mongoClient;
}

export async function getDb(): Promise<Db> {
  const client = getMongoClient();
  await client.connect();
  return client.db(MONGODB_DB || undefined);
}

/** Convenience helper for asset collections (images, certifications, …). */
export async function collection<T extends Document>(name: string) {
  const db = await getDb();
  return db.collection<T>(name);
}

/** GridFS bucket for binary assets (photos, project images, certificate PDFs, CV). */
export async function getGridFS(): Promise<GridFSBucket> {
  const db = await getDb();
  return new GridFSBucket(db, { bucketName: "media" });
}
