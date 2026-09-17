"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LMap } from "leaflet";
import { MapPin, LocateFixed } from "lucide-react";
import { site } from "@/lib/site";

// Guliston, O'zbekiston (default)
const DEFAULT: [number, number] = [site.mapLat, site.mapLng];

export function MapPicker({
  onChange,
  labels,
}: {
  onChange: (lat: number, lng: number, address?: string) => void;
  labels: { selected: string; locate: string; locating: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const geoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [coords, setCoords] = useState<[number, number]>(DEFAULT);
  const [address, setAddress] = useState<string>("");
  const [geoBusy, setGeoBusy] = useState(false);
  const [locating, setLocating] = useState(false);

  async function reverse(lat: number, lng: number) {
    setGeoBusy(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=uz,ru,en`,
        { headers: { Accept: "application/json" } }
      );
      const d = await r.json();
      const addr = (d && d.display_name) || "";
      setAddress(addr);
      onChangeRef.current(lat, lng, addr || undefined);
    } catch {
      onChangeRef.current(lat, lng);
    } finally {
      setGeoBusy(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    let map: LMap | undefined;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;
      map = L.map(containerRef.current, { zoomControl: true, attributionControl: false }).setView(DEFAULT, 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      map.on("moveend", () => {
        const c = map!.getCenter();
        setCoords([c.lat, c.lng]);
        onChangeRef.current(c.lat, c.lng);
        if (geoTimer.current) clearTimeout(geoTimer.current);
        geoTimer.current = setTimeout(() => reverse(c.lat, c.lng), 500);
      });
      mapRef.current = map;
      onChangeRef.current(DEFAULT[0], DEFAULT[1]);
      reverse(DEFAULT[0], DEFAULT[1]);
    })();
    return () => {
      cancelled = true;
      if (geoTimer.current) clearTimeout(geoTimer.current);
      if (map) map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function locate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 16);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
      <div className="relative">
        <div ref={containerRef} className="h-[240px] w-full" style={{ background: "#0e0e10" }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-full">
          <MapPin size={38} className="drop-shadow-lg" style={{ color: "var(--color-accent)", fill: "var(--color-accent)" }} />
        </div>
        <button
          type="button"
          onClick={locate}
          className="absolute bottom-3 right-3 z-[500] inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)]/95 px-3 py-2 text-[13px] font-semibold text-[var(--color-ink)] shadow-lg backdrop-blur"
        >
          <LocateFixed size={15} className={locating ? "animate-pulse text-[var(--color-accent-light)]" : "text-[var(--color-accent-light)]"} />
          {locating ? labels.locating : labels.locate}
        </button>
      </div>
      <div className="border-t border-[var(--color-line)] bg-[var(--color-fill-1)] px-4 py-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-faint)]">{labels.selected}</div>
        <div className="mt-1 text-[13.5px] text-[var(--color-silver-dim)]">
          {geoBusy ? labels.locating : address || `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`}
        </div>
      </div>
    </div>
  );
}
