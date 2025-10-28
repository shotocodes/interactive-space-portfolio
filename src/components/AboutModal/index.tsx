// components/AboutModal/index.tsx
'use client';

import { useEffect, useState } from 'react';
import ParticleSphere from './ParticleSphere';
import AboutSettingsPanel from './SettingsPanel';
import ValueProposition from './ValueProposition';
import PhilosophyApproach from './PhilosophyApproach';
import OriginStory from './OriginStory';
import Skills from './Skills';
import FeaturedWork from './FeaturedWork';
import ConnectSection from './ConnectSection';
import styles from './AboutModal.module.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [morphToIcosahedron, setMorphToIcosahedron] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [particleCount, setParticleCount] = useState(15000);
  const [warpMode, setWarpMode] = useState(false);
  const [magneticMode, setMagneticMode] = useState(false);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* 左上: 設定ボタン */}
        <button
          className={styles.settingsButton}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>

        {/* 設定パネル */}
        {showSettings && (
          <AboutSettingsPanel
            morphToIcosahedron={morphToIcosahedron}
            onShapeToggle={() => setMorphToIcosahedron(!morphToIcosahedron)}
            particleCount={particleCount}
            onParticleCountChange={setParticleCount}
            warpMode={warpMode}
            onWarpToggle={() => setWarpMode(!warpMode)}
            magneticMode={magneticMode}
            onMagneticToggle={() => setMagneticMode(!magneticMode)}
          />
        )}

        {/* 右上: ページタイトル */}
        <div className={styles.pageTitle}>About</div>

        {/* 右上: 閉じるボタン */}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* スクロールコンテナ */}
        <div className={styles.scrollContainer}>
          {/* ヒーローセクション - 粒子球体 */}
          <section className={styles.section + ' ' + styles.heroSection}>
            <div className={styles.particleContainer}>
              <ParticleSphere
                morphToIcosahedron={morphToIcosahedron}
                warpMode={warpMode}
                magneticMode={magneticMode}
                particleCount={particleCount}
              />
            </div>

            {/* ミッションデータ */}
            <div className={styles.missionData}>
              <div className={styles.dataItem}>
                <div className={styles.dataLabel}>Started</div>
                <div className={styles.dataValue}>2020</div>
              </div>
              <div className={styles.dataItem}>
  <div className={styles.dataLabel}>Location</div>
  <div className={styles.dataValue}>Tokyo, Japan</div>
  <div className={styles.dataValue}>Bangkok, Thailand</div>
  <div className={styles.dataValue + ' ' + styles.dataFuture}>→ Worldwide</div>
</div>
              <div className={styles.dataItem}>
                <div className={styles.dataLabel}>Status</div>
                <div className={styles.dataValue}>Active</div>
              </div>
            </div>
          </section>

          {/* Value Proposition セクション */}
          <ValueProposition />

          {/* Philosophy / Approach セクション */}
          <PhilosophyApproach />

          {/* Origin Story セクション */}
          <OriginStory />

          {/* Skills セクション */}
          <Skills />

          {/* Featured Work セクション */}
          <FeaturedWork />

          {/* Connect セクション */}
          <ConnectSection />
        </div>
      </div>
    </div>
  );
}
