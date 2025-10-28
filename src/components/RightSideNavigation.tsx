// components/RightSideNavigation.tsx
'use client';

import { usePortfolioStore } from '@/store/usePortfolioStore';
import { languageData } from '@/lib/data/languageData';

export default function RightSideNavigation() {
  const { language, setPlanetInfoData } = usePortfolioStore();
  const currentData = languageData[language];

  const handlePlanetClick = (planetType: 'about' | 'projects' | 'services' | 'contact') => {
    const planetInfo = currentData.planets[planetType];
    setPlanetInfoData({
      name: planetInfo.name,
      description: planetInfo.description,
      link: `#${planetType}`
    });
  };

  return (
    <div className="right-side-navigation">
      <button
        className="right-side-icon-button"
        onClick={() => handlePlanetClick('about')}
        title="About"
      >
        👤
      </button>
      <button
        className="right-side-icon-button"
        onClick={() => handlePlanetClick('projects')}
        title="Projects"
      >
        📁
      </button>
      <button
        className="right-side-icon-button"
        onClick={() => handlePlanetClick('services')}
        title="Services"
      >
        💼
      </button>
      <button
        className="right-side-icon-button"
        onClick={() => handlePlanetClick('contact')}
        title="Contact"
      >
        ✉️
      </button>
    </div>
  );
}
