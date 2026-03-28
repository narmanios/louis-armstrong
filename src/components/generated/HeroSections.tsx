import React from "react";

import { SectionIntroHero } from "./SectionIntroHero";
import { SectionAboutProject } from "./SectionAboutProject";
import { SectionTheBeginning } from "./SectionTheBeginning";
import { SectionJourneyToAmbassador } from "./SectionJourneyToAmbassador";
import { SectionJazzAmbassadors } from "./SectionJazzAmbassadors";
import { SectionFBIFiles } from "./SectionFBIFiles";
interface HeroSectionsProps {
  onScrollNext: () => void;
}
export const HeroSections: React.FC<HeroSectionsProps> = ({
  onScrollNext,
}) => {
  return (
    <React.Fragment>
      <SectionIntroHero
        onNavigateHistory={onScrollNext}
        onNavigateMusician={() => {}}
        onNavigateAmbassador={() => {}}
      />
      <SectionAboutProject />
      <SectionTheBeginning />
      <SectionJourneyToAmbassador />
      <SectionJazzAmbassadors />
      <SectionFBIFiles />
    </React.Fragment>
  );
};
