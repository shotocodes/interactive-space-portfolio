// components/ContactModal/ContactSettingsPanel.tsx
'use client';

import styles from './ContactSettingsPanel.module.css';

interface ContactSettingsPanelProps {
  shapeType: 'cone' | 'ring';
  onShapeToggle: () => void;
  particleCount: number;
  onParticleCountChange: (count: number) => void;
  warpMode: boolean;
  onWarpToggle: () => void;
  magneticMode: boolean;
  onMagneticToggle: () => void;
}

export default function ContactSettingsPanel({
  shapeType,
  onShapeToggle,
  particleCount,
  onParticleCountChange,
  warpMode,
  onWarpToggle,
  magneticMode,
  onMagneticToggle,
}: ContactSettingsPanelProps) {
  const particleOptions = [5000, 10000, 15000, 20000, 30000];

  return (
    <div className={styles.settingsPanel}>
      <h3 className={styles.title}>Settings</h3>

      {/* 形状切り替え */}
      <div className={styles.settingGroup}>
        <label className={styles.label}>Shape</label>
        <button
          className={`${styles.toggleButton} ${styles.shapeButton}`}
          onClick={onShapeToggle}
        >
          {shapeType === 'cone' ? (
            <>
              <span className={styles.activeShape}>📍 Cone</span>
              <span className={styles.separator}>⇄</span>
              <span className={styles.inactiveShape}>💍 Ring</span>
            </>
          ) : (
            <>
              <span className={styles.inactiveShape}>📍 Cone</span>
              <span className={styles.separator}>⇄</span>
              <span className={styles.activeShape}>💍 Ring</span>
            </>
          )}
        </button>
        <p className={styles.shapeDescription}>
          {shapeType === 'cone'
            ? 'Direction & Action'
            : 'Connection & Communication'}
        </p>
      </div>

      {/* 粒子数 */}
      <div className={styles.settingGroup}>
        <label className={styles.label}>
          Particle Count: {particleCount.toLocaleString()}
        </label>
        <div className={styles.buttonGrid}>
          {particleOptions.map((count) => (
            <button
              key={count}
              className={`${styles.optionButton} ${
                particleCount === count ? styles.active : ''
              }`}
              onClick={() => onParticleCountChange(count)}
            >
              {count >= 1000 ? `${count / 1000}k` : count}
            </button>
          ))}
        </div>
      </div>

      {/* Warpモード */}
      <div className={styles.settingGroup}>
        <label className={styles.label}>Warp Mode</label>
        <button
          className={`${styles.toggleButton} ${warpMode ? styles.active : ''}`}
          onClick={onWarpToggle}
        >
          {warpMode ? 'ON' : 'OFF'}
        </button>
        <p className={styles.description}>
          Creates dynamic wave distortions
        </p>
      </div>

      {/* Magneticモード */}
      <div className={styles.settingGroup}>
        <label className={styles.label}>Magnetic Mode</label>
        <button
          className={`${styles.toggleButton} ${magneticMode ? styles.active : ''}`}
          onClick={onMagneticToggle}
        >
          {magneticMode ? 'ON' : 'OFF'}
        </button>
        <p className={styles.description}>
          Particles follow your cursor
        </p>
      </div>
    </div>
  );
}
