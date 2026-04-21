import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  totalWidth,
  timelineHeight,
  timelineTopPad,
  timelineLineSpacing,
  mobileTimelineHeight,
  roleLines,
  lyricLabels,
  rawLyrics,
} from "./TimelineShared";
import "./TimelineBar.css";

// Pale grey for all 5 lines
const lineDefaultColor = "rgb(0, 0, 0)";
const lineDefaultOpacity = 0.7;
const lineStrokeWidth = 1;
const roleLineStartOffset = 40;
const lyricLabelStartOffset = 60;
const desktopTimelineRightGutter = 40;
const mobileTimelineLeftGutter = 18;
const mobileTimelineRightGutter = 18;
const lyricHoverBackground = "#ffffff";
const mobileLyricLetterSpacing = 0.03;
const desktopLyricLetterSpacing = 0.05;
const scrollbarHeight = 18;
const mobileScrollbarThumbBoost = 8;
const desktopScrollbarThumbBoost = 20;

// Musical font for lyrics
const lyricFont = "Georgia, 'Times New Roman', serif";

function estimateLyricWidth(
  text: string,
  fontSizePx: number,
  letterSpacingEm: number,
): number {
  const averageGlyphWidth = fontSizePx * 0.56;
  const letterSpacingPx = fontSizePx * letterSpacingEm;
  return (
    text.length * averageGlyphWidth +
    Math.max(text.length - 1, 0) * letterSpacingPx
  );
}

export function TimelineBar({
  onDotClick: _onDotClick,
  isMobile,
  placement = "fixed",
}: {
  onDotClick: (idx: number) => void;
  isMobile: boolean;
  placement?: "fixed" | "section";
}) {
  const [hoveredLyricId, setHoveredLyricId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({
    left: 0,
    viewportWidth: 1,
    contentWidth: totalWidth,
  });
  const [isDraggingScrollbar, setIsDraggingScrollbar] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollbarTrackRef = useRef<HTMLDivElement>(null);
  const lyricFontVar = { "--tl-lyric-font": lyricFont } as React.CSSProperties;

  // Play audio when sound is enabled
  const playAudio = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Ignore autoplay failures; user interaction may be required by browser.
          });
        }
      } catch (error) {
        // Ignore runtime audio errors to keep hover interactions resilient.
      }
    }
  }, [soundEnabled]);

  // Stop audio when not hovering (optionally reset to beginning)
  const stopAudio = useCallback((shouldReset = false) => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (shouldReset) {
        audioRef.current.currentTime = 0;
      }
    }
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateMetrics = () => {
      setScrollMetrics({
        left: el.scrollLeft,
        viewportWidth: el.clientWidth,
        contentWidth: el.scrollWidth,
      });
    };

    updateMetrics();
    el.addEventListener("scroll", updateMetrics, { passive: true });
    window.addEventListener("resize", updateMetrics);
    return () => {
      el.removeEventListener("scroll", updateMetrics);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [isMobile, placement]);

  const handleScrollbarTrackClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 0);
      el.scrollTo({
        left: ratio * maxScroll,
        behavior: "smooth",
      });
    },
    [],
  );

  const handleScrollSurfaceWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;

      const dominantDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 0);

      if (maxScroll <= 0 || dominantDelta === 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const nextLeft = Math.min(
        Math.max(el.scrollLeft + dominantDelta * 1.35, 0),
        maxScroll,
      );

      el.scrollLeft = nextLeft;
    },
    [],
  );

  const handleScrollbarThumbMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDraggingScrollbar(true);
    },
    [],
  );

  const handleScrollbarThumbTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setIsDraggingScrollbar(true);
    },
    [],
  );

  useEffect(() => {
    if (!isDraggingScrollbar) return;

    // Prevent text selection while dragging
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.body.style.cursor = "grabbing";

    const handleMouseMove = (event: MouseEvent) => {
      const el = scrollRef.current;
      const track = scrollbarTrackRef.current;
      if (!el || !track) return;

      const rect = track.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 0);
      el.scrollLeft = Math.max(0, Math.min(ratio * maxScroll, maxScroll));
    };

    const handleTouchMove = (event: TouchEvent) => {
      const el = scrollRef.current;
      const track = scrollbarTrackRef.current;
      if (!el || !track || event.touches.length === 0) return;

      const rect = track.getBoundingClientRect();
      const ratio = (event.touches[0].clientX - rect.left) / rect.width;
      const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 0);
      el.scrollLeft = Math.max(0, Math.min(ratio * maxScroll, maxScroll));
    };

    const handleMouseUp = () => {
      setIsDraggingScrollbar(false);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.cursor = "";
    };

    const handleTouchEnd = () => {
      setIsDraggingScrollbar(false);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDraggingScrollbar]);

  const renderScrollBar = () => {
    const { left, viewportWidth, contentWidth } = scrollMetrics;
    const maxScroll = Math.max(contentWidth - viewportWidth, 0);
    const baseThumbWidthPercent = (viewportWidth / contentWidth) * 100;
    const boostedThumbWidthPercent =
      baseThumbWidthPercent +
      (isMobile ? mobileScrollbarThumbBoost : desktopScrollbarThumbBoost);
    const thumbWidthPercent = Math.min(
      Math.max(boostedThumbWidthPercent, isMobile ? 18 : 22),
      100,
    );
    const maxThumbLeftPercent = Math.max(100 - thumbWidthPercent, 0);
    const thumbLeftPercent =
      maxScroll > 0 ? (left / maxScroll) * maxThumbLeftPercent : 0;

    return (
      <div className="tl-custom-scrollbar" aria-hidden="true">
        <div
          ref={scrollbarTrackRef}
          className="tl-custom-scrollbar-track"
          onClick={handleScrollbarTrackClick}
        >
          <div
            className="tl-custom-scrollbar-thumb"
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${thumbLeftPercent}%`,
              cursor: isDraggingScrollbar ? "grabbing" : "grab",
            }}
            onMouseDown={handleScrollbarThumbMouseDown}
            onTouchStart={handleScrollbarThumbTouchStart}
          />
        </div>
      </div>
    );
  };

  const renderLyricLabels = (isMobileView: boolean) => {
    const yOffset = isMobileView ? 4 : 2;
    const letterSpacingEm = isMobileView
      ? mobileLyricLetterSpacing
      : desktopLyricLetterSpacing;
    const letterSpacing = `${letterSpacingEm}em`;
    const hoveredIndex = hoveredLyricId
      ? lyricLabels.findIndex((l) => l.id === hoveredLyricId)
      : -1;
    const hoveredPhraseGroup =
      hoveredIndex >= 0 ? rawLyrics[hoveredIndex].phraseGroup : -1;

    return lyricLabels.map((lyr, lyrIndex) => {
      const lineY = timelineTopPad + lyr.lineIndex * timelineLineSpacing;
      const isHovered = hoveredLyricId === lyr.id;
      const isInSamePhrase =
        hoveredPhraseGroup >= 0 &&
        rawLyrics[lyrIndex].phraseGroup === hoveredPhraseGroup;
      const isActive = isHovered || isInSamePhrase;
      const fontSize = isActive ? 13 : 9;
      const fontColor = isActive ? "#000000" : "#000000";
      const textX = lyr.x + lyricLabelStartOffset;
      const textWidth = estimateLyricWidth(lyr.text, fontSize, letterSpacingEm);
      const backgroundHeight = fontSize + 6;
      const backgroundY = lineY + yOffset - fontSize + 1 - 3;

      return (
        <g
          key={lyr.id}
          onMouseEnter={() => {
            setHoveredLyricId(lyr.id);
            playAudio();
          }}
          onMouseLeave={() => {
            setHoveredLyricId(null);
            stopAudio();
          }}
          onTouchStart={
            isMobileView
              ? () => {
                  setHoveredLyricId(lyr.id);
                  playAudio();
                }
              : undefined
          }
          onTouchEnd={
            isMobileView
              ? () => {
                  setHoveredLyricId(null);
                  stopAudio();
                }
              : undefined
          }
        >
          <rect
            x={textX - 6}
            y={backgroundY}
            width={textWidth + 12}
            height={backgroundHeight}
            rx={backgroundHeight / 2}
            fill={lyricHoverBackground}
          />
          <text
            x={textX}
            y={lineY + yOffset}
            className={`tl-lyric ${isMobileView ? "is-mobile" : "is-desktop"} ${isActive ? "is-active" : "is-idle"}`}
            style={
              {
                "--tl-lyric-color": fontColor,
                "--tl-lyric-size": `${fontSize}px`,
                letterSpacing,
              } as React.CSSProperties
            }
          >
            {lyr.text}
          </text>
        </g>
      );
    });
  };

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (isMobile) {
    const headerH = 32;
    const svgH = mobileTimelineHeight - headerH - scrollbarHeight;
    return (
      <>
        <div
          className={`tl-mobile-root${placement === "section" ? " is-section" : ""}`}
          style={{ height: mobileTimelineHeight, ...lyricFontVar }}
        >
          <audio
            ref={audioRef}
            src="/assets/audio/the-real-ambassadors.mp3"
            preload="auto"
            crossOrigin="anonymous"
          />
          {/* "The Real Ambassadors" header — always visible */}
          <div className="tl-mobile-header" style={{ height: headerH }}>
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) {
                  stopAudio(true);
                }
                setSoundEnabled(!soundEnabled);
              }}
              className="tl-sound-btn tl-sound-btn-mobile"
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
              title={soundEnabled ? "Sound on" : "Sound off"}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="tl-sound-icon tl-sound-icon-mobile"
              >
                {soundEnabled ? (
                  <>
                    <path
                      d="M5 9h4l5-4v14l-5-4H5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 9.5a4 4 0 0 1 0 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19.5 7a7.5 7.5 0 0 1 0 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M5 9h4l5-4v14l-5-4H5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 9l4 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 9l-4 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
              <span className="tl-sound-label">
                {soundEnabled ? "Sound off" : "Sound on"}
              </span>
            </button>
          </div>

          {/*
          Independently scrollable SVG timeline.
          The ENTIRE div captures horizontal scroll — not just the SVG lines.
          overflow-x: auto + touch-action: pan-x gives proper touch sensitivity.
         */}
          <div
            className="tl-mobile-viewport"
            style={
              {
                "--tl-mobile-left-gutter": `${mobileTimelineLeftGutter}px`,
                "--tl-mobile-right-gutter": `${mobileTimelineRightGutter}px`,
              } as React.CSSProperties
            }
          >
            <div
              ref={scrollRef}
              className="tl-scroll-surface tl-scroll-surface-mobile"
              onWheel={handleScrollSurfaceWheel}
            >
              <div
                className="tl-mob-scroll"
                style={
                  {
                    width: totalWidth,
                    height: svgH,
                    minHeight: svgH,
                    position: "relative",
                  } as React.CSSProperties
                }
              >
                <svg
                  width={totalWidth}
                  height={svgH}
                  viewBox={`0 0 ${totalWidth} ${svgH}`}
                  className="tl-svg"
                >
                  {/* 5 horizontal role lines */}
                  {roleLines.map((rl, i) => {
                    const lineY =
                      timelineTopPad + i * timelineLineSpacing + 0.5;
                    return (
                      <line
                        className="tl-role-line"
                        key={rl.id}
                        x1={roleLineStartOffset}
                        y1={lineY}
                        x2={totalWidth}
                        y2={lineY}
                        stroke={lineDefaultColor}
                        strokeWidth={lineStrokeWidth}
                        opacity={lineDefaultOpacity}
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="butt"
                        shapeRendering="crispEdges"
                      />
                    );
                  })}

                  {/* Lyric labels — placed ON the lines */}
                  {renderLyricLabels(true)}
                </svg>
              </div>
            </div>
            <div className="tl-mobile-left-mask" aria-hidden="true" />
            <div className="tl-mobile-right-mask" aria-hidden="true" />
          </div>
          {renderScrollBar()}
        </div>
        {placement === "fixed" ? (
          <img
            src="/assets/logo_light.png"
            alt="Strong House Logo"
            className="tl-logo tl-logo-mobile"
          />
        ) : null}
      </>
    );
  }

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  const svgH = timelineHeight - scrollbarHeight;
  return (
    <div
      className={`tl-desktop-root${placement === "section" ? " is-section" : ""}`}
      style={{ height: timelineHeight, ...lyricFontVar }}
    >
      <audio
        ref={audioRef}
        src="/assets/audio/the-real-ambassadors.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
      {/*
        Independently scrollable timeline area.
        The ENTIRE div is the scroll surface — touching anywhere in the navy
        area scrolls the timeline horizontally, independent of main content.
       */}
      <div
        className="tl-desktop-viewport"
        style={
          {
            "--tl-desktop-right-gutter": `${desktopTimelineRightGutter}px`,
          } as React.CSSProperties
        }
      >
        <div
          ref={scrollRef}
          className="tl-scroll-surface tl-scroll-surface-desktop"
          onWheel={handleScrollSurfaceWheel}
        >
          <div
            className="tl-bar-scroll"
            style={{
              width: totalWidth,
              height: svgH,
              position: "relative",
            }}
          >
            {/* "The Real Ambassadors" label — sits in the scrolling area */}
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) {
                  stopAudio(true);
                }
                setSoundEnabled(!soundEnabled);
              }}
              className="tl-sound-btn tl-sound-btn-desktop"
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
              title={soundEnabled ? "Sound on" : "Sound off"}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="tl-sound-icon tl-sound-icon-desktop"
              >
                {soundEnabled ? (
                  <>
                    <path
                      d="M5 9h4l5-4v14l-5-4H5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 9.5a4 4 0 0 1 0 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19.5 7a7.5 7.5 0 0 1 0 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M5 9h4l5-4v14l-5-4H5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 9l4 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 9l-4 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
              <span className="tl-sound-label">
                {soundEnabled ? "Sound off" : "Sound on"}
              </span>
            </button>

            <svg
              width={totalWidth}
              height={svgH}
              viewBox={`0 0 ${totalWidth} ${svgH}`}
              className="tl-svg"
            >
              {/* 5 horizontal role lines — uniform pale grey, thin and crisp */}
              {roleLines.map((rl, i) => {
                const lineY = timelineTopPad + i * timelineLineSpacing + 0.5;
                return (
                  <line
                    className="tl-role-line"
                    key={rl.id}
                    x1={roleLineStartOffset}
                    y1={lineY}
                    x2={totalWidth}
                    y2={lineY}
                    stroke={lineDefaultColor}
                    strokeWidth={lineStrokeWidth}
                    opacity={lineDefaultOpacity}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="butt"
                    shapeRendering="crispEdges"
                  />
                );
              })}

              {/* Lyric labels — placed directly ON the lines */}
              {renderLyricLabels(false)}
            </svg>
          </div>
        </div>
        <div className="tl-desktop-right-mask" aria-hidden="true" />
      </div>
      {renderScrollBar()}
      {placement === "fixed" ? (
        <img
          src="/assets/logo_light.png"
          alt="Strong House Logo"
          className="tl-logo tl-logo-desktop"
        />
      ) : null}
    </div>
  );
}
