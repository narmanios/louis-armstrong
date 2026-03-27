import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { SectionIntroHero } from "./SectionIntroHero";
import { SectionCareerTimeline } from "./SectionCareerTimeline.tsx";
import { SectionTheBeginning } from "./SectionTheBeginning";
import { SectionJourneyToAmbassador } from "./SectionJourneyToAmbassador";
import { SectionJazzAmbassadors } from "./SectionJazzAmbassadors";
import { SectionFBIFiles } from "./SectionFBIFiles";
import { SectionAfricaTour } from "./SectionAfricaTour";
import { SectionRealAmbassadors } from "./SectionRealAmbassadors";
import { SectionWorldFair } from "./SectionWorldFair";
import { TimelineBar } from "./TimelineBar";
import { mobileTimelineHeight, timelineHeight } from "./TimelineShared";
import { SectionGoodwillAmbassador } from "./bubble-chart/components/SectionGoodwillAmbassador.tsx";
import { SatchmoLegacy } from "./WonderfulWorld/SatchmoLegacy.tsx";
interface MusicCollectionGalleryProps {
  className?: string;
}

type GroupId = "history" | "musician" | "ambassador";
type TimelineJumpTarget =
  | { kind: "intro" }
  | { kind: "section"; groupId: GroupId; sectionIdx: number };

export const MusicCollectionGallery: React.FC<MusicCollectionGalleryProps> = ({
  className,
}) => {
  const desktopGroupPeek = 104;
  const desktopGroupGap = 28;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLElement>(null);
  const historyPageRef = useRef<HTMLDivElement>(null);
  const musicianPageRef = useRef<HTMLDivElement>(null);
  const ambassadorPageRef = useRef<HTMLDivElement>(null);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const musicianScrollRef = useRef<HTMLDivElement>(null);
  const ambassadorScrollRef = useRef<HTMLDivElement>(null);
  const historySectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const musicianSectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ambassadorSectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isMobile = useIsMobile();
  const [showFixedGroupNav, setShowFixedGroupNav] = useState(false);
  const groupNavItems: Array<{ id: GroupId; label: string }> = [
    { id: "history", label: "history" },
    { id: "musician", label: "musician" },
    { id: "ambassador", label: "ambassador" },
  ];
  const timelineTargetMap: TimelineJumpTarget[] = [
    { kind: "intro" },
    { kind: "section", groupId: "history", sectionIdx: 0 },
    { kind: "section", groupId: "history", sectionIdx: 1 },
    { kind: "section", groupId: "history", sectionIdx: 2 },
    { kind: "section", groupId: "musician", sectionIdx: 0 },
    { kind: "section", groupId: "ambassador", sectionIdx: 0 },
    { kind: "section", groupId: "ambassador", sectionIdx: 3 },
    { kind: "section", groupId: "ambassador", sectionIdx: 4 },
    { kind: "section", groupId: "ambassador", sectionIdx: 5 },
  ];

  const scrollToTrackChild = (targetSectionIdx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const child = container.children[targetSectionIdx] as
      | HTMLElement
      | undefined;
    if (!child) return;

    if (isMobile) {
      child.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    container.scrollTo({
      left: Math.max(child.offsetLeft - desktopGroupPeek, 0),
      behavior: "smooth",
    });
  };

  const getGroupPageElement = (groupId: GroupId) => {
    if (groupId === "history") return historyPageRef.current;
    if (groupId === "musician") return musicianPageRef.current;
    return ambassadorPageRef.current;
  };

  const getGroupScroller = (groupId: GroupId) => {
    if (groupId === "history") return historyScrollRef.current;
    if (groupId === "musician") return musicianScrollRef.current;
    return ambassadorScrollRef.current;
  };

  const getGroupSectionElements = (groupId: GroupId) => {
    if (groupId === "history") return historySectionRefs.current;
    if (groupId === "musician") return musicianSectionRefs.current;
    return ambassadorSectionRefs.current;
  };

  const scrollToGroupSection = (groupId: GroupId, sectionIdx = 0) => {
    const page = getGroupPageElement(groupId);
    const scroller = getGroupScroller(groupId);
    const section = getGroupSectionElements(groupId)[sectionIdx] ?? null;

    if (isMobile) {
      (section ?? page)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (page) {
      scrollContainerRef.current?.scrollTo({
        left: Math.max(page.offsetLeft - desktopGroupPeek, 0),
        behavior: "smooth",
      });
    }

    scroller?.scrollTo({
      top: section?.offsetTop ?? 0,
      behavior: "smooth",
    });
  };

  const scrollToTimelineSection = (timelineIdx: number) => {
    const target = timelineTargetMap[timelineIdx] ?? { kind: "intro" as const };
    if (target.kind === "intro") {
      scrollToTrackChild(0);
      return;
    }
    const { groupId, sectionIdx } = target;
    scrollToGroupSection(groupId, sectionIdx);
  };

  const scrollToGroup = (groupId: GroupId) => {
    scrollToGroupSection(groupId, 0);
  };

  useEffect(() => {
    const updateNavVisibility = () => {
      if (isMobile) {
        const introSection = introSectionRef.current;
        if (!introSection) return;
        const rect = introSection.getBoundingClientRect();
        setShowFixedGroupNav(rect.bottom <= 140);
        return;
      }

      const container = scrollContainerRef.current;
      const historyPage = historyPageRef.current;
      if (!container || !historyPage) return;
      setShowFixedGroupNav(container.scrollLeft >= historyPage.offsetLeft / 2);
    };

    updateNavVisibility();

    if (isMobile) {
      window.addEventListener("scroll", updateNavVisibility, { passive: true });
      window.addEventListener("resize", updateNavVisibility);
      return () => {
        window.removeEventListener("scroll", updateNavVisibility);
        window.removeEventListener("resize", updateNavVisibility);
      };
    }

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", updateNavVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateNavVisibility);
    return () => {
      container?.removeEventListener("scroll", updateNavVisibility);
      window.removeEventListener("resize", updateNavVisibility);
    };
  }, [isMobile]);

  const textBaseStyle: React.CSSProperties = {
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 400,
    color: "#000000",
  };
  return (
    <div
      className={`mcg-root ${className || ""}`}
      style={{
        paddingBottom: isMobile ? mobileTimelineHeight : timelineHeight,
      }}
    >
      <style>{`
        /* ── SHARED ── */
        .mcg-root {
          width: 100%;
          background: #161616;
        }

        .mcg-group-nav {
          position: fixed;
          top: 24px;
          right: 56px;
          z-index: 140;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mcg-group-nav-button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #fff;
          opacity: 0.72;
          transition: opacity 0.18s ease;
        }

        .mcg-group-nav-button:hover {
          opacity: 1;
        }

        /* ── DESKTOP: horizontal scroll ── */
        .mcg-track {
          width: 100%;
          height: 800px;
          overflow-x: auto;
          overflow-y: hidden;
          display: flex;
          flex-direction: row;
          gap: ${desktopGroupGap}px;
          padding: 0 ${desktopGroupPeek}px 0 0;
          box-sizing: border-box;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 0 ${desktopGroupPeek}px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mcg-track::-webkit-scrollbar { display: none; }

        .mcg-group-page {
          width: calc(100vw - ${desktopGroupPeek * 2 + desktopGroupGap}px);
          min-width: calc(100vw - ${desktopGroupPeek * 2 + desktopGroupGap}px);
          height: 800px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #232323;
          padding: 40px 56px 36px;
          box-sizing: border-box;
        }

        .mcg-group-label {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
          transform-origin: center;
          font-family: "Andale Mono", "Andale Mono WT", monospace;
          font-size: 80px;
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: -0.06em;
          color: rgba(255, 255, 255, 0.08);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          text-align: left;
        }

        .mcg-group-frame {
          width: min(100%, 1112px);
          height: 100%;
          margin: 0 auto;
          background: #000000;
          overflow: hidden;
          padding-top: 28px;
          box-sizing: border-box;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
          position: relative;
          z-index: 1;
        }

        .mcg-group-page--history .mcg-group-label {
          color: rgba(207, 107, 76, 0.3);
        }

        .mcg-group-page--history .mcg-group-frame,
        .mcg-group-page--history .mcg-section {
          background: #343434 !important;
        }

        .mcg-group-page--history .mcg-page-title,
        .mcg-group-page--history p,
        .mcg-group-page--history span,
        .mcg-group-page--history h1,
        .mcg-group-page--history h2,
        .mcg-group-page--history h3,
        .mcg-group-page--history h4,
        .mcg-group-page--history button,
        .mcg-group-page--history a {
          color: #ffffff !important;
        }

        .mcg-group-page--musician {
          --slg-bg: #000000;
        }

        .mcg-group-page--musician .mcg-group-label {
          color: rgba(107, 123, 74, 0.28);
        }

        .mcg-group-page--musician .mcg-group-frame,
        .mcg-group-page--musician .mcg-section {
          background: #000000 !important;
        }

        .mcg-group-page--ambassador .mcg-group-label {
          color: rgba(79, 111, 154, 0.28);
        }

        .mcg-group-page--ambassador .mcg-group-frame,
        .mcg-group-page--ambassador .mcg-section {
          background: #343434 !important;
        }

        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) .mcg-page-title,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) p,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) span,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h1,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h2,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h3,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h4,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) a {
          color: #ffffff !important;
        }

        .mcg-group-scroll {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .mcg-group-scroll::-webkit-scrollbar {
          display: none;
        }

        .mcg-group-section {
          width: 100%;
          min-width: 0;
          scroll-snap-align: start;
          min-height: 800px;
          position: relative;
          overflow: hidden;
        }

        .mcg-group-section-inner {
          width: 100%;
          height: 800px;
          transform: scale(0.88);
          transform-origin: top center;
        }

        .mcg-section {
          width: 100vw;
          min-width: 100vw;
          height: 800px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #000000;
        }

        .mcg-group-page .mcg-section {
          width: 100% !important;
          min-width: 0 !important;
        }

        /* Shared page title styling for all non-hero sections */
        .mcg-page-title {
          margin: 0 !important;
          font-family: "Andale Mono", "Andale Mono WT", monospace !important;
          font-size: 40px !important;
          font-weight: 800 !important;
          line-height: 48px !important;
          color: var(--mcg-page-title-color, #002768) !important;
        }

        .mcg-track > .mcg-section .mcg-page-title:not(.mcg-page-title--flow),
        .mcg-track > .mcg-group-page .mcg-section .mcg-page-title:not(.mcg-page-title--flow) {
          position: absolute !important;
          left: 56px !important;
          top: 64px !important;
          z-index: 5 !important;
        }

        .mcg-page-title--flow {
          position: static !important;
          left: auto !important;
          top: auto !important;
        }

        .mcg-page-title--spaced {
          margin-bottom: 57px !important;
        }

        .mcg-page-title--light {
          --mcg-page-title-color: #ffffff;
        }

        .mcg-page-title--tight {
          margin: 0 !important;
        }

        /* ── MOBILE: vertical stack ── */
        @media (max-width: 767px) {
          .mcg-group-nav {
            top: 16px;
            right: 16px;
            gap: 10px;
          }

          .mcg-group-nav-button {
            font-size: 10px;
          }

          .mcg-track {
            height: auto;
            overflow-x: visible;
            overflow-y: visible;
            display: block;
            scroll-snap-type: none;
          }

          .mcg-group-page {
            width: 100vw;
            min-width: 100vw;
            height: auto;
            overflow: visible;
            padding: 0 0 28px;
            box-sizing: border-box;
            background: #161616;
          }

          .mcg-group-label {
            display: none;
          }

          .mcg-group-frame {
            width: 100vw;
            height: auto;
            overflow: hidden;
            padding-top: 20px;
            box-sizing: border-box;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
          }

          .mcg-group-scroll {
            height: auto;
            overflow: visible;
            scroll-snap-type: none;
          }

          .mcg-group-section {
            scroll-snap-align: none;
            min-height: 0;
            overflow: visible;
          }

          .mcg-group-section-inner {
            height: auto;
            transform: none;
          }

          .mcg-section {
            min-width: 0;
            width: 100vw;
            height: auto;
            position: relative;
            overflow: visible;
            flex-shrink: unset;
            scroll-snap-align: none;
            padding: 24px 0 32px;
            box-sizing: border-box;
          }

          .mcg-group-page .mcg-section {
            width: 100% !important;
            min-width: 0 !important;
            background: #000000 !important;
          }

          /* Hero section mobile styles are section-scoped in SectionIntroHero.tsx */
          .mcg-page-title {
            position: static !important;
            left: auto !important;
            top: auto !important;
            font-size: 28px !important;
            line-height: 1.2 !important;
            margin: 0 0 20px 0 !important;
          }

          /* Two-image card sections (Beginning, Journey, World Fair) */
          .mcg-image-row {
            position: static !important;
            left: auto !important;
            top: auto !important;
            flex-direction: column !important;
            gap: 20px !important;
            margin-bottom: 20px !important;
          }
          .mcg-image-row .interactive-card img {
            width: 100% !important;
            height: 220px !important;
          }
          .mcg-text-row {
            position: static !important;
            left: auto !important;
            top: auto !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .mcg-text-row p {
            width: 100% !important;
          }

          /* Goodwill / map sections */
          .mcg-goodwill-text {
            position: static !important;
            width: 100% !important;
            margin-bottom: 16px !important;
          }
          .mcg-goodwill-album {
            position: static !important;
            display: block !important;
            width: 180px !important;
            height: 180px !important;
            margin-bottom: 20px !important;
          }
          .mcg-map-wrap {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            margin-bottom: 16px !important;
          }
          .mcg-map-wrap img {
            width: 100% !important;
            height: auto !important;
            position: static !important;
          }
          .mcg-map-travels {
            display: none !important;
          }
          .mcg-chile-tooltip {
            display: none !important;
          }

          /* Jazz ambassadors */
          .mcg-jazz-section {
            position: relative !important;
            overflow: hidden !important;
          }
          .mcg-jazz-section .mcg-map-wrap {
            position: absolute !important;
            left: 141px !important;
            top: 195px !important;
            width: 1122px !important;
            height: 480px !important;
          }
          .mcg-jazz-section .mcg-map-travels {
            display: block !important;
          }
          .mcg-jazz-section .mcg-jazz-legend {
            position: absolute !important;
            left: 56px !important;
            top: 172px !important;
            margin-bottom: 0 !important;
          }
          .mcg-jazz-section .mcg-jazz-collage {
            position: absolute !important;
            left: 60px !important;
            top: 373px !important;
            width: 270px !important;
            height: 184px !important;
            margin-bottom: 0 !important;
          }
          .mcg-jazz-section .mcg-india-tooltip {
            display: block !important;
          }

          /* FBI files */
          .mcg-fbi-grid {
            position: static !important;
            width: 100% !important;
            grid-template-columns: repeat(4, 1fr) !important;
            margin-top: 12px !important;
          }

          /* Africa tour */
          .mcg-africa-row {
            position: static !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mcg-africa-row > div {
            width: 100% !important;
          }
          .mcg-africa-mini-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
          .mcg-africa-text-row {
            position: static !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          .mcg-africa-text-row p {
            width: 100% !important;
          }
          .mcg-congo-label {
            bottom: 48px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }

          /* Lyrics section */
          .mcg-lyrics-wrap {
            position: static !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mcg-lyrics-wrap img {
            width: 100% !important;
            height: auto !important;
            max-height: 280px !important;
          }
          .mcg-track-list {
            width: 100% !important;
          }
          .mcg-lyrics-text {
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
          }

          /* Wonderful world */
          .mcg-wonderful-wrap {
            position: static !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mcg-wonderful-wrap img {
            width: 100% !important;
            height: auto !important;
            max-height: 280px !important;
          }
          .mcg-wonderful-text {
            width: 100% !important;
            margin-top: 0 !important;
          }

          /* World fair placeholder boxes */
          .mcg-placeholder {
            width: 100% !important;
            height: 200px !important;
          }
        }

        /* ── INTERACTIONS (both breakpoints) ── */
        .interactive-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .interactive-card:hover { transform: translateY(-5px); box-shadow: 0px 10px 20px rgba(0,0,0,0.2); }
        .explore-btn { transition: all 0.2s ease; border: none; background: transparent; cursor: pointer; padding: 0; }
        .explore-btn:hover { opacity: 0.8; transform: scale(1.05); }
        .map-marker { cursor: pointer; transition: transform 0.2s ease; }
        .map-marker:hover { transform: scale(1.2); }
        .fbi-doc { transition: transform 0.2s ease; cursor: zoom-in; }
        .fbi-doc:hover { transform: scale(1.1); z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
      `}</style>

      {showFixedGroupNav ? (
        <nav className="mcg-group-nav" aria-label="Section groups">
          {groupNavItems.map((item) => (
            <button
              key={item.id}
              className="mcg-group-nav-button"
              onClick={() => scrollToGroup(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}

      <div className="mcg-track" ref={scrollContainerRef}>
        <SectionIntroHero
          sectionRef={introSectionRef}
          onNavigateHistory={() => scrollToGroup("history")}
          onNavigateMusician={() => scrollToGroup("musician")}
          onNavigateAmbassador={() => scrollToGroup("ambassador")}
        />
        <div
          ref={historyPageRef}
          className="mcg-group-page mcg-group-page--history"
        >
          <div className="mcg-group-label" aria-hidden="true">
            history
          </div>
          <div className="mcg-group-frame">
            <div ref={historyScrollRef} className="mcg-group-scroll">
              <div
                ref={(element) => {
                  historySectionRefs.current[0] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionCareerTimeline />
                </div>
              </div>
              <div
                ref={(element) => {
                  historySectionRefs.current[1] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionTheBeginning textBaseStyle={textBaseStyle} />
                </div>
              </div>
              <div
                ref={(element) => {
                  historySectionRefs.current[2] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionJourneyToAmbassador textBaseStyle={textBaseStyle} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={musicianPageRef}
          className="mcg-group-page mcg-group-page--musician"
        >
          <div className="mcg-group-label" aria-hidden="true">
            musician
          </div>
          <div className="mcg-group-frame">
            <div ref={musicianScrollRef} className="mcg-group-scroll">
              <div
                ref={(element) => {
                  musicianSectionRefs.current[0] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SatchmoLegacy />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={ambassadorPageRef}
          className="mcg-group-page mcg-group-page--ambassador"
        >
          <div className="mcg-group-label" aria-hidden="true">
            ambassador
          </div>
          <div className="mcg-group-frame">
            <div ref={ambassadorScrollRef} className="mcg-group-scroll">
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[0] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionGoodwillAmbassador textBaseStyle={textBaseStyle} />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[1] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionFBIFiles />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[2] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionJazzAmbassadors />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[3] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionAfricaTour />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[4] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionWorldFair textBaseStyle={textBaseStyle} />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[5] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionRealAmbassadors />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TimelineBar onDotClick={scrollToTimelineSection} isMobile={isMobile} />
    </div>
  );
};
