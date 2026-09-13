"use client";
import type {
  ProductsResponse,
  StoreInfo,
  CustomerLogin,
  CustomerAccount,
  CartLine,
} from "./types";

async function j<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.error || data.detail)) || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : "error");
  }
  return data as T;
}

export async function fetchInfo(): Promise<StoreInfo> {
  return j<StoreInfo>(await fetch("/api/shop/info", { cache: "no-store" }));
}

export async function fetchProducts(opts?: {
  search?: string;
  customerCode?: string;
}): Promise<ProductsResponse> {
  const qs = new URLSearchParams();
  if (opts?.search) qs.set("search", opts.search);
  if (opts?.customerCode) qs.set("customer_code", opts.customerCode);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return j<ProductsResponse>(
    await fetch(`/api/shop/products${suffix}`, { cache: "no-store" })
  );
}

export async function fetchTopProducts(limit = 12): Promise<number[]> {
  const data = await j<{ product_ids: number[] }>(
    await fetch(`/api/shop/top-products?limit=${limit}`, { cache: "no-store" })
  );
  return data.product_ids || [];
}

export async function loginCustomer(code: string): Promise<CustomerLogin> {
  return j<CustomerLogin>(
    await fetch("/api/shop/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
  );
}

export async function fetchCustomer(code: string): Promise<CustomerAccount> {
  return j<CustomerAccount>(
    await fetch(`/api/shop/customer?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    })
  );
}

export interface CheckoutPayload {
  customer_name: string;
  phone: string;
  customer_code?: string;
  note?: string;
  delivery_type: "courier" | "pickup";
  payment_method: "cash" | "card";
  address?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  items: {
    product_id: number;
    variant_id?: number;
    unit_id?: number;
    qty: number;
  }[];
}

export async function placeOrder(
  lines: CartLine[],
  meta: Omit<CheckoutPayload, "items">
): Promise<{ order_no: string; status: string; total: number }> {
  const items = lines.map((l) => {
    const it: CheckoutPayload["items"][number] = {
      product_id: l.product_id,
      qty: l.qty,
    };
    if (l.variant_id) it.variant_id = l.variant_id;
    // unit_id must be omitted when 0/null
    if (l.unit_id && l.unit_id > 0) it.unit_id = l.unit_id;
    return it;
  });
  const payload: CheckoutPayload = { ...meta, items };
  return j(
    await fetch("/api/shop/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}
