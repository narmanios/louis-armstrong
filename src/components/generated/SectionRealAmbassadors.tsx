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

        /* ── 4K Proportional Scaling ── */
        @media (min-width: 2560px) {
          .real-ambassadors-section {
            padding: 0 98px 105px;
          }

          .real-ambassadors-layout {
            gap: 56px 70px;
            margin-top: 42px;
          }

          .real-ambassadors-copy {
            font-size: 36px;
            line-height: 54px;
          }

          .real-ambassadors-copy h3 {
            font-size: 36px;
            margin-bottom: 28px;
          }

          .real-ambassadors-timeline {
            margin-top: 21px;
          }

          .real-ambassadors-timeline-frame {
            width: calc(100% - 168px);
            max-width: 2065px;
            height: 280px !important; /* 160 * 1.75 for desktop */
          }

          .real-ambassadors-timeline-frame.is-mobile {
            height: 350px !important; /* 200 * 1.75 for mobile */
          }
        }

        @media (min-width: 3440px) {
          .real-ambassadors-section {
            padding: 0 112px 120px;
          }

          .real-ambassadors-layout {
            gap: 64px 80px;
            margin-top: 48px;
          }

          .real-ambassadors-copy {
            font-size: 42px;
            line-height: 63px;
          }

          .real-ambassadors-copy h3 {
            font-size: 42px;
            margin-bottom: 32px;
          }

          .real-ambassadors-timeline {
            margin-top: 24px;
          }

          .real-ambassadors-timeline-frame {
            width: calc(100% - 192px);
            max-width: 2360px;
            height: 320px !important; /* 160 * 2.0 for desktop */
          }

          .real-ambassadors-timeline-frame.is-mobile {
            height: 400px !important; /* 200 * 2.0 for mobile */
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        "Who's the Real Ambassador?"
      </h2>
      <p
        className="real-ambassadors-description"
        style={{ color: "#000000", marginTop: "16px", maxWidth: "600px" }}
      >
        "The Real Ambassadors" was a jazz musical that was a satirical take on
        the Jazz Diplomacy program, using humor to critique the contradictions
        of American cultural diplomacy during the Cold War.
      </p>

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
          className={`real-ambassadors-timeline-frame${isMobile ? " is-mobile" : ""}`}
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
