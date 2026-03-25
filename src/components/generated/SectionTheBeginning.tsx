import React from 'react';
interface SectionTheBeginningProps {
  textBaseStyle: React.CSSProperties;
}
export const SectionTheBeginning: React.FC<SectionTheBeginningProps> = ({ textBaseStyle }) => {
  return (
    <section
      className="mcg-section"
      style={{
        backgroundColor: '#E9E6D9',
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
        }}
      >
        The Beginning
      </h2>
      <div
        className="mcg-image-row"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '56px',
          position: 'absolute',
          left: '56px',
          top: '164px',
        }}
      >
        <div>
          <div className="interactive-card">
            <img
              src="images/waifs-home.png"
              alt="Waifs home band"
              style={{
                width: '470px',
                height: '360px',
                objectFit: 'cover',
              }}
            />
          </div>
          <p
            style={{
              ...textBaseStyle,
              fontSize: '12px',
              marginTop: '12px',
            }}
          >
            Louis Armstrong and his Orchestra (1929)
          </p>
        </div>
        <div>
          <div className="interactive-card">
            <img
              src="images/young-louis.png"
              alt="Young Louis"
              style={{
                width: '470px',
                height: '360px',
                objectFit: 'cover',
              }}
            />
          </div>
          <p
            style={{
              ...textBaseStyle,
              fontSize: '12px',
              marginTop: '12px',
            }}
          >
            Young Louis
          </p>
        </div>
      </div>
      <div
        className="mcg-text-row"
        style={{
          position: 'absolute',
          left: '56px',
          top: '566px',
          display: 'flex',
          gap: '142px',
        }}
      >
        <p
          style={{
            ...textBaseStyle,
            fontSize: '12px',
            lineHeight: '20px',
            width: '383px',
          }}
        >
          Text about Louis Armstrong and his Orchestra goes here. Text about Louis Armstrong and his
          Orchestra goes here. Text about Louis Armstrong and his Orchestra goes here. Text about
          Louis Armstrong and his Orchestra goes here.
        </p>
        <p
          style={{
            ...textBaseStyle,
            fontSize: '12px',
            lineHeight: '20px',
            width: '383px',
          }}
        >
          Text about young Louis goes here. Text about young Louis goes here. Text about young Louis
          goes here. Text about young Louis goes here. Text about young Louis goes here. Text about
          young Louis goes here. Text about young Louis goes here.
        </p>
      </div>
    </section>
  );
};
