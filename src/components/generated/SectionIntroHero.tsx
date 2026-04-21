import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";

interface SectionIntroHeroProps {
  onNavigateHistory: () => void;
  onNavigateLegacy: () => void;
  onNavigateAmbassador: () => void;
  onOpenAboutOverlay: () => void;
  isIntroActive?: boolean;
  isTransitionOverlayActive?: boolean;
  sectionRef?: React.Ref<HTMLElement>;
}

const heroForegroundScale = 0.78;
const panelTransitionDurationMs = 780;

type HeroPanelKey = "history" | "ambassador" | "legacy";

const scalePx = (value: number) =>
  `${Math.round(value * heroForegroundScale)}px`;

export const SectionIntroHero: React.FC<SectionIntroHeroProps> = ({
  onNavigateHistory,
  onNavigateLegacy,
  onNavigateAmbassador,
  onOpenAboutOverlay,
  isIntroActive = false,
  isTransitionOverlayActive = false,
  sectionRef,
}) => {
  const [transitionTarget, setTransitionTarget] = useState<HeroPanelKey | null>(
    null,
  );
  const isMobile = useIsMobile();
  const previousIntroActiveRef = useRef(isIntroActive);

  useEffect(() => {
    if (isIntroActive && !previousIntroActiveRef.current) {
      setTransitionTarget(null);
    }

    previousIntroActiveRef.current = isIntroActive;
  }, [isIntroActive]);

  const openAboutOverlay = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (transitionTarget !== null) {
      return;
    }

    onOpenAboutOverlay();
  };

  const handlePanelNavigation = (
    panelKey: HeroPanelKey,
    onNavigate: () => void,
  ) => {
    if (transitionTarget !== null) {
      return;
    }

    if (isMobile) {
      onNavigate();
      return;
    }

    setTransitionTarget(panelKey);
    onNavigate();
  };

  return (
    <section
      ref={sectionRef}
      className={`mcg-section mcg-hero-wrap hero-intro-section hero-intro${
        transitionTarget ? " hero-intro--transitioning" : ""
      }${
        transitionTarget && isTransitionOverlayActive
          ? " hero-intro--overlay-active"
          : ""
      }`}
      style={{
        backgroundColor: "#000000",
        position: "relative",
      }}
    >
      <style>{`
        .hero-intro {
          position: relative;
          background: #ffffff;
          font-family: "Hanken Grotesk", Arial, sans-serif;
        }

        .hero-intro--overlay-active {
          position: fixed !important;
          inset: 0;
          width: 100vw !important;
          min-width: 0 !important;
          height: 100dvh;
          z-index: 40;
          overflow: hidden;
          pointer-events: none;
          background: transparent !important;
        }



        
        .hero-intro button,
        .hero-intro p,
        .hero-intro span {
          font-family: "Hanken Grotesk", Arial, sans-serif;
        }

        .hero-intro-panel-grid {
          position: absolute;
          inset: 0;
          width: 100vw;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          z-index: 12;
          overflow: hidden;
        }

        .hero-intro-panel {
          position: relative;
          height: 100%;
          overflow: hidden;
          transition:
            transform ${panelTransitionDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 160ms linear,
            background-color 220ms ease;
          will-change: transform, opacity;
        }

        .hero-intro-panel--history {
          background: #2a2a2a;
        }

        .hero-intro-panel--ambassador {
          background: #1f1f1f;
        }

        .hero-intro-panel--legacy {
          background: #151515;
        }

        .hero-intro-panel-media {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .hero-intro-panel-media img,
        .hero-intro-panel-media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: opacity 0.22s ease;
        }

        .hero-intro-panel-media img {
          object-position: center center;
          filter: brightness(0.92) contrast(1.04);
          opacity: 1;
        }

        .hero-intro-panel-media video {
          object-position: 58% center;
          filter: brightness(1.18) contrast(1.06);
          opacity: 0;
        }

        .hero-intro-panel--history::before,
        .hero-intro-panel--ambassador::before,
        .hero-intro-panel--legacy::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          transition: opacity 0.22s ease;
        }

        .hero-intro-panel--history::before {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.10) 0%,
            rgba(0, 0, 0, 0.24) 100%
          );
        }

        .hero-intro-panel--ambassador::before {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.10) 0%,
            rgba(0, 0, 0, 0.26) 100%
          );
        }

        .hero-intro-panel--legacy::before {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.04) 0%,
            rgba(0, 0, 0, 0.18) 100%
          );
        }

        .hero-intro-panel--history:hover .hero-intro-panel-media video,
        .hero-intro-panel--history:focus-within .hero-intro-panel-media video,
        .hero-intro-panel--ambassador:hover .hero-intro-panel-media video,
        .hero-intro-panel--ambassador:focus-within .hero-intro-panel-media video,
        .hero-intro-panel--legacy:hover .hero-intro-panel-media video,
        .hero-intro-panel--legacy:focus-within .hero-intro-panel-media video {
          opacity: 0.92;
        }

        .hero-intro-panel--history:hover .hero-intro-panel-media img,
        .hero-intro-panel--history:focus-within .hero-intro-panel-media img,
        .hero-intro-panel--ambassador:hover .hero-intro-panel-media img,
        .hero-intro-panel--ambassador:focus-within .hero-intro-panel-media img,
        .hero-intro-panel--legacy:hover .hero-intro-panel-media img,
        .hero-intro-panel--legacy:focus-within .hero-intro-panel-media img {
          opacity: 0.18;
        }

        .hero-intro-panel--history:hover::before,
        .hero-intro-panel--history:focus-within::before,
        .hero-intro-panel--ambassador:hover::before,
        .hero-intro-panel--ambassador:focus-within::before,
        .hero-intro-panel--legacy:hover::before,
        .hero-intro-panel--legacy:focus-within::before {
          opacity: 0.55;
        }

        .hero-intro-panel-button {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          z-index: 2;
        }

        .hero-intro--transitioning .hero-intro-panel-grid,
        .hero-intro--transitioning .hero-intro-nav {
          pointer-events: none;
        }

        .hero-intro--transitioning .hero-intro-panel-grid {
          inset: 0;
          width: 100vw;
        }

        .hero-intro--transitioning .hero-intro-panel {
          background: #000000;
        }

        .hero-intro--transitioning .hero-intro-panel--history {
          transform: translate3d(-104%, 0, 0);
        }

        .hero-intro--transitioning .hero-intro-panel--ambassador {
          opacity: 0;
        }

        .hero-intro--transitioning .hero-intro-panel--legacy {
          transform: translate3d(104%, 0, 0);
        }

        .hero-intro-title-line {
          margin: 0;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-weight: 600;
          line-height: 0.9;
          color: #ffffff;
          letter-spacing: -0.03em;
        }

        .hero-intro-title-main {
          display: block;
          width: 100%;
          white-space: nowrap;
          line-height: 0.88;
        }

        .hero-intro-kicker {
          position: absolute;
          top: 0px;
          right: 0;
          display: block;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-weight: 600;
          color: #ffdd1d;
          white-space: nowrap;
          margin: 0;
          line-height: 1;
        }

       

        .hero-intro-logo {
          position: absolute;
          left: 32px;
          bottom: 24px;
          width: 110px;
          z-index: 14;
          cursor: pointer;
        }

        .hero-intro-title-block {
          position: absolute;
          left: 32px;
          right: 32px;
          top: 56px;
          z-index: 14;
          pointer-events: none;
        }

        .hero-intro-title-row {
          position: relative;
          width: 100%;
        }

        .hero-intro-nav {
          position: absolute;
          z-index: 14;
          right: 24px;
          bottom: 24px;
        }

        .hero-intro--transitioning .hero-intro-title-block,
        .hero-intro--transitioning .hero-intro-logo,
        .hero-intro--transitioning .hero-intro-shadow,
        .hero-intro--transitioning .hero-intro-nav {
          opacity: 0;
          transition: opacity 90ms linear;
        }

        .hero-intro-about-button {
          position: relative;
          width: 40px;
          height: 250px;
          display: block;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .hero-intro-about-button .hero-intro-nav-link-label {
          position: absolute;
          right: calc(100% + 12px);
          left: auto;
          bottom: 0%;
          display: block;
          transform: none;
         
          white-space: nowrap;
          font-size: 20px;
          line-height: 1;
          letter-spacing: 0;
          color: #ffffff;
          
          
          transition: opacity 0.18s ease;
        }

        .hero-intro-about-button:hover .hero-intro-nav-link-label,
        .hero-intro-about-button:focus-visible .hero-intro-nav-link-label {
          opacity: 0.45;
        }


        .hero-intro-nav-link {
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
        }

        .hero-intro-nav-link-label {
          position: absolute;
          left: 50%;
          top: auto;
          bottom: 132px;
          display: block;
          transform: rotate(-90deg);
          transform-origin: left center;
          white-space: nowrap;
          font-size: 80px;
          line-height: 0;
          letter-spacing: -0.06em;
          font-weight: 600;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          color: #000000;
          opacity: 0.28;
          transition: opacity 0.18s ease;
        }

        

        .hero-intro-nav-link--history .hero-intro-nav-link-label {
          color: #ffffff;
        }

        .hero-intro-nav-link--legacy .hero-intro-nav-link-label {
          color: #ffffff;
        }

        .hero-intro-nav-link--ambassador .hero-intro-nav-link-label {
          color: #ffffff;
        }

        .hero-intro-nav-link:hover .hero-intro-nav-link-label,
        .hero-intro-nav-link:focus-visible .hero-intro-nav-link-label {
          opacity: 1;
        }

        .hero-intro--transitioning .hero-intro-nav-link-label {
          opacity: 0;
          transition: opacity 90ms linear;
        }

        .hero-intro-mobile-message {
          display: none;
        }

        .hero-intro-mobile-message p {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          text-align: center;
          margin: 0;
          padding: 12px 20px;
          font-family: "Hanken Grotesk", Arial, sans-serif;
        }

        /* Responsive hero styles */
        @media (max-width: 768px) {
          .hero-intro-mobile-message {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1000;
            pointer-events: none;
            backdrop-filter: blur(8px);
          }

          .hero-intro {
            min-height: 840px;
          }

          .hero-intro-panel-grid {
            width: 100%;
            inset: auto 0 0 0;
            height: 240px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .hero-intro-panel {
            border-left: none;
          }

          .hero-intro-shadow {
            left: 110px;
            width: 300px;
          }

          .hero-intro-portrait {
            width: 280px;
            bottom: 0;
          }

          .hero-intro-logo {
            left: 20px;
            bottom: 20px;
            width: 88px;
          }

          .hero-intro-title-block {
            left: 50%;
            top: 90px;
            right: auto;
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

          .hero-intro-title-main {
            white-space: normal;
          }

          .hero-intro-kicker {
            position: static;
            display: block;
            margin: 0 0 12px 0;
            text-align: center;
            font-size: 18px !important;
            max-width: none;
          }

          .hero-intro-nav {
            left: 50%;
            right: auto;
            top: 300px;
            bottom: auto;
            width: auto;
            max-width: calc(100vw - 48px);
            transform: translateX(-50%);
            text-align: center;
            display: flex;
            justify-content: center;
          }

          .hero-intro-about-button {
            width: auto;
            height: auto;
          }

          .hero-intro-about-button .hero-intro-nav-link-label {
            position: static;
            right: auto;
            left: auto;
            top: auto;
            translate: none;
            transform: none;
            display: block;
            text-align: center;
            white-space: normal;
            font-size: 20px;
            line-height: 1.1;
          }

          .hero-intro-nav-link-label {
            position: absolute;
            left: 50%;
            top: 70%;
            bottom: auto;
            font-size: 32px;
            line-height: 1;
            letter-spacing: 0.02em;
            font-weight: 600;
            font-family: "Hanken Grotesk", Arial, sans-serif;
            opacity: 1;
            max-width: none;
            text-align: center;
            white-space: nowrap;
            transform-origin: left center;
            transform: rotate(-90deg);
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
        }

        @media (max-width: 568px) {
          .hero-intro {
            min-height: 780px;
          }

          .hero-intro-panel-grid {
            height: 400px;
          }

          .hero-intro-shadow {
            left: 55px;
            width: 300px;
          }

          .hero-intro-portrait {
            width: 220px;
          }

          .hero-intro-logo {
            left: 16px;
            bottom: 16px;
            width: 78px;
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
            left: 50%;
            right: auto;
            top: 258px;
            bottom: auto;
            width: auto;
            max-width: calc(100vw - 36px);
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
          }

          .hero-intro-about-button .hero-intro-nav-link-label {
            font-size: 18px;
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

      <a
        href="https://www.louisarmstronghouse.org/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Louis Armstrong House Museum"
      >
        <img
          src="/assets/logo_light.png"
          alt="Project logo"
          className="hero-intro-logo"
        />
      </a>

      <div className="mcg-hero-title hero-intro-title-block">
        <div className="hero-intro-title-row">
          <p
            className="hero-intro-title-line hero-intro-title-main"
            style={{
              fontSize: "clamp(72px, 10vw, 196px)",
            }}
          >
            Louis Armstrong
          </p>

          <p
            className="hero-intro-kicker"
            style={{
              fontSize: "clamp(14px, 2.2vw, 38px)",
              margin: 0,
            }}
          >
            The Story of Louis Armstrong in Data and Song{" "}
          </p>

          <p
            className="hero-intro-kicker-date"
            style={{
              fontSize: "clamp(14px, 2.2vw, 38px)",
              margin: 0,
            }}
          >
            1901-1971{" "}
          </p>
        </div>
      </div>

      <div
        className="hero-intro-panel-grid"
        aria-label="Section navigation panels"
      >
        <div className="hero-intro-panel hero-intro-panel--history">
          <div className="hero-intro-panel-media" aria-hidden="true">
            <img src="/assets/history.jpg" alt="" />
            <video
              src="/assets/history.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <button
            onClick={() => handlePanelNavigation("history", onNavigateHistory)}
            className="hero-intro-panel-button hero-intro-nav-link hero-intro-nav-link--history"
            disabled={transitionTarget !== null}
          >
            <span className="hero-intro-nav-link-label">History</span>
          </button>
        </div>
        <div className="hero-intro-panel hero-intro-panel--ambassador">
          <div className="hero-intro-panel-media" aria-hidden="true">
            <img src="/assets/ambassador.jpg" alt="" />
            <video
              src="/assets/ambassador.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <button
            onClick={() =>
              handlePanelNavigation("ambassador", onNavigateAmbassador)
            }
            className="hero-intro-panel-button hero-intro-nav-link hero-intro-nav-link--ambassador"
            disabled={transitionTarget !== null}
          >
            <span className="hero-intro-nav-link-label">Ambassador</span>
          </button>
        </div>
        <div className="hero-intro-panel hero-intro-panel--legacy">
          <div className="hero-intro-panel-media" aria-hidden="true">
            <img src="/assets/legacy.png" alt="" />
            <video
              src="/assets/legacy.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <button
            onClick={() => handlePanelNavigation("legacy", onNavigateLegacy)}
            className="hero-intro-panel-button hero-intro-nav-link hero-intro-nav-link--legacy"
            disabled={transitionTarget !== null}
          >
            <span className="hero-intro-nav-link-label">Legacy</span>
          </button>
        </div>
      </div>

      {isMobile && (
        <div className="hero-intro-mobile-message">
          <p>Best viewed on Desktop</p>
        </div>
      )}

      <div className="hero-intro-nav">
        <button
          type="button"
          onClick={openAboutOverlay}
          className="hero-intro-about-button"
        >
          <span className="hero-intro-nav-link-label">About this project</span>
        </button>
      </div>
    </section>
  );
};
