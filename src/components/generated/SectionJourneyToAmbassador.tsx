import React from 'react';
interface SectionJourneyToAmbassadorProps {
  textBaseStyle: React.CSSProperties;
}
export const SectionJourneyToAmbassador: React.FC<SectionJourneyToAmbassadorProps> = ({
  textBaseStyle,
}) => {
  return (
    <section
      className="mcg-section"
      style={{
        backgroundColor: '#F5F3EA',
      }}
    >
      <h2 className="mcg-section-title mcg-page-title">
        Journey to Ambassador 1930-1948
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
              src="images/orchestra.png"
              alt="Orchestra"
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
              src="images/chicago.png"
              alt="Chicago"
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
            Chicago
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper erat tortor,
          at accumsan sapien molestie et. Sed hendrerit velit vel neque molestie eleifend. Ut
          sodales lorem vel mauris malesuada maximus.
        </p>
        <p
          style={{
            ...textBaseStyle,
            fontSize: '12px',
            lineHeight: '20px',
            width: '383px',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper erat tortor,
          at accumsan sapien molestie et. Sed hendrerit velit vel neque molestie eleifend. Ut
          sodales lorem vel mauris malesuada maximus.
        </p>
      </div>
    </section>
  );
};
