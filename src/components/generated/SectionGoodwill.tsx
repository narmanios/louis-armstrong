import React, { useState } from "react";
interface SectionGoodwillProps {
  textBaseStyle: React.CSSProperties;
}
export const SectionGoodwill: React.FC<SectionGoodwillProps> = ({
  textBaseStyle,
}) => {
  const [_activeHoverId, setActiveHoverId] = useState<string | null>(null);
  return (
    <section
      className="mcg-section"
      style={{
        backgroundColor: "#F5F3EA",
      }}
    >
      <h2 className="mcg-section-title mcg-page-title">
        Goodwill (Unoffical) Ambassador (starts 1948)
      </h2>
      <p
        className="mcg-goodwill-text"
        style={{
          ...textBaseStyle,
          color: "#000000",
          fontSize: "12px",
          lineHeight: "18px",
          width: "252px",
          position: "absolute",
          left: "56px",
          top: "172px",
        }}
      >
        Ambassador Satch was a 1956 album that helped present Louis Armstrong as
        a global symbol of jazz and international goodwill. Built from
        recordings from his 1955 European tour, the album supported the image of
        Armstrong as "Ambassador Satch," a nickname tied to his growing role as
        America's musical envoy abroad.
      </p>
      <img
        src="images/ambassador-satch.png"
        alt="Ambassador Satch Album"
        className="mcg-goodwill-album"
        style={{
          width: "271px",
          height: "271px",
          position: "absolute",
          left: "56px",
          top: "300px",
          border: "1px solid #E0E0E0",
          objectFit: "cover",
        }}
      />
      <div
        className="mcg-map-wrap"
        style={{
          position: "absolute",
          left: "141px",
          top: "195px",
          width: "1122px",
          height: "480px",
        }}
      >
        <img
          src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/6f0619f9-7d2b-4be0-9440-4ceb3c4a66b2.svg"
          alt="Map"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <img
          src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/d8c078e4-6371-4076-9a95-18e553a8c215.svg"
          alt="Travels"
          className="mcg-map-travels"
          style={{
            position: "absolute",
            left: "233px",
            top: "59px",
            width: "770px",
          }}
        />
      </div>
      <div
        className="map-marker mcg-chile-tooltip"
        style={{
          position: "absolute",
          left: "492px",
          top: "508px",
          width: "292px",
        }}
        onMouseEnter={() => setActiveHoverId("chile")}
        onMouseLeave={() => setActiveHoverId(null)}
      >
        <img
          src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/cfe776f6-b081-4d62-a6e3-be4e8415f76a.svg"
          alt="Tooltip Chile"
        />
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "33px",
            color: "#FFFFFF",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            1953
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            Chile
          </div>
          <div
            style={{
              fontSize: "12px",
              marginTop: "2px",
            }}
          >
            Description
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "87px",
            left: "30px",
            width: "243px",
            height: "1px",
            backgroundColor: "#FFFFFF",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "94px",
            left: "29px",
            width: "239px",
            color: "#FFFFFF",
            fontSize: "12px",
          }}
        >
          Description of the song goes here. Description of the song goes here.
        </div>
      </div>
    </section>
  );
};
