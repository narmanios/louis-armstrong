import React, { useState } from "react";
import { SectionAboutProject } from "./SectionAboutProject";

interface SectionIntroHeroProps {
  onNavigateHistory: () => void;
  onNavigateMusician: () => void;
  onNavigateAmbassador: () => void;
  sectionRef?: React.Ref<HTMLElement>;
}

const heroForegroundScale = 0.78;
const scalePx = (value: number) =>
  `${Math.round(value * heroForegroundScale)}px`;

export const SectionIntroHero: React.FC<SectionIntroHeroProps> = ({
  onNavigateHistory,
  onNavigateMusician,
  onNavigateAmbassador,
  sectionRef,
}) => {
  const [isAboutOverlayOpen, setIsAboutOverlayOpen] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="mcg-section mcg-hero-wrap hero-intro-section hero-intro"
      style={{
        backgroundColor: "#f9e4d2",
        position: "relative",
      }}
    >
      <style>{`
        .hero-intro {
          position: relative;
          background: #ffffff;
        }

        .hero-intro-title-line {
          margin: 0;
          font-family: "Andale Mono", "Andale Mono WT", monospace;
          font-weight: 700;
          line-height: 0.9;
          color: #cf6b4c;
          letter-spacing: -0.03em;
        }

        .hero-intro-kicker {
          position: static;
          display: block;
          font-family: "Helvetica Neue", sans-serif;
          font-weight: 700;
          color: #000000;
          white-space: nowrap;
          margin: 0;
          line-height: 1;
        }

        .hero-intro-shadow {
          position: absolute;
          left: 210px;
          bottom: 0;
          width: 460px;
          z-index: 1;
          pointer-events: none;
        }

        .hero-intro-portrait {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 380px;
          z-index: 2;
          pointer-events: none;
        }

        .hero-intro-title-block {
          position: absolute;
          left: 72px;
          top: 72px;
          z-index: 5;
        }

        .hero-intro-title-row {
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }

        .hero-intro-nav{
          position: absolute;
          z-index: 10;
        }

        .hero-intro-nav {
          right: 56px;
          bottom: 24px;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          gap: 12px;
        }

        // .hero-intro-nav-link,
        // .hero-intro-explore-button,
        // .hero-intro-about-button {
        //   background: none;
        //   border: none;
        //   cursor: pointer;
        //   padding: 0;
        //   color: #ffd000;
        //   font-size: 16px;
        //   font-weight: 400;
        //   font-family: "Helvetica Neue", sans-serif;
        // }

        .hero-intro-about-button {
          position: relative;
          width: 26px;
          height: 320px;
          display: block;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hero-intro-about-button .hero-intro-nav-link-label {
          font-size: 16px;
          color: #000000;
        }


        .hero-intro-nav-link {
          position: relative;
          width: 86px;
          height: 320px;
          display: block;
        }

        .hero-intro-nav-link-label {
          position: absolute;
          left: 0;
          bottom: 0;
          display: block;
          transform: rotate(-90deg);
          transform-origin: left bottom;
          white-space: nowrap;
          font-size: 80px;
          line-height: 0.82;
          letter-spacing: -0.06em;
          font-weight: 700;
          font-family: "Andale Mono", "Andale Mono WT", monospace;
          color: #000000;
          opacity: 0.28;
          transition: opacity 0.18s ease;
        }

        

        .hero-intro-nav-link--history .hero-intro-nav-link-label {
          color: #cf6b4c;
        }

        .hero-intro-nav-link--legacy .hero-intro-nav-link-label {
          color: #6b7b4a;
        }

        .hero-intro-nav-link--ambassador .hero-intro-nav-link-label {
          color: #4f6f9a;
        }

        .hero-intro-nav-link:hover .hero-intro-nav-link-label,
        .hero-intro-nav-link:focus-visible .hero-intro-nav-link-label {
          opacity: 1;
        }

        .hero-intro-explore-button {
          right: ${scalePx(150)};
          bottom: ${scalePx(110)};
        }

        .hero-intro-about-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          box-sizing: border-box;
        }

        .hero-intro-about-overlay-content {
          position: relative;
          width: min(100vw, 1280px);
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 10px;
          background-color: #ffffff;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
          -webkit-overflow-scrolling: touch;
        }

        .hero-intro-about-close-button {
          position: absolute;
          top: 40px;
          right: 40px;
          z-index: 5;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
        }

        .hero-intro-about-close-icon {
          width: 30px;
          height: 30px;
          filter: brightness(0);
        }

        /* Responsive hero styles */
        @media (max-width: 768px) {
          .hero-intro {
            min-height: 760px;
          }

          .hero-intro-shadow {
            left: 110px;
            width: 300px;
          }

          .hero-intro-portrait {
            width: 280px;
            bottom: 0;
          }

          .hero-intro-title-block {
            left: 50%;
            top: 90px;
            transform: translateX(-50%);
            text-align: center;
            width: 100%;
            max-width: 320px;
          }

          .hero-intro-title-row {
            display: block;
          }

          .hero-intro-title-line {
            text-align: center;
          }

          .hero-intro-kicker {
            position: static;
            display: block;
            margin: 0 0 12px 0;
            text-align: center;
            white-space: normal;
            font-size: 18px !important;
            max-width: none;
          }

          .hero-intro-nav {
            right: 24px;
            bottom: 90px;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
          }

          .hero-intro-nav-link,
          .hero-intro-explore-button,
          .hero-intro-about-button {
            font-size: 14px;
          }

          .hero-intro-nav-link {
            width: auto;
            height: auto;
          }

          .hero-intro-about-button {
            width: auto;
            height: auto;
          }

          .hero-intro-nav-link-label {
            position: static;
            transform: none;
            font-size: 14px;
            line-height: 1;
            letter-spacing: 0.02em;
            font-weight: 400;
            font-family: "Andale Mono", "Andale Mono WT", monospace;
            color: #000000;
            opacity: 1;
          }

          .hero-intro-explore-button {
            bottom: 78px;
          }

          /* tablet/smaller desktop overlay stays modal */
          .hero-intro-about-overlay {
            padding: 12px;
            align-items: center;
            justify-content: center;
          }

          .hero-intro-about-overlay-content {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-radius: 0 !important;
          }

          .hero-intro-about-close-button {
            top: 16px;
            right: 16px;
          }

          .hero-intro-about-close-icon {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 560px) {
          .hero-intro {
            min-height: 700px;
          }

          .hero-intro-shadow {
            left: 55px;
            width: 300px;
          }

          .hero-intro-portrait {
            width: 220px;
          }

          .hero-intro-title-block {
            left: 50%;
            top: 78px;
            transform: translateX(-50%);
            text-align: center;
            width: 100%;
            max-width: 320px;
          }

          .hero-intro-title-row {
            display: block;
          }

          .hero-intro-title-line {
            line-height: 0.92;
            text-align: center;
          }

          .hero-intro-kicker {
            position: static;
            display: block;
            margin: 0 0 10px 0;
            text-align: center;
            white-space: normal;
            font-size: 16px !important;
            max-width: none;
          }

          .hero-intro-nav {
            right: 18px;
            bottom: 78px;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
          }

          .hero-intro-nav-link,
          .hero-intro-explore-button,
          .hero-intro-about-button {
            font-size: 13px;
          }

          .hero-intro-nav-link {
            width: auto;
            height: auto;
          }

          .hero-intro-about-button {
            width: auto;
            height: auto;
          }

          .hero-intro-nav-link-label {
            position: static;
            transform: none;
            font-size: 13px;
            line-height: 1;
            letter-spacing: 0.02em;
            font-weight: 400;
            font-family: "Andale Mono", "Andale Mono WT", monospace;
            color: #000000;
            opacity: 1;
          }

          .hero-intro-explore-button {
            bottom: 68px;
          }

          /* phone overlay becomes full-screen */
          .hero-intro-about-overlay {
            padding: 0 !important;
            align-items: stretch !important;
            justify-content: stretch !important;
          }

          .hero-intro-about-overlay-content {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            border-radius: 0 !important;
          }

          .hero-intro-about-close-button {
            top: 12px !important;
            right: 12px !important;
          }

          .hero-intro-about-close-icon {
            width: 22px !important;
            height: 22px !important;
          }
        }
      `}</style>

      <img
        src="/images/shadow.png"
        alt="Shadow Overlay"
        className="mcg-hero-overlay1 hero-intro-shadow"
      />

      <img
        src="/images/louis-intro3.png"
        alt="Louis Armstrong"
        className="mcg-hero-overlay2 hero-intro-portrait"
      />

      <div className="mcg-hero-title hero-intro-title-block">
        <div className="hero-intro-title-row">
          <p
            className="hero-intro-title-line"
            style={{
              fontSize: "clamp(56px, 8vw, 118px)",
            }}
          >
            Louis
          </p>

          <p
            className="hero-intro-kicker"
            style={{
              fontSize: "clamp(14px, 2.2vw, 38px)",
              margin: "14px 0 0 6px",
            }}
          >
            A Musical Ambassador
          </p>
        </div>

        <p
          className="hero-intro-title-line"
          style={{
            fontSize: "clamp(64px, 9vw, 132px)",
          }}
        >
          Armstrong
        </p>
      </div>

      <div className="hero-intro-nav">
        <button
          onClick={onNavigateHistory}
          className="hero-intro-nav-link hero-intro-nav-link--history"
        >
          <span className="hero-intro-nav-link-label">History</span>
        </button>
        <button
          onClick={onNavigateAmbassador}
          className="hero-intro-nav-link hero-intro-nav-link--ambassador"
        >
          <span className="hero-intro-nav-link-label">Ambassador</span>
        </button>
        <button
          onClick={onNavigateMusician}
          className="hero-intro-nav-link hero-intro-nav-link--legacy"
        >
          <span className="hero-intro-nav-link-label">Legacy</span>
        </button>
        <button
          onClick={() => setIsAboutOverlayOpen(true)}
          className="hero-intro-nav-link hero-intro-about-button"
        >
          <span className="hero-intro-nav-link-label">About this project</span>
        </button>
      </div>

      {isAboutOverlayOpen && (
        <div
          className="mcg-about-overlay hero-intro-about-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="mcg-about-overlay-content hero-intro-about-overlay-content"
            style={{
              position: "relative",
              width: "min(100vw, 1280px)",
              maxHeight: "90vh",
              overflowY: "auto",
              overflowX: "hidden",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.35)",
            }}
          >
            <button
              aria-label="Close about overlay"
              onClick={() => setIsAboutOverlayOpen(false)}
              className="hero-intro-about-close-button"
              style={{
                position: "absolute",
                top: "40px",
                right: "40px",
                zIndex: 5,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px",
              }}
            >
              <img
                src="/images/close.svg"
                alt="Close"
                className="hero-intro-about-close-icon"
                style={{
                  width: "30px",
                  height: "30px",
                  filter: "brightness(0)",
                }}
              />
            </button>

            <SectionAboutProject />
          </div>
        </div>
      )}
    </section>
  );
};
