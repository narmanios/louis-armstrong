import React, { useState, useEffect, useRef, useMemo } from "react";
import jazzDiplomacyData from "../../../public/assets/data/jazz-diplomacy.json";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TourEntry {
  country: string;
  year: string;
  number_of_events: number;
  lat: number;
  lng: number;
}
interface CountryPin {
  id: string;
  country: string;
  lat: number;
  lng: number;
  musicians: string[];
  tours: TourEntry[];
  totalEvents: number;
}
interface MusicianDot {
  id: string;
  country: string;
  musician: string;
  lat: number;
  lng: number;
  events: number;
  years: string[];
  pin: CountryPin;
}
type LeafletMap = {
  remove(): void;
  setView(latlng: [number, number], zoom: number): LeafletMap;
  getZoom(): number;
  zoomIn(): LeafletMap;
  zoomOut(): LeafletMap;
};
type LeafletMarker = {
  remove(): void;
};
declare global {
  interface Window {
    L: {
      map(el: HTMLElement, opts?: object): LeafletMap;
      tileLayer(
        url: string,
        opts?: object,
      ): {
        addTo(m: LeafletMap): void;
      };
      divIcon(opts: object): object;
      marker(
        latlng: [number, number],
        opts?: object,
      ): LeafletMarker & {
        addTo(m: LeafletMap): LeafletMarker & {
          on(ev: string, fn: () => void): void;
          bindPopup(html: string, opts?: object): void;
          openPopup(): void;
        };
        on(ev: string, fn: () => void): void;
        bindPopup(html: string, opts?: object): void;
        openPopup(): void;
      };
    };
  }
}

// ─── Musician Colors ───────────────────────────────────────────────────────────

const MUSICIAN_COLORS: Record<string, string> = {
  "Louis Armstrong": "#f59e0b",
  "Dave Brubeck": "#3b82f6",
  "Dizzy Gillespie": "#ef4444",
  "Duke Ellington": "#8b5cf6",
  "Benny Goodman": "#10b981",
};
const MUSICIANS = Object.keys(MUSICIAN_COLORS);

// ─── Build Country Pins ────────────────────────────────────────────────────────

function buildCountryPins(): CountryPin[] {
  const map = new Map<string, CountryPin>();

  MUSICIANS.forEach((musician) => {
    const musicianData =
      jazzDiplomacyData[musician as keyof typeof jazzDiplomacyData];
    if (!musicianData?.trips) return;

    musicianData.trips.forEach((trip) => {
      if (!map.has(trip.country)) {
        map.set(trip.country, {
          id: trip.country,
          country: trip.country,
          lat: trip.lat,
          lng: trip.lng,
          musicians: [],
          tours: [],
          totalEvents: 0,
        });
      }
      const pin = map.get(trip.country)!;
      if (!pin.musicians.includes(musician)) pin.musicians.push(musician);
      pin.tours.push({
        country: musician,
        year: trip.year,
        number_of_events: trip.number_of_events,
        lat: trip.lat,
        lng: trip.lng,
      });
      pin.totalEvents += trip.number_of_events;
    });
  });
  return Array.from(map.values());
}
const COUNTRY_PINS = buildCountryPins();

// ─── Build per-musician dots ───────────────────────────────────────────────────

const CLUSTER_RADIUS_DEG = 0.9;
function buildMusicianDots(): MusicianDot[] {
  const dots: MusicianDot[] = [];
  COUNTRY_PINS.forEach((pin) => {
    const n = pin.musicians.length;
    pin.musicians.forEach((musician, idx) => {
      const angle = n === 1 ? 0 : (idx / n) * 2 * Math.PI - Math.PI / 2;
      const radius = n === 1 ? 0 : CLUSTER_RADIUS_DEG;
      const lat = pin.lat + radius * Math.sin(angle);
      const lng = pin.lng + radius * Math.cos(angle);

      const musicianData =
        jazzDiplomacyData[musician as keyof typeof jazzDiplomacyData];
      const tourEntries =
        musicianData?.trips.filter((t) => t.country === pin.country) || [];

      const events = tourEntries.reduce(
        (sum, t) => sum + t.number_of_events,
        0,
      );
      const years = tourEntries.map((t) => t.year);
      dots.push({
        id: `${pin.country}__${musician}`,
        country: pin.country,
        musician,
        lat,
        lng,
        events,
        years,
        pin,
      });
    });
  });
  return dots;
}
const ALL_MUSICIAN_DOTS = buildMusicianDots();

// ─── Leaflet CDN loader ────────────────────────────────────────────────────────

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.head.appendChild(script);
  });
}
function buildDotHtml(dot: MusicianDot): string {
  const color = MUSICIAN_COLORS[dot.musician] || "#64748b";
  const size = Math.min(9 + Math.round(dot.events * 0.6), 19);
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};box-shadow:0 0 0 2px white,0 2px 6px ${color}70;cursor:pointer;transition:transform .12s,box-shadow .12s;" onmouseenter="this.style.transform='scale(1.35)';this.style.boxShadow='0 0 0 2px white,0 3px 10px ${color}90';" onmouseleave="this.style.transform='scale(1)';this.style.boxShadow='0 0 0 2px white,0 2px 6px ${color}70';"></div>`;
}
function buildDotPopupHtml(dot: MusicianDot): string {
  const color = MUSICIAN_COLORS[dot.musician] || "#64748b";
  const yearsStr = dot.years.join(", ");
  return `<div style="font-family:Inter,system-ui,sans-serif;min-width:200px;max-width:260px;background:rgba(0,0,0,0.92);border-radius:6px;"><div style="padding:12px 14px 10px;border-bottom:1px solid ${color}40;"><div style="font-size:13px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;line-height:1.2;">${dot.country}</div><div style="display:flex;align-items:center;gap:6px;margin-top:5px;"><div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></div><div style="font-size:10px;line-height:1.35;font-weight:600;color:${color};">${dot.musician}</div></div></div><div style="padding:10px 14px 12px;"><div style="font-size:10px;line-height:1.35;color:rgba(255,255,255,0.6);margin-bottom:4px;"><span style="font-weight:600;color:#ffffff;font-size:13px;">${dot.events}</span>&nbsp;${dot.events === 1 ? "event" : "events"}</div><div style="font-size:10px;line-height:1.35;color:rgba(255,255,255,0.5);">${yearsStr}</div></div></div>`;
}

// ─── LeafletMap component ──────────────────────────────────────────────────────

interface LeafletMapProps {
  dots: MusicianDot[];
  onMapReady?: (map: LeafletMap) => void;
}
const LeafletMapView: React.FC<LeafletMapProps> = ({ dots, onMapReady }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadLeaflet()
      .then(() => setReady(true))
      .catch(console.error);
  }, []);
  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: false,
      maxBoundsViscosity: 1.0,
      minZoom: 2.75,
      maxZoom: 6,
    }).setView([10, 30], 1);

    if (onMapReady && mapInstanceRef.current) {
      onMapReady(mapInstanceRef.current);
    }
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap &copy; CartoDB",
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(mapInstanceRef.current);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
      {
        attribution: "",
        subdomains: "abcd",
        maxZoom: 19,
        pane: "shadowPane",
      },
    ).addTo(mapInstanceRef.current);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [ready]);
  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    dots.forEach((dot) => {
      const size = Math.min(9 + Math.round(dot.events * 0.6), 19);
      const icon = L.divIcon({
        html: buildDotHtml(dot),
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2) - 4],
      });
      const marker = L.marker([dot.lat, dot.lng] as [number, number], {
        icon,
      }).addTo(map);
      marker.bindPopup(buildDotPopupHtml(dot), {
        maxWidth: 280,
        className: "jazz-popup",
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
      });
      marker.on("click", () => {
        marker.openPopup();
      });
      markersRef.current.push(marker);
    });
  }, [ready, dots]);
  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{
        background: "#e8eef4",
      }}
    />
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const JazzAmbassadorsMap: React.FC = () => {
  const [hiddenMusicians, setHiddenMusicians] = useState<Set<string>>(
    new Set(),
  );
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };
  const toggleMusician = (musician: string) => {
    setHiddenMusicians((prev) => {
      const next = new Set(prev);
      if (next.has(musician)) {
        next.delete(musician);
      } else {
        next.add(musician);
      }
      return next;
    });
  };
  const allVisible = hiddenMusicians.size === 0;
  const showAll = () => setHiddenMusicians(new Set());
  const visibleDots = useMemo(
    () => ALL_MUSICIAN_DOTS.filter((d) => !hiddenMusicians.has(d.musician)),
    [hiddenMusicians],
  );
  return (
    <div
      className="flex flex-col w-full h-screen"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#ffffff",
      }}
    >
      <style>{`
        .jazz-popup .leaflet-popup-content-wrapper {
          border-radius: 12px; padding: 0; overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(0,0,0,0.92);
        }
        .jazz-popup .leaflet-popup-content { margin: 0; line-height: 1.4; }
        .jazz-popup .leaflet-popup-tip-container { margin-top: -1px; }
        .jazz-popup .leaflet-popup-tip {
          background: rgba(0,0,0,0.92);
          box-shadow: none;
        }
        .jazz-popup .leaflet-popup-close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #ffffff !important;
          font-size: 20px;
          font-weight: 300;
          line-height: 28px;
          text-align: center;
          cursor: pointer;
          z-index: 1000;
          pointer-events: auto;
          display: block !important;
        }
        .jazz-popup .leaflet-popup-close-button:hover {
          opacity: 0.7;
          background: transparent !important;
        }
        .jazz-popup .leaflet-popup-content-wrapper {
          pointer-events: auto;
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,0.85) !important;
          border-radius: 6px 0 0 0 !important;
        }
        header h1.mcg-page-title {
          color: #000000 !important;
        }
      `}</style>

      {/* ── Top header / legend bar ── */}
      <header
        className="flex-shrink-0 flex flex-col items-start gap-3"
        style={{
          width: "100%",
          margin: "0",
          padding: "0 56px 0",
          background: "#ffffff",
        }}
      >
        {/* Title block */}
        <div className="flex-shrink-0">
          <h1
            className="mcg-page-title mcg-page-title--flow"
            style={{ color: "#000000" }}
          >
            Jazz Diplomacy Tours
          </h1>
        </div>

        <div
          className="flex items-center gap-4 flex-wrap"
          style={{ width: "100%" }}
        >
          <p
            className="flex-shrink-0 tracking-widest"
            style={{
              marginBottom: "2px",
              fontFamily: '"Hanken Grotesk", Arial, sans-serif',
              fontSize: "14px",
              fontWeight: 400,
              color: "#6b7280",
            }}
          >
            Artists
          </p>

          {/* Artist toggle pills — horizontal row */}
          <div
            className="flex items-center gap-2 flex-wrap"
            style={{ marginBottom: "2px" }}
          >
            {MUSICIANS.map((musician) => {
              const hidden = hiddenMusicians.has(musician);
              const color = MUSICIAN_COLORS[musician];
              return (
                <button
                  key={musician}
                  onClick={() => toggleMusician(musician)}
                  className="flex items-center gap-2 px-1 py-1.5 transition-all text-left"
                  style={{
                    opacity: hidden ? 0.35 : 1,
                  }}
                  aria-pressed={!hidden}
                  aria-label={`${hidden ? "Show" : "Hide"} ${musician}`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                    style={{
                      background: hidden ? "#cbd5e1" : color,
                      boxShadow: hidden
                        ? "none"
                        : `0 0 0 2px white, 0 1px 3px ${color}60`,
                    }}
                  />
                  <span
                    className="whitespace-nowrap transition-colors"
                    style={{
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      fontSize: "14px",
                      fontWeight: 400,
                      color: hidden ? "#94a3b8" : "#334155",
                    }}
                  >
                    {musician}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Show all — only appears when some are hidden */}
          {!allVisible && (
            <button
              onClick={showAll}
              className="flex-shrink-0 transition-colors underline underline-offset-2"
              style={{
                marginBottom: "2px",
                fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                color: "#9ca3af",
              }}
            >
              Show all
            </button>
          )}
        </div>
      </header>

      {/* ── Map frame ── */}
      <div className="flex-1 min-h-0 px-16 pb-12 pt-8">
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "16px",
            border: "1.5px solid #e2e8f0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            maxWidth: "1400px",
            maxHeight: "700px",
            width: "100%",
            height: "100%",
            margin: "0 auto",
            pointerEvents: "none",
          }}
        >
          <div className="relative w-full h-full">
            <LeafletMapView
              dots={visibleDots}
              onMapReady={(map) => {
                mapInstanceRef.current = map;
              }}
            />

            {/* Zoom Controls */}
            <div
              className="absolute top-4 right-4 flex flex-col gap-1"
              style={{
                zIndex: 1000,
                pointerEvents: "auto",
              }}
            >
              <button
                onClick={handleZoomIn}
                className="bg-white hover:bg-gray-50 text-slate-700 font-bold transition-colors"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                aria-label="Zoom in"
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white hover:bg-gray-50 text-slate-700 font-bold transition-colors"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                aria-label="Zoom out"
                title="Zoom out"
              >
                −
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JazzAmbassadorsMap;
