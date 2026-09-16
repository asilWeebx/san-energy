"use client";

import { useState } from "react";

/**
 * Klaviaturadan miqdor kiritish uchun maydon.
 * Foydalanuvchi bo'sh qilib qayta yozishi mumkin — faqat to'g'ri (>=1) qiymat
 * onCommit orqali savatga yoziladi, shuning uchun tovar tasodifan o'chib ketmaydi.
 */
export function QtyInput({
  value,
  max,
  onCommit,
  className = "",
}: {
  value: number;
  max?: number;
  onCommit: (n: number) => void;
  className?: string;
}) {
  const [txt, setTxt] = useState(String(value));
  // Prop o'zgarganda matnni render vaqtida moslash (effekt shart emas)
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setTxt(String(value));
  }

  const clamp = (n: number) => (max != null && Number.isFinite(max) ? Math.min(n, max) : n);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={txt}
      aria-label="Miqdor"
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const clean = e.target.value.replace(/[^\d]/g, "");
        setTxt(clean);
        const n = parseInt(clean, 10);
        if (!Number.isNaN(n) && n >= 1) onCommit(clamp(n));
      }}
      onBlur={() => {
        const n = parseInt(txt, 10);
        if (Number.isNaN(n) || n < 1) {
          setTxt(String(value));
        } else {
          const c = clamp(n);
          setTxt(String(c));
          onCommit(c);
        }
      }}
      className={`bg-transparent text-center font-semibold tabular-nums outline-none ${className}`}
    />
  );
}
