import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "../../hooks/use-mobile";

export interface OverlayGallerySlide {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  link?: string;
}

interface OverlayGalleryProps {
  slides: OverlayGallerySlide[];
  initialIndex?: number;
  onClose: () => void;
  closeAriaLabel?: string;
}

export const OverlayGallery: React.FC<OverlayGalleryProps> = ({
  slides,
  onClose,
  closeAriaLabel = "Close gallery",
}) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!slides.length) return null;

  // Check if this is a single video (Congo)
  const isSingleVideo = slides.length === 1 && slides[0].type === "video";

  const overlayContent = (
    <>
      <style>{`
        .mcg-horizontal-gallery-container {
          display: flex;
          gap: ${isMobile ? "96px" : "128px"};
          padding: ${isMobile ? "24px" : "32px"};
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
          align-items: center;
        }

        .mcg-horizontal-gallery-container::-webkit-scrollbar {
          height: 10px;
        }

        .mcg-horizontal-gallery-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
        }

        .mcg-horizontal-gallery-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 5px;
        }

        .mcg-horizontal-gallery-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.6);
        }

        @media (min-width: 2560px) {
          .mcg-horizontal-gallery-container {
            gap: 200px !important;
          }
          .mcg-gallery-img {
            max-width: min(85vw, 1050px) !important;
            max-height: 78vh !important;
          }
          .mcg-gallery-caption {
            font-size: 24px !important;
            line-height: 36px !important;
            max-width: 840px !important;
          }
          .mcg-gallery-slide {
            gap: 80px !important;
          }
        }

        @media (min-width: 3440px) {
          .mcg-horizontal-gallery-container {
            gap: 256px !important;
          }
          .mcg-gallery-img {
            max-width: min(85vw, 1200px) !important;
            max-height: 80vh !important;
          }
          .mcg-gallery-caption {
            font-size: 28px !important;
            line-height: 42px !important;
            max-width: 960px !important;
          }
          .mcg-gallery-slide {
            gap: 100px !important;
          }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: isMobile ? "var(--mcg-mobile-nav-offset, 0px) 0 0 0" : 0,
          width: "100vw",
          height: isMobile
            ? "calc(100dvh - var(--mcg-mobile-nav-offset, 0px))"
            : "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          backdropFilter: isMobile ? "none" : "blur(20px)",
        }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          style={{
            position: "fixed",
            top: isMobile
              ? "calc(var(--mcg-mobile-nav-offset, 0px) + 24px)"
              : "36px",
            right: isMobile ? "12px" : "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: isMobile ? "28px" : "64px",
            height: isMobile ? "28px" : "64px",
            zIndex: 1002,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "manipulation",
          }}
          aria-label={closeAriaLabel}
        >
          <img
            src="/assets/close.svg"
            alt="Close"
            style={{
              width: isMobile ? "24px" : "28px",
              height: isMobile ? "24px" : "28px",
              filter: "brightness(0) invert(1)",
            }}
          />
        </button>

        {isSingleVideo ? (
          // Special layout for single video (Congo)
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "24px" : "48px",
              padding: isMobile ? "64px 24px 24px" : "92px 32px 32px",
            }}
          >
            <video
              src={slides[0].src}
              poster={slides[0].poster}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="mcg-gallery-img"
              style={{
                maxWidth: isMobile ? "85vw" : "min(50vw, 620px)",
                maxHeight: isMobile ? "50vh" : "68vh",
                height: "auto",
                objectFit: "contain",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            />
            {slides[0].caption && (
              <div
                style={{
                  maxWidth: isMobile ? "85vw" : "460px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.92)",
                    fontSize: isMobile ? "13px" : "15px",
                    lineHeight: isMobile ? "20px" : "24px",
                    textAlign: "left",
                  }}
                  className="mcg-gallery-caption"
                >
                  {slides[0].caption}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Standard horizontal scrolling gallery for images
          <div
            className="mcg-horizontal-gallery-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              paddingTop: isMobile ? "64px" : "92px",
              paddingBottom: isMobile ? "24px" : "32px",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={`${slide.id}-${index}`}
                className="mcg-gallery-slide"
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                  }}
                >
                  {slide.type === "video" ? (
                    <video
                      src={slide.src}
                      poster={slide.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="mcg-gallery-img"
                      style={{
                        maxWidth: isMobile ? "85vw" : "600px",
                        maxHeight: isMobile ? "50vh" : "60vh",
                        height: "auto",
                        objectFit: "contain",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                      }}
                    />
                  ) : (
                    <>
                      {slide.link ? (
                        <a
                          href={slide.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ display: "block", lineHeight: 0 }}
                        >
                          <img
                            src={slide.src}
                            alt={slide.alt}
                            className="mcg-gallery-img"
                            style={{
                              maxWidth: isMobile ? "85vw" : "600px",
                              maxHeight: isMobile ? "50vh" : "60vh",
                              height: "auto",
                              objectFit: "contain",
                              boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                              display: "block",
                            }}
                          />
                        </a>
                      ) : (
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          className="mcg-gallery-img"
                          style={{
                            maxWidth: isMobile ? "85vw" : "600px",
                            maxHeight: isMobile ? "50vh" : "60vh",
                            height: "auto",
                            objectFit: "contain",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                            display: "block",
                          }}
                        />
                      )}
                      <a
                        href="https://www.louisarmstronghouse.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open Louis Armstrong House website"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute",
                          right: "12px",
                          bottom: "12px",
                          width: isMobile ? "56px" : "76px",
                          height: isMobile ? "56px" : "76px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                      >
                        <img
                          src="/assets/logo_light.png"
                          alt=""
                          aria-hidden="true"
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </>
                  )}
                </div>

                {slide.caption && (
                  <p
                    style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.85)",
                      fontSize: isMobile ? "13px" : "15px",
                      lineHeight: isMobile ? "20px" : "24px",
                      textAlign: "left",
                      maxWidth: isMobile ? "70vw" : "450px",
                    }}
                    className="mcg-gallery-caption"
                  >
                    {slide.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return createPortal(overlayContent, document.body);
};
