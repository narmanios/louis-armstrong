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
interface MainCollectionsProps {
  className?: string;
}

type GroupId = "history" | "musician" | "ambassador";
type TimelineJumpTarget =
  | { kind: "intro" }
  | { kind: "section"; groupId: GroupId; sectionIdx: number };

export const MainCollections: React.FC<MainCollectionsProps> = ({
  className,
}) => {
  const desktopGroupPeek = 104;
  const desktopGroupGap = 28;
  const desktopGroupTransitionMs = 460;
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
  const isMobile = useIsMobile();
  const [showFixedGroupNav, setShowFixedGroupNav] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState<GroupId>("history");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const groupNavItems: Array<{ id: GroupId; label: string }> = [
    { id: "history", label: "history" },
    { id: "ambassador", label: "ambassador" },
    { id: "musician", label: "legacy" },
  ];
  const groupSectionItems: Record<GroupId, string[]> = {
    history: ["Career Highlights", "The Beginning", "Journey to Ambassador"],
    ambassador: [
      "Goodwill Ambassador",
      "FBI Files",
      "Jazz Ambassadors",
      "Africa Tour",
      "The Real Ambassadors",
      "World Fair + Berlin",
    ],
    musician: ["What a Wonderful World", "More Covers"],
  };
  const timelineTargetMap: TimelineJumpTarget[] = [
    { kind: "intro" },
    { kind: "section", groupId: "history", sectionIdx: 0 },
    { kind: "section", groupId: "history", sectionIdx: 1 },
    { kind: "section", groupId: "history", sectionIdx: 2 },
    { kind: "section", groupId: "musician", sectionIdx: 0 },
    { kind: "section", groupId: "musician", sectionIdx: 1 },
    { kind: "section", groupId: "musician", sectionIdx: 1 },
    { kind: "section", groupId: "ambassador", sectionIdx: 0 },
    { kind: "section", groupId: "ambassador", sectionIdx: 3 },
    { kind: "section", groupId: "ambassador", sectionIdx: 4 },
    { kind: "section", groupId: "ambassador", sectionIdx: 5 },
  ];

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
      behavior: "smooth",
    });
  };

  const getGroupPageElement = (groupId: GroupId) => {
    if (groupId === "history") return historyPageRef.current;
    if (groupId === "musician") return musicianPageRef.current;
    return ambassadorPageRef.current;
  };

  const getGroupScroller = (groupId: GroupId) => {
    if (groupId === "history") return historyScrollRef.current;
    if (groupId === "musician") return musicianScrollRef.current;
    return ambassadorScrollRef.current;
  };

  const getGroupSectionElements = (groupId: GroupId) => {
    if (groupId === "history") return historySectionRefs.current;
    if (groupId === "musician") return musicianSectionRefs.current;
    return ambassadorSectionRefs.current;
  };

  const scrollToGroupSection = (groupId: GroupId, sectionIdx = 0) => {
    const page = getGroupPageElement(groupId);
    const scroller = getGroupScroller(groupId);
    const section = getGroupSectionElements(groupId)[sectionIdx] ?? null;
    const targetTop = section?.offsetTop ?? 0;

    setCurrentGroupId(groupId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }

    if (isMobile) {
      scrollMobileElementIntoView(section ?? page);
      return;
    }

    const isChangingGroup = currentGroupId !== groupId;

    if (page) {
      scrollContainerRef.current?.scrollTo({
        left: Math.max(page.offsetLeft - desktopGroupPeek, 0),
        behavior: "smooth",
      });
    }

    if (sectionJumpTimeoutRef.current !== null) {
      window.clearTimeout(sectionJumpTimeoutRef.current);
      sectionJumpTimeoutRef.current = null;
    }

    const scrollSectionIntoView = () => {
      scroller?.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    };

    if (isChangingGroup) {
      sectionJumpTimeoutRef.current = window.setTimeout(() => {
        scrollSectionIntoView();
        sectionJumpTimeoutRef.current = null;
      }, desktopGroupTransitionMs);
      return;
    }

    scrollSectionIntoView();
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
        setShowFixedGroupNav(rect.bottom <= 0);

        const mobilePages: Array<{
          id: GroupId;
          element: HTMLDivElement | null;
        }> = [
          { id: "history", element: historyPageRef.current },
          { id: "ambassador", element: ambassadorPageRef.current },
          { id: "musician", element: musicianPageRef.current },
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
        { id: "musician", element: musicianPageRef.current },
      ];
      if (!container || !historyPage) return;
      setShowFixedGroupNav(container.scrollLeft >= historyPage.offsetLeft / 2);

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
  }, [isMobile]);

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
    return () => {
      if (sectionJumpTimeoutRef.current !== null) {
        window.clearTimeout(sectionJumpTimeoutRef.current);
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
    fontFamily: '"Helvetica Neue", sans-serif',
    fontWeight: 400,
    color: "#000000",
  };
  const renderGroupNav = (className = "") => (
    <nav
      className={`mcg-group-nav ${className}`.trim()}
      aria-label="Section groups"
    >
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
    <div className={`mcg-root ${className || ""}`}>
      <style>{`
        /* ── SHARED ── */
        .mcg-root {
          width: 100%;
          background: #161616;
        }

        .mcg-group-nav {
          position: fixed;
          top: 24px;
          right: 56px;
          z-index: 140;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 16px;
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
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
          font-weight: 600;
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
          padding-top: 6px;
          z-index: 141;
        }

        .mcg-group-nav-item--musician .mcg-group-nav-dropdown {
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
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: #ffffff;
          color: #000000;
          padding: 6px 10px;
          font-family: "Helvetica Neue", sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0;
          cursor: pointer;
          text-align: left;
        }

        .mcg-group-nav-dropdown-button + .mcg-group-nav-dropdown-button {
          border-top: none;
        }

        /* ── DESKTOP: horizontal scroll ── */
        .mcg-track {
          width: 100%;
          height: 800px;
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

        .mcg-group-page {
          width: calc(100vw - ${desktopGroupPeek * 2 + desktopGroupGap}px);
          min-width: calc(100vw - ${desktopGroupPeek * 2 + desktopGroupGap}px);
          height: 800px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #232323;
          padding: 40px 56px 36px;
          box-sizing: border-box;
        }

        .mcg-group-label {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
          transform-origin: center;
          font-family: "Andale Mono", "Andale Mono WT", monospace;
          font-size: 80px;
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: -0.06em;
          color: rgba(255, 255, 255, 0.08);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          text-align: left;
        }

        .mcg-group-frame {
          width: min(100%, 1112px);
          height: 100%;
          margin: 0 auto;
          background: #000000;
          overflow: hidden;
          padding-top: 28px;
          box-sizing: border-box;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
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

        .mcg-group-scroll-arrow img {
          width: 28px;
          height: 28px;
          display: block;
        }

        .mcg-group-page--history .mcg-group-label {
          color: rgba(207, 107, 76, 0.3);
        }

        .mcg-group-page--history .mcg-group-frame,
        .mcg-group-page--history .mcg-section {
          background: #343434 !important;
        }

        .mcg-group-page--history .mcg-page-title,
        .mcg-group-page--history p,
        .mcg-group-page--history span,
        .mcg-group-page--history h1,
        .mcg-group-page--history h2,
        .mcg-group-page--history h3,
        .mcg-group-page--history h4,
        .mcg-group-page--history button,
        .mcg-group-page--history a {
          color: #ffffff !important;
        }

        .mcg-group-page--musician {
          --slg-bg: #000000;
        }

        .mcg-group-page--musician .mcg-group-label {
          color: rgba(107, 123, 74, 0.28);
        }

        .mcg-group-page--musician .mcg-group-frame,
        .mcg-group-page--musician .mcg-section {
          background: #000000 !important;
        }

        .mcg-group-page--ambassador .mcg-group-label {
          color: rgba(79, 111, 154, 0.28);
        }

        .mcg-group-page--ambassador .mcg-group-frame,
        .mcg-group-page--ambassador .mcg-section {
          background: #343434 !important;
        }

        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) .mcg-page-title,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) p,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) span,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h1,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h2,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h3,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) h4,
        .mcg-group-page--ambassador .mcg-group-section:nth-child(n + 2) a {
          color: #ffffff !important;
        }

        .mcg-group-scroll {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-snap-type: y mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .mcg-group-scroll::-webkit-scrollbar {
          display: none;
        }

        .mcg-group-section {
          width: 100%;
          min-width: 0;
          scroll-snap-align: start;
          min-height: 800px;
          position: relative;
          overflow: hidden;
        }

        .mcg-group-section-inner {
          width: 100%;
          height: 800px;
          transform: scale(0.88);
          transform-origin: top center;
        }

        .mcg-section {
          width: 100vw;
          min-width: 100vw;
          height: 800px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: #000000;
        }

        .mcg-group-page .mcg-section {
          width: 100% !important;
          min-width: 0 !important;
        }

        /* Shared page title styling for all non-hero sections */
        .mcg-page-title {
          margin: 0 !important;
          font-family: "Andale Mono", "Andale Mono WT", monospace !important;
          font-size: 40px !important;
          font-weight: 800 !important;
          line-height: 48px !important;
          color: var(--mcg-page-title-color, #002768) !important;
        }

        .mcg-track > .mcg-section .mcg-page-title:not(.mcg-page-title--flow),
        .mcg-track > .mcg-group-page .mcg-section .mcg-page-title:not(.mcg-page-title--flow) {
          position: absolute !important;
          left: 56px !important;
          top: 64px !important;
          z-index: 5 !important;
        }

        .mcg-page-title--flow {
          position: static !important;
          left: auto !important;
          top: auto !important;
        }

        .mcg-page-title--spaced {
          margin-bottom: 57px !important;
        }

        .mcg-page-title--light {
          --mcg-page-title-color: #ffffff;
        }

        .mcg-page-title--tight {
          margin: 0 !important;
        }

        /* ── MOBILE: vertical stack ── */
        @media (max-width: 768px) {
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
            padding: 12px 16px;
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
            font-family: "Andale Mono", "Andale Mono WT", monospace;
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
            font-family: "Helvetica Neue", sans-serif;
            font-size: 15px;
            font-weight: 400;
            line-height: 1.45;
            text-align: left;
            cursor: pointer;
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
            background: transparent;
          }

          .mcg-group-label {
            display: none;
          }

          .mcg-group-frame {
            width: 100vw;
            height: auto;
            overflow: hidden;
            padding-top: 20px;
            box-sizing: border-box;
            box-shadow: none;
            background: transparent !important;
          }

          .mcg-group-scroll-arrow {
            display: none;
          }

          .mcg-group-scroll {
            height: auto;
            overflow: visible;
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
            background: transparent !important;
          }

          .mcg-group-page--history .mcg-group-frame,
          .mcg-group-page--history .mcg-section,
          .mcg-group-page--musician .mcg-group-frame,
          .mcg-group-page--musician .mcg-section,
          .mcg-group-page--ambassador .mcg-group-frame,
          .mcg-group-page--ambassador .mcg-section {
            background: transparent !important;
          }

          /* Hero section mobile styles are section-scoped in SectionIntroHero.tsx */
          .mcg-page-title {
            position: static !important;
            left: auto !important;
            top: auto !important;
            font-size: 28px !important;
            line-height: 1.2 !important;
            width: calc(100% - 40px);
            margin: 0 auto 20px !important;
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
          onNavigateHistory={() => scrollToGroup("history")}
          onNavigateMusician={() => scrollToGroup("musician")}
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
          <div className="mcg-group-frame">
            <div ref={historyScrollRef} className="mcg-group-scroll">
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
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionTheBeginning />
                </div>
              </div>
              <div
                ref={(element) => {
                  historySectionRefs.current[2] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionJourneyToAmbassador />
                </div>
              </div>
            </div>
            <button
              className="mcg-group-scroll-arrow"
              onClick={() => scrollGroupDown("history")}
              aria-label="Scroll down in history"
            >
              <img src="/assets/arrow.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          ref={ambassadorPageRef}
          className="mcg-group-page mcg-group-page--ambassador"
        >
          <div className="mcg-group-label" aria-hidden="true">
            ambassador
          </div>
          <div className="mcg-group-frame">
            <div ref={ambassadorScrollRef} className="mcg-group-scroll">
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
                  <SectionFBIFiles />
                </div>
              </div>
              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[2] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionJazzAmbassadors />
                </div>
              </div>

              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[3] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionAfricaTour />
                </div>
              </div>

              <div
                ref={(element) => {
                  ambassadorSectionRefs.current[5] = element;
                }}
                className="mcg-group-section"
              >
                <div className="mcg-group-section-inner">
                  <SectionRealAmbassadors
                    onTimelineJump={scrollToTimelineSection}
                    isMobile={isMobile}
                  />
                </div>

                <div
                  ref={(element) => {
                    ambassadorSectionRefs.current[4] = element;
                  }}
                  className="mcg-group-section"
                >
                  <div className="mcg-group-section-inner">
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
              <img src="/assets/arrow.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          ref={musicianPageRef}
          className="mcg-group-page mcg-group-page--musician"
        >
          <div className="mcg-group-label" aria-hidden="true">
            legacy
          </div>
          <div className="mcg-group-frame">
            <div ref={musicianScrollRef} className="mcg-group-scroll">
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
            <button
              className="mcg-group-scroll-arrow"
              onClick={() => scrollGroupDown("musician")}
              aria-label="Scroll down in legacy"
            >
              <img src="/assets/arrow.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
