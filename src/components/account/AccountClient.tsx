"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LogIn,
  LogOut,
  Loader2,
  User,
  ShoppingBag,
  Package,
  CreditCard,
  ChevronDown,
  ShieldCheck,
  Receipt,
  Smartphone,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { CustomerAccount, SerialSpec, OrderItem } from "@/lib/shop/types";
import { useCustomer } from "@/components/providers/CustomerProvider";
import { loginCustomer, fetchCustomer } from "@/lib/shop/client";
import { fmtNum, shortDate } from "@/lib/format";

const ST_COLOR: Record<string, string> = {
  new: "#3b82f6",
  confirmed: "#f59e0b",
  pending: "#f59e0b",
  sold: "#22c55e",
  delivered: "#22c55e",
  completed: "#22c55e",
  cancelled: "#9ca3af",
};

export function AccountClient({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { customer, login, logout, ready } = useCustomer();
  const a = dict.account;
  const som = dict.common.som;
  const pm = (m: string) => (a.pm as Record<string, string>)[m] || m || "—";
  const stLabel = (s: string) => (a.st as Record<string, string>)[s] || s || "—";
  const stColor = (s: string) => ST_COLOR[s] || "#9ca3af";
  const money = (n: number) => `${fmtNum(n)} ${som}`;

  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [acc, setAcc] = useState<CustomerAccount | null>(null);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [tab, setTab] = useState<"profile" | "sales" | "orders" | "payments">("profile");
  const [openSale, setOpenSale] = useState<number | null>(null);

  useEffect(() => {
    if (!customer) {
      setAcc(null);
      return;
    }
    setLoadingAcc(true);
    fetchCustomer(customer.customer_code)
      .then(setAcc)
      .catch(() => setAcc(null))
      .finally(() => setLoadingAcc(false));
  }, [customer]);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await loginCustomer(c);
      login(res);
      setCode("");
    } catch {
      setErr(a.notFound);
    } finally {
      setBusy(false);
    }
  }

  /* ---------------- LOGIN VIEW ---------------- */
  if (ready && !customer) {
    return (
      <section className="section">
        <div className="container-x flex min-h-[55vh] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-line)] glass p-8 sm:p-10">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-accent)]/12 text-[var(--color-accent-light)]">
              <LogIn size={24} />
            </span>
            <h1 className="mt-6 text-[26px] font-semibold">{a.loginTitle}</h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-muted)]">{a.loginPrompt}</p>
            <form onSubmit={doLogin} className="mt-6 flex flex-col gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CUST-XXXXXXXXXX"
                className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] px-4 py-3 text-[15px] uppercase tracking-wide outline-none transition focus:border-[var(--color-accent)]"
                style={{ fontFamily: "var(--font-mono)" }}
              />
              {err && <p className="text-sm text-[var(--color-accent-light)]">{err}</p>}
              <button type="submit" disabled={busy} className="btn btn-primary w-full disabled:opacity-70">
                {busy ? <><Loader2 size={17} className="animate-spin" /> {a.checking}</> : <>{a.loginBtn}</>}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-[var(--color-faint)]">{a.loginHint}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!ready) {
    return (
      <section className="section">
        <div className="container-x flex min-h-[40vh] items-center justify-center text-[var(--color-muted)]">
          <Loader2 size={28} className="animate-spin text-[var(--color-accent)]" />
        </div>
      </section>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  const cust = acc?.customer;
  const tabs = [
    { key: "profile" as const, label: a.tabProfile, icon: User },
    { key: "sales" as const, label: a.tabSales, icon: Receipt },
    { key: "orders" as const, label: a.tabOrders, icon: Package },
    { key: "payments" as const, label: a.tabPayments, icon: CreditCard },
  ];
  const totalPurchased = (acc?.sales || []).reduce((s, x) => s + (x.total || 0), 0);

  return (
    <section className="section">
      <div className="container-x max-w-4xl">
        {/* header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow">{a.welcome}</span>
            <h1 className="mt-3 text-[clamp(24px,4vw,36px)] font-semibold">{customer?.name}</h1>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            <LogOut size={16} /> {a.logout}
          </button>
        </div>

        {/* tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-[var(--color-line)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-[14px] font-semibold transition ${
                tab === t.key
                  ? "border-[var(--color-accent)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {loadingAcc ? (
          <div className="flex justify-center py-20"><Loader2 size={26} className="animate-spin text-[var(--color-accent)]" /></div>
        ) : (
          <>
            {/* ===== PROFILE ===== */}
            {tab === "profile" && cust && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-3xl border border-[var(--color-line)] glass p-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-[22px] font-bold text-white" style={{ background: "linear-gradient(140deg,var(--color-accent),var(--color-accent-strong))" }}>
                    {(cust.name || "?")[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">{a.mijoz}</div>
                    <div className="truncate text-[18px] font-semibold">{cust.name}</div>
                    <div className="truncate text-[13px] text-[var(--color-muted)]" style={{ fontFamily: "var(--font-mono)" }}>
                      {cust.code}{cust.phone ? ` · ${cust.phone}` : ""}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--color-line)] glass p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">{a.debt}</div>
                    <div className="mt-1 text-[22px] font-bold" style={{ fontFamily: "var(--font-display)", color: cust.debt > 0 ? "var(--color-accent-light)" : undefined }}>{money(cust.debt || 0)}</div>
                    {Object.entries(cust.currency_debts || {}).map(([c, amt]) => (
                      <span key={c} className="mr-1.5 mt-1.5 inline-block rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-[12px] font-semibold text-[var(--color-accent-light)]">{fmtNum(amt)} {c}</span>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-[var(--color-line)] glass p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">{a.credit}</div>
                    <div className="mt-1 text-[22px] font-bold" style={{ fontFamily: "var(--font-display)", color: (cust.credit || 0) > 0 ? "var(--color-leaf)" : undefined }}>{money(cust.credit || 0)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] glass px-5 py-4">
                  <span className="text-[13px] font-medium text-[var(--color-muted)]">{a.totalPurchased}</span>
                  <span className="text-[17px] font-bold" style={{ fontFamily: "var(--font-display)" }}>{money(totalPurchased)}</span>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] px-3 py-2 text-[13px]">
                  <ShieldCheck size={15} className="text-[var(--color-accent-light)]" />
                  {a.priceType}: <b>{customer?.price_type_display}</b>
                </div>
              </div>
            )}

            {/* ===== SALES (expandable receipts) ===== */}
            {tab === "sales" && (
              (acc?.sales || []).length === 0 ? <Empty text={a.noSales} /> : (
                <div className="flex flex-col gap-3">
                  {acc!.sales.map((s, i) => {
                    const expanded = openSale === i;
                    const debt = +(s.debt || 0);
                    const debtStr = s.debt_currency && s.debt_currency_amount ? `${fmtNum(s.debt_currency_amount)} ${s.debt_currency}` : money(debt);
                    const breakdown = s.payment_breakdown || [];
                    return (
                      <div key={i} className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)]">
                        <button onClick={() => setOpenSale(expanded ? null : i)} className="flex w-full items-center gap-3 p-4 text-left">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-fill-2)] text-[var(--color-muted)]"><Receipt size={18} /></span>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{s.receipt_number || `#${i + 1}`}</div>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-[12px] text-[var(--color-faint)]">{shortDate(s.created_at, locale)}</span>
                              <span className="rounded-md bg-[var(--color-fill-2)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-silver-dim)]">{pm(s.payment_method)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>{money(+(s.total || 0))}</div>
                            {debt > 0 && <div className="text-[11px] font-bold text-[var(--color-accent-light)]">{a.debt}: {debtStr}</div>}
                          </div>
                          <ChevronDown size={16} className={`shrink-0 text-[var(--color-faint)] transition ${expanded ? "rotate-180" : ""}`} />
                        </button>
                        {expanded && (
                          <div className="border-t border-[var(--color-line)] bg-[var(--color-fill-1)] p-4">
                            <div className="flex flex-col gap-2">
                              {(s.items || []).map((it: OrderItem, j) => {
                                const sr = it.serial as SerialSpec | null;
                                const spec = sr ? [sr.storage, sr.color, sr.region, sr.battery != null ? `${sr.battery}%` : ""].filter(Boolean).join(" · ") : "";
                                return (
                                  <div key={j} className="flex justify-between gap-3 text-[13px]">
                                    <div className="min-w-0">
                                      <div className="text-[var(--color-ink)]">{it.name}</div>
                                      {sr && (
                                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--color-faint)]" style={{ fontFamily: "var(--font-mono)" }}>
                                          <Smartphone size={11} /> {sr.imei}{spec ? ` · ${spec}` : ""}
                                        </div>
                                      )}
                                    </div>
                                    <span className="whitespace-nowrap font-semibold">{it.qty} {it.unit} × {money(it.price)}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex flex-col gap-1.5 border-t border-dashed border-[var(--color-line)] pt-3 text-[12.5px]">
                              <Line label={a.paymentMethod} value={pm(s.payment_method)} />
                              {breakdown.length > 1 && breakdown.map((b, k) => (
                                <Line key={k} label={`· ${pm(b.method)}`} value={money(+(b.amount || 0))} muted />
                              ))}
                              <Line label={a.paid} value={money(+(s.paid || 0))} />
                              {debt > 0 && <Line label={a.onCredit} value={debtStr} danger />}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* ===== ORDERS ===== */}
            {tab === "orders" && (
              (acc?.online_orders || []).length === 0 ? <Empty text={a.noOrders} /> : (
                <div className="flex flex-col gap-3">
                  {acc!.online_orders.map((o, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-fill-2)] text-[var(--color-muted)]"><Package size={18} /></span>
                        <div>
                          <div className="font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{o.order_no || `#${i + 1}`}</div>
                          <div className="text-[12px] text-[var(--color-faint)]">{shortDate(o.created_at, locale)} · {o.items.length} {a.items}</div>
                          <div className="mt-1 text-[15px] font-bold" style={{ fontFamily: "var(--font-display)" }}>{money(+(o.total || 0))}</div>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold" style={{ color: stColor(o.status), background: `${stColor(o.status)}1a` }}>
                        {stLabel(o.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ===== PAYMENTS ===== */}
            {tab === "payments" && (
              (acc?.payments || []).length === 0 ? <Empty text={a.noPayments} /> : (
                <div className="flex flex-col gap-3">
                  {acc!.payments.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-4">
                      <div className="min-w-0">
                        <div className="text-[16px] font-bold text-[var(--color-leaf)]">+{money(+(p.amount || 0))}</div>
                        <div className="text-[12px] text-[var(--color-faint)]">{shortDate(p.created_at, locale)}</div>
                        {p.note && <div className="truncate text-[12px] text-[var(--color-faint)]">{p.note}</div>}
                      </div>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-leaf)]/12 text-[var(--color-leaf)]"><CreditCard size={17} /></span>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

        <div className="mt-10">
          <Link href={`/${locale}/shop`} className="btn btn-primary">
            <ShoppingBag size={17} /> {a.goShop}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Line({ label, value, muted, danger }: { label: string; value: string; muted?: boolean; danger?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={muted ? "text-[var(--color-faint)]" : danger ? "text-[var(--color-accent-light)]" : "text-[var(--color-muted)]"}>{label}</span>
      <span className={`font-semibold ${danger ? "text-[var(--color-accent-light)]" : "text-[var(--color-ink)]"}`}>{value}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-[var(--color-line)] py-16 text-center text-[var(--color-muted)]">{text}</div>;
}
