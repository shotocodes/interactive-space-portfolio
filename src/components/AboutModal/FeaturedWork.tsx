// components/AboutModal/FeaturedWork.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import styles from './FeaturedWork.module.css';

export default function FeaturedWork() {
  const { setShowProjectModal, setShowAboutModal, setIsTransitioning } = usePortfolioStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fullText = 'Proven Results, Real Impact';

  // スクロールで表示されたら開始
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldStartTyping) {
            setShouldStartTyping(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [shouldStartTyping]);

  // タイプライター効果
  useEffect(() => {
    if (!shouldStartTyping) return;

    let currentIndex = 0;
    const typingSpeed = 100;

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
  }, [shouldStartTyping]);

  const projects = [
    {
      title: 'Personal Portfolio 2024',
      description: 'Interactive 3D particle visualization with seamless animations',
      tech: ['Next.js', 'TypeScript', 'Three.js'],
      result: 'Modern & Unique Design',
      status: 'completed',
      link: '#'
    },
    {
      title: 'E-Commerce Platform',
      description: 'Automated business system with integrated payment processing',
      tech: ['Next.js', 'Stripe', 'Automation'],
      result: 'In Development',
      status: 'in-progress',
      link: null
    },
    {
      title: 'SaaS Dashboard',
      description: 'Data visualization system with real-time analytics',
      tech: ['React', 'D3.js', 'API Integration'],
      result: 'Planning Phase',
      status: 'planning',
      link: null
    }
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* タイプライターテキスト */}
        <h1 className={styles.typewriterHeading}>
          {displayedText}
          <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
        </h1>

        {/* セクションタイトル */}
        <h2 className={`${styles.sectionTitle} ${isTypingComplete ? styles.fadeIn : ''}`}>
          Featured Work
        </h2>

        {/* プロジェクトグリッド */}
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <div
              key={index}
              className={`${styles.projectCard} ${isTypingComplete ? styles.cardFadeIn : ''} ${
                project.status !== 'completed' ? styles.comingSoon : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* ステータスバッジ */}
              {project.status !== 'completed' && (
                <div className={styles.statusBadge}>Coming Soon</div>
              )}

              {/* プロジェクトタイトル */}
              <h3 className={styles.projectTitle}>{project.title}</h3>

              {/* プロジェクト説明 */}
              <p className={styles.projectDescription}>{project.description}</p>

              {/* 技術スタック */}
              <div className={styles.techStack}>
                {project.tech.map((tech, i) => (
                  <span key={i} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* 成果・ステータス */}
              <div className={styles.result}>
                <span className={styles.resultLabel}>Status:</span>
                <span className={styles.resultValue}>{project.result}</span>
              </div>

              {/* リンク */}
              {project.link && (
                <a href={project.link} className={styles.projectLink}>
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* View All Projects ボタン */}
        <button
          className={`${styles.viewAllButton} ${isTypingComplete ? styles.fadeIn : ''}`}
          onClick={() => {
            setIsTransitioning(true);
            setShowAboutModal(false);
            setTimeout(() => {
              setShowProjectModal(true);
              setIsTransitioning(false);
            }, 300);
          }}
        >
          View All Projects →
        </button>
      </div>
    </section>
  );
}
