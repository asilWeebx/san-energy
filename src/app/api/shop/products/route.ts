import { NextRequest, NextResponse } from "next/server";
import { sfFetch } from "@/lib/shop/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const qs = new URLSearchParams();
  const search = sp.get("search");
  const code = sp.get("customer_code");
  if (search) qs.set("search", search);
  if (code) qs.set("customer_code", code);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  try {
    const r = await sfFetch(`/storefront/products/${suffix}`, {
      // catalog can be cached briefly
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }
}
