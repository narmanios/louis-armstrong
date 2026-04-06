import {
  CSSProperties,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./SectionVinyl.css";

type SoundtrackMetadataValue = string | number;

export interface VinylSoundtrack {
  key: string;
  decade: string;
  title: string;
  year: number;
  media: string;
  song: string;
  localImagePath: string;
  imageUrl: string;
  metadata: Record<string, SoundtrackMetadataValue>;
}

export interface VinylDecade {
  id: string;
  label: string;
  radius?: number;
  soundtracks: VinylSoundtrack[];
}

interface DecadeRing {
  key: string;
  radius: number;
  decade: VinylDecade;
}

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
};

export interface VinylRecordExplorerProps {
  soundtracks?: VinylSoundtrack[];
  soundtracksUrl?: string;
  title?: string;
  subtitle?: string;
  centerImageUrl?: string;
  className?: string;
  style?: CSSProperties;
  height?: CSSProperties["height"];
  minHeight?: CSSProperties["minHeight"];
  panelWidth?: number;
  loadingText?: string;
  emptyText?: string;
  errorText?: string;
  decadeLabel?: string;
  soundtrackLabel?: string;
  songLabel?: string;
  artistLabel?: string;
}

const DEFAULT_CENTER_IMAGE = "/assets/louis-record-center.jpg";
const DEFAULT_SOUNDTRACKS_URL = "/assets/data/soundtracks.json";
const DEFAULT_EMPTY_TEXT =
  "Hover over a soundtrack marker to explore Louis Armstrong soundtrack appearances.";

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
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

function readString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeSoundtrack(item: unknown, index: number): VinylSoundtrack {
  const record =
    item && typeof item === "object" ? (item as Record<string, unknown>) : {};

  const decade = readString(record.id).trim() || "Unknown";
  const title = readString(record.title).trim() || "Untitled";
  const year = readNumber(record.year);
  const media = readString(record.media).trim();
  const song = readString(record.song).trim();
  const localImagePath = readString(record.local_image_path).trim();
  const imageUrl = normalizeImagePath(localImagePath) || DEFAULT_CENTER_IMAGE;

  return {
    key: `${decade}-${title}-${year}-${index}`,
    decade,
    title,
    year,
    media,
    song,
    localImagePath,
    imageUrl,
    metadata: {
      id: decade,
      title,
      year,
      media,
      song,
      local_image_path: localImagePath,
    },
  };
}

function groupSoundtracksByDecade(
  soundtracks: VinylSoundtrack[],
): VinylDecade[] {
  const grouped = soundtracks.reduce<Map<string, VinylSoundtrack[]>>(
    (acc, soundtrack) => {
      const existing = acc.get(soundtrack.decade) ?? [];
      existing.push(soundtrack);
      acc.set(soundtrack.decade, existing);
      return acc;
    },
    new Map<string, VinylSoundtrack[]>(),
  );

  return Array.from(grouped.entries())
    .sort(([left], [right]) =>
      left.localeCompare(right, undefined, { numeric: true }),
    )
    .map(([decade, entries]) => ({
      id: decade,
      label: decade,
      soundtracks: [...entries].sort((left, right) => {
        if (left.year !== right.year) return left.year - right.year;
        return left.title.localeCompare(right.title);
      }),
    }));
}

function formatMetadataLabel(key: string) {
  if (key === "id") return "Decade";

  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (value) => value.toUpperCase());
}

function getMarkerRadius(radius: number, soundtrackCount: number) {
  if (soundtrackCount <= 1) return 16;
  const circumference = 2 * Math.PI * radius;
  return Math.max(
    6,
    Math.min(16, Math.floor((circumference / soundtrackCount) * 0.22)),
  );
}

function getMarkerDimensions(baseWidth: number, hovered: boolean) {
  const width = hovered ? baseWidth + 6 : baseWidth;
  return {
    width,
    height: Math.round((width * 4) / 3),
  };
}

export function VinylRecordExplorer({
  soundtracks: soundtrackProps,
  soundtracksUrl = DEFAULT_SOUNDTRACKS_URL,
  title = "Louis Armstrong Soundtracks",
  subtitle = "A decade by decade look at how Louis Armstrong’s music kept finding new life on screen, introducing his sound to new audiences through film and television across generations.",
  centerImageUrl = DEFAULT_CENTER_IMAGE,
  className,
  style,
  height,
  minHeight = "100vh",
  panelWidth = 176,
  loadingText = "Loading soundtrack data...",
  emptyText = DEFAULT_EMPTY_TEXT,
  errorText = "Couldn't load soundtrack data. Check that the soundtrack JSON is available.",
  decadeLabel,
  soundtrackLabel,
  songLabel,
  artistLabel,
}: VinylRecordExplorerProps) {
  const resolvedDecadeLabel = decadeLabel ?? songLabel ?? "Decade";
  const resolvedSoundtrackLabel = soundtrackLabel ?? artistLabel ?? "Media";

  const [soundtracks, setSoundtracks] = useState<VinylSoundtrack[]>(
    soundtrackProps ?? [],
  );
  const [loading, setLoading] = useState<boolean>(!soundtrackProps);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [selectedDecadeId, setSelectedDecadeId] = useState<string | null>(
    soundtrackProps?.[0]?.decade ?? null,
  );
  const [hoveredDecadeId, setHoveredDecadeId] = useState<string | null>(null);
  const [hoveredSoundtrackKey, setHoveredSoundtrackKey] = useState<
    string | null
  >(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const visualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (soundtrackProps) {
      setSoundtracks(soundtrackProps);
      setLoading(false);
      setLoadError(null);
      setSelectedDecadeId(
        (current) => current ?? soundtrackProps[0]?.decade ?? null,
      );
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    fetch(soundtracksUrl, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return (await response.json()) as unknown;
      })
      .then((data) => {
        if (cancelled) return;
        const nextSoundtracks = Array.isArray(data)
          ? data.map((item, index) => normalizeSoundtrack(item, index))
          : [];
        setSoundtracks(nextSoundtracks);
        setSelectedDecadeId(nextSoundtracks[0]?.decade ?? null);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error
              : new Error("Failed to load soundtrack data"),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [soundtrackProps, soundtracksUrl]);

  const decades = useMemo(
    () => groupSoundtracksByDecade(soundtracks),
    [soundtracks],
  );

  useEffect(() => {
    if (!decades.length) {
      setSelectedDecadeId(null);
      return;
    }

    setSelectedDecadeId((current) =>
      current && decades.some((decade) => decade.id === current)
        ? current
        : (decades[0]?.id ?? null),
    );
  }, [decades]);

  const activeDecadeId =
    hoveredDecadeId ?? selectedDecadeId ?? decades[0]?.id ?? null;
  const activeDecade = useMemo(
    () => decades.find((decade) => decade.id === activeDecadeId) ?? null,
    [activeDecadeId, decades],
  );
  const activeSoundtracks = activeDecade?.soundtracks ?? [];

  const rings = useMemo<DecadeRing[]>(() => {
    if (!decades.length) return [];

    const minRadius = 228;
    const maxRadius = 480;
    const spacing =
      decades.length > 1 ? (maxRadius - minRadius) / (decades.length - 1) : 0;

    return decades.map((decade, index) => ({
      key: `decade-${decade.id}`,
      radius: decade.radius ?? minRadius + index * spacing,
      decade,
    }));
  }, [decades]);

  const decorativeRings = useMemo(
    () =>
      rings.slice(0, -1).map((ring, index) => ({
        key: `decorative-${ring.decade.id}-${rings[index + 1]?.decade.id ?? index}`,
        radius: (ring.radius + rings[index + 1].radius) / 2,
      })),
    [rings],
  );

  const activeRingRadius =
    rings.find((ring) => ring.decade.id === activeDecade?.id)?.radius ?? 207;

  const hoveredSoundtrack = useMemo(() => {
    if (!hoveredSoundtrackKey) return null;
    return (
      activeSoundtracks.find(
        (soundtrack) => soundtrack.key === hoveredSoundtrackKey,
      ) ?? null
    );
  }, [activeSoundtracks, hoveredSoundtrackKey]);

  const markerBaseRadius = useMemo(
    () => getMarkerRadius(activeRingRadius, activeSoundtracks.length),
    [activeRingRadius, activeSoundtracks.length],
  );
  const markerBaseWidth = useMemo(
    () => Math.max(18, markerBaseRadius * 2),
    [markerBaseRadius],
  );

  const coords = (index: number, radius: number, totalItems: number) => {
    const angleDeg = totalItems > 0 ? (360 / totalItems) * index - 90 : -90;
    const angle = (angleDeg * Math.PI) / 180;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  const soundtrackClipId = (soundtrackKey: string) =>
    `vre-soundtrack-clip-${soundtrackKey}`;
  const isHoveredSoundtrack = (soundtrackKey: string) =>
    hoveredSoundtrackKey === soundtrackKey;

  const onDecadeHover = (decadeId: string) => {
    setHoveredDecadeId(decadeId);
    setHoveredSoundtrackKey(null);
    setTooltip((current) => ({ ...current, visible: false }));
  };

  const onDecadeUnhover = (decadeId: string) => {
    if (selectedDecadeId !== decadeId) {
      setHoveredDecadeId(null);
      setHoveredSoundtrackKey(null);
      setTooltip((current) => ({ ...current, visible: false }));
    }
  };

  const selectDecade = (decadeId: string) => {
    setSelectedDecadeId(decadeId);
    setHoveredDecadeId(null);
    setHoveredSoundtrackKey(null);
    setTooltip((current) => ({ ...current, visible: false }));
  };

  const onRingEnter = (decadeId: string) => {
    setHoveredDecadeId(decadeId);
    setHoveredSoundtrackKey(null);
    setTooltip((current) => ({ ...current, visible: false }));
  };

  const onRingLeave = (
    event: MouseEvent<SVGCircleElement>,
    decadeId: string,
  ) => {
    const related = event.relatedTarget as Element | null;
    const movingToSoundtrack = !!related?.closest?.(".vre__soundtrack-group");

    if (!movingToSoundtrack && selectedDecadeId !== decadeId) {
      setHoveredDecadeId(null);
      setHoveredSoundtrackKey(null);
      setTooltip((current) => ({ ...current, visible: false }));
    }
  };

  const onSoundtrackEnter = (
    decadeId: string,
    soundtrackKey: string,
    event: MouseEvent<SVGGElement>,
  ) => {
    setHoveredDecadeId(decadeId);
    setHoveredSoundtrackKey(soundtrackKey);

    const visualRect = visualRef.current?.getBoundingClientRect();
    const targetRect = event.currentTarget.getBoundingClientRect();

    if (!visualRect) {
      setTooltip((current) => ({ ...current, visible: false }));
      return;
    }

    const x = Math.min(
      Math.max(targetRect.left - visualRect.left + targetRect.width / 2, 190),
      Math.max(visualRect.width - 190, 190),
    );
    const y = Math.max(targetRect.top - visualRect.top - 18, 24);

    setTooltip({ visible: true, x, y });
  };

  const onSoundtrackLeave = (soundtrackKey: string) => {
    if (hoveredSoundtrackKey === soundtrackKey) {
      setHoveredSoundtrackKey(null);
    }
    setTooltip((current) => ({ ...current, visible: false }));
  };

  const tooltipMetadataEntries = useMemo(() => {
    if (!hoveredSoundtrack) return [];
    return Object.entries(hoveredSoundtrack.metadata).filter(
      ([key]) => key !== "local_image_path" && key !== "id" && key !== "title",
    );
  }, [hoveredSoundtrack]);

  return (
    <div
      className={cx("vre", className)}
      style={{
        ...style,
        minHeight,
        height,
        ["--vre-panel-width" as string]: `${panelWidth}px`,
      }}
    >
      <aside className="vre__left">
        <div className="vre__title">
          <h1 className="mcg-page-title mcg-page-title--flow mcg-page-title--light">
            {title}
          </h1>
          <p className="vre__subtitle">{subtitle}</p>
        </div>
      </aside>

      <main className="vre__right">
        <div className="vre__visual" ref={visualRef}>
          <svg
            className="vre__svg"
            viewBox="-640 -640 1280 1280"
            aria-label="Vinyl visualization"
          >
            <defs>
              <linearGradient
                id="vre-ring-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="50%" stopColor="#cccccc" />
                <stop offset="100%" stopColor="#4a4a4a" />
              </linearGradient>

              <clipPath id="vre-center-clip">
                <circle cx="0" cy="0" r="100" />
              </clipPath>

              {activeSoundtracks.map((soundtrack, index) => {
                const point = coords(
                  index,
                  activeRingRadius,
                  activeSoundtracks.length,
                );
                const { width, height } = getMarkerDimensions(
                  markerBaseWidth,
                  isHoveredSoundtrack(soundtrack.key),
                );

                return (
                  <clipPath
                    key={soundtrack.key}
                    id={soundtrackClipId(soundtrack.key)}
                  >
                    <rect
                      x={point.x - width / 2}
                      y={point.y - height / 2}
                      width={width}
                      height={height}
                      rx="4"
                    />
                  </clipPath>
                );
              })}
            </defs>

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="490"
              fill="none"
              stroke="#0f0f0f"
              strokeWidth="48"
            />

            <g>
              {Array.from({ length: 70 }, (_, index) => (
                <circle
                  key={index}
                  className="vre__no-pointer"
                  cx="0"
                  cy="0"
                  r={120 + index * 5}
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="110"
              fill="#1a1a1a"
              stroke="#2a2a2a"
              strokeWidth="2"
            />

            <image
              className="vre__no-pointer"
              href={centerImageUrl}
              x="-250"
              y="-150"
              width="400"
              height="400"
              clipPath="url(#vre-center-clip)"
              preserveAspectRatio="xMidYMid slice"
            />

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="25"
              fill="black"
            />

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="490"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="36"
            />

            <g>
              {decorativeRings.map((ring) => (
                <circle
                  key={ring.key}
                  className="vre__no-pointer vre__decorative"
                  cx="0"
                  cy="0"
                  r={ring.radius}
                  fill="none"
                  stroke="url(#vre-ring-gradient)"
                  strokeWidth="1"
                />
              ))}

              {rings.map((ring) => (
                <g key={ring.key} data-decade-id={ring.decade.id}>
                  <circle
                    className="vre__hover-target"
                    cx="0"
                    cy="0"
                    r={ring.radius}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="30"
                    onMouseEnter={() => onRingEnter(ring.decade.id)}
                    onClick={() => selectDecade(ring.decade.id)}
                    onMouseLeave={(event) => onRingLeave(event, ring.decade.id)}
                  />

                  <circle
                    className="vre__visible-ring"
                    cx="0"
                    cy="0"
                    r={ring.radius}
                    fill="none"
                    stroke={
                      activeDecadeId === ring.decade.id
                        ? "#ffdd1d"
                        : "url(#vre-ring-gradient)"
                    }
                    strokeWidth={activeDecadeId === ring.decade.id ? 2.5 : 1.5}
                  />

                  <g className="vre__artists-layer">
                    {activeDecadeId === ring.decade.id
                      ? ring.decade.soundtracks.map((soundtrack, index) => {
                          const point = coords(
                            index,
                            ring.radius,
                            ring.decade.soundtracks.length,
                          );
                          const hovered = isHoveredSoundtrack(soundtrack.key);
                          const { width, height } = getMarkerDimensions(
                            markerBaseWidth,
                            hovered,
                          );

                          return (
                            <g
                              key={soundtrack.key}
                              className="vre__soundtrack-group vre__pop-in vre__pop-in-active"
                              onMouseEnter={(event) =>
                                onSoundtrackEnter(
                                  ring.decade.id,
                                  soundtrack.key,
                                  event,
                                )
                              }
                              onMouseLeave={() =>
                                onSoundtrackLeave(soundtrack.key)
                              }
                              onClick={(event) =>
                                onSoundtrackEnter(
                                  ring.decade.id,
                                  soundtrack.key,
                                  event,
                                )
                              }
                            >
                              <rect
                                className="vre__artist-hover-target"
                                x={point.x - width / 2 - 8}
                                y={point.y - height / 2 - 8}
                                width={width + 16}
                                height={height + 16}
                                rx="8"
                                fill="transparent"
                              />

                              <rect
                                className="vre__artist-border"
                                x={point.x - width / 2}
                                y={point.y - height / 2}
                                width={width}
                                height={height}
                                rx="4"
                                fill="none"
                                stroke={hovered ? "#EF4444" : "#DC2626"}
                                strokeWidth="4"
                              />

                              <image
                                className="vre__artist-image vre__no-pointer"
                                href={soundtrack.imageUrl}
                                x={point.x - width / 2}
                                y={point.y - height / 2}
                                width={width}
                                height={height}
                                clipPath={`url(#${soundtrackClipId(soundtrack.key)})`}
                                preserveAspectRatio="xMidYMid slice"
                              />
                            </g>
                          );
                        })
                      : null}
                  </g>
                </g>
              ))}
            </g>
          </svg>

          {loading ? (
            <div className="vre__status-overlay">{loadingText}</div>
          ) : loadError ? (
            <div className="vre__status-overlay">{errorText}</div>
          ) : !decades.length ? (
            <div className="vre__status-overlay">{emptyText}</div>
          ) : null}

          {hoveredSoundtrack && tooltip.visible ? (
            <div
              className="vre__tooltip vre__enter-up"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <div className="vre__tooltip-image-wrap">
                <img
                  className="vre__tooltip-image"
                  src={hoveredSoundtrack.imageUrl}
                  alt={hoveredSoundtrack.title}
                />
              </div>
              <div className="vre__tooltip-body">
                <div className="vre__tooltip-title-row">
                  <h2>{hoveredSoundtrack.title}</h2>
                  <span>{hoveredSoundtrack.year}</span>
                </div>
                <div className="vre__meta-list">
                  {tooltipMetadataEntries.map(([key, value]) => (
                    <div className="vre__meta-row" key={key}>
                      <span className="vre__meta-label">
                        {formatMetadataLabel(key)}
                      </span>
                      <span className="vre__meta-value">
                        {String(value).trim() || "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="vre__panel">
          <div className="vre__legend">
            <div className="vre__legend-row">
              <span className="vre__dot" />
              <span>{resolvedDecadeLabel}</span>
            </div>
            <div className="vre__legend-row">
              <span className="vre__dot vre__dot--red" />
              <span>{resolvedSoundtrackLabel}</span>
            </div>
          </div>

          <div className="vre__song-section">
            <h3>Decades</h3>
            <div className="vre__song-list">
              {decades.map((decade) => (
                <button
                  key={decade.id}
                  type="button"
                  className={cx(
                    "vre__song-btn",
                    activeDecadeId === decade.id && "is-active",
                  )}
                  onMouseEnter={() => onDecadeHover(decade.id)}
                  onMouseLeave={() => onDecadeUnhover(decade.id)}
                  onClick={() => selectDecade(decade.id)}
                >
                  <span className="vre__song-title">{decade.label}</span>
                  <span className="vre__song-meta">
                    {decade.soundtracks.length} soundtracks
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export const SectionVinyl = VinylRecordExplorer;
export default VinylRecordExplorer;
