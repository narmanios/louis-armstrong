import React, { useEffect, useState } from "react";
interface SectionFBIFilesProps {
  textBaseStyle: React.CSSProperties;
}
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

export const SectionFBIFiles: React.FC<SectionFBIFilesProps> = ({
  textBaseStyle,
}) => {
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
        backgroundColor: "#E9E6D9",
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
              padding: "7px 8px 8px 7px",
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
            gridTemplateColumns: "repeat(auto-fill, 116px)",
            gap: "11px 12px",
            width: "100%",
            marginTop: "34px",
          }}
        >
          {fileItems.map((item) => (
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
                opacity: filter === "all" || item.category === filter ? 1 : 0.5,
                transform:
                  filter === "all" || item.category === filter
                    ? "scale(1)"
                    : "scale(0.95)",
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
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0)")
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Modal Overlay */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: "absolute",
              top: "40px",
              right: "40px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px",
            }}
            aria-label="Close gallery"
          >
            <img
              src="images/close.svg"
              alt="Close"
              style={{
                width: "30px",
                height: "30px",
                filter: "brightness(0) invert(1)",
              }}
            />
          </button>

          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "80vh",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                objectFit: "contain",
              }}
            />
            <p
              style={{
                color: "white",
                marginTop: "20px",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              {selectedImage.alt} ({selectedImage.category})
            </p>
          </div>
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
