import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { SectionIntroHero } from "./SectionIntroHero";
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
    "At just 11, Louis Armstrong got his first formal music training in a boys’ reform home.",
  ),
  "history-2": buildStatsCard(
    "The transition from local musician to international cultural figure. The card can be used to summarize the widening reach of Armstrong's public role.",
  ),
  "legacy-0": buildStatsCard(
    "The lasting legacy of “What a Wonderful World” can be seen in the many rerecordings it continues to inspire, proving that Louis Armstrong’s voice and message still resonate across generations.",
  ),
  "legacy-1": buildStatsCard(
    "Louis Armstrong’s music still lives on in screen media today, from “Dream a Little Dream of Me” in Stranger Things to “We Have All the Time in the World” in the James Bond film No Time to Die, showing how his sound continues to shape popular culture across generations.",
  ),
  "ambassador-0": buildStatsCard(
    "Louis Armstrong became a goodwill ambassador long before the title was official, traveling the world as one of the first Black pop stars to spread jazz and American culture abroad.",
  ),
  "ambassador-1": buildStatsCard(
    "The Jazz Diplomacy program sent musicians overseas and used these artists to project an image of American freedom and culture abroad, even as Cold War conflict and segregation at home challenged that image.",
  ),
  "ambassador-2": buildStatsCard(
    "Africa tour that Armstrong undertook in 1960 as part of the Jazz Diplomacy program, which was a key moment in his role as a cultural ambassador and in the broader context of U.S. cultural diplomacy during the Cold War.",
  ),
  "ambassador-3": buildStatsCard(
    "Louis Armstrong was sent abroad to symbolize American freedom, even as FBI files, segregation, and voter suppression exposed how limited that freedom was at home.",
  ),
  "ambassador-4": buildStatsCard(
    "Real Ambassadors was a jazz musical created by Dave Brubeck and Iola Brubeck that premiered in 1962. The show was a satirical take on the Jazz Diplomacy program, using humor and music to critique the contradictions of American cultural diplomacy during the Cold War.",
  ),
  "ambassador-5": buildStatsCard(
    "1964 World Fair in New York and the 1965 Berlin tour were major highlights of Armstrong's ambassadorial career, showcasing his global influence and the power of jazz as a cultural bridge during the Cold War era.",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [introOverlayGroupId, setIntroOverlayGroupId] =
    useState<GroupId | null>(null);
  const groupNavItems: Array<{ id: GroupId; label: string }> = [
    { id: "history", label: "history" },
    { id: "ambassador", label: "ambassador" },
    { id: "legacy", label: "legacy" },
  ];
  const groupSectionItems: Record<GroupId, string[]> = {
    history: ["Career Highlights", "The Beginning", "Journey to Ambassador"],
    ambassador: [
      "Goodwill Ambassador",
      "Jazz Ambassadors",
      "Africa Tour",
      "FBI Files",
      "The Real Ambassadors",
      "World Fair + Berlin",
    ],
    legacy: ["What a Wonderful World", "More Covers"],
  };
  const timelineTargetMap: TimelineJumpTarget[] = [
    { kind: "intro" },
    { kind: "section", groupId: "history", sectionIdx: 0 },
    { kind: "section", groupId: "history", sectionIdx: 1 },
    { kind: "section", groupId: "history", sectionIdx: 2 },
    { kind: "section", groupId: "legacy", sectionIdx: 0 },
    { kind: "section", groupId: "legacy", sectionIdx: 1 },
    { kind: "section", groupId: "legacy", sectionIdx: 1 },
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

    const nextKey = getActiveStatsCardKeyForGroup(currentGroupId);
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

  const renderGroupNav = (className = "") => (
    <nav
      className={`mcg-group-nav ${className}`.trim()}
      aria-label="Section groups"
    >
      <div className="mcg-group-nav-label" aria-hidden="true">
        {currentGroupLabel}
      </div>
      <div className="mcg-group-nav-links">
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
          background: transparent;
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
          font-family: "Hanken Grotesk", Arial, sans-serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.06em;
          color: #ffffff;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
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
          top: 50%;
          right: 0;
          left: auto;
          bottom: auto;
          width: min(420px, calc(100vw - 32px));
          padding: 14px 16px 13px;
          border-radius: 0;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.94);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.36);
          backdrop-filter: blur(10px);
          z-index: 150;
          pointer-events: none;
          opacity: 0;
          transform: translateY(calc(-50% + 12px));
          transition:
            opacity 180ms ease,
            transform 180ms ease;
          font-family: "Hanken Grotesk", Arial, sans-serif;
        }

        .mcg-section-stats-card.is-visible {
          opacity: 1;
          transform: translateY(-50%);
        }

        .mcg-section-stats-card__eyebrow {
          display: none;
        }

        .mcg-section-stats-card__note {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
          text-wrap: balance;
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
          overflow-x: auto;
          overflow-y: hidden;
          display: flex;
          flex-direction: row;
          gap: ${desktopGroupGap}px;
          padding: 0 ${desktopGroupPeek}px 0 0;
          box-sizing: border-box;
          scroll-snap-type: x mandatory;
          scroll-padding-inline: 0 ${desktopGroupPeek}px;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mcg-track::-webkit-scrollbar { display: none; }

        .mcg-root.is-intro-overlay-transition .mcg-track {
          overflow: hidden;
        }

        .mcg-group-page {
          width: 100vw;
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
          scroll-snap-type: y mandatory;
          scroll-padding-top: 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .mcg-group-scroll::-webkit-scrollbar {
          display: none;
        }

        .mcg-group-section {
          width: 100vw;
          min-width: 0;
          scroll-snap-align: start;
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
          scroll-margin-top: 0;
        }

        .mcg-group-section-inner {
          width: 100vw;
          height: 100dvh;
          transform: none;
          transform-origin: top center;
        }

        .mcg-group-section--auto-height {
          min-height: 100dvh;
          height: auto;
          overflow: visible;
        }

        .mcg-group-section-inner--auto-height {
          min-height: 100dvh;
          height: auto;
        }

        .mcg-section {
          width: 100vw;
          min-width: 100vw;
          height: 100dvh;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #000000;
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

        /* ── MOBILE: vertical stack ── */
        @media (max-width: 768px) {
          .mcg-root.has-sticky-group-header::before {
            display: none;
          }

          .mcg-group-nav {
            display: none;
          }

          .mcg-mobile-nav-shell {
            display: block;
            position: sticky;
            top: 0;
            left: 0;
            z-index: 145;
            width: 100%;
            margin: 0;
            box-sizing: border-box;
          }

          .mcg-mobile-nav-bar {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            margin: 0;
            padding: 6px 16px;
            box-sizing: border-box;
            background: rgba(22, 22, 22, 0.94);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            position: relative;
            z-index: 147;
          }

          .mcg-mobile-menu-button {
            width: 36px;
            height: 36px;
            border: none;
            background: transparent;
            padding: 0;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
          }

          .mcg-mobile-menu-button span {
            display: block;
            width: 15px;
            height: 1.5px;
            background: #ffffff;
            transition: transform 0.18s ease, opacity 0.18s ease;
          }

          .mcg-mobile-menu-button.is-open span:nth-child(1) {
            transform: translateY(5.5px) rotate(45deg);
          }

          .mcg-mobile-menu-button.is-open span:nth-child(2) {
            opacity: 0;
          }

          .mcg-mobile-menu-button.is-open span:nth-child(3) {
            transform: translateY(-5.5px) rotate(-45deg);
          }

          .mcg-mobile-menu-panel {
            position: fixed;
            inset: 0;
            display: flex;
            flex-direction: column;
            gap: 22px;
            width: 100vw;
            margin: 0;
            box-sizing: border-box;
            overflow-y: auto;
            background: rgba(22, 22, 22, 0.985);
            padding: 76px 20px 28px;
            z-index: 146;
          }

          .mcg-mobile-menu-group + .mcg-mobile-menu-group {
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 22px;
          }

          .mcg-mobile-menu-group-button {
            width: 100%;
            display: block;
            background: none;
            border: none;
            color: #ffffff;
            padding: 0 0 12px;
            font-family: "Hanken Grotesk", Arial, sans-serif;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.04em;
            text-transform: lowercase;
            text-align: left;
            cursor: pointer;
            opacity: 0.78;
          }

          .mcg-mobile-menu-group-button.is-active {
            opacity: 1;
          }

          .mcg-mobile-menu-section-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0;
          }

          .mcg-mobile-menu-section-button {
            width: 100%;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.74);
            padding: 0;
            font-family: "Hanken Grotesk", Arial, sans-serif;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.45;
            text-align: left;
            cursor: pointer;
          }

          .mcg-section-stats-card {
            top: auto;
            left: 12px;
            right: 12px;
            bottom: calc(12px + var(--mcg-mobile-nav-offset, 0px));
            width: auto;
            transform: translateY(12px);
          }

          .mcg-section-stats-card.is-visible {
            transform: translateY(0);
          }

          .mcg-group-nav-button {
            font-size: 10px;
          }

          .mcg-group-nav-dropdown-button {
            font-size: 10px;
            padding: 5px 8px;
          }

          .mcg-track {
            height: auto;
            overflow-x: visible;
            overflow-y: visible;
            display: block;
            scroll-snap-type: none;
          }

          .mcg-group-page {
            width: 100vw;
            min-width: 100vw;
            height: auto;
            overflow: visible;
            padding: 0 0 28px;
            box-sizing: border-box;
            background: #ffffff;
          }

          .mcg-group-label {
            display: block;
            position: relative;
            left: auto;
            top: auto;
            transform: none;
            width: calc(100% - 40px);
            margin: 0 auto 12px;
            font-size: 30px;
            line-height: 1;
            z-index: auto;
          }

          .mcg-group-frame {
            width: 100vw;
            height: auto;
            overflow: hidden;
            padding-top: 0;
            box-sizing: border-box;
            box-shadow: none;
            background: #ffffff !important;
          }

          .mcg-group-scroll-arrow {
            display: none;
          }

          .mcg-group-scroll {
            height: auto;
            overflow: visible;
            padding-top: 0;
            scroll-padding-top: 0;
            scroll-snap-type: none;
          }

          .mcg-group-section {
            scroll-snap-align: none;
            min-height: 0;
            overflow: visible;
            scroll-margin-top: calc(var(--mcg-mobile-nav-offset, 0px) + 12px);
          }

          .mcg-group-section-inner {
            height: auto;
            transform: none;
          }

          .mcg-section {
            min-width: 0;
            width: 100vw;
            height: auto;
            position: relative;
            overflow: visible;
            flex-shrink: unset;
            scroll-snap-align: none;
            padding: 24px 0 32px;
            box-sizing: border-box;
          }

          .mcg-group-page .mcg-section {
            width: 100% !important;
            min-width: 0 !important;
            background: #ffffff !important;
          }

          .mcg-group-page .mcg-fbi-section,
          .mcg-group-page .vre.mcg-section {
            background: #000000 !important;
            color: #ffffff !important;
          }

          .mcg-group-page--history .mcg-group-frame,
          .mcg-group-page--history .mcg-section,
          .mcg-group-page--legacy .mcg-group-frame,
          .mcg-group-page--legacy .mcg-section,
          .mcg-group-page--ambassador .mcg-group-frame,
          .mcg-group-page--ambassador .mcg-section {
            background: #ffffff !important;
          }

          /* Hero section mobile styles are section-scoped in SectionIntroHero.tsx */
          .mcg-page-title {
            position: static !important;
            left: auto !important;
            top: auto !important;
            font-size: 24px !important;
            line-height: 1.2 !important;
            width: calc(100% - 40px);
            margin: 20px auto 20px !important;
          }

          /* Two-image card sections (Beginning, Journey, World Fair) */
          .mcg-image-row {
            position: static !important;
            left: auto !important;
            top: auto !important;
            flex-direction: column !important;
            gap: 20px !important;
            margin-bottom: 20px !important;
          }
          .mcg-image-row .interactive-card img {
            width: calc(100% - 40px) !important;
            height: 220px !important;
            margin: 0 auto !important;
          }
          .mcg-text-row {
            position: static !important;
            left: auto !important;
            top: auto !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .mcg-text-row p {
            width: 100% !important;
          }

          /* Goodwill / map sections */
          .mcg-goodwill-text {
            position: static !important;
            width: 100% !important;
            margin-bottom: 16px !important;
          }
          .mcg-goodwill-album {
            position: static !important;
            display: block !important;
            width: 180px !important;
            height: 180px !important;
            margin-bottom: 20px !important;
          }
          .mcg-map-wrap {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            margin-bottom: 16px !important;
          }
          .mcg-map-wrap img {
            width: calc(100% - 40px) !important;
            height: auto !important;
            position: static !important;
            margin: 0 auto !important;
          }
          .mcg-map-travels {
            display: none !important;
          }
          .mcg-chile-tooltip {
            display: none !important;
          }

          /* Jazz ambassadors */
          .mcg-jazz-section {
            position: relative !important;
            overflow: visible !important;
            padding: 24px 20px 32px !important;
            box-sizing: border-box !important;
          }
          .mcg-jazz-section .mcg-page-title {
            position: static !important;
            display: block !important;
            width: calc(100% - 40px);
            margin: 0 auto 24px !important;
            color: #000000 !important;
          }
          .mcg-jazz-section .mcg-jazz-stage {
            min-height: 0 !important;
            margin-top: 0 !important;
          }
          .mcg-jazz-section .mcg-map-wrap {
            position: static !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 0 20px 0 !important;
          }
          .mcg-jazz-section .mcg-map-wrap > img:first-child {
            width: calc(100% - 40px) !important;
            height: auto !important;
            display: block !important;
            margin: 0 auto !important;
          }
          .mcg-jazz-section .mcg-map-travels {
            display: none !important;
          }
          .mcg-jazz-section .mcg-jazz-legend {
            position: static !important;
            left: auto !important;
            top: auto !important;
            margin-bottom: 20px !important;
          }
          .mcg-jazz-section .mcg-jazz-collage {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 270px !important;
            height: 184px !important;
            margin: 0 auto 20px !important;
          }
          .mcg-jazz-section .mcg-india-tooltip {
            display: none !important;
          }

          /* FBI files */
          .mcg-fbi-grid {
            position: static !important;
            width: 100% !important;
            grid-template-columns: repeat(4, 1fr) !important;
            margin-top: 12px !important;
          }

          /* Africa tour */
          .mcg-africa-row {
            position: static !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mcg-africa-row > div {
            width: 100% !important;
          }
          .mcg-africa-mini-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
          .mcg-africa-text-row {
            position: static !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          .mcg-africa-text-row p {
            width: 100% !important;
          }
          .mcg-congo-label {
            bottom: 48px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
          }

          /* Lyrics section */
          .mcg-lyrics-wrap {
            position: static !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mcg-lyrics-wrap img {
            width: calc(100% - 40px) !important;
            height: auto !important;
            max-height: 280px !important;
            margin: 0 auto !important;
          }
          .mcg-track-list {
            width: 100% !important;
          }
          .mcg-lyrics-text {
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
          }

          /* Wonderful world */
          .mcg-wonderful-wrap {
            position: static !important;
            flex-direction: column !important;
            gap: 20px !important;
          }
          .mcg-wonderful-wrap img {
            width: calc(100% - 40px) !important;
            height: auto !important;
            max-height: 280px !important;
            margin: 0 auto !important;
          }
          .mcg-wonderful-text {
            width: 100% !important;
            margin-top: 0 !important;
          }

          /* World fair placeholder boxes */
          .mcg-placeholder {
            width: calc(100% - 40px) !important;
            height: 200px !important;
            margin: 0 auto !important;
          }
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
          <button
            className="mcg-group-scroll-arrow"
            onClick={() => scrollGroupDown("history")}
            aria-label="Scroll down in history"
          >
            {renderScrollArrowIcon()}
          </button>
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
                  <SectionGoodwillAmbassador textBaseStyle={textBaseStyle} />
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
          <button
            className="mcg-group-scroll-arrow"
            onClick={() => scrollGroupDown("ambassador")}
            aria-label="Scroll down in ambassador"
          >
            {renderScrollArrowIcon()}
          </button>
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
                  <SectionWonderfulWorld />
                </div>
              </div>
              <div
                ref={(element) => {
                  musicianSectionRefs.current[1] = element;
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
            </div>
          </div>
          <button
            className="mcg-group-scroll-arrow"
            onClick={() => scrollGroupDown("legacy")}
            aria-label="Scroll down in legacy"
          >
            {renderScrollArrowIcon()}
          </button>
        </div>
      </div>

      <aside
        className={`mcg-section-stats-card${activeStatsCardKey ? " is-visible" : ""}`}
        aria-live="polite"
      >
        {activeStatsCardKey && statsCardContent[activeStatsCardKey] ? (
          <div
            key={activeStatsCardKey}
            className="mcg-section-stats-card__content"
          >
            <p className="mcg-section-stats-card__note">
              {statsCardContent[activeStatsCardKey].description}
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
};
