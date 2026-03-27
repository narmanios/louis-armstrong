import React from "react";

import { SectionIntroHero } from "./SectionIntroHero";
import { SectionAboutProject } from "./SectionAboutProject";
import { SectionTheBeginning } from "./SectionTheBeginning";
import { SectionJourneyToAmbassador } from "./SectionJourneyToAmbassador";
import { SectionJazzAmbassadors } from "./SectionJazzAmbassadors";
import { SectionFBIFiles } from "./SectionFBIFiles";
interface HeroSectionsProps {
  textBaseStyle: React.CSSProperties;
  onScrollNext: () => void;
}
export const HeroSections: React.FC<HeroSectionsProps> = ({
  textBaseStyle,
  onScrollNext,
}) => {
  return (
    <React.Fragment>
      <SectionIntroHero
        onNavigateHistory={onScrollNext}
        onNavigateMusician={() => {}}
        onNavigateAmbassador={() => {}}
      />
      <SectionAboutProject textBaseStyle={textBaseStyle} />
      <SectionTheBeginning textBaseStyle={textBaseStyle} />
      <SectionJourneyToAmbassador textBaseStyle={textBaseStyle} />
      <SectionJazzAmbassadors />
      <SectionFBIFiles />
    </React.Fragment>
  );
};
