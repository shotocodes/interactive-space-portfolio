// app/page.tsx
'use client';

import { useEffect } from 'react';
import ThreeCanvas from '@/components/ThreeCanvas';
import CustomCursor from '@/components/CustomCursor';
import LeftInfo from '@/components/LeftInfo';
import RightInfo from '@/components/RightInfo';
import ControlPanel from '@/components/ControlPanel';
import PlanetInfoPanel from '@/components/PlanetInfoPanel';
import SideNavigation from '@/components/SideNavigation';
import RightSideNavigation from '@/components/RightSideNavigation';
import AboutModal from '@/components/AboutModal';
import ProjectModal from '@/components/ProjectModal';
import ServiceModal from '@/components/ServiceModal';
import ContactModal from '@/components/ContactModal';
import { usePortfolioStore } from '@/store/usePortfolioStore';

export default function Home() {
  const {
    showPlanetInfo,
    setPlanetInfoData,
    hoveredPlanet,
    showAboutModal,
    setShowAboutModal,
    showProjectModal,
    setShowProjectModal,
    showServiceModal,
    setShowServiceModal,
    showContactModal,
    setShowContactModal,
    isTransitioning
  } = usePortfolioStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!showPlanetInfo) return;

      const target = e.target as HTMLElement;
      const planetInfoPanel = document.querySelector('.planet-info-panel');
      const controlPanel = document.querySelector('.control-panel');

      if (hoveredPlanet) {
        return;
      }

      const isClickingPlanetPanel = planetInfoPanel?.contains(target);
      const isClickingControlPanel = controlPanel?.contains(target);
      const isClickingRightSideButton = target.closest('.right-side-icon-button');
      const isClickingSideButton = target.closest('.side-icon-button');
      const isClickingLanguageToggle = target.closest('.language-toggle');
      const isClickingLeftInfo = target.closest('.left-info');
      const isClickingRightInfo = target.closest('.right-info');

      if (!isClickingPlanetPanel &&
          !isClickingControlPanel &&
          !isClickingRightSideButton &&
          !isClickingSideButton &&
          !isClickingLanguageToggle &&
          !isClickingLeftInfo &&
          !isClickingRightInfo) {
        setPlanetInfoData(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPlanetInfo, setPlanetInfoData, hoveredPlanet]);

  return (
    <>
      {!showAboutModal && !showProjectModal && !showServiceModal && !showContactModal && !isTransitioning && <CustomCursor />}

      {/* 条件付きレンダリングではなく、visibilityで制御 */}
      <div style={{
        visibility: (showAboutModal || showProjectModal || showServiceModal || showContactModal || isTransitioning) ? 'hidden' : 'visible',
        pointerEvents: (showAboutModal || showProjectModal || showServiceModal || showContactModal || isTransitioning) ? 'none' : 'auto'
      }}>
        <ThreeCanvas />
      </div>

      <div className="ui-overlay">
        <ControlPanel />
        <PlanetInfoPanel />
        <LeftInfo />
        <RightInfo />
        <SideNavigation />
        <RightSideNavigation />
      </div>

      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />

      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </>
  );
}
