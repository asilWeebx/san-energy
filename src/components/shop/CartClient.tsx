"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  User,
} from "lucide-react";
import { MapPicker } from "./MapPicker";
import { ShopImage } from "./ShopImage";
import { QtyInput } from "./QtyInput";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { StoreInfo } from "@/lib/shop/types";
import { useCart } from "@/components/providers/CartProvider";
import { useCustomer } from "@/components/providers/CustomerProvider";
import { fetchInfo, placeOrder } from "@/lib/shop/client";
import { money } from "@/lib/format";

export function CartClient({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const { lines, setQty, remove, clear, ready } = useCart();
  const { customer } = useCustomer();
  const [info, setInfo] = useState<StoreInfo | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<"courier" | "pickup">("courier");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [payment, setPayment] = useState<"cash" | "card">("cash");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ order_no: string } | null>(null);

  useEffect(() => {
    fetchInfo().then(setInfo).catch(() => {});
  }, []);
  useEffect(() => {
    if (customer) {
      setName((n) => n || customer.name || "");
      setPhone((ph) => ph || customer.phone || "");
    }
  }, [customer]);

  const baseLabel = info?.currency || dict.common.som;

  const totals = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of lines) {
      m.set(l.currency, (m.get(l.currency) || 0) + l.cur_price * l.qty);
    }
    return Array.from(m.entries());
  }, [lines]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErr(dict.cart.fillFields);
      return;
    }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await placeOrder(lines, {
        customer_name: name.trim(),
        phone: phone.trim(),
        customer_code: customer?.customer_code,
        delivery_type: delivery,
        payment_method: payment,
        address: delivery === "courier" ? address.trim() || undefined : undefined,
        landmark: delivery === "courier" ? landmark.trim() || undefined : undefined,
        latitude: delivery === "courier" && coords ? coords.lat : undefined,
        longitude: delivery === "courier" && coords ? coords.lng : undefined,
        note: note.trim() || undefined,
      });
      setDone({ order_no: res.order_no });
      clear();
    } catch (e2) {
      setErr(e2 instanceof Error && e2.message ? e2.message : dict.cart.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="section">
        <div className="container-x flex min-h-[50vh] flex-col items-center justify-center text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-leaf)]/15 text-[var(--color-leaf)]">
            <CheckCircle2 size={44} />
          </span>
          <h1 className="mt-6 text-[clamp(26px,4vw,38px)] font-semibold">{dict.cart.successTitle}</h1>
          <p className="mt-3 text-[var(--color-muted)]">{dict.cart.successText}</p>
          <div className="mt-5 rounded-2xl border border-[var(--color-line)] glass px-6 py-4">
            <span className="text-sm text-[var(--color-faint)]">{dict.cart.orderNo}</span>
            <div className="mt-1 text-[22px] font-bold" style={{ fontFamily: "var(--font-mono)" }}>
              {done.order_no}
            </div>
          </div>
          <Link href={`/${locale}/shop`} className="btn btn-primary mt-8">
            {dict.cart.continue}
          </Link>
        </div>
      </section>
    );
  }

  if (ready && lines.length === 0) {
    return (
      <section className="section">
        <div className="container-x flex min-h-[50vh] flex-col items-center justify-center text-center text-[var(--color-muted)]">
          <span className="grid h-20 w-20 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-fill-1)]">
            <ShoppingCart size={38} strokeWidth={1.3} />
          </span>
          <h1 className="mt-6 text-[26px] font-semibold text-[var(--color-ink)]">{dict.cart.empty}</h1>
          <Link href={`/${locale}/shop`} className="btn btn-primary mt-6">
            <ArrowLeft size={17} /> {dict.cart.backToShop}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x">
        <div className="mb-8 flex items-center gap-3">
          <Link href={`/${locale}/shop`} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-2)] hover:bg-[var(--color-fill-3)] transition">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[clamp(26px,4vw,40px)] font-semibold">{dict.cart.title}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* lines */}
          <div className="flex flex-col gap-3">
            {lines.map((l) => (
              <div key={l.key} className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] glass p-3.5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--color-fill-1)]">
                  <ShopImage src={l.image} alt={l.name} iconSize={22} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-semibold">{l.name}</h3>
                  {l.variant_name && <p className="text-[13px] text-[var(--color-muted)]">{l.variant_name}</p>}
                  <p className="mt-0.5 text-[14px] font-medium text-[var(--color-accent-light)]">
                    {money(l.cur_price, l.currency, baseLabel)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-[var(--color-line)] p-1">
                  <button onClick={() => setQty(l.key, l.qty - 1)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[var(--color-fill-2)]" aria-label="-">
                    <Minus size={15} />
                  </button>
                  <QtyInput
                    value={l.qty}
                    max={l.maxQty ?? undefined}
                    onCommit={(n) => setQty(l.key, n)}
                    className="w-10 rounded-lg px-1 py-1 text-[15px] focus:bg-[var(--color-fill-2)]"
                  />
                  <button
                    onClick={() => setQty(l.key, l.qty + 1)}
                    disabled={l.maxQty != null && l.qty >= l.maxQty}
                    className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[var(--color-fill-2)] disabled:cursor-not-allowed disabled:text-[var(--color-faint)]"
                    aria-label="+"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <button onClick={() => remove(l.key)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[var(--color-faint)] hover:bg-[var(--color-fill-2)] hover:text-[var(--color-accent)]" aria-label={dict.cart.remove}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          {/* checkout */}
          <form onSubmit={submit} className="rounded-3xl border border-[var(--color-line)] glass p-6 lg:sticky lg:top-[90px]">
            <h2 className="text-[20px] font-semibold">{dict.cart.checkout}</h2>

            {customer && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] px-3 py-2.5 text-[13px] text-[var(--color-silver-dim)]">
                <User size={15} className="text-[var(--color-accent-light)]" />
                {dict.cart.loggedInAs} <b className="text-[var(--color-ink)]">{customer.name}</b>
                <span className="ml-auto rounded-md bg-[var(--color-accent)]/15 px-2 py-0.5 text-[11px] font-semibold text-[var(--color-accent-light)]">
                  {customer.price_type_display}
                </span>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3">
              <Field label={dict.cart.customerName}>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" />
              </Field>
              <Field label={dict.cart.phone}>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={inputCls} autoComplete="tel" placeholder="+998" />
              </Field>

              <div>
                <Label>{dict.cart.delivery}</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <Toggle active={delivery === "courier"} onClick={() => setDelivery("courier")}>{dict.cart.courier}</Toggle>
                  <Toggle active={delivery === "pickup"} onClick={() => setDelivery("pickup")}>{dict.cart.pickup}</Toggle>
                </div>
              </div>
              {delivery === "courier" && (
                <>
                  <Field label={dict.cart.address}>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label={dict.cart.landmark}>
                    <input value={landmark} onChange={(e) => setLandmark(e.target.value)} className={inputCls} />
                  </Field>
                  <div>
                    <Label>{dict.cart.pickLocation}</Label>
                    <p className="mb-1.5 mt-0.5 text-[12px] text-[var(--color-faint)]">{dict.cart.dragHint}</p>
                    <MapPicker
                      onChange={(lat, lng, addr) => {
                        setCoords({ lat, lng });
                        if (addr) setAddress(addr);
                      }}
                      labels={{
                        selected: dict.cart.selectedPoint,
                        locate: dict.cart.locateMe,
                        locating: dict.shop.locating,
                      }}
                    />
                  </div>
                </>
              )}

              <div>
                <Label>{dict.cart.payment}</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <Toggle active={payment === "cash"} onClick={() => setPayment("cash")}>{dict.cart.cash}</Toggle>
                  <Toggle active={payment === "card"} onClick={() => setPayment("card")}>{dict.cart.card}</Toggle>
                </div>
              </div>

              <Field label={dict.cart.note}>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} className={`${inputCls} min-h-16 resize-none`} />
              </Field>
            </div>

            <div className="mt-5 space-y-1 border-t border-[var(--color-line)] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold">{dict.cart.total}</span>
                <div className="text-right">
                  {totals.map(([cur, sum]) => (
                    <div key={cur} className="text-[20px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                      {money(sum, cur, baseLabel)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {err && <p className="mt-3 rounded-lg bg-[var(--color-accent)]/10 px-3 py-2 text-[13px] text-[var(--color-accent-light)]">{err}</p>}

            <button type="submit" disabled={submitting} className="btn btn-primary mt-4 w-full disabled:opacity-70">
              {submitting ? <><Loader2 size={17} className="animate-spin" /> {dict.cart.placing}</> : dict.cart.placeOrder}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-fill-1)] px-3.5 py-2.5 text-[15px] outline-none transition focus:border-[var(--color-accent)]";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[13px] font-semibold text-[var(--color-muted)]">{children}</span>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-[14px] font-semibold transition ${
        active ? "border-[var(--color-accent)] bg-[var(--color-accent)]/12 text-[var(--color-ink)]" : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}
