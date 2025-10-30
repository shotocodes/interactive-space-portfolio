// components/AboutModal/ValueProposition.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './ValueProposition.module.css';

export default function ValueProposition() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fullText = 'Building Digital Agencies That Run on Autopilot';

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

  useEffect(() => {
    if (!shouldStartTyping) return;

    let currentIndex = 0;
    const typingSpeed = 80; // 50ms → 80ms（少し遅く）

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

  const valueCards = [
    {
      icon: '📐',
      title: 'Design',
      description: 'Visual identity that converts visitors into customers',
      delay: '0.2s'
    },
    {
      icon: '💻',
      title: 'Development',
      description: 'Full-stack solutions built for scale and automation',
      delay: '0.4s'
    },
    {
      icon: '⚙️',
      title: 'Automation',
      description: 'Systems that grow your business while you sleep',
      delay: '0.6s'
    }
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* タイプライターテキスト */}
        <h1 className={styles.mainHeading}>
          {displayedText}
          <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
        </h1>

        {/* サブヘッディング */}
        <p className={`${styles.subHeading} ${isTypingComplete ? styles.fadeIn : ''}`}>
          Design × Development × Automation
        </p>
        <p className={`${styles.tagline} ${isTypingComplete ? styles.fadeIn : ''}`}>
          Location-independent business systems for modern entrepreneurs
        </p>

        {/* 価値提案カード */}
        <div className={styles.cardGrid}>
          {valueCards.map((card, index) => (
            <div
              key={index}
              className={`${styles.card} ${isTypingComplete ? styles.cardFadeIn : ''}`}
              style={{ animationDelay: card.delay }}
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
