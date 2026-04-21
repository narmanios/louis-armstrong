import React from "react";
export function SectionIntro() {
  return (
    <section
      style={{
        width: "100vw",
        minWidth: "100vw",
        height: "100vh",
        minHeight: "100vh",
        flexShrink: 0,
        backgroundColor: "rgba(3, 52, 134, 1)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
      aria-label="Introduction"
    >
      <img
        src="/assets/cover.jpg"
        alt="Historical photo background"
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          left: 0,
          top: 0,
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <style>{`
        @media (min-width: 1281px) {
          .intro-l {
            font-size: 576px !important;
            left: 230.4px !important;
            top: 100px !important;
          }
          .intro-a {
            font-size: 576px !important;
            left: 563.2px !important;
            top: 70px !important;
          }
          .intro-louis-img {
            width: 281.6px !important;
            top: 120px !important;
            left: 400px !important;
          }
          .intro-trumpet-img {
            width: 640px !important;
            top: 300px !important;
            left: 197.12px !important;
          }
          .intro-h1 {
            font-size: 51.2px !important;
            
          }
          .intro-p {
            font-size: 32px !important;
          }
        }
      `}</style>
      <div
        className="intro-content"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <span
          className="intro-l"
          style={{
            width: "23.2%",
            height: "88.9vh",
            color: "rgba(255,0,0,1)",
            fontSize: "clamp(24px, 45vw, 600px)",
            fontFamily: '"Hanken Grotesk", Arial, sans-serif',
            fontWeight: 400,
            lineHeight: "1",
            position: "absolute",
            left: "20.5%",
            top: "6.4%",
          }}
        >
          L
        </span>
        <span
          className="intro-a"
          style={{
            width: "29.4%",
            height: "88.9vh",
            color: "rgba(255,0,0,1)",
            fontSize: "clamp(24px, 45vw, 600px)",
            fontFamily: '"Hanken Grotesk", Arial, sans-serif',
            fontWeight: 400,
            lineHeight: "1",
            position: "absolute",
            left: "45%",
            top: "2%",
          }}
        >
          A
        </span>
        <img
          className="intro-louis-img"
          src="/assets/louis-intro.png"
          alt="Louis Armstrong head shot"
          style={{
            width: "22%",
            aspectRatio: "299/423",
            position: "absolute",
            left: "28.4%",
            top: "8%",
            objectFit: "cover",
          }}
        />
        <img
          className="intro-trumpet-img"
          src="/assets/trumpet.png"
          alt="Louis Armstrong's trumpet"
          style={{
            width: "50%",
            aspectRatio: "968/465",
            position: "absolute",
            left: "15.4%",
            top: "30%",
            objectFit: "cover",
            zIndex: 10,
          }}
        />
        <h1
          className="intro-h1"
          style={{
            width: "45%",
            color: "rgba(255,255,255,1)",
            fontSize: "4vw",
            fontFamily: '"Hanken Grotesk", Arial, sans-serif',
            fontWeight: 500,
            lineHeight: "1.2",
            position: "absolute",
            left: "55%",
            top: "25%",
            margin: 0,
            textShadow: "2px 2px 10px rgba(0,0,0,1)",
            zIndex: 100,
          }}
        >
          Louis Armstrong
        </h1>
        <p
          className="intro-p"
          style={{
            width: "36.5%",
            color: "rgba(255,255,255,1)",
            fontSize: "2.5vw",
            fontFamily: '"Hanken Grotesk", Arial, sans-serif',
            fontWeight: 500,
            lineHeight: "1.2",
            position: "absolute",
            left: "55%",
            top: "32%",
            margin: 0,
            textShadow: "2px 2px 10px rgba(0,0,0,1)",
            zIndex: 100,
          }}
        >
          The Real Ambassador
        </p>
        <span
          style={{
            color: "rgba(255,255,255,1)",
            fontSize: "clamp(12px, 1.83vw, 24px)",
            fontFamily: '"Hanken Grotesk", Arial, sans-serif',
            fontWeight: 700,
            lineHeight: "1.2",
            position: "absolute",
            left: "86%",
            top: "87.5%",
            cursor: "pointer",
          }}
        >
          Explore
        </span>
      </div>
    </section>
  );
}
