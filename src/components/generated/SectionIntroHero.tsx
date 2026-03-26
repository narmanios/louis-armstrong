import React, { useState } from 'react';
import { SectionAboutProject } from './SectionAboutProject';
interface SectionIntroHeroProps {
  onScrollNext: () => void;
}

const heroForegroundScale = 0.78;
const scalePx = (value: number) => `${Math.round(value * heroForegroundScale)}px`;

export const SectionIntroHero: React.FC<SectionIntroHeroProps> = ({ onScrollNext }) => {
  const [isAboutOverlayOpen, setIsAboutOverlayOpen] = useState(false);

  const aboutTextBaseStyle: React.CSSProperties = {
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 400,
    color: '#000000',
  };

  return (
    <section
      className="mcg-section mcg-hero-wrap hero-intro-section"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .hero-intro-section {
            position: relative !important;
            min-height: 82vh !important;
            overflow: hidden !important;
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
          .hero-intro-section .mcg-hero-bg {
            position: relative !important;
            width: 100% !important;
            height: 72vh !important;
            left: auto !important;
            top: auto !important;
            object-fit: cover !important;
          }
          .hero-intro-section .mcg-hero-l,
          .hero-intro-section .mcg-hero-a {
            display: block !important;
          }
          .hero-intro-section .mcg-hero-l {
            left: 16vw !important;
            top: 6vw !important;
            font-size: 40vw !important;
          }
          .hero-intro-section .mcg-hero-a {
            left: 44vw !important;
            top: -4vw !important;
            font-size: 40vw !important;
          }
          .hero-intro-section .mcg-hero-overlay1,
          .hero-intro-section .mcg-hero-overlay2 {
            display: block !important;
          }
          .hero-intro-section .mcg-hero-overlay1 {
            width: 27vw !important;
            height: auto !important;
            left: 30vw !important;
            top: 20vw !important;
          }
          .hero-intro-section .mcg-hero-overlay2 {
            width: 74vw !important;
            height: auto !important;
            left: 12vw !important;
            top: 34vw !important;
          }
          .hero-intro-section .mcg-hero-title {
            position: absolute !important;
            left: 10vw !important;
            top: 58vw !important;
            margin-top: 0 !important;
            color: #ffffff !important;
            z-index: 6 !important;
            width: 80vw !important;
          }
          .hero-intro-section .mcg-hero-title h1 {
            font-size: 7.8vw !important;
            line-height: 1.05 !important;
          }
          .hero-intro-section .mcg-hero-title h2 {
            font-size: 5.2vw !important;
            line-height: 1.1 !important;
          }
          .hero-intro-section .mcg-hero-explore {
            position: absolute !important;
            left: 10vw !important;
            top: 73vw !important;
            margin-top: 0 !important;
          }

          .hero-intro-section .mcg-about-overlay-content {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            overflow-y: auto !important;
          }

          .hero-intro-section .mcg-about-overlay-content .mcg-section {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 100% !important;
            height: auto !important;
            padding: 84px 16px 24px !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }

          .hero-intro-section .mcg-about-overlay-content .mcg-section-title,
          .hero-intro-section .mcg-about-overlay-content .mcg-about-text,
          .hero-intro-section .mcg-about-overlay-content .mcg-about-img-wrap {
            position: static !important;
            left: auto !important;
            top: auto !important;
          }

          .hero-intro-section .mcg-about-overlay-content .mcg-section-title {
            font-size: 32px !important;
            line-height: 1.2 !important;
            margin-bottom: 16px !important;
          }

          .hero-intro-section .mcg-about-overlay-content .mcg-about-text,
          .hero-intro-section .mcg-about-overlay-content .mcg-about-text p {
            width: 100% !important;
            max-width: 100% !important;
          }

          .hero-intro-section .mcg-about-overlay-content .mcg-about-img-wrap {
            margin-top: 20px !important;
          }

          .hero-intro-section .mcg-about-overlay-content .mcg-about-img-wrap img {
            width: 100% !important;
            height: auto !important;
            max-width: 420px !important;
          }
        }
      `}</style>

      <img
        src="/images/cover.jpg"
        alt="Louis Armstrong Hero"
        className="mcg-hero-bg"
        style={{
          width: '100vw',
          height: '100%',
          position: 'absolute',
          left: '0px',
          top: '0px',
          objectFit: 'cover',
          // Keeps the right side of the image in view on mobile
          objectPosition: 'right center',
          // Optional: Add a mask shape
          // WebkitMaskImage: 'url(/mask-shape.svg)',
          // maskImage: 'url(/mask-shape.svg)',
          maskSize: 'cover',
          // objectFit: 'cover',
        }}
      />

      {/* <span
        className="mcg-hero-l"
        style={{
          position: 'absolute',
          left: scalePx(269),
          top: scalePx(51),
          color: '#FF0000',
          fontSize: scalePx(600),
          fontFamily: '"Joti One", sans-serif',
          textShadow: '0px 4px 4px rgba(0,0,0,1)',
        }}
      >
        L
      </span> */}
      {/* <span
        className="mcg-hero-a"
        style={{
          position: 'absolute',
          left: scalePx(589),
          top: scalePx(-19),
          color: '#FF0000',
          fontSize: scalePx(600),
          fontFamily: '"Joti One", sans-serif',
          textShadow: '0px 4px 4px rgba(0,0,0,1)',
        }}
      >
        A
      </span> */}
      {/* <img
        src="/images/louis-intro.png"
        alt="Overlay 1"
        className="mcg-hero-overlay1"
        style={{
          width: scalePx(299),
          height: scalePx(423),
          position: 'absolute',
          left: scalePx(372),
          top: scalePx(112),
          backgroundColor: 'transparent',
        }}
      /> */}
      {/* <img
        src="/images/trumpet.png"
        alt="Overlay 2"
        className="mcg-hero-overlay2"
        style={{
          width: scalePx(650),
          height: scalePx(250),
          position: 'absolute',
          left: scalePx(450),
          top: scalePx(518),
          backgroundColor: 'transparent',
        }}
      /> */}
      <img
        src="/images/flag.png"
        alt="Overlay 2"
        className="mcg-hero-flag"
        style={{
          width: scalePx(650),
          height: scalePx(250),
          position: 'absolute',
          left: scalePx(450),
          top: scalePx(518),
          backgroundColor: 'transparent',
        }}
      />
      <div
        className="mcg-hero-title"
        style={{
          position: 'absolute',
          left: '588px',
          top: '407px',
          color: '#FFFFFF',
          zIndex: 5,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '48px',
            fontWeight: 600,
            fontFamily: '"Helvetica Neue", sans-serif',
            textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
          }}
        >
          Louis Armstrong
        </h1>
        <h2
          style={{
            margin: 0,
            fontSize: '36px',
            fontWeight: 500,
            fontFamily: '"Helvetica Neue", sans-serif',
            textShadow: '0px 4px 4px rgba(0,0,0,0.25)',
          }}
        >
          The Real Ambassador
        </h2>
      </div>
      <button
        onClick={onScrollNext}
        className="explore-btn mcg-hero-explore"
        style={{
          position: 'absolute',
          left: scalePx(1300),
          top: scalePx(650),
          color: '#ffd000',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: '"Helvetica Neue", sans-serif',
        }}
      >
        Explore
      </button>
      <button
        onClick={() => setIsAboutOverlayOpen(true)}
        className="about-btn mcg-hero-about"
        style={{
          position: 'absolute',
          left: scalePx(1300),
          top: scalePx(700),
          color: '#ffd000',
          fontSize: '16px',
          fontWeight: 400,
          fontFamily: '"Helvetica Neue", sans-serif',
        }}
      >
        About this project
      </button>

      {isAboutOverlayOpen && (
        <div
          className="mcg-about-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="mcg-about-overlay-content"
            style={{
              position: 'relative',
              width: 'min(100vw, 1280px)',
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35)',
            }}
          >
            <button
              aria-label="Close about overlay"
              onClick={() => setIsAboutOverlayOpen(false)}
              style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                zIndex: 5,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px',
              }}
            >
              <img
                src="/images/close.svg"
                alt="Close"
                style={{
                  width: '30px',
                  height: '30px',
                  filter: 'brightness(0)',
                }}
              />
            </button>

            <SectionAboutProject textBaseStyle={aboutTextBaseStyle} />
          </div>
        </div>
      )}
    </section>
  );
};
