import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ profile: string }> },
) {
  const { profile } = await params;
  const res = await fetch(
    `https://api.counterapi.dev/v1/oneeyed/${profile}/up`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
  const data = await res.json();
  return NextResponse.json({ count: data.count ?? 0 });
}
