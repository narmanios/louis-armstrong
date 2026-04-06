import React from "react";
import { TimelineBar } from "./TimelineBar";
import { mobileTimelineHeight, timelineHeight } from "./TimelineShared";

const realAmbassadorsParagraph =
  "The Real Ambassadors is a jazz musical by Dave Brubeck and Iola Brubeck, written for Louis Armstrong, that satirizes America’s use of jazz musicians as cultural representatives during the Cold War. The lyrics describe how Armstrong and other Black performers were sent abroad to symbolize freedom and democracy while facing racism and segregation at home.";

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
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 20px;
          line-height: 40px;
          color: #000000;
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
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 0;
          }

          .real-ambassadors-cover {
            width: 100%;
            max-width: 320px;
            height: auto;
          }

          .real-ambassadors-copy {
            width: 100%;
          }

          .real-ambassadors-spacer {
            display: none;
          }

          .real-ambassadors-timeline {
            position: static;
            left: auto;
            right: auto;
            bottom: auto;
            margin-top: 16px;
          }

          .real-ambassadors-timeline-frame {
            width: 100%;
            max-width: none;
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

        <div className="real-ambassadors-copy">
          <p>{realAmbassadorsParagraph}</p>
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
