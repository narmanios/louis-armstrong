import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import rawCareerTimeline from '../../../data/carrer-timeline.json' with { type: 'json' };
import './SectionCareerTimeline.css';

type Category = 'musician' | 'vocalist' | 'bandleader' | 'ambassador' | 'film';

type ArmstrongEvent = {
  id: number;
  year: number;
  dateText: string;
  event: string;
  categories: Category[];
  url?: string;
};

type CareerTimelineData = {
  categoryLabels: Record<Category, string>;
  categoryColors: Record<Category, string>;
  events: ArmstrongEvent[];
};

const timelineData = rawCareerTimeline as CareerTimelineData;

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
};

type TipInfo = { event: ArmstrongEvent; x: number; y: number; key: string; cat: Category };

type FeaturedCfg = {
  lines: string[];
  cat: Category;
  dir: 'above' | 'below';
  connectorLength?: number;
  lineHeight?: number;
  dashArray?: string;
};

const allCategories: Category[] = ['musician', 'vocalist', 'bandleader', 'ambassador', 'film'];
const categoryOrder: Category[] = ['film', 'bandleader', 'musician', 'vocalist', 'ambassador'];

const laneY: Record<Category, number> = {
  film: 80,
  bandleader: 185,
  musician: 290,
  vocalist: 395,
  ambassador: 500,
};
const svgHeight = 560;
const yearStart = 1923;
const yearEnd = 1970;
const marginLeft = 72;
const marginRight = 20;
const dotRadius = 5;
const decadeDash = '4 4';
const laneDash = '8 2 2 2';
const connectorDash = '2 2';
const featuredLabelLineHeight = 11;
const featuredLabelConnectorLength = 28;
const featuredLabelAboveOffset = 4;
const featuredLabelBelowOffset = 3;
const yearAxisY = 530;

const featuredLabels: Record<number, FeaturedCfg> = {
  35: { lines: ['A Rhapsody in', 'Black & Blue (1932)'], cat: 'film', dir: 'above' },
  42: { lines: ['Pennies from', 'Heaven (1936)'], cat: 'film', dir: 'below' },
  48: { lines: ['Going Places', '(1938)'], cat: 'film', dir: 'above' },
  72: { lines: ['High Society', '(1956)'], cat: 'film', dir: 'below' },
  82: { lines: ['The Five Pennies', '(1958)'], cat: 'film', dir: 'above' },
  93: { lines: ['Hello, Dolly!', 'Film (1968)'], cat: 'film', dir: 'above' },
  9: { lines: ['Hot Five (1925)'], cat: 'bandleader', dir: 'above' },
  10: {
    lines: ['Heebie Jeebies', '(1926)'],
    cat: 'bandleader',
    dir: 'above',
    connectorLength: 40,
    lineHeight: 14,
    dashArray: '6 3',
  },
  56: { lines: ['Carnegie Hall', '(1947)'], cat: 'bandleader', dir: 'above' },
  74: { lines: ['Ella and Louis', '(1956)'], cat: 'bandleader', dir: 'below' },
  91: { lines: ['What a', 'Wonderful World', '(1967)'], cat: 'bandleader', dir: 'above' },
  1: { lines: ['Chimes Blues', '(1923)'], cat: 'musician', dir: 'below' },
  18: { lines: ['West End Blues', '(1928)'], cat: 'musician', dir: 'above' },
  22: { lines: ["Ain't Misbehavin'", '(1929)'], cat: 'musician', dir: 'below' },
  71: { lines: ['Mack the Knife', '(1955)'], cat: 'musician', dir: 'below' },
  88: { lines: ['Hello, Dolly!', '(1963)'], cat: 'musician', dir: 'below' },
  7: { lines: ['St. Louis Blues', 'w/ Bessie Smith', '(1925)'], cat: 'vocalist', dir: 'below' },
  25: { lines: ["Rockin' Chair", '(1929)'], cat: 'vocalist', dir: 'below' },
  62: { lines: ['La Vie En Rose', '(1950)'], cat: 'vocalist', dir: 'above' },
  65: { lines: ['A Kiss to Build', 'a Dream On (1951)'], cat: 'vocalist', dir: 'below' },
  87: { lines: ['The Real', 'Ambassadors', '(1961)'], cat: 'ambassador', dir: 'above' },
};

function xOf(year: number, width: number) {
  return (
    marginLeft + ((year - yearStart) / (yearEnd - yearStart)) * (width - marginLeft - marginRight)
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
    '--career-pill-bg': active ? `${color}12` : 'transparent',
    '--career-pill-dot': active ? color : '#D1D5DB',
    '--career-pill-label': active ? '#111827' : '#9CA3AF',
    '--career-pill-count': active ? color : '#D1D5DB',
  } as React.CSSProperties;

  return (
    <button onClick={onToggle} style={pillVars} className="mcg-career-pill">
      <span className="mcg-career-pill-dot" />
      <span className="mcg-career-pill-label">{label}</span>
      <span className="mcg-career-pill-count">{count}</span>
    </button>
  );
}

function EventDetailCard({ event, onClose }: { event: ArmstrongEvent; onClose: () => void }) {
  const primaryCategory = event.categories[0];
  const primaryColor = timelineData.categoryColors[primaryCategory];
  const cardVars = {
    '--career-primary-color': primaryColor,
  } as React.CSSProperties;

  return (
    <div className="mcg-career-event-card" style={cardVars}>
      <div className="mcg-career-event-card-top">
        <div className="mcg-career-event-date">{event.dateText}</div>
        <button onClick={onClose} className="mcg-career-event-close">
          ✕
        </button>
      </div>
      <p className="mcg-career-event-text">{event.event}</p>
      <div className="mcg-career-event-tags">
        {event.categories.map(category => (
          <span
            key={category}
            style={{
              backgroundColor: `${timelineData.categoryColors[category]}18`,
              color: timelineData.categoryColors[category],
              border: `1px solid ${timelineData.categoryColors[category]}44`,
            }}
            className="mcg-career-event-tag"
          >
            {timelineData.categoryLabels[category]}
          </span>
        ))}
      </div>
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mcg-career-event-link"
        >
          ▶ Watch / Listen
        </a>
      )}
    </div>
  );
}

function TimelineSVG({
  svgWidth,
  active,
  selected,
  onSelect,
}: {
  svgWidth: number;
  active: Set<Category>;
  selected: ArmstrongEvent | null;
  onSelect: (event: ArmstrongEvent | null) => void;
}) {
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [hoverTip, setHoverTip] = useState<TipInfo | null>(null);
  const [pinTip, setPinTip] = useState<TipInfo | null>(null);
  const lastHoverPos = useRef<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const dots = useMemo<DotData[]>(() => {
    const grouped = new Map<string, ArmstrongEvent[]>();
    timelineData.events.forEach(event => {
      event.categories.forEach(category => {
        if (!active.has(category)) return;
        const key = `${event.year}-${category}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(event);
      });
    });

    const output: DotData[] = [];
    grouped.forEach((eventsAtPoint, groupKey) => {
      const separatorIndex = groupKey.indexOf('-');
      const year = parseInt(groupKey.slice(0, separatorIndex), 10);
      const category = groupKey.slice(separatorIndex + 1) as Category;
      const baseY = laneY[category];
      const cx = xOf(year, svgWidth);
      const count = eventsAtPoint.length;
      const step = count === 1 ? 0 : Math.min(8, 32 / (count - 1));
      eventsAtPoint.forEach((event, index) => {
        const yOffset = count === 1 ? 0 : (index - (count - 1) / 2) * step;
        output.push({
          key: `${event.id}-${category}`,
          event,
          cx,
          cy: baseY + yOffset,
          cat: category,
        });
      });
    });
    return output;
  }, [active, svgWidth]);

  const featuredDots = useMemo(() => {
    const seen = new Set<number>();
    return dots.filter(dot => {
      const featured = featuredLabels[dot.event.id];
      if (!featured || featured.cat !== dot.cat) return false;
      if (seen.has(dot.event.id)) return false;
      seen.add(dot.event.id);
      return true;
    });
  }, [dots]);

  const displayTip = hoverTip ?? pinTip;
  const isPinned = !hoverTip && !!pinTip;

  const onEnter = useCallback((event: React.MouseEvent<SVGCircleElement>, dot: DotData) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      lastHoverPos.current = { x, y };
      setHoverTip({ event: dot.event, x, y, key: dot.key, cat: dot.cat });
    }
    setHoverKey(dot.key);
    setPinTip(prev => (prev?.key === dot.key ? prev : null));
  }, []);

  const onLeave = useCallback(() => {
    setHoverTip(null);
    setHoverKey(null);
  }, []);

  const yearTicks: number[] = [];
  for (let year = 1923; year <= 1970; year += 5) yearTicks.push(year);

  return (
    <div className="mcg-career-svg-wrap">
      <svg ref={svgRef} width={svgWidth} height={svgHeight} className="mcg-career-svg">
        {yearTicks.map(year => (
          <line
            key={`grid-${year}`}
            className={
              year % 10 === 0 ? 'mcg-career-year-grid-line-decade' : 'mcg-career-year-grid-line'
            }
            x1={xOf(year, svgWidth)}
            x2={xOf(year, svgWidth)}
            y1={35}
            y2={yearAxisY - 6}
            strokeDasharray={year % 10 === 0 ? decadeDash : undefined}
          />
        ))}

        {categoryOrder.map(category =>
          active.has(category) ? (
            <line
              key={category}
              x1={marginLeft}
              x2={svgWidth - marginRight}
              y1={laneY[category]}
              y2={laneY[category]}
              stroke={timelineData.categoryColors[category]}
              strokeWidth={2}
              strokeDasharray={laneDash}
            />
          ) : null
        )}

        {featuredDots.map(dot => {
          if (!active.has(dot.cat)) return null;
          const featured = featuredLabels[dot.event.id];
          const color = timelineData.categoryColors[dot.cat];
          const offset = dotRadius + 1;
          const y1 = featured.dir === 'above' ? dot.cy - offset : dot.cy + offset;
          const connectorLength = featured.connectorLength ?? featuredLabelConnectorLength;
          const y2 = featured.dir === 'above' ? y1 - connectorLength : y1 + connectorLength;
          return (
            <line
              key={`conn-${dot.event.id}`}
              x1={dot.cx}
              y1={y1}
              x2={dot.cx}
              y2={y2}
              stroke={color}
              strokeWidth={1}
              strokeDasharray={featured.dashArray ?? connectorDash}
            />
          );
        })}

        {featuredDots.map(dot => {
          if (!active.has(dot.cat)) return null;
          const featured = featuredLabels[dot.event.id];
          const offset = dotRadius + 1;
          const connectorLength = featured.connectorLength ?? featuredLabelConnectorLength;
          const y2 =
            featured.dir === 'above'
              ? dot.cy - offset - connectorLength
              : dot.cy + offset + connectorLength;
          const lines = featured.lines.length;
          const lineHeight = featured.lineHeight ?? featuredLabelLineHeight;
          const firstBaseline =
            featured.dir === 'above'
              ? y2 - featuredLabelAboveOffset - (lines - 1) * lineHeight
              : y2 + lineHeight;
          return (
            <g key={`lbl-${dot.event.id}`}>
              <text
                className="mcg-career-featured-text"
                x={dot.cx}
                y={firstBaseline}
                textAnchor="middle"
              >
                {featured.lines.map((line, index) => (
                  <tspan key={index} x={dot.cx} dy={index === 0 ? 0 : lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        {dots.map(dot => {
          const isSelected = selected?.id === dot.event.id;
          const isPinned = pinTip?.key === dot.key;
          const isHovered = hoverKey === dot.key;
          const featured =
            featuredLabels[dot.event.id] && featuredLabels[dot.event.id].cat === dot.cat;
          const color = timelineData.categoryColors[dot.cat];
          const radius =
            isHovered || isSelected || isPinned
              ? dotRadius + 2.5
              : featured
                ? dotRadius + 0.5
                : dotRadius;
          const filled = isSelected || isPinned;

          return (
            <circle
              key={dot.key}
              cx={dot.cx}
              cy={dot.cy}
              r={radius}
              fill={filled ? color : 'white'}
              stroke={color}
              strokeWidth={filled ? 3 : featured ? 2.5 : 1.8}
              className="mcg-career-dot"
              onMouseEnter={event => onEnter(event, dot)}
              onMouseLeave={onLeave}
              onClick={() => {
                const position = lastHoverPos.current ?? { x: dot.cx + 14, y: dot.cy - 30 };
                setPinTip(prev =>
                  prev?.key === dot.key
                    ? null
                    : { event: dot.event, x: position.x, y: position.y, key: dot.key, cat: dot.cat }
                );
                onSelect(selected?.id === dot.event.id ? null : dot.event);
              }}
            />
          );
        })}

        <line
          x1={marginLeft}
          x2={svgWidth - marginRight}
          y1={yearAxisY}
          y2={yearAxisY}
          stroke="#E5E7EB"
          strokeWidth={1}
        />
        {yearTicks.map(year => (
          <g key={year}>
            <line
              className="mcg-career-year-tick-mark"
              x1={xOf(year, svgWidth)}
              x2={xOf(year, svgWidth)}
              y1={yearAxisY}
              y2={yearAxisY + 5}
            />
            <text
              className="mcg-career-year-tick-text"
              x={xOf(year, svgWidth)}
              y={yearAxisY + 16}
              textAnchor="middle"
              style={
                {
                  '--career-year-color': year % 10 === 0 ? '#374151' : '#9CA3AF',
                  '--career-year-size': year % 10 === 0 ? '10px' : '9px',
                  '--career-year-weight': year % 10 === 0 ? 700 : 400,
                } as React.CSSProperties
              }
            >
              {year}
            </text>
          </g>
        ))}
      </svg>

      {displayTip && (
        <div
          className="mcg-career-tooltip-wrap"
          style={{
            left: Math.min(displayTip.x + 16, svgWidth - 260),
            top: Math.max(displayTip.y - 60, 4),
            pointerEvents: isPinned ? 'auto' : 'none',
          }}
        >
          <div
            className="mcg-career-tooltip"
            style={{
              border: `1.5px solid ${timelineData.categoryColors[displayTip.cat]}`,
            }}
          >
            <div
              className="mcg-career-tooltip-date"
              style={{ color: timelineData.categoryColors[displayTip.cat] }}
            >
              {displayTip.event.dateText}
            </div>
            <div className="mcg-career-tooltip-text">
              {displayTip.event.event.length > 90
                ? `${displayTip.event.event.slice(0, 90)}…`
                : displayTip.event.event}
            </div>
            <div className="mcg-career-tooltip-tags">
              {displayTip.event.categories.map(category => (
                <span
                  key={category}
                  style={{
                    backgroundColor: `${timelineData.categoryColors[category]}18`,
                    color: timelineData.categoryColors[category],
                  }}
                  className="mcg-career-tooltip-tag"
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
                onClick={event => event.stopPropagation()}
                className="mcg-career-tooltip-link"
                style={{
                  color: timelineData.categoryColors[displayTip.cat],
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
                className="mcg-career-tooltip-pin-hint"
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
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set(allCategories));
  const [selectedEvent, setSelectedEvent] = useState<ArmstrongEvent | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const updateWidth = () => setSvgWidth(element.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      selectedEvent &&
      !selectedEvent.categories.some(category => activeCategories.has(category))
    ) {
      setSelectedEvent(null);
    }
  }, [activeCategories, selectedEvent]);

  const toggleCategory = (category: Category) => {
    setActiveCategories(prev => {
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
    timelineData.events.forEach(event => {
      event.categories.forEach(category => {
        counts[category] += 1;
      });
    });
    return counts;
  }, []);

  return (
    <section
      className={`mcg-section mcg-career-section ${className || ''}`}
      style={{
        width: isMobile ? '100%' : '100vw',
        minWidth: isMobile ? 0 : '100vw',
        height: isMobile ? 'auto' : '800px',
        flexShrink: isMobile ? undefined : 0,
        scrollSnapAlign: isMobile ? undefined : 'start',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div className="mcg-career-root">
        <div className="mcg-career-topbar">
          <h1 className="mcg-career-title" style={textBaseStyle}>
            Louis Armstrong Career Timeline
          </h1>
        </div>

        <div className="mcg-career-topbar-right">
          {allCategories.map(category => (
            <CategoryPill
              key={category}
              active={activeCategories.has(category)}
              count={categoryCounts[category]}
              onToggle={() => toggleCategory(category)}
              label={timelineData.categoryLabels[category]}
              color={timelineData.categoryColors[category]}
            />
          ))}
          <button
            onClick={() => setActiveCategories(new Set(allCategories))}
            className="mcg-career-all-btn"
          >
            All
          </button>
        </div>

        <div className="mcg-career-timeline-card">
          <div ref={containerRef} className="mcg-career-scroll">
            <div className="mcg-career-scroll-inner">
              <TimelineSVG
                svgWidth={Math.max(svgWidth, 1000)}
                active={activeCategories}
                selected={selectedEvent}
                onSelect={setSelectedEvent}
              />
            </div>
          </div>
        </div>

        {selectedEvent ? (
          <div className="mcg-career-bottom-grid has-selection">
            <div className="mcg-career-detail-card">
              <EventDetailCard event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};
