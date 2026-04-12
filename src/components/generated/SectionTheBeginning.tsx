import React from "react";

export const SectionTheBeginning: React.FC = () => {
  return (
    <section className="mcg-section beginning-section">
      <style>{`
        .beginning-section {
          background: transparent;
          min-height: 100dvh;
          height: auto;
          display: flow-root;
          overflow: visible;
          padding: 0 56px 60px;
          box-sizing: border-box;
        }

        .beginning-entry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: start;
          gap: 32px 56px;
          position: static;
          margin-top: 24px;
        }

        .beginning-entry {
          width: 100%;
          display: block;
        }

        .beginning-media-image {
          width: 100%;
          aspect-ratio: 470 / 360;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .beginning-image-wrap {
          position: relative;
          transition: transform 0.25s ease;
          transform-origin: center center;
        }

        .beginning-image-wrap:hover {
          transform: scale(1.03);
        }

        .beginning-logo-link {
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

        .beginning-logo-link img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
        }

        .beginning-caption,
        .beginning-copy {
          margin: 0;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 28px;
          color: #000000;
        }

        .beginning-caption {
          font-size: 11px;
        }

        .beginning-section .mcg-page-title {
          color: #000000 !important;
        }

        .beginning-caption {
          margin-top: 12px;
        }

        .beginning-copy {
          width: 100%;
          line-height: 40px;
          margin-top: 12px;
        }

        .beginning-text {
          display: block;
        }

        @media (max-width: 768px) {
          .beginning-section {
            height: auto;
            min-height: 0;
            overflow: visible;
            padding: 24px 20px 32px;
            box-sizing: border-box;
          }

          .beginning-section .mcg-page-title {
            position: static !important;
            display: block !important;
            width: calc(100% - 40px);
            margin: 0 auto 24px !important;
          }

          .beginning-entry-grid {
            position: static;
            left: auto;
            top: auto;
            display: flex;
            flex-direction: column;
            gap: 32px;
            margin-top: 0;
          }

          .beginning-entry,
          .beginning-copy {
            width: 100%;
          }

          .beginning-entry {
            display: block;
            width: calc(100% - 56px);
            margin: 0 0 0 20px;
          }

          .beginning-media-image {
            width: 100%;
            aspect-ratio: 5 / 4;
            height: auto;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title mcg-page-title--flow">
        The Beginning
      </h2>

      <div className="beginning-entry-grid">
        <div className="beginning-entry">
          <div className="beginning-image-wrap">
            <img
              src="/assets/waifs-home.png"
              alt="Waifs home band"
              className="beginning-media-image"
            />
            <a
              className="beginning-logo-link"
              href="https://www.louisarmstronghouse.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Louis Armstrong House website"
            >
              <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
            </a>
          </div>
          <p className="beginning-caption">
            Waif's Home Band, New Orleans, 1910s. Photo by Ernest J. Bellocq.
          </p>
          <div className="beginning-text">
            <p className="beginning-copy">
              The reform school where Louis Armstrong spent part of his youth
              and began developing his musical skills.
            </p>
          </div>
        </div>

        <div className="beginning-entry">
          <div className="beginning-image-wrap">
            <img
              src="/assets/2006_1_3a.jpg"
              alt="Creole Jazz Band"
              className="beginning-media-image"
            />
            <a
              className="beginning-logo-link"
              href="https://www.louisarmstronghouse.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Louis Armstrong House website"
            >
              <img src="/assets/logo_light.png" alt="" aria-hidden="true" />
            </a>
          </div>
          <p className="beginning-caption">King Oliver's Creole Jazz Band</p>
          <div className="beginning-text">
            <p className="beginning-copy">
              King Oliver’s Creole Jazz Band was one of the most important early
              jazz groups, that helped launch Louis Armstrong’s rise as a major
              figure in American music.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
