import React from "react";
const ambassadorData = [
  {
    color: "#2DAA00",
    name: "Dizzy Gillespie 1956",
  },
  {
    color: "#FF8400",
    name: "Benny Goodman 1956 + 1962",
  },
  {
    color: "#49BCFF",
    name: "Dave Brubeck 1958",
  },
  {
    color: "#9747FF",
    name: "Duke Ellington 1963",
  },
] as any[];

const encodeSvgDataUri = (svg: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const jazzMapLightSvg = encodeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1122" height="480" viewBox="0 0 1122 480" fill="none">
    <rect width="1122" height="480" fill="#F3EEE2"/>
    <path d="M88 120C168 76 286 70 380 108C468 143 534 120 606 88C688 52 804 56 904 102C986 140 1038 214 1019 290C996 378 890 418 776 400C692 387 639 333 570 312C489 286 401 308 324 340C236 376 128 366 80 296C34 228 47 159 88 120Z" fill="#E7DDC8" fill-opacity="0.5"/>
    <path d="M170 98C240 80 318 92 370 130C425 171 458 216 448 260C436 313 366 340 298 327C222 312 154 266 136 212C120 162 138 112 170 98Z" fill="#DCCFB5" fill-opacity="0.45"/>
    <path d="M675 72C760 48 850 68 909 121C965 171 1000 240 968 301C936 362 840 382 756 360C676 339 618 288 606 227C594 166 629 92 675 72Z" fill="#E1D5BE" fill-opacity="0.42"/>
    <path d="M105 356C162 315 247 300 319 319C395 338 460 384 480 424" stroke="#D0C3A6" stroke-width="6" stroke-linecap="round" stroke-opacity="0.45"/>
    <path d="M662 360C742 328 850 330 942 370C993 392 1032 418 1074 446" stroke="#D0C3A6" stroke-width="6" stroke-linecap="round" stroke-opacity="0.45"/>
  </svg>
`);

const jazzTravelsLightSvg = encodeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="627" height="240" viewBox="0 0 627 240" fill="none">
    <rect width="627" height="240" fill="transparent"/>
    <path d="M24 46C87 27 133 35 176 62C219 90 249 110 302 98C361 85 388 47 435 34C496 17 553 39 604 67" stroke="#7A5A3C" stroke-opacity="0.35" stroke-width="4" stroke-linecap="round" stroke-dasharray="10 12"/>
    <path d="M60 182C121 150 168 147 222 161C286 177 336 168 386 137C444 102 503 92 580 120" stroke="#7A5A3C" stroke-opacity="0.28" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 10"/>
    <circle cx="78" cy="50" r="7" fill="#7A5A3C" fill-opacity="0.45"/>
    <circle cx="296" cy="98" r="7" fill="#7A5A3C" fill-opacity="0.45"/>
    <circle cx="522" cy="61" r="7" fill="#7A5A3C" fill-opacity="0.45"/>
    <circle cx="170" cy="160" r="7" fill="#7A5A3C" fill-opacity="0.45"/>
    <circle cx="394" cy="140" r="7" fill="#7A5A3C" fill-opacity="0.45"/>
  </svg>
`);

const jazzTooltipIndiaSvg = encodeSvgDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" width="292" height="210" viewBox="0 0 292 210" fill="none">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.14"/>
      </filter>
    </defs>
    <rect x="1" y="1" width="290" height="208" rx="18" fill="#FFFFFF" filter="url(#shadow)"/>
    <rect x="1" y="1" width="290" height="208" rx="18" fill="none" stroke="#E5E7EB"/>
  </svg>
`);

export const SectionJazzAmbassadors: React.FC = () => {
  return (
    <section
      className="mcg-section mcg-jazz-section"
      style={{
        backgroundColor: "#F5F3EA",
        minHeight: "100dvh",
        padding: "0 56px 60px",
        boxSizing: "border-box",
      }}
    >
      <h1
        className="mcg-section-title mcg-page-title mcg-page-title--flow"
        style={{ position: "relative", zIndex: 6 }}
      >
        Jazz Ambassador Diplomacy Program (1956-63)
      </h1>
      <div
        className="mcg-jazz-stage"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "560px",
          marginTop: "24px",
        }}
      >
        <div
          className="mcg-jazz-collage"
          style={{
            position: "absolute",
            left: "4px",
            top: "201px",
            width: "270px",
            height: "184px",
          }}
        >
          <img
            src="/assets/jazz-ambassadors-louis.png"
            alt="Person 1"
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              width: "101px",
              height: "151px",
              objectFit: "cover",
            }}
          />
          <img
            src="/assets/jazz-ambassadors-dave.png"
            alt="Person 2"
            style={{
              position: "absolute",
              left: "46px",
              top: "42px",
              width: "92px",
              height: "141px",
              objectFit: "cover",
            }}
          />
          <img
            src="/assets/jazz-ambassadors-dizzy.png"
            alt="Person 3"
            style={{
              position: "absolute",
              left: "137px",
              top: "2px",
              width: "132px",
              height: "182px",
              objectFit: "cover",
            }}
          />
          <img
            src="/assets/jazz-ambassadors-benny.png"
            alt="Person 4"
            style={{
              position: "absolute",
              left: "117px",
              top: "69px",
              width: "86px",
              height: "114px",
              objectFit: "cover",
            }}
          />
          <img
            src="/assets/jazz-ambassadors-duke.png"
            alt="Person 5"
            style={{
              position: "absolute",
              left: "0px",
              top: "89px",
              width: "71px",
              height: "94px",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          className="mcg-map-wrap"
          style={{
            position: "absolute",
            left: "85px",
            top: "23px",
            width: "1122px",
            height: "480px",
          }}
        >
          <img
            src={jazzMapLightSvg}
            alt="Map light"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <img
            src={jazzTravelsLightSvg}
            alt="Travels light"
            className="mcg-map-travels"
            style={{
              position: "absolute",
              left: "336px",
              top: "59px",
              width: "627px",
            }}
          />
        </div>
        <div
          className="mcg-jazz-legend"
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            color: "#000000",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "#D01C91",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 400,
                fontFamily: '"Hanken Grotesk", Arial, sans-serif',
              }}
            >
              Louis Armstrong 1960-1961
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 400,
                fontFamily: '"Hanken Grotesk", Arial, sans-serif',
              }}
            >
              Other Ambassadors
            </span>
            {ambassadorData.map((amb) => (
              <div
                key={amb.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: amb.color,
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    fontFamily: '"Hanken Grotesk", Arial, sans-serif',
                  }}
                >
                  {amb.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="map-marker mcg-india-tooltip"
          style={{
            position: "absolute",
            left: "892px",
            top: "164px",
            width: "292px",
          }}
        >
          <img src={jazzTooltipIndiaSvg} alt="Tooltip India" />
          <div
            style={{
              position: "absolute",
              top: "15px",
              left: "33px",
              color: "#000000",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              Dave Bruebeck 1958
            </div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              India
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
              top: "94px",
              left: "29px",
              width: "239px",
              color: "#000000",
              fontSize: "12px",
            }}
          >
            Description of the song goes here. Description of the song goes
            here.
          </div>
        </div>
      </div>
    </section>
  );
};
