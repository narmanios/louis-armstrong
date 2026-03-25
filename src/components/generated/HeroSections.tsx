import React from 'react';

import { SectionIntroHero } from './SectionIntroHero';
import { SectionAboutProject } from './SectionAboutProject';
import { SectionTheBeginning } from './SectionTheBeginning';
import { SectionJourneyToAmbassador } from './SectionJourneyToAmbassador';
import { SectionGoodwill } from './SectionGoodwill';
import { SectionJazzAmbassadors } from './SectionJazzAmbassadors';
import { SectionFBIFiles } from './SectionFBIFiles';
interface HeroSectionsProps {
  textBaseStyle: React.CSSProperties;
  onScrollNext: () => void;
}
export const HeroSections: React.FC<HeroSectionsProps> = ({ textBaseStyle, onScrollNext }) => {
  return (
    <React.Fragment>
      <SectionIntroHero onScrollNext={onScrollNext} />
      <SectionAboutProject textBaseStyle={textBaseStyle} />
      <SectionTheBeginning textBaseStyle={textBaseStyle} />
      <SectionJourneyToAmbassador textBaseStyle={textBaseStyle} />
      <SectionGoodwill textBaseStyle={textBaseStyle} />
      <SectionJazzAmbassadors textBaseStyle={textBaseStyle} />
      <SectionFBIFiles textBaseStyle={textBaseStyle} />
    </React.Fragment>
  );
};
