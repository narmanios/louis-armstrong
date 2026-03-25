import React, { useRef } from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { SectionIntroHero } from './SectionIntroHero';
import { SectionCareerTimeline } from './SectionCareerTimeline.tsx';
import { SectionTheBeginning } from './SectionTheBeginning';
import { SectionJourneyToAmbassador } from './SectionJourneyToAmbassador';
import { SectionGoodwill } from './SectionGoodwill';
import { SectionJazzAmbassadors } from './SectionJazzAmbassadors';
import { SectionFBIFiles } from './SectionFBIFiles';
import { SectionAfricaTour } from './SectionAfricaTour';
import { SectionRealAmbassadors } from './SectionRealAmbassadors';
import { SectionWorldFair } from './SectionWorldFair';
import { SectionWonderfulWorld } from './SectionWonderfulWorld';
import { TimelineBar } from './TimelineBar';
import { mobileTimelineHeight, timelineHeight } from './TimelineShared';
import { SectionGoodwillAmbassador } from './bubble-chart/components/SectionGoodwillAmbassador.tsx';
import { SatchmoLegacy } from './WonderfulWorld/SatchmoLegacy.tsx';
interface MusicCollectionGalleryProps {
  className?: string;
}
export const MusicCollectionGallery: React.FC<MusicCollectionGalleryProps> = ({ className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const sectionIndexMap = [0, 1, 3, 4, 5, 6, 8, 10, 11];

  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 1280,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTimelineSection = (timelineIdx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const targetSectionIdx = sectionIndexMap[timelineIdx] ?? 0;
    const child = container.children[targetSectionIdx] as HTMLElement | undefined;
    if (!child) return;

    if (isMobile) {
      child.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    container.scrollTo({
      left: child.offsetLeft,
      behavior: 'smooth',
    });
  };

  const textBaseStyle: React.CSSProperties = {
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 400,
    color: '#000000',
  };
  return (
    <div
      className={`mcg-root ${className || ''}`}
      style={{
        paddingBottom: isMobile ? mobileTimelineHeight : timelineHeight,
      }}
    >
      <style>{`
        /* ── SHARED ── */
        .mcg-root {
          width: 100%;
          background: #FFFFFF;
        }

        /* ── DESKTOP: horizontal scroll ── */
        .mcg-track {
          width: 100%;
          height: 800px;
          overflow-x: auto;
          overflow-y: hidden;
          display: flex;
          flex-direction: row;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mcg-track::-webkit-scrollbar { display: none; }

        .mcg-section {
          width: 100vw;
          min-width: 100vw;
          height: 800px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #FFFFFF;
        }

        /* Shared section title styling for all non-hero sections */
        .mcg-track > .mcg-section > .mcg-section-title {
          font-size: clamp(18px, 2.4vw, 28px) !important;
          font-weight: 800 !important;
          color: #002768 !important;
          line-height: 1.2 !important;
          top: 64px !important;
        }

        /* ── MOBILE: vertical stack ── */
        @media (max-width: 767px) {
          .mcg-track {
            height: auto;
            overflow-x: visible;
            overflow-y: visible;
            display: block;
            scroll-snap-type: none;
          }

          .mcg-section {
            min-width: 0;
            width: 100vw;
            height: auto;
            position: static;
            overflow: visible;
            flex-shrink: unset;
            scroll-snap-align: none;
            padding: 24px 0 32px;
            box-sizing: border-box;
          }

          /* Hero section mobile styles are section-scoped in SectionIntroHero.tsx */
          .mcg-section-title {
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
            min-height: 800px !important;
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

      <div className="mcg-track" ref={scrollContainerRef}>
        <SectionIntroHero onScrollNext={scrollToNext} />
        <SectionCareerTimeline textBaseStyle={textBaseStyle} />
        <SectionRealAmbassadors textBaseStyle={textBaseStyle} />

        <SectionTheBeginning textBaseStyle={textBaseStyle} />
        <SectionJourneyToAmbassador textBaseStyle={textBaseStyle} />
        {/* <SectionGoodwill textBaseStyle={textBaseStyle} /> */}
        <SectionGoodwillAmbassador textBaseStyle={textBaseStyle} />
        <SectionJazzAmbassadors textBaseStyle={textBaseStyle} />
        <SectionFBIFiles textBaseStyle={textBaseStyle} />
        <SectionAfricaTour textBaseStyle={textBaseStyle} />
        <SectionRealAmbassadors textBaseStyle={textBaseStyle} />
        <SectionWorldFair textBaseStyle={textBaseStyle} />
        <SectionWonderfulWorld textBaseStyle={textBaseStyle} />
        <SatchmoLegacy />
      </div>

      <TimelineBar onDotClick={scrollToTimelineSection} isMobile={isMobile} />
    </div>
  );
};
