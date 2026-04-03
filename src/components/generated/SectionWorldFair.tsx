import React from "react";

export const SectionWorldFair: React.FC = () => {
  return (
    <section className="mcg-section world-fair-section">
      <style>{`
        .world-fair-section {
          background: transparent;
          min-height: 100dvh;
          height: auto;
          display: flow-root;
          overflow: visible;
          padding: 0 56px 60px;
          box-sizing: border-box;
        }

        .world-fair-entry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: start;
          gap: 32px 56px;
          position: static;
          margin-top: 24px;
        }

        .world-fair-entry {
          width: 100%;
          display: block;
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
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 28px;
          color: #000000;
        }

        .world-fair-caption {
          font-size: 11px;
        }

        .world-fair-section .mcg-page-title {
          color: #000000 !important;
        }

        .world-fair-caption {
          margin-top: 12px;
        }

        .world-fair-copy {
          width: 100%;
          line-height: 40px;
          margin-top: 12px;
        }

        .world-fair-text {
          display: block;
        }

        @media (max-width: 768px) {
          .world-fair-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .world-fair-section .mcg-page-title {
            position: static !important;
            display: block !important;
            width: calc(100% - 40px);
            margin: 0 auto 24px !important;
          }

          .world-fair-entry-grid {
            position: static;
            left: auto;
            top: auto;
            display: flex;
            flex-direction: column;
            gap: 32px;
            margin-top: 0;
          }

          .world-fair-entry,
          .world-fair-copy {
            width: 100%;
          }

          .world-fair-entry {
            display: block;
            width: calc(100% - 56px);
            margin: 0 0 0 20px;
          }

          .world-fair-media-image {
            width: 100%;
            aspect-ratio: 5 / 4;
            height: auto;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        World Fair + Berlin
      </h2>

      <div className="world-fair-entry-grid">
        <div className="world-fair-entry">
          <div>
            <img
              src="/assets/worldsfair.jpg"
              alt="World Fair"
              className="world-fair-media-image"
            />
            <p className="world-fair-caption">
              World's Fair Louis Armstrong Day (1964)
            </p>
          </div>
          <div className="world-fair-text">
            <p className="world-fair-copy">
              June 30, 1964, was declared “Louis Armstrong Day” at the 1964
              World’s Fair, honoring his global influence and cultural legacy.
            </p>
          </div>
        </div>

        <div className="world-fair-entry">
          <div>
            <img
              src="/assets/berlin.jpg"
              alt="East Berlin"
              className="world-fair-media-image"
            />
            <p className="world-fair-caption">East Berlin</p>
          </div>
          <div className="world-fair-text">
            <p className="world-fair-copy">
              In 1965, Armstrong toured behind the Iron Curtain, including East
              Berlin, where he sold out every show despite his records being
              unavailable there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
