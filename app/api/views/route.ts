import { NextRequest, NextResponse } from "next/server";

// In-memory store for Vercel Edge/Serverless (resets on cold start).
// For persistence, swap with a KV store like Vercel KV or Upstash Redis.
const counts: Record<string, number> = {};

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const count = counts[slug] ?? 0;
  return NextResponse.json({ count });
}

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  counts[slug] = (counts[slug] ?? 0) + 1;
  return NextResponse.json({ count: counts[slug] });
}
