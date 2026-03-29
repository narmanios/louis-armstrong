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
const lineDefaultOpacity = 1;
const roleLineStartOffset = 40;
const lyricLabelStartOffset = 60;
const desktopTimelineRightGutter = 40;
const mobileTimelineLeftGutter = 18;
const mobileTimelineRightGutter = 18;
const lyricHoverBackground = "#F5F3EA";
const mobileLyricLetterSpacing = 0.08;
const desktopLyricLetterSpacing = 0.1;
const scrollbarHeight = 18;
const mobileScrollbarThumbBoost = 8;
const desktopScrollbarThumbBoost = 20;
const soundIconOffFilter =
  "brightness(0) saturate(100%) invert(23%) sepia(91%) saturate(2862%) hue-rotate(349deg) brightness(93%) contrast(96%)";
const soundIconOnFilter =
  "brightness(0) saturate(100%) invert(25%) sepia(96%) saturate(1717%) hue-rotate(206deg) brightness(101%) contrast(96%)";

// Musical font for lyrics
const lyricFont = "Georgia, 'Times New Roman', serif";

// Vibrant colors from the role dots — used randomly on lyric hover
const hoverColors = [
  "rgb(0, 0, 0)",
  // // actor blue
  // "rgb(104, 96, 18)",
  // // musician orange
  // "rgb(0, 0, 0)",
  // // bandleader pink
  // "rgb(71, 69, 44)",
  // // vocalist green
  // "rgb(158, 158, 109)", // ambassador purple
];
function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

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
  const audioRef = useRef<HTMLAudioElement>(null);
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

  // Pre-compute a stable color per lyric
  const lyricColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    lyricLabels.forEach((lyr) => {
      map[lyr.id] = hoverColors[hashStringToInt(lyr.id) % hoverColors.length];
    });
    return map;
  }, []);

  // Pre-compute a stable color per phrase group
  const phraseGroupColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    rawLyrics.forEach((lyric) => {
      if (!(lyric.phraseGroup in map)) {
        map[lyric.phraseGroup] =
          hoverColors[lyric.phraseGroup % hoverColors.length];
      }
    });
    return map;
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
          className="tl-custom-scrollbar-track"
          onClick={handleScrollbarTrackClick}
        >
          <div
            className="tl-custom-scrollbar-thumb"
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${thumbLeftPercent}%`,
            }}
          />
        </div>
      </div>
    );
  };

  const renderLyricLabels = (isMobileView: boolean) => {
    const yOffset = isMobileView ? 4 : 2;
    const idleColor = isMobileView
      ? "rgba(180,180,180,0.38)"
      : "rgba(180,180,180,0.32)";
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
      const hoverColor = isInSamePhrase
        ? phraseGroupColorMap[hoveredPhraseGroup]
        : lyricColorMap[lyr.id];
      const fontSize = isActive ? 11 : 9;
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
                "--tl-lyric-color": isActive ? hoverColor : idleColor,
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
            src="/images/audio/the-real-ambassadors.mp3"
            preload="auto"
            crossOrigin="anonymous"
          />
          {/* "The Real Ambassadors" header — always visible */}
          <div className="tl-mobile-header" style={{ height: headerH }}>
            <div className="tl-header-title tl-header-title-mobile">
              The Real Ambassadors
            </div>
            <button
              onClick={() => {
                if (soundEnabled) {
                  stopAudio(true);
                }
                setSoundEnabled(!soundEnabled);
              }}
              className="tl-sound-btn tl-sound-btn-mobile"
              title={soundEnabled ? "Sound: On" : "Sound: Off"}
            >
              <img
                src="/images/sound.svg"
                alt="Sound toggle"
                className="tl-sound-icon tl-sound-icon-mobile"
                style={{
                  opacity: 1,
                  filter: soundEnabled ? soundIconOnFilter : soundIconOffFilter,
                }}
              />
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
                    const lineY = timelineTopPad + i * timelineLineSpacing;
                    return (
                      <line
                        className="tl-role-line"
                        key={rl.id}
                        x1={roleLineStartOffset}
                        y1={lineY}
                        x2={totalWidth}
                        y2={lineY}
                        stroke={lineDefaultColor}
                        strokeWidth={0.5}
                        opacity={lineDefaultOpacity}
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
            src="/images/logo_light.png"
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
        src="/images/audio/the-real-ambassadors.mp3"
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
            <div className="tl-header-title tl-header-title-desktop">
              The Real Ambassadors
            </div>

            <button
              onClick={() => {
                if (soundEnabled) {
                  stopAudio(true);
                }
                setSoundEnabled(!soundEnabled);
              }}
              className="tl-sound-btn tl-sound-btn-desktop"
              title={soundEnabled ? "Sound: On" : "Sound: Off"}
            >
              <img
                src="/images/sound.svg"
                alt="Sound toggle"
                className="tl-sound-icon tl-sound-icon-desktop"
                style={{
                  opacity: 1,
                  filter: soundEnabled ? soundIconOnFilter : soundIconOffFilter,
                }}
              />
            </button>

            <svg
              width={totalWidth}
              height={svgH}
              viewBox={`0 0 ${totalWidth} ${svgH}`}
              className="tl-svg"
            >
              {/* 5 horizontal role lines — uniform pale grey, thin and crisp */}
              {roleLines.map((rl, i) => {
                const lineY = timelineTopPad + i * timelineLineSpacing;
                return (
                  <line
                    className="tl-role-line"
                    key={rl.id}
                    x1={roleLineStartOffset}
                    y1={lineY}
                    x2={totalWidth}
                    y2={lineY}
                    stroke={lineDefaultColor}
                    strokeWidth={0.3}
                    opacity={lineDefaultOpacity}
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
          src="/images/logo_light.png"
          alt="Strong House Logo"
          className="tl-logo tl-logo-desktop"
        />
      ) : null}
    </div>
  );
}
