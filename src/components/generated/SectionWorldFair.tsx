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

        .world-fair-image-wrap {
          position: relative;
          transition: transform 0.25s ease;
          transform-origin: center center;
        }

        .world-fair-image-wrap:hover {
          transform: scale(1.03);
        }

        .world-fair-logo-link {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 76px;
          height: 76px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .world-fair-logo-link img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
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
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        World Fair + Berlin
      </h2>

      <div className="world-fair-entry-grid">
        <div className="world-fair-entry">
          <div className="world-fair-image-wrap">
            <a
              href="https://collections.louisarmstronghouse.org/asset-detail/1198635"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", cursor: "pointer" }}
            >
              <img
                src="/assets/worldsfair.jpg"
                alt="World Fair"
                className="world-fair-media-image"
              />
            </a>
            <a
              className="world-fair-logo-link"
              href="https://www.louisarmstronghouse.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Louis Armstrong House website"
            >
              <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
            </a>
          </div>
          <p className="world-fair-caption">
            World's Fair Louis Armstrong Day (1964)
          </p>
          <div className="world-fair-text">
            <p className="world-fair-copy">
              June 30, 1964, was declared “Louis Armstrong Day” at the 1964
              World’s Fair, honoring his global influence and cultural legacy.
            </p>
          </div>
        </div>

        <div className="world-fair-entry">
          <div className="world-fair-image-wrap">
            <a
              href="https://collections.louisarmstronghouse.org/asset-detail/1197712"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", cursor: "pointer" }}
            >
              <img
                src="/assets/berlin.jpg"
                alt="East Berlin"
                className="world-fair-media-image"
              />
            </a>
            <a
              className="world-fair-logo-link"
              href="https://www.louisarmstronghouse.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Louis Armstrong House website"
            >
              <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
            </a>
          </div>
          <p className="world-fair-caption">East Berlin</p>
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
