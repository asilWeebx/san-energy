import { NextRequest, NextResponse } from "next/server";
import { sfFetch } from "@/lib/shop/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limit = req.nextUrl.searchParams.get("limit") || "12";
  try {
    const r = await sfFetch(`/storefront/top-products/?limit=${encodeURIComponent(limit)}`, {
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
}
