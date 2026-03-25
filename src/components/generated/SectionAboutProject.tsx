import React from 'react';
interface SectionAboutProjectProps {
  textBaseStyle: React.CSSProperties;
}
export const SectionAboutProject: React.FC<SectionAboutProjectProps> = ({ textBaseStyle }) => {
  return (
    <section
      className="mcg-section"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <h2
        className="mcg-section-title"
        style={{
          ...textBaseStyle,
          fontSize: '48px',
          fontWeight: 500,
          lineHeight: '58.6px',
          position: 'absolute',
          left: '56px',
          top: '49px',
          color: '#000000',
        }}
      >
        About this Project
      </h2>
      <div
        className="mcg-about-text"
        style={{
          position: 'absolute',
          left: '56.4px',
          top: '164px',
        }}
      >
        <p
          style={{
            ...textBaseStyle,
            color: '#000000',
            width: '383px',
            lineHeight: '22px',
            fontSize: '12px',
          }}
        >
          This project, Louis Armstrong: The Real Ambassador, examines how Armstrong's career
          illuminates the intersections of music, race, politics, and U.S. cultural diplomacy in the
          mid-twentieth century. By tracing his international tours, the circulation and
          reinterpretation of his songs, and the political contexts surrounding his performances,
          the project shows how Armstrong became more than a jazz icon: he emerged as a powerful, if
          sometimes conflicted, symbol of American ambassadorship. At the same time, it asks how
          that role was shaped not only by official diplomacy, but also by the afterlife of his
          music, which continued to carry ideas of goodwill, freedom, and connection across borders
          long after his travels ended.
        </p>
      </div>
      <div
        className="mcg-about-img-wrap"
        style={{
          position: 'absolute',
          left: '582px',
          top: '164px',
        }}
      >
        <img
          src="images/about-this-project.png"
          alt="Louis Armstrong 1929"
          style={{
            width: '420px',
            height: '526px',
            objectFit: 'cover',
          }}
        />
        <p
          style={{
            ...textBaseStyle,
            color: '#000000',
            fontSize: '12px',
            marginTop: '8px',
          }}
        >
          Louis Armstrong and his Orchestra (1929)
        </p>
      </div>
    </section>
  );
};
