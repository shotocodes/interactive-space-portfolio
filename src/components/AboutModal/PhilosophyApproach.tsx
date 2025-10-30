// components/AboutModal/PhilosophyApproach.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './PhilosophyApproach.module.css';

export default function PhilosophyApproach() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fullText = 'Work Smarter, Live Freely';

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
      { threshold: 0.3 } // 30%見えたら開始
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
    const typingSpeed = 100; // 100ms（遅く）

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

  const philosophyCards = [
    {
      icon: '🌐',
      title: 'Location Independent',
      description: 'Built for the digital nomad era. Work from anywhere, anytime, with anyone.'
    },
    {
      icon: '⚙️',
      title: 'Systems Over Labor',
      description: 'Automation-first development. Scale without burning out.'
    },
    {
      icon: '📈',
      title: 'Value Over Hours',
      description: 'Results-driven approach. Your success is my success.'
    }
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* 背景の粒子エフェクト（より目立つように） */}
      <div className={styles.particleBackground}>
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <div className={styles.container}>
        {/* タイプライターテキスト */}
        <h1 className={styles.typewriterHeading}>
          {displayedText}
          <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
        </h1>

        {/* セクションタイトル */}
        <h2 className={`${styles.sectionTitle} ${isTypingComplete ? styles.fadeIn : ''}`}>
          My Approach
        </h2>

        {/* 哲学カードグリッド */}
        <div className={styles.cardGrid}>
          {philosophyCards.map((card, index) => (
            <div
              key={index}
              className={`${styles.card} ${isTypingComplete ? styles.cardFadeIn : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.cardIcon}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
