import React from "react";

export const SectionTheBeginning: React.FC = () => {
  return (
    <section className="mcg-section beginning-section">
      <style>{`
        .beginning-section {
          background: #000000;
        }

        .beginning-section .mcg-page-title {
          color: #ffffff;
        }

        .beginning-entry-grid {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 56px;
          position: absolute;
          left: 56px;
          top: 164px;
        }

        .beginning-entry {
          width: min(340px, calc((100vw - 280px) / 2));
        }

        .beginning-media-image {
          width: 100%;
          aspect-ratio: 470 / 360;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .beginning-caption,
        .beginning-copy {
          margin: 0;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
          color: #ffffff;
        }

        .beginning-caption {
          margin-top: 12px;
        }

        .beginning-copy {
          width: 100%;
          line-height: 20px;
          margin-top: 16px;
        }

        @media (max-width: 767px) {
          .beginning-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .beginning-section .mcg-page-title {
            position: static !important;
            margin: 0 0 20px 0 !important;
          }

          .beginning-entry-grid {
            position: static;
            left: auto;
            top: auto;
            flex-direction: column;
            gap: 20px;
          }

          .beginning-entry,
          .beginning-copy {
            width: 100%;
          }

          .beginning-media-image {
            width: 100%;
            height: 220px;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title">The Beginning</h2>

      <div className="beginning-entry-grid">
        <div className="beginning-entry">
          <div className="interactive-card">
            <img
              src="/images/waifs-home.png"
              alt="Waifs home band"
              className="beginning-media-image"
            />
          </div>
        <p className="beginning-caption">
            Louis Armstrong and his Orchestra (1929)
          </p>
          <p className="beginning-copy">
            Text about Louis Armstrong and his Orchestra goes here. Text about
            Louis Armstrong and his Orchestra goes here. Text about Louis
            Armstrong and his Orchestra goes here. Text about Louis Armstrong
            and his Orchestra goes here.
          </p>
        </div>

        <div className="beginning-entry">
          <div className="interactive-card">
            <img
              src="/images/young-louis.png"
              alt="Young Louis"
              className="beginning-media-image"
            />
          </div>
          <p className="beginning-caption">Young Louis</p>
          <p className="beginning-copy">
            Text about young Louis goes here. Text about young Louis goes here.
            Text about young Louis goes here. Text about young Louis goes here.
            Text about young Louis goes here. Text about young Louis goes here.
            Text about young Louis goes here.
          </p>
        </div>
      </div>
    </section>
  );
};
