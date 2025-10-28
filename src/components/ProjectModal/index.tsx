// components/ProjectModal/index.tsx
'use client';

import { useEffect, useState } from 'react';
import ParticleMorphing from './ParticleMorphing';
import ProjectSettingsPanel from './ProjectSettingsPanel';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [shapeType, setShapeType] = useState<'torusKnot' | 'helix'>('torusKnot');
  const [particleCount, setParticleCount] = useState(15000);
  const [warpMode, setWarpMode] = useState(false);
  const [magneticMode, setMagneticMode] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullText = 'Building Something Amazing';

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

  // タイプライター効果
  useEffect(() => {
    if (!isOpen) return;

    let currentIndex = 0;
    const typingSpeed = 80;

    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [isOpen]);

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
          <ProjectSettingsPanel
            shapeType={shapeType}
            onShapeToggle={() => setShapeType(shapeType === 'torusKnot' ? 'helix' : 'torusKnot')}
            particleCount={particleCount}
            onParticleCountChange={setParticleCount}
            warpMode={warpMode}
            onWarpToggle={() => setWarpMode(!warpMode)}
            magneticMode={magneticMode}
            onMagneticToggle={() => setMagneticMode(!magneticMode)}
          />
        )}

        {/* 右上: ページタイトル */}
        <div className={styles.pageTitle}>Projects</div>

        {/* 右上: 閉じるボタン */}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* スクロールコンテナ */}
        <div className={styles.scrollContainer}>
          {/* ヒーローセクション - 形状切り替え */}
          <section className={styles.heroSection}>
            <div className={styles.particleContainer}>
              <ParticleMorphing
                morphToHelix={shapeType === 'helix'}
                warpMode={warpMode}
                magneticMode={magneticMode}
                particleCount={particleCount}
              />
            </div>

            {/* タイプライターテキスト */}
            <div className={styles.heroContent}>
              <h1 className={styles.typewriterHeading}>
                {displayedText}
                <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
              </h1>
            </div>
          </section>

          {/* Coming Soon セクション */}
          <section className={styles.comingSoonSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Projects</h2>

              <div className={styles.messageContent}>
                <p className={styles.messageText}>
                  I'm currently working on exciting projects.
                </p>
                <p className={styles.messageText}>
                  Check back soon to see what I've built.
                </p>

                <p className={styles.messageTextJa}>
                  現在、新しいプロジェクトを制作中です。
                </p>
                <p className={styles.messageTextJa}>
                  完成したらここで公開します。
                </p>
              </div>

              {/* 予告カード */}
              <div className={styles.previewGrid}>
                {[1, 2, 3].map((item) => (
                  <div key={item} className={styles.previewCard}>
                    <div className={styles.previewIcon}>⏳</div>
                    <h3 className={styles.previewTitle}>Coming Soon</h3>
                    <p className={styles.previewDescription}>
                      Exciting project in development
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAボタン */}
              <button className={styles.backButton} onClick={onClose}>
                ← Back to Home
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
