import React, { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/use-mobile";

interface SectionAfricaTourProps {
  textBaseStyle: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}
// interface TextOverlaySectionProps {
//   className?: string;
//   style?: React.CSSProperties;
// }
interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  description: string;
}
interface AfricaTourJsonImage {
  id: number;
  description: string;
  image_link: string;
}

const africaTourJsonUrl = new URL(
  "../../../data/africa-tour.json",
  import.meta.url,
).href;

export const SectionAfricaTour: React.FC<SectionAfricaTourProps> = ({
  className,
  style,
}) => {
  const isMobile = useIsMobile();
  const [africaTourImageData, setAfricaTourImageData] = useState<
    GalleryImage[]
  >([]);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const loadAfricaTourImages = async () => {
      try {
        const response = await fetch(africaTourJsonUrl);
        if (!response.ok) {
          throw new Error("Failed to load Africa tour JSON data.");
        }

        const data: AfricaTourJsonImage[] = await response.json();
        if (!isMounted) return;

        const normalized = data.map((item) => ({
          id: String(item.id),
          src: item.image_link.startsWith("/")
            ? item.image_link
            : `/${item.image_link}`,
          caption: `Image ${item.id}`,
          description: item.description,
        }));

        setAfricaTourImageData(normalized);
      } catch {
        if (isMounted) {
          setAfricaTourImageData([]);
        }
      }
    };

    loadAfricaTourImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeOverlay]);
  const handleOpen = (id: string) => {
    setActiveOverlay(id);
    setSelectedImageId(null);
  };
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveOverlay(null);
    setSelectedImageId(null);
  };
  const handleThumbnailClick = (e: React.MouseEvent, imgId: string) => {
    e.stopPropagation();
    setSelectedImageId((prev) => (prev === imgId ? null : imgId));
  };
  const handleDismissSelected = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.dismiss === "true") {
      setSelectedImageId(null);
    }
  };
  const selectedImage =
    africaTourImageData.find((img) => img.id === selectedImageId) ?? null;
  const loremText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper erat tortor, at accumsan sapien molestie et. Sed hendrerit velit vel neque molestie eleifend. Ut sodales lorem vel mauris malesuada maximus.";
  const descriptionText =
    "Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here.";
  return (
    <section
      className={`mcg-section text-overlay-section ${className || ""}`}
      style={{
        width: isMobile ? "100%" : "100vw",
        minWidth: isMobile ? 0 : "100vw",
        height: isMobile ? "auto" : "800px",
        flexShrink: isMobile ? undefined : 0,
        scrollSnapAlign: isMobile ? undefined : "start",
        backgroundColor: "#F5F3EA",
        position: "relative",
        overflow: isMobile ? "visible" : "hidden",
        fontFamily: '"Helvetica Neue", sans-serif',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: isMobile ? "100%" : "1280px",
          margin: "0 auto",
          padding: isMobile ? "24px 20px 32px" : "49px 56px",
          position: "relative",
        }}
      >
        <h1 className="mcg-page-title mcg-page-title--flow mcg-page-title--spaced">
          Africa 1960-1961
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "20px" : "56px",
            alignItems: "flex-start",
            marginBottom: isMobile ? "20px" : "27px",
          }}
        >
          {/* Card 1: Africa Tour */}
          <button
            onClick={() => handleOpen("tour")}
            onMouseEnter={() => setHoveredCard("tour")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              width: isMobile ? "100%" : "336px",
              transition: "transform 0.25s ease",
              transform: hoveredCard === "tour" ? "scale(1.03)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: isMobile ? "100%" : "336.39px",
                height: isMobile ? "auto" : "252.13px",
                backgroundColor: "#F5F3EA",
                padding: "7px 5px",
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(4, 1fr)"
                  : "repeat(7, 42px)",
                gap: "5px",
                marginBottom: "9px",
              }}
            >
              {africaTourImageData.slice(0, 28).map((img) => (
                <img
                  key={img.id}
                  src={img.src}
                  alt=""
                  style={{
                    width: isMobile ? "100%" : "42px",
                    height: "56px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: '"Helvetica Neue", sans-serif',
                color: "#000000",
              }}
            >
              Africa Tour
            </span>
          </button>

          {/* Card 2: Cairo */}
          <button
            onClick={() => handleOpen("egypt")}
            onMouseEnter={() => setHoveredCard("egypt")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              width: isMobile ? "100%" : "329px",
              transition: "transform 0.25s ease",
              transform: hoveredCard === "egypt" ? "scale(1.03)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <img
              src="images/egypt.png"
              alt="Cairo"
              style={{
                width: "100%",
                height: isMobile ? "220px" : "252.12px",
                objectFit: "cover",
                marginBottom: "9px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontFamily: '"Helvetica Neue", sans-serif',
                color: "#000000",
              }}
            >
              Cairo, Egypt
            </span>
          </button>

          {/* Card 3: Congo */}
          <button
            onClick={() => handleOpen("congo")}
            onMouseEnter={() => setHoveredCard("congo")}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              width: isMobile ? "100%" : "329px",
              transition: "transform 0.25s ease",
              transform: hoveredCard === "congo" ? "scale(1.03)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: isMobile ? "220px" : "252.12px",
                position: "relative",
                marginBottom: "9px",
              }}
            >
              <img
                src="images/congo.png"
                alt="Congo"
                style={{
                  width: "100%",
                  height: isMobile ? "220px" : "252.12px",
                  objectFit: "cover",
                }}
              />
              {/* <img
                src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/fb993a99-813b-4492-86c4-7edf45ccaf7d.svg"
                alt="Map Vector"
                style={{
                  position: 'absolute',
                  left: '54.65px',
                  top: '34px',
                  width: '182px',
                  height: '201px',
                }}
              /> */}
              <div
                style={{
                  position: "absolute",
                  left: "185.65px",
                  top: "205px",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#F5F3EA",
                  borderRadius: "50%",
                  opacity: hoveredCard === "congo" ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "90.65px",
                  top: "193px",
                  fontSize: "12px",
                  fontFamily: '"Helvetica Neue", sans-serif',
                  fontWeight: 900,
                  color: "#F5F3EA",
                  opacity: hoveredCard === "congo" ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                Shinkolobwe Mine
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: '"Helvetica Neue", sans-serif',
                color: "#000000",
              }}
            >
              Congo
            </span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "12px" : "105px",
            width: "100%",
          }}
        >
          <p
            style={{
              width: isMobile ? "100%" : "291px",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#010000",
              margin: 0,
            }}
          >
            {loremText}
          </p>
          <p
            style={{
              width: isMobile ? "100%" : "291px",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#010000",
              margin: 0,
            }}
          >
            {loremText}
          </p>
          <p
            style={{
              width: isMobile ? "100%" : "291px",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#010000",
              margin: 0,
            }}
          >
            {loremText}
          </p>
        </div>
      </div>

      {/* ── OVERLAY ── */}
      {activeOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#FFFFFF",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Close button — moved down slightly so it's fully visible */}
          <button
            onClick={handleClose}
            style={{
              position: "fixed",
              right: "32px",
              top: "48px",
              background: "none",
              border: "none",
              cursor: "pointer",
              zIndex: 1002,
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            aria-label="Close overlay"
          >
            <img
              src="images/close.svg"
              alt="Close"
              style={{
                width: "30px",
                height: "30px",
                opacity: 0.7,
              }}
            />
          </button>
          <div
            style={{
              width: "1220px",
              height: "740px",
              display: "flex",
              position: "relative",
            }}
          >
            {/* Left panel */}
            <div
              style={{
                width: "812px",
                height: "100%",
                backgroundColor: "rgba(0, 39, 104, 1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  position: "absolute",
                  left: "40px",
                  top: "42px",
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontFamily: '"Helvetica Neue", sans-serif',
                  fontWeight: 700,
                  margin: 0,
                  zIndex: 2,
                }}
              >
                {activeOverlay === "tour" && "Africa Tour"}
                {activeOverlay === "egypt" && "Cairo, Egypt"}
                {activeOverlay === "congo" && "Congo"}
              </h2>

              {/* Africa Tour gallery */}
              {activeOverlay === "tour" && (
                <div
                  data-dismiss="true"
                  onClick={handleDismissSelected}
                  style={{
                    position: "absolute",
                    left: "52px",
                    top: "100px",
                    width: "712px",
                    bottom: "20px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.25) transparent",
                  }}
                >
                  {/* Scrollable thumbnail grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: "6px",
                      paddingBottom: "16px",
                    }}
                  >
                    {africaTourImageData.map((img) => (
                      <button
                        key={img.id}
                        onClick={(e) => handleThumbnailClick(e, img.id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          position: "relative",
                          opacity:
                            selectedImageId && selectedImageId !== img.id
                              ? 0.35
                              : 1,
                          transition: "opacity 0.25s ease, transform 0.2s ease",
                          transform:
                            selectedImageId === img.id
                              ? "scale(1.04)"
                              : "scale(1)",
                          outline:
                            selectedImageId === img.id
                              ? "2px solid rgba(255,255,255,0.9)"
                              : "none",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          style={{
                            width: "100%",
                            height: "90px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeOverlay === "egypt" && (
                <div
                  style={{
                    position: "absolute",
                    left: "52px",
                    top: "129px",
                    width: "560px",
                    height: "530px",
                  }}
                >
                  <img
                    src="images/egypt.png"
                    alt="Cairo Large"
                    style={{
                      width: "560px",
                      height: "530px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {activeOverlay === "congo" && (
                <div
                  style={{
                    position: "absolute",
                    left: "52px",
                    top: "129px",
                    width: "560px",
                    height: "530px",
                  }}
                >
                  <video
                    src="/images/congo-footage.mp4"
                    poster="/images/congo.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{
                      width: "560px",
                      height: "530px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {/* ── Lightbox: expanded image centered over the greyed grid ── */}
              {activeOverlay === "tour" && selectedImage && (
                <div
                  data-dismiss="true"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).dataset.dismiss === "true")
                      setSelectedImageId(null);
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      pointerEvents: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "60px",
                    }}
                  >
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.caption}
                      style={{
                        maxWidth: "380px",
                        maxHeight: "520px",
                        objectFit: "contain",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.55)",
                        display: "block",
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "11px",
                        fontFamily: '"Helvetica Neue", sans-serif',
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {selectedImage.id}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel */}
            <div
              style={{
                width: "406px",
                height: "100%",
                backgroundColor: "rgba(3, 66, 172, 1)",
                padding: "124px 64px 0 65px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {activeOverlay === "tour" && selectedImage ? (
                <div
                  style={{
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "12px",
                      fontFamily: '"Helvetica Neue", sans-serif',
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      margin: "0 0 12px 0",
                    }}
                  >
                    Africa Tour
                  </p>
                  <h3
                    style={{
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontFamily: '"Helvetica Neue", sans-serif',
                      fontWeight: 400,
                      margin: 0,
                      lineHeight: "22px",
                    }}
                  >
                    {selectedImage.description}
                  </h3>
                  <button
                    onClick={() => setSelectedImageId(null)}
                    style={{
                      marginTop: "28px",
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.35)",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      fontFamily: '"Helvetica Neue", sans-serif',
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "8px 16px",
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                  >
                    ← Back to gallery
                  </button>
                </div>
              ) : (
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontFamily: '"Helvetica Neue", sans-serif',
                    lineHeight: "22px",
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  {activeOverlay === "tour"
                    ? "Select any photograph from the gallery to read its caption and field notes."
                    : descriptionText}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
