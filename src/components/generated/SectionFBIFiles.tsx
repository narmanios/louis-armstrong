import React, { useEffect, useMemo, useState } from "react";
import { OverlayGallery, OverlayGallerySlide } from "./OverlayGallery";
import { useIsMobile } from "../../hooks/use-mobile";
interface FileData {
  id: string;
  src: string;
  alt: string;
  category: string;
  caption: string;
}
interface FBIFilesJsonItem {
  filename: string;
  link: string;
  date: string;
  caption?: string;
}

const fbiFilesJsonUrl = "/assets/data/fbi-files.json";

const getCategoryFromYear = (yearValue: string): string => {
  const year = parseInt(yearValue, 10);
  if (Number.isNaN(year)) return "Unknown";
  return `${Math.floor(year / 10) * 10}s`;
};

export const SectionFBIFiles: React.FC = () => {
  const isMobile = useIsMobile();
  const [fileItems, setFileItems] = useState<FileData[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  useEffect(() => {
    let isMounted = true;

    const loadFbiFiles = async () => {
      try {
        const response = await fetch(fbiFilesJsonUrl);
        if (!response.ok) {
          throw new Error("Failed to load FBI files JSON data.");
        }

        const data: FBIFilesJsonItem[] = await response.json();
        if (!isMounted) return;

        const normalized: FileData[] = data.map((item, index) => ({
          id: `${index + 1}`,
          src: `/assets/fbi-files/${item.filename}`,
          alt: item.filename,
          category: getCategoryFromYear(item.date),
          caption: item.caption?.trim() ?? "",
        }));

        setFileItems(normalized);
      } catch {
        if (isMounted) {
          setFileItems([]);
        }
      }
    };

    loadFbiFiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterClick = (newFilter: string) => {
    setFilter((prev) => (prev === newFilter ? "all" : newFilter));
  };
  const handleOpenImage = (index: number) => {
    setSelectedImageIndex(index);
  };
  const overlaySlides = useMemo<OverlayGallerySlide[]>(
    () =>
      fileItems.map((item) => ({
        id: item.id,
        type: "image" as const,
        src: item.src,
        alt: item.alt,
        caption: item.caption,
      })),
    [fileItems],
  );
  return (
    <section
      className="mcg-section mcg-fbi-section"
      style={{
        width: "100vw",
        minWidth: "100vw",
        flexShrink: 0,
        scrollSnapAlign: "start",
        minHeight: "100dvh",
        backgroundColor: "#000000",
        position: "relative",
        fontFamily: '"Hanken Grotesk", Arial, sans-serif',
        overflowX: "hidden",
        boxSizing: "border-box",
        padding: "0 0 60px 0",
      }}
    >
      <style>{`
        .mcg-fbi-section {
          background: #000000 !important;
          color: #ffffff;
        }

        .mcg-fbi-section .mcg-page-title {
          color: #ffffff !important;
        }

        /* ── 4K Proportional Scaling ── */
        @media (min-width: 2560px) {
          .mcg-fbi-section .mcg-page-title {
            font-size: 96px !important;
            line-height: 112px !important;
          }

          .fbi-outer-pad {
            padding: 0 98px !important;
          }

          .fbi-grid {
            grid-template-columns: repeat(auto-fit, 203px) !important;
            gap: 19px 21px !important;
            margin-top: 60px !important;
          }

          .fbi-doc-btn {
            width: 203px !important;
            height: 262px !important;
          }
        }

        @media (min-width: 3440px) {
          .mcg-fbi-section .mcg-page-title {
            font-size: 112px !important;
            line-height: 128px !important;
          }

          .fbi-outer-pad {
            padding: 0 112px !important;
          }

          .fbi-grid {
            grid-template-columns: repeat(auto-fit, 232px) !important;
            gap: 22px 24px !important;
            margin-top: 68px !important;
          }

          .fbi-doc-btn {
            width: 232px !important;
            height: 300px !important;
          }
        }
      `}</style>
      <div
        className="fbi-outer-pad"
        style={{
          width: "100%",
          padding: isMobile ? "0 20px" : "0 56px 0",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Header Section */}
        <header
          style={{
            display: "block",
            width: isMobile ? "calc(100% - 40px)" : "100%",
            marginLeft: isMobile ? "auto" : undefined,
            marginRight: isMobile ? "auto" : undefined,
          }}
        >
          <h1
            className="mcg-page-title mcg-page-title--flow"
            style={{ color: "#ffffff" }}
          >
            FBI Files
          </h1>
          <p
            className="FBI-description"
            style={{ color: "#ffffff", marginTop: "16px", maxWidth: "600px" }}
          >
            Sent abroad as a symbol of freedom, Armstrong was simultaneously
            surveilled by the FBI in a country where that freedom was still
            denied to him.
          </p>
          {/* <nav
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              padding: "7px 8px 8px 7px",
              marginTop: "12px",
            }}
          >
            {["1940s", "1950s", "1960s", "1970s", "1980s"].map((year) => (
              <button
                key={year}
                onClick={() => handleFilterClick(year)}
                style={{
                  fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                  fontWeight: "bold",
                  fontSize: 14,
                  color:
                    filter === year ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {year}
              </button>
            ))}
          </nav> */}
        </header>

        {/* Grid Container */}
        <div
          className="fbi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 116px)",
            gap: "11px 12px",
            width: isMobile ? "calc(100% - 40px)" : "100%",
            marginTop: "34px",
            marginLeft: isMobile ? "auto" : undefined,
            marginRight: isMobile ? "auto" : undefined,
            justifyContent: "center",
          }}
        >
          {fileItems.map((item, index) =>
            (() => {
              const isMatchingFilter =
                filter === "all" || item.category === filter;
              return (
                <button
                  key={item.id}
                  className="fbi-doc-btn"
                  onClick={() => handleOpenImage(index)}
                  style={{
                    width: "116px",
                    height: "150px",
                    padding: 0,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    opacity: isMatchingFilter ? 1 : 0.28,
                    transform: isMatchingFilter ? "scale(1)" : "scale(0.93)",
                    filter: isMatchingFilter
                      ? "grayscale(0%)"
                      : "grayscale(40%)",
                    position: "relative",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: isMatchingFilter
                        ? "rgba(255, 255, 255, 0)"
                        : "rgba(245, 243, 234, 0.44)",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = isMatchingFilter
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(245, 243, 234, 0.54)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = isMatchingFilter
                        ? "rgba(255, 255, 255, 0)"
                        : "rgba(245, 243, 234, 0.44)")
                    }
                  />
                </button>
              );
            })(),
          )}
        </div>
      </div>

      {selectedImageIndex !== null ? (
        <OverlayGallery
          slides={overlaySlides}
          onClose={() => setSelectedImageIndex(null)}
        />
      ) : null}

      {/* Responsive Styles Injection */}
    </section>
  );
};
