import React from "react";

export const SectionWorldFair: React.FC = () => {
  return (
    <section className="mcg-section world-fair-section">
      <style>{`
        .world-fair-section {
          background: #000000;
        }

        .world-fair-section .mcg-page-title {
          color: #ffffff;
        }

        .world-fair-entry-grid {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 56px;
          position: absolute;
          left: 56px;
          top: 164px;
        }

        .world-fair-entry {
          width: min(340px, calc((100vw - 280px) / 2));
        }

        .world-fair-media-image {
          width: 100%;
          aspect-ratio: 470 / 360;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .world-fair-caption,
        .world-fair-copy {
          margin: 0;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
          color: #ffffff;
        }

        .world-fair-caption {
          margin-top: 12px;
        }

        .world-fair-copy {
          width: 100%;
          line-height: 20px;
          margin-top: 16px;
        }

        @media (max-width: 767px) {
          .world-fair-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .world-fair-section .mcg-page-title {
            position: static !important;
            margin: 0 0 20px 0 !important;
          }

          .world-fair-entry-grid {
            position: static;
            left: auto;
            top: auto;
            flex-direction: column;
            gap: 20px;
          }

          .world-fair-entry,
          .world-fair-copy {
            width: 100%;
          }

          .world-fair-media-image {
            width: 100%;
            height: 220px;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title">World Fair + Berlin</h2>

      <div className="world-fair-entry-grid">
        <div className="world-fair-entry">
          <div className="interactive-card">
            <img
              src="/images/orchestra.png"
              alt="Orchestra"
              className="world-fair-media-image"
            />
          </div>
          <p className="world-fair-caption">
            Louis Armstrong and his Orchestra (1929)
          </p>
          <p className="world-fair-copy">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            ullamcorper erat tortor, at accumsan sapien molestie et. Sed
            hendrerit velit vel neque molestie eleifend. Ut sodales lorem vel
            mauris malesuada maximus.
          </p>
        </div>

        <div className="world-fair-entry">
          <div className="interactive-card">
            <img
              src="/images/chicago.png"
              alt="Chicago"
              className="world-fair-media-image"
            />
          </div>
          <p className="world-fair-caption">Chicago</p>
          <p className="world-fair-copy">
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
