import { useEffect, useMemo, useRef, useState } from "react";
import SectionGoodwillStageArtwork from "./SectionGoodwillStageArtwork";
import { X } from "lucide-react";
import countriesData from "../../../../data/goodwillCountries.json";

type Decade = "all" | "1920s" | "1930s" | "1940s" | "1950s" | "1960s" | "1970s";

interface CountryEvent {
  year: string;
  international: string;
  usContext?: string;
}

interface CountryData {
  id: string;
  name: string;
  cx: number;
  cy: number;
  r: number;
  numLeft: number;
  numTop: number;
  numFontSize: number;
  counts: {
    all: number;
  } & Partial<Record<Exclude<Decade, "all">, number>>;
  events: CountryEvent[];
}

interface BubblePosition {
  cx: number;
  cy: number;
}

interface BubbleNode {
  id: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const COUNTRIES: CountryData[] = countriesData as CountryData[];

const DECADES: Decade[] = [
  "1920s",
  "1930s",
  "1940s",
  "1950s",
  "1960s",
  "1970s",
];

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;
const BOTTOM_EMPTY_SPACE = 150;
const MOBILE_BREAKPOINT = 768;
const DESKTOP_STAGE_SCALE_BOOST = 1.14;
const DESKTOP_CHART_OFFSET_Y = -36;
const MOBILE_CHART_OFFSET_Y = -96;

const MAP_GROUP_LEFT = 110;
const MAP_GROUP_TOP = 136;

const COUNTRY_TO_FLAG_DATA_NAME: Record<string, string> = {
  usa: "us united-states",
  uk: "gb england",
  france: "fr france",
  germany: "de germany",
  canada: "ca canada",
  italy: "it italy",
  switzerland: "ch switzerland",
  japan: "jp japan",
  denmark: "dk denmark",
  australia: "au australia",
  newzealand: "nz new-zealand",
  ghana: "gh ghana",
  norway: "no norway",
  scotland: "gb-sct scotland",
  drc: "cd democratic-republic-of-the-congo",
  sweden: "se sweden",
  sudan: "sd sudan",
  belgium: "be belgium",
  finland: "fi finland",
  netherlands: "nl netherlands",
  uganda: "ug uganda",
  china: "cn china",
  cotedivoire: "ci cote-d-ivoire",
  egypt: "eg egypt",
  kenya: "ke kenya",
  chile: "cl chile",
  nigeria: "ng nigeria",
  tanzania: "tz tanzania",
  portugal: "pt portugal",
  austria: "at austria",
  ireland: "ie ireland",
  cuba: "cu cuba",
  mexico: "mx mexico",
  spain: "es spain",
};

const COUNTRY_TO_ELLIPSE_ID: Record<string, string> = {
  usa: "Ellipse 81",
  uk: "Ellipse 80",
  france: "Ellipse 82",
  germany: "Ellipse 87",
  canada: "Ellipse 86",
  italy: "Ellipse 85",
  switzerland: "Ellipse 91",
  japan: "Ellipse 88",
  denmark: "Ellipse 90",
  australia: "Ellipse 89",
  newzealand: "Ellipse 92",
  ghana: "Ellipse 93",
  norway: "Ellipse 94",
  scotland: "Ellipse 95",
  drc: "Ellipse 96",
  sweden: "Ellipse 98",
  sudan: "Ellipse 97",
  belgium: "Ellipse 99",
  finland: "Ellipse 106",
  netherlands: "Ellipse 105",
  uganda: "Ellipse 102",
  china: "Ellipse 104",
  cotedivoire: "Ellipse 100",
  egypt: "Ellipse 107",
  kenya: "Ellipse 101",
  chile: "Ellipse 103",
  nigeria: "Ellipse 108",
  tanzania: "Ellipse 109",
  portugal: "Ellipse 112",
  austria: "Ellipse 110",
  ireland: "Ellipse 111",
  cuba: "Ellipse 113",
  mexico: "Ellipse 114",
  spain: "Ellipse 115",
};

const COUNT_COUNTRY_ORDER: string[] = [
  "usa",
  "germany",
  "canada",
  "italy",
  "denmark",
  "australia",
  "japan",
  "newzealand",
  "ghana",
  "scotland",
  "drc",
  "sudan",
  "belgium",
  "sweden",
  "norway",
  "switzerland",
  "france",
  "uk",
];

const UI_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const GOODWILL_BUBBLE_FILL = "rgba(255, 255, 255, 0.38)";
const GOODWILL_BUBBLE_ACTIVE_FILL = "rgba(255, 255, 255, 0.76)";

export function SectionGoodwillAmbassador({
  textBaseStyle,
}: {
  textBaseStyle: React.CSSProperties;
}) {
  const [selectedDecade, setSelectedDecade] = useState<Decade>("all");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);

  const sectionRootRef = useRef<HTMLDivElement>(null);
  const stageOuterRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [stageScale, setStageScale] = useState(1);

  const [bubblePositions, setBubblePositions] = useState<
    Record<string, BubblePosition>
  >(() =>
    COUNTRIES.reduce<Record<string, BubblePosition>>((acc, country) => {
      acc[country.id] = { cx: country.cx, cy: country.cy };
      return acc;
    }, {}),
  );

  const countriesById = useMemo(() => {
    return COUNTRIES.reduce<Record<string, CountryData>>((acc, country) => {
      acc[country.id] = country;
      return acc;
    }, {});
  }, []);

  const getDecadeCount = (
    country: CountryData,
    decade: Exclude<Decade, "all">,
  ): number => {
    return country.counts[decade] ?? 0;
  };

  const getCount = (country: CountryData): number => {
    if (selectedDecade === "all") return country.counts.all;
    return getDecadeCount(country, selectedDecade);
  };

  const mobileBubbleOffsetX = useMemo(() => {
    const bubbleBounds = COUNTRIES.reduce(
      (acc, country) => {
        const pos = bubblePositions[country.id];
        if (!pos) return acc;
        acc.minX = Math.min(acc.minX, pos.cx - country.r);
        acc.maxX = Math.max(acc.maxX, pos.cx + country.r);
        return acc;
      },
      { minX: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY },
    );

    if (
      !Number.isFinite(bubbleBounds.minX) ||
      !Number.isFinite(bubbleBounds.maxX)
    ) {
      return 0;
    }

    const bubbleCenterX = (bubbleBounds.minX + bubbleBounds.maxX) / 2;
    return CANVAS_WIDTH / 2 - bubbleCenterX;
  }, [bubblePositions]);

  useEffect(() => {
    const updateScale = () => {
      const width = stageOuterRef.current?.clientWidth ?? window.innerWidth;
      const baseScale = Math.min(width / CANVAS_WIDTH, 1);
      const mobileView = window.innerWidth <= MOBILE_BREAKPOINT;
      const nextScale = mobileView
        ? baseScale
        : Math.min(baseScale * DESKTOP_STAGE_SCALE_BOOST, 1);

      setStageScale(nextScale);
      setIsMobile(mobileView);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    if (stageOuterRef.current) resizeObserver.observe(stageOuterRef.current);
    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    const edgePadding = 2;
    const minX = edgePadding;
    const minY = 145;
    const maxX = CANVAS_WIDTH - edgePadding;
    const maxY = CANVAS_HEIGHT - BOTTOM_EMPTY_SPACE - edgePadding;
    const gap = 4;
    const ticks = 240;
    const centerX = CANVAS_WIDTH * 0.52;
    const centerY = minY + (maxY - minY) * 0.5;

    const nodes: BubbleNode[] = COUNTRIES.map((country) => ({
      id: country.id,
      r: country.r,
      x: Math.random() * (maxX - minX - 2 * country.r) + (minX + country.r),
      y: Math.random() * (maxY - minY - 2 * country.r) + (minY + country.r),
      vx: 0,
      vy: 0,
    }));

    let rafId = 0;
    let currentTick = 0;

    const step = () => {
      currentTick += 1;

      nodes.forEach((node) => {
        node.vx += (centerX - node.x) * 0.0024;
        node.vy += (centerY - node.y) * 0.0024;
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const minDist = a.r + b.r + gap;

          if (dist < minDist) {
            const push = (minDist - dist) / 2;
            const ux = dx / dist;
            const uy = dy / dist;
            a.x -= ux * push;
            a.y -= uy * push;
            b.x += ux * push;
            b.y += uy * push;
          }
        }
      }

      nodes.forEach((node) => {
        node.vx *= 0.9;
        node.vy *= 0.9;

        node.x += node.vx;
        node.y += node.vy;

        const minNodeX = minX + node.r;
        const maxNodeX = maxX - node.r;
        const minNodeY = minY + node.r;
        const maxNodeY = maxY - node.r;

        if (node.x < minNodeX) {
          node.x = minNodeX;
          node.vx = Math.abs(node.vx) * 0.35;
        }
        if (node.x > maxNodeX) {
          node.x = maxNodeX;
          node.vx = -Math.abs(node.vx) * 0.35;
        }
        if (node.y < minNodeY) {
          node.y = minNodeY;
          node.vy = Math.abs(node.vy) * 0.35;
        }
        if (node.y > maxNodeY) {
          node.y = maxNodeY;
          node.vy = -Math.abs(node.vy) * 0.35;
        }
      });

      const next = nodes.reduce<Record<string, BubblePosition>>((acc, node) => {
        acc[node.id] = { cx: node.x, cy: node.y };
        return acc;
      }, {});

      setBubblePositions(next);

      if (currentTick < ticks) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const root = sectionRootRef.current;
    if (!root) return;

    COUNTRIES.forEach((country) => {
      const randomized = bubblePositions[country.id];
      if (!randomized) return;

      const dx = randomized.cx - country.cx;
      const dy = randomized.cy - country.cy;

      const flagDataName = COUNTRY_TO_FLAG_DATA_NAME[country.id];
      if (flagDataName) {
        const flagEl = root.querySelector<HTMLElement>(
          `[data-name="${flagDataName}"]`,
        );
        if (flagEl) {
          flagEl.style.transform = `translate(${dx}px, ${dy}px)`;
          flagEl.style.transformOrigin = "top left";
        }
      }

      const ellipseId = COUNTRY_TO_ELLIPSE_ID[country.id];
      if (ellipseId) {
        const circleEl = root.querySelector<SVGCircleElement>(
          `circle[id="${ellipseId}"]`,
        );
        if (circleEl) {
          circleEl.setAttribute("cx", `${randomized.cx - MAP_GROUP_LEFT}`);
          circleEl.setAttribute("cy", `${randomized.cy - MAP_GROUP_TOP}`);
          circleEl.setAttribute(
            "fill",
            selectedCountry?.id === country.id ||
              hoveredCountryId === country.id
              ? GOODWILL_BUBBLE_ACTIVE_FILL
              : GOODWILL_BUBBLE_FILL,
          );
          circleEl.style.transition = "fill 0.15s ease";
        }
      }
    });

    const countNodes = root.querySelectorAll<HTMLElement>(
      '[data-name="BubbleCounts"] p',
    );

    COUNT_COUNTRY_ORDER.forEach((countryId, index) => {
      const node = countNodes[index];
      const country = countriesById[countryId];
      const randomized = bubblePositions[countryId];
      if (!node || !country || !randomized) return;

      const numberDx = randomized.cx - country.cx;
      const numberDy = randomized.cy - country.cy;

      node.style.left = `${country.numLeft + numberDx}px`;
      node.style.top = `${country.numTop + numberDy}px`;
      node.textContent = `${
        selectedDecade === "all"
          ? country.counts.all
          : getDecadeCount(country, selectedDecade)
      }`;
    });
  }, [
    bubblePositions,
    countriesById,
    hoveredCountryId,
    selectedCountry,
    selectedDecade,
  ]);

  const handleBubbleClick = (country: CountryData) => {
    setSelectedCountry((prev) => (prev?.id === country.id ? null : country));
  };

  const handleDecadeClick = (decade: Decade) => {
    setSelectedDecade((prev) => (prev === decade ? "all" : decade));
  };

  const stageHeight = CANVAS_HEIGHT * stageScale;
  const stageWidth = CANVAS_WIDTH * stageScale;

  // Shift the imported artwork left to counter its built-in whitespace.
  // On mobile, add the live bubble-field centering adjustment on top.
  const chartOffsetX = isMobile ? -110 + mobileBubbleOffsetX : -110;
  const chartOffsetY = isMobile
    ? MOBILE_CHART_OFFSET_Y
    : DESKTOP_CHART_OFFSET_Y;

  return (
    <section
      className="mcg-section mcg-jazz-section"
      style={{
        backgroundColor: "#f9e4d2",
        position: "relative",
      }}
    >
      <style>{`
.mcg-jazz-section {
  --goodwill-bubble-fill: ${GOODWILL_BUBBLE_FILL};
  background: #f9e4d2 !important;
}

.goodwill-section-header {
  position: relative;
  z-index: 25;
  max-width: 1280px;
  margin: 0 auto 0;
  padding: 64px 56px 0;
  box-sizing: border-box;
  display: block;
  background: #f9e4d2;
}

        .goodwill-title {
          margin: 0;
        }

        .goodwill-filters {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-top: 12px;
        }

        .goodwill-stage-shell {
          position: relative;
          width: 100%;
          max-width: ${CANVAS_WIDTH}px;
          min-width: 0;
          margin: -1px auto 0;
          overflow: visible;
          background: #f9e4d2;
        }

        .goodwill-stage-frame {
          position: relative;
          margin: 0 auto;
          overflow: visible;
        }

        .goodwill-stage {
          position: relative;
          width: ${CANVAS_WIDTH}px;
          height: ${CANVAS_HEIGHT}px;
          transform-origin: top left;
          overflow: hidden;
          background: #f9e4d2;
        }

        .goodwill-filter-button {
          font-family: ${UI_FONT};
          font-weight: 700;
          font-size: 14px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          white-space: nowrap;
        }

        .goodwill-mobile-filter {
          display: none;
          font-family: ${UI_FONT};
          font-weight: 700;
          font-size: 14px;
          color: #000000;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid #c8c2b3;
          border-radius: 6px;
          padding: 9px 12px;
        }

        .goodwill-desktop-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: 340px;
          height: 800px;
          background: #111111;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 320;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .goodwill-desktop-panel.is-open {
          transform: translateX(0);
        }

        .goodwill-mobile-panel,
        .goodwill-mobile-backdrop {
          display: none;
        }

        .goodwill-panel-inner {
          padding: 0;
          color: white;
          min-height: 100%;
          box-sizing: border-box;
        }

        .goodwill-panel-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background: #111111;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }

        .goodwill-panel-header-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 40px 32px 16px;
        }

        .goodwill-panel-body {
          padding: 24px 32px 40px;
        }

        .goodwill-panel-close {
          background: none;
          border: 1px solid rgba(255,255,255,0.6);
          color: white;
          cursor: pointer;
          padding: 5px 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .goodwill-chip {
          font-family: ${UI_FONT};
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 2px;
        }

        @media (max-width: ${MOBILE_BREAKPOINT}px) {
          .goodwill-section-header {
            padding: 24px 12px 0;
            margin-bottom: 0;
            display: block;
          }

          .goodwill-title {
            margin-bottom: 14px;
          }

          .goodwill-filters {
            display: none;
            
          }

          .goodwill-mobile-filter {
            display: block;
            width: 100%;
            max-width: 320px;
          }

          .goodwill-desktop-panel {
            display: none;
          }

          .goodwill-mobile-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.42);
            z-index: 9998;
          }

          .goodwill-mobile-panel {
            display: block;
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100dvh;
            background: #111111;
            z-index: 9999;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .goodwill-panel-header-inner {
            padding: 24px 20px 16px;
          }

          .goodwill-panel-body {
            padding: 24px 20px 28px;
          }

          .goodwill-chip {
            font-size: 11px;
          }

          .goodwill-stage {
            overflow: visible;
          }
        }
      `}</style>

      <div className="goodwill-section-header">
        <h2 className="mcg-page-title mcg-page-title--flow goodwill-title">
          Goodwill Ambassador
        </h2>
        {!isMobile ? (
          <div className="goodwill-filters">
            <button
              onClick={() => setSelectedDecade("all")}
              className="goodwill-filter-button"
              style={{
                color: selectedDecade === "all" ? "#000000" : "#aaaaaa",
              }}
            >
              All
            </button>
            {DECADES.map((decade) => (
              <button
                key={decade}
                onClick={() => handleDecadeClick(decade)}
                className="goodwill-filter-button"
                style={{
                  color: selectedDecade === decade ? "#000000" : "#aaaaaa",
                }}
              >
                {decade}
              </button>
            ))}
          </div>
        ) : (
          <select
            aria-label="Filter events by decade"
            className="goodwill-mobile-filter"
            value={selectedDecade}
            onChange={(event) =>
              setSelectedDecade(event.target.value as Decade)
            }
          >
            <option value="all">All</option>
            {DECADES.map((decade) => (
              <option key={decade} value={decade}>
                {decade}
              </option>
            ))}
          </select>
        )}
      </div>

      <div
        ref={stageOuterRef}
        className="goodwill-stage-shell"
        style={{ height: stageHeight }}
      >
        <div
          className="goodwill-stage-frame"
          style={{ width: stageWidth, height: stageHeight }}
        >
          <div
            className="goodwill-stage"
            style={{ transform: `scale(${stageScale})` }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translate(${chartOffsetX}px, ${chartOffsetY}px)`,
              }}
            >
              <div
                ref={sectionRootRef}
                style={{ position: "absolute", inset: 0 }}
              >
                <SectionGoodwillStageArtwork hideTitle hideFilters />
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
                {COUNTRIES.map((country) => {
                  const pos = bubblePositions[country.id];
                  const tapSize = isMobile
                    ? Math.max(country.r * 3, 52)
                    : country.r * 2;
                  const offset = (tapSize - country.r * 2) / 2;

                  return (
                    <button
                      key={country.id}
                      onClick={() => handleBubbleClick(country)}
                      title={country.name}
                      style={{
                        position: "absolute",
                        left: pos.cx - country.r - offset,
                        top: pos.cy - country.r - offset,
                        width: tapSize,
                        height: tapSize,
                        borderRadius: "50%",
                        background:
                          selectedCountry?.id === country.id
                            ? "rgba(255,255,255,0.12)"
                            : "transparent",
                        border:
                          selectedCountry?.id === country.id
                            ? "2px solid rgba(255,255,255,0.26)"
                            : "none",
                        cursor: "pointer",
                        pointerEvents: "auto",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        setHoveredCountryId(country.id);
                        if (!isMobile && selectedCountry?.id !== country.id) {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.08)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        setHoveredCountryId((prev) =>
                          prev === country.id ? null : prev,
                        );
                        if (!isMobile && selectedCountry?.id !== country.id) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <div
          className={`goodwill-desktop-panel${
            selectedCountry ? " is-open" : ""
          }`}
        >
          {selectedCountry && (
            <CountryPanelContent
              country={selectedCountry}
              selectedDecade={selectedDecade}
              decades={DECADES}
              getCount={getCount}
              onClose={() => setSelectedCountry(null)}
              textBaseStyle={textBaseStyle}
              isMobile={false}
            />
          )}
        </div>
      )}

      {isMobile && selectedCountry && (
        <>
          <button
            className="goodwill-mobile-backdrop"
            aria-label="Close country detail panel"
            onClick={() => setSelectedCountry(null)}
          />
          <div className="goodwill-mobile-panel">
            <CountryPanelContent
              country={selectedCountry}
              selectedDecade={selectedDecade}
              decades={DECADES}
              getCount={getCount}
              onClose={() => setSelectedCountry(null)}
              textBaseStyle={textBaseStyle}
              isMobile
            />
          </div>
        </>
      )}
    </section>
  );
}

function CountryPanelContent({
  country,
  selectedDecade,
  decades,
  getCount,
  onClose,
  textBaseStyle,
  isMobile,
}: {
  country: CountryData;
  selectedDecade: Decade;
  decades: Decade[];
  getCount: (country: CountryData) => number;
  onClose: () => void;
  textBaseStyle: React.CSSProperties;
  isMobile: boolean;
}) {
  return (
    <div className="goodwill-panel-inner">
      <div className="goodwill-panel-header">
        <div className="goodwill-panel-header-inner">
          <h2
            style={{
              fontFamily: UI_FONT,
              fontSize: isMobile ? 24 : 26,
              fontWeight: 700,
              color: "white",
              margin: 0,
              lineHeight: 1.2,
              paddingRight: 16,
              flex: 1,
            }}
          >
            {country.name}
          </h2>

          <button
            onClick={onClose}
            className="goodwill-panel-close"
            aria-label="Close country panel"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="goodwill-panel-body">
        <div
          style={{
            marginBottom: 28,
            paddingBottom: 20,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            fontFamily: UI_FONT,
            fontSize: 13,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
          }}
        >
          {selectedDecade === "all"
            ? `${country.counts.all} total visits across all decades`
            : `${getCount(country)} visits in ${selectedDecade} · ${country.counts.all} total`}
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {decades.map((d) => (
              <div
                key={d}
                className="goodwill-chip"
                style={{
                  color:
                    selectedDecade === d ? "white" : "rgba(255,255,255,0.4)",
                  background:
                    selectedDecade === d
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                {d}: {country.counts[d] ?? 0}
              </div>
            ))}
          </div>
        </div>

        {country.events.map((event, i) => (
          <div
            key={`${country.id}-${event.year}-${i}`}
            style={{
              marginBottom: i < country.events.length - 1 ? 32 : 0,
            }}
          >
            <h3
              style={{
                fontFamily: UI_FONT,
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                margin: "0 0 10px 0",
              }}
            >
              {event.year}
            </h3>

            <h2
              style={{
                fontFamily: UI_FONT,
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.65,
                margin: `0 0 ${event.usContext ? 12 : 0}px 0`,
              }}
            >
              {event.international}
            </h2>

            {event.usContext && (
              <p
                style={{
                  ...textBaseStyle,
                  fontFamily: UI_FONT,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                <strong style={{ color: "white" }}>In the U.S.:</strong>{" "}
                {event.usContext}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
