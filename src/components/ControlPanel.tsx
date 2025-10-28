// components/ControlPanel.tsx
'use client';

import { useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { languageData } from '@/lib/data/languageData';

export default function ControlPanel() {
  const {
    language,
    config,
    showControls,
    setShowControls,
    updateConfig,
    toggleLanguage,
    planetInfoData,
    setPlanetInfoData
  } = usePortfolioStore();

  const currentData = languageData[language];

  // 言語が変更されたときに開いているパネルを更新
  useEffect(() => {
    if (!planetInfoData) return;

    // 通常の惑星の場合
    if (!planetInfoData.isActionPlanet && planetInfoData.link) {
      const planetKey = planetInfoData.link.replace('#', '') as 'about' | 'projects' | 'services' | 'contact';
      const planetInfo = currentData.planets[planetKey];
      if (planetInfo) {
        setPlanetInfoData({
          name: planetInfo.name,
          description: planetInfo.description,
          link: planetInfoData.link
        });
      }
    }
    // アクション惑星の場合
    else if (planetInfoData.isActionPlanet && planetInfoData.action) {
      const actionKey = planetInfoData.action as 'sns' | 'blog';
      const actionInfo = currentData.actions[actionKey];
      if (actionInfo) {
        const updatedData: any = {
          name: actionInfo.name,
          description: actionInfo.description,
          isActionPlanet: true,
          action: planetInfoData.action
        };

        // リンクをコピー
        if (planetInfoData.links) {
          updatedData.links = planetInfoData.links.map(link => {
            if (actionKey === 'blog' && (link.name.includes('ブログ') || link.name.includes('Blog'))) {
              return {
                ...link,
                name: language === 'ja' ? '技術ブログ' : 'Tech Blog'
              };
            }
            return link;
          });
        }

        setPlanetInfoData(updatedData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className={`control-panel ${showControls ? 'show' : ''}`}>
      <div className="control-header">
        <h3 className="control-title">{currentData.ui.settings}</h3>
        <button
          className="close-control-button"
          onClick={() => setShowControls(false)}
        >
          ×
        </button>
      </div>

      <div className="language-switch">
        <span className="language-label">{currentData.ui.language}</span>
        <div
          className={`language-toggle ${language === 'en' ? 'english' : ''}`}
          onClick={toggleLanguage}
        >
          <div className="language-slider">
            {language === 'ja' ? 'JA' : 'EN'}
          </div>
        </div>
      </div>

      <div className="control-group">
        <label>
          {currentData.ui.orbitSpeed}: <span className="value">{config.orbitSpeed.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="3"
          value={config.orbitSpeed}
          step="0.1"
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            console.log('Orbit speed changed to:', newValue);
            updateConfig('orbitSpeed', newValue);
          }}
        />
      </div>

      <div className="control-group">
        <label>
          {currentData.ui.orbitSize}: <span className="value">{config.orbitRadius}</span>
        </label>
        <input
          type="range"
          min="4"
          max="10"
          value={config.orbitRadius}
          step="0.5"
          onChange={(e) => updateConfig('orbitRadius', parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>
          {currentData.ui.sunSize}: <span className="value">{config.sunSize}</span>
        </label>
        <input
          type="range"
          min="1"
          max="4" 
          value={config.sunSize}
          step="0.1"
          onChange={(e) => updateConfig('sunSize', parseFloat(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label>
          {currentData.ui.sunParticles}: <span className="value">{config.sunParticleCount}</span>
        </label>
        <input
          type="range"
          min="500"
          max="8000"
          value={config.sunParticleCount}
          step="100"
          onChange={(e) => updateConfig('sunParticleCount', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
