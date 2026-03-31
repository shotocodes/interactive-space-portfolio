// components/ProjectModal/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import ParticleMorphing from './ParticleMorphing';
import ProjectSettingsPanel from './ProjectSettingsPanel';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
  const { setShowContactModal, setIsTransitioning } = usePortfolioStore();
  const [showSettings, setShowSettings] = useState(false);
  const [shapeType, setShapeType] = useState<'torusKnot' | 'helix'>('torusKnot');
  const [particleCount, setParticleCount] = useState(15000);
  const [warpMode, setWarpMode] = useState(false);
  const [magneticMode, setMagneticMode] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullText = 'Crafted With Purpose';

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

  const clientWorks = [
    {
      title: 'Sato Kohmuten - Corporate Site Renewal',
      description: 'Full website renewal for a construction company. End-to-end from planning and design to implementation.',
      tech: ['WordPress', 'PHP', 'Responsive Design'],
      result: '150% increase in inquiries',
      url: 'https://www.sato-kohmuten.com/',
      year: '2025',
      testimonial: 'Through careful listening, our vision was brought to life. The finished site exceeded expectations.'
    },
    {
      title: 'Otakara Hiroba - Corporate Site',
      description: 'Service site design and WordPress implementation. Delivered within a tight 2-week deadline.',
      tech: ['WordPress', 'PHP', 'Custom Design'],
      result: 'On-time delivery, high client satisfaction',
      url: 'https://www.otakarahiroba05.com/',
      year: '2026',
      testimonial: 'Despite the tight timeline, a high-quality site was delivered. Great response time and very reliable.'
    }
  ];

  const personalProjects = [
    {
      title: 'Interactive Space Portfolio',
      description: 'This site. 3D interactive portfolio built with Three.js particle systems and custom shaders.',
      tech: ['Next.js', 'Three.js', 'TypeScript'],
      status: 'Active',
      url: 'https://www.shoto.tech/',
      year: '2024'
    },
    {
      title: 'Sho-tolog',
      description: 'Personal tech blog sharing web development insights, AI tools, and freelance experiences.',
      tech: ['WordPress', 'PHP', 'SEO'],
      status: 'Active',
      url: 'https://sho-tolog.com/',
      year: '2024'
    },
    {
      title: 'JP Portfolio',
      description: 'Japanese portfolio site with pricing calculator, support hub, and blog system.',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      status: 'Active',
      url: 'https://shotomoriyama.com/',
      year: '2025'
    }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.settingsButton}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>

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

        <div className={styles.pageTitle}>Projects</div>

        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.scrollContainer}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.particleContainer}>
              <ParticleMorphing
                morphToHelix={shapeType === 'helix'}
                warpMode={warpMode}
                magneticMode={magneticMode}
                particleCount={particleCount}
              />
            </div>

            <div className={styles.heroContent}>
              <h1 className={styles.typewriterHeading}>
                {displayedText}
                <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
              </h1>
            </div>
          </section>

          {/* Client Works */}
          <section className={styles.comingSoonSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Client Work</h2>

              <div className={styles.previewGrid}>
                {clientWorks.map((work, index) => (
                  <div key={index} className={styles.previewCard}>
                    <div className={styles.previewIcon}>💼</div>
                    <h3 className={styles.previewTitle}>{work.title}</h3>
                    <p className={styles.previewDescription}>{work.description}</p>
                    <div className={styles.techTags}>
                      {work.tech.map((t, i) => (
                        <span key={i} className={styles.techTag}>{t}</span>
                      ))}
                    </div>
                    <p className={`${styles.resultText} ${styles.resultClient}`}>
                      {work.result}
                    </p>
                    <p className={styles.testimonial}>
                      &ldquo;{work.testimonial}&rdquo;
                    </p>
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.visitLink}
                    >
                      Visit Site →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Personal Projects */}
          <section className={styles.comingSoonSection} style={{ paddingTop: 0 }}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Personal Projects</h2>

              <div className={styles.previewGrid}>
                {personalProjects.map((project, index) => (
                  <div key={index} className={styles.previewCard}>
                    <div className={styles.previewIcon}>🚀</div>
                    <h3 className={styles.previewTitle}>{project.title}</h3>
                    <p className={styles.previewDescription}>{project.description}</p>
                    <div className={styles.techTags}>
                      {project.tech.map((t, i) => (
                        <span key={i} className={styles.techTag}>{t}</span>
                      ))}
                    </div>
                    <p className={`${styles.resultText} ${styles.resultPersonal}`}>
                      {project.status}
                    </p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.visitLink}
                    >
                      Visit Site →
                    </a>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className={styles.ctaArea}>
                <button
                  className={styles.backButton}
                  onClick={() => {
                    setIsTransitioning(true);
                    onClose();
                    setTimeout(() => {
                      setShowContactModal(true);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                >
                  Start a Project →
                </button>
                <button className={styles.backButton} onClick={onClose}>
                  ← Back to Home
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
