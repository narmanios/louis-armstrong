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
function buildDotHtml(dot: MusicianDot, scale = 1): string {
  const color = MUSICIAN_COLORS[dot.musician] || "#64748b";
  const baseSize = Math.min(9 + Math.round(dot.events * 0.6), 19);
  const size = Math.round(baseSize * scale);
  const borderWidth = Math.round(0.5 * scale);
  const shadowBlur = Math.round(6 * scale);
  const hoverShadowBlur = Math.round(10 * scale);
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};box-shadow:0 0 0 ${borderWidth}px black,0 ${Math.round(2 * scale)}px ${shadowBlur}px ${color}70;cursor:pointer;transition:transform .12s,box-shadow .12s;" onmouseenter="this.style.transform='scale(1.35)';this.style.boxShadow='0 0 0 ${borderWidth}px black,0 ${Math.round(3 * scale)}px ${hoverShadowBlur}px ${color}90';" onmouseleave="this.style.transform='scale(1)';this.style.boxShadow='0 0 0 ${borderWidth}px black,0 ${Math.round(2 * scale)}px ${shadowBlur}px ${color}70';"></div>`;
}
function buildDotPopupHtml(dot: MusicianDot, scale = 1): string {
  const color = MUSICIAN_COLORS[dot.musician] || "#64748b";
  const yearsStr = dot.years.join(", ");
  const minWidth = Math.round(240 * scale);
  const maxWidth = Math.round(320 * scale);
  const borderRadius = Math.round(6 * scale);
  const padding1 = `${Math.round(12 * scale)}px ${Math.round(14 * scale)}px ${Math.round(10 * scale)}px`;
  const padding2 = `${Math.round(10 * scale)}px ${Math.round(14 * scale)}px ${Math.round(12 * scale)}px`;
  const fontSize13 = Math.round(13 * scale);
  const fontSize10 = Math.round(10 * scale);
  const dotSize = Math.round(8 * scale);
  const gap = Math.round(6 * scale);
  const marginTop = Math.round(5 * scale);
  const marginBottom = Math.round(4 * scale);
  return `<div style="font-family:Inter,system-ui,sans-serif;min-width:${minWidth}px;max-width:${maxWidth}px;background:rgba(0,0,0,0.92);border-radius:${borderRadius}px;"><div style="padding:${padding1};border-bottom:1px solid ${color}40;"><div style="font-size:${fontSize13}px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;line-height:1.2;">${dot.country}</div><div style="display:flex;align-items:center;gap:${gap}px;margin-top:${marginTop}px;"><div style="width:${dotSize}px;height:${dotSize}px;border-radius:50%;background:${color};flex-shrink:0;"></div><div style="font-size:${fontSize10}px;line-height:1.35;font-weight:600;color:${color};">${dot.musician}</div></div></div><div style="padding:${padding2};"><div style="font-size:${fontSize10}px;line-height:1.35;color:rgba(255,255,255,0.6);margin-bottom:${marginBottom}px;"><span style="font-weight:600;color:#ffffff;font-size:${fontSize13}px;">${dot.events}</span>&nbsp;${dot.events === 1 ? "event" : "events"}</div><div style="font-size:${fontSize10}px;line-height:1.35;color:rgba(255,255,255,0.5);">${yearsStr}</div></div></div>`;
}

// ─── LeafletMap component ──────────────────────────────────────────────────────

interface LeafletMapProps {
  dots: MusicianDot[];
  onMapReady?: (map: LeafletMap) => void;
  scale?: number;
}
const LeafletMapView: React.FC<LeafletMapProps> = ({
  dots,
  onMapReady,
  scale = 1,
}) => {
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
    // Increase zoom for 4K resolutions
    const initialZoom = scale >= 2.0 ? 3.5 : scale >= 1.75 ? 3.0 : 1;
    mapInstanceRef.current = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: false,
      maxBoundsViscosity: 1.0,
      minZoom: 2.75,
      maxZoom: 6,
    }).setView([10, 30], initialZoom);

    if (onMapReady && mapInstanceRef.current) {
      onMapReady(mapInstanceRef.current);
    }

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
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

  // Update zoom level when scale changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const initialZoom = scale >= 2.0 ? 3.5 : scale >= 1.75 ? 3.0 : 1;
    mapInstanceRef.current.setView([10, 30], initialZoom);
  }, [scale]);

  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    dots.forEach((dot) => {
      const baseSize = Math.min(9 + Math.round(dot.events * 0.6), 19);
      const size = Math.round(baseSize * scale);
      const icon = L.divIcon({
        html: buildDotHtml(dot, scale),
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2) - Math.round(4 * scale)],
      });
      const marker = L.marker([dot.lat, dot.lng] as [number, number], {
        icon,
      }).addTo(map);
      marker.bindPopup(buildDotPopupHtml(dot, scale), {
        maxWidth: Math.round(340 * scale),
        className: "jazz-popup",
        closeButton: true,
        closeOnClick: false,
        autoClose: true,
      });
      marker.on("click", () => {
        marker.openPopup();
      });
      markersRef.current.push(marker);
    });
  }, [ready, dots, scale]);
  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{
        background: "#000000",
      }}
    />
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const JazzAmbassadorsMap: React.FC = () => {
  const [hiddenMusicians, setHiddenMusicians] = useState<Set<string>>(
    new Set(),
  );
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920,
  );
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = useMemo(() => {
    if (windowWidth >= 3440) return 2.0;
    if (windowWidth >= 2560) return 1.75;
    return 1;
  }, [windowWidth]);

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
      const isCurrentlyHidden = prev.has(musician);
      const onlyThisOneVisible =
        prev.size === MUSICIANS.length - 1 && !isCurrentlyHidden;

      // If clicking on the only visible musician, show all
      if (onlyThisOneVisible) {
        return new Set();
      }

      // Otherwise, show only this musician (hide all others)
      const next = new Set(MUSICIANS.filter((m) => m !== musician));
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
        background: "#000000",
      }}
    >
      <style>{`
        .jazz-popup .leaflet-popup-content-wrapper {
          border-radius: 6px; padding: 0; overflow: hidden;
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
          position: absolute !important;
          top: 4px !important;
          right: 4px !important;
          width: 32px !important;
          height: 32px !important;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
          color: #ffffff !important;
          font-size: 24px !important;
          font-weight: 300 !important;
          line-height: 32px !important;
          text-align: center !important;
          cursor: pointer !important;
          z-index: 1000 !important;
          pointer-events: auto !important;
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
          color: #ffffff !important;
        }

        /* ── 4K Proportional Scaling ── */
        @media (min-width: 2560px) {
          .jazz-popup .leaflet-popup-content-wrapper {
            border-radius: 10.5px;
          }

          .jazz-popup .leaflet-popup-close-button {
            top: 7px !important;
            right: 7px !important;
            width: 56px !important;
            height: 56px !important;
            font-size: 42px !important;
            line-height: 56px !important;
          }

          .leaflet-control-attribution {
            font-size: 15.75px !important;
            border-radius: 10.5px 0 0 0 !important;
          }

          header h1.mcg-page-title {
            font-size: 56px !important;
          }

          /* Legend text - match Career Timeline */
          .jazz-legend-text {
            font-size: 24.5px !important;
          }

          .jazz-legend-separator {
            font-size: 24.5px !important;
            margin-left: 21px !important;
            margin-right: 7px !important;
          }

          .jazz-legend-dot {
            width: 15px !important;
            height: 15px !important;
          }

          .jazz-legend-pills {
            gap: 28px !important;
          }

          .jazz-map-header {
            padding: 0 !important;
            gap: 21px !important;
          }

          .jazz-map-container {
            padding: 0 !important;
          }

          .jazz-map-frame {
            max-width: 3200px !important;
            max-height: 1600px !important;
            border-width: 2.625px !important;
          }

          .jazz-zoom-controls {
            top: 28px !important;
            right: 28px !important;
            gap: 7px !important;
          }

          .jazz-zoom-button {
            width: 63px !important;
            height: 63px !important;
            border-radius: 14px !important;
            border-width: 2.625px !important;
            font-size: 31.5px !important;
          }
        }

        @media (min-width: 3440px) {
          .jazz-popup .leaflet-popup-content-wrapper {
            border-radius: 12px;
          }

          .jazz-popup .leaflet-popup-close-button {
            top: 8px !important;
            right: 8px !important;
            width: 64px !important;
            height: 64px !important;
            font-size: 48px !important;
            line-height: 64px !important;
          }

          .leaflet-control-attribution {
            font-size: 18px !important;
            border-radius: 12px 0 0 0 !important;
          }

          header h1.mcg-page-title {
            font-size: 64px !important;
          }

          /* Legend text - match Career Timeline */
          .jazz-legend-text {
            font-size: 28px !important;
          }

          .jazz-legend-separator {
            font-size: 28px !important;
            margin-left: 24px !important;
            margin-right: 8px !important;
          }

          .jazz-legend-dot {
            width: 17px !important;
            height: 17px !important;
          }

          .jazz-legend-pills {
            gap: 32px !important;
          }

          .jazz-map-header {
            padding: 0 !important;
            gap: 24px !important;
          }

          .jazz-map-container {
            padding: 0 !important;
          }

          .jazz-map-frame {
            max-width: 3600px !important;
            max-height: 1800px !important;
            border-width: 3px !important;
          }

          .jazz-zoom-controls {
            top: 32px !important;
            right: 32px !important;
            gap: 8px !important;
          }

          .jazz-zoom-button {
            width: 72px !important;
            height: 72px !important;
            border-radius: 16px !important;
            border-width: 3px !important;
            font-size: 36px !important;
          }
        }
      `}</style>

      {/* ── Top header / legend bar ── */}
      <header
        className="jazz-map-header flex-shrink-0 flex flex-col items-start gap-3"
        style={{
          width: "100%",
          margin: "0",
          padding: "0",
          background: "#000000",
        }}
      >
        {/* Title block */}
        <div className="flex-shrink-0">
          <h1
            className="mcg-page-title mcg-page-title--flow"
            style={{ color: "#ffffff" }}
          >
            "The Jazz Ambassadors" — U.S. State Department Jazz Diplomacy Tours
            (1956-1978)
          </h1>
        </div>

        <div
          className="flex items-center gap-4 flex-wrap"
          style={{ width: "100%" }}
        >
          {/* Artist toggle pills — horizontal row */}
          <div
            className="jazz-legend-pills flex items-center gap-2 flex-wrap"
            style={{ marginBottom: "2px" }}
          >
            {MUSICIANS.map((musician, index) => {
              const hidden = hiddenMusicians.has(musician);
              const color = MUSICIAN_COLORS[musician];
              const isLouis = musician === "Louis Armstrong";

              return (
                <React.Fragment key={musician}>
                  <button
                    onClick={() => toggleMusician(musician)}
                    className="jazz-legend-button flex items-center gap-2 px-1 py-1.5 transition-all text-left"
                    style={{
                      opacity: hidden ? 0.6 : 1,
                    }}
                    aria-pressed={!hidden}
                    aria-label={`${hidden ? "Show" : "Hide"} ${musician}`}
                  >
                    <div
                      className="jazz-legend-dot w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                      style={{
                        background: hidden ? "#475569" : color,
                      }}
                    />
                    <span
                      className="jazz-legend-text whitespace-nowrap transition-colors"
                      style={{
                        fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                        fontSize: "14px",
                        fontWeight: 400,
                        color: hidden ? "#94a3b8" : "#ffffff",
                      }}
                    >
                      {musician}
                    </span>
                  </button>

                  {isLouis && (
                    <>
                      <span
                        className="jazz-legend-separator"
                        style={{
                          color: "#475569",
                          fontSize: "14px",
                          fontWeight: 300,
                          marginBottom: "2px",
                          marginLeft: "12px",
                          marginRight: "4px",
                        }}
                      >
                        |
                      </span>
                      <p
                        className="jazz-legend-text flex-shrink-0 tracking-widest"
                        style={{
                          marginBottom: "2px",
                          fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#9ca3af",
                        }}
                      >
                        Other artists
                      </p>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Show all — only appears when some are hidden */}
          {!allVisible && (
            <button
              onClick={showAll}
              className="jazz-legend-text flex-shrink-0 transition-colors underline underline-offset-2"
              style={{
                marginBottom: "2px",
                fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                color: "#cbd5e1",
              }}
            >
              Show all
            </button>
          )}
        </div>
      </header>

      {/* ── Map frame ── */}
      <div
        className="jazz-map-container flex-1 min-h-0 px-0 pb-0 pt-0"
        style={{ background: "#000000", marginTop: "2rem" }}
      >
        <div
          className="jazz-map-frame overflow-hidden"
          style={{
            // borderRadius: "16px",
            border: "1.5px solid #334155",
            boxShadow: "none",
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
              scale={scale}
              onMapReady={(map) => {
                mapInstanceRef.current = map;
              }}
            />

            {/* Zoom Controls */}
            <div
              className="jazz-zoom-controls absolute top-4 right-4 flex flex-col gap-1"
              style={{
                zIndex: 1000,
                pointerEvents: "auto",
              }}
            >
              <button
                onClick={handleZoomIn}
                className="jazz-zoom-button bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1.5px solid #475569",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.32)",
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
                className="jazz-zoom-button bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1.5px solid #475569",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.32)",
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
