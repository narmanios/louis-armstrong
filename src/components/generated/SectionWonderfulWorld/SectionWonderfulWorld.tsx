import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "../../../hooks/use-mobile";
import "./SectionWonderfulWorld.css";

type ExternalUri = {
  site: string;
  uri: string;
};

export type FactItem = {
  id: string;
  title: string;
  performer_name: string;
  firstReleaseDate: string;
  releases_title: string[];
  image?: string;
  external_uri?: ExternalUri[];
};

type PlacedFact = FactItem & {
  bubbleId: number;
  x: number;
  y: number;
  r: number;
};

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  align: "center" | "left" | "right";
  fact: PlacedFact | null;
};

export type SectionWonderfulWorldProps = {
  facts?: FactItem[];
  factsUrl?: string;
  maskSvgUrl?: string;
  centerMediaUrl?: string;
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
const DESKTOP_STAGE_SCALE = 1.08;
const CENTER_MEDIA_SCALE = 1.2;
const TOOLTIP_EDGE_THRESHOLD = 240;
const TOOLTIP_EDGE_OFFSET = 14;
const TOOLTIP_MAX_WIDTH = 420;
const TOOLTIP_VIEWPORT_MARGIN = 20;

type ServiceName = "youtube" | "spotify" | "apple";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => readString(item).trim()).filter(Boolean);
  }
  const normalized = readString(value).trim();
  return normalized ? [normalized] : [];
}

function readExternalUris(value: unknown): ExternalUri[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const site = readString(record.site).trim();
      const uri = readString(record.uri).trim();
      if (!site || !uri) return null;
      return { site, uri };
    })
    .filter((item): item is ExternalUri => !!item);
}

function normalizeImagePath(imagePath?: string) {
  if (!imagePath) return "";
  if (
    imagePath.startsWith("/") ||
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  return `/${imagePath}`;
}

function normalizeFactItem(item: unknown, index: number): FactItem {
  const record =
    item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  return {
    id: readString(record.id) || `fact-${index}`,
    title: readString(record.title),
    performer_name: readString(record.performer_name),
    firstReleaseDate: readString(record.firstReleaseDate),
    releases_title: readStringArray(record.releases_title),
    image: readString(record.image) || undefined,
    external_uri: readExternalUris(record.external_uri),
  };
}

function formatReleaseDate(value: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

function getSearchText(fact: FactItem) {
  return [
    fact.title,
    fact.performer_name,
    fact.firstReleaseDate,
    ...fact.releases_title,
  ]
    .join(" ")
    .toLowerCase();
}

function getServiceHref(
  links: ExternalUri[] | undefined,
  service: ServiceName,
) {
  if (!links?.length) return null;

  return (
    links.find((link) => {
      const site = link.site.toLowerCase();
      if (service === "apple") return site.includes("apple");
      return site.includes(service);
    })?.uri ?? null
  );
}

function getYouTubeVideoId(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const parts = url.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts") {
        return parts[1] ?? null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getTooltipPreviewUrl(links: ExternalUri[] | undefined) {
  const youtubeUrl = getServiceHref(links, "youtube");
  if (!youtubeUrl) return null;

  const videoId = getYouTubeVideoId(youtubeUrl);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}

function ServiceIcon({ service }: { service: ServiceName }) {
  if (service === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M23 12.002c0 2.25-.264 4.5-.264 4.5s-.258 1.603-1.05 2.307c-1.002.924-2.126.93-2.64.99-3.69.267-9.226.267-9.226.267h-.012s-5.535 0-9.225-.267c-.516-.06-1.64-.066-2.641-.99-.792-.704-1.05-2.307-1.05-2.307S0 14.252 0 12.002s.264-4.5.264-4.5.258-1.603 1.05-2.307c1.001-.924 2.125-.93 2.64-.99C7.646 3.938 13.18 3.938 13.18 3.938h.013s5.535 0 9.225.267c.515.06 1.639.066 2.64.99.792.704 1.05 2.307 1.05 2.307s.264 2.25.264 4.5ZM9.545 8.353v7.298l6.273-3.661-6.273-3.637Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (service === "spotify") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0Zm5.503 17.313a.747.747 0 0 1-1.028.248c-2.816-1.72-6.36-2.108-10.533-1.154a.748.748 0 1 1-.334-1.458c4.568-1.045 8.49-.603 11.647 1.325a.749.749 0 0 1 .248 1.04Zm1.468-3.266a.935.935 0 0 1-1.286.31c-3.223-1.98-8.135-2.555-11.948-1.397a.935.935 0 1 1-.543-1.79c4.356-1.323 9.77-.683 13.469 1.59a.935.935 0 0 1 .308 1.287Zm.126-3.401C15.23 8.35 8.856 8.14 5.167 9.258a1.122 1.122 0 1 1-.651-2.147c4.234-1.285 11.275-1.037 15.755 1.626a1.122 1.122 0 0 1-1.174 1.909Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M17.041 12.044a4.53 4.53 0 0 1 2.18-3.808 4.683 4.683 0 0 0-3.692-1.99c-1.553-.163-3.06.93-3.851.93-.806 0-2.022-.914-3.334-.887a4.908 4.908 0 0 0-4.137 2.514c-1.788 3.095-.454 7.651 1.258 10.152.857 1.225 1.858 2.595 3.168 2.547 1.282-.054 1.761-.817 3.307-.817 1.532 0 1.982.817 3.317.786 1.376-.022 2.243-1.231 3.07-2.469.992-1.404 1.39-2.789 1.406-2.86-.032-.01-2.672-1.02-2.692-4.098Zm-2.527-7.394c.689-.824 1.159-1.943 1.028-3.081-.997.044-2.244.69-2.961 1.494-.635.706-1.202 1.87-1.055 2.966 1.119.083 2.271-.566 2.988-1.379Z"
        fill="currentColor"
      />
    </svg>
  );
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
  return data.map((item, index) => normalizeFactItem(item, index));
}

export function SectionWonderfulWorld({
  facts,
  factsUrl = "/assets/data/wonderfulworld.json",
  maskSvgUrl = "/assets/louis-silo.svg",
  centerMediaUrl = "/assets/www.mp4",
  creditImageUrl = "/assets/photo-by-john-loengard.jpg",
  title = "What a Wonderful World",
  subtitle = "Artists' renditions of Louis Armstrong's iconic song.",
  className,
  height = "100%",
  initialZoom = 1,
  canvasWidth = 1000,
  canvasHeight = 500,
  searchPlaceholder = "Search artists, release dates...",
}: SectionWonderfulWorldProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [videoSoundEnabled, setVideoSoundEnabled] = useState(false);
  const [zoom, setZoomState] = useState(() =>
    clamp(initialZoom, ZOOM_MIN, ZOOM_MAX),
  );
  const [selectedBubbleId, setSelectedBubbleId] = useState<number | null>(null);
  const [placedFacts, setPlacedFacts] = useState<PlacedFact[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: -9999,
    y: -9999,
    align: "center",
    fact: null,
  });

  const maskAlphaRef = useRef<Uint8ClampedArray | null>(null);
  const maskReadyRef = useRef(false);
  const stageOuterRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const centerMediaRef = useRef<HTMLVideoElement | null>(null);
  const isMobile = useIsMobile();
  const [mobileStageScale, setMobileStageScale] = useState(1);

  const setZoom = (next: number) =>
    setZoomState(clamp(next, ZOOM_MIN, ZOOM_MAX));

  const hideTooltip = () => {
    setSelectedBubbleId(null);
    setTooltip({
      visible: false,
      x: -9999,
      y: -9999,
      align: "center",
      fact: null,
    });
  };

  const showTooltipFor = (
    event: React.MouseEvent<HTMLDivElement>,
    fact: PlacedFact,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = Math.min(
      TOOLTIP_MAX_WIDTH,
      window.innerWidth - TOOLTIP_VIEWPORT_MARGIN * 2,
    );
    const align = isMobile
      ? "center"
      : rect.left <= TOOLTIP_EDGE_THRESHOLD
        ? "right"
        : window.innerWidth - rect.right <= TOOLTIP_EDGE_THRESHOLD
          ? "left"
          : "center";
    const preferredLeft = isMobile
      ? (window.innerWidth - tooltipWidth) / 2
      : align === "right"
        ? rect.right + TOOLTIP_EDGE_OFFSET
        : align === "left"
          ? rect.left - tooltipWidth - TOOLTIP_EDGE_OFFSET
          : rect.left + rect.width / 2 - tooltipWidth / 2;
    const clampedLeft = clamp(
      preferredLeft,
      TOOLTIP_VIEWPORT_MARGIN,
      window.innerWidth - tooltipWidth - TOOLTIP_VIEWPORT_MARGIN,
    );

    setTooltip({
      visible: true,
      x: clampedLeft,
      y: isMobile ? window.innerHeight - 24 : rect.top - 16,
      align,
      fact,
    });
  };

  const handleFactClick = (
    event: React.MouseEvent<HTMLDivElement>,
    fact: PlacedFact,
  ) => {
    if (selectedBubbleId === fact.bubbleId && tooltip.visible) {
      hideTooltip();
      return;
    }

    setSelectedBubbleId(fact.bubbleId);
    showTooltipFor(event, fact);
  };

  const tooltipStyle = useMemo<CSSProperties>(
    () => ({
      transform: `translate(${Math.round(tooltip.x)}px, ${Math.round(tooltip.y)}px) translate(0, -100%)`,
    }),
    [tooltip.x, tooltip.y],
  );

  const tooltipPreviewUrl = useMemo(
    () => getTooltipPreviewUrl(tooltip.fact?.external_uri),
    [tooltip.fact],
  );

  const tooltipNode =
    typeof document !== "undefined"
      ? createPortal(
          <div
            className={`slg__tooltip${tooltip.visible ? " is-visible" : ""}`}
            style={tooltipStyle}
            ref={tooltipRef}
            role="status"
            aria-live="polite"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="slg__tooltip-inner">
              {tooltip.fact ? (
                <>
                  <button
                    type="button"
                    className="slg__tooltip-close"
                    onClick={hideTooltip}
                    aria-label="Close tooltip"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M6 6 18 18M18 6 6 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  {tooltipPreviewUrl ? (
                    <img
                      className="slg__tooltip-image"
                      src={tooltipPreviewUrl}
                      alt=""
                      loading="lazy"
                    />
                  ) : null}
                  <div className="slg__tooltip-body">
                    <div className="slg__tooltip-row">
                      <div className="slg__tooltip-label">Title</div>
                      <div className="slg__tooltip-value">
                        {tooltip.fact.title || "Unknown"}
                      </div>
                    </div>
                    <div className="slg__tooltip-row">
                      <div className="slg__tooltip-label">Performer name</div>
                      <div className="slg__tooltip-value">
                        {tooltip.fact.performer_name || "Unknown"}
                      </div>
                    </div>
                    <div className="slg__tooltip-row">
                      <div className="slg__tooltip-label">
                        First release date
                      </div>
                      <div className="slg__tooltip-value">
                        {formatReleaseDate(tooltip.fact.firstReleaseDate) ||
                          "Unknown"}
                      </div>
                    </div>
                    <div className="slg__tooltip-row">
                      <div className="slg__tooltip-label">Release title</div>
                      <div className="slg__tooltip-value">
                        {tooltip.fact.releases_title.length
                          ? tooltip.fact.releases_title.join(", ")
                          : "Unknown"}
                      </div>
                    </div>
                    <div className="slg__tooltip-links">
                      {(["youtube", "spotify", "apple"] as ServiceName[]).map(
                        (service) => {
                          const href = getServiceHref(
                            tooltip.fact?.external_uri,
                            service,
                          );
                          if (!href) return null;

                          return (
                            <a
                              key={service}
                              className="slg__tooltip-link"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open ${service}`}
                            >
                              <ServiceIcon service={service} />
                            </a>
                          );
                        },
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  const vizStyle = useMemo<CSSProperties>(
    () => ({
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
      transform: `translate(-50%, -50%) scale(${zoom})`,
    }),
    [canvasHeight, canvasWidth, zoom],
  );

  const stageFrameStyle = useMemo<CSSProperties>(
    () =>
      isMobile
        ? {
            width: `${canvasWidth * mobileStageScale}px`,
            height: `${canvasHeight * mobileStageScale}px`,
          }
        : {
            width: `${canvasWidth * DESKTOP_STAGE_SCALE}px`,
            height: `${canvasHeight * DESKTOP_STAGE_SCALE}px`,
          },
    [canvasHeight, canvasWidth, isMobile, mobileStageScale],
  );

  const stageScaleStyle = useMemo<CSSProperties>(
    () =>
      isMobile
        ? {
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${mobileStageScale})`,
            transformOrigin: "top left",
          }
        : {
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${DESKTOP_STAGE_SCALE})`,
            transformOrigin: "top left",
          },
    [canvasHeight, canvasWidth, isMobile, mobileStageScale],
  );

  const silhouetteStyle = useMemo<CSSProperties>(() => {
    const { drawWidth, drawHeight } = getSilhouetteBounds(
      canvasWidth,
      canvasHeight,
    );

    return {
      width: `${drawWidth}px`,
      height: `${drawHeight}px`,
    };
  }, [canvasHeight, canvasWidth]);

  const centerMediaStyle = useMemo<CSSProperties>(() => {
    const { drawWidth, drawHeight } = getSilhouetteBounds(
      canvasWidth,
      canvasHeight,
    );

    return {
      width: `${drawWidth * CENTER_MEDIA_SCALE}px`,
      height: `${drawHeight * CENTER_MEDIA_SCALE}px`,
    };
  }, [canvasHeight, canvasWidth]);

  const centerMediaSrc = useMemo(
    () => normalizeImagePath(centerMediaUrl),
    [centerMediaUrl],
  );

  useEffect(() => {
    const video = centerMediaRef.current;
    if (!video) return;

    video.muted = !videoSoundEnabled;

    if (!videoSoundEnabled) {
      return;
    }

    void video.play().catch(() => {
      setVideoSoundEnabled(false);
    });
  }, [videoSoundEnabled]);

  const filteredFacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return placedFacts;
    return placedFacts.filter((fact) => getSearchText(fact).includes(query));
  }, [placedFacts, searchTerm]);

  const factStyle = (fact: PlacedFact): CSSProperties => ({
    left: `${fact.x - fact.r}px`,
    top: `${fact.y - fact.r}px`,
    width: `${fact.r * 2}px`,
    height: `${fact.r * 2}px`,
    ...(fact.image
      ? { backgroundImage: `url("${normalizeImagePath(fact.image)}")` }
      : {}),
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
          ...jsonFacts[index],
          bubbleId: index,
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
      setSelectedBubbleId(null);
      setZoom(clamp(initialZoom, ZOOM_MIN, ZOOM_MAX));

      try {
        await loadSVGMask();
        const jsonFacts = facts
          ? facts.map((item, index) => normalizeFactItem(item, index))
          : await loadFactsJson(factsUrl);
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

  useEffect(() => {
    const updateScale = () => {
      if (!isMobile) {
        setMobileStageScale(1);
        return;
      }

      const outerWidth =
        stageOuterRef.current?.clientWidth ?? window.innerWidth;
      const availableWidth = Math.max(outerWidth - 40, 280);
      setMobileStageScale(Math.min(availableWidth / canvasWidth, 1));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (stageOuterRef.current) {
      resizeObserver.observe(stageOuterRef.current);
    }
    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [canvasWidth, isMobile]);

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
        <div className="slg__header-block">
          <h1 className="mcg-page-title mcg-page-title--flow slg__title">
            {title}
          </h1>
          <header className="slg__header">
            <div className="slg__brand">
              <p>{subtitle}</p>
            </div>

            <div className="slg__controls">
              <button
                type="button"
                className="slg__sound-toggle"
                onClick={() => setVideoSoundEnabled((current) => !current)}
                aria-pressed={videoSoundEnabled}
                aria-label={
                  videoSoundEnabled
                    ? "Mute center video"
                    : "Unmute center video"
                }
                title={videoSoundEnabled ? "Sound on" : "Sound off"}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {videoSoundEnabled ? (
                    <>
                      <path
                        d="M5 9h4l5-4v14l-5-4H5z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 9.5a4 4 0 0 1 0 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19.5 7a7.5 7.5 0 0 1 0 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M5 9h4l5-4v14l-5-4H5z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 9l4 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M21 9l-4 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                </svg>
                <span>{videoSoundEnabled ? "Sound on" : "Sound off"}</span>
              </button>

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
        </div>

        <main className="slg__stage" onMouseDown={hideTooltip}>
          <div className="slg__stage-shell" ref={stageOuterRef}>
            <div className="slg__stage-frame" style={stageFrameStyle}>
              <div className="slg__stage-scale" style={stageScaleStyle}>
                <video
                  ref={centerMediaRef}
                  className="slg__silhouette"
                  src={centerMediaSrc}
                  style={centerMediaStyle}
                  autoPlay
                  muted={!videoSoundEnabled}
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />

                <div
                  className="slg__viz"
                  style={vizStyle}
                  aria-label="Facts visualization"
                >
                  {filteredFacts.map((fact) => (
                    <div
                      key={fact.bubbleId}
                      className={`slg__fact${selectedBubbleId === fact.bubbleId ? " is-selected" : ""}`}
                      style={factStyle(fact)}
                      onClick={(event) => handleFactClick(event, fact)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {tooltipNode}

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
