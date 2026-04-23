import React, { useEffect, useState } from "react";
interface FlagData {
  name: string;
  src: string;
}
interface DecadeData {
  label: string;
  centerText: string;
  subtitle: string;
  events: number;
  flags: string[];
}
interface RegionData {
  label: string;
  countries: string[];
}
interface CountryCounts {
  name: string;
  all: number;
  "1920s"?: number;
  "1930s"?: number;
  "1940s"?: number;
  "1950s"?: number;
  "1960s"?: number;
  "1970s"?: number;
}

interface CountryData {
  id: string;
  name: string;
  counts: CountryCounts;
}
const ALL_FLAGS: FlagData[] = [
  {
    name: "United States",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/0899b833-0dc4-434b-97fa-b9097ada8e41.svg",
  },
  {
    name: "United Kingdom",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/43d2963a-175c-4f05-a1c3-f15e8e40e90d.svg",
  },
  {
    name: "France",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/f68c29dd-f168-421b-aa28-3d5a59d900b5.svg",
  },
  {
    name: "Germany",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/c0992055-0121-4985-80ae-69044f66bca8.svg",
  },
  {
    name: "Canada",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/e1cd7c26-e657-4e08-b698-44012dbdbdbf.svg",
  },
  {
    name: "Italy",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/ca8374e0-8851-46ff-bfd7-4ee83e888aae.svg",
  },
  {
    name: "Switzerland",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/0155bcbe-63eb-4b25-a880-a03f199d03b4.svg",
  },
  {
    name: "Japan",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/e844614b-9b5c-4c81-9594-d24dd1175637.svg",
  },
  {
    name: "Australia",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/69592d5a-ad3f-4057-b3f9-cea5ce901a1f.svg",
  },
  {
    name: "Denmark",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/8db2afca-4b7f-4095-99af-e2164c96c1c8.svg",
  },
  {
    name: "New Zealand",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/27172a51-c2aa-4a25-8686-a2f0d3d7dffa.svg",
  },
  {
    name: "Ghana",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/b48ac485-f36f-4565-8dc3-fb6fdee73d43.svg",
  },
  {
    name: "Norway",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/95de96fa-17f7-47a1-86af-4003accaad64.svg",
  },
  {
    name: "Scotland",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/c19401da-3f7c-4814-9311-1ae40abc63f9.svg",
  },
  {
    name: "DR of Congo",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/83a439c6-6e32-4be8-abba-f407bd289df1.svg",
  },
  {
    name: "Sweden",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/38414d58-1e41-4a5f-b1b7-8678fc635c2f.svg",
  },
  {
    name: "Sudan",
    src: "https://flagcdn.com/sd.svg",
  },
  {
    name: "Belgium",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/068533fb-7f88-46b6-8884-fb514b702935.svg",
  },
  {
    name: "Finland",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/7bfb3a59-5a16-4bc0-bca3-1d52258f4924.svg",
  },
  {
    name: "Kenya",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/2199a8f2-31bf-44ac-a94a-6f275864c42b.svg",
  },
  {
    name: "Netherlands",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/0f7fea4a-7c6e-4ddb-8554-2de32ac13404.svg",
  },
  {
    name: "Uganda",
    src: "https://flagcdn.com/ug.svg",
  },
  {
    name: "China",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/e81aa417-580a-4c06-b1bd-10a7b4760cb2.svg",
  },
  {
    name: "Côte d'Ivoire",
    src: "https://flagcdn.com/ci.svg",
  },
  {
    name: "Chile",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/ad075a19-894c-47f9-8787-68f41c20d086.svg",
  },
  {
    name: "Tanzania",
    src: "https://flagcdn.com/tz.svg",
  },
  {
    name: "Egypt",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/21f2ac96-7749-4e44-b5cf-9ba37f5133ee.svg",
  },
  {
    name: "Nigeria",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/befa2994-7d20-4255-8154-d8038535ac77.svg",
  },
  {
    name: "Portugal",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/04153e5a-e439-4819-8f87-6be9143dbd30.svg",
  },
  {
    name: "Austria",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/30375545-fc2b-4013-bc4e-506ea6bae08a.svg",
  },
  {
    name: "Ireland",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/9c9a77a8-18f2-4910-8192-a2438dd1f2c2.svg",
  },
  {
    name: "Mexico",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/1e821d06-062d-47ed-9768-13e1e761af9f.svg",
  },
  {
    name: "Spain",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/2bba5463-156b-482e-a2d0-26f177b94ffc.svg",
  },
  {
    name: "Cuba",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/74ff72a4-d63d-41eb-bc94-43a545fd10cc.svg",
  },
  {
    name: "Brazil",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/bc34c01f-a224-4870-b836-d29ef5507bc5.svg",
  },
  {
    name: "Jamaica",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/ddf9201a-6e11-4732-9367-926132c7c472.svg",
  },
  {
    name: "Venezuela",
    src: "https://flagcdn.com/ve.svg",
  },
  {
    name: "South Korea",
    src: "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/b329e288-230e-4b95-82d6-10061c31bdac.svg",
  },
];

const COUNTRY_DATA_URL = "/assets/data/goodwillCountries.json";

// Full per-decade event counts per country. US uses the provided sample data; others use representative estimates.
const COUNTRY_COUNTS_FALLBACK: CountryCounts[] = [
  {
    name: "United States",
    all: 1729,
  },
  {
    name: "United Kingdom",
    all: 1047,
  },
  {
    name: "France",
    all: 423,
  },
  {
    name: "Germany",
    all: 312,
  },
  {
    name: "Canada",
    all: 289,
  },
  {
    name: "Italy",
    all: 198,
  },
  {
    name: "Switzerland",
    all: 167,
  },
  {
    name: "Japan",
    all: 145,
  },
  {
    name: "Australia",
    all: 203,
  },
  {
    name: "Denmark",
    all: 134,
  },
  {
    name: "New Zealand",
    all: 89,
  },
  {
    name: "Ghana",
    all: 76,
  },
  {
    name: "Norway",
    all: 112,
  },
  {
    name: "Scotland",
    all: 156,
  },
  {
    name: "DR of Congo",
    all: 64,
  },
  {
    name: "Sweden",
    all: 178,
  },
  {
    name: "Sudan",
    all: 50,
  },
  {
    name: "Belgium",
    all: 143,
  },
  {
    name: "Finland",
    all: 98,
  },
  {
    name: "Kenya",
    all: 82,
  },
  {
    name: "Uganda",
    all: 35,
  },
  {
    name: "China",
    all: 167,
  },
  {
    name: "Côte d'Ivoire",
    all: 42,
  },
  {
    name: "China",
    all: 167,
  },
  {
    name: "Tanzania",
    all: 38,
  },
  {
    name: "Chile",
    all: 94,
  },
  {
    name: "Egypt",
    all: 71,
  },
  {
    name: "Nigeria",
    all: 88,
  },
  {
    name: "Portugal",
    all: 109,
  },
  {
    name: "Austria",
    all: 132,
  },
  {
    name: "Ireland",
    all: 148,
  },
  {
    name: "Mexico",
    all: 176,
  },
  {
    name: "Spain",
    all: 201,
  },
  {
    name: "Cuba",
    all: 163,
  },
  {
    name: "Venezuela",
    all: 45,
  },
  {
    name: "Brazil",
    all: 234,
  },
  {
    name: "Jamaica",
    all: 187,
  },
  {
    name: "South Korea",
    all: 124,
  },
];
const COUNTS_MAP = new Map<string, CountryCounts>(
  COUNTRY_COUNTS_FALLBACK.map((c) => [c.name, c]),
);
const DECADE_DATA: DecadeData[] = [
  {
    label: "1920s",
    centerText: "1920s",
    subtitle: "Jazz Age & Harlem Renaissance",
    events: 142,
    flags: [
      "United States",
      "United Kingdom",
      "France",
      "Germany",
      "Italy",
      "Switzerland",
      "Denmark",
      "Netherlands",
      "Austria",
      "Belgium",
    ],
  },
  {
    label: "1930s",
    centerText: "1930s",
    subtitle: "Swing Era & Big Band",
    events: 178,
    flags: [
      "United States",
      "United Kingdom",
      "France",
      "Germany",
      "Sweden",
      "Denmark",
      "Netherlands",
      "Switzerland",
      "Canada",
      "Japan",
    ],
  },
  {
    label: "1940s",
    centerText: "1940s",
    subtitle: "Bebop & Post-War Blues",
    events: 215,
    flags: [
      "United States",
      "United Kingdom",
      "France",
      "Canada",
      "Australia",
      "Cuba",
      "Brazil",
      "Jamaica",
      "Ireland",
      "Norway",
    ],
  },
  {
    label: "1950s",
    centerText: "1950s",
    subtitle: "Rock & Roll Rises",
    events: 304,
    flags: [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Jamaica",
      "Cuba",
      "Mexico",
      "Brazil",
      "France",
      "Chile",
      "Scotland",
      "Ireland",
    ],
  },
  {
    label: "1960s",
    centerText: "1960s",
    subtitle: "Soul, Motown & Psychedelia",
    events: 412,
    flags: [
      "United States",
      "United Kingdom",
      "Jamaica",
      "Nigeria",
      "Ghana",
      "Kenya",
      "Brazil",
      "Cuba",
      "Mexico",
      "Japan",
      "South Korea",
      "Australia",
      "France",
      "Scotland",
    ],
  },
];
const REGION_DATA: RegionData[] = [
  {
    label: "Europe",
    countries: [
      "United Kingdom",
      "France",
      "Germany",
      "Italy",
      "Switzerland",
      "Denmark",
      "Norway",
      "Scotland",
      "Sweden",
      "Belgium",
      "Finland",
      "Netherlands",
      "Portugal",
      "Austria",
      "Ireland",
      "Spain",
    ],
  },
  {
    label: "Africa",
    countries: [
      "Ghana",
      "DR of Congo",
      "Kenya",
      "Egypt",
      "Nigeria",
      "Sudan",
      "Uganda",
      "Côte d'Ivoire",
      "Tanzania",
    ],
  },
  {
    label: "South East Asia",
    countries: ["Japan", "China", "South Korea", "Australia", "New Zealand"],
  },
  {
    label: "Americas",
    countries: [
      "United States",
      "Canada",
      "Cuba",
      "Brazil",
      "Jamaica",
      "Mexico",
      "Chile",
      "Venezuela",
    ],
  },
];

// SVG canvas dimensions
const SVG_W = 820;
const SVG_H = 820;
const CX = SVG_W / 2;
const CY = SVG_H / 2;

// Ring radius at which flag centres sit
const FLAG_R = 290;

// Flag size range — proportional to event count
const FLAG_MIN_W = 18;
const FLAG_MAX_W = 65;
const FLAG_ASPECT = 0.68; // height = width * aspect
export const SectionGlobalCountries = () => {
  const [hoveredFlag, setHoveredFlag] = useState<string | null>(null);
  const [selectedDecadeIdx, setSelectedDecadeIdx] = useState<number | null>(
    null,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [countryCounts, setCountryCounts] =
    useState<Map<string, CountryCounts>>(COUNTS_MAP);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(COUNTRY_DATA_URL)
      .then((res) => res.json())
      .then((data: CountryData[]) => {
        const countsMap = new Map<string, CountryCounts>();
        data.forEach((country) => {
          // Map JSON country name to display name (handle DR of Congo)
          const displayName =
            country.name === "Democratic Republic of Congo"
              ? "DR of Congo"
              : country.name;

          countsMap.set(displayName, {
            name: displayName,
            all: country.counts.all,
            "1920s": country.counts["1920s"],
            "1930s": country.counts["1930s"],
            "1940s": country.counts["1940s"],
            "1950s": country.counts["1950s"],
            "1960s": country.counts["1960s"],
            "1970s": country.counts["1970s"],
          });
        });
        setCountryCounts(countsMap);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load country data:", err);
        setLoading(false);
      });
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

  // Build the set of countries that have events in the selected decade based on actual data
  const activeDecadeCountries: Set<string> | null = (() => {
    if (!activeDecade) return null;
    const decadeKey = activeDecade.label as keyof CountryCounts;
    const countriesWithEvents = new Set<string>();

    // Check each country in the loaded data to see if it has events in this decade
    countryCounts.forEach((data, countryName) => {
      const decadeCount = data[decadeKey];
      if (typeof decadeCount === "number" && decadeCount > 0) {
        countriesWithEvents.add(countryName);
      }
    });

    return countriesWithEvents;
  })();

  const activeFlagNames: Set<string> | null = (() => {
    if (activeDecadeCountries && activeRegionCountries) {
      // Show countries that are BOTH in the selected decade AND in the selected region
      return new Set(
        Array.from(activeDecadeCountries).filter((f) =>
          activeRegionCountries.has(f),
        ),
      );
    }
    if (activeDecadeCountries) return activeDecadeCountries;
    if (activeRegionCountries) return activeRegionCountries;
    return null;
  })();

  // Which decade key to use for sizing
  const decadeKey: keyof CountryCounts | null = activeDecade
    ? (activeDecade.label as keyof CountryCounts)
    : null;
  const total = ALL_FLAGS.length;
  const angleStep = (2 * Math.PI) / total;
  const startAngle = -Math.PI / 2;

  // Calculate MAX_COUNT from loaded data - use second-highest to prevent US from being too large
  const sortedCounts = Array.from(countryCounts.values())
    .map((c) => c.all)
    .sort((a, b) => b - a);
  const MAX_COUNT = sortedCounts[1] ?? 1047; // Second highest

  // Helper function to get flag size based on loaded data
  const getFlagSize = (name: string): { w: number; h: number } => {
    const data = countryCounts.get(name);
    if (!data)
      return {
        w: FLAG_MIN_W,
        h: FLAG_MIN_W * FLAG_ASPECT,
      };
    const count = data.all;
    // Cap count at MAX_COUNT so US doesn't dominate
    const cappedCount = Math.min(count, MAX_COUNT);
    const ratio = MAX_COUNT > 0 ? cappedCount / MAX_COUNT : 0;
    // Use power of 0.6 for more variation than sqrt (0.5) but still keeping small countries visible
    const w = FLAG_MIN_W + (FLAG_MAX_W - FLAG_MIN_W) * Math.pow(ratio, 0.6);
    return {
      w,
      h: w * FLAG_ASPECT,
    };
  };

  // Sort flags by count (highest to lowest) - highest will be at top (startAngle = -90deg)
  const sortedFlags = [...ALL_FLAGS].sort((a, b) => {
    const aCount = countryCounts.get(a.name)?.all ?? 0;
    const bCount = countryCounts.get(b.name)?.all ?? 0;
    return bCount - aCount;
  });

  // Center display
  const hoveredData = hoveredFlag ? countryCounts.get(hoveredFlag) : null;
  const centerCountryEvents = hoveredData
    ? decadeKey
      ? (hoveredData[decadeKey] as number)
      : hoveredData.all
    : null;

  // Calculate total events for the selected decade from actual data
  const centerDecadeEvents =
    activeDecade && decadeKey
      ? Array.from(countryCounts.values()).reduce((sum, data) => {
          const decadeCount = data[decadeKey];
          return sum + (typeof decadeCount === "number" ? decadeCount : 0);
        }, 0)
      : null;

  // Calculate total events for decade + region intersection
  const centerDecadeRegionEvents =
    activeDecade && decadeKey && activeFlagNames && activeRegionCountries
      ? Array.from(countryCounts.entries()).reduce(
          (sum, [countryName, data]) => {
            // Only count if country is in the intersection (both decade and region)
            if (activeFlagNames.has(countryName)) {
              const decadeCount = data[decadeKey];
              return sum + (typeof decadeCount === "number" ? decadeCount : 0);
            }
            return sum;
          },
          0,
        )
      : null;

  const centerNumber =
    centerCountryEvents ?? centerDecadeRegionEvents ?? centerDecadeEvents;
  const centerSubLabel =
    centerCountryEvents !== null
      ? "events in this country"
      : centerDecadeRegionEvents !== null
        ? "events this decade & region"
        : centerDecadeEvents !== null
          ? "events this decade"
          : null;
  const centerTitle =
    hoveredFlag ??
    (activeDecade ? activeDecade.subtitle : "Goodwill Ambassador");
  return (
    <>
      <style>{`
        .global-countries-section .mcg-page-title {
          color: #000000 !important;
        }
      `}</style>
      <div
        className="global-countries-section"
        style={{
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          display: "grid",
          gridTemplateColumns: "minmax(260px, 300px) minmax(0, 1fr)",
          gap: "48px",
          padding: "56px 56px 48px",
          alignItems: "start",
        }}
      >
        {/* Left sidebar */}
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
              style={{ color: "#000000", whiteSpace: "nowrap" }}
            >
              Goodwill (Unofficial) Ambassador
            </h1>
          </div>

          {/* Decade filter */}
          <nav
            aria-label="Filter by decade"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
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
              }}
            >
              Decade
            </div>
            {DECADE_DATA.map((decade, idx) => {
              const isActive = selectedDecadeIdx === idx;
              return (
                <button
                  key={decade.label}
                  onClick={() => handleDecadeClick(idx)}
                  aria-pressed={isActive}
                  style={{
                    display: "inline-block",
                    textAlign: "left",
                    background: "transparent",
                    border: "0",
                    color: isActive ? "#1a1a1a" : "rgba(0, 0, 0, 0.55)",
                    padding: "4px 6px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    transition: "color 150ms ease, font-weight 150ms ease",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.fontWeight = "700";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.fontWeight = "400";
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
              flexDirection: "column",
              gap: "4px",
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
              }}
            >
              Region
            </div>
            {REGION_DATA.map((region) => {
              const isActive = selectedRegion === region.label;
              return (
                <button
                  key={region.label}
                  onClick={() => handleRegionClick(region.label)}
                  aria-pressed={isActive}
                  style={{
                    display: "inline-block",
                    textAlign: "left",
                    background: "transparent",
                    border: "0",
                    color: isActive ? "#1a1a1a" : "rgba(0, 0, 0, 0.55)",
                    padding: "4px 6px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    transition: "color 150ms ease, font-weight 150ms ease",
                    fontFamily: "inherit",
                  }}
                >
                  {region.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content area */}
        <main
          style={{
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Circle diagram */}
          <div
            style={{
              width: "100%",
              maxWidth: `${SVG_W}px`,
              aspectRatio: "1 / 1",
            }}
          >
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              width="100%"
              height="100%"
              style={{
                display: "block",
                overflow: "visible",
              }}
              aria-label="Flags arranged in a circle"
            >
              {/* Center info area */}
              <circle cx={CX} cy={CY} r={218} fill="white" />

              {/* Center text */}
              {centerNumber !== null ? (
                <g>
                  <text
                    x={CX}
                    y={CY - 18}
                    textAnchor="middle"
                    style={{
                      fontSize: "54px",
                      fontWeight: 700,
                      fill: "#1a1a1a",
                      fontFamily:
                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      letterSpacing: "-2px",
                    }}
                  >
                    {centerNumber}
                  </text>
                  <text
                    x={CX}
                    y={CY + 16}
                    textAnchor="middle"
                    style={{
                      fontSize: "11px",
                      fontWeight: 400,
                      fill: "#aaa",
                      fontFamily:
                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {centerSubLabel}
                  </text>
                  {hoveredFlag && (
                    <text
                      x={CX}
                      y={CY + 40}
                      textAnchor="middle"
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        fill: "#555",
                        fontFamily:
                          '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      }}
                    >
                      {hoveredFlag}
                    </text>
                  )}
                </g>
              ) : (
                <g>
                  <text
                    x={CX}
                    y={CY - 10}
                    textAnchor="middle"
                    style={{
                      fontSize: "15px",
                      fontWeight: 400,
                      fill: "#888",
                      fontFamily:
                        '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      letterSpacing: "0.2px",
                    }}
                  >
                    {centerTitle}
                  </text>
                </g>
              )}

              {/* Flags arranged in a circle */}
              {sortedFlags.map((flag, i) => {
                const angle = startAngle + i * angleStep;
                const fx = CX + FLAG_R * Math.cos(angle);
                const fy = CY + FLAG_R * Math.sin(angle);
                const isActive =
                  activeFlagNames === null || activeFlagNames.has(flag.name);
                const isHovered = hoveredFlag === flag.name;

                // Size flag proportionally — always based on all-time count so filters never shrink flags
                const { w: flagW, h: flagH } = getFlagSize(flag.name);

                // Radial rotation angle
                const angleDeg = (angle * 180) / Math.PI;
                const isRightSide = Math.cos(angle) >= 0;
                // Text reads outward; left side flipped 180°
                const textRotate = isRightSide ? angleDeg : angleDeg + 180;
                const textAnchor = isRightSide ? "start" : "end";

                // Label starts just beyond the flag outer edge
                const labelGap = flagW / 2 + 9;
                const labelDist = FLAG_R + labelGap;
                const lx = CX + labelDist * Math.cos(angle);
                const ly = CY + labelDist * Math.sin(angle);

                // Scale factor for hover
                const hoverScale = isHovered ? 1.45 : 1;
                return (
                  <g
                    key={flag.name}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.25s ease",
                    }}
                    opacity={isActive ? 1 : 0.12}
                    onMouseEnter={() => setHoveredFlag(flag.name)}
                    onMouseLeave={() => setHoveredFlag(null)}
                    role="img"
                    aria-label={`Flag of ${flag.name}`}
                  >
                    {/* Flag image — rotated to match label angle, scaled on hover from flag centre */}
                    <g
                      transform={`rotate(${textRotate}, ${fx}, ${fy}) scale(1)`}
                    >
                      <image
                        href={flag.src}
                        x={fx - (flagW / 2) * hoverScale}
                        y={fy - (flagH / 2) * hoverScale}
                        width={flagW * hoverScale}
                        height={flagH * hoverScale}
                        preserveAspectRatio="xMidYMid meet"
                        style={{
                          transition: "all 0.2s ease",
                          filter: isHovered
                            ? "drop-shadow(0 3px 10px rgba(0,0,0,0.22))"
                            : "drop-shadow(0 1px 3px rgba(0,0,0,0.10))",
                        }}
                      />
                    </g>

                    {/* Country name label */}
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={textAnchor}
                      dominantBaseline="middle"
                      transform={`rotate(${textRotate}, ${lx}, ${ly})`}
                      style={{
                        fontSize: "9.5px",
                        fontFamily:
                          '"Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontWeight: isHovered ? 600 : 400,
                        fill: isHovered ? "#1a1a1a" : "#888",
                        letterSpacing: "0.3px",
                      }}
                    >
                      {flag.name}
                    </text>
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
