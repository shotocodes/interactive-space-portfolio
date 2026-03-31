// components/SideNavigation.tsx
'use client';

import { usePortfolioStore } from '@/store/usePortfolioStore';
import { languageData } from '@/lib/data/languageData';

export default function SideNavigation() {
  const { language, toggleControls, setPlanetInfoData, showControls } = usePortfolioStore();
  const currentData = languageData[language];

  const handleAction = (action: string) => {
    if (action === 'controls') {
      // 設定パネルを開く前に、スマホの場合は他のパネルを閉じる
      if (!showControls && window.innerWidth <= 768) {
        setPlanetInfoData(null);
      }
      toggleControls();
    } else if (action === 'sns') {
      // スマホの場合は設定パネルを閉じる
      if (window.innerWidth <= 768) {
        usePortfolioStore.getState().setShowControls(false);
      }
      setPlanetInfoData({
        name: currentData.actions.sns.name,
        description: currentData.actions.sns.description,
        isActionPlanet: true,
        action: 'sns',
        links: [
          { name: "X (Twitter)", url: "https://x.com/ShotoMoriyama" },
          { name: "LinkedIn", url: "https://www.linkedin.com/in/shotomoriyama/" },
          { name: "Instagram", url: "https://www.instagram.com/sh0t0x72/" },
          { name: "GitHub", url: "https://github.com/shotocodes" }
        ]
      });
    } else if (action === 'blog') {
      // スマホの場合は設定パネルを閉じる
      if (window.innerWidth <= 768) {
        usePortfolioStore.getState().setShowControls(false);
      }
      setPlanetInfoData({
        name: currentData.actions.blog.name,
        description: currentData.actions.blog.description,
        isActionPlanet: true,
        action: 'blog',
        links: [
          {
            name: language === 'ja' ? "Sho-tolog" : "Sho-tolog",
            url: "https://sho-tolog.com/"
          },
          { name: "note", url: "https://note.com/sh0t0" }
        ]
      });
    }
  };

  return (
    <div className="side-navigation">
      <button
        className="side-icon-button"
        onClick={() => handleAction('controls')}
        title="Controls"
      >
        ⚙️
      </button>
      <button
        className="side-icon-button"
        onClick={() => handleAction('sns')}
        title="SNS Links"
      >
        🔗
      </button>
      <button
        className="side-icon-button"
        onClick={() => handleAction('blog')}
        title="Blog"
      >
        ✏️
      </button>
    </div>
  );
}
