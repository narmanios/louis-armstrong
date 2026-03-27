import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import rawCareerTimeline from "../../../data/career-timeline.json" with { type: "json" };
import "./SectionCareerTimeline.css";

type Category = "musician" | "vocalist" | "bandleader" | "ambassador" | "film";

type ArmstrongEvent = {
  id: number;
  year: number;
  dateText: string;
  event: string;
  categories: Category[];
  image?: string;
  url?: string;
};

type CareerTimelineData = {
  categoryLabels: Record<Category, string>;
  categoryColors: Record<Category, string>;
  events: ArmstrongEvent[];
};

const timelineData = rawCareerTimeline as CareerTimelineData;
const dataYearMax = timelineData.events.reduce(
  (max, event) => Math.max(max, event.year),
  0,
);

interface SectionCareerTimelineProps {
  textBaseStyle: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

type DotData = {
  key: string;
  event: ArmstrongEvent;
  cx: number;
  cy: number;
  cat: Category;
  clusterKey: string;
  clusterCount: number;
};

type DotCluster = {
  key: string;
  cx: number;
  cy: number;
  cat: Category;
  dots: DotData[];
};

type TipInfo = {
  event: ArmstrongEvent;
  x: number;
  y: number;
  key: string;
  cat: Category;
};

type FeaturedCfg = {
  lines: string[];
  cat: Category;
  dir: "above" | "below";
  connectorLength?: number;
  lineHeight?: number;
  dashArray?: string;
};

const allCategories: Category[] = [
  "musician",
  "vocalist",
  "bandleader",
  "ambassador",
  "film",
];
const categoryOrder: Category[] = [
  "film",
  "bandleader",
  "musician",
  "vocalist",
  "ambassador",
];

const laneY: Record<Category, number> = {
  film: 80,
  bandleader: 185,
  musician: 290,
  vocalist: 395,
  ambassador: 500,
};
const categoryColors: Record<Category, string> = {
  film: "#FF6B6B",
  bandleader: "#F59E0B",
  musician: "#2563EB",
  vocalist: "#10B981",
  ambassador: "#8B5CF6",
};
const svgHeight = 560;
const yearStart = 1923;
const yearEnd = Math.max(1973, dataYearMax);
const marginLeft = 72;
const marginRight = 20;
const fallbackDotRadius = 3.25;
const fallbackFeaturedDotRadiusOffset = 0;
const fallbackActiveDotRadiusOffset = 1.25;
const fallbackLaneStroke = "#B8B1A2";
const fallbackLaneStrokeWidth = 0.8;
const decadeDash = "4 4";
const connectorDash = "2 2";
const featuredLabelLineHeight = 11;
const featuredLabelConnectorLength = 28;
const featuredLabelAboveOffset = 4;
const featuredLabelBelowOffset = 3;
const yearAxisY = 530;

const featuredLabels: Record<number, FeaturedCfg> = {
  35: {
    lines: ["A Rhapsody in", "Black & Blue (1932)"],
    cat: "film",
    dir: "above",
  },
  42: { lines: ["Pennies from", "Heaven (1936)"], cat: "film", dir: "below" },
  48: { lines: ["Going Places", "(1938)"], cat: "film", dir: "above" },
  72: { lines: ["High Society", "(1956)"], cat: "film", dir: "below" },
  82: { lines: ["The Five Pennies", "(1958)"], cat: "film", dir: "above" },
  93: { lines: ["Hello, Dolly!", "Film (1968)"], cat: "film", dir: "above" },
  9: { lines: ["Hot Five (1925)"], cat: "bandleader", dir: "above" },
  10: {
    lines: ["Heebie Jeebies", "(1926)"],
    cat: "bandleader",
    dir: "above",
    connectorLength: 40,
    lineHeight: 14,
    dashArray: "6 3",
  },
  56: { lines: ["Carnegie Hall", "(1947)"], cat: "bandleader", dir: "above" },
  74: { lines: ["Ella and Louis", "(1956)"], cat: "bandleader", dir: "below" },
  91: {
    lines: ["What a", "Wonderful World", "(1967)"],
    cat: "bandleader",
    dir: "above",
  },
  1: { lines: ["Chimes Blues", "(1923)"], cat: "musician", dir: "below" },
  18: { lines: ["West End Blues", "(1928)"], cat: "musician", dir: "above" },
  22: { lines: ["Ain't Misbehavin'", "(1929)"], cat: "musician", dir: "below" },
  71: { lines: ["Mack the Knife", "(1955)"], cat: "musician", dir: "below" },
  88: { lines: ["Hello, Dolly!", "(1963)"], cat: "musician", dir: "below" },
  7: {
    lines: ["St. Louis Blues", "w/ Bessie Smith", "(1925)"],
    cat: "vocalist",
    dir: "below",
  },
  25: { lines: ["Rockin' Chair", "(1929)"], cat: "vocalist", dir: "below" },
  62: { lines: ["La Vie En Rose", "(1950)"], cat: "vocalist", dir: "above" },
  65: {
    lines: ["A Kiss to Build", "a Dream On (1951)"],
    cat: "vocalist",
    dir: "below",
  },
  87: {
    lines: ["The Real", "Ambassadors", "(1961)"],
    cat: "ambassador",
    dir: "above",
  },
};

function xOf(year: number, width: number) {
  return (
    marginLeft +
    ((year - yearStart) / (yearEnd - yearStart)) *
      (width - marginLeft - marginRight)
  );
}

function CategoryPill({
  active,
  count,
  onToggle,
  label,
  color,
}: {
  active: boolean;
  count: number;
  onToggle: () => void;
  label: string;
  color: string;
}) {
  const pillVars = {
    "--career-pill-bg": active ? `${color}12` : "transparent",
    "--career-pill-dot": color,
    "--career-pill-label": active ? "#111827" : "#9CA3AF",
    "--career-pill-count": active ? color : "#9CA3AF",
  } as React.CSSProperties;

  return (
    <button
      onClick={onToggle}
      style={pillVars}
      className="career-timeline-legend-filter"
    >
      <span className="career-timeline-legend-dot" />
      <span className="career-timeline-legend-label">{label}</span>
      <span className="career-timeline-legend-count">{count}</span>
    </button>
  );
}

function TimelineSVG({
  svgWidth,
  active,
  selected,
  onSelect,
  dotRadius,
  featuredDotRadiusOffset,
  activeDotRadiusOffset,
  laneStroke,
  laneStrokeWidth,
}: {
  svgWidth: number;
  active: Set<Category>;
  selected: ArmstrongEvent | null;
  onSelect: (event: ArmstrongEvent | null) => void;
  dotRadius: number;
  featuredDotRadiusOffset: number;
  activeDotRadiusOffset: number;
  laneStroke: string;
  laneStrokeWidth: number;
}) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [hoverTip, setHoverTip] = useState<TipInfo | null>(null);
  const [pinTip, setPinTip] = useState<TipInfo | null>(null);
  const [hoverClusterKey, setHoverClusterKey] = useState<string | null>(null);
  const lastHoverPos = useRef<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const clusters = useMemo<DotCluster[]>(() => {
    const grouped = new Map<string, ArmstrongEvent[]>();
    timelineData.events.forEach((event) => {
      event.categories.forEach((category) => {
        if (!active.has(category)) return;
        const key = `${event.year}-${category}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(event);
      });
    });

    const output: DotCluster[] = [];
    grouped.forEach((eventsAtPoint, groupKey) => {
      const separatorIndex = groupKey.indexOf("-");
      const year = parseInt(groupKey.slice(0, separatorIndex), 10);
      const category = groupKey.slice(separatorIndex + 1) as Category;
      const baseY = laneY[category];
      const cx = xOf(year, svgWidth);
      const count = eventsAtPoint.length;
      const step = count === 1 ? 0 : Math.min(8, 32 / (count - 1));
      const dots = eventsAtPoint.map((event, index) => {
        const yOffset = count === 1 ? 0 : (index - (count - 1) / 2) * step;
        return {
          key: `${event.id}-${category}`,
          event,
          cx,
          cy: baseY + yOffset,
          cat: category,
          clusterKey: groupKey,
          clusterCount: count,
        };
      });
      output.push({
        key: groupKey,
        cx,
        cy: baseY,
        cat: category,
        dots,
      });
    });
    return output.sort((a, b) => a.cx - b.cx || a.cy - b.cy);
  }, [active, svgWidth]);

  const dots = useMemo(() => clusters.flatMap((cluster) => cluster.dots), [clusters]);

  const featuredDots = useMemo(() => {
    const seen = new Set<number>();
    return dots.filter((dot) => {
      const featured = featuredLabels[dot.event.id];
      if (!featured || featured.cat !== dot.cat) return false;
      if (seen.has(dot.event.id)) return false;
      seen.add(dot.event.id);
      return true;
    });
  }, [dots]);

  const displayTip = hoverTip ?? pinTip;
  const isPinned = !hoverTip && !!pinTip;
  const focusLineX = useMemo(() => {
    if (hoverTip) {
      return dots.find((dot) => dot.key === hoverTip.key)?.cx ?? null;
    }
    if (pinTip) {
      return dots.find((dot) => dot.key === pinTip.key)?.cx ?? null;
    }
    if (hoverClusterKey) {
      return clusters.find((cluster) => cluster.key === hoverClusterKey)?.cx ?? null;
    }
    return null;
  }, [clusters, dots, hoverClusterKey, hoverTip, pinTip]);

  const onEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>, dot: DotData) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        lastHoverPos.current = { x, y };
        setHoverTip({ event: dot.event, x, y, key: dot.key, cat: dot.cat });
      }
      setHoverKey(dot.key);
      setHoverClusterKey(dot.clusterKey);
      setPinTip((prev) => (prev?.key === dot.key ? prev : null));
    },
    [],
  );

  const onClusterEnter = useCallback((clusterKey: string) => {
    setHoverClusterKey(clusterKey);
    setHoverTip(null);
    setHoverKey(null);
  }, []);

  const onClusterLeave = useCallback((cluster: DotCluster) => {
    setHoverClusterKey((prev) => (prev === cluster.key ? null : prev));
    setHoverTip((prev) =>
      prev && cluster.dots.some((dot) => dot.key === prev.key) ? null : prev,
    );
    setHoverKey((prev) =>
      prev && cluster.dots.some((dot) => dot.key === prev) ? null : prev,
    );
  }, []);

  const toggleDotSelection = useCallback(
    (dot: DotData) => {
      const position = lastHoverPos.current ?? {
        x: dot.cx + 14,
        y: dot.cy - 30,
      };
      setPinTip((prev) =>
        prev?.key === dot.key
          ? null
          : {
              event: dot.event,
              x: position.x,
              y: position.y,
              key: dot.key,
              cat: dot.cat,
            },
      );
      onSelect(selected?.id === dot.event.id ? null : dot.event);
    },
    [onSelect, selected],
  );

  const yearTicks: number[] = [];
  for (let year = yearStart; year <= yearEnd; year += 5) yearTicks.push(year);
  if (yearTicks[yearTicks.length - 1] !== yearEnd) yearTicks.push(yearEnd);

  return (
    <div className="career-timeline-chart-wrap">
      <svg
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        className="career-timeline-chart-svg"
      >
        <rect
          className="career-timeline-plot-frame"
          x={marginLeft}
          y={35}
          width={svgWidth - marginLeft - marginRight}
          height={yearAxisY + 6 - 35}
          rx={14}
        />

        {yearTicks.map((year) => (
          <line
            key={`grid-${year}`}
            className="career-timeline-year-grid-line"
            // stroke-opacity="0.9"
            x1={xOf(year, svgWidth)}
            x2={xOf(year, svgWidth)}
            y1={35}
            y2={yearAxisY + 6}
          />
        ))}

        {focusLineX !== null ? (
          <line
            className="career-timeline-focus-line"
            x1={focusLineX}
            x2={focusLineX}
            y1={35}
            y2={yearAxisY + 6}
          />
        ) : null}

        {categoryOrder.map((category) =>
          active.has(category) ? (
            <line
              key={category}
              x1={marginLeft}
              x2={svgWidth - marginRight}
              y1={laneY[category]}
              y2={laneY[category]}
              stroke={laneStroke}
              strokeWidth={laneStrokeWidth}
            />
          ) : null,
        )}

        {featuredDots.map((dot) => {
          if (!active.has(dot.cat)) return null;
          const featured = featuredLabels[dot.event.id];
          const offset = dotRadius + 1;
          const y1 =
            featured.dir === "above" ? dot.cy - offset : dot.cy + offset;
          const connectorLength =
            featured.connectorLength ?? featuredLabelConnectorLength;
          const y2 =
            featured.dir === "above"
              ? y1 - connectorLength
              : y1 + connectorLength;
          return (
            <line
              key={`conn-${dot.event.id}`}
              x1={dot.cx}
              y1={y1}
              x2={dot.cx}
              y2={y2}
              stroke="#8c8679"
              strokeWidth={1}
              strokeDasharray={featured.dashArray ?? connectorDash}
            />
          );
        })}

        {featuredDots.map((dot) => {
          if (!active.has(dot.cat)) return null;
          const featured = featuredLabels[dot.event.id];
          const offset = dotRadius + 1;
          const connectorLength =
            featured.connectorLength ?? featuredLabelConnectorLength;
          const y2 =
            featured.dir === "above"
              ? dot.cy - offset - connectorLength
              : dot.cy + offset + connectorLength;
          const lines = featured.lines.length;
          const lineHeight = featured.lineHeight ?? featuredLabelLineHeight;
          const firstBaseline =
            featured.dir === "above"
              ? y2 - featuredLabelAboveOffset - (lines - 1) * lineHeight
              : y2 + lineHeight;
          return (
            <g key={`lbl-${dot.event.id}`}>
              <text
                className="career-timeline-featured-label"
                x={dot.cx}
                y={firstBaseline}
                textAnchor="middle"
              >
                {featured.lines.map((line, index) => (
                  <tspan
                    key={index}
                    x={dot.cx}
                    dy={index === 0 ? 0 : lineHeight}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {yearTicks.map((year) => (
          <g key={year}>
            <text
              className="career-timeline-year-label"
              x={xOf(year, svgWidth)}
              y={yearAxisY + 16}
              textAnchor="middle"
              style={
                {
                  "--career-year-color": "#000000",
                  "--career-year-size": year % 10 === 0 ? "10px" : "9px",
                  "--career-year-weight": year % 10 === 0 ? 700 : 400,
                } as React.CSSProperties
              }
            >
              {year}
            </text>
          </g>
        ))}
      </svg>

      <div className="career-timeline-dot-layer">
        {clusters.map((cluster) => {
          const spread =
            cluster.dots.length > 1
              ? cluster.dots[cluster.dots.length - 1].cy - cluster.dots[0].cy
              : 0;
          const maxRadius = dotRadius + activeDotRadiusOffset;
          const clusterWidth = Math.max(maxRadius * 2 + 20, 44);
          const clusterHeight = Math.max(spread + maxRadius * 2 + 20, 44);
          const clusterLeft = cluster.cx - clusterWidth / 2;
          const clusterTop = cluster.cy - clusterHeight / 2;
          const pinnedDot = cluster.dots.find((dot) => pinTip?.key === dot.key);
          const selectedDot = cluster.dots.find(
            (dot) => selected?.id === dot.event.id,
          );
          const isExpanded =
            hoverClusterKey === cluster.key || !!pinnedDot || !!selectedDot;

          return (
            <div
              key={cluster.key}
              className={`career-timeline-dot-cluster ${isExpanded ? "is-expanded" : ""}`}
              style={{
                left: clusterLeft,
                top: clusterTop,
                width: clusterWidth,
                height: clusterHeight,
                zIndex: isExpanded ? 3 : selectedDot ? 2 : 1,
              }}
              onMouseEnter={() => onClusterEnter(cluster.key)}
              onMouseLeave={() => onClusterLeave(cluster)}
            >
              {cluster.dots.map((dot, dotIndex) => {
                const isSelected = selected?.id === dot.event.id;
                const isPinned = pinTip?.key === dot.key;
                const isHovered = hoverKey === dot.key;
                const featured =
                  featuredLabels[dot.event.id] &&
                  featuredLabels[dot.event.id].cat === dot.cat;
                const color = categoryColors[dot.cat];
                const radius =
                  isHovered || isSelected || isPinned
                    ? dotRadius + activeDotRadiusOffset
                    : featured
                      ? dotRadius + featuredDotRadiusOffset
                      : dotRadius;
                const diameter = radius * 2;
                const centerY = isExpanded
                  ? clusterHeight / 2 + (dot.cy - cluster.cy)
                  : clusterHeight / 2;
                const defaultBorderWidth = 0.8;
                const activeBorderWidth = 1.1;

                return (
                  <button
                    key={dot.key}
                    type="button"
                    className="career-timeline-event-dot"
                    aria-label={dot.event.event}
                    style={{
                      left: clusterWidth / 2 - radius,
                      top: centerY - radius,
                      width: diameter,
                      height: diameter,
                      borderColor: "#4B473F",
                      borderWidth:
                        isHovered || isSelected || isPinned
                          ? activeBorderWidth
                          : defaultBorderWidth,
                      backgroundColor: color,
                      boxShadow:
                        isHovered || isSelected || isPinned
                          ? `0 0 0 1.5px ${color}20`
                          : "none",
                      transform:
                        isHovered || isSelected || isPinned
                          ? "scale(1.12)"
                          : "scale(1)",
                      opacity: isExpanded || dotIndex === 0 ? 1 : 0,
                      pointerEvents: isExpanded || dotIndex === 0 ? "auto" : "none",
                      zIndex: isExpanded
                        ? 1 + cluster.dots.length - Math.abs(dot.cy - cluster.cy)
                        : 1,
                    }}
                    onMouseEnter={(event) => {
                      if (!isExpanded && dot.clusterCount > 1) {
                        setHoverTip(null);
                        setHoverKey(null);
                        setHoverClusterKey(dot.clusterKey);
                        return;
                      }
                      onEnter(event, dot);
                    }}
                    onClick={() => {
                      if (!isExpanded && dot.clusterCount > 1) {
                        setHoverTip(null);
                        setHoverKey(null);
                        setHoverClusterKey(dot.clusterKey);
                        return;
                      }
                      toggleDotSelection(dot);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {displayTip && (
        <div
          className="career-timeline-tooltip-wrap"
          style={{
            left: Math.min(displayTip.x + 16, svgWidth - 260),
            top: Math.max(displayTip.y - 60, 4),
            pointerEvents: isPinned ? "auto" : "none",
          }}
        >
          <div
            className="career-timeline-tooltip"
            style={{
              border: `1.5px solid ${categoryColors[displayTip.cat]}`,
            }}
          >
            <div
              className="career-timeline-tooltip-date"
              style={{ color: categoryColors[displayTip.cat] }}
            >
              {displayTip.event.dateText}
            </div>
            <div className="career-timeline-tooltip-text">
              {displayTip.event.event.length > 90
                ? `${displayTip.event.event.slice(0, 90)}…`
                : displayTip.event.event}
            </div>
            <div className="career-timeline-tooltip-tags">
              {displayTip.event.categories.map((category) => (
                <span
                  key={category}
                  style={{
                    backgroundColor: `${categoryColors[category]}18`,
                    color: categoryColors[category],
                  }}
                  className="career-timeline-tooltip-tag"
                >
                  {timelineData.categoryLabels[category]}
                </span>
              ))}
            </div>
            {displayTip.event.url && (
              <a
                href={displayTip.event.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="career-timeline-tooltip-link"
                style={{
                  color: categoryColors[displayTip.cat],
                }}
              >
                <svg width="14" height="10" viewBox="0 0 24 17" fill="none">
                  <path
                    d="M23.5 2.6S23.2.7 22.4.0C21.4-.9 20.3-.9 19.8-.8 16.5 0 12 0 12 0S7.5 0 4.2-.8C3.7-.9 2.6-.9 1.6.0.8.7.5 2.6.5 2.6S0 4.8 0 7v2.1c0 2.2.5 4.4.5 4.4s.3 1.9 1.1 2.6c1 .9 2.4.8 3 .9C6.5 17 12 17 12 17s4.5 0 7.8-.9c.5-.1 1.6-.1 2.6-1 .8-.7 1.1-2.6 1.1-2.6S24 11.3 24 9.1V7c0-2.2-.5-4.4-.5-4.4z"
                    fill="#FF0000"
                  />
                  <path d="M9.5 12V5l6.5 3.5L9.5 12z" fill="white" />
                </svg>
                Watch on YouTube
              </a>
            )}
            {isPinned && (
              <div
                className="career-timeline-tooltip-pin-hint"
                style={{
                  marginTop: displayTip.event.url ? 5 : 8,
                }}
              >
                Hover or click another dot to dismiss
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const SectionCareerTimeline: React.FC<SectionCareerTimelineProps> = ({
  textBaseStyle,
  className,
  style,
}) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(1000);
  const [dotRadius, setDotRadius] = useState(fallbackDotRadius);
  const [featuredDotRadiusOffset, setFeaturedDotRadiusOffset] = useState(
    fallbackFeaturedDotRadiusOffset,
  );
  const [activeDotRadiusOffset, setActiveDotRadiusOffset] = useState(
    fallbackActiveDotRadiusOffset,
  );
  const [laneStroke, setLaneStroke] = useState(fallbackLaneStroke);
  const [laneStrokeWidth, setLaneStrokeWidth] = useState(
    fallbackLaneStrokeWidth,
  );
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(allCategories),
  );
  const [selectedEvent, setSelectedEvent] = useState<ArmstrongEvent | null>(
    null,
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const updateMetrics = () => {
      setSvgWidth(element.clientWidth);
      const cssRadius = Number.parseFloat(
        getComputedStyle(element).getPropertyValue("--career-dot-radius"),
      );
      const cssFeaturedRadiusOffset = Number.parseFloat(
        getComputedStyle(element).getPropertyValue(
          "--career-dot-featured-radius-offset",
        ),
      );
      const cssActiveRadiusOffset = Number.parseFloat(
        getComputedStyle(element).getPropertyValue(
          "--career-dot-active-radius-offset",
        ),
      );
      const cssLaneStroke = getComputedStyle(element)
        .getPropertyValue("--career-lane-stroke")
        .trim();
      const cssLaneStrokeWidth = Number.parseFloat(
        getComputedStyle(element).getPropertyValue("--career-lane-stroke-width"),
      );
      setDotRadius(Number.isFinite(cssRadius) ? cssRadius : fallbackDotRadius);
      setFeaturedDotRadiusOffset(
        Number.isFinite(cssFeaturedRadiusOffset)
          ? cssFeaturedRadiusOffset
          : fallbackFeaturedDotRadiusOffset,
      );
      setActiveDotRadiusOffset(
        Number.isFinite(cssActiveRadiusOffset)
          ? cssActiveRadiusOffset
          : fallbackActiveDotRadiusOffset,
      );
      setLaneStroke(cssLaneStroke || fallbackLaneStroke);
      setLaneStrokeWidth(
        Number.isFinite(cssLaneStrokeWidth)
          ? cssLaneStrokeWidth
          : fallbackLaneStrokeWidth,
      );
    };
    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      selectedEvent &&
      !selectedEvent.categories.some((category) =>
        activeCategories.has(category),
      )
    ) {
      setSelectedEvent(null);
    }
  }, [activeCategories, selectedEvent]);

  const toggleCategory = (category: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        if (next.size > 1) next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      musician: 0,
      vocalist: 0,
      bandleader: 0,
      ambassador: 0,
      film: 0,
    };
    timelineData.events.forEach((event) => {
      event.categories.forEach((category) => {
        counts[category] += 1;
      });
    });
    return counts;
  }, []);

  return (
    <section
      className={`mcg-section career-timeline-section ${className || ""}`}
      style={{
        width: isMobile ? "100%" : "100vw",
        minWidth: isMobile ? 0 : "100vw",
        height: isMobile ? "auto" : "800px",
        flexShrink: isMobile ? undefined : 0,
        scrollSnapAlign: isMobile ? undefined : "start",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--career-chart-bg)",
        ...style,
      }}
    >
      <div className="career-timeline-layout">
        <div className="career-timeline-header">
          <h2 className="career-timeline-title mcg-page-title mcg-page-title--flow">
            Louis Armstrong Career Timeline
          </h2>
        </div>

        <div className="career-timeline-legend-panel">
          {allCategories.map((category) => (
            <CategoryPill
              key={category}
              active={activeCategories.has(category)}
              count={categoryCounts[category]}
              onToggle={() => toggleCategory(category)}
              label={timelineData.categoryLabels[category]}
              color={categoryColors[category]}
            />
          ))}
          <button
            onClick={() => setActiveCategories(new Set(allCategories))}
            className="career-timeline-all-button"
          >
            All
          </button>
        </div>

        <div className="career-timeline-chart-card">
          <div ref={containerRef} className="career-timeline-scroll-area">
            <div className="career-timeline-scroll-inner">
              <TimelineSVG
                svgWidth={Math.max(svgWidth, 1000)}
                active={activeCategories}
                selected={selectedEvent}
                onSelect={setSelectedEvent}
                dotRadius={dotRadius}
                featuredDotRadiusOffset={featuredDotRadiusOffset}
                activeDotRadiusOffset={activeDotRadiusOffset}
                laneStroke={laneStroke}
                laneStrokeWidth={laneStrokeWidth}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
