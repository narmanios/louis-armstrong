import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";

interface SectionAfricaTourProps {
  className?: string;
  style?: React.CSSProperties;
}
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

const africaTourJsonUrl = "/images/data/africa-tour.json";

export const SectionAfricaTour: React.FC<SectionAfricaTourProps> = ({
  className,
  style,
}) => {
  const isMobile = useIsMobile();
  const [africaTourImageData, setAfricaTourImageData] = useState<
    GalleryImage[]
  >([]);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [tourActiveIndex, setTourActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const tourGalleryRef = useRef<HTMLDivElement>(null);
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
    setTourActiveIndex(0);
  };
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveOverlay(null);
  };
  const loremText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper erat tortor, at accumsan sapien molestie et. Sed hendrerit velit vel neque molestie eleifend. Ut sodales lorem vel mauris malesuada maximus.";
  const descriptionText =
    "Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here. Description of image goes here.";
  const activeTourImage =
    africaTourImageData[tourActiveIndex] ?? africaTourImageData[0] ?? null;
  const representativeTourImage = africaTourImageData[0] ?? null;
  const mobileTourCardImageSrc = "/images/africa.png";
  const desktopCardWidth = "min(280px, calc((100vw - 320px) / 3))";
  const desktopTourCardWidth = "min(280px, calc((100vw - 320px) / 3))";
  const desktopCardHeight = "min(214px, calc((100vw - 320px) / 3 * 0.766))";
  return (
    <section
      className={`mcg-section text-overlay-section ${className || ""}`}
      style={{
        width: isMobile ? "100%" : "100vw",
        minWidth: isMobile ? 0 : "100vw",
        height: isMobile ? "auto" : "800px",
        flexShrink: isMobile ? undefined : 0,
        scrollSnapAlign: isMobile ? undefined : "start",
        backgroundColor: "#000000",
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
        <h1
          className="mcg-page-title mcg-page-title--flow mcg-page-title--spaced"
          style={
            isMobile
              ? {
                  width: "calc(100% - 40px)",
                  margin: "0 auto 24px",
                }
              : undefined
          }
        >
          Africa 1960-1961
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "32px" : "56px",
            alignItems: "flex-start",
            justifyContent: isMobile ? "center" : "flex-start",
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
              width: isMobile ? "calc(100% - 56px)" : desktopTourCardWidth,
              margin: isMobile ? "0 0 0 20px" : 0,
              transition: "transform 0.25s ease",
              transform: hoveredCard === "tour" ? "scale(1.03)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: isMobile ? "auto" : desktopCardHeight,
                aspectRatio: isMobile ? "5 / 4" : undefined,
                backgroundColor: "#F5F3EA",
                padding: isMobile ? 0 : "7px 5px",
                boxSizing: "border-box",
                display: isMobile ? "block" : "grid",
                gridTemplateColumns: isMobile ? undefined : "repeat(7, 1fr)",
                gap: isMobile ? undefined : "5px",
                marginBottom: "9px",
                overflow: "hidden",
              }}
            >
              {isMobile ? (
                <img
                  src={mobileTourCardImageSrc}
                  alt="Africa Tour"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                africaTourImageData.slice(0, 28).map((img) => (
                  <img
                    key={img.id}
                    src={img.src}
                    alt=""
                    style={{
                      width: "100%",
                      aspectRatio: "3 / 4",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                ))
              )}
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
            {isMobile ? (
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "#010000",
                  margin: "12px 0 0 0",
                }}
              >
                {loremText}
              </p>
            ) : null}
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
              width: isMobile ? "calc(100% - 56px)" : desktopCardWidth,
              margin: isMobile ? "0 0 0 20px" : 0,
              transition: "transform 0.25s ease",
              transform: hoveredCard === "egypt" ? "scale(1.03)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <img
              src="/images/egypt.png"
              alt="Cairo"
              style={{
                width: "100%",
                height: isMobile ? "auto" : desktopCardHeight,
                aspectRatio: isMobile ? "5 / 4" : undefined,
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
            {isMobile ? (
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "#010000",
                  margin: "12px 0 0 0",
                }}
              >
                {loremText}
              </p>
            ) : null}
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
              width: isMobile ? "calc(100% - 56px)" : desktopCardWidth,
              margin: isMobile ? "0 0 0 20px" : 0,
              transition: "transform 0.25s ease",
              transform: hoveredCard === "congo" ? "scale(1.03)" : "scale(1)",
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: isMobile ? "auto" : desktopCardHeight,
                aspectRatio: isMobile ? "5 / 4" : undefined,
                position: "relative",
                marginBottom: "9px",
              }}
            >
              <img
                src="/images/congo.png"
                alt="Congo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
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
            {isMobile ? (
              <p
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "#010000",
                  margin: "12px 0 0 0",
                }}
              >
                {loremText}
              </p>
            ) : null}
          </button>
        </div>

        {!isMobile ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "105px",
              width: "100%",
            }}
          >
            <p
              style={{
                width: "291px",
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
                width: "291px",
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
                width: "291px",
                fontSize: "12px",
                lineHeight: "18px",
                color: "#010000",
                margin: 0,
              }}
            >
              {loremText}
            </p>
          </div>
        ) : null}
      </div>

      {/* ── OVERLAY ── */}
      {activeOverlay && (
        <div
          style={{
            position: "fixed",
            inset: isMobile ? "var(--mcg-mobile-nav-offset, 0px) 0 0 0" : 0,
            width: "100vw",
            height: isMobile
              ? "calc(100dvh - var(--mcg-mobile-nav-offset, 0px))"
              : "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "stretch" : "center",
            padding: isMobile ? "0" : "24px",
            boxSizing: "border-box",
            backdropFilter: isMobile ? "none" : "blur(5px)",
          }}
          onClick={() => setActiveOverlay(null)}
        >
          {isMobile ? (
            <div
              style={{
                position: "relative",
                width: "100vw",
                height: "calc(100dvh - var(--mcg-mobile-nav-offset, 0px))",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                backgroundColor: "#000000",
                borderRadius: 0,
                boxShadow: "none",
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "thin",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                style={{
                  position: "fixed",
                  top: "calc(var(--mcg-mobile-nav-offset, 0px) + 12px)",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: "28px",
                  height: "28px",
                  zIndex: 1002,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "manipulation",
                }}
                aria-label="Close overlay"
              >
                <img
                  src="/images/close.svg"
                  alt="Close"
                  style={{
                    width: "24px",
                    height: "24px",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>

              <div
                style={{
                  flex: "0 0 auto",
                  minHeight: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "56px 20px 20px",
                  boxSizing: "border-box",
                  backgroundColor: "#000000",
                }}
              >
                {activeOverlay === "tour" ? (
                  <div
                    ref={tourGalleryRef}
                    onScroll={(event) => {
                      const target = event.currentTarget;
                      const index = Math.round(
                        target.scrollLeft / target.clientWidth,
                      );
                      setTourActiveIndex(index);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                      scrollbarWidth: "none",
                    }}
                  >
                    {africaTourImageData.map((img) => (
                      <div
                        key={img.id}
                        style={{
                          flex: "0 0 100%",
                          scrollSnapAlign: "start",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          style={{
                            width: "100%",
                            maxHeight: "54vh",
                            objectFit: "contain",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                            display: "block",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : activeOverlay === "egypt" ? (
                  <img
                    src="/images/egypt.png"
                    alt="Cairo Large"
                    style={{
                      width: "100%",
                      maxHeight: "54vh",
                      objectFit: "contain",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    }}
                  />
                ) : (
                  <video
                    src="/images/congo-footage.mp4"
                    poster="/images/congo.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{
                      width: "100%",
                      maxHeight: "54vh",
                      objectFit: "contain",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                    width: "100%",
                    flex: "1 1 auto",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: "#000000",
                    padding: "24px 20px 32px",
                    boxSizing: "border-box",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 12px 0",
                      fontSize: "12px",
                      fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeOverlay === "tour"
                    ? "Africa Tour"
                    : activeOverlay === "egypt"
                      ? "Cairo, Egypt"
                      : "Congo"}
                </p>
                  <p
                    style={{
                      color: "#FFFFFF",
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: "22px",
                    fontWeight: 400,
                  }}
                >
                  {activeOverlay === "tour"
                    ? (activeTourImage?.description ??
                      "Scroll horizontally through the Africa Tour gallery.")
                    : descriptionText}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "relative",
                width:
                  activeOverlay === "tour"
                    ? "min(76vw, 980px)"
                    : "min(62vw, 620px)",
                minHeight: "min(74vh, 620px)",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 0 0",
                boxSizing: "border-box",
                transform: "translateX(-128px)",
                overflowY: "auto",
                overflowX: "hidden",
                scrollbarWidth: "thin",
                backgroundColor: "#000000",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "-28px",
                  right: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: "72px",
                  height: "72px",
                  zIndex: 3000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close overlay"
              >
                <img
                  src="/images/close.svg"
                  alt="Close"
                  style={{
                    width: "32px",
                    height: "32px",
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
                  padding: "8px 0 0",
                  boxSizing: "border-box",
                }}
              >
                {activeOverlay === "tour" ? (
                  <div
                    ref={tourGalleryRef}
                    onScroll={(event) => {
                      const target = event.currentTarget;
                      const index = Math.round(
                        target.scrollLeft / target.clientWidth,
                      );
                      setTourActiveIndex(index);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      overflowX: "auto",
                      scrollSnapType: "x mandatory",
                      scrollbarWidth: "none",
                    }}
                  >
                    {africaTourImageData.map((img) => (
                      <div
                        key={img.id}
                        style={{
                          flex: "0 0 100%",
                          scrollSnapAlign: "start",
                          display: "flex",
                          justifyContent: "center",
                          padding: "0 12px",
                          boxSizing: "border-box",
                        }}
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          style={{
                            width: "100%",
                            maxHeight: "68vh",
                            objectFit: "contain",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                            display: "block",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : activeOverlay === "egypt" ? (
                  <img
                    src="/images/egypt.png"
                    alt="Cairo Large"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "68vh",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <video
                    src="/images/congo-footage.mp4"
                    poster="/images/congo.png"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "68vh",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
              <p
                style={{
                  color: "#FFFFFF",
                  margin: "14px 0 0 0",
                  fontSize: "14px",
                  fontWeight: 400,
                  textAlign: "left",
                  lineHeight: "24px",
                  maxWidth: activeOverlay === "tour" ? "540px" : "420px",
                }}
              >
                {activeOverlay === "tour"
                  ? (activeTourImage?.description ??
                    "Scroll horizontally through the Africa Tour gallery.")
                  : descriptionText}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
