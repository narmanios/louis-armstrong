import React from "react";
interface SectionWonderfulWorldProps {
  textBaseStyle: React.CSSProperties;
}
export const SectionWonderfulWorld: React.FC<SectionWonderfulWorldProps> = ({
  textBaseStyle,
}) => {
  return (
    <section
      className="mcg-section"
      style={{
        backgroundColor: "#F5F3EA",
      }}
    >
      <h2 className="mcg-section-title mcg-page-title">
        What a Wonderful World 1967
      </h2>
      <div
        className="mcg-wonderful-wrap"
        style={{
          position: "absolute",
          left: "56px",
          top: "164px",
          display: "flex",
          gap: "56px",
          alignItems: "flex-start",
        }}
      >
        <img
          src="images/wonderful-world.png"
          alt="What a Wonderful World album"
          style={{
            width: "470px",
            height: "360px",
            objectFit: "contain",
          }}
        />
        <p
          className="mcg-wonderful-text"
          style={{
            ...textBaseStyle,
            color: "#000000",
            fontSize: "12px",
            lineHeight: "18px",
            width: "383px",
            marginTop: "234px",
          }}
        >
          The Real Ambassadors and "What a Wonderful World" reflect two sides of
          Louis Armstrong's ambassador legacy. The Real Ambassadors challenged
          the contradictions of U.S. jazz diplomacy, while "What a Wonderful
          World," recorded in 1967, expressed a more hopeful and universal
          message. Together, they show Armstrong as a global figure who used
          music to speak across borders, and the song's continued rerecording by
          later artists shows how that ambassador role still lives on today.
        </p>
      </div>
    </section>
  );
};
