import React from "react";
interface SectionRealAmbassadorsProps {
  textBaseStyle: React.CSSProperties;
}
const trackList = [
  {
    id: "track-1",
    title: "Cultural Exchange",
  },
  {
    id: "track-2",
    title: "Remember Who You Are",
  },
  {
    id: "track-3",
    title: "My One Bad Habit",
  },
  {
    id: "track-4",
    title: "Summer Song",
  },
  {
    id: "track-5",
    title: "King for a Day",
  },
  {
    id: "track-6",
    title: "The Real Ambassador",
  },
  {
    id: "track-7",
    title: "In The Lurch",
  },
  {
    id: "track-8",
    title: "One Moment Worth Years",
  },
  {
    id: "track-9",
    title: "They Say I Look Like Ambassador",
  },
  {
    id: "track-10",
    title: "Since Love Had Its Way",
  },
] as any[];
const lyricsExtended = `The diplomatic corps has been analyzed and criticized by NBC and CBS\nSenators and congressmen are so concerned, they can't recess\nState Department stands in awe your coup d'etat\nHas met success and caused this great uproar\nWho′s the real ambassador?\n\nI′m the real ambassador\nIt is evident I was sent by government to take your place\nAll I do is play the blues and meet the people face to face\nI'll explain and make it plain, I represent\nThe human race, and don't pretend no more`;
export const SectionRealAmbassadors: React.FC<SectionRealAmbassadorsProps> = ({
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
        The Real Ambassadors 1962
      </h2>
      <div
        className="mcg-lyrics-wrap"
        style={{
          position: "absolute",
          left: "56px",
          top: "164px",
          display: "flex",
          gap: "56px",
        }}
      >
        <img
          src="images/the-real-ambassadors.png"
          alt="The Real Ambassadors Album"
          style={{
            width: "470px",
            height: "360px",
            objectFit: "contain",
          }}
        />
        <h2
          style={{
            margin: 0,
            fontSize: "36px",
            fontWeight: 500,
            color: "#000000",
            fontFamily: '"Helvetica Neue", sans-serif',
          }}
        >
          Tracks
        </h2>
        <div
          className="mcg-track-list"
          style={{
            color: "#000000",
            fontSize: "12px",
            lineHeight: "18px",
            width: "144px",
            fontFamily: '"Helvetica Neue", sans-serif',
          }}
        ></div>
        <div
          className="mcg-track-list"
          style={{
            color: "#000000",
            fontSize: "12px",
            lineHeight: "18px",
            width: "144px",
            fontFamily: '"Helvetica Neue", sans-serif',
          }}
        >
          {trackList.map((track) => (
            <div key={track.id}>
              <span>{track.title}</span>
              <br />
            </div>
          ))}
        </div>
        <div
          className="mcg-lyrics-text"
          style={{
            width: "277px",
            height: "514px",
            overflowY: "auto",
            color: "#000000",
            fontSize: "12px",
            lineHeight: "20px",
            paddingRight: "12px",
          }}
        >
          <strong>The Real Ambassador</strong>
          <br />
          <span>Who's the real ambassador?</span>
          <br />
          <span>It is evident we represent American society</span>
          <br />
          <span>Noted for its etiquette, its manners and sobriety</span>
          <br />
          <span>We have followed protocol with absolute propriety...</span>
          <div
            style={{
              marginTop: "20px",
              whiteSpace: "pre-line",
            }}
          >
            {lyricsExtended}
          </div>
        </div>
      </div>
    </section>
  );
};
