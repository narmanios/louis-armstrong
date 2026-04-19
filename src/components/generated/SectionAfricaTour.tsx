import React, { useEffect, useMemo, useState } from "react";
import { OverlayGallery, OverlayGallerySlide } from "./OverlayGallery";
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
  url: string;
}
interface AfricaTourJsonImage {
  id: number;
  description: string;
  image_link: string;
  url: string;
}

const africaTourJsonUrl = "/assets/data/africa-tour.json";

export const SectionAfricaTour: React.FC<SectionAfricaTourProps> = ({
  className,
  style,
}) => {
  const isMobile = useIsMobile();
  const [africaTourImageData, setAfricaTourImageData] = useState<
    GalleryImage[]
  >([]);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
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
          url: item.url,
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

  const handleOpen = (id: string) => {
    setActiveOverlay(id);
  };
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveOverlay(null);
  };
  const tourDescription =
    "In 1960 Armstrong toured Africa for several months under the auspices of the State Department.";
  const egyptDescription =
    "The final stop on Armstrong's 1960-1961 State Department-sponsored tour was Egypt, where he performed multiple concerts.";
  const congoDescription =
    "Armstrong toured the Congo during its civil war, performing in Leopoldville under a temporary truce, for 10,000 people in Katanga";
  const egyptOverlayDescription =
    "The final stop on Armstrong's 1960-1961 State Department-sponsored tour of Italy was Egypt, where Armstrong performed multiple concerts, attended parties in his honor, and posed in a series of iconic photographs with the Great Sphinx of Giza.";
  const congoOverlayDescription =
    "As part of his 1960-1961 State Department tour, Armstrong visited the wartorn Congo region in the middle of a civil war between supporters of Patrice Lumumba and Mobutu Sese Seke. A temporary truce was declared to allow Armstrong to perform in Leopoldville. Two weeks later, he performed in front of 10,000 fans in the secessionist state of Katanga, staying with President Moises Tshombe during his time there";
  const desktopMediaAspectRatio = "470 / 360";
  const mobileTourCardImageSrc = "/assets/africa.png";
  const logoLinkProps = {
    href: "https://www.louisarmstronghouse.org/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Open Louis Armstrong House website",
  } as const;
  const overlayTitle =
    activeOverlay === "tour"
      ? "Africa Tour"
      : activeOverlay === "egypt"
        ? "Cairo, Egypt"
        : "Congo";
  const overlaySlides = useMemo<OverlayGallerySlide[]>(() => {
    if (activeOverlay === "tour") {
      return africaTourImageData.map((image) => ({
        id: image.id,
        type: "image",
        src: image.src,
        alt: image.caption,
        caption: image.description,
        link: image.url,
      }));
    }

    if (activeOverlay === "egypt") {
      return [
        {
          id: "egypt",
          type: "image",
          src: "/assets/egypt.png",
          alt: "Cairo Large",
          caption: egyptOverlayDescription,
        },
      ];
    }

    if (activeOverlay === "congo") {
      return [
        {
          id: "congo",
          type: "video",
          src: "/assets/congo-footage.mp4",
          poster: "/assets/congo.png",
          alt: "Congo footage",
          caption: congoOverlayDescription,
        },
      ];
    }

    return [];
  }, [
    activeOverlay,
    africaTourImageData,
    congoOverlayDescription,
    egyptOverlayDescription,
  ]);
  return (
    <section
      className={`mcg-section text-overlay-section africa-tour-section ${className || ""}`}
      style={{
        width: isMobile ? "100%" : "100vw",
        minWidth: isMobile ? 0 : "100vw",
        minHeight: isMobile ? undefined : "100dvh",
        height: "auto",
        display: "flow-root",
        flexShrink: isMobile ? undefined : 0,
        scrollSnapAlign: isMobile ? undefined : "start",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "visible",
        fontFamily: '"Hanken Grotesk", Arial, sans-serif',
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          padding: isMobile ? "24px 20px 32px" : "0 56px 0",
          display: "flow-root",
          position: "relative",
        }}
      >
        <style>{`
          .africa-tour-image-wrap {
            position: relative;
          }

          .africa-tour-logo-link {
            position: absolute;
            right: 12px;
            bottom: 12px;
            width: 76px;
            height: 76px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
          }

          .africa-tour-logo-link img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: contain;
          }
        `}</style>

        <h1
          className="mcg-page-title mcg-page-title--flow"
          style={
            isMobile
              ? {
                  width: "calc(100% - 40px)",
                  margin: "0 auto 0",
                  color: "#000000",
                }
              : { color: "#000000" }
          }
        >
          Africa 1960-1961
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "minmax(0, 1fr)"
              : "repeat(3, minmax(0, 1fr))",
            gap: isMobile ? "32px" : "32px 40px",
            alignItems: "start",
            justifyContent: "flex-start",
            marginTop: isMobile ? "0" : "24px",
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
              width: isMobile ? "calc(100% - 56px)" : "100%",
              margin: isMobile ? "0 0 0 20px" : 0,
              display: "block",
            }}
          >
            <div>
              <div
                className="africa-tour-image-wrap"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: isMobile ? "5 / 4" : desktopMediaAspectRatio,
                  backgroundColor: "#F5F3EA",
                  padding: isMobile ? 0 : "7px 5px",
                  boxSizing: "border-box",
                  display: isMobile ? "block" : "grid",
                  gridTemplateColumns: isMobile ? undefined : "repeat(7, 1fr)",
                  gap: isMobile ? undefined : "5px",
                  marginBottom: "9px",
                  overflow: "hidden",
                  transition: "transform 0.25s ease",
                  transform:
                    hoveredCard === "tour" ? "scale(1.03)" : "scale(1)",
                  transformOrigin: "center center",
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
                <a className="africa-tour-logo-link" {...logoLinkProps}>
                  <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
                </a>
              </div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                  color: "#000000",
                  marginTop: "12px",
                }}
              >
                Africa Tour
              </span>
            </div>
            <div>
              <p
                style={{
                  fontSize: "28px",
                  lineHeight: "40px",
                  color: "#000000",
                  margin: "12px 0 0 0",
                }}
              >
                {tourDescription}
              </p>
            </div>
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
              width: isMobile ? "calc(100% - 56px)" : "100%",
              margin: isMobile ? "0 0 0 20px" : 0,
              display: "block",
            }}
          >
            <div>
              <div
                className="africa-tour-image-wrap"
                style={{
                  transition: "transform 0.25s ease",
                  transform:
                    hoveredCard === "egypt" ? "scale(1.03)" : "scale(1)",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src="/assets/egypt.png"
                  alt="Cairo"
                  style={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: isMobile ? "5 / 4" : desktopMediaAspectRatio,
                    objectFit: "cover",
                    marginBottom: "9px",
                  }}
                />
                <a className="africa-tour-logo-link" {...logoLinkProps}>
                  <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
                </a>
              </div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                  color: "#000000",
                  marginTop: "3px",
                }}
              >
                Cairo, Egypt
              </span>
            </div>
            <div>
              <p
                style={{
                  fontSize: "28px",
                  lineHeight: "40px",
                  color: "#000000",
                  margin: "12px 0 0 0",
                }}
              >
                {egyptDescription}
              </p>
            </div>
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
              width: isMobile ? "calc(100% - 56px)" : "100%",
              margin: isMobile ? "0 0 0 20px" : 0,
              display: "block",
            }}
          >
            <div>
              <div
                className="africa-tour-image-wrap"
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: isMobile ? "5 / 4" : desktopMediaAspectRatio,
                  position: "relative",
                  marginBottom: "9px",
                  transition: "transform 0.25s ease",
                  transform:
                    hoveredCard === "congo" ? "scale(1.03)" : "scale(1)",
                  transformOrigin: "center center",
                }}
              >
                <img
                  src="/assets/congo.png"
                  alt="Congo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <a className="africa-tour-logo-link" {...logoLinkProps}>
                  <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
                </a>
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
                    fontFamily: '"Hanken Grotesk", Arial, sans-serif',
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
                  display: "block",
                  fontSize: "11px",
                  fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                  color: "#000000",
                  marginTop: "3px",
                }}
              >
                Congo
              </span>
            </div>
            <div>
              <p
                style={{
                  fontSize: "28px",
                  lineHeight: "40px",
                  color: "#000000",
                  margin: "12px 0 0 0",
                }}
              >
                {congoDescription}
              </p>
            </div>
          </button>
        </div>
      </div>

      {activeOverlay ? (
        <OverlayGallery
          slides={overlaySlides}
          onClose={() => setActiveOverlay(null)}
          desktopWidth={
            activeOverlay === "tour" ? "min(76vw, 980px)" : "min(62vw, 620px)"
          }
          mobileCaptionMaxWidth="100%"
          desktopCaptionMaxWidth={activeOverlay === "tour" ? "560px" : "460px"}
          bottomLabel={overlayTitle}
          closeAriaLabel="Close overlay"
        />
      ) : null}
    </section>
  );
};
