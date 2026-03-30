import React from "react";

export const SectionJourneyToAmbassador: React.FC = () => {
  return (
    <section className="mcg-section journey-section">
      <style>{`
        .journey-section {
          background: #000000;
          min-height: 800px;
          padding: 49px 56px 60px;
          box-sizing: border-box;
        }

        .journey-section .mcg-page-title {
          color: #ffffff;
        }

        .journey-entry-grid {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 56px;
          position: static;
          margin-top: 24px;
        }

        .journey-entry {
          width: min(340px, calc((100% - 56px) / 2));
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

        @media (max-width: 768px) {
          .journey-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .journey-section .mcg-page-title {
            position: static !important;
            display: block !important;
            width: calc(100% - 40px);
            margin: 0 auto 24px !important;
          }

          .journey-entry-grid {
            position: static;
            left: auto;
            top: auto;
            flex-direction: column;
            gap: 32px;
            margin-top: 0;
          }

          .journey-entry,
          .journey-copy {
            width: 100%;
          }

          .journey-entry {
            width: calc(100% - 56px);
            margin: 0 0 0 20px;
          }

          .journey-media-image {
            width: 100%;
            aspect-ratio: 5 / 4;
            height: auto;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        Journey to Ambassador 1930-1948
      </h2>

      <div className="journey-entry-grid">
        <div className="journey-entry">
          <div className="interactive-card">
            <img
              src="/assets/orchestra.png"
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
              src="/assets/chicago.png"
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
