import React from "react";
import { TimelineBar } from "./TimelineBar";

const trackList = [
  "Cultural Exchange",
  "Remember Who You Are",
  "My One Bad Habit",
  "Summer Song",
  "King for a Day",
  "The Real Ambassador",
  "In The Lurch",
  "One Moment Worth Years",
  "They Say I Look Like Ambassador",
  "Since Love Had Its Way",
];

export const SectionRealAmbassadors: React.FC<{
  onTimelineJump?: (idx: number) => void;
  isMobile?: boolean;
}> = ({ onTimelineJump = () => {}, isMobile = false }) => {
  return (
    <section className="mcg-section real-ambassadors-section">
      <style>{`
        .real-ambassadors-section {
          background: transparent;
          position: relative;
          overflow: hidden;
          min-height: 100dvh;
          padding: 0 56px 60px;
          box-sizing: border-box;
        }

        .real-ambassadors-section .mcg-page-title {
          color: #000000 !important;
        }

        .real-ambassadors-layout {
          position: static;
          display: flex;
          gap: 56px;
          align-items: flex-start;
          margin-top: 24px;
        }

        .real-ambassadors-cover {
          width: min(470px, 32vw);
          // aspect-ratio: 470 / 360;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .real-ambassadors-track-list {
          margin: 0;
          color: #111827;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 12px;
        }




        .real-ambassadors-lyrics {
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 12px;
          color: #000000;
        }

        .real-ambassadors-track-list {
          width: 144px;
          line-height: 18px;
        }

        .real-ambassadors-lyrics {
          width: 277px;
          height: 514px;
          overflow-y: auto;
          line-height: 20px;
          padding-right: 12px;
        }

        .real-ambassadors-lyrics p {
          margin: 0;
        }

        .real-ambassadors-lyrics p + p {
          margin-top: 20px;
        }

        .real-ambassadors-timeline {
          position: static;
          z-index: 20;
          margin-top: 24px;
        }

        @media (max-width: 768px) {
          .real-ambassadors-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .real-ambassadors-section .mcg-page-title {
            position: static !important;
            display: block !important;
            width: calc(100% - 40px);
            margin: 0 auto 24px !important;
          }

          .real-ambassadors-layout {
            position: static;
            left: auto;
            top: auto;
            flex-direction: column;
            gap: 20px;
            margin-top: 0;
          }

          .real-ambassadors-cover {
            width: 100%;
            max-width: 320px;
            height: auto;
          }

          .real-ambassadors-track-list,
          .real-ambassadors-lyrics {
            width: 100%;
          }

          .real-ambassadors-lyrics {
            height: auto;
            max-height: none;
            overflow: visible;
            padding-right: 0;
          }

          .real-ambassadors-timeline {
            position: static;
            left: auto;
            right: auto;
            bottom: auto;
            margin-top: 24px;
          }

          .real-ambassadors-timeline .tl-mobile-root.is-section {
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        The Real Ambassadors 1962
      </h2>

      <div className="mcg-lyrics-wrap real-ambassadors-layout">
        <img
          src="/assets/the-real-ambassadors.png"
          alt="The Real Ambassadors Album"
          className="real-ambassadors-cover"
        />

        <div className="mcg-track-list real-ambassadors-track-list">
          {trackList.map((track) => (
            <div key={track}>{track}</div>
          ))}
        </div>

        {/* <div className="mcg-lyrics-text real-ambassadors-lyrics">
          <p>
            <strong>The Real Ambassador</strong>
          </p>
          <p>
            Selected lyric excerpt:
            <br />
            "Who&apos;s the real ambassador?"
          </p>
          <p>
            The longer lyric block was removed from the component source so the
            section is easier to edit and doesn&apos;t trip content filtering
            while you work on the layout.
          </p>
        </div> */}
      </div>

      <div className="real-ambassadors-timeline">
        <TimelineBar
          onDotClick={onTimelineJump}
          isMobile={isMobile}
          placement="section"
        />
      </div>
    </section>
  );
};
