import React from "react";

export const SectionAboutProject: React.FC = () => {
  return (
    <section className="mcg-section about-project-section">
      <style>{`
        .about-project-section {
          background: #ffffff;
        }

        .about-project-layout {
          position: absolute;
          left: 56px;
          top: 164px;
          display: flex;
          gap: 142px;
          align-items: flex-start;
        }

        .about-project-copy {
          width: 383px;
          margin: 0;
          color: #000000;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 14px;
          line-height: 22px;
        }

        .about-project-figure {
          margin: 0;
          width: 420px;
        }

        .about-project-image {
          width: 420px;
          height: 526px;
          object-fit: cover;
          display: block;
        }

        .about-project-caption {
          margin: 8px 0 0;
          color: #000000;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .about-project-section {
            min-height: 100%;
            padding: 88px 20px 32px;
            box-sizing: border-box;
          }

          .about-project-section .mcg-page-title {
            position: static !important;
            display: block !important;
            margin: 0 0 32px 0 !important;
            padding-right: 44px;
          }

          .about-project-layout {
            position: static;
            display: flex;
            flex-direction: column;
            gap: 0px;
            margin-top: 0;
          }

          .about-project-copy {
            margin: 32px;
            width: 75%;}

          .about-project-figure {
            width: min(100%, 320px);
            margin: 32px;
          }

          .about-project-image {
            width: 100%;
            aspect-ratio: 4 / 5;
            height: auto;
            max-height: none;
            object-position: center top;
          }
        }
      `}</style>

      <h2 className="mcg-section-title mcg-page-title">About this Project</h2>

      <div className="about-project-layout">
        <p className="about-project-copy">
          This project, Louis Armstrong: The Real Ambassador, examines how
          Armstrong&apos;s career illuminates the intersections of music, race,
          politics, and U.S. cultural diplomacy in the mid-twentieth century. By
          tracing his international tours, the circulation and reinterpretation
          of his songs, and the political contexts surrounding his performances,
          the project shows how Armstrong became more than a jazz icon: he
          emerged as a powerful, if sometimes conflicted, symbol of American
          ambassadorship. At the same time, it asks how that role was shaped not
          only by official diplomacy, but also by the afterlife of his music,
          which continued to carry ideas of goodwill, freedom, and connection
          across borders long after his travels ended.
        </p>

        <figure className="about-project-figure">
          <img
            src="/images/about-this-project.png"
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
