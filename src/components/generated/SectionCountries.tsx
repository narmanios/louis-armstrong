import React, { useState, useMemo, useEffect, useRef } from "react";
interface FlagData {
  name: string;
  src: string;
  region: string;
}
interface DecadeData {
  label: string;
  subtitle: string;
  events: number;
  flags: string[];
}
interface RegionData {
  label: string;
  color: string;
  countries: string[];
}
interface CountryData {
  name: string;
  exactDates: string;
  decades: string[];
  description: string;
}

const COUNTRY_TO_FLAG_CODE: Record<string, string> = {
  "United States": "us",
  "United Kingdom": "gb",
  Canada: "ca",
  France: "fr",
  Sweden: "se",
  Italy: "it",
  Australia: "au",
  Germany: "de",
  Denmark: "dk",
  Netherlands: "nl",
  Switzerland: "ch",
  "South Korea": "kr",
  "New Zealand": "nz",
  Japan: "jp",
  Ghana: "gh",
  Scotland: "gb-sct",
  "DR of Congo": "cd",
  Norway: "no",
  Mexico: "mx",
  Finland: "fi",
  Kenya: "ke",
  Austria: "at",
  Belgium: "be",
  Portugal: "pt",
  Jamaica: "jm",
  Sudan: "sd",
  Uganda: "ug",
  Chile: "cl",
  Tanzania: "tz",
  Egypt: "eg",
  Nigeria: "ng",
  China: "cn",
  "Cote d'ivoire": "ci",
  Ireland: "ie",
  Spain: "es",
  Cuba: "cu",
  Brazil: "br",
  Venezuela: "ve",
  Argentina: "ar",
  Uruguay: "uy",
  Cameroon: "cm",
  Zimbabwe: "zw",
  Zambia: "zm",
  Togo: "tg",
  Senegal: "sn",
  Liberia: "lr",
  Guinea: "gn",
  "Sierra Leone": "sl",
  "Czech Republic": "cz",
  Romania: "ro",
  Yugoslavia: "rs",
  Balkans: "rs",
  Hungary: "hu",
  Greece: "gr",
  Israel: "il",
  Lebanon: "lb",
  Slovenia: "si",
  India: "in",
  Algeria: "dz",
  Morocco: "ma",
  "Puerto Rico": "pr",
};

function getFlagSrc(name: string): string {
  const code = COUNTRY_TO_FLAG_CODE[name];
  if (code) {
    return `/assets/flags/${code}.svg`;
  }
  // Fallback to placeholder if country not mapped
  const fallbackCode = name.slice(0, 2).toUpperCase();
  const hue = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 36 24">
    <rect width="36" height="24" rx="2" fill="hsl(${hue},42%,55%)"/>
    <rect width="36" height="8" y="8" fill="hsl(${hue},42%,45%)"/>
    <text x="18" y="16" text-anchor="middle" dominant-baseline="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="rgba(255,255,255,0.92)" letter-spacing="0.5">${fallbackCode}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const REGION_DATA: RegionData[] = [
  {
    label: "Americas",
    color: "#d4737a",
    countries: [
      "United States",
      "Canada",
      "Cuba",
      "Brazil",
      "Jamaica",
      "Mexico",
      "Chile",
      "Venezuela",
      "Argentina",
      "Uruguay",
      "Puerto Rico",
    ],
  },
  {
    label: "Europe",
    color: "#7b9ed9",
    countries: [
      "United Kingdom",
      "France",
      "Sweden",
      "Italy",
      "Germany",
      "Denmark",
      "Netherlands",
      "Switzerland",
      "Scotland",
      "Norway",
      "Finland",
      "Austria",
      "Belgium",
      "Portugal",
      "Ireland",
      "Spain",
      "Czech Republic",
      "Romania",
      "Yugoslavia",
      "Balkans",
      "Hungary",
      "Greece",
      "Slovenia",
    ],
  },
  {
    label: "Africa",
    color: "#e8a45a",
    countries: [
      "Ghana",
      "DR of Congo",
      "Kenya",
      "Sudan",
      "Uganda",
      "Tanzania",
      "Egypt",
      "Nigeria",
      "Cote d'ivoire",
      "Cameroon",
      "Zimbabwe",
      "Zambia",
      "Togo",
      "Senegal",
      "Liberia",
      "Guinea",
      "Sierra Leone",
      "Algeria",
      "Morocco",
    ],
  },
  {
    label: "Asia & Oceania",
    color: "#72b87a",
    countries: [
      "South Korea",
      "New Zealand",
      "Japan",
      "Australia",
      "China",
      "India",
    ],
  },
  {
    label: "Middle East",
    color: "#b388e8",
    countries: ["Israel", "Lebanon"],
  },
];
const REGION_MAP = new Map<string, string>(
  REGION_DATA.flatMap((r) => r.countries.map((c) => [c, r.label])),
);
const COUNTRY_NAMES = [
  "United States",
  "United Kingdom",
  "Canada",
  "France",
  "Sweden",
  "Italy",
  "Australia",
  "Germany",
  "Denmark",
  "Netherlands",
  "Switzerland",
  "South Korea",
  "New Zealand",
  "Japan",
  "Ghana",
  "Scotland",
  "DR of Congo",
  "Norway",
  "Mexico",
  "Finland",
  "Kenya",
  "Austria",
  "Belgium",
  "Portugal",
  "Jamaica",
  "Sudan",
  "Uganda",
  "Chile",
  "Tanzania",
  "Egypt",
  "Nigeria",
  "China",
  "Cote d'ivoire",
  "Ireland",
  "Spain",
  "Cuba",
  "Brazil",
  "Venezuela",
  "Argentina",
  "Uruguay",
  "Cameroon",
  "Zimbabwe",
  "Zambia",
  "Togo",
  "Senegal",
  "Liberia",
  "Guinea",
  "Sierra Leone",
  "Czech Republic",
  "Romania",
  "Yugoslavia",
  "Balkans",
  "Hungary",
  "Greece",
  "Israel",
  "Lebanon",
  "Slovenia",
  "Puerto Rico",
  "Algeria",
  "Morocco",
  "India",
];
const ALL_FLAGS: FlagData[] = COUNTRY_NAMES.map((name) => ({
  name,
  src: getFlagSrc(name),
  region: REGION_MAP.get(name) ?? "Other",
}));
let COUNTS_MAP = new Map<string, CountryData>();
const DECADE_DATA: DecadeData[] = [
  {
    label: "1900s",
    subtitle: "Early Jazz & Ragtime",
    events: 0,
    flags: [],
  },
  {
    label: "1910s",
    subtitle: "Birth of Jazz",
    events: 0,
    flags: [],
  },
  {
    label: "1920s",
    subtitle: "Jazz Age & Harlem Renaissance",
    events: 0,
    flags: [],
  },
  {
    label: "1930s",
    subtitle: "Swing Era & Big Band",
    events: 0,
    flags: [],
  },
  {
    label: "1940s",
    subtitle: "Bebop & Post-War Blues",
    events: 0,
    flags: [],
  },
  {
    label: "1950s",
    subtitle: "Rock & Roll Rises",
    events: 0,
    flags: [],
  },
  {
    label: "1960s",
    subtitle: "Soul, Motown & Psychedelia",
    events: 0,
    flags: [],
  },
  {
    label: "1970s",
    subtitle: "Funk, Disco & Reggae",
    events: 0,
    flags: [],
  },
];
const REGION_COLOR_MAP = new Map<string, string>(
  REGION_DATA.map((r) => [r.label, r.color]),
);

// SVG canvas — sized to fit snugly inside the main area (1280 - 220px sidebar)
// Expanded slightly so outer flags never clip on hover
const SVG_W = 1090;
const SVG_H = 830;
const CX = SVG_W / 2;
const CY = SVG_H / 2;

// Center circle radius — slightly smaller than before
const CENTER_R = 108;

// Spiral parameters calibrated so all 61 flags stay within the SVG bounds
// with even arc-length spacing and a clear centre keep-out zone.
const TOTAL = ALL_FLAGS.length;

// Arc-length–based Archimedean spiral placement
// r(θ) = R0 + k·θ   →  starts just outside the center circle,
// outer edge must not exceed (min(SVG_W, SVG_H)/2 - FLAG_MARGIN).
// FLAG_MARGIN accounts for hover flag half-width (~19px) + label (~30px) + breathing room
const FLAG_MARGIN = 42; // px from SVG edge — generous to keep hovered outer flags in-bounds
// Inner ring pushed further out so innermost flags don't crowd/overlap the center on hover
const SPIRAL_R0 = CENTER_R + 52; // was CENTER_R + 28
const MAX_R = Math.min(SVG_W, SVG_H) / 2 - FLAG_MARGIN; // ~347 px

// Distribute flags evenly by angle across exactly 2 turns
const SPIRAL_TURNS = 2;
const TOTAL_THETA = SPIRAL_TURNS * 2 * Math.PI;
// k chosen so the outermost point (θ_max) = MAX_R − R0
const SPIRAL_K = (MAX_R - SPIRAL_R0) / TOTAL_THETA;

// Pre-compute a lookup table of cumulative arc lengths at fine angular steps
// Arc-length element for r(θ) = R0 + k·θ  is  ds = √(r² + k²) dθ
const ARC_STEPS = 2000;
const arcLUT: number[] = new Array(ARC_STEPS + 1);
arcLUT[0] = 0;
for (let s = 1; s <= ARC_STEPS; s++) {
  const theta = (s / ARC_STEPS) * TOTAL_THETA;
  const r = SPIRAL_R0 + SPIRAL_K * theta;
  const dTheta = TOTAL_THETA / ARC_STEPS;
  arcLUT[s] = arcLUT[s - 1] + Math.sqrt(r * r + SPIRAL_K * SPIRAL_K) * dTheta;
}
const TOTAL_ARC = arcLUT[ARC_STEPS];

// Given a target arc length, binary-search the LUT to find the corresponding θ
function arcLengthToTheta(targetArc: number): number {
  let lo = 0;
  let hi = ARC_STEPS;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arcLUT[mid] < targetArc) lo = mid + 1;
    else hi = mid;
  }
  // linear interpolation for precision
  if (lo === 0) return 0;
  const t0 = ((lo - 1) / ARC_STEPS) * TOTAL_THETA;
  const t1 = (lo / ARC_STEPS) * TOTAL_THETA;
  const a0 = arcLUT[lo - 1];
  const a1 = arcLUT[lo];
  const frac = a1 > a0 ? (targetArc - a0) / (a1 - a0) : 0;
  return t0 + frac * (t1 - t0);
}
function getSpiralPoint(index: number): {
  x: number;
  y: number;
  angleDeg: number;
  flipped: boolean;
} {
  // Evenly spaced in ARC LENGTH
  const targetArc = (index / (TOTAL - 1)) * TOTAL_ARC;
  const theta = arcLengthToTheta(targetArc);
  const r = SPIRAL_R0 + SPIRAL_K * theta;
  // Start at the top (−π/2) and rotate clockwise
  const angle = theta - Math.PI / 2;
  const x = CX + r * Math.cos(angle);
  const y = CY + r * Math.sin(angle);

  // 45° tilt toward center
  let rawAngleDeg = ((angle + 135) * 180) / Math.PI;

  // Normalize
  rawAngleDeg = rawAngleDeg % 360;
  if (rawAngleDeg < -90) rawAngleDeg += 360;
  if (rawAngleDeg > 270) rawAngleDeg -= 360;

  // If in the "upside-down" range (90, 270), flip by 180°
  let flipped = false;
  if (rawAngleDeg > 90 && rawAngleDeg < 270) {
    rawAngleDeg -= 180;
    flipped = true;
  }
  return {
    x,
    y,
    angleDeg: rawAngleDeg,
    flipped,
  };
}
function getRegionDescription(region: string): string {
  switch (region) {
    case "Americas":
      return "North, Central & South America";
    case "Europe":
      return "Western, Northern & Eastern Europe";
    case "Africa":
      return "Sub-Saharan, North & West Africa";
    case "Asia & Oceania":
      return "East Asia, South Asia & Pacific";
    case "Middle East":
      return "Levant & Eastern Mediterranean";
    default:
      return "";
  }
}
export const SectionCountries = () => {
  const [hoveredFlag, setHoveredFlag] = useState<string | null>(null);
  const [selectedDecadeIdx, setSelectedDecadeIdx] = useState<number | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [countriesData, setCountriesData] =
    useState<Map<string, CountryData>>(COUNTS_MAP);
  const [animatedFlagCount, setAnimatedFlagCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Detect when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setAnimatedFlagCount(0); // Reset animation counter each time
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.3 }, // Trigger when 30% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animate flags appearing one by one when section comes into view
  useEffect(() => {
    if (!isInView) return;

    const totalFlags = ALL_FLAGS.length;
    const animationDuration = 2000; // 2 seconds total
    const intervalTime = animationDuration / totalFlags;

    const interval = setInterval(() => {
      setAnimatedFlagCount((prev) => {
        if (prev >= totalFlags) {
          clearInterval(interval);
          return totalFlags;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    fetch("/assets/data/countries.json")
      .then((res) => res.json())
      .then((data: any[]) => {
        const updatedMap = new Map(COUNTS_MAP);

        // Name mapping to handle differences between component names and JSON names
        const nameMapping: Record<string, string> = {
          "Côte d'Ivoire": "Cote d'ivoire",
          "Democratic Republic of Congo": "DR of Congo",
        };

        data.forEach((country) => {
          const mappedName = nameMapping[country.name] || country.name;

          // Use data directly from JSON
          updatedMap.set(mappedName, {
            name: mappedName,
            exactDates: country.exactDates || "",
            decades: country.decades || [],
            description: country.description || "",
          });
        });
        COUNTS_MAP = updatedMap;
        setCountriesData(updatedMap);

        // Populate DECADE_DATA flags from countries.json
        DECADE_DATA.forEach((decade) => {
          const countriesInDecade = data
            .filter((country) => {
              const mappedName = nameMapping[country.name] || country.name;
              return country.decades && country.decades.includes(decade.label);
            })
            .map((country) => nameMapping[country.name] || country.name);

          decade.flags = countriesInDecade;
        });
      })
      .catch((err) => console.error("Failed to load countries data:", err));
  }, []);
  const handleDecadeClick = (idx: number) => {
    setSelectedDecadeIdx((prev) => (prev === idx ? null : idx));
  };
  const handleRegionClick = (label: string) => {
    setSelectedRegion((prev) => (prev === label ? null : label));
  };
  const activeDecade =
    selectedDecadeIdx !== null ? DECADE_DATA[selectedDecadeIdx] : null;
  const activeRegionCountries =
    selectedRegion !== null
      ? new Set(
          REGION_DATA.find((r) => r.label === selectedRegion)?.countries ?? [],
        )
      : null;
  const activeFlagNames: Set<string> | null = useMemo(() => {
    if (activeDecade && activeRegionCountries)
      return new Set(
        activeDecade.flags.filter((f) => activeRegionCountries.has(f)),
      );
    if (activeDecade) return new Set(activeDecade.flags);
    if (activeRegionCountries) return activeRegionCountries;
    return null;
  }, [activeDecade, activeRegionCountries, countriesData]);

  // Center display content
  const hoveredData = hoveredFlag ? countriesData.get(hoveredFlag) : null;
  const hoveredRegion = hoveredFlag
    ? (REGION_MAP.get(hoveredFlag) ?? "Other")
    : null;
  const hoveredRegionColor = hoveredRegion
    ? (REGION_COLOR_MAP.get(hoveredRegion) ?? "#aaa")
    : "#aaa";
  return (
    <>
      <style>{`
        .countries-section .mcg-page-title {
          color: #000000 !important;
        }
      `}</style>
      <div
        ref={sectionRef}
        className="countries-section"
        style={{
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "minmax(260px, 300px) minmax(0, 1fr)",
          gap: "48px",
          padding: "56px 56px 48px",
          alignItems: "start",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {/* ── Left sidebar ── */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingTop: "4px",
            position: "sticky",
            top: "20px",
          }}
        >
          <div style={{ marginBottom: "0", marginTop: "20px" }}>
            <h1
              className="mcg-page-title"
              style={{
                color: "#000000",
                whiteSpace: "nowrap",
              }}
            >
              Goodwill Ambassador
            </h1>
            <p
              className="goodwill-description"
              style={{ color: "#000000", marginTop: "16px" }}
            >
              An interactive visualization of Armstrong’s travels and concerts
              across 60+ countries as a Goodwill Ambassador.
            </p>
          </div>

          {/* Decade filter */}
          <nav
            aria-label="Filter by decade"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "6px",
              marginTop: "66px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "8px",
                width: "100%",
              }}
            >
              <span>Decade</span>
            </div>
            {DECADE_DATA.map((decade, idx) => {
              const isActive = selectedDecadeIdx === idx;
              return (
                <button
                  key={decade.label}
                  onClick={() => handleDecadeClick(idx)}
                  aria-pressed={isActive}
                  style={{
                    display: "inline-flex",
                    textAlign: "left",
                    background: isActive
                      ? "rgba(0, 0, 0, 0.08)"
                      : "transparent",
                    border: "0",
                    color: isActive ? "#1a1a1a" : "rgba(0, 0, 0, 0.55)",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.fontWeight = "700";
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.fontWeight = "400";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {decade.label}
                </button>
              );
            })}
          </nav>

          {/* Region filter */}
          <nav
            aria-label="Filter by region"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "8px",
                width: "100%",
              }}
            >
              <span>Region</span>
            </div>
            {REGION_DATA.map((region) => {
              const isActive = selectedRegion === region.label;
              return (
                <button
                  key={region.label}
                  onClick={() => handleRegionClick(region.label)}
                  aria-pressed={isActive}
                  style={{
                    display: "inline-flex",
                    textAlign: "left",
                    background: isActive
                      ? "rgba(0, 0, 0, 0.08)"
                      : "transparent",
                    border: "0",
                    color: isActive ? "#1a1a1a" : "rgba(0, 0, 0, 0.55)",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.fontWeight = "700";
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.fontWeight = "400";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {region.label}
                </button>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: "auto",
              paddingTop: "28px",
            }}
          ></div>
        </aside>

        {/* ── Main visualization ── */}
        <main
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG */}
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
              aria-label="Flags arranged in a spiral"
            >
              {/* Center circle removed for cleaner look */}

              {/* Center content — hover state */}
              {hoveredFlag && hoveredData && (
                <g>
                  {/* Flag name */}
                  <text
                    x={CX - 20}
                    y={CY - 56}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      fill: "#1a1a1a",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "-0.7px",
                    }}
                  >
                    {hoveredFlag}
                  </text>

                  {/* Region text */}
                  <text
                    x={CX - 20}
                    y={CY - 38}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      fill: "#1a1a1a",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {hoveredRegion}
                  </text>

                  {/* Divider */}
                  <line
                    x1={CX - 56}
                    y1={CY - 18}
                    x2={CX + 16}
                    y2={CY - 18}
                    stroke="#e8e5df"
                    strokeWidth="1"
                  />

                  {/* Exact dates */}
                  <text
                    x={CX - 20}
                    y={CY + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      fill: "#1a1a1a",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "0.2px",
                    }}
                  >
                    {hoveredData.exactDates}
                  </text>

                  {/* Country description */}
                  {hoveredData.description && (
                    <foreignObject
                      x={CX - 160}
                      y={CY + 30}
                      width={280}
                      height={80}
                    >
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: 400,
                          color: "#888",
                          fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                          letterSpacing: "0.2px",
                          lineHeight: "1.5",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        {hoveredData.description}
                      </div>
                    </foreignObject>
                  )}
                </g>
              )}

              {/* Center content — decade filter active, no hover */}
              {!hoveredFlag && activeDecade && (
                <g>
                  <text
                    x={CX - 20}
                    y={CY - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      fill: "#1a1a1a",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "-1px",
                    }}
                  >
                    {activeDecade.label}
                  </text>
                  <text
                    x={CX - 20}
                    y={CY + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "9px",
                      fill: "#aaa",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "0.2px",
                    }}
                  >
                    {activeDecade.subtitle}
                  </text>
                </g>
              )}

              {/* Center content — idle (no hover, no filter) */}
              {!hoveredFlag && !activeDecade && (
                <g>
                  <text
                    x={CX - 20}
                    y={CY - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fill: "#c8c5be",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "0.4px",
                    }}
                  >
                    Goodwill
                  </text>
                  <text
                    x={CX - 20}
                    y={CY + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      fill: "#c8c5be",
                      fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                      letterSpacing: "0.4px",
                    }}
                  >
                    Ambassador
                  </text>
                </g>
              )}

              {/* Spiral flags */}
              {ALL_FLAGS.map((flag, i) => {
                const { x: fx, y: fy, angleDeg, flipped } = getSpiralPoint(i);
                const isActive =
                  activeFlagNames === null || activeFlagNames.has(flag.name);
                const isHovered = hoveredFlag === flag.name;
                const regionColor = REGION_COLOR_MAP.get(flag.region) ?? "#ccc";
                const FLAG_W = 28;
                const FLAG_H = 18;
                const FLAG_W_HOV = 34;
                const FLAG_H_HOV = 22;
                const w = isHovered ? FLAG_W_HOV : FLAG_W;
                const h = isHovered ? FLAG_H_HOV : FLAG_H;

                // Uniform dot radius
                const dotR = 3.5;

                // Animation: flags appear one by one from center outward
                const isVisible = i < animatedFlagCount;
                const animationOpacity = isVisible ? 1 : 0;
                const animationScale = isVisible ? 1 : 0.3;

                // When not flipped: the flag's "left" in rotated space points outward → label to the left (textAnchor="end")
                // When flipped (180° correction applied): the flag's "left" in rotated space now points inward → label to the right (textAnchor="start")
                // This ensures the label is ALWAYS on the outer/away-from-center side.
                const labelX = flipped ? fx + w / 2 + 6 : fx - w / 2 - 6;
                const labelAnchor = flipped ? "start" : "end";
                return (
                  <g
                    key={flag.name}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease-out",
                      opacity: animationOpacity * (isActive ? 1 : 0.08),
                      transform: `scale(${animationScale})`,
                      transformOrigin: `${fx}px ${fy}px`,
                    }}
                    onMouseEnter={() => setHoveredFlag(flag.name)}
                    onMouseLeave={() => setHoveredFlag(null)}
                    role="img"
                    aria-label={`Flag of ${flag.name}`}
                  >
                    {/* Region dot */}
                    <circle
                      cx={fx}
                      cy={fy}
                      r={dotR}
                      fill={regionColor}
                      opacity={isHovered ? 0.9 : 0.28}
                      style={{
                        transition: "all 0.2s ease",
                      }}
                    />

                    {/* Group rotated toward center */}
                    <g transform={`rotate(${angleDeg}, ${fx}, ${fy})`}>
                      {/* Flag image — centred on spiral point */}
                      <image
                        href={flag.src}
                        x={fx - w / 2}
                        y={fy - h / 2}
                        width={w}
                        height={h}
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                          transition: "all 0.2s ease",
                          filter: isHovered
                            ? "drop-shadow(0 3px 10px rgba(0,0,0,0.30))"
                            : "drop-shadow(0 1px 3px rgba(0,0,0,0.10))",
                        }}
                      />

                      {/* Country name — always on the outer side of the flag */}
                      <text
                        x={labelX}
                        y={fy + (isHovered ? 3 : 2.5)}
                        textAnchor={labelAnchor}
                        style={{
                          fontSize: isHovered ? "8px" : "6.5px",
                          fontWeight: isHovered ? 600 : 400,
                          fill: isHovered ? "#1a1a1a" : "#888",
                          fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                          letterSpacing: "0.2px",
                          transition: "all 0.2s ease",
                          pointerEvents: "none",
                        }}
                      >
                        {flag.name}
                      </text>
                    </g>

                    {/* Invisible hit area (unrotated, centred on flag position) */}
                    <rect
                      x={fx - FLAG_W_HOV / 2}
                      y={fy - FLAG_H_HOV / 2}
                      width={FLAG_W_HOV}
                      height={FLAG_H_HOV}
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </main>
      </div>
    </>
  );
};
