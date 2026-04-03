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
            src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/54a6b55c-1685-41bf-b0c3-19ee02eb6bf3.svg"
            alt="Map light"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
          <img
            src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/3c0f2fbc-b683-4e6f-8cda-f1fede8b95c3.svg"
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
                fontSize: "12px",
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
                fontSize: "12px",
                fontWeight: 700,
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
                    fontSize: "10px",
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
          <img
            src="https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/b2950c4d-bdde-4691-85f0-60e5e545fadf.svg"
            alt="Tooltip India"
          />
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
