"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { CartLine } from "@/lib/shop/types";

const KEY = "she_cart_v1";

interface CartCtx {
  lines: CartLine[];
  count: number;
  add: (line: CartLine, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  totalBase: number;
  ready: boolean;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback((line: CartLine, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.key === line.key);
      if (i >= 0) {
        const next = [...prev];
        // refresh cap/price from the latest line data, then clamp total
        const cap = line.maxQty ?? next[i].maxQty;
        let q = next[i].qty + qty;
        if (cap != null) q = Math.min(q, cap);
        next[i] = { ...next[i], ...line, qty: Math.max(1, q) };
        return next;
      }
      const cap = line.maxQty;
      const q = cap != null ? Math.min(qty, cap) : qty;
      return [...prev, { ...line, qty: Math.max(1, q) }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => {
          if (l.key !== key) return l;
          let q = Math.max(0, qty);
          if (l.maxQty != null) q = Math.min(q, l.maxQty);
          return { ...l, qty: q };
        })
        .filter((l) => l.qty > 0)
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const totalBase = useMemo(
    () => lines.reduce((s, l) => s + l.cur_price * l.qty, 0),
    [lines]
  );

  const value = useMemo(
    () => ({ lines, count, add, setQty, remove, clear, totalBase, ready }),
    [lines, count, add, setQty, remove, clear, totalBase, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
