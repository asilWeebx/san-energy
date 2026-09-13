import { NextRequest, NextResponse } from "next/server";
import { sfFetch } from "@/lib/shop/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const code = (body.code || "").trim();
  if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });
  try {
    const r = await sfFetch("/storefront/login/", {
      method: "POST",
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
}
