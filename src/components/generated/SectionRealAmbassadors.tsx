import React from "react";
import { TimelineBar } from "./TimelineBar";
import { mobileTimelineHeight, timelineHeight } from "./TimelineShared";

const realAmbassadorsParagraph = [
  "Though I represent the government, the government",
  "Don′t represent some policies I'm for",
  "Oh, we learn to be concerned about the constitutionality",
  "In our nation, segregation isn′t a legality",
  "Soon our only differences will be in personality",
  "That's what I stand for",
  "Who′s the real ambassador?",
].join("\n");

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
          overflow: visible;
          height: auto;
          min-height: 100dvh;
          padding: 0 56px 60px;
          box-sizing: border-box;
        }

        .real-ambassadors-section .mcg-page-title {
          color: #000000 !important;
        }

        .real-ambassadors-layout {
          position: static;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px 40px;
          align-items: flex-start;
          margin-top: 24px;
        }

        .real-ambassadors-cover {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .real-ambassadors-copy {
          width: 100%;
          grid-column: span 2;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 20px;
          line-height: 40px;
          color: #000000;
        }

        .real-ambassadors-copy h3 {
          margin: 0 0 16px 0;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
          color: #000000;
          letter-spacing: 0.02em;
        }

        .real-ambassadors-spacer {
          width: 100%;
          min-height: 1px;
        }

        .real-ambassadors-copy p {
          margin: 0;
        }

        .real-ambassadors-timeline {
          position: static;
          z-index: 20;
          margin-top: 12px;
          box-sizing: border-box;
        }

        .real-ambassadors-timeline-frame {
          position: relative;
          width: calc(100% - 96px);
          max-width: 1180px;
          margin: 0 auto;
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        Album Release 1962
      </h2>

      <div className="mcg-lyrics-wrap real-ambassadors-layout">
        <img
          src="/assets/the-real-ambassadors.png"
          alt="The Real Ambassadors Album"
          className="real-ambassadors-cover"
        />

        <div className="real-ambassadors-copy">
          <h3>Lyrics to "The Real Ambassadors"</h3>
          <p style={{ whiteSpace: "pre-wrap", fontStyle: "italic" }}>
            {realAmbassadorsParagraph}
          </p>
        </div>

        <div className="real-ambassadors-spacer" aria-hidden="true" />
      </div>

      <div className="real-ambassadors-timeline">
        <div
          className="real-ambassadors-timeline-frame"
          style={{ height: isMobile ? mobileTimelineHeight : timelineHeight }}
        >
          <TimelineBar
            onDotClick={onTimelineJump}
            isMobile={isMobile}
            placement="section"
          />
        </div>
      </div>
    </section>
  );
};
