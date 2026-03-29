import rawCareerTimeline from "../../../public/images/data/career-timeline.json" with { type: "json" };

// ─── SHARED CONSTANTS & TYPES ────────────────────────────────────────────────

export const sectionWidth = 1280;
export const numSections = 10;
export const totalWidth = numSections * sectionWidth;

// Timeline bar total height — desktop
export const timelineHeight = 160;
// Top padding inside bar before first line — keep it tight so lines don't get cut
export const timelineTopPad = 28;
// Spacing between the 5 role lines
export const timelineLineSpacing = 16;

// Mobile timeline height
export const mobileTimelineHeight = 200;
export const yearStart = 1901;
export const yearEnd = 2000;
export const yearSpan = yearEnd - yearStart;
export function yearToX(year: number): number {
  return ((year - yearStart) / yearSpan) * totalWidth;
}

// Calculate section width based on year span
export function getSectionWidth(startYear: number, endYear: number): number {
  const yearSpan = endYear - startYear;
  // For sections outside timeline or zero-span, give them minimal width
  if (yearSpan <= 0) return 50; // 50px minimum for zero-span sections like intro/about
  return (yearSpan / yearSpan) * totalWidth;
}

export type RawLyric = {
  text: string;
  lineIndex: number;
  phraseGroup: number;
};

/**
 * Generate lyric positions dynamically across the timeline
 * @param lyrics Array of lyrics with text and lineIndex
 * @param spreadFactor Controls how spread out the lyrics are (0.5 = tight, 1.0 = full width)
 * @returns Array of positioned LyricLabel objects
 */
export function generateLyricPositions(
  lyrics: RawLyric[],
  spreadFactor: number = 0.7,
): LyricLabel[] {
  return lyrics.map((lyric, index) => {
    // Distribute evenly across the full width, then apply spread factor
    const normalizedPosition =
      (index / Math.max(lyrics.length - 1, 1)) * totalWidth;
    const x = Math.round(normalizedPosition * spreadFactor);

    return {
      id: `ly-${String(index).padStart(3, "0")}`,
      text: lyric.text,
      x,
      lineIndex: lyric.lineIndex,
    };
  });
}
export type RoleLine = {
  id: string;
  label: string;
  color: string;
  y: number;
};
type CareerTimelineData = {
  roleLines: Array<Omit<RoleLine, "y">>;
  legendItems: LegendItem[];
  sectionsMeta: SectionMeta[];
  events: Array<{
    id: number;
    year: number;
    dateText: string;
    event: string;
    categories: Array<
      "musician" | "vocalist" | "bandleader" | "ambassador" | "film"
    >;
    url?: string;
  }>;
};

const careerTimelineData = rawCareerTimeline as CareerTimelineData;

export const roleLines: RoleLine[] = careerTimelineData.roleLines.map(
  (line, idx) => ({
    ...line,
    y: timelineTopPad + timelineLineSpacing * idx,
  }),
);
export type LegendItem = {
  color: string;
  label: string;
  solid?: boolean;
  outline?: boolean;
};
export const legendItems: LegendItem[] = careerTimelineData.legendItems;
export type SectionMeta = {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
};
export const sectionsMeta: SectionMeta[] = careerTimelineData.sectionsMeta;
export type TLDot = {
  id: string;
  year: number;
  role: string;
  dateText: string;
  label: string;
  event: string;
  categories: Array<
    "musician" | "vocalist" | "bandleader" | "ambassador" | "film"
  >;
  url?: string;
  outlined?: boolean;
};
export const timelineDots: TLDot[] = careerTimelineData.events.flatMap(
  (event) =>
    event.categories.map((category) => ({
      id: `${event.id}-${category}`,
      year: event.year,
      role: category,
      dateText: event.dateText,
      label: `${careerTimelineData.roleLines.find((role) => role.id === category)?.label ?? category}: ${event.event}`,
      event: event.event,
      categories: event.categories,
      url: event.url,
      outlined:
        event.id === 82 ||
        event.id === 87 ||
        event.id === 91 ||
        event.id === 93,
    })),
);
export type MapRoute = {
  id: string;
  color: string;
  label: string;
  width: number;
};
export const mapRoutes: MapRoute[] = [
  {
    id: "louis-route",
    color: "rgba(208, 28, 145, 1)",
    label: "Louis Armstrong 1960-61",
    width: 2,
  },
  {
    id: "dizzy-route",
    color: "rgba(45, 170, 0, 1)",
    label: "Dizzy Gillespie 1956",
    width: 2,
  },
  {
    id: "benny-route",
    color: "rgba(255, 132, 0, 1)",
    label: "Benny Goodman 1956 + 1962",
    width: 2,
  },
  {
    id: "dave-route",
    color: "rgba(73, 188, 255, 1)",
    label: "Dave Brubeck 1958",
    width: 2,
  },
  {
    id: "duke-route",
    color: "rgba(151, 71, 255, 1)",
    label: "Duke Ellington 1963",
    width: 2,
  },
];
export const albumImages: string[] = [
  "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/9c84f400-2f6a-4687-879c-c49301f775ed.jpg",
  "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/2c79a1ad-ca63-443b-9c23-129efe694154.jpg",
  "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/84827751-864c-4c26-9629-a0b725c23b4d.jpg",
  "https://storage.googleapis.com/storage.magicpath.ai/user/371750313973129216/figma-assets/b802efd5-1934-4e1e-8e0d-da5c6ed6c09c.jpg",
];
export const albumPositions: {
  left: number;
  top: number;
}[] = [
  {
    left: 192,
    top: 101,
  },
  {
    left: 155,
    top: 163,
  },
  {
    left: 242,
    top: 104,
  },
  {
    left: 163,
    top: 200,
  },
  {
    left: 296,
    top: 101,
  },
  {
    left: 372,
    top: 101,
  },
  {
    left: 92,
    top: 144,
  },
  {
    left: 444,
    top: 91,
  },
  {
    left: 143,
    top: 121,
  },
  {
    left: 528,
    top: 0,
  },
  {
    left: 402,
    top: 27,
  },
  {
    left: 568,
    top: 106,
  },
  {
    left: 192,
    top: 138,
  },
  {
    left: 228,
    top: 138,
  },
  {
    left: 264,
    top: 138,
  },
  {
    left: 300,
    top: 138,
  },
  {
    left: 336,
    top: 138,
  },
  {
    left: 105,
    top: 182,
  },
  {
    left: 228,
    top: 174,
  },
  {
    left: 300,
    top: 174,
  },
  {
    left: 336,
    top: 174,
  },
  {
    left: 715,
    top: 108,
  },
  {
    left: 688,
    top: 14,
  },
  {
    left: 806,
    top: 276,
  },
  {
    left: 800,
    top: 233,
  },
  {
    left: 424,
    top: 91,
  },
  {
    left: 699,
    top: 52,
  },
  {
    left: 656,
    top: 82,
  },
  {
    left: 49,
    top: 142,
  },
  {
    left: 228,
    top: 210,
  },
  {
    left: 264,
    top: 235,
  },
  {
    left: 750,
    top: 182,
  },
  {
    left: 336,
    top: 210,
  },
  {
    left: 163,
    top: 364,
  },
  {
    left: 325,
    top: 107,
  },
  {
    left: 580,
    top: 69,
  },
  {
    left: 714,
    top: 304,
  },
  {
    left: 336,
    top: 285,
  },
  {
    left: 791,
    top: 384,
  },
  {
    left: 630,
    top: 146,
  },
  {
    left: 70,
    top: 276,
  },
  {
    left: 106,
    top: 295,
  },
  {
    left: 142,
    top: 276,
  },
  {
    left: 178,
    top: 276,
  },
];
export type LyricLabel = {
  id: string;
  text: string;
  x: number;
  lineIndex: number;
};

// Raw lyrics with line and phrase group assignment
export const rawLyrics: RawLyric[] = [
  { text: "Who's", lineIndex: 2, phraseGroup: 0 },
  { text: "the", lineIndex: 0, phraseGroup: 0 },
  { text: "real", lineIndex: 4, phraseGroup: 0 },
  { text: "ambassador?", lineIndex: 1, phraseGroup: 0 },
  { text: "It", lineIndex: 3, phraseGroup: 1 },
  { text: "is", lineIndex: 0, phraseGroup: 1 },
  { text: "evident", lineIndex: 2, phraseGroup: 1 },
  { text: "we", lineIndex: 4, phraseGroup: 1 },
  { text: "represent", lineIndex: 1, phraseGroup: 1 },
  { text: "American", lineIndex: 3, phraseGroup: 1 },
  { text: "society", lineIndex: 0, phraseGroup: 1 },
  { text: "Noted", lineIndex: 2, phraseGroup: 2 },
  { text: "for", lineIndex: 4, phraseGroup: 2 },
  { text: "its", lineIndex: 1, phraseGroup: 2 },
  { text: "etiquette", lineIndex: 3, phraseGroup: 2 },
  { text: "its", lineIndex: 0, phraseGroup: 2 },
  { text: "manners", lineIndex: 2, phraseGroup: 2 },
  { text: "and", lineIndex: 4, phraseGroup: 2 },
  { text: "sobriety", lineIndex: 1, phraseGroup: 2 },
  { text: "We", lineIndex: 3, phraseGroup: 3 },
  { text: "have", lineIndex: 0, phraseGroup: 3 },
  { text: "followed", lineIndex: 2, phraseGroup: 3 },
  { text: "protocol", lineIndex: 4, phraseGroup: 3 },
  { text: "with", lineIndex: 1, phraseGroup: 3 },
  { text: "absolute", lineIndex: 3, phraseGroup: 3 },
  { text: "propriety", lineIndex: 0, phraseGroup: 3 },
  { text: "We're", lineIndex: 2, phraseGroup: 4 },
  { text: "Yankees", lineIndex: 4, phraseGroup: 4 },
  { text: "to", lineIndex: 1, phraseGroup: 4 },
  { text: "the", lineIndex: 3, phraseGroup: 4 },
  { text: "core", lineIndex: 0, phraseGroup: 4 },
  { text: "We're", lineIndex: 2, phraseGroup: 5 },
  { text: "the", lineIndex: 4, phraseGroup: 5 },
  { text: "real", lineIndex: 1, phraseGroup: 5 },
  { text: "ambassadors", lineIndex: 3, phraseGroup: 5 },
  { text: "Though", lineIndex: 0, phraseGroup: 6 },
  { text: "we", lineIndex: 2, phraseGroup: 6 },
  { text: "may", lineIndex: 4, phraseGroup: 6 },
  { text: "appear", lineIndex: 1, phraseGroup: 6 },
  { text: "as", lineIndex: 3, phraseGroup: 6 },
  { text: "bores", lineIndex: 0, phraseGroup: 6 },
  { text: "we", lineIndex: 2, phraseGroup: 6 },
  { text: "are", lineIndex: 4, phraseGroup: 6 },
  { text: "diplomats", lineIndex: 1, phraseGroup: 6 },
  { text: "in", lineIndex: 3, phraseGroup: 6 },
  { text: "our", lineIndex: 0, phraseGroup: 6 },
  { text: "proper", lineIndex: 2, phraseGroup: 6 },
  { text: "hats", lineIndex: 4, phraseGroup: 6 },
  { text: "Our", lineIndex: 1, phraseGroup: 7 },
  { text: "attire", lineIndex: 3, phraseGroup: 7 },
  { text: "becomes", lineIndex: 0, phraseGroup: 7 },
  { text: "habitual", lineIndex: 2, phraseGroup: 7 },
  { text: "along", lineIndex: 4, phraseGroup: 7 },
  { text: "with", lineIndex: 1, phraseGroup: 7 },
  { text: "all", lineIndex: 3, phraseGroup: 7 },
  { text: "the", lineIndex: 0, phraseGroup: 7 },
  { text: "ritual", lineIndex: 2, phraseGroup: 7 },
  { text: "The", lineIndex: 4, phraseGroup: 8 },
  { text: "diplomatic", lineIndex: 1, phraseGroup: 8 },
  { text: "corps", lineIndex: 3, phraseGroup: 8 },
  { text: "has", lineIndex: 0, phraseGroup: 8 },
  { text: "been", lineIndex: 2, phraseGroup: 8 },
  { text: "analyzed", lineIndex: 4, phraseGroup: 8 },
  { text: "and", lineIndex: 1, phraseGroup: 8 },
  { text: "criticized", lineIndex: 3, phraseGroup: 8 },
  { text: "NBC", lineIndex: 0, phraseGroup: 8 },
  { text: "and", lineIndex: 2, phraseGroup: 8 },
  { text: "CBS", lineIndex: 4, phraseGroup: 8 },
  { text: "Senators", lineIndex: 1, phraseGroup: 9 },
  { text: "and", lineIndex: 3, phraseGroup: 9 },
  { text: "congressmen", lineIndex: 0, phraseGroup: 9 },
  { text: "so", lineIndex: 2, phraseGroup: 9 },
  { text: "concerned", lineIndex: 4, phraseGroup: 9 },
  { text: "can't", lineIndex: 1, phraseGroup: 9 },
  { text: "recess", lineIndex: 3, phraseGroup: 9 },
  { text: "State", lineIndex: 0, phraseGroup: 10 },
  { text: "Department", lineIndex: 2, phraseGroup: 10 },
  { text: "stands", lineIndex: 4, phraseGroup: 10 },
  { text: "in", lineIndex: 1, phraseGroup: 10 },
  { text: "awe", lineIndex: 3, phraseGroup: 10 },
  { text: "coup", lineIndex: 0, phraseGroup: 10 },
  { text: "d'etat", lineIndex: 2, phraseGroup: 10 },
  { text: "Has", lineIndex: 4, phraseGroup: 11 },
  { text: "met", lineIndex: 1, phraseGroup: 11 },
  { text: "success", lineIndex: 3, phraseGroup: 11 },
  { text: "great", lineIndex: 0, phraseGroup: 11 },
  { text: "uproar", lineIndex: 2, phraseGroup: 11 },
  { text: "Who's", lineIndex: 4, phraseGroup: 12 },
  { text: "the", lineIndex: 1, phraseGroup: 12 },
  { text: "real", lineIndex: 3, phraseGroup: 12 },
  { text: "ambassador?", lineIndex: 0, phraseGroup: 12 },
  { text: "Yeah!", lineIndex: 2, phraseGroup: 13 },
  { text: "The", lineIndex: 4, phraseGroup: 14 },
  { text: "real", lineIndex: 1, phraseGroup: 14 },
  { text: "ambassador!", lineIndex: 3, phraseGroup: 14 },
  { text: "I'm", lineIndex: 0, phraseGroup: 15 },
  { text: "the", lineIndex: 2, phraseGroup: 15 },
  { text: "real", lineIndex: 4, phraseGroup: 15 },
  { text: "ambassador", lineIndex: 1, phraseGroup: 15 },
  { text: "It", lineIndex: 3, phraseGroup: 16 },
  { text: "is", lineIndex: 0, phraseGroup: 16 },
  { text: "evident", lineIndex: 2, phraseGroup: 16 },
  { text: "I", lineIndex: 4, phraseGroup: 16 },
  { text: "was", lineIndex: 1, phraseGroup: 16 },
  { text: "sent", lineIndex: 3, phraseGroup: 16 },
  { text: "by", lineIndex: 0, phraseGroup: 16 },
  { text: "government", lineIndex: 2, phraseGroup: 16 },
  { text: "to", lineIndex: 4, phraseGroup: 16 },
  { text: "take", lineIndex: 1, phraseGroup: 16 },
  { text: "your", lineIndex: 3, phraseGroup: 16 },
  { text: "place", lineIndex: 0, phraseGroup: 16 },
  { text: "All", lineIndex: 2, phraseGroup: 17 },
  { text: "I", lineIndex: 4, phraseGroup: 17 },
  { text: "do", lineIndex: 1, phraseGroup: 17 },
  { text: "is", lineIndex: 3, phraseGroup: 17 },
  { text: "play", lineIndex: 0, phraseGroup: 17 },
  { text: "the", lineIndex: 2, phraseGroup: 17 },
  { text: "blues", lineIndex: 4, phraseGroup: 17 },
  { text: "and", lineIndex: 1, phraseGroup: 17 },
  { text: "meet", lineIndex: 3, phraseGroup: 17 },
  { text: "the", lineIndex: 0, phraseGroup: 17 },
  { text: "people", lineIndex: 2, phraseGroup: 17 },
  { text: "face", lineIndex: 4, phraseGroup: 17 },
  { text: "to", lineIndex: 1, phraseGroup: 17 },
  { text: "face", lineIndex: 3, phraseGroup: 17 },
  { text: "I'll", lineIndex: 0, phraseGroup: 18 },
  { text: "explain", lineIndex: 2, phraseGroup: 18 },
  { text: "I", lineIndex: 4, phraseGroup: 18 },
  { text: "represent", lineIndex: 1, phraseGroup: 18 },
  { text: "the", lineIndex: 3, phraseGroup: 18 },
  { text: "human", lineIndex: 0, phraseGroup: 18 },
  { text: "race", lineIndex: 2, phraseGroup: 18 },
  { text: "don't", lineIndex: 4, phraseGroup: 18 },
  { text: "pretend", lineIndex: 1, phraseGroup: 18 },
  { text: "no", lineIndex: 3, phraseGroup: 18 },
  { text: "more", lineIndex: 0, phraseGroup: 18 },
  { text: "Certain", lineIndex: 2, phraseGroup: 19 },
  { text: "facts", lineIndex: 4, phraseGroup: 19 },
  { text: "we", lineIndex: 1, phraseGroup: 19 },
  { text: "can't", lineIndex: 3, phraseGroup: 19 },
  { text: "ignore", lineIndex: 0, phraseGroup: 19 },
  { text: "In", lineIndex: 2, phraseGroup: 20 },
  { text: "my", lineIndex: 4, phraseGroup: 20 },
  { text: "humble", lineIndex: 1, phraseGroup: 20 },
  { text: "way", lineIndex: 3, phraseGroup: 20 },
  { text: "I'm", lineIndex: 0, phraseGroup: 20 },
  { text: "the", lineIndex: 2, phraseGroup: 20 },
  { text: "USA", lineIndex: 4, phraseGroup: 20 },
  { text: "Though", lineIndex: 1, phraseGroup: 21 },
  { text: "I", lineIndex: 3, phraseGroup: 21 },
  { text: "represent", lineIndex: 0, phraseGroup: 21 },
  { text: "the", lineIndex: 2, phraseGroup: 21 },
  { text: "government", lineIndex: 4, phraseGroup: 21 },
  { text: "the", lineIndex: 1, phraseGroup: 21 },
  { text: "government", lineIndex: 3, phraseGroup: 21 },
  { text: "doesn't", lineIndex: 0, phraseGroup: 22 },
  { text: "represent", lineIndex: 2, phraseGroup: 22 },
  { text: "some", lineIndex: 4, phraseGroup: 22 },
  { text: "policies", lineIndex: 1, phraseGroup: 22 },
  { text: "I'm", lineIndex: 3, phraseGroup: 22 },
  { text: "for", lineIndex: 0, phraseGroup: 22 },
  { text: "segregation", lineIndex: 2, phraseGroup: 23 },
  { text: "isn't", lineIndex: 4, phraseGroup: 23 },
  { text: "legality", lineIndex: 1, phraseGroup: 23 },
  { text: "Soon", lineIndex: 3, phraseGroup: 24 },
  { text: "our", lineIndex: 0, phraseGroup: 24 },
  { text: "only", lineIndex: 2, phraseGroup: 24 },
  { text: "differences", lineIndex: 4, phraseGroup: 24 },
  { text: "will", lineIndex: 1, phraseGroup: 24 },
  { text: "be", lineIndex: 3, phraseGroup: 24 },
  { text: "in", lineIndex: 0, phraseGroup: 24 },
  { text: "personality", lineIndex: 2, phraseGroup: 24 },
  { text: "That's", lineIndex: 4, phraseGroup: 25 },
  { text: "what", lineIndex: 1, phraseGroup: 25 },
  { text: "I", lineIndex: 3, phraseGroup: 25 },
  { text: "stand", lineIndex: 0, phraseGroup: 25 },
  { text: "for", lineIndex: 2, phraseGroup: 25 },
  { text: "Yes!", lineIndex: 4, phraseGroup: 26 },
  { text: "The", lineIndex: 1, phraseGroup: 27 },
  { text: "real", lineIndex: 3, phraseGroup: 27 },
  { text: "ambassador!", lineIndex: 0, phraseGroup: 27 },
  { text: "In", lineIndex: 2, phraseGroup: 28 },
  { text: "his", lineIndex: 4, phraseGroup: 28 },
  { text: "humble", lineIndex: 1, phraseGroup: 28 },
  { text: "way", lineIndex: 3, phraseGroup: 28 },
  { text: "he's", lineIndex: 0, phraseGroup: 28 },
  { text: "the", lineIndex: 2, phraseGroup: 28 },
  { text: "USA", lineIndex: 4, phraseGroup: 28 },
  { text: "He's", lineIndex: 1, phraseGroup: 29 },
  { text: "the", lineIndex: 3, phraseGroup: 29 },
  { text: "real", lineIndex: 0, phraseGroup: 29 },
  { text: "ambassador", lineIndex: 2, phraseGroup: 29 },
  { text: "Yes!", lineIndex: 4, phraseGroup: 30 },
  { text: "The", lineIndex: 1, phraseGroup: 31 },
  { text: "real", lineIndex: 3, phraseGroup: 31 },
  { text: "ambassador", lineIndex: 0, phraseGroup: 31 },
];

// spreadFactor: Controls lyric spacing
// 0.5 = tight (50% of full width)
// 1.0 = full timeline width (12,800px)
// 1.2+ = very loose/spread out
const spreadFactor = 0.98;

// Generate positioned lyrics dynamically
export const lyricLabels: LyricLabel[] = generateLyricPositions(
  rawLyrics,
  spreadFactor,
);
