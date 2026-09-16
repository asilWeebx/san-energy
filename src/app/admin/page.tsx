"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IMAGES_API, type SiteImage } from "@/lib/siteImages";

const KEY_LS = "sanhydro_admin_key";
const SECTIONS: { key: string; label: string; hint: string }[] = [
  { key: "gallery", label: "Galereya / slayder", hint: "Bosh sahifada aylanadigan rasmlar" },
  { key: "about", label: "Biz haqimizda", hint: "«Biz haqimizda» sahifasi rasmlari" },
  { key: "hero", label: "Hero (yuqori fon)", hint: "Bosh sahifa tepasidagi katta fon" },
];

const RED = "#e4142f";

export default function AdminPage() {
  const [key, setKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setKey(localStorage.getItem(KEY_LS));
    } catch {}
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!key) return <Login onLogin={setKey} />;
  return <Dashboard adminKey={key} onLogout={() => { try { localStorage.removeItem(KEY_LS); } catch {} setKey(null); }} />;
}

// ─── Login ─────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: (k: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await fetch(`${IMAGES_API}/api/admin/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const d = await r.json();
      if (r.ok && d.ok) {
        try { localStorage.setItem(KEY_LS, d.token); } catch {}
        onLogin(d.token);
      } else {
        setErr(d.error || "Parol noto'g'ri");
      }
    } catch {
      setErr("Serverga ulanib bo'lmadi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f5f3", padding: 20 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,.08)", border: "1px solid #eceae7" }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em", marginBottom: 4 }}>
          SAN HYDRO <span style={{ color: RED }}>ENERGY</span>
        </div>
        <p style={{ color: "#78716c", fontSize: 13, marginBottom: 20 }}>Rasmlar admin paneli</p>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#57534e" }}>Parol</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          placeholder="••••••••"
          style={{ width: "100%", marginTop: 6, marginBottom: 4, padding: "12px 14px", borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 14, outline: "none" }}
        />
        {err && <p style={{ color: RED, fontSize: 12.5, marginTop: 6 }}>{err}</p>}
        <button
          type="submit"
          disabled={busy || !pw}
          style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 12, border: "none", background: RED, color: "#fff", fontWeight: 700, fontSize: 15, cursor: busy ? "default" : "pointer", opacity: busy || !pw ? 0.6 : 1 }}
        >
          {busy ? "..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────
function Dashboard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const [section, setSection] = useState("gallery");
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${IMAGES_API}/api/admin/images/?section=${section}`, {
        headers: { "X-Admin-Key": adminKey },
      });
      if (r.status === 401) { onLogout(); return; }
      setImages(r.ok ? await r.json() : []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [section, adminKey, onLogout]);

  useEffect(() => { load(); }, [load]);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMsg("");
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("section", section);
        fd.append("image", f);
        const r = await fetch(`${IMAGES_API}/api/admin/images/`, {
          method: "POST",
          headers: { "X-Admin-Key": adminKey },
          body: fd,
        });
        if (!r.ok) { setMsg("Ba'zi rasmlar yuklanmadi"); }
      }
      await load();
      setMsg(`${files.length} ta rasm yuklandi ✓`);
    } catch {
      setMsg("Yuklashda xatolik");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id: number) {
    if (!confirm("Rasmni o'chirasizmi?")) return;
    await fetch(`${IMAGES_API}/api/admin/images/${id}/`, {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey },
    });
    await load();
  }

  async function toggle(img: SiteImage) {
    await fetch(`${IMAGES_API}/api/admin/images/${img.id}/`, {
      method: "PATCH",
      headers: { "X-Admin-Key": adminKey, "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !img.is_active }),
    });
    await load();
  }

  async function setOrder(img: SiteImage, order: number) {
    await fetch(`${IMAGES_API}/api/admin/images/${img.id}/`, {
      method: "PATCH",
      headers: { "X-Admin-Key": adminKey, "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    await load();
  }

  const [drag, setDrag] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f6f5f3", color: "#1c1917" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eceae7", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em", flex: 1 }}>
            SAN HYDRO <span style={{ color: RED }}>ENERGY</span> <span style={{ color: "#a8a29e", fontWeight: 600, fontSize: 13 }}>· admin</span>
          </div>
          <a href="/" style={{ fontSize: 13, color: "#57534e", textDecoration: "none" }}>← Saytga</a>
          <button onClick={onLogout} style={{ fontSize: 13, color: RED, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Chiqish</button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
        {/* Section tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              style={{
                padding: "9px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                border: section === s.key ? `1px solid ${RED}` : "1px solid #e7e5e4",
                background: section === s.key ? RED : "#fff",
                color: section === s.key ? "#fff" : "#57534e",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p style={{ color: "#78716c", fontSize: 13, marginBottom: 14 }}>
          {SECTIONS.find((s) => s.key === section)?.hint}
        </p>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${drag ? RED : "#d6d3d1"}`, borderRadius: 16, padding: "28px 20px",
            textAlign: "center", cursor: "pointer", background: drag ? "rgba(228,20,47,.04)" : "#fff", transition: "all .15s",
          }}
        >
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#44403c" }}>
            {uploading ? "Yuklanmoqda..." : "Rasm(lar)ni bu yerga tashlang yoki bosing"}
          </div>
          <div style={{ fontSize: 12.5, color: "#a8a29e", marginTop: 4 }}>Bir nechta rasm birga · JP/PNG/WebP</div>
        </div>
        {msg && <p style={{ color: RED, fontSize: 13, marginTop: 10, fontWeight: 600 }}>{msg}</p>}

        {/* Grid */}
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14 }}>
          {loading ? (
            <p style={{ color: "#a8a29e", gridColumn: "1/-1" }}>Yuklanmoqda...</p>
          ) : images.length === 0 ? (
            <p style={{ color: "#a8a29e", gridColumn: "1/-1" }}>Hali rasm yo'q. Yuqoridan qo'shing.</p>
          ) : (
            images.map((img) => (
              <div key={img.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eceae7", opacity: img.is_active ? 1 : 0.5 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.title} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
                <div style={{ padding: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "#78716c" }}>Tartib:</span>
                    <input
                      type="number"
                      defaultValue={img.order}
                      onBlur={(e) => { const v = Number(e.target.value); if (v !== img.order) setOrder(img, v); }}
                      style={{ width: 52, padding: "3px 6px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 12 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => toggle(img)} style={{ flex: 1, fontSize: 12, padding: "6px", borderRadius: 8, border: "1px solid #e7e5e4", background: "#fff", cursor: "pointer", color: img.is_active ? "#16a34a" : "#a8a29e", fontWeight: 600 }}>
                      {img.is_active ? "Faol" : "Nofaol"}
                    </button>
                    <button onClick={() => remove(img.id)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", color: RED, fontWeight: 600 }}>
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
