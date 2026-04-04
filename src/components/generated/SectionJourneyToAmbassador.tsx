import React from "react";

export const SectionJourneyToAmbassador: React.FC = () => {
  return (
    <section className="mcg-section journey-section">
      <style>{`
        .journey-section {
          background: transparent;
          min-height: 100dvh;
          height: auto;
          display: flow-root;
          overflow: visible;
          padding: 0 56px 60px;
          box-sizing: border-box;
        }

        .journey-entry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: start;
          gap: 32px 56px;
          position: static;
          margin-top: 24px;
        }

        .journey-entry {
          width: 100%;
          display: block;
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
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 28px;
          color: #000000;
        }

        .journey-caption {
          font-size: 11px;
        }

        .journey-section .mcg-page-title {
          color: #000000 !important;
        }

        .journey-caption {
          margin-top: 12px;
        }

        .journey-copy {
          width: 100%;
          line-height: 40px;
          margin-top: 12px;
        }

        .journey-text {
          display: block;
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
            display: flex;
            flex-direction: column;
            gap: 32px;
            margin-top: 0;
          }

          .journey-entry,
          .journey-copy {
            width: 100%;
          }

          .journey-entry {
            display: block;
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
        Journey to Ambassador
      </h2>

      <div className="journey-entry-grid">
        <div className="journey-entry">
          <div>
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
          </div>
          <div className="journey-text">
            <p className="journey-copy">
              In 1929, Armstrong moved to New York and began fronting a big
              band, Louis Armstrong and His Orchestra.
            </p>
          </div>
        </div>

        <div className="journey-entry">
          <div>
            <div className="interactive-card">
              <img
                src="/assets/pennies.jpg"
                alt="Pennies from Heaven"
                className="journey-media-image"
              />
            </div>
            <p className="journey-caption">
              "Pennies from Heaven" with Bing Crosby
            </p>
          </div>
          <div className="journey-text">
            <p className="journey-copy">
              Armstrong made his film debut in 1930 and, by 1936, became the
              first African American to receive featured billing in Pennies from
              Heaven.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
