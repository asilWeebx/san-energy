"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { CustomerLogin } from "@/lib/shop/types";

const KEY = "she_customer_v1";

interface CustomerCtx {
  customer: CustomerLogin | null;
  login: (c: CustomerLogin) => void;
  logout: () => void;
  ready: boolean;
}

const Ctx = createContext<CustomerCtx | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerLogin | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCustomer(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const login = useCallback((c: CustomerLogin) => {
    setCustomer(c);
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ customer, login, logout, ready }),
    [customer, login, logout, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCustomer(): CustomerCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCustomer must be used within CustomerProvider");
  return c;
}
