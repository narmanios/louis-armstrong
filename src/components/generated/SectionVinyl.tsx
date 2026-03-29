import { CSSProperties, MouseEvent, useEffect, useMemo, useState } from "react";
import "./SectionVinyl.css";

export interface VinylArtist {
  id: string;
  name: string;
  year: number;
  description: string;
  imageUrl: string;
  angle?: number;
}

export interface VinylSong {
  id: string;
  title: string;
  originalYear: number;
  radius?: number;
  artists: VinylArtist[];
}

interface DecorativeRing {
  key: string;
  radius: number;
  decorative: true;
}

interface InteractiveRing {
  key: string;
  radius: number;
  decorative: false;
  song: VinylSong;
}

type VinylRing = DecorativeRing | InteractiveRing;

export interface VinylRecordExplorerProps {
  songs?: VinylSong[];
  songsUrl?: string;
  title?: string;
  subtitle?: string;
  centerImageUrl?: string;
  className?: string;
  style?: CSSProperties;
  height?: CSSProperties["height"];
  minHeight?: CSSProperties["minHeight"];
  panelWidth?: number;
  loadingText?: string;
  emptyText?: string;
  errorText?: string;
  songLabel?: string;
  artistLabel?: string;
}

const DEFAULT_CENTER_IMAGE = "/images/louis-record-center.jpg";
const DEFAULT_SONGS_URL = "/images/data/songs.json";
const DEFAULT_EMPTY_TEXT =
  "Hover over the rings to explore covers of Louis Armstrong's songs";

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export function VinylRecordExplorer({
  songs: songsProp,
  songsUrl = DEFAULT_SONGS_URL,
  title = "Louis Armstrong Covers",
  subtitle = "The re-recording of Armstrong's work.",
  centerImageUrl = DEFAULT_CENTER_IMAGE,
  className,
  style,
  height,
  minHeight = "100vh",
  panelWidth = 176,
  loadingText = "Loading data…",
  emptyText = DEFAULT_EMPTY_TEXT,
  errorText = "Couldn’t load songs data. Check that the songs JSON is available.",
  songLabel = "A Song",
  artistLabel = "Artist",
}: VinylRecordExplorerProps) {
  const [songs, setSongs] = useState<VinylSong[]>(songsProp ?? []);
  const [loading, setLoading] = useState<boolean>(!songsProp);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(
    songsProp?.[0]?.id ?? null,
  );
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);

  useEffect(() => {
    if (songsProp) {
      setSongs(songsProp);
      setLoading(false);
      setLoadError(null);
      setSelectedSongId((current) => current ?? songsProp[0]?.id ?? null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    fetch(songsUrl, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return (await response.json()) as unknown;
      })
      .then((data) => {
        if (cancelled) return;
        const nextSongs = Array.isArray(data) ? (data as VinylSong[]) : [];
        setSongs(nextSongs);
        setSelectedSongId(nextSongs[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error : new Error("Failed to load songs"),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [songsProp, songsUrl]);

  const activeSongId = hoveredSongId ?? selectedSongId ?? songs[0]?.id ?? null;
  const activeSong = useMemo(
    () => songs.find((song) => song.id === activeSongId) ?? null,
    [songs, activeSongId],
  );
  const activeSongRadius = activeSong?.radius ?? 207;
  const activeArtists = activeSong?.artists ?? [];
  const activeArtistsLength = activeArtists.length;

  const hoveredArtist = useMemo(() => {
    if (!activeSong || !hoveredArtistId) return null;
    return (
      activeSong.artists.find((artist) => artist.id === hoveredArtistId) ?? null
    );
  }, [activeSong, hoveredArtistId]);

  const rings = useMemo<VinylRing[]>(() => {
    if (!songs.length) return [];

    const minRadius = 207;
    const maxRadius = 460;
    const totalRings = 24;
    const ringSpacing = (maxRadius - minRadius) / (totalRings - 1);

    const nextRings: VinylRing[] = [];

    for (let idx = 0; idx < totalRings; idx += 1) {
      const radius = minRadius + idx * ringSpacing;
      const interactive = idx % 2 === 0;

      if (!interactive) {
        nextRings.push({ key: `d-${idx}`, radius, decorative: true });
        continue;
      }

      const songIndex = Math.floor(idx / 2);
      const song = songs[songIndex];
      if (!song) continue;

      nextRings.push({ key: `s-${song.id}`, radius, decorative: false, song });
    }

    return nextRings;
  }, [songs]);

  const coords = (index: number, radius: number) => {
    const angleDeg =
      activeArtistsLength > 0 ? (360 / activeArtistsLength) * index - 90 : -90;
    const angle = (angleDeg * Math.PI) / 180;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  };

  const artistClipId = (id: string) => `vre-artist-clip-${id}`;
  const isHoveredArtist = (id: string) => hoveredArtistId === id;

  const onSongHover = (songId: string) => {
    setHoveredSongId(songId);
    setHoveredArtistId(null);
  };

  const onSongUnhover = (songId: string) => {
    if (selectedSongId !== songId) {
      setHoveredSongId(null);
      setHoveredArtistId(null);
    }
  };

  const selectSong = (songId: string) => {
    setSelectedSongId(songId);
    setHoveredSongId(null);
    setHoveredArtistId(null);
  };

  const onRingEnter = (songId: string) => {
    setHoveredSongId(songId);
    setHoveredArtistId(null);
  };

  const onRingLeave = (event: MouseEvent<SVGCircleElement>, songId: string) => {
    const related = event.relatedTarget as Element | null;
    const movingToArtist = !!related?.closest?.(".vre__artist-group");

    if (!movingToArtist && selectedSongId !== songId) {
      setHoveredSongId(null);
      setHoveredArtistId(null);
    }
  };

  const onArtistEnter = (songId: string, artistId: string) => {
    setHoveredSongId(songId);
    setHoveredArtistId(artistId);
  };

  const onArtistLeave = (artistId: string) => {
    if (hoveredArtistId === artistId) {
      setHoveredArtistId(null);
    }
  };

  return (
    <div
      className={cx("vre", className)}
      style={{
        ...style,
        minHeight,
        height,
        ["--vre-panel-width" as string]: `${panelWidth}px`,
      }}
    >
      <aside className="vre__left">
        <div className="vre__title">
          <h1 className="mcg-page-title mcg-page-title--flow mcg-page-title--tight mcg-page-title--light">
            {title}
          </h1>
          <p className="vre__subtitle">{subtitle}</p>
        </div>
      </aside>

      <main className="vre__right">
        <div className="vre__visual">
          <svg
            className="vre__svg"
            viewBox="-600 -600 1200 1200"
            aria-label="Vinyl visualization"
          >
            <defs>
              <linearGradient
                id="vre-ring-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="50%" stopColor="#cccccc" />
                <stop offset="100%" stopColor="#4a4a4a" />
              </linearGradient>

              <clipPath id="vre-center-clip">
                <circle cx="0" cy="0" r="100" />
              </clipPath>

              {activeArtists.map((artist, index) => {
                const point = coords(index, activeSongRadius);
                return (
                  <clipPath key={artist.id} id={artistClipId(artist.id)}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isHoveredArtist(artist.id) ? 18 : 16}
                    />
                  </clipPath>
                );
              })}
            </defs>

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="490"
              fill="none"
              stroke="#0f0f0f"
              strokeWidth="48"
            />

            <g>
              {Array.from({ length: 70 }, (_, index) => (
                <circle
                  key={index}
                  className="vre__no-pointer"
                  cx="0"
                  cy="0"
                  r={120 + index * 5}
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="110"
              fill="#1a1a1a"
              stroke="#2a2a2a"
              strokeWidth="2"
            />

            <image
              className="vre__no-pointer"
              href={centerImageUrl}
              x="-250"
              y="-150"
              width="400"
              height="400"
              clipPath="url(#vre-center-clip)"
              preserveAspectRatio="xMidYMid slice"
            />

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="25"
              fill="black"
            />

            <g>
              {rings.map((ring) => {
                if (ring.decorative) {
                  return (
                    <circle
                      key={ring.key}
                      className="vre__no-pointer vre__decorative"
                      cx="0"
                      cy="0"
                      r={ring.radius}
                      fill="none"
                      stroke="url(#vre-ring-gradient)"
                      strokeWidth="1"
                    />
                  );
                }

                return (
                  <g key={ring.key} data-song-id={ring.song.id}>
                    <circle
                      className="vre__hover-target"
                      cx="0"
                      cy="0"
                      r={ring.radius}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="30"
                      onMouseEnter={() => onRingEnter(ring.song.id)}
                      onClick={() => onRingEnter(ring.song.id)}
                      onMouseLeave={(event) => onRingLeave(event, ring.song.id)}
                    />

                    <circle
                      className="vre__visible-ring"
                      cx="0"
                      cy="0"
                      r={ring.radius}
                      fill="none"
                      stroke={
                        activeSongId === ring.song.id
                          ? "#f9e4d2"
                          : "url(#vre-ring-gradient)"
                      }
                      strokeWidth={activeSongId === ring.song.id ? 2.5 : 1.5}
                    />

                    <g className="vre__artists-layer">
                      {activeSongId === ring.song.id
                        ? ring.song.artists.map((artist, index) => {
                            const point = coords(index, ring.radius);
                            const hovered = isHoveredArtist(artist.id);
                            const size = hovered ? 36 : 32;
                            const radius = hovered ? 18 : 16;

                            return (
                              <g
                                key={artist.id}
                                className="vre__artist-group vre__pop-in vre__pop-in-active"
                                onMouseEnter={() =>
                                  onArtistEnter(ring.song.id, artist.id)
                                }
                                onMouseLeave={() => onArtistLeave(artist.id)}
                              >
                                <circle
                                  className="vre__artist-hover-target"
                                  cx={point.x}
                                  cy={point.y}
                                  r="28"
                                  fill="transparent"
                                />

                                <circle
                                  className="vre__artist-border"
                                  cx={point.x}
                                  cy={point.y}
                                  r={radius}
                                  fill="none"
                                  stroke={hovered ? "#EF4444" : "#DC2626"}
                                  strokeWidth="3"
                                />

                                <image
                                  className="vre__artist-image vre__no-pointer"
                                  href={artist.imageUrl}
                                  x={point.x - radius}
                                  y={point.y - radius}
                                  width={size}
                                  height={size}
                                  clipPath={`url(#${artistClipId(artist.id)})`}
                                  preserveAspectRatio="xMidYMid slice"
                                />
                              </g>
                            );
                          })
                        : null}
                    </g>
                  </g>
                );
              })}
            </g>

            <circle
              className="vre__no-pointer"
              cx="0"
              cy="0"
              r="490"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="36"
            />
          </svg>
        </div>

        <div className="vre__preview">
          {loading ? (
            <div className="vre__empty-hint">{loadingText}</div>
          ) : loadError ? (
            <div className="vre__empty-hint">{errorText}</div>
          ) : !hoveredArtist ? (
            <div className="vre__empty-hint">{emptyText}</div>
          ) : (
            <div className="vre__artist-card vre__enter-up">
              <div className="vre__artist-img-wrap">
                <img src={hoveredArtist.imageUrl} alt={hoveredArtist.name} />
              </div>
              <div className="vre__artist-info">
                <div className="vre__artist-header">
                  <p className="vre__song-italic">
                    ‘{activeSong?.title ?? ""}’
                  </p>
                  <div className="vre__artist-title-row">
                    <h2>{hoveredArtist.name}</h2>
                    <div className="vre__year">{hoveredArtist.year}</div>
                  </div>
                </div>
                <p className="vre__desc">{hoveredArtist.description}</p>
              </div>
            </div>
          )}
        </div>

        <aside className="vre__panel">
          <div className="vre__legend">
            <div className="vre__legend-row">
              <span className="vre__dot" />
              <span>{songLabel}</span>
            </div>
            <div className="vre__legend-row">
              <span className="vre__dot vre__dot--red" />
              <span>{artistLabel}</span>
            </div>
          </div>

          <div className="vre__song-section">
            <h3>Songs</h3>
            <div className="vre__song-list">
              {songs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  className={cx(
                    "vre__song-btn",
                    activeSongId === song.id && "is-active",
                  )}
                  onMouseEnter={() => onSongHover(song.id)}
                  onMouseLeave={() => onSongUnhover(song.id)}
                  onClick={() => selectSong(song.id)}
                >
                  <span className="vre__song-title">{song.title}</span>
                  <span className="vre__song-meta">{song.originalYear}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export const SectionVinyl = VinylRecordExplorer;
export default VinylRecordExplorer;
