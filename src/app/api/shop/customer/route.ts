import { NextRequest, NextResponse } from "next/server";
import { sfFetch } from "@/lib/shop/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get("code") || "").trim();
  if (!code) return NextResponse.json({ error: "code_required" }, { status: 400 });
  try {
    const r = await sfFetch(`/storefront/customer/?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
}
