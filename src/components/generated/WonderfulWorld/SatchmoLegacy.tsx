import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./satchmo-legacy.css";

export type FactItem = {
  text: string;
  category: string;
  year: string | number;
  image?: string;
};

type PlacedFact = FactItem & {
  id: number;
  x: number;
  y: number;
  r: number;
};

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  meta: string;
  text: string;
  image: string;
};

export type SatchmoLegacyProps = {
  facts?: FactItem[];
  factsUrl?: string;
  maskSvgUrl?: string;
  creditImageUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number | string;
  initialZoom?: number;
  canvasWidth?: number;
  canvasHeight?: number;
  searchPlaceholder?: string;
};

const R_MIN = 3;
const R_MAX = 9;
const PADDING = 2;
const MASK_CLEARANCE = 2;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;
const SILHOUETTE_SCALE = 0.85;
const SVG_ASPECT_RATIO = 1562 / 1401;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSilhouetteBounds(canvasWidth: number, canvasHeight: number) {
  const canvasAspect = canvasWidth / canvasHeight;
  const silhouetteFit = 0.75 * SILHOUETTE_SCALE;

  if (SVG_ASPECT_RATIO > canvasAspect) {
    const drawWidth = canvasWidth * silhouetteFit;
    return {
      drawWidth,
      drawHeight: drawWidth / SVG_ASPECT_RATIO,
    };
  }

  const drawHeight = canvasHeight * silhouetteFit;
  return {
    drawWidth: drawHeight * SVG_ASPECT_RATIO,
    drawHeight,
  };
}

function collides(existing: PlacedFact[], x: number, y: number, r: number) {
  for (const fact of existing) {
    const dx = fact.x - x;
    const dy = fact.y - y;
    const dist = Math.hypot(dx, dy);
    if (dist < fact.r + r + PADDING) return true;
  }
  return false;
}

async function loadFactsJson(factsUrl: string): Promise<FactItem[]> {
  const response = await fetch(factsUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`facts.json HTTP ${response.status}`);
  }
  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("facts.json must be an array");
  }
  return data as FactItem[];
}

export function SatchmoLegacy({
  facts,
  factsUrl = "../../../../data/wonderfulworld.json",
  maskSvgUrl = "/images/louis-silo.svg",
  creditImageUrl = "/images/photo-by-john-loengard.jpg",
  title = "What a Wonderful World",
  subtitle = "An interactive odyssey through moments in the life of Louis “Satchmo” Armstrong.",
  className,
  height = "100%",
  initialZoom = 1,
  canvasWidth = 1000,
  canvasHeight = 500,
  searchPlaceholder = "Search facts...",
}: SatchmoLegacyProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoom, setZoomState] = useState(() =>
    clamp(initialZoom, ZOOM_MIN, ZOOM_MAX),
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [placedFacts, setPlacedFacts] = useState<PlacedFact[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: -9999,
    y: -9999,
    meta: "",
    text: "",
    image: "",
  });

  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const maskAlphaRef = useRef<Uint8ClampedArray | null>(null);
  const maskReadyRef = useRef(false);

  const setZoom = (next: number) =>
    setZoomState(clamp(next, ZOOM_MIN, ZOOM_MAX));

  const hideTooltip = () => {
    setTooltip((current) => ({
      ...current,
      visible: false,
      x: -9999,
      y: -9999,
    }));
  };

  const showTooltipFor = (
    event: React.MouseEvent<HTMLDivElement>,
    fact: PlacedFact,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 16,
      meta: `${fact.year} • ${String(fact.category).toUpperCase()}`,
      text: fact.text,
      image: fact.image ?? "",
    });
  };

  const tooltipStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translate(${Math.round(tooltip.x)}px, ${Math.round(tooltip.y)}px) translate(-50%, -100%)`,
    }),
    [tooltip.x, tooltip.y],
  );

  const vizStyle = useMemo<CSSProperties>(
    () => ({
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
      transform: `translate(-50%, -50%) scale(${zoom})`,
    }),
    [canvasHeight, canvasWidth, zoom],
  );

  const silhouetteStyle = useMemo<CSSProperties>(
    () => {
      const { drawWidth, drawHeight } = getSilhouetteBounds(
        canvasWidth,
        canvasHeight,
      );

      return {
        width: `${drawWidth}px`,
        height: `${drawHeight}px`,
      };
    },
    [canvasHeight, canvasWidth],
  );

  const filteredFacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return placedFacts;
    return placedFacts.filter((fact) =>
      String(fact.text).toLowerCase().includes(query),
    );
  }, [placedFacts, searchTerm]);

  const factStyle = (fact: PlacedFact): CSSProperties => ({
    left: `${fact.x - fact.r}px`,
    top: `${fact.y - fact.r}px`,
    width: `${fact.r * 2}px`,
    height: `${fact.r * 2}px`,
    ...(fact.image ? { backgroundImage: `url("${fact.image}")` } : {}),
  });

  const isOutsideMask = (x: number, y: number) => {
    const maskAlpha = maskAlphaRef.current;
    if (!maskReadyRef.current || !maskAlpha) return true;

    const px = Math.floor(x);
    const py = Math.floor(y);
    if (px < 0 || py < 0 || px >= canvasWidth || py >= canvasHeight)
      return true;

    const alphaIndex = (py * canvasWidth + px) * 4 + 3;
    return maskAlpha[alphaIndex] === 0;
  };

  const overlapsMask = (x: number, y: number, r: number) => {
    const reach = r + MASK_CLEARANCE;
    const minX = Math.max(0, Math.floor(x - reach));
    const maxX = Math.min(canvasWidth - 1, Math.ceil(x + reach));
    const minY = Math.max(0, Math.floor(y - reach));
    const maxY = Math.min(canvasHeight - 1, Math.ceil(y + reach));

    for (let py = minY; py <= maxY; py += 1) {
      for (let px = minX; px <= maxX; px += 1) {
        const dx = px - x;
        const dy = py - y;
        if (dx * dx + dy * dy > reach * reach) continue;
        if (!isOutsideMask(px, py)) return true;
      }
    }

    return false;
  };

  const addCoordinates = (jsonFacts: FactItem[]) => {
    const placed: PlacedFact[] = [];

    for (let index = 0; index < jsonFacts.length; index += 1) {
      let ok = false;

      for (let attempt = 0; attempt < 100; attempt += 1) {
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const r = R_MIN + Math.random() * (R_MAX - R_MIN);

        if (overlapsMask(x, y, r)) continue;
        if (collides(placed, x, y, r)) continue;

        placed.push({
          id: index,
          text: jsonFacts[index].text,
          category: jsonFacts[index].category,
          year: jsonFacts[index].year,
          image: jsonFacts[index].image,
          x,
          y,
          r,
        });

        ok = true;
        break;
      }

      if (!ok) continue;
    }

    return placed;
  };

  useEffect(() => {
    let cancelled = false;

    const loadSVGMask = async () => {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const maskCanvas = document.createElement("canvas");
          maskCanvas.width = canvasWidth;
          maskCanvas.height = canvasHeight;
          const context = maskCanvas.getContext("2d", {
            willReadFrequently: true,
          });

          if (!context) {
            reject(new Error("Unable to create canvas context"));
            return;
          }

          const { drawWidth, drawHeight } = getSilhouetteBounds(
            canvasWidth,
            canvasHeight,
          );
          const offsetX = (canvasWidth - drawWidth) / 2;
          const offsetY = (canvasHeight - drawHeight) / 2;

          context.clearRect(0, 0, canvasWidth, canvasHeight);
          context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
          maskCanvasRef.current = maskCanvas;
          maskContextRef.current = context;
          maskAlphaRef.current = context.getImageData(
            0,
            0,
            canvasWidth,
            canvasHeight,
          ).data;
          maskReadyRef.current = true;
          resolve();
        };
        image.onerror = () => reject(new Error("Failed to load SVG mask"));
        image.src = maskSvgUrl;
      });
    };

    const initialize = async () => {
      setLoading(true);
      setLoadError(null);
      setSelectedId(null);
      setZoom(clamp(initialZoom, ZOOM_MIN, ZOOM_MAX));

      try {
        await loadSVGMask();
        const jsonFacts = facts ?? (await loadFactsJson(factsUrl));
        if (!cancelled) {
          setPlacedFacts(addCoordinates(jsonFacts));
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error : new Error("Unknown error"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initialize();

    const hideOnViewportChange = () => hideTooltip();
    window.addEventListener("scroll", hideOnViewportChange, { passive: true });
    window.addEventListener("resize", hideOnViewportChange);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", hideOnViewportChange);
      window.removeEventListener("resize", hideOnViewportChange);
    };
  }, [canvasHeight, canvasWidth, facts, factsUrl, initialZoom, maskSvgUrl]);

  return (
    <section
      className="mcg-section mcg-jazz-section"
      style={{
        backgroundColor: "#000000",
      }}
    >
      <div
        className={["slg", className].filter(Boolean).join(" ")}
        style={{
          height,
          ["--slg-silhouette-scale" as string]: SILHOUETTE_SCALE,
        }}
      >
        <h1 className="mcg-page-title">{title}</h1>
        <header className="slg__header">
          <div className="slg__brand">
            <p>{subtitle}</p>
          </div>

          <div className="slg__controls">
            <label className="slg__search">
              <span className="slg__search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="text"
                placeholder={searchPlaceholder}
                autoComplete="off"
              />
            </label>

            <div className="slg__zoom-controls" aria-label="Zoom controls">
              <button
                type="button"
                title="Zoom in"
                onClick={() => setZoom(zoom + ZOOM_STEP)}
              >
                +
              </button>
              <button
                type="button"
                title="Zoom out"
                onClick={() => setZoom(zoom - ZOOM_STEP)}
              >
                −
              </button>
            </div>
          </div>
        </header>

        <main className="slg__stage" onMouseDown={hideTooltip}>
          <img
            className="slg__silhouette"
            src={maskSvgUrl}
            style={silhouetteStyle}
            alt=""
            aria-hidden="true"
          />

          <div
            className="slg__viz"
            style={vizStyle}
            aria-label="Facts visualization"
          >
            {filteredFacts.map((fact) => (
              <div
                key={fact.id}
                className={`slg__fact${selectedId === fact.id ? " is-selected" : ""}`}
                style={factStyle(fact)}
                onMouseEnter={(event) => showTooltipFor(event, fact)}
                onMouseLeave={hideTooltip}
                onClick={() => setSelectedId(fact.id)}
              />
            ))}
          </div>

          <div
            className={`slg__tooltip${tooltip.visible ? " is-visible" : ""}`}
            style={tooltipStyle}
            role="status"
            aria-live="polite"
          >
            <div className="slg__tooltip-inner">
              {tooltip.image ? (
                <img
                  src={tooltip.image}
                  className="slg__tooltip-image"
                  alt=""
                />
              ) : null}
              <div className="slg__tooltip-body">
                <div className="slg__tooltip-meta">{tooltip.meta}</div>
                <div className="slg__tooltip-text">{tooltip.text}</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="slg__status slg__status--loading">Loading…</div>
          ) : null}
          {!loading && loadError ? (
            <div className="slg__status slg__status--error">
              Couldn’t load <code>{facts ? "facts prop" : factsUrl}</code> or
              the SVG mask.
            </div>
          ) : null}
        </main>

        <div className="slg__photo-credit" aria-hidden="true">
          <img
            src={creditImageUrl}
            alt="Louis Armstrong silhouette"
            className="slg__credit-photo"
          />
          <p className="slg__credit-text">
            Atlantic City, N.J., 1965.
            <br />
            Photo John Loengard/Getty
          </p>
        </div>
      </div>
    </section>
  );
}
