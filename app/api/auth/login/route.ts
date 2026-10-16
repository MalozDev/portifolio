import { NextRequest, NextResponse } from "next/server";

import {
  createSessionToken,
  sessionCookieName,
  sessionMaxAge,
  verifyPassword,
} from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { UserDoc } from "@/lib/portfolio";

// Naive in-memory rate limit: 10 attempts per minute per IP.
const attempts = new Map<string, { count: number; reset: number }>();

function tooManyRequests(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.reset) {
    attempts.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooManyRequests(ip)) {
    return Response.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const db = await getDb();
  const user = await db.collection<UserDoc>("users").findOne({ email });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = createSessionToken(user.email);
  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return res;
}
