"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { Product, ProductsResponse, StoreInfo } from "@/lib/shop/types";
import { fetchInfo, fetchProducts, fetchTopProducts } from "@/lib/shop/client";
import { useCustomer } from "@/components/providers/CustomerProvider";

interface ShopData {
  info: StoreInfo | null;
  products: Product[];
  topIds: number[];
  byId: Map<number, Product>;
  showStock: boolean;
  categoryImages: { id: number; image: string }[];
  baseLabel: string;
  loading: boolean;
  error: boolean;
  somLabel: string;
}

const Ctx = createContext<ShopData | null>(null);

export function ShopDataProvider({
  children,
  somLabel,
}: {
  children: React.ReactNode;
  somLabel: string;
}) {
  const { customer, ready } = useCustomer();
  const [info, setInfo] = useState<StoreInfo | null>(null);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [topIds, setTopIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    setLoading(true);
    setError(false);
    Promise.all([
      fetchInfo().catch(() => null),
      fetchProducts({ customerCode: customer?.customer_code }),
      fetchTopProducts(12).catch(() => [] as number[]),
    ])
      .then(([i, p, t]) => {
        if (!alive) return;
        setInfo(i);
        setData(p);
        setTopIds(t);
      })
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [customer?.customer_code, ready]);

  const value = useMemo<ShopData>(() => {
    const products = data?.results || [];
    const byId = new Map(products.map((p) => [p.id, p]));
    return {
      info,
      products,
      topIds,
      byId,
      showStock: data?.show_stock ?? false,
      categoryImages: data?.category_images || [],
      baseLabel: info?.currency || somLabel,
      loading,
      error,
      somLabel,
    };
  }, [info, data, topIds, loading, error, somLabel]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShopData(): ShopData {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShopData must be used within ShopDataProvider");
  return c;
}
