// components/SideNavigation.tsx
'use client';

import { usePortfolioStore } from '@/store/usePortfolioStore';
import { languageData } from '@/lib/data/languageData';

export default function SideNavigation() {
  const { language, toggleControls, setPlanetInfoData } = usePortfolioStore();
  const currentData = languageData[language];

  const handleAction = (action: string) => {
    if (action === 'controls') {
      toggleControls();
    } else if (action === 'sns') {
      setPlanetInfoData({
        name: currentData.actions.sns.name,
        description: currentData.actions.sns.description,
        isActionPlanet: true,
        action: 'sns',
        links: [
          { name: "Twitter", url: "https://twitter.com/your_twitter" },
          { name: "LinkedIn", url: "https://linkedin.com/in/your_linkedin" },
          { name: "Instagram", url: "https://instagram.com/your_instagram" }
        ]
      });
    } else if (action === 'blog') {
      setPlanetInfoData({
        name: currentData.actions.blog.name,
        description: currentData.actions.blog.description,
        isActionPlanet: true,
        action: 'blog',
        links: [
          {
            name: language === 'ja' ? "技術ブログ" : "Tech Blog",
            url: "https://your-tech-blog.com"
          },
          { name: "Qiita", url: "https://qiita.com/your_qiita" },
          { name: "Zenn", url: "https://zenn.dev/your_zenn" }
        ]
      });
    }
  };

  return (
    <div className="side-navigation">
      <button
        className="side-icon-button"
        onClick={() => handleAction('controls')}
        title="コントロール"
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
