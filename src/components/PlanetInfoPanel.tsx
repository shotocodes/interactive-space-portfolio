// components/PlanetInfoPanel.tsx
'use client';

import { usePortfolioStore } from '@/store/usePortfolioStore';
import { languageData } from '@/lib/data/languageData';

export default function PlanetInfoPanel() {
  const {
    language,
    showPlanetInfo,
    planetInfoData,
    setPlanetInfoData,
    setShowAboutModal,
    setShowProjectModal,
    setShowServiceModal,
    setShowContactModal,
    setIsTransitioning
  } = usePortfolioStore();

  const currentData = languageData[language];

  if (!planetInfoData) return null;

  // グローエフェクトのクラス名を決定
  let glowClass = '';

  // 通常の惑星
  if (planetInfoData.link === '#about') glowClass = 'glow-about';
  else if (planetInfoData.link === '#projects') glowClass = 'glow-projects';
  else if (planetInfoData.link === '#services') glowClass = 'glow-services';
  else if (planetInfoData.link === '#contact') glowClass = 'glow-contact';

  // アクション惑星
  else if (planetInfoData.action === 'controls') glowClass = 'glow-controls';
  else if (planetInfoData.action === 'sns') glowClass = 'glow-sns';
  else if (planetInfoData.action === 'blog') glowClass = 'glow-blog';

  const handleDetailClick = (e: React.MouseEvent) => {
    e.preventDefault();

    console.log('Detail clicked, planetInfoData:', planetInfoData);

    // リンクに応じて適切なモーダルを開く
    switch (planetInfoData.link) {
      case '#about':
        console.log('Opening About modal');
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowAboutModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      case '#projects':
        console.log('Opening Projects modal');
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowProjectModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      case '#services':
        console.log('Opening Services modal');
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowServiceModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      case '#contact':
        console.log('Opening Contact modal');
        setIsTransitioning(true);
        setPlanetInfoData(null);
        setTimeout(() => {
          setShowContactModal(true);
          setIsTransitioning(false);
        }, 100);
        break;

      default:
        // 他のページは通常のリンク動作（将来的に実装）
        console.log('Navigate to:', planetInfoData.link);
        break;
    }
  };

  return (
    <div className={`planet-info-panel ${showPlanetInfo ? 'show' : ''} ${glowClass}`}>
      <h3>{planetInfoData.name}</h3>
      <p>{planetInfoData.description}</p>
      <div>
        {planetInfoData.isActionPlanet && planetInfoData.links ? (
          <>
            {planetInfoData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`nav-button ${
                  planetInfoData.action === 'sns'
                    ? 'external-link-button'
                    : 'blog-link-button'
                }`}
              >
                {link.name}
              </a>
            ))}
            <button
              className="nav-button close-button"
              onClick={() => setPlanetInfoData(null)}
            >
              {currentData.ui.close}
            </button>
          </>
        ) : (
          <a
            href={planetInfoData.link}
            className="nav-button"
            onClick={handleDetailClick}
          >
            {currentData.ui.viewDetails}
          </a>
        )}
      </div>
    </div>
  );
}
