import React from "react";

export const SectionAboutProject: React.FC = () => {
  return (
    <section className="mcg-section about-project-section">
      <style>{`
        .about-project-section {
          --about-project-max-width: 1280px;
          --about-project-layout-width: min(100vw, var(--about-project-max-width));
        }

        .about-project-section {
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .about-project-section .about-project-title.mcg-page-title {
          left: 56px !important;
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
        }

        .about-project-layout {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: stretch;
          width: var(--about-project-layout-width);
          max-width: var(--about-project-max-width);
          height: 100%;
          overflow: hidden;
        }

        .about-project-text-panel {
          flex: 0 0 50%;
          width: 50%;
          max-width: 50%;
          min-width: 50%;
          padding: 164px 56px 60px;
          box-sizing: border-box;
          display: flex;
          align-items: flex-start;
          overflow: hidden;
        }

        .about-project-copy {
          width: min(100%, 383px);
          max-width: 383px;
          margin: 0;
          color: #000000;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 14px;
          line-height: 22px;
        }

        .about-project-figure {
          flex: 0 0 50%;
          width: 50%;
          max-width: 50%;
          min-width: 50%;
          margin: 0;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .about-project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .about-project-caption {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 24px;
          margin: 0;
          color: #ffffff;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 12px;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .about-project-section {
            min-height: 100%;
            padding: 88px 20px 32px;
            box-sizing: border-box;
          }

          .about-project-section .about-project-title.mcg-page-title {
            left: auto !important;
            position: static !important;
            display: block !important;
            margin: 0 0 32px 0 !important;
            padding-right: 44px;
          }

          .about-project-layout {
            position: static;
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-top: 0;
            width: auto;
            max-width: none;
            overflow: visible;
            height: auto;
          }

          .about-project-text-panel {
            order: 1;
            flex: none;
            width: auto;
            max-width: none;
            min-width: 0;
            padding: 0;
            display: block;
            overflow: visible;
          }

          .about-project-copy {
            margin: 0;
            width: 100%;
            max-width: none;
          }

          .about-project-figure {
            order: 2;
            flex: none;
            width: 100%;
            max-width: none;
            min-width: 0;
            height: auto;
            margin: 0;
            overflow: visible;
          }

          .about-project-image {
            width: 100%;
            aspect-ratio: 4 / 5;
            height: auto;
            max-height: none;
            object-position: center top;
          }

          .about-project-caption {
            position: static;
            margin: 8px 0 0;
            color: #000000;
            text-shadow: none;
          }
        }
      `}</style>

      <h2 className="about-project-title mcg-section-title mcg-page-title mcg-page-title--light">
        About this Project
      </h2>

      <div className="about-project-layout">
        <div className="about-project-text-panel">
          <p className="about-project-copy">
            This project, The Story of Louis Armstrong in Data and Song,
            examines how Armstrong’s career illuminates the intersections of
            music, race, politics, and U.S. cultural diplomacy in the
            mid-twentieth century till the present. By tracing his international
            tours, the circulation and reinterpretation of his songs, and the
            political contexts surrounding his performances, the project shows
            how Armstrong became more than a jazz icon: he emerged as a
            powerful, if sometimes conflicted, symbol of American
            ambassadorship. At the same time, it asks how that role was shaped
            not only by official diplomacy, but also by the afterlife of his
            music, which continued to carry ideas of goodwill, freedom, and
            connection across borders long after his travels ended.
            <br />
            <br />
            Thank you to SecondHandSongs for providing data on cover versions of
            Armstrong's songs.<br></br>
            <a href="https://secondhandsongs.com/" target="_blank">
              https://secondhandsongs.com/
            </a>
            <br />
            <br />
            Thank you to Ricky Riccardi, Director of Research Collections at the
            Louis Armstrong House Museum. Archival images courtesy of the Louis
            Armstrong House Museum.
            <br></br>
            <a href="https://www.louisarmstronghouse.org/" target="_blank">
              https://www.louisarmstronghouse.org/
            </a>
          </p>
        </div>

        <figure className="about-project-figure">
          <img
            src="/assets/about-this-project.png"
            alt="Louis Armstrong 1929"
            className="about-project-image"
          />
          <figcaption className="about-project-caption">
            Louis Armstrong (1929)
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
