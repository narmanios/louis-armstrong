import React, { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
interface FileData {
  id: string;
  src: string;
  alt: string;
  category: string;
}
interface FBIFilesJsonItem {
  filename: string;
  link: string;
  date: string;
}

const fbiFilesJsonUrl = new URL("../../../data/fbi-files.json", import.meta.url)
  .href;

const getCategoryFromYear = (yearValue: string): string => {
  const year = parseInt(yearValue, 10);
  if (Number.isNaN(year)) return "Unknown";
  return `${Math.floor(year / 10) * 10}s`;
};

export const SectionFBIFiles: React.FC = () => {
  const isMobile = useIsMobile();
  const [fileItems, setFileItems] = useState<FileData[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<FileData | null>(null);
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
          src: `/images/fbi-files/${item.filename}`,
          alt: item.filename,
          category: getCategoryFromYear(item.date),
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

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);
  const handleFilterClick = (newFilter: string) => {
    setFilter((prev) => (prev === newFilter ? "all" : newFilter));
  };
  return (
    <section
      className="mcg-section mcg-fbi-section"
      style={{
        width: "100vw",
        minWidth: "100vw",
        flexShrink: 0,
        scrollSnapAlign: "start",
        minHeight: "800px",
        backgroundColor: "#000000",
        position: "relative",
        fontFamily: '"Helvetica Neue", sans-serif',
        overflowX: "hidden",
        boxSizing: "border-box",
        padding: "49px 0 60px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 56px",
          position: "relative",
        }}
      >
        {/* Header Section */}
        <header
          style={{
            display: "block",
            marginBottom: "24px",
          }}
        >
          <h1 className="mcg-page-title mcg-page-title--flow mcg-page-title--tight">
            FBI Files
          </h1>

          <nav
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
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: "bold",
                  fontSize: 14,
                  color: filter === year ? "#000000" : "#aaaaaa",
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
          </nav>
        </header>

        {/* Grid Container */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 116px)",
            gap: "11px 12px",
            width: "100%",
            marginTop: "34px",
            justifyContent: "center",
          }}
        >
          {fileItems.map((item) =>
            (() => {
              const isMatchingFilter =
                filter === "all" || item.category === filter;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
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

      {/* Gallery Modal Overlay */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "stretch" : "center",
            padding: isMobile ? "0" : "24px",
            boxSizing: "border-box",
            backdropFilter: isMobile ? "none" : "blur(5px)",
          }}
          onClick={() => setSelectedImage(null)}
        >
          {isMobile ? (
            <div
              style={{
                position: "relative",
                width: "100vw",
                height: "100dvh",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                backgroundColor: "#FFFFFF",
                borderRadius: 0,
                boxShadow: "none",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: "absolute",
                  top: isMobile ? "12px" : "24px",
                  right: isMobile ? "12px" : "24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: isMobile ? "28px" : "32px",
                  height: isMobile ? "28px" : "32px",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close gallery"
              >
                <img
                  src="/images/close.svg"
                  alt="Close"
                  style={{
                    width: isMobile ? "24px" : "28px",
                    height: isMobile ? "24px" : "28px",
                    filter: "brightness(0)",
                  }}
                />
              </button>

              <div
                style={{
                  flex: isMobile ? "0 0 auto" : "1 1 auto",
                  minHeight: isMobile ? "0" : "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "56px 20px 20px" : "64px 40px",
                  boxSizing: "border-box",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: isMobile ? "54vh" : "100%",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  width: isMobile ? "100%" : "320px",
                  height: isMobile ? "auto" : "100%",
                  flex: isMobile ? "1 1 auto" : "0 0 320px",
                  borderLeft: isMobile ? "none" : "1px solid rgba(0,0,0,0.08)",
                  borderTop: isMobile ? "1px solid rgba(0,0,0,0.08)" : "none",
                  backgroundColor: "#FFFFFF",
                  padding: isMobile ? "24px 20px 32px" : "88px 32px 32px",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    color: "rgba(0,0,0,0.45)",
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  FBI Files
                </p>
                <p
                  style={{
                    color: "#000000",
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: "22px",
                    fontWeight: 400,
                  }}
                >
                  {selectedImage.alt} ({selectedImage.category})
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                width: "min(62vw, 620px)",
                minHeight: "min(74vh, 620px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 0 0",
                boxSizing: "border-box",
                transform: "translateX(-96px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: "64px",
                  height: "64px",
                  zIndex: 3000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close gallery"
              >
                <img
                  src="/images/close.svg"
                  alt="Close"
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "block",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>

              <div
                style={{
                  width: "100%",
                  flex: "1 1 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 0,
                  padding: "8px 160px 0 0",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "68vh",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    objectFit: "contain",
                  }}
                />
              </div>
              <p
                style={{
                  color: "#FFFFFF",
                  margin: "14px 0 0 0",
                  fontSize: "16px",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {selectedImage.alt} ({selectedImage.category})
              </p>
            </div>
          )}
        </div>
      )}

      {/* Responsive Styles Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 768px) {
          header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          nav {
            margin-top: 0 !important;
          }
        }
      `,
        }}
      />
    </section>
  );
};
