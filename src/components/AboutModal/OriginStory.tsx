// components/AboutModal/OriginStory.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './OriginStory.module.css';

export default function OriginStory() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fullText = 'Breaking Free, Building Digital';

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

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* 背景の微妙な粒子エフェクト */}
      <div className={styles.particleBackground}>
        {[...Array(80)].map((_, i) => (
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
          Origin Story
        </h2>

        {/* ストーリーコンテンツ */}
        <div className={`${styles.storyContent} ${isTypingComplete ? styles.fadeIn : ''}`}>
          <div className={styles.storyBlock}>
            <p className={styles.storyText}>
              Bangkok, 2019. Terminal 21.
            </p>
            <p className={styles.storyText}>
              I met a nomad designer at Pier 21 food court. Listening to his lifestyle, his next destination,
              his freedom—something inside me sparked.
            </p>
            <p className={styles.storyText}>
              <span className={styles.highlight}>"I want to live like this."</span>
            </p>
          </div>

          <div className={styles.storyBlock}>
            <p className={styles.storyText}>
              Back in Japan, I discovered the world of digital nomads. Their vision. Their values.
              Their way of providing value from anywhere. I was hooked.
            </p>
            <p className={styles.storyText}>
              But I had <span className={styles.highlight}>no skills</span> to work online.
            </p>
          </div>

          <div className={styles.quote}>
            "So I tried everything: Video editing. Writing. SNS marketing. Design. Programming."
          </div>

          <div className={styles.storyBlock}>
            <p className={styles.storyText}>
              Then it hit me—if I wanted to build my own service someday,
              <span className={styles.highlight}> programming was the only path</span>.
            </p>
            <p className={styles.storyText}>
              I bought every course I could find. Studied relentlessly. Landed my first client.
            </p>
            <p className={styles.storyText}>
              When I delivered that first project and saw their joy, I felt it:
              <span className={styles.highlight}> This is what I want to do</span>.
            </p>
          </div>

          <div className={styles.storyBlock}>
            <p className={styles.storyText}>
              Creating value from anywhere in the world. Learning cultures, perspectives, connections.
              Sharing it all through my work.
            </p>
            <p className={styles.storyText}>
              And one day, giving back to those who helped me. Showing others that this life is possible.
            </p>
            <p className={styles.storyText}>
              <span className={styles.highlight}>That's why I'm here.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
