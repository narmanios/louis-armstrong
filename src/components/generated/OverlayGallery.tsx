import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";

export interface OverlayGallerySlide {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
}

interface OverlayGalleryProps {
  slides: OverlayGallerySlide[];
  initialIndex?: number;
  onClose: () => void;
  desktopWidth?: string;
  desktopMinHeight?: string;
  mobileMediaMinHeight?: string;
  desktopMediaMinHeight?: string;
  mobileCaptionMaxWidth?: string;
  desktopCaptionMaxWidth?: string;
  bottomLabel?: string;
  mobilePanelLabel?: string;
  closeAriaLabel?: string;
}

export const OverlayGallery: React.FC<OverlayGalleryProps> = ({
  slides,
  initialIndex = 0,
  onClose,
  desktopWidth = "min(62vw, 620px)",
  desktopMinHeight = "min(74vh, 620px)",
  mobileMediaMinHeight = "54vh",
  desktopMediaMinHeight = "68vh",
  mobileCaptionMaxWidth = "100%",
  desktopCaptionMaxWidth = "460px",
  bottomLabel,
  mobilePanelLabel,
  closeAriaLabel = "Close gallery",
}) => {
  const isMobile = useIsMobile();
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, Math.min(initialIndex, slides.length - 1)),
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const nextIndex = Math.max(0, Math.min(initialIndex, slides.length - 1));
    setActiveIndex(nextIndex);

    requestAnimationFrame(() => {
      const gallery = galleryRef.current;
      if (!gallery) return;

      gallery.scrollTo({
        left: nextIndex * gallery.clientWidth,
        behavior: "auto",
      });
    });
  }, [initialIndex, slides.length]);

  const activeSlide = slides[activeIndex] ?? slides[0] ?? null;
  const captionText = activeSlide?.caption?.trim() ?? "";

  const sharedMediaStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "auto",
      height: "auto",
      maxWidth: "100%",
      maxHeight: isMobile ? mobileMediaMinHeight : desktopMediaMinHeight,
      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      objectFit: "contain",
      display: "block",
    }),
    [desktopMediaMinHeight, isMobile, mobileMediaMinHeight],
  );

  if (!slides.length) return null;

  return (
    <>
      <style>{`
        .mcg-overlay-gallery-scroll {
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.58) rgba(255, 255, 255, 0.12);
        }

        .mcg-overlay-gallery-scroll::-webkit-scrollbar {
          width: 10px;
        }

        .mcg-overlay-gallery-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.12);
        }

        .mcg-overlay-gallery-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.58);
          border-radius: 999px;
          border: 2px solid rgba(0, 0, 0, 0.25);
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1000,
          display: "flex",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: isMobile ? "stretch" : "center",
          padding: isMobile ? "0" : "24px",
          boxSizing: "border-box",
          backdropFilter: isMobile ? "none" : "blur(5px)",
        }}
        onClick={onClose}
      >
        {isMobile ? (
          <div
            className="mcg-overlay-gallery-scroll"
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
              overflowX: "hidden",
              overflowY: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              style={{
                position: "fixed",
                top: "calc(var(--mcg-mobile-nav-offset, 0px) + 24px)",
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
              aria-label={closeAriaLabel}
            >
              <img
                src="/assets/close.svg"
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "56px 20px 20px",
                boxSizing: "border-box",
                backgroundColor: "#000000",
                gap: "18px",
              }}
            >
              <div
                ref={galleryRef}
                onScroll={(event) => {
                  const target = event.currentTarget;
                  setActiveIndex(
                    Math.round(target.scrollLeft / target.clientWidth),
                  );
                }}
                style={{
                  width: "100%",
                  minHeight: mobileMediaMinHeight,
                  display: "flex",
                  overflowX: slides.length > 1 ? "auto" : "hidden",
                  scrollSnapType: slides.length > 1 ? "x mandatory" : undefined,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    style={{
                      flex: "0 0 100%",
                      scrollSnapAlign: "start",
                      display: "flex",
                      justifyContent: "center",
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
                        style={sharedMediaStyle}
                      />
                    ) : (
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        style={sharedMediaStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p
                style={{
                  width: "100%",
                  maxWidth: mobileCaptionMaxWidth,
                  margin: 0,
                  minHeight: "38px",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "13px",
                  lineHeight: "19px",
                  textAlign: "center",
                  visibility: captionText ? "visible" : "hidden",
                }}
              >
                {captionText || " "}
              </p>
              {bottomLabel ? (
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {bottomLabel}
                </p>
              ) : null}
            </div>

            {mobilePanelLabel ? (
              <div
                style={{
                  width: "100%",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "#000000",
                  padding: "24px 20px 32px",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    margin: 0,
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {mobilePanelLabel}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className="mcg-overlay-gallery-scroll"
            style={{
              position: "relative",
              width: desktopWidth,
              minHeight: desktopMinHeight,
              maxHeight: "calc(100vh - 48px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 0 0",
              boxSizing: "border-box",
              overflowX: "hidden",
              overflowY: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              style={{
                position: "fixed",
                top: "36px",
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
              aria-label={closeAriaLabel}
            >
              <img
                src="/assets/close.svg"
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 0,
                padding: "8px 32px 0",
                boxSizing: "border-box",
                gap: "18px",
              }}
            >
              <div
                ref={galleryRef}
                onScroll={(event) => {
                  const target = event.currentTarget;
                  setActiveIndex(
                    Math.round(target.scrollLeft / target.clientWidth),
                  );
                }}
                style={{
                  width: "100%",
                  minHeight: desktopMediaMinHeight,
                  display: "flex",
                  overflowX: slides.length > 1 ? "auto" : "hidden",
                  scrollSnapType: slides.length > 1 ? "x mandatory" : undefined,
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {slides.map((slide) => (
                  <div
                    key={slide.id}
                    style={{
                      flex: "0 0 100%",
                      scrollSnapAlign: "start",
                      display: "flex",
                      justifyContent: "center",
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
                        style={sharedMediaStyle}
                      />
                    ) : (
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        style={sharedMediaStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p
                style={{
                  width: "100%",
                  maxWidth: desktopCaptionMaxWidth,
                  margin: 0,
                  minHeight: "42px",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "14px",
                  lineHeight: "21px",
                  textAlign: "center",
                  visibility: captionText ? "visible" : "hidden",
                }}
              >
                {captionText || " "}
              </p>
              {bottomLabel ? (
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {bottomLabel}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
