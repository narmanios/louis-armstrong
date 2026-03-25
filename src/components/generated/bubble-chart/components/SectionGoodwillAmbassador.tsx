import { useEffect, useMemo, useRef, useState } from 'react';
import SectionGoodwill from '../../../../imports/SectionGoodwill';
import OverlayAmbassadorSatch from '../../../../imports/OverlayAmbassadorSatch';
import { X } from 'lucide-react';
import countriesData from '../../../../../data/goodwillCountries.json';

type Decade = 'all' | '1920s' | '1930s' | '1940s' | '1950s' | '1960s' | '1970s';

interface CountryEvent {
  year: string;
  international: string;
  usContext?: string;
}

interface CountryData {
  id: string;
  name: string;
  cx: number;
  cy: number;
  r: number;
  // -1 means no number label in original design (very small bubbles)
  numLeft: number;
  numTop: number;
  numFontSize: number;
  counts: {
    all: number;
  } & Partial<Record<Exclude<Decade, 'all'>, number>>;
  events: CountryEvent[];
}

const COUNTRIES: CountryData[] = countriesData as CountryData[];

const DECADES: Decade[] = ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s'];
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 800;
const BOTTOM_EMPTY_SPACE = 150;

interface BubblePosition {
  cx: number;
  cy: number;
}

interface BubbleNode {
  id: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MAP_GROUP_LEFT = 110;
const MAP_GROUP_TOP = 136;

const COUNTRY_TO_FLAG_DATA_NAME: Record<string, string> = {
  usa: 'us united-states',
  uk: 'gb england',
  france: 'fr france',
  germany: 'de germany',
  canada: 'ca canada',
  italy: 'it italy',
  switzerland: 'ch switzerland',
  japan: 'jp japan',
  denmark: 'dk denmark',
  australia: 'au australia',
  newzealand: 'nz new-zealand',
  ghana: 'gh ghana',
  norway: 'no norway',
  scotland: 'gb-sct scotland',
  drc: 'cd democratic-republic-of-the-congo',
  sweden: 'se sweden',
  sudan: 'sd sudan',
  belgium: 'be belgium',
  finland: 'fi finland',
  netherlands: 'nl netherlands',
  uganda: 'ug uganda',
  china: 'cn china',
  cotedivoire: 'ci cote-d-ivoire',
  egypt: 'eg egypt',
  kenya: 'ke kenya',
  chile: 'cl chile',
  nigeria: 'ng nigeria',
  tanzania: 'tz tanzania',
  portugal: 'pt portugal',
  austria: 'at austria',
  ireland: 'ie ireland',
  cuba: 'cu cuba',
  mexico: 'mx mexico',
  spain: 'es spain',
};

const COUNTRY_TO_ELLIPSE_ID: Record<string, string> = {
  usa: 'Ellipse 81',
  uk: 'Ellipse 80',
  france: 'Ellipse 82',
  germany: 'Ellipse 87',
  canada: 'Ellipse 86',
  italy: 'Ellipse 85',
  switzerland: 'Ellipse 91',
  japan: 'Ellipse 88',
  denmark: 'Ellipse 90',
  australia: 'Ellipse 89',
  newzealand: 'Ellipse 92',
  ghana: 'Ellipse 93',
  norway: 'Ellipse 94',
  scotland: 'Ellipse 95',
  drc: 'Ellipse 96',
  sweden: 'Ellipse 98',
  sudan: 'Ellipse 97',
  belgium: 'Ellipse 99',
  finland: 'Ellipse 106',
  netherlands: 'Ellipse 105',
  uganda: 'Ellipse 102',
  china: 'Ellipse 104',
  cotedivoire: 'Ellipse 100',
  egypt: 'Ellipse 107',
  kenya: 'Ellipse 101',
  chile: 'Ellipse 103',
  nigeria: 'Ellipse 108',
  tanzania: 'Ellipse 109',
  portugal: 'Ellipse 112',
  austria: 'Ellipse 110',
  ireland: 'Ellipse 111',
  cuba: 'Ellipse 113',
  mexico: 'Ellipse 114',
  spain: 'Ellipse 115',
};

const COUNT_COUNTRY_ORDER: string[] = [
  'usa',
  'germany',
  'canada',
  'italy',
  'denmark',
  'australia',
  'japan',
  'newzealand',
  'ghana',
  'scotland',
  'drc',
  'sudan',
  'belgium',
  'sweden',
  'norway',
  'switzerland',
  'france',
  'uk',
];

export function SectionGoodwillAmbassador({
  textBaseStyle,
}: {
  textBaseStyle: React.CSSProperties;
}) {
  const [selectedDecade, setSelectedDecade] = useState<Decade>('all');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [showAlbumOverlay, setShowAlbumOverlay] = useState(false);
  const sectionRootRef = useRef<HTMLDivElement>(null);
  const [bubblePositions, setBubblePositions] = useState<Record<string, BubblePosition>>(() => {
    return COUNTRIES.reduce<Record<string, BubblePosition>>((acc, country) => {
      acc[country.id] = { cx: country.cx, cy: country.cy };
      return acc;
    }, {});
  });

  const getDecadeCount = (country: CountryData, decade: Exclude<Decade, 'all'>): number => {
    return country.counts[decade] ?? 0;
  };

  useEffect(() => {
    const edgePadding = 2;
    const minX = edgePadding;
    const minY = 145;
    const maxX = CANVAS_WIDTH - edgePadding;
    const maxY = CANVAS_HEIGHT - BOTTOM_EMPTY_SPACE - edgePadding;
    const gap = 1.5;
    const ticks = 140;
    const centerX = CANVAS_WIDTH * 0.52;
    const centerY = minY + (maxY - minY) * 0.5;

    const nodes: BubbleNode[] = COUNTRIES.map(country => ({
      id: country.id,
      r: country.r,
      x: Math.random() * (maxX - minX - 2 * country.r) + (minX + country.r),
      y: Math.random() * (maxY - minY - 2 * country.r) + (minY + country.r),
      vx: 0,
      vy: 0,
    }));

    let rafId = 0;
    let currentTick = 0;

    const step = () => {
      currentTick += 1;

      // Pull nodes inward to produce the clustered force-layout look.
      nodes.forEach(node => {
        node.vx += (centerX - node.x) * 0.0024;
        node.vy += (centerY - node.y) * 0.0024;
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const minDist = a.r + b.r + gap;

          if (dist < minDist) {
            const push = (minDist - dist) / 2;
            const ux = dx / dist;
            const uy = dy / dist;
            a.x -= ux * push;
            a.y -= uy * push;
            b.x += ux * push;
            b.y += uy * push;
          }
        }
      }

      nodes.forEach(node => {
        node.vx *= 0.9;
        node.vy *= 0.9;

        node.x += node.vx;
        node.y += node.vy;

        const minNodeX = minX + node.r;
        const maxNodeX = maxX - node.r;
        const minNodeY = minY + node.r;
        const maxNodeY = maxY - node.r;

        if (node.x < minNodeX) {
          node.x = minNodeX;
          node.vx = Math.abs(node.vx) * 0.35;
        }
        if (node.x > maxNodeX) {
          node.x = maxNodeX;
          node.vx = -Math.abs(node.vx) * 0.35;
        }
        if (node.y < minNodeY) {
          node.y = minNodeY;
          node.vy = Math.abs(node.vy) * 0.35;
        }
        if (node.y > maxNodeY) {
          node.y = maxNodeY;
          node.vy = -Math.abs(node.vy) * 0.35;
        }
      });

      const next = nodes.reduce<Record<string, BubblePosition>>((acc, node) => {
        acc[node.id] = { cx: node.x, cy: node.y };
        return acc;
      }, {});

      setBubblePositions(next);

      if (currentTick < ticks) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const countriesById = useMemo(() => {
    return COUNTRIES.reduce<Record<string, CountryData>>((acc, country) => {
      acc[country.id] = country;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const root = sectionRootRef.current;
    if (!root) return;

    COUNTRIES.forEach(country => {
      const randomized = bubblePositions[country.id];
      if (!randomized) return;

      const dx = randomized.cx - country.cx;
      const dy = randomized.cy - country.cy;

      const flagDataName = COUNTRY_TO_FLAG_DATA_NAME[country.id];
      if (flagDataName) {
        const flagEl = root.querySelector<HTMLElement>(`[data-name="${flagDataName}"]`);
        if (flagEl) {
          flagEl.style.transform = `translate(${dx}px, ${dy}px)`;
          flagEl.style.transformOrigin = 'top left';
        }
      }

      const ellipseId = COUNTRY_TO_ELLIPSE_ID[country.id];
      if (ellipseId) {
        const circleEl = root.querySelector<SVGCircleElement>(`circle[id="${ellipseId}"]`);
        if (circleEl) {
          circleEl.setAttribute('cx', `${randomized.cx - MAP_GROUP_LEFT}`);
          circleEl.setAttribute('cy', `${randomized.cy - MAP_GROUP_TOP}`);
        }
      }
    });

    const countNodes = root.querySelectorAll<HTMLElement>('[data-name="BubbleCounts"] p');
    COUNT_COUNTRY_ORDER.forEach((countryId, index) => {
      const node = countNodes[index];
      const country = countriesById[countryId];
      const randomized = bubblePositions[countryId];
      if (!node || !country || !randomized) return;

      const numberDx = randomized.cx - country.cx;
      const numberDy = randomized.cy - country.cy;

      node.style.left = `${country.numLeft + numberDx}px`;
      node.style.top = `${country.numTop + numberDy}px`;
      node.textContent = `${
        selectedDecade === 'all' ? country.counts.all : getDecadeCount(country, selectedDecade)
      }`;
    });
  }, [bubblePositions, countriesById, selectedDecade]);

  const getCount = (country: CountryData): number => {
    if (selectedDecade === 'all') return country.counts.all;
    return getDecadeCount(country, selectedDecade);
  };

  const handleBubbleClick = (country: CountryData) => {
    if (selectedCountry?.id === country.id) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(country);
    }
  };

  const handleDecadeClick = (decade: Decade) => {
    setSelectedDecade(prev => (prev === decade ? 'all' : decade));
  };

  return (
    <section
      className="mcg-section mcg-jazz-section"
      style={{
        backgroundColor: '#F5F3EA',
      }}
    >
      <div
      // style={{
      //   position: 'relative',
      //   width: 1280,
      //   height: 800,
      //   overflow: 'hidden',
      //   flexShrink: 0,
      // }}
      >
        {/* Base Figma visualization */}
        <div ref={sectionRootRef} style={{ position: 'absolute', inset: 0 }}>
          <SectionGoodwill />
        </div>

        {/* Interactive overlay layer */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* Interactive decade filter buttons – covers static ones from SectionGoodwill */}
          <div
            style={{
              position: 'absolute',
              left: 956,
              top: 62,
              display: 'flex',
              gap: 10,
              background: '#f5f3ea',
              padding: '7px 8px 8px 7px',
              pointerEvents: 'auto',
            }}
          >
            {DECADES.map(decade => (
              <button
                key={decade}
                onClick={() => handleDecadeClick(decade)}
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: selectedDecade === decade ? '#000000' : '#aaaaaa',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {decade}
              </button>
            ))}
          </div>

          {/* Clickable circular overlays on each flag bubble */}
          {COUNTRIES.map(country => (
            <button
              key={country.id}
              onClick={() => handleBubbleClick(country)}
              title={country.name}
              style={{
                position: 'absolute',
                left: bubblePositions[country.id].cx - country.r,
                top: bubblePositions[country.id].cy - country.r,
                width: country.r * 2,
                height: country.r * 2,
                borderRadius: '50%',
                background: selectedCountry?.id === country.id ? 'rgba(0,0,0,0.07)' : 'transparent',
                border: selectedCountry?.id === country.id ? '2px solid rgba(0,0,0,0.15)' : 'none',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => {
                if (selectedCountry?.id !== country.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
                }
              }}
              onMouseLeave={e => {
                if (selectedCountry?.id !== country.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }
              }}
            />
          ))}

          {/* Clickable album cover – the album image has pointer-events-none in the original */}
          <button
            onClick={() => setShowAlbumOverlay(true)}
            title="Ambassador Satch"
            style={{
              position: 'absolute',
              // The album image: left=calc(50%-476.65px) with -translate-x-1/2
              // 50% of 1280 = 640, minus 476.65 = 163.35, then translateX(-50% of 271) = -135.5 → ~28px
              left: 28,
              top: 504,
              width: 271,
              height: 271,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          />
        </div>

        {/* Album overlay */}
        {showAlbumOverlay && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 50,
            }}
          >
            {/* OverlayAmbassadorSatch fills the full 1280×800 canvas */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <OverlayAmbassadorSatch />
              {/* Transparent close button positioned over the X icon in the Figma component */}
              {/* Close inset: top=7.38%×800=59px, right=5.65%×1280=72px → left=1178px, size≈30×30px */}
              <button
                onClick={() => setShowAlbumOverlay(false)}
                style={{
                  position: 'absolute',
                  left: 1178,
                  top: 59,
                  width: 30,
                  height: 30,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Close album overlay"
              >
                <img
                  src="images/close.svg"
                  alt="Close"
                  style={{
                    width: '30px',
                    height: '30px',
                    opacity: 0.7,
                  }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Right-side country detail panel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 340,
            height: '100%',
            background: '#111111',
            transform: selectedCountry ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 30,
            overflowY: 'auto',
          }}
        >
          {selectedCountry && (
            <div style={{ padding: '40px 32px 40px 32px', color: 'white' }}>
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 28,
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: 26,
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                    lineHeight: 1.2,
                    paddingRight: 16,
                    flex: 1,
                  }}
                >
                  {selectedCountry.name}
                </h2>
                <button
                  onClick={() => setSelectedCountry(null)}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.6)',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '5px 7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <X size={13} />
                </button>
              </div>

              {/* Visit count summary */}
              <div
                style={{
                  marginBottom: 28,
                  paddingBottom: 20,
                  borderBottom: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.5,
                }}
              >
                {selectedDecade === 'all'
                  ? `${selectedCountry.counts.all} total visits across all decades`
                  : `${getCount(selectedCountry)} visits in ${selectedDecade} · ${selectedCountry.counts.all} total`}
              </div>

              {/* Decade breakdown */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {DECADES.map(d => (
                    <div
                      key={d}
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: 12,
                        color: selectedDecade === d ? 'white' : 'rgba(255,255,255,0.4)',
                        background:
                          selectedDecade === d
                            ? 'rgba(255,255,255,0.12)'
                            : 'rgba(255,255,255,0.05)',
                        padding: '3px 8px',
                        borderRadius: 2,
                      }}
                    >
                      {d}: {selectedCountry.counts[d] ?? 0}
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical events */}
              {selectedCountry.events.map((event, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: i < selectedCountry.events.length - 1 ? 32 : 0,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: 10,
                      marginTop: 0,
                    }}
                  >
                    {event.year}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.65,
                      marginBottom: event.usContext ? 12 : 0,
                      marginTop: 0,
                    }}
                  >
                    {event.international}
                  </p>
                  {event.usContext && (
                    <p
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: 1.65,
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                    >
                      <strong style={{ color: 'white' }}>In the U.S.:</strong> {event.usContext}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
