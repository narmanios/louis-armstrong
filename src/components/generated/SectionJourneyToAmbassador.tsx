import React from "react";

export const SectionJourneyToAmbassador: React.FC = () => {
  return (
    <section className="mcg-section journey-section">
      <style>{`
        .journey-section {
          background: #000000;
        }

        .journey-section .mcg-page-title {
          color: #ffffff;
        }

        .journey-entry-grid {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 56px;
          position: absolute;
          left: 56px;
          top: 164px;
        }

        .journey-entry {
          width: min(340px, calc((100vw - 280px) / 2));
        }

        .journey-media-image {
          width: 100%;
          aspect-ratio: 470 / 360;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .journey-caption,
        .journey-copy {
          margin: 0;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
          color: #ffffff;
        }

        .journey-caption {
          margin-top: 12px;
        }

        .journey-copy {
          width: 100%;
          line-height: 20px;
          margin-top: 16px;
        }

        @media (max-width: 767px) {
          .journey-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .journey-section .mcg-page-title {
            position: static !important;
            margin: 0 0 20px 0 !important;
          }

          .journey-entry-grid {
            position: static;
            left: auto;
            top: auto;
            flex-direction: column;
            gap: 20px;
          }

          .journey-entry,
          .journey-copy {
            width: 100%;
          }

          .journey-media-image {
            width: 100%;
            height: 220px;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title">
        Journey to Ambassador 1930-1948
      </h2>

      <div className="journey-entry-grid">
        <div className="journey-entry">
          <div className="interactive-card">
            <img
              src="/images/orchestra.png"
              alt="Orchestra"
              className="journey-media-image"
            />
          </div>
          <p className="journey-caption">
            Louis Armstrong and his Orchestra (1929)
          </p>
          <p className="journey-copy">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ullamcorper erat tortor, at accumsan sapien molestie et. Sed
            hendrerit velit vel neque molestie eleifend. Ut sodales lorem vel
            mauris malesuada maximus.
          </p>
        </div>

        <div className="journey-entry">
          <div className="interactive-card">
            <img
              src="/images/chicago.png"
              alt="Chicago"
              className="journey-media-image"
            />
          </div>
          <p className="journey-caption">Chicago</p>
          <p className="journey-copy">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ullamcorper erat tortor, at accumsan sapien molestie et. Sed
            hendrerit velit vel neque molestie eleifend. Ut sodales lorem vel
            mauris malesuada maximus.
          </p>
        </div>
      </div>
    </section>
  );
};
