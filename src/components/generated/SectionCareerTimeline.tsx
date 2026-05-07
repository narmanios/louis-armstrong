import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import rawCareerTimeline from "../../../public/assets/data/career-timeline.json" with { type: "json" };
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

type RawArmstrongEvent = {
  id: number;
  year: number | string;
  dateText: string;
  event: string;
  categories: string[];
  image?: string;
  url?: string;
};

type CareerTimelineData = {
  categoryLabels: Record<Category, string>;
  categoryColors: Record<Category, string>;
  events: ArmstrongEvent[];
};

type RawCareerTimelineData = {
  categoryLabels: Record<Category, string>;
  categoryColors: Record<Category, string>;
  events: RawArmstrongEvent[];
};

function parseTimelineYear(value: number | string): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const match = value.trim().match(/^(\d{4})/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

const allowedCategorySet = new Set<Category>([
  "musician",
  "vocalist",
  "bandleader",
  "ambassador",
  "film",
]);

const categoryDetailTitles: Record<Category, string> = {
  musician: "Armstrong as a Musician",
  vocalist: "Armstrong as a Vocalist",
  bandleader: "Armstrong as a Bandleader",
  ambassador: "Armstrong as an Ambassador",
  film: "Armstrong as a Film Star",
};

const rawTimelineData = rawCareerTimeline as RawCareerTimelineData;
const timelineData: CareerTimelineData = {
  categoryLabels: rawTimelineData.categoryLabels,
  categoryColors: rawTimelineData.categoryColors,
  events: (() => {
    // First, parse and filter events
    const parsedEvents = rawTimelineData.events.flatMap((event) => {
      const parsedYear = parseTimelineYear(event.year);
      if (parsedYear === null) {
        return [];
      }

      const validCategories = event.categories.filter(
        (category): category is Category =>
          allowedCategorySet.has(category as Category),
      );

      if (validCategories.length === 0) {
        return [];
      }

      return [
        {
          ...event,
          year: parsedYear,
          categories: validCategories,
        },
      ];
    });

    // Deduplicate and merge events based on content (year, dateText, event)
    // Combine categories from all duplicates and keep the lowest ID
    const uniqueEventsMap = new Map<string, ArmstrongEvent>();

    parsedEvents.forEach((event) => {
      const contentKey = `${event.year}|${event.dateText}|${event.event}`;

      const existing = uniqueEventsMap.get(contentKey);
      if (!existing) {
        uniqueEventsMap.set(contentKey, event);
      } else {
        // Merge categories and keep the lowest ID
        const mergedCategories = Array.from(
          new Set([...existing.categories, ...event.categories]),
        ).sort() as Category[];

        const mergedEvent: ArmstrongEvent = {
          ...existing,
          id: Math.min(existing.id, event.id),
          categories: mergedCategories,
          // Keep image and url from the entry with the lowest ID
          image: existing.id <= event.id ? existing.image : event.image,
          url: existing.id <= event.id ? existing.url : event.url,
        };

        uniqueEventsMap.set(contentKey, mergedEvent);
      }
    });

    const dedupedEvents = Array.from(uniqueEventsMap.values()).sort(
      (a, b) => a.id - b.id,
    );

    // Debug: Log event counts
    console.log(
      "[Career Timeline] Total events after dedup:",
      dedupedEvents.length,
    );
    const event189 = dedupedEvents.find((e) => e.id === 189);
    console.log("[Career Timeline] Event 189:", event189);
    console.log(
      "[Career Timeline] Event 189 categories:",
      event189?.categories,
    );
    console.log("[Career Timeline] Event 189 year:", event189?.year);
    console.log(
      "[Career Timeline] Vocalist events:",
      dedupedEvents.filter((e) => e.categories.includes("vocalist")).length,
    );

    return dedupedEvents;
  })(),
};

const dataYearMax = timelineData.events.reduce(
  (max, event) => Math.max(max, event.year),
  0,
);

interface SectionCareerTimelineProps {
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
  "film",
  "bandleader",
  "musician",
  "vocalist",
  "ambassador",
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
  bandleader: 190,
  musician: 300,
  vocalist: 410,
  ambassador: 520,
};
const categoryColors: Record<Category, string> = {
  film: "#FF6B6B",
  bandleader: "#F59E0B",
  musician: "#00CCE7",
  vocalist: "#10B981",
  ambassador: "#8B5CF6",
};
const svgHeight = 580;
const yearStart = 1923;
const yearEnd = Math.max(1973, dataYearMax);
const marginLeft = 32;
const marginRight = 32;
const fallbackDotRadius = 3.25;
const fallbackFeaturedDotRadiusOffset = 0;
const fallbackActiveDotRadiusOffset = 1.25;
const fallbackLaneStroke = "#B8B1A2";
const fallbackLaneStrokeWidth = 0.8;
const decadeDash = "4 4";
const connectorDash = "2 2";
const featuredLabelLineHeight = 11;
const featuredLabelConnectorLength = 24;
const expandedClusterDotSpacing = 14;
const featuredLabelAboveOffset = 4;
const featuredLabelBelowOffset = 3;
const tooltipWidth = 248;
const tooltipEstimatedHeight = 148;
const tooltipGap = 8;
const tooltipEdgePadding = 8;
const yearAxisY = 540;

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
  189: { lines: ["Hello, Dolly!", "(1964)"], cat: "vocalist", dir: "below" },
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

  107: {
    lines: ["African State Department tour", "(1960)"],
    cat: "ambassador",
    dir: "above",
  },

  87: {
    lines: ["The Real", "Ambassadors", "(1961)"],
    cat: "ambassador",
    dir: "below",
  },
};

function xOf(year: number, width: number) {
  return (
    marginLeft +
    ((year - yearStart) / (yearEnd - yearStart)) *
      (width - marginLeft - marginRight)
  );
}

function getTimelineEventKey(
  event: Pick<ArmstrongEvent, "id" | "year" | "dateText" | "event">,
) {
  // Use a combination of id, year, and dateText to create a truly unique key
  // This handles cases where duplicate IDs exist in the source data
  return `event-${event.id}-${event.year}-${event.dateText.replace(/[^a-zA-Z0-9]/g, "")}`;
}

function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  if (normalized.length !== 6) {
    return hexColor;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    return hexColor;
  }

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function isSameTimelineEvent(
  left: ArmstrongEvent | null | undefined,
  right: ArmstrongEvent | null | undefined,
) {
  if (!left || !right) return false;

  return (
    left.id === right.id ||
    (left.year === right.year &&
      left.dateText === right.dateText &&
      left.event === right.event)
  );
}

function CategoryPill({
  active,
  count,
  onToggle,
  label,
  color,
  dimmed,
  onHover,
  onHoverEnd,
}: {
  active: boolean;
  count: number;
  onToggle: () => void;
  label: string;
  color: string;
  dimmed: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}) {
  const pillVars = {
    "--career-pill-bg": active ? `${color}12` : "transparent",
    "--career-pill-dot": color,
    "--career-pill-label": active ? "#ffffff" : "#9CA3AF",
    "--career-pill-count": active ? color : "#9CA3AF",
  } as React.CSSProperties;

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverEnd();
      }}
      style={{
        ...pillVars,
        opacity: dimmed ? 0.35 : 1,
        transition: "opacity 0.2s ease",
      }}
      className="career-timeline-legend-filter"
    >
      <span
        className="career-timeline-legend-dot"
        style={{
          transform: isHovered ? "scale(1.5)" : "scale(1)",
          boxShadow: isHovered
            ? `0 0 4px 1px ${color}40, 0 0 2px 0px ${color}60`
            : "none",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      />
      <span className="career-timeline-legend-label">{label}</span>
    </button>
  );
}

function StackedDotChart({
  category,
  svgWidth,
  dotRadius,
  onBack,
}: {
  category: Category;
  svgWidth: number;
  dotRadius: number;
  onBack: () => void;
}) {
  const color = categoryColors[category];
  const categoryEvents = useMemo(() => {
    const filtered = timelineData.events.filter((event) =>
      event.categories.includes(category),
    );
    console.log(`[Career Timeline] ${category} events:`, filtered.length);
    console.log(
      `[Career Timeline] ${category} has event 189:`,
      filtered.some((e) => e.id === 189),
    );
    return filtered;
  }, [category]);

  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 50);
    return () => clearTimeout(timer);
  }, [category]);

  const stackMarginLeft = 32;
  const stackMarginRight = 32;
  const stackMarginTop = 120;
  const xAxisY = 80;
  const detailDotRadius = dotRadius * 0.6; // Smaller dots in detail view to fit more
  const dotSpacing = 2; // Reduced vertical spacing between dots in same year column
  const timelineLaneY = laneY[category];

  const stackedDots = useMemo(() => {
    const yearGroups = new Map<number, ArmstrongEvent[]>();
    categoryEvents.forEach((event) => {
      const existing = yearGroups.get(event.year) || [];
      existing.push(event);
      yearGroups.set(event.year, existing);
    });

    console.log(
      `[Career Timeline] ${category} year groups:`,
      Array.from(yearGroups.keys()).sort((a, b) => a - b),
    );
    console.log(
      `[Career Timeline] ${category} 1964 group:`,
      yearGroups.get(1964),
    );

    // Find the maximum number of events in any single year to calculate height
    let maxEventsInYear = 0;
    yearGroups.forEach((events) => {
      maxEventsInYear = Math.max(maxEventsInYear, events.length);
    });

    const dots: Array<{
      event: ArmstrongEvent;
      x: number;
      y: number;
      initialX: number;
      initialY: number;
      key: string;
    }> = [];
    const years = Array.from(yearGroups.keys()).sort((a, b) => a - b);
    const yearRange = yearEnd - yearStart;
    const chartWidth = svgWidth - stackMarginLeft - stackMarginRight;

    years.forEach((year) => {
      const events = yearGroups.get(year)!;
      const xPos =
        stackMarginLeft + ((year - yearStart) / yearRange) * chartWidth;

      // All dots for this year in a single column, stacked vertically
      events.forEach((event, idx) => {
        const x = xPos; // All dots at same X position (single column per year)
        const y = stackMarginTop + idx * (detailDotRadius * 2 + dotSpacing);

        // Calculate initial position from timeline
        const initialX =
          marginLeft +
          ((event.year - yearStart) / (yearEnd - yearStart)) *
            (svgWidth - marginLeft - marginRight);
        const initialY = timelineLaneY;

        dots.push({
          event,
          x,
          y,
          initialX,
          initialY,
          key: getTimelineEventKey(event),
        });
      });
    });

    console.log(`[Career Timeline] ${category} total dots:`, dots.length);
    console.log(
      `[Career Timeline] ${category} max events in single year:`,
      maxEventsInYear,
    );

    return { dots, maxEventsInYear };
  }, [categoryEvents, svgWidth, timelineLaneY, detailDotRadius, dotSpacing]);

  // Calculate dynamic height based on tallest column
  const dynamicHeight = Math.max(
    300,
    stackMarginTop +
      stackedDots.maxEventsInYear * (detailDotRadius * 2 + dotSpacing) +
      300, // Increased bottom padding significantly to prevent cutoff
  );

  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [selectedDot, setSelectedDot] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    event: ArmstrongEvent;
    x: number;
    y: number;
  } | null>(null);

  const yearTicks: number[] = [];
  for (let year = yearStart; year <= yearEnd; year += 10) yearTicks.push(year);
  if (yearTicks[yearTicks.length - 1] !== yearEnd) yearTicks.push(yearEnd);

  return (
    <div
      className="career-timeline-chart-wrap"
      style={{ position: "relative" }}
    >
      <button
        onClick={onBack}
        className="career-timeline-view-btn"
        aria-label="Timeline view"
        style={{
          opacity: isAnimating ? 0 : 1,
          transition: "opacity 0.6s ease-in 0.4s",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <circle cx="6" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="18" cy="12" r="2" fill="currentColor" />
          <line x1="6" y1="6" x2="6" y2="18" strokeWidth="1" opacity="0.4" />
          <line x1="12" y1="6" x2="12" y2="18" strokeWidth="1" opacity="0.4" />
          <line x1="18" y1="6" x2="18" y2="18" strokeWidth="1" opacity="0.4" />
        </svg>
      </button>
      <svg
        width={svgWidth}
        height={dynamicHeight}
        style={{ display: "block", background: "transparent" }}
      >
        {/* X-axis line */}
        <line
          x1={stackMarginLeft}
          y1={xAxisY}
          x2={svgWidth - stackMarginRight}
          y2={xAxisY}
          stroke="#4B473F"
          strokeWidth={1.5}
          style={{
            opacity: isAnimating ? 0 : 1,
            transition: "opacity 0.6s ease-in 0.3s",
          }}
        />

        {/* Year labels */}
        {yearTicks.map((year) => {
          const yearRange = yearEnd - yearStart;
          const chartWidth = svgWidth - stackMarginLeft - stackMarginRight;
          const x =
            stackMarginLeft + ((year - yearStart) / yearRange) * chartWidth;
          return (
            <text
              key={year}
              x={x}
              y={xAxisY + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6B6B6B"
              style={{
                opacity: isAnimating ? 0 : 1,
                transition: "opacity 0.6s ease-in 0.4s",
              }}
            >
              {year}
            </text>
          );
        })}

        {/* Title */}
        <text
          x={svgWidth / 2}
          y={40}
          textAnchor="middle"
          fontSize="18"
          fontWeight="500"
          fill="#ffffff"
          style={{
            opacity: isAnimating ? 0 : 1,
            transition: "opacity 0.6s ease-in 0.4s",
          }}
        >
          {categoryDetailTitles[category]}
        </text>

        {/* Dots */}
        {stackedDots.dots.map((dot) => {
          const isHovered = hoveredDot === dot.key;
          const isSelected = selectedDot === dot.key;
          const radius = detailDotRadius * (isHovered || isSelected ? 1.4 : 1);

          const displayX = isAnimating ? dot.initialX : dot.x;
          const displayY = isAnimating ? dot.initialY : dot.y;

          return (
            <circle
              key={dot.key}
              cx={displayX}
              cy={displayY}
              r={radius}
              fill={color}
              stroke={isHovered || isSelected ? "#ffffff" : "#4B473F"}
              strokeWidth={isHovered || isSelected ? 1.2 : 0.8}
              style={{
                cursor: "pointer",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                filter: isHovered ? `drop-shadow(0 0 4px ${color})` : "none",
              }}
              onMouseEnter={() => {
                setHoveredDot(dot.key);
                setTooltip({ event: dot.event, x: dot.x, y: dot.y });
              }}
              onMouseLeave={() => {
                setHoveredDot(null);
                setTooltip(null);
              }}
              onClick={() => {
                setSelectedDot(selectedDot === dot.key ? null : dot.key);
              }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: Math.min(tooltip.x + 10, svgWidth - 260),
            top: Math.max(tooltip.y - 60, 10),
            background: "rgba(0, 0, 0, 0.92)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            padding: "12px 14px",
            borderRadius: "6px",
            fontSize: "13px",
            maxWidth: "240px",
            pointerEvents: "none",
            zIndex: 100,
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {tooltip.event.dateText}
          </div>
          <div>{tooltip.event.event}</div>
        </div>
      )}
    </div>
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
  dimmedCategories,
  setDimmedCategories,
  hoveredLegendCategory,
}: {
  svgWidth: number;
  active: Set<Category>;
  selected: ArmstrongEvent | null;
  onSelect: (event: ArmstrongEvent | null) => void;
  dotRadius: number;
  featuredDotRadiusOffset: number;
  activeDotRadiusOffset: number;
  dimmedCategories: Set<Category>;
  setDimmedCategories: (categories: Set<Category>) => void;
  laneStroke: string;
  laneStrokeWidth: number;
  hoveredLegendCategory: Category | null;
}) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [hoverTip, setHoverTip] = useState<TipInfo | null>(null);
  const [pinTip, setPinTip] = useState<TipInfo | null>(null);
  const [hoverClusterKey, setHoverClusterKey] = useState<string | null>(null);
  const [selectionFocusEnabled, setSelectionFocusEnabled] = useState(false);
  const lastHoverPos = useRef<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipDismissTimeout = useRef<number | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipDismissTimeout.current !== null) {
        window.clearTimeout(tooltipDismissTimeout.current);
      }
    };
  }, []);

  const tooltipCategoryLookup = useMemo(() => {
    const lookup = new Map<string, Category[]>();

    for (const event of timelineData.events) {
      const key = getTimelineEventKey(event);
      const existing = lookup.get(key) ?? [];
      const merged = new Set<Category>([...existing, ...event.categories]);
      lookup.set(
        key,
        allCategories.filter((category) => merged.has(category)),
      );
    }

    return lookup;
  }, []);

  // Simplified: only one dot per year/category combination
  const dots = useMemo<DotData[]>(() => {
    const grouped = new Map<string, ArmstrongEvent>();

    // Keep only the first event per year/category combination
    timelineData.events.forEach((event) => {
      event.categories.forEach((category) => {
        if (!active.has(category)) return;
        const key = `${event.year}-${category}`;
        if (!grouped.has(key)) {
          grouped.set(key, event);
        }
      });
    });

    const output: DotData[] = [];
    grouped.forEach((event, groupKey) => {
      const separatorIndex = groupKey.indexOf("-");
      const year = parseInt(groupKey.slice(0, separatorIndex), 10);
      const category = groupKey.slice(separatorIndex + 1) as Category;
      const cy = laneY[category];
      const cx = xOf(year, svgWidth);

      output.push({
        key: groupKey, // Use year-category as unique key instead of event.id-category
        event,
        cx,
        cy,
        cat: category,
        clusterKey: groupKey,
        clusterCount: 1,
      });
    });

    return output.sort((a, b) => a.cx - b.cx || a.cy - b.cy);
  }, [active, svgWidth]);

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

  // Calculate animation index - all dots from same year animate together
  const dotAnimationIndices = useMemo(() => {
    const indices = new Map<string, number>();

    // Group dots by actual year value (ensure it's a number)
    const yearGroups = new Map<number, DotData[]>();
    dots.forEach((dot) => {
      const year = Number(dot.event.year); // Explicitly convert to number
      if (!yearGroups.has(year)) {
        yearGroups.set(year, []);
      }
      yearGroups.get(year)!.push(dot);
    });

    // Sort years chronologically with explicit number comparison
    const sortedYears = Array.from(yearGroups.keys()).sort((a, b) => a - b);

    // Debug: log the animation order
    console.log("[Career Timeline] Animation year order:", sortedYears);
    const year1942Dots = dots.filter((d) => d.event.year === 1942);
    console.log(
      "[Career Timeline] 1942 dots found:",
      year1942Dots.length,
      year1942Dots,
    );

    // Assign the same animation index to all dots from the same year
    sortedYears.forEach((year, index) => {
      const dotsInYear = yearGroups.get(year)!;
      dotsInYear.forEach((dot) => {
        indices.set(dot.key, index);
      });
      if (year === 1942) {
        console.log(
          "[Career Timeline] 1942 assigned animation index:",
          index,
          "out of",
          sortedYears.length,
        );
      }
    });

    return indices;
  }, [dots]);

  // Track initial load animation for all dots
  const [hasAnimated, setHasAnimated] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger animation when section becomes visible - only run once
    const element = svgRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Calculate total animation time and mark complete after
            const maxDelay = dotAnimationIndices.size * 0.04; // 40ms per year position for slower wave
            const totalDuration = maxDelay + 0.3; // 0.2s animation + 0.1s buffer
            setTimeout(() => {
              setAnimationComplete(true);
            }, totalDuration * 1000);

            // Disconnect observer immediately after triggering animation
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array - only run once on mount

  const selectedMatchKeys = useMemo(() => {
    const keys = new Set<string>();
    const targetEvent = pinTip?.event ?? selected;

    if (!targetEvent) {
      return keys;
    }

    const matchedCategories = new Set<Category>();

    if (pinTip) {
      // When a dot is pinned, ONLY include that specific dot's key
      // Don't include dots from other categories even if they're the same event
      keys.add(pinTip.key);
      matchedCategories.add(pinTip.cat);
      return keys;
    }

    for (const dot of dots) {
      if (matchedCategories.has(dot.cat)) {
        continue;
      }

      if (!isSameTimelineEvent(targetEvent, dot.event)) {
        continue;
      }

      keys.add(dot.key);
      matchedCategories.add(dot.cat);
    }

    return keys;
  }, [dots, pinTip, selected]);

  const displayTip = hoverTip ?? pinTip;
  const displayTipCategories = useMemo(() => {
    if (!displayTip) {
      return [];
    }

    return (
      tooltipCategoryLookup.get(getTimelineEventKey(displayTip.event)) ??
      displayTip.event.categories
    );
  }, [displayTip, tooltipCategoryLookup]);
  const displayDot = useMemo(() => {
    if (!displayTip) return null;
    return dots.find((dot) => dot.key === displayTip.key) ?? null;
  }, [displayTip, dots]);
  const focusLineX = useMemo(() => {
    if (hoverTip) {
      return dots.find((dot) => dot.key === hoverTip.key)?.cx ?? null;
    }
    if (pinTip) {
      return dots.find((dot) => dot.key === pinTip.key)?.cx ?? null;
    }
    if (hoverClusterKey) {
      return dots.find((dot) => dot.clusterKey === hoverClusterKey)?.cx ?? null;
    }
    return null;
  }, [dots, hoverClusterKey, hoverTip, pinTip]);

  const tooltipPosition = useMemo(() => {
    if (!displayTip || !displayDot) return null;

    const rightLeft = displayDot.cx + tooltipGap;
    const leftLeft = displayDot.cx - tooltipGap - tooltipWidth;
    const hasRoomOnRight =
      rightLeft + tooltipWidth <= svgWidth - tooltipEdgePadding;
    const hasRoomOnLeft = leftLeft >= tooltipEdgePadding;

    let left: number;
    let isOnLeft = false;

    if (hasRoomOnRight) {
      left = rightLeft;
      isOnLeft = false;
    } else if (hasRoomOnLeft) {
      left = leftLeft;
      isOnLeft = true;
    } else {
      left = Math.min(
        Math.max(displayDot.cx - tooltipWidth / 2, tooltipEdgePadding),
        svgWidth - tooltipWidth - tooltipEdgePadding,
      );
      isOnLeft = false;
    }

    const top = Math.min(
      Math.max(displayDot.cy - tooltipEstimatedHeight / 2, tooltipEdgePadding),
      svgHeight - tooltipEstimatedHeight - tooltipEdgePadding,
    );

    return { left, top, isOnLeft };
  }, [displayDot, displayTip, svgWidth]);

  const onEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>, dot: DotData) => {
      // Cancel any pending dismissal
      if (tooltipDismissTimeout.current !== null) {
        window.clearTimeout(tooltipDismissTimeout.current);
        tooltipDismissTimeout.current = null;
      }

      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        lastHoverPos.current = { x, y };
        setHoverTip({ event: dot.event, x, y, key: dot.key, cat: dot.cat });
      }
      if (!selected) {
        setSelectionFocusEnabled(false);
      }
      setHoverKey(dot.key);
      setHoverClusterKey(dot.clusterKey);
      setPinTip((prev) => (prev?.key === dot.key ? prev : null));

      // Highlight only this category by dimming all others
      const hoveredCategory = dot.cat;
      const otherCategories = allCategories.filter(
        (cat) => cat !== hoveredCategory,
      );
      setDimmedCategories(new Set(otherCategories));
    },
    [selected],
  );

  const onLeave = useCallback(() => {
    // Use a short delay before clearing to allow mouse to move to tooltip
    if (tooltipDismissTimeout.current !== null) {
      window.clearTimeout(tooltipDismissTimeout.current);
    }

    tooltipDismissTimeout.current = window.setTimeout(() => {
      setHoverClusterKey(null);
      setHoverTip(null);
      setHoverKey(null);
      setDimmedCategories(new Set());
      tooltipDismissTimeout.current = null;
    }, 150);
  }, []);

  const toggleDotSelection = useCallback(
    (dot: DotData) => {
      const isSameSelection = pinTip?.key === dot.key;
      const position = lastHoverPos.current ?? {
        x: dot.cx + 14,
        y: dot.cy - 30,
      };
      setSelectionFocusEnabled(!isSameSelection);
      setHoverTip(null);
      setHoverKey(null);
      setHoverClusterKey(null);
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
      onSelect(isSameSelection ? null : dot.event);
    },
    [onSelect, selected],
  );

  const dismissTooltip = useCallback(() => {
    setHoverTip(null);
    setHoverKey(null);
    setPinTip(null);
    setSelectionFocusEnabled(false);
    onSelect(null);
  }, [onSelect]);

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
              opacity={dimmedCategories.has(category) ? 0.3 : 1}
            />
          ) : null,
        )}

        {featuredDots.map((dot) => {
          if (!active.has(dot.cat)) return null;
          const featured = featuredLabels[dot.event.id];
          const anchorY = dot.cy;
          const offset = dotRadius + 1;
          const y1 =
            featured.dir === "above" ? anchorY - offset : anchorY + offset;
          const connectorLength =
            featured.connectorLength ?? featuredLabelConnectorLength;
          const y2 =
            featured.dir === "above"
              ? y1 - connectorLength
              : y1 + connectorLength;
          const isDimmed = dimmedCategories.has(dot.cat);
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
              opacity={isDimmed ? 0.3 : 1}
            />
          );
        })}

        {featuredDots.map((dot) => {
          if (!active.has(dot.cat)) return null;
          const featured = featuredLabels[dot.event.id];
          const anchorY = dot.cy;
          const offset = dotRadius + 1;
          const connectorLength =
            featured.connectorLength ?? featuredLabelConnectorLength;
          const y2 =
            featured.dir === "above"
              ? anchorY - offset - connectorLength
              : anchorY + offset + connectorLength;
          const lines = featured.lines.length;
          const lineHeight = featured.lineHeight ?? featuredLabelLineHeight;
          const firstBaseline =
            featured.dir === "above"
              ? y2 - featuredLabelAboveOffset - (lines - 1) * lineHeight
              : y2 + lineHeight;
          const isDimmed = dimmedCategories.has(dot.cat);
          return (
            <g key={`lbl-${dot.event.id}`} opacity={isDimmed ? 0.3 : 1}>
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
        {dots.map((dot) => {
          const isGreyedForDimmed = dimmedCategories.has(dot.cat);
          const canInteract = !isGreyedForDimmed;
          const isHovered = canInteract && hoverKey === dot.key;
          const featured =
            featuredLabels[dot.event.id] &&
            featuredLabels[dot.event.id].cat === dot.cat;
          const color = categoryColors[dot.cat];
          const isLegendHovered =
            canInteract &&
            hoveredLegendCategory !== null &&
            dot.cat === hoveredLegendCategory;

          const hoverFocusActive = hoverKey !== null;
          const isGreyedForHover =
            !isLegendHovered && hoverFocusActive && !isHovered;
          const isDimmed = isGreyedForHover || isGreyedForDimmed;

          const radius = isLegendHovered
            ? dotRadius
            : isHovered
              ? dotRadius + activeDotRadiusOffset
              : featured
                ? dotRadius + featuredDotRadiusOffset
                : dotRadius;
          const diameter = radius * 2;
          const defaultBorderWidth = 0.8;
          const activeBorderWidth = 1.1;

          // Calculate animation properties for initial load
          const animationIndex = dotAnimationIndices.get(dot.key) ?? 0;
          const animationDelay = animationIndex * 0.04; // 40ms between each year position for slower wave
          const shouldAnimate = hasAnimated && !animationComplete;

          return (
            <button
              key={dot.key}
              type="button"
              className="career-timeline-event-dot"
              aria-label={dot.event.event}
              style={{
                position: "absolute",
                left: dot.cx - radius,
                top: dot.cy - radius,
                width: diameter,
                height: diameter,
                borderColor: isDimmed ? "#8f8a7d" : "#4B473F",
                borderWidth: isLegendHovered
                  ? defaultBorderWidth
                  : isHovered
                    ? activeBorderWidth
                    : defaultBorderWidth,
                backgroundColor: isDimmed ? "#bcb5a7" : color,
                boxShadow: isLegendHovered
                  ? `0 0 3px 1px ${color}35, 0 0 1px 0px ${color}50`
                  : isHovered
                    ? `0 0 4px 1px ${color}40, 0 0 2px 0px ${color}60`
                    : "none",
                transform: isHovered
                  ? "scale(1.35)"
                  : isLegendHovered
                    ? "scale(1.3)"
                    : shouldAnimate
                      ? "translateY(-15px) scale(1)"
                      : "scale(1)",
                opacity: isDimmed ? 0.32 : 1,
                pointerEvents: "auto",
                transition: "all 0.2s ease-out",
                ...(shouldAnimate && {
                  animation: `career-timeline-dot-pop-in 0.2s ease-out ${animationDelay}s both`,
                }),
              }}
              onMouseEnter={(event) => onEnter(event, dot)}
              onMouseLeave={onLeave}
              onClick={() => toggleDotSelection(dot)}
            />
          );
        })}
      </div>

      {displayTip && (
        <div
          className="career-timeline-tooltip-wrap"
          style={{
            left: tooltipPosition?.left ?? tooltipEdgePadding,
            top: tooltipPosition?.top ?? tooltipEdgePadding,
            pointerEvents: "auto",
            display: "flex",
            justifyContent: tooltipPosition?.isOnLeft
              ? "flex-end"
              : "flex-start",
            alignItems: "flex-start",
          }}
          onMouseEnter={() => {
            // Cancel any pending dismissal
            if (tooltipDismissTimeout.current !== null) {
              window.clearTimeout(tooltipDismissTimeout.current);
              tooltipDismissTimeout.current = null;
            }

            // Keep the tooltip visible and category highlighted when hovering over tooltip
            if (displayTip) {
              const hoveredCategory = displayTip.cat;
              const otherCategories = allCategories.filter(
                (cat) => cat !== hoveredCategory,
              );
              setDimmedCategories(new Set(otherCategories));
            }
          }}
          onMouseLeave={() => {
            // Dismiss tooltip and clear highlighting when leaving tooltip
            if (tooltipDismissTimeout.current !== null) {
              window.clearTimeout(tooltipDismissTimeout.current);
            }

            setHoverTip(null);
            setHoverKey(null);
            setHoverClusterKey(null);
            setDimmedCategories(new Set());
            tooltipDismissTimeout.current = null;
          }}
        >
          <div
            className={`career-timeline-tooltip career-timeline-tooltip--${displayTip.cat}`}
          >
            <button
              type="button"
              className="career-timeline-tooltip-close"
              onClick={dismissTooltip}
              aria-label="Close tooltip"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="career-timeline-tooltip-date">
              {displayTip.event.dateText}
            </div>
            <div className="career-timeline-tooltip-text">
              {displayTip.event.event}
            </div>
            <div className="career-timeline-tooltip-tags">
              {displayTipCategories.map((category, index) => (
                <React.Fragment key={category}>
                  {index > 0 && (
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.5)",
                        margin: "0 4px",
                        fontSize: "8px",
                      }}
                    >
                      {" "}
                      |{" "}
                    </span>
                  )}
                  <span
                    className={`career-timeline-tooltip-tag career-timeline-tooltip-tag--${category}`}
                  >
                    {timelineData.categoryLabels[category]}
                  </span>
                </React.Fragment>
              ))}
            </div>
            {displayTip.event.url && (
              <a
                href={displayTip.event.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="career-timeline-tooltip-link"
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
          </div>
        </div>
      )}
    </div>
  );
}

export const SectionCareerTimeline: React.FC<SectionCareerTimelineProps> = ({
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
  const [dimmedCategories, setDimmedCategories] = useState<Set<Category>>(
    new Set(),
  );
  const [hoveredLegendCategory, setHoveredLegendCategory] =
    useState<Category | null>(null);
  const [detailViewCategory, setDetailViewCategory] = useState<Category | null>(
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
        getComputedStyle(element).getPropertyValue(
          "--career-lane-stroke-width",
        ),
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
    const headObserver = new MutationObserver(updateMetrics);
    if (document.head) {
      headObserver.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    return () => {
      observer.disconnect();
      headObserver.disconnect();
    };
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
    // If we're in detail view for this category, exit detail view
    if (detailViewCategory === category) {
      setDetailViewCategory(null);
      return;
    }

    // If category is not dimmed (active), enter detail view
    if (!dimmedCategories.has(category)) {
      setDetailViewCategory(category);
      return;
    }

    // Otherwise, toggle dim state (only when not in detail view)
    if (!detailViewCategory) {
      setDimmedCategories((prev) => {
        const next = new Set(prev);
        if (next.has(category)) {
          next.delete(category);
        } else {
          next.add(category);
        }
        return next;
      });
    }
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

  const tooltipCategoryLookup = useMemo(() => {
    const lookup = new Map<string, Category[]>();

    for (const event of timelineData.events) {
      const key = getTimelineEventKey(event);
      const existing = lookup.get(key) ?? [];
      const merged = new Set<Category>([...existing, ...event.categories]);
      lookup.set(
        key,
        allCategories.filter((category) => merged.has(category)),
      );
    }

    return lookup;
  }, []);

  const selectedEventCategories = useMemo(() => {
    if (!selectedEvent) return null;
    const key = getTimelineEventKey(selectedEvent);
    return tooltipCategoryLookup.get(key) ?? selectedEvent.categories;
  }, [selectedEvent, tooltipCategoryLookup]);

  return (
    <section
      className={`mcg-section career-timeline-section ${className || ""}`}
      style={{
        width: isMobile ? "100%" : "100vw",
        minWidth: isMobile ? 0 : "100vw",
        height: isMobile ? "auto" : detailViewCategory ? "auto" : "100dvh",
        minHeight: undefined, // Remove minHeight constraint to allow full expansion
        flexShrink: isMobile ? undefined : 0,
        scrollSnapAlign: isMobile ? undefined : "start",
        position: "relative",
        overflow: detailViewCategory ? "visible" : "hidden",
        backgroundColor: "var(--career-surface-bg)",
        ...style,
      }}
    >
      <div
        className="career-timeline-layout"
        style={{
          overflow: detailViewCategory ? "visible" : undefined,
          height: detailViewCategory ? "auto" : undefined,
        }}
      >
        <div
          className="career-timeline-surface"
          style={{
            overflow: detailViewCategory ? "visible" : undefined,
            height: detailViewCategory ? "auto" : undefined,
            minHeight: detailViewCategory ? "100%" : undefined,
            paddingBottom: detailViewCategory ? "100px" : undefined,
          }}
        >
          <div className="career-timeline-header">
            <h2 className="career-timeline-title mcg-page-title mcg-page-title--flow">
              Career Highlights
            </h2>
            <p className="career-timeline-description">
              An interactive timeline showcasing key moments and achievements in
              Armstrong's career.
            </p>
          </div>

          <div
            className="career-timeline-chart-card"
            style={{
              overflow: detailViewCategory ? "visible" : undefined,
              height: detailViewCategory ? "auto" : undefined,
              paddingBottom: detailViewCategory ? "100px" : undefined,
            }}
          >
            <div
              className="career-timeline-chart-surface"
              style={{
                overflow: detailViewCategory ? "visible" : undefined,
                paddingBottom: detailViewCategory ? "100px" : undefined,
              }}
            >
              {!detailViewCategory && (
                <div
                  className="career-timeline-legend-panel"
                  style={{
                    transition: "all 0.3s ease-out",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#6b7280",
                      marginRight: "12px",
                    }}
                  >
                    Filter by
                  </span>
                  {allCategories.map((category) => {
                    const isInSelectedEvent =
                      selectedEventCategories === null ||
                      selectedEventCategories.includes(category);
                    const isDimmedByCategory = dimmedCategories.has(category);
                    const shouldDim = isDimmedByCategory || !isInSelectedEvent;
                    return (
                      <CategoryPill
                        key={category}
                        active={
                          activeCategories.has(category) && !isDimmedByCategory
                        }
                        count={categoryCounts[category]}
                        onToggle={() => toggleCategory(category)}
                        label={timelineData.categoryLabels[category]}
                        color={categoryColors[category]}
                        dimmed={shouldDim}
                        onHover={() => setHoveredLegendCategory(category)}
                        onHoverEnd={() => setHoveredLegendCategory(null)}
                      />
                    );
                  })}
                </div>
              )}
              <div ref={containerRef} className="career-timeline-scroll-area">
                <div
                  className="career-timeline-scroll-inner"
                  style={{ position: "relative" }}
                >
                  <div
                    style={{
                      opacity: detailViewCategory ? 0 : 1,
                      transition: "opacity 0.5s ease-out",
                      pointerEvents: detailViewCategory ? "none" : "auto",
                    }}
                  >
                    <TimelineSVG
                      svgWidth={svgWidth}
                      active={activeCategories}
                      selected={selectedEvent}
                      onSelect={setSelectedEvent}
                      dotRadius={dotRadius}
                      featuredDotRadiusOffset={featuredDotRadiusOffset}
                      activeDotRadiusOffset={activeDotRadiusOffset}
                      laneStroke={laneStroke}
                      laneStrokeWidth={laneStrokeWidth}
                      dimmedCategories={dimmedCategories}
                      setDimmedCategories={setDimmedCategories}
                      hoveredLegendCategory={hoveredLegendCategory}
                    />
                  </div>
                  {detailViewCategory && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        opacity: 1,
                        transition: "opacity 0.5s ease-in",
                      }}
                    >
                      <StackedDotChart
                        category={detailViewCategory}
                        svgWidth={svgWidth}
                        dotRadius={dotRadius}
                        onBack={() => setDetailViewCategory(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
