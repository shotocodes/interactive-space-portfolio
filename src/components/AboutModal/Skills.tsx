// components/AboutModal/Skills.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './Skills.module.css';

export default function Skills() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fullText = 'Tools That Build Freedom';

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

  const getSkillLevel = (percentage: number) => {
    if (percentage >= 85) return 'Professional';
    if (percentage >= 70) return 'Advanced';
    return 'Intermediate';
  };

  const skills = [
    { name: 'Next.js', percentage: 90, icon: '⚡', detail: 'Primary framework' },
    { name: 'React', percentage: 90, icon: '⚛️', detail: 'Component architecture' },
    { name: 'TypeScript', percentage: 80, icon: '📘', detail: 'Type-safe development' },
    { name: 'Tailwind CSS', percentage: 90, icon: '🎨', detail: 'Rapid UI styling' },
    { name: 'Three.js', percentage: 70, icon: '🌐', detail: '3D web experiences' },
    { name: 'WordPress', percentage: 80, icon: '📝', detail: 'CMS & custom themes' },
    { name: 'Figma', percentage: 75, icon: '🎯', detail: 'UI/UX prototyping' },
    { name: 'AI Tools', percentage: 80, icon: '🤖', detail: 'Claude, Cursor, v0' },
    { name: 'Framer Motion', percentage: 85, icon: '✨', detail: 'Smooth animations' }
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
          Technical Capabilities
        </h2>

        {/* スキルグリッド */}
        <div className={styles.skillGrid}>
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`${styles.skillCard} ${isTypingComplete ? styles.cardFadeIn : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* サークルプログレス */}
              <div className={styles.circleContainer}>
                <svg className={styles.circleSvg} viewBox="0 0 120 120">
                  {/* 背景円 */}
                  <circle
                    className={styles.circleBackground}
                    cx="60"
                    cy="60"
                    r="54"
                  />
                  {/* プログレス円 */}
                  <circle
                    className={styles.circleProgress}
                    cx="60"
                    cy="60"
                    r="54"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 54}`,
                      strokeDashoffset: `${2 * Math.PI * 54 * (1 - skill.percentage / 100)}`,
                      animationDelay: `${index * 0.1 + 0.5}s`
                    }}
                  />
                </svg>
                {/* パーセンテージ表示 */}
                <div className={styles.percentageText}>{skill.percentage}%</div>
              </div>

              {/* アイコン */}
              <div className={styles.skillIcon}>{skill.icon}</div>

              {/* スキル名 */}
              <h3 className={styles.skillName}>{skill.name}</h3>

              {/* 詳細 */}
              <p className={styles.skillLevel}>{skill.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
