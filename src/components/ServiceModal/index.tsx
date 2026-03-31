// components/ServiceModal/index.tsx (完全版)
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import ParticleMorphing from './ParticleMorphing';
import ServiceSettingsPanel from './ServiceSettingsPanel';
import styles from './ServiceModal.module.css';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
  const { setShowContactModal, setIsTransitioning } = usePortfolioStore();
  const [showSettings, setShowSettings] = useState(false);
  const [shapeType, setShapeType] = useState<'box' | 'pyramid'>('box');
  const [particleCount, setParticleCount] = useState(15000);
  const [warpMode, setWarpMode] = useState(false);
  const [magneticMode, setMagneticMode] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullText = 'What I Can Build For You';

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

  const services = [
    {
      icon: '💻',
      title: 'Web Development',
      description: 'Modern websites built with Next.js and React. From design to deployment.',
      features: ['Corporate Sites & Landing Pages', 'Next.js / React Applications', 'WordPress Development', 'Responsive Design & SEO']
    },
    {
      icon: '🎨',
      title: 'Design',
      description: 'UI design, logo creation, and branding. Custom design crafted from scratch.',
      features: ['UI/UX Design', 'Logo & Branding', 'Signage Design', 'Prototyping & Mockups']
    },
    {
      icon: '⚙️',
      title: 'Maintenance & Operations',
      description: 'Continuous support for stable operation. Security and performance optimization.',
      features: ['Regular Updates & Maintenance', 'Security & Backup Management', 'Performance Optimization', 'Content Updates']
    }
  ];

  const process = [
    { step: '01', title: 'Discovery', description: 'Understanding your needs and goals' },
    { step: '02', title: 'Planning', description: 'Designing the perfect solution' },
    { step: '03', title: 'Development', description: 'Building with precision and care' },
    { step: '04', title: 'Launch', description: 'Delivering results that exceed expectations' }
  ];

  const techStack = [
    { name: 'Next.js', level: 80 },
    { name: 'React', level: 80 },
    { name: 'TypeScript', level: 80 },
    { name: 'Three.js', level: 65 },
    { name: 'UI/UX Design', level: 70 },
    { name: 'Canva', level: 80 },
    { name: 'AI', level: 70 }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for small projects',
      features: ['Basic Website (1-5 pages)', 'Responsive Design', '1 Month Support'],
      price: 'Contact Us'
    },
    {
      name: 'Professional',
      description: 'For growing businesses',
      features: ['Custom Website (6-10 pages)', 'CMS Integration', '3 Months Support', 'SEO Optimization'],
      price: 'Contact Us',
      featured: true
    },
    {
      name: 'Enterprise',
      description: 'Full custom solution',
      features: ['Full Custom Application', 'E-Commerce / Advanced Features', '6 Months Support', 'Maintenance Contract'],
      price: 'Contact Us'
    }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* 設定ボタン */}
        <button
          className={styles.settingsButton}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>

        {/* 設定パネル */}
        {showSettings && (
          <ServiceSettingsPanel
            shapeType={shapeType}
            onShapeToggle={() => setShapeType(shapeType === 'box' ? 'pyramid' : 'box')}
            particleCount={particleCount}
            onParticleCountChange={setParticleCount}
            warpMode={warpMode}
            onWarpToggle={() => setWarpMode(!warpMode)}
            magneticMode={magneticMode}
            onMagneticToggle={() => setMagneticMode(!magneticMode)}
          />
        )}

        {/* ページタイトル */}
        <div className={styles.pageTitle}>Services</div>

        {/* 閉じるボタン */}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* スクロールコンテナ */}
        <div className={styles.scrollContainer}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.particleContainer}>
              <ParticleMorphing
                morphToPyramid={shapeType === 'pyramid'}
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

          {/* Services Overview */}
          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Services</h2>
              <div className={styles.servicesGrid}>
                {services.map((service, index) => (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceIcon}>{service.icon}</div>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>
                    <ul className={styles.featureList}>
                      {service.features.map((feature, i) => (
                        <li key={i} className={styles.featureItem}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process */}
          <section className={styles.section + ' ' + styles.darkSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>How We Work Together</h2>
              <div className={styles.processGrid}>
                {process.map((item, index) => (
                  <div key={index} className={styles.processCard}>
                    <div className={styles.processStep}>{item.step}</div>
                    <h3 className={styles.processTitle}>{item.title}</h3>
                    <p className={styles.processDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Technologies</h2>
              <div className={styles.techGrid}>
                {techStack.map((tech, index) => (
                  <div key={index} className={styles.techItem}>
                    <div className={styles.techName}>{tech.name}</div>
                    <div className={styles.techBar}>
                      <div
                        className={styles.techProgress}
                        style={{ width: `${tech.level}%` }}
                      />
                    </div>
                    <div className={styles.techLevel}>{tech.level}%</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className={styles.section + ' ' + styles.darkSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Investment Options</h2>
              <div className={styles.pricingGrid}>
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`${styles.pricingCard} ${plan.featured ? styles.featured : ''}`}
                  >
                    {plan.featured && <div className={styles.badge}>Popular</div>}
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <p className={styles.planDescription}>{plan.description}</p>
                    <div className={styles.planPrice}>{plan.price}</div>
                    <ul className={styles.planFeatures}>
                      {plan.features.map((feature, i) => (
                        <li key={i} className={styles.planFeature}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className={styles.section + ' ' + styles.ctaSection}>
            <div className={styles.container}>
              <h2 className={styles.ctaTitle}>Ready to Start Your Project?</h2>
              <p className={styles.ctaDescription}>
                Let's discuss how we can bring your vision to life.
              </p>
              <button
                className={styles.ctaButton}
                onClick={() => {
                  setIsTransitioning(true);
                  onClose();
                  setTimeout(() => {
                    setShowContactModal(true);
                    setIsTransitioning(false);
                  }, 300);
                }}
              >
                Get In Touch →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
