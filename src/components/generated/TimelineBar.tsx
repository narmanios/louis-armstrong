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
  sectionsMeta,
  lyricLabels,
  rawLyrics,
  getSectionWidth,
} from "./TimelineShared";
import "./TimelineBar.css";

// Pale grey for all 5 lines
const lineDefaultColor = "rgb(0, 0, 0)";
const lineDefaultOpacity = 1;
const roleLineStartOffset = 40;
const lyricLabelStartOffset = 60;
const lyricHoverBackground = "#F5F3EA";
const mobileLyricLetterSpacing = 0.08;
const desktopLyricLetterSpacing = 0.1;

// Musical font for lyrics
const lyricFont = "Georgia, 'Times New Roman', serif";

// Vibrant colors from the role dots — used randomly on lyric hover
const hoverColors = [
  "rgb(0, 0, 0)",
  // actor blue
  "rgb(104, 96, 18)",
  // musician orange
  "rgb(0, 0, 0)",
  // bandleader pink
  "rgb(71, 69, 44)",
  // vocalist green
  "rgb(158, 158, 109)", // ambassador purple
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
  onDotClick,
  isMobile,
}: {
  onDotClick: (idx: number) => void;
  isMobile: boolean;
}) {
  const [hoveredLyricId, setHoveredLyricId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
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

  // Independent scroll state for the timeline bar itself
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tlScrollLeft, setTlScrollLeft] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setTlScrollLeft(el.scrollLeft);
    el.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Calculate section positions based on dynamic widths
  const sectionPositions = useMemo(() => {
    let x = 0;
    const positions = sectionsMeta.map((sec) => {
      const startX = x;
      const width = getSectionWidth(sec.startYear, sec.endYear);
      x += width;
      return { start: startX, width };
    });
    return positions;
  }, []);

  // Determine active section based on scroll position
  const activeIdx = useMemo(() => {
    for (let i = 0; i < sectionPositions.length; i++) {
      const nextPos = sectionPositions[i + 1];
      if (nextPos && tlScrollLeft < nextPos.start) return i;
    }
    return Math.min(sectionsMeta.length - 1, sectionPositions.length - 1);
  }, [tlScrollLeft, sectionPositions]);

  // When a nav pill is clicked, scroll the timeline bar to that section
  const handlePillClick = (idx: number) => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({
        left: sectionPositions[idx]?.start || 0,
        behavior: "smooth",
      });
    }
    onDotClick(idx);
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
      const fontSize = isActive ? 13 : 9;
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
    // SVG height: total bar minus header row minus pill dots row
    const headerH = 32;
    const pillH = 28;
    const svgH = mobileTimelineHeight - headerH - pillH;
    return (
      <>
        <div
          className="tl-mobile-root"
          style={{ height: mobileTimelineHeight, ...lyricFontVar }}
        >
          <audio
            ref={audioRef}
            src="/audio/the-real-ambassadors.mp3"
            preload="auto"
            crossOrigin="anonymous"
          />
          {/* "The Real Ambassadors" header — always visible */}
          <div className="tl-mobile-header" style={{ height: headerH }}>
            <span className="tl-header-title tl-header-title-mobile">
              The Real Ambassadors
            </span>
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
                style={{ opacity: soundEnabled ? 1 : 0.5 }}
              />
            </button>
          </div>

          {/*
          Independently scrollable SVG timeline.
          The ENTIRE div captures horizontal scroll — not just the SVG lines.
          overflow-x: auto + touch-action: pan-x gives proper touch sensitivity.
         */}
          <div
            ref={scrollRef}
            className="tl-scroll-surface tl-scroll-surface-mobile"
          >
            <div
              className="tl-mob-scroll"
              style={
                {
                  width: totalWidth,
                  height: svgH,
                  minHeight: svgH,
                  position: "relative",
                  paddingBottom: 24,
                  scrollbarWidth: "none",
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

          {/* Section navigation pill dots */}
          <div className="tl-pill-row" style={{ height: pillH }}>
            {sectionsMeta.map((sec, idx) => {
              const active = activeIdx === idx;
              return (
                <button
                  key={sec.id}
                  onClick={() => handlePillClick(idx)}
                  title={sec.label}
                  className={`tl-pill ${active ? "is-active" : ""}`}
                />
              );
            })}
          </div>
        </div>
        <img
          src="/images/logo_light.png"
          alt="Strong House Logo"
          className="tl-logo tl-logo-mobile"
        />
      </>
    );
  }

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  const pillH = 28;
  const svgH = timelineHeight - pillH;
  return (
    <div
      className="tl-desktop-root"
      style={{ height: timelineHeight, ...lyricFontVar }}
    >
      <audio
        ref={audioRef}
        src="/audio/the-real-ambassadors.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
      {/*
        Independently scrollable timeline area.
        The ENTIRE div is the scroll surface — touching anywhere in the navy
        area scrolls the timeline horizontally, independent of main content.
       */}
      <div
        ref={scrollRef}
        className="tl-scroll-surface tl-scroll-surface-desktop"
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
          <span className="tl-header-title tl-header-title-desktop">
            The Real Ambassadors
          </span>

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
              style={{ opacity: soundEnabled ? 1 : 0.5 }}
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

      {/* Section navigation pill dots — always visible at bottom */}
      <div className="tl-pill-row" style={{ height: pillH }}>
        {sectionsMeta.map((sec, idx) => {
          const active = activeIdx === idx;
          return (
            <button
              key={sec.id}
              onClick={() => handlePillClick(idx)}
              title={sec.label}
              className={`tl-pill ${active ? "is-active" : ""}`}
            />
          );
        })}
      </div>
      <img
        src="/images/logo_light.png"
        alt="Strong House Logo"
        className="tl-logo tl-logo-desktop"
      />
    </div>
  );
}
