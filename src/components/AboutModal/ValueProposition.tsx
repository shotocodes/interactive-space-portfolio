// components/AboutModal/ValueProposition.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './ValueProposition.module.css';

interface ValuePropositionProps {
  language: 'en' | 'ja';
}

export default function ValueProposition({ language }: ValuePropositionProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullText = language === 'en'
    ? 'Building Digital Agencies That Run on Autopilot'
    : '自動で動くデジタルエージェンシーの構築';

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);

    let currentIndex = 0;
    const typingSpeed = 50;

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
  }, [fullText]);

  const valueCards = language === 'en' ? [
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
  ] : [
    {
      icon: '📐',
      title: 'デザイン',
      description: '訪問者を顧客に変換するビジュアルアイデンティティ',
      delay: '0.2s'
    },
    {
      icon: '💻',
      title: '開発',
      description: 'スケールと自動化のために構築されたフルスタックソリューション',
      delay: '0.4s'
    },
    {
      icon: '⚙️',
      title: '自動化',
      description: 'あなたが寝ている間にビジネスを成長させるシステム',
      delay: '0.6s'
    }
  ];

  const subHeading = language === 'en'
    ? 'Design × Development × Automation'
    : 'デザイン × 開発 × 自動化';

  const tagline = language === 'en'
    ? 'Location-independent business systems for modern entrepreneurs'
    : '現代起業家のための場所に依存しないビジネスシステム';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* タイプライターテキスト */}
        <h1 className={styles.mainHeading}>
          {displayedText}
          <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
        </h1>

        {/* サブヘッディング */}
        <p className={`${styles.subHeading} ${isTypingComplete ? styles.fadeIn : ''}`}>
          {subHeading}
        </p>
        <p className={`${styles.tagline} ${isTypingComplete ? styles.fadeIn : ''}`}>
          {tagline}
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
