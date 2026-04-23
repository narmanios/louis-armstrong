import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { SectionIntroHero } from "./SectionIntroHero";
import { SectionAboutProject } from "./SectionAboutProject";
import { SectionCareerTimeline } from "./SectionCareerTimeline.tsx";
import { SectionTheBeginning } from "./SectionTheBeginning";
import { SectionJourneyToAmbassador } from "./SectionJourneyToAmbassador";
import { SectionJazzAmbassadors } from "./SectionJazzAmbassadors";
import { SectionFBIFiles } from "./SectionFBIFiles";
import { SectionAfricaTour } from "./SectionAfricaTour";
import { SectionRealAmbassadors } from "./SectionRealAmbassadors";
import { SectionWorldFair } from "./SectionWorldFair";
import { SectionGoodwillAmbassador } from "./SectionGoodwill/SectionGoodwillAmbassador.tsx";
import { SectionWonderfulWorld } from "./SectionWonderfulWorld/SectionWonderfulWorld.tsx";
import { SectionVinyl } from "./SectionVinyl.tsx";
import JazzAmbassadorsMap from "./JazzAmbassadorsMap.tsx";
import { SectionGlobalCountries } from "./SectionGlobalCountries.tsx";
interface MainCollectionsProps {
  className?: string;
}

type GroupId = "history" | "legacy" | "ambassador";
type TimelineJumpTarget =
  | { kind: "intro" }
  | { kind: "section"; groupId: GroupId; sectionIdx: number };

type StatsCardKey =
  | "history-0"
  | "history-1"
  | "history-2"
  | "legacy-0"
  | "legacy-1"
  | "ambassador-0"
  | "ambassador-1"
  | "ambassador-2"
  | "ambassador-3"
  | "ambassador-4"
  | "ambassador-5";

type StatsCardStat = {
  label: string;
  value: string;
};

type StatsCardContent = {
  description: string;
};

const buildStatsCard = (
  description = "Add section-specific copy here. Add a second sentence to support the section title.",
): StatsCardContent => ({
  description,
});

const statsCardContent: Record<StatsCardKey, StatsCardContent> = {
  "history-0": buildStatsCard(
    "At 62 years of age, Louis Armstrong’s “Hello, Dolly!” knocked the Beatles from No. 1 on the Billboard Hot 100 on May 9, 1964.",
  ),
  "history-1": buildStatsCard(
    "At just 11, Louis Armstrong got his first formal music training in a boys’ reform home.\n\nBy 1923, he was a featured soloist on recordings with King Oliver’s Creole Jazz Band, marking the start of his rise to international stardom.",
  ),
  "history-2": buildStatsCard(
    "Louis Armstrong’s career spanned over 50 years, during which he became one of the most influential figures in jazz and popular music.",
  ),
  "legacy-0": buildStatsCard(
    "Louis Armstrong’s music still lives on in screen media today, from “Dream a Little Dream of Me” in Stranger Things to “We Have All the Time in the World” in the James Bond film No Time to Die.",
  ),
  "legacy-1": buildStatsCard(
    "The lasting legacy of the song “What a Wonderful World” can be seen in the many rerecordings as it continues to inspire, proving that Louis Armstrong’s voice and message still resonate across generations.",
  ),
  "ambassador-0": buildStatsCard(
    "Louis Armstrong became a goodwill ambassador long before the title was official, traveling the world as one of the first Black pop stars to spread jazz and American culture abroad.",
  ),
  "ambassador-1": buildStatsCard(
    "The Jazz Diplomacy program sent musicians overseas to promote jazz while also projecting an image of American freedom and culture abroad, even as Cold War conflict and segregation at home challenged that image.",
  ),
  "ambassador-2": buildStatsCard(
    "The Africa tour that Armstrong undertook in 1960 as part of the Jazz Diplomacy program, was a key moment in his role as a cultural ambassador and in the broader context of U.S. cultural diplomacy during the Cold War.",
  ),
  "ambassador-3": buildStatsCard(
    "Louis Armstrong was sent abroad to symbolize American freedom, even as FBI files, segregation, and voter suppression exposed how limited that freedom was at home.",
  ),
  "ambassador-4": buildStatsCard(
    "Real Ambassadors was a jazz musical that was a satirical take on the Jazz Diplomacy program, using humor to critique the contradictions of American cultural diplomacy during the Cold War.",
  ),
  "ambassador-5": buildStatsCard(
    "1964 World Fair in New York and the 1965 Berlin tour were major highlights of Armstrong's ambassadorial career, showcasing his global influence",
  ),
};

export const MainCollections: React.FC<MainCollectionsProps> = ({
  className,
}) => {
  const desktopGroupPeek = 0;
  const desktopGroupGap = 0;
  const desktopStickyHeaderHeight = 44;
  const desktopSectionAnchorOffset = 0;
  const introOverlayDurationMs = 780;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const introSectionRef = useRef<HTMLElement>(null);
  const mobileNavBarRef = useRef<HTMLDivElement>(null);
  const historyPageRef = useRef<HTMLDivElement>(null);
  const musicianPageRef = useRef<HTMLDivElement>(null);
  const ambassadorPageRef = useRef<HTMLDivElement>(null);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const musicianScrollRef = useRef<HTMLDivElement>(null);
  const ambassadorScrollRef = useRef<HTMLDivElement>(null);
  const historySectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const musicianSectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ambassadorSectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const sectionJumpTimeoutRef = useRef<number | null>(null);
  const introOverlayTimeoutRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const [showFixedGroupNav, setShowFixedGroupNav] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<GroupId>("history");
  const [activeStatsCardKey, setActiveStatsCardKey] =
    useState<StatsCardKey | null>(null);
  const [statsCardVisible, setStatsCardVisible] = useState(false);
  const [dismissedStatsCards, setDismissedStatsCards] = useState<
    Set<StatsCardKey>
  >(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOverlayOpen, setIsAboutOverlayOpen] = useState(false);
  const [introOverlayGroupId, setIntroOverlayGroupId] =
    useState<GroupId | null>(null);
  const [currentSectionIndices, setCurrentSectionIndices] = useState<
    Record<GroupId, number>
  >({
    history: 0,
    ambassador: 0,
    legacy: 0,
  });
  const groupNavItems: Array<{ id: GroupId; label: string }> = [
    { id: "history", label: "History" },
    { id: "ambassador", label: "Ambassador" },
    { id: "legacy", label: "Legacy" },
  ];
  const groupSectionItems: Record<GroupId, string[]> = {
    history: [
      "Historical Highlights",
      "The Beginning",
      "Journey to Ambassador",
    ],
    ambassador: [
      "Goodwill Ambassador",
      "Jazz Ambassadors",
      "Africa Tour",
      "FBI Files",
      "The Real Ambassadors",
      "World Fair + Berlin",
    ],
    legacy: ["Legacy on Screen", "What a Wonderful World"],
  };
  const timelineTargetMap: TimelineJumpTarget[] = [
    { kind: "intro" },
    { kind: "section", groupId: "history", sectionIdx: 0 },
    { kind: "section", groupId: "history", sectionIdx: 1 },
    { kind: "section", groupId: "history", sectionIdx: 2 },
    { kind: "section", groupId: "legacy", sectionIdx: 0 },
    { kind: "section", groupId: "legacy", sectionIdx: 1 },
    // { kind: "section", groupId: "legacy", sectionIdx: 1 },
    { kind: "section", groupId: "ambassador", sectionIdx: 0 },
    { kind: "section", groupId: "ambassador", sectionIdx: 3 },
    { kind: "section", groupId: "ambassador", sectionIdx: 4 },
    { kind: "section", groupId: "ambassador", sectionIdx: 5 },
  ];

  const renderScrollArrowIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 60 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M29.6641 81.0617C29.5391 81.0617 29.3828 81.0617 29.2578 81.0304C28.6641 80.9679 28.0703 80.7179 27.6016 80.2804C27.5391 80.2179 27.4766 80.1867 27.4141 80.1242L0.9141 53.6242C-0.3047 52.4054 -0.3047 50.4367 0.9141 49.218C2.1329 47.9993 4.1016 47.9992 5.3203 49.218L26.5393 70.406V3.125C26.5393 1.4062 27.9455 0 29.6643 0C31.3831 0 32.7893 1.4062 32.7893 3.125V70.406L53.9773 49.218C55.1961 47.9992 57.1648 47.9992 58.3835 49.218C59.0085 49.843 59.2898 50.6242 59.2898 51.4368C59.2898 52.2494 58.9773 53.0306 58.3835 53.6556L31.8525 80.1866C31.29 80.7491 30.6025 81.0303 29.8837 81.0928C29.8212 81.0616 29.7266 81.0617 29.6641 81.0617Z"
        fill="#CF6B4C"
      />
    </svg>
  );

  const getMobileNavOffset = () => {
    if (!isMobile || !showFixedGroupNav) return 0;
    return mobileNavBarRef.current?.offsetHeight ?? 61;
  };

  const scrollMobileElementIntoView = (target: HTMLElement | null) => {
    if (!target) return;

    const mobileOffset = getMobileNavOffset();
    const targetTop =
      window.scrollY + target.getBoundingClientRect().top - mobileOffset - 12;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  };

  const scrollToTrackChild = (targetSectionIdx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const child = container.children[targetSectionIdx] as
      | HTMLElement
      | undefined;
    if (!child) return;

    if (isMobile) {
      scrollMobileElementIntoView(child);
      return;
    }

    container.scrollTo({
      left: Math.max(child.offsetLeft - desktopGroupPeek, 0),
      behavior: "auto",
    });
  };

  const getGroupPageElement = (groupId: GroupId) => {
    if (groupId === "history") return historyPageRef.current;
    if (groupId === "legacy") return musicianPageRef.current;
    return ambassadorPageRef.current;
  };

  const getGroupScroller = (groupId: GroupId) => {
    if (groupId === "history") return historyScrollRef.current;
    if (groupId === "legacy") return musicianScrollRef.current;
    return ambassadorScrollRef.current;
  };

  const getGroupSectionElements = (groupId: GroupId) => {
    if (groupId === "history") return historySectionRefs.current;
    if (groupId === "legacy") return musicianSectionRefs.current;
    return ambassadorSectionRefs.current;
  };

  const getDesktopSectionAnchorOffset = (section: HTMLDivElement | null) => {
    if (!section) return desktopSectionAnchorOffset;
    return section.classList.contains("mcg-group-section--auto-height")
      ? 16
      : desktopSectionAnchorOffset;
  };

  const getSectionStatsCardKey = (
    groupId: GroupId | null,
    sectionIdx: number | null,
  ): StatsCardKey | null => {
    if (!groupId || sectionIdx === null) {
      return null;
    }

    return `${groupId}-${sectionIdx}` as StatsCardKey;
  };

  const getActiveStatsCardKeyForGroup = (groupId: GroupId) => {
    const scroller = getGroupScroller(groupId);
    const sections = getGroupSectionElements(groupId).filter(
      (section): section is HTMLDivElement => !!section,
    );

    if (sections.length === 0) {
      return null;
    }

    if (!scroller) {
      const sectionIndex = getGroupSectionElements(groupId).findIndex(
        (section) => !!section && section.getBoundingClientRect().top >= 0,
      );
      return getSectionStatsCardKey(
        groupId,
        sectionIndex >= 0 ? sectionIndex : 0,
      );
    }

    const viewportAnchor = scroller.scrollTop + scroller.clientHeight * 0.4;
    let activeIndex = 0;

    sections.forEach((section, index) => {
      if (section.offsetTop <= viewportAnchor) {
        activeIndex = index;
      }
    });

    return getSectionStatsCardKey(groupId, activeIndex);
  };

  const updateActiveStatsCard = () => {
    if (!showFixedGroupNav || introOverlayGroupId !== null) {
      setActiveStatsCardKey(null);
      return;
    }

    const scroller = getGroupScroller(currentGroupId);
    const sections = getGroupSectionElements(currentGroupId).filter(
      (section): section is HTMLDivElement => !!section,
    );

    let activeIndex = 0;

    if (sections.length > 0) {
      if (!scroller) {
        const sectionIndex = getGroupSectionElements(currentGroupId).findIndex(
          (section) => !!section && section.getBoundingClientRect().top >= 0,
        );
        activeIndex = sectionIndex >= 0 ? sectionIndex : 0;
      } else {
        const viewportAnchor = scroller.scrollTop + scroller.clientHeight * 0.4;
        sections.forEach((section, index) => {
          if (section.offsetTop <= viewportAnchor) {
            activeIndex = index;
          }
        });
      }
    }

    setCurrentSectionIndices((prev) => ({
      ...prev,
      [currentGroupId]: activeIndex,
    }));

    const nextKey = getSectionStatsCardKey(currentGroupId, activeIndex);
    setActiveStatsCardKey(nextKey);
  };

  const scrollToGroupSection = (groupId: GroupId, sectionIdx = 0) => {
    const page = getGroupPageElement(groupId);
    const scroller = getGroupScroller(groupId);
    const section = getGroupSectionElements(groupId)[sectionIdx] ?? null;
    const targetLeft = page
      ? Math.max(page.offsetLeft - desktopGroupPeek, 0)
      : 0;
    const targetTop = Math.max(
      (section?.offsetTop ?? 0) - getDesktopSectionAnchorOffset(section),
      0,
    );

    setCurrentGroupId(groupId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }

    if (isMobile) {
      scrollMobileElementIntoView(section ?? page);
      return;
    }

    const isNavigatingFromIntro = !showFixedGroupNav;
    if (introOverlayTimeoutRef.current !== null) {
      window.clearTimeout(introOverlayTimeoutRef.current);
      introOverlayTimeoutRef.current = null;
    }

    if (isNavigatingFromIntro) {
      setIntroOverlayGroupId(groupId);

      scroller?.scrollTo({
        top: targetTop,
        behavior: "auto",
      });

      scrollContainerRef.current?.scrollTo({
        left: targetLeft,
        behavior: "auto",
      });

      introOverlayTimeoutRef.current = window.setTimeout(() => {
        setShowFixedGroupNav(true);
        setIntroOverlayGroupId(null);
        introOverlayTimeoutRef.current = null;
      }, introOverlayDurationMs);
      return;
    }

    if (page) {
      scrollContainerRef.current?.scrollTo({
        left: Math.max(page.offsetLeft - desktopGroupPeek, 0),
        behavior: "auto",
      });
    }

    if (sectionJumpTimeoutRef.current !== null) {
      window.clearTimeout(sectionJumpTimeoutRef.current);
      sectionJumpTimeoutRef.current = null;
    }

    scroller?.scrollTo({
      top: targetTop,
      behavior: "auto",
    });
  };

  const scrollToTimelineSection = (timelineIdx: number) => {
    const target = timelineTargetMap[timelineIdx] ?? { kind: "intro" as const };
    if (target.kind === "intro") {
      scrollToTrackChild(0);
      return;
    }
    const { groupId, sectionIdx } = target;
    scrollToGroupSection(groupId, sectionIdx);
  };

  const scrollToGroup = (groupId: GroupId) => {
    scrollToGroupSection(groupId, 0);
  };

  const scrollGroupDown = (groupId: GroupId) => {
    const sections = getGroupSectionElements(groupId).filter(
      (section): section is HTMLDivElement => !!section,
    );
    if (sections.length === 0) return;

    if (isMobile) {
      const viewportAnchor = window.innerHeight * 0.25;
      const currentIndex = sections.reduce((closestIndex, section, index) => {
        const rect = section.getBoundingClientRect();
        const closestRect =
          sections[closestIndex]?.getBoundingClientRect() ?? rect;
        return Math.abs(rect.top - viewportAnchor) <
          Math.abs(closestRect.top - viewportAnchor)
          ? index
          : closestIndex;
      }, 0);
      const nextSection =
        sections[Math.min(currentIndex + 1, sections.length - 1)];
      scrollMobileElementIntoView(nextSection);
      return;
    }

    const scroller = getGroupScroller(groupId);
    if (!scroller) return;

    const threshold = scroller.scrollTop + 24;
    const nextSection =
      sections.find((section) => section.offsetTop > threshold) ??
      sections[sections.length - 1];

    scroller.scrollTo({
      top: nextSection.offsetTop,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const updateNavVisibility = () => {
      if (isMobile) {
        const introSection = introSectionRef.current;
        if (!introSection) return;
        const rect = introSection.getBoundingClientRect();
        const nextShowFixedGroupNav = rect.bottom <= 0;
        setShowFixedGroupNav(nextShowFixedGroupNav);

        const mobilePages: Array<{
          id: GroupId;
          element: HTMLDivElement | null;
        }> = [
          { id: "history", element: historyPageRef.current },
          { id: "ambassador", element: ambassadorPageRef.current },
          { id: "legacy", element: musicianPageRef.current },
        ];
        const viewportCenter = window.innerHeight * 0.35;
        const closestMobilePage = mobilePages.reduce<{
          id: GroupId;
          distance: number;
        } | null>((closest, page) => {
          if (!page.element) return closest;
          const pageRect = page.element.getBoundingClientRect();
          const distance = Math.abs(pageRect.top - viewportCenter);
          if (!closest || distance < closest.distance) {
            return { id: page.id, distance };
          }
          return closest;
        }, null);

        if (closestMobilePage) {
          setCurrentGroupId(closestMobilePage.id);
        }

        if (!nextShowFixedGroupNav) {
          setActiveStatsCardKey(null);
          return;
        }

        const activeGroupId = closestMobilePage?.id ?? currentGroupId;
        const nextKey = getActiveStatsCardKeyForGroup(activeGroupId);
        setActiveStatsCardKey(nextKey);
        return;
      }

      const container = scrollContainerRef.current;
      const historyPage = historyPageRef.current;
      const desktopPages: Array<{
        id: GroupId;
        element: HTMLDivElement | null;
      }> = [
        { id: "history", element: historyPageRef.current },
        { id: "ambassador", element: ambassadorPageRef.current },
        { id: "legacy", element: musicianPageRef.current },
      ];
      if (!container || !historyPage) return;

      if (introOverlayGroupId !== null) {
        return;
      }

      const nextShowFixedGroupNav =
        container.scrollLeft >= historyPage.offsetLeft / 2;
      setShowFixedGroupNav(nextShowFixedGroupNav);

      const viewportAnchor = container.scrollLeft + desktopGroupPeek;
      const closestDesktopPage = desktopPages.reduce<{
        id: GroupId;
        distance: number;
      } | null>((closest, page) => {
        if (!page.element) return closest;
        const distance = Math.abs(page.element.offsetLeft - viewportAnchor);
        if (!closest || distance < closest.distance) {
          return { id: page.id, distance };
        }
        return closest;
      }, null);

      if (closestDesktopPage) {
        setCurrentGroupId(closestDesktopPage.id);
      }

      if (!nextShowFixedGroupNav) {
        setActiveStatsCardKey(null);
        return;
      }

      const activeGroupId = closestDesktopPage?.id ?? currentGroupId;
      const nextKey = getActiveStatsCardKeyForGroup(activeGroupId);
      setActiveStatsCardKey(nextKey);
    };

    updateNavVisibility();

    if (isMobile) {
      window.addEventListener("scroll", updateNavVisibility, { passive: true });
      window.addEventListener("resize", updateNavVisibility);
      return () => {
        window.removeEventListener("scroll", updateNavVisibility);
        window.removeEventListener("resize", updateNavVisibility);
      };
    }

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", updateNavVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateNavVisibility);
    return () => {
      container?.removeEventListener("scroll", updateNavVisibility);
      window.removeEventListener("resize", updateNavVisibility);
    };
  }, [isMobile, introOverlayGroupId]);

  useEffect(() => {
    if (!isMobile || !showFixedGroupNav) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, showFixedGroupNav]);

  useEffect(() => {
    if (!(isMobile && isMobileMenuOpen)) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, isMobileMenuOpen]);

  useEffect(() => {
    const listeners: Array<{
      element: HTMLElement | null;
      handler: () => void;
    }> = [
      {
        element: historyScrollRef.current,
        handler: updateActiveStatsCard,
      },
      {
        element: ambassadorScrollRef.current,
        handler: updateActiveStatsCard,
      },
      {
        element: musicianScrollRef.current,
        handler: updateActiveStatsCard,
      },
    ];

    const activeListeners = listeners.filter((entry) => entry.element);

    activeListeners.forEach(({ element, handler }) => {
      element?.addEventListener("scroll", handler, { passive: true });
    });

    updateActiveStatsCard();

    return () => {
      activeListeners.forEach(({ element, handler }) => {
        element?.removeEventListener("scroll", handler);
      });
    };
  }, [currentGroupId, isMobile, showFixedGroupNav, introOverlayGroupId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (activeStatsCardKey && !dismissedStatsCards.has(activeStatsCardKey)) {
      setStatsCardVisible(false);
      timer = setTimeout(() => {
        setStatsCardVisible(true);
      }, 1500);
    } else {
      setStatsCardVisible(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeStatsCardKey, dismissedStatsCards]);

  useEffect(() => {
    return () => {
      if (sectionJumpTimeoutRef.current !== null) {
        window.clearTimeout(sectionJumpTimeoutRef.current);
      }
      if (introOverlayTimeoutRef.current !== null) {
        window.clearTimeout(introOverlayTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const updateNavOffset = () => {
      const navOffset =
        isMobile && showFixedGroupNav ? `${getMobileNavOffset()}px` : "0px";
      root.style.setProperty("--mcg-mobile-nav-offset", navOffset);
    };

    updateNavOffset();
    window.addEventListener("resize", updateNavOffset);

    return () => {
      window.removeEventListener("resize", updateNavOffset);
      root.style.setProperty("--mcg-mobile-nav-offset", "0px");
    };
  }, [isMobile, showFixedGroupNav, isMobileMenuOpen]);

  const textBaseStyle: React.CSSProperties = {
    fontFamily: '"Hanken Grotesk", Arial, sans-serif',
    fontWeight: 400,
    color: "#000000",
  };

  const currentGroupLabel =
    groupNavItems.find((item) => item.id === currentGroupId)?.label ??
    currentGroupId;

  const scrollToIntro = () => {
    // Clear any ongoing transitions
    if (introOverlayTimeoutRef.current !== null) {
      window.clearTimeout(introOverlayTimeoutRef.current);
      introOverlayTimeoutRef.current = null;
    }

    // Reset all navigation states
    setIntroOverlayGroupId(null);
    setIsMobileMenuOpen(false);

    // Jump to intro position instantly (no smooth scroll)
    if (isMobile) {
      window.scrollTo(0, 0);
    } else {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollLeft = 0;
        container.scrollTop = 0;
      }
    }
  };

  const openAboutOverlay = () => {
    setIsAboutOverlayOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Ensure page loads at IntroHero on initial mount
  useEffect(() => {
    // Prevent browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Immediately set scroll to 0
    if (isMobile) {
      window.scrollTo(0, 0);
    } else {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollLeft = 0;
        container.scrollTop = 0;
      }
    }

    // Also set after a short delay to ensure refs are ready
    const timer = setTimeout(() => {
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "auto" });
      } else {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTo({ left: 0, top: 0, behavior: "auto" });
        }
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Prevent horizontal overflow on body
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.maxWidth = "100vw";
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.maxWidth = "100vw";

    return () => {
      document.body.style.overflowX = "";
      document.body.style.maxWidth = "";
      document.documentElement.style.overflowX = "";
      document.documentElement.style.maxWidth = "";
    };
  }, []);

  const renderGroupNav = (className = "") => (
    <nav
      className={`mcg-group-nav ${className}`.trim()}
      aria-label="Section groups"
    >
      <button
        className="mcg-group-nav-label"
        onClick={scrollToIntro}
        aria-label="Back to intro"
      >
        Louis Armstrong in Data & Song
      </button>
      <div className="mcg-group-nav-links">
        <div className="mcg-group-nav-item mcg-group-nav-item--about">
          <button className="mcg-group-nav-button" onClick={openAboutOverlay}>
            About
          </button>
        </div>
        {groupNavItems.map((item) => (
          <div
            key={item.id}
            className={`mcg-group-nav-item mcg-group-nav-item--${item.id}`}
          >
            <button
              className={`mcg-group-nav-button${
                currentGroupId === item.id ? " is-active" : ""
              }`}
              onClick={() => scrollToGroup(item.id)}
            >
              {item.label}
            </button>
            <div
              className="mcg-group-nav-dropdown"
              aria-label={`${item.label} sections`}
            >
              {groupSectionItems[item.id].map((label, index) => (
                <button
                  key={`${item.id}-${label}`}
                  className="mcg-group-nav-dropdown-button"
                  onClick={() => scrollToGroupSection(item.id, index)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
  const renderMobileMenu = () => (
    <div className="mcg-mobile-nav-shell">
      <div className="mcg-mobile-nav-bar" ref={mobileNavBarRef}>
        <button
          type="button"
          className={`mcg-mobile-menu-button${
            isMobileMenuOpen ? " is-open" : ""
          }`}
          aria-label={
            isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {isMobileMenuOpen ? (
        <div className="mcg-mobile-menu-panel" aria-label="Section groups">
          <div className="mcg-mobile-menu-group">
            <button
              type="button"
              className="mcg-mobile-menu-group-button"
              onClick={openAboutOverlay}
            >
              About
            </button>
          </div>
          {groupNavItems.map((item) => (
            <div key={item.id} className="mcg-mobile-menu-group">
              <button
                type="button"
                className={`mcg-mobile-menu-group-button${
                  currentGroupId === item.id ? " is-active" : ""
                }`}
                onClick={() => scrollToGroup(item.id)}
              >
                {item.label}
              </button>
              <div className="mcg-mobile-menu-section-list">
                {groupSectionItems[item.id].map((label, index) => (
                  <button
                    key={`${item.id}-${label}`}
                    type="button"
                    className="mcg-mobile-menu-section-button"
                    onClick={() => scrollToGroupSection(item.id, index)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
  return (
    <div
      className={`mcg-root ${className || ""}${
        showFixedGroupNav ? " has-sticky-group-header" : ""
      }${introOverlayGroupId ? " is-intro-overlay-transition" : ""}`}
    >
      <style>{`
        /* ── SHARED ── */
        .mcg-root {
          width: 100vw;
          max-width: 100vw;
          overflow-x: hidden;
          overflow-y: hidden;
          background: transparent;
          position: fixed;
          inset: 0;
        }

        .mcg-root.has-sticky-group-header::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${desktopStickyHeaderHeight}px;
          background: #000000;
          z-index: 130;
          pointer-events: none;
        }

        .mcg-group-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: ${desktopStickyHeaderHeight}px;
          padding: 0 24px;
          z-index: 140;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          box-sizing: border-box;
        }

        .mcg-group-nav-label {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #ffffff;
          white-space: nowrap;
          transition: opacity 0.18s ease;
        }

        .mcg-group-nav-label:hover {
          opacity: 0.72;
        }

        .mcg-group-nav-links {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 10px;
        }

        .mcg-group-nav-item {
          position: relative;
          display: block;
        }

        .mcg-group-nav-button {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.04em;
          color: #ffffff;
          text-align: left;
          opacity: 0.72;
          transition: opacity 0.18s ease;
        }

        .mcg-group-nav-button.is-active {
          opacity: 1;
        }

        .mcg-group-nav-button:hover {
          opacity: 1;
        }

        .mcg-group-nav-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          display: none;
          min-width: 180px;
          padding-top: 8px;
          z-index: 141;
        }

        .mcg-group-nav-item--history .mcg-group-nav-dropdown {
          left: auto;
          right: 0;
        }
 .mcg-group-nav-item--ambassador .mcg-group-nav-dropdown {
          left: auto;
          right: 0;
        }

        .mcg-group-nav-item--legacy .mcg-group-nav-dropdown {
          left: auto;
          right: 0;
        }

        .mcg-group-nav-item:hover .mcg-group-nav-dropdown {
          display: block;
        }

        .mcg-mobile-nav-shell,
        .mcg-mobile-nav-bar,
        .mcg-mobile-menu-panel {
          display: none;
        }

        .mcg-group-nav-dropdown-button {
          display: block;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: #000000;
          color: #ffffff;
          padding: 6px 10px;
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0;
          cursor: pointer;
          text-align: left;
        }

        .mcg-group-nav-dropdown-button + .mcg-group-nav-dropdown-button {
          border-top: none;
        }

        .mcg-section-stats-card {
          position: fixed;
          top: auto;
          right: auto;
          left: 50%;
          bottom: 16px;
          width: min(820px, calc(100vw - 32px));
          padding: 28px 32px;
          border-radius: 6px;
          border: none;
          background: rgba(248, 245, 204, 0.82);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.36);
          backdrop-filter: blur(10px);
          z-index: 150;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-50%) translateY(32px);
          transition:
            opacity 400ms ease-out,
            transform 400ms ease-out;
          font-family: "Hanken Grotesk", Arial, sans-serif;
        }

        .mcg-section-stats-card.is-visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        .mcg-section-stats-card.is-dismissed {
          opacity: 0;
          pointer-events: none;
        }

        .mcg-section-stats-card__close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 18px;
          height: 18px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.18s ease;
          z-index: 1;
        }

        .mcg-section-stats-card__close:hover {
          opacity: 1;
        }

        .mcg-section-stats-card__close img {
          width: 100%;
          height: 100%;
          display: block;
          filter: brightness(0);
        }

        .mcg-section-stats-card__eyebrow {
          display: none;
        }

        .mcg-section-stats-card__title {
          margin: 0 0 8px 0;
          padding: 0;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          color: rgba(0, 0, 0, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mcg-section-stats-card__note {
          margin: 0;
          padding-right: 24px;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.85);
          white-space: pre-line;
        }

        .mcg-section-stats-card__content {
          animation: mcgStatsCardTextIn 420ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity, filter;
        }

        @keyframes mcgStatsCardTextIn {
          from {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        /* ── DESKTOP: horizontal scroll ── */
        .mcg-track {
          width: 100vw;
          height: 100dvh;
          overflow-x: hidden;
          overflow-y: hidden;
          display: flex;
          flex-direction: row;
          gap: ${desktopGroupGap}px;
          padding: 0;
          box-sizing: border-box;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 0;
          -ms-overflow-style: none;
          scrollbar-width: none;
          position: relative;
        }
        .mcg-track::-webkit-scrollbar { display: none; }

        .mcg-root.is-intro-overlay-transition .mcg-track {
          overflow: hidden;
        }

        .mcg-group-page {
          width: 100vw;
          max-width: 100vw;
          min-width: 100vw;
          height: 100dvh;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #ffffff;
          padding: 0;
          box-sizing: border-box;
        }

        .mcg-group-label {
          display: none;
        }

        .mcg-group-frame {
          width: 100vw;
          max-width: 100vw;
          min-height: 100%;
          background: #ffffff;
          overflow: hidden;
          padding-top: 0;
          box-sizing: border-box;
          box-shadow: none;
          position: relative;
          z-index: 1;
        }

        .mcg-group-scroll-arrow {
          position: absolute;
          right: 20px;
          bottom: 20px;
          width: 44px;
          height: 44px;
          border: none;
          background: transparent;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 12;
          opacity: 0.88;
          transition:
            transform 0.18s ease,
            opacity 0.18s ease;
        }

        .mcg-group-scroll-arrow:hover {
          transform: translateY(2px);
          opacity: 1;
        }

        .mcg-group-scroll-arrow svg {
          width: 28px;
          height: 28px;
          display: block;
        }

        .mcg-group-page--legacy {
          --slg-bg: transparent;
        }

        .mcg-group-scroll {
          width: 100vw;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding-top: 0;
          box-sizing: border-box;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .mcg-group-scroll::-webkit-scrollbar {
          display: none;
        }

        .mcg-group-section {
          width: 100vw;
          max-width: 100vw;
          min-width: 0;
          min-height: 100dvh;
          height: auto;
          position: relative;
          overflow: hidden;
          scroll-margin-top: 0;
        }

        .mcg-group-section-inner {
          width: 100vw;
          min-height: 100dvh;
          height: auto;
          transform: none;
          transform-origin: top center;
          overflow: hidden;
        }

        .mcg-group-section--auto-height {
          min-height: 100dvh;
          height: auto;
          overflow: hidden;
        }

        .mcg-group-section-inner--auto-height {
          min-height: 100dvh;
          height: auto;
          overflow: hidden;
        }

        .mcg-section {
          width: 100vw;
          min-width: 100vw;
          max-width: 100vw;
          min-height: 100dvh;
         height: auto;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          background: #000000;
        }

        .hero-intro-section {
          scroll-snap-align: start;
          flex-shrink: 0;
          overflow: hidden;
          width: 100vw;
          max-width: 100vw;
          min-width: 100vw;
          height: 100dvh;
        }

        // .mcg-group-page .mcg-section {
        //   width: 100vw !important;
        //   min-width: 100vw !important;
        //   background: #ffffff !important;
        // }

        .mcg-group-page .mcg-fbi-section,
        .mcg-group-page .vre.mcg-section {
          background: #000000 !important;
          color: #ffffff !important;
        }

        .mcg-group-page .mcg-fbi-section .mcg-page-title,
        .mcg-group-page .vre.mcg-section .mcg-page-title {
          color: #ffffff !important;
        }

        /* Shared page title styling for all non-hero sections */
        .mcg-page-title {
          margin: 0 !important;
          font-family: "Hanken Grotesk", Arial, sans-serif !important;
          font-size: 32px !important;
          font-weight: 700 !important;
          line-height: 38px !important;
          color: #ffffff !important;
        }

        .africa-tour-section .mcg-page-title,
        .real-ambassadors-section .mcg-page-title,
        .mcg-jazz-section .mcg-page-title {
          color: #000000 !important;
        }

        .mcg-track > .mcg-section .mcg-page-title:not(.mcg-page-title--flow),
        .mcg-track > .mcg-group-page .mcg-section .mcg-page-title:not(.mcg-page-title--flow) {
          position: absolute !important;
          left: 56px !important;
          top: 76px !important;
          z-index: 5 !important;
        }

        .mcg-page-title--flow {
          display: block !important;
          margin-top: 80px !important;
          position: relative !important;
          z-index: 6 !important;
        }

        .mcg-page-title--light {
          color: #000000 !important;
        }

        /* ── INTERACTIONS (both breakpoints) ── */
        .interactive-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .interactive-card:hover { transform: translateY(-5px); box-shadow: 0px 10px 20px rgba(0,0,0,0.2); }
        .explore-btn { transition: all 0.2s ease; border: none; background: transparent; cursor: pointer; padding: 0; }
        .explore-btn:hover { opacity: 0.8; transform: scale(1.05); }
        .map-marker { cursor: pointer; transition: transform 0.2s ease; }
        .map-marker:hover { transform: scale(1.2); }
        .fbi-doc { transition: transform 0.2s ease; cursor: zoom-in; }
        .fbi-doc:hover { transform: scale(1.1); z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
      `}</style>

      {!isMobile && showFixedGroupNav ? renderGroupNav() : null}

      <div className="mcg-track" ref={scrollContainerRef}>
        <SectionIntroHero
          sectionRef={introSectionRef}
          isIntroActive={!showFixedGroupNav && introOverlayGroupId === null}
          isTransitionOverlayActive={introOverlayGroupId !== null}
          onNavigateHistory={() => scrollToGroup("history")}
          onNavigateLegacy={() => scrollToGroup("legacy")}
          onNavigateAmbassador={() => scrollToGroup("ambassador")}
          onOpenAboutOverlay={openAboutOverlay}
        />
        {isMobile && showFixedGroupNav ? renderMobileMenu() : null}
        <div
          ref={historyPageRef}
          className="mcg-group-page mcg-group-page--history"
        >
          <div className="mcg-group-label" aria-hidden="true">
            history
          </div>
          <div ref={historyScrollRef} className="mcg-group-scroll">
            <div className="mcg-group-frame">
              <div
                ref={(element) => {
                  historySectionRefs.current[0] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionCareerTimeline />
                </div>
              </div>
              <div
                ref={(element) => {
                  historySectionRefs.current[1] = element;
                }}
                className="mcg-group-section mcg-group-section--auto-height"
              >
                <div className="mcg-group-section-inner mcg-group-section-inner--auto-height">
                  <SectionTheBeginning />
                </div>
              </div>
              <div
                ref={(element) => {
                  historySectionRefs.current[2] = element;
                }}
                className="mcg-group-section mcg-group-section--auto-height"
              >
                <div className="mcg-group-section-inner mcg-group-section-inner--auto-height">
                  <SectionJourneyToAmbassador />
                </div>
              </div>
            </div>
          </div>
          {currentSectionIndices.history <
            groupSectionItems.history.length - 1 && (
            <button
              className="mcg-group-scroll-arrow"
              onClick={() => scrollGroupDown("history")}
              aria-label="Scroll down in history"
            >
              {renderScrollArrowIcon()}
            </button>
          )}
        </div>
        <div
          ref={ambassadorPageRef}
          className="mcg-group-page mcg-group-page--ambassador"
        >
          <div className="mcg-group-label" aria-hidden="true">
            ambassador
          </div>
          <div ref={ambassadorScrollRef} className="mcg-group-scroll">
            <div className="mcg-group-frame">
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[0] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  {/* <SectionGoodwillAmbassador textBaseStyle={textBaseStyle} /> */}
                  <SectionGlobalCountries />
                </div>
              </div>

              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[1] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <JazzAmbassadorsMap />
                </div>
              </div>

              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[2] = element;
                }}
                className="mcg-group-section mcg-group-section--auto-height"
              >
                <div className="mcg-group-section-inner mcg-group-section-inner--auto-height">
                  <SectionAfricaTour />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[3] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionFBIFiles />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[4] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionRealAmbassadors
                    onTimelineJump={scrollToTimelineSection}
                    isMobile={isMobile}
                  />
                </div>
              </div>

              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[5] = element;
                }}
                className="mcg-group-section mcg-group-section--auto-height"
              >
                <div className="mcg-group-section-inner mcg-group-section-inner--auto-height">
                  <SectionWorldFair />
                </div>
              </div>
            </div>
          </div>
          {currentSectionIndices.ambassador <
            groupSectionItems.ambassador.length - 1 && (
            <button
              className="mcg-group-scroll-arrow"
              onClick={() => scrollGroupDown("ambassador")}
              aria-label="Scroll down in ambassador"
            >
              {renderScrollArrowIcon()}
            </button>
          )}
        </div>
        <div
          ref={musicianPageRef}
          className="mcg-group-page mcg-group-page--legacy"
        >
          <div className="mcg-group-label" aria-hidden="true">
            legacy
          </div>
          <div ref={musicianScrollRef} className="mcg-group-scroll">
            <div className="mcg-group-frame">
              <div
                ref={(element) => {
                  musicianSectionRefs.current[0] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionVinyl
                    className="mcg-section"
                    height="100%"
                    minHeight="100%"
                  />
                </div>
              </div>
              <div
                ref={(element) => {
                  musicianSectionRefs.current[1] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionWonderfulWorld />
                </div>
              </div>
            </div>
          </div>
          {currentSectionIndices.legacy <
            groupSectionItems.legacy.length - 1 && (
            <button
              className="mcg-group-scroll-arrow"
              onClick={() => scrollGroupDown("legacy")}
              aria-label="Scroll down in legacy"
            >
              {renderScrollArrowIcon()}
            </button>
          )}
        </div>
      </div>

      <aside
        className={`mcg-section-stats-card${statsCardVisible && activeStatsCardKey && !dismissedStatsCards.has(activeStatsCardKey) ? " is-visible" : ""}${activeStatsCardKey && dismissedStatsCards.has(activeStatsCardKey) ? " is-dismissed" : ""}`}
        aria-live="polite"
      >
        {activeStatsCardKey && statsCardContent[activeStatsCardKey] ? (
          <>
            <button
              className="mcg-section-stats-card__close"
              onClick={() => {
                if (activeStatsCardKey) {
                  setDismissedStatsCards((prev) =>
                    new Set(prev).add(activeStatsCardKey),
                  );
                }
              }}
              aria-label="Close stats card"
            >
              <img src="/assets/close.svg" alt="" aria-hidden="true" />
            </button>
            <div
              key={activeStatsCardKey}
              className="mcg-section-stats-card__content"
            >
              <h4 className="mcg-section-stats-card__title">Fact:</h4>
              <p className="mcg-section-stats-card__note">
                {statsCardContent[activeStatsCardKey].description}
              </p>
            </div>
          </>
        ) : null}
      </aside>

      {isAboutOverlayOpen && (
        <div
          id="about-overlay"
          className="mcg-about-overlay"
          style={{
            position: "fixed",
            inset: isMobile ? "var(--mcg-mobile-nav-offset, 0px) 0 0 0" : 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: isMobile ? "stretch" : "center",
            alignItems: isMobile ? "stretch" : "center",
            padding: isMobile ? "0" : "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            className="mcg-about-overlay-content"
            style={{
              position: "relative",
              width: isMobile ? "100vw" : "min(100vw, 1280px)",
              maxWidth: isMobile ? "100vw" : undefined,
              height: isMobile
                ? "calc(100dvh - var(--mcg-mobile-nav-offset, 0px))"
                : undefined,
              maxHeight: isMobile ? "none" : "90vh",
              overflowY: "auto",
              overflowX: "hidden",
              borderRadius: isMobile ? "0" : "10px",
              backgroundColor: isMobile ? "#ffffff" : "#000000",
              boxShadow: isMobile ? "none" : "0 10px 40px rgba(0, 0, 0, 0.35)",
            }}
          >
            <button
              aria-label="Close about overlay"
              onClick={() => setIsAboutOverlayOpen(false)}
              className="about-close-button"
              style={{
                position: isMobile ? "fixed" : "absolute",
                top: isMobile
                  ? "calc(var(--mcg-mobile-nav-offset, 0px) + 12px)"
                  : "40px",
                right: isMobile ? "12px" : "40px",
                zIndex: isMobile ? 1001 : 5,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "10px",
                touchAction: "manipulation",
              }}
            >
              <img
                src="/assets/close.svg"
                alt="Close"
                className="about-close-icon"
                style={{
                  width: "30px",
                  height: "30px",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </button>

            <SectionAboutProject />
          </div>
        </div>
      )}
    </div>
  );
};
