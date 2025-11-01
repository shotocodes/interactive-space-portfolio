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
    setIsTransitioning,
    showAboutModal,
    showProjectModal,
    showServiceModal,
    showContactModal
  } = usePortfolioStore();

  const currentData = languageData[language];

  if (!planetInfoData) return null;

  // 惑星の色定義（planetData.tsと同じ色）
  const planetColors: { [key: string]: string } = {
    '#about': '#ff6b6b',    // About - 赤っぽいピンク
    '#projects': '#4ecdc4', // Projects - シアン
    '#services': '#45b7d1', // Services - 青
    '#contact': '#96ceb4'   // Contact - 緑
  };

  // 現在開いてるモーダルを検知
  let currentOpenModal = null;
  if (showAboutModal) currentOpenModal = '#about';
  else if (showProjectModal) currentOpenModal = '#projects';
  else if (showServiceModal) currentOpenModal = '#services';
  else if (showContactModal) currentOpenModal = '#contact';

  // ボタンの色を決定
  const buttonColor = currentOpenModal === planetInfoData.link
    ? planetColors[planetInfoData.link]
    : undefined;

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
    <div className={`planet-info-panel ${showPlanetInfo ? 'show' : ''}`}>
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
            style={{
              backgroundColor: buttonColor,
              borderColor: buttonColor ? 'transparent' : undefined
            }}
          >
            {currentData.ui.viewDetails}
          </a>
        )}
      </div>
    </div>
  );
}
