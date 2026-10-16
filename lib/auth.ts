import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "portfolio_console_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/* ------------------------------------------------------------------ */
/* Password hashing (scrypt)                                           */
/* ------------------------------------------------------------------ */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    candidate.length === expected.length &&
    timingSafeEqual(candidate, expected)
  );
}

/* ------------------------------------------------------------------ */
/* Sessions (HMAC-signed tokens in an httpOnly cookie)                 */
/* ------------------------------------------------------------------ */

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET in environment (.env)");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

export function createSessionToken(email: string): string {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieName = SESSION_COOKIE;
export const sessionMaxAge = SESSION_MAX_AGE;

/** Returns a 401 Response when not authenticated — use at the top of admin APIs. */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdminAuthenticated()) return null;
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
