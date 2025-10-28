// components/AboutModal/ConnectSection.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './ConnectSection.module.css';

export default function ConnectSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const fullText = 'Thanks for Stopping By';

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
      <div className={styles.container}>
        {/* タイプライターテキスト */}
        <h1 className={styles.typewriterHeading}>
          {displayedText}
          <span className={`${styles.cursor} ${isTypingComplete ? styles.cursorBlink : ''}`}>|</span>
        </h1>

        {/* セクションタイトル */}
        <h2 className={`${styles.sectionTitle} ${isTypingComplete ? styles.fadeIn : ''}`}>
          Stay Connected
        </h2>

        {/* メッセージ */}
        <div className={`${styles.messageContent} ${isTypingComplete ? styles.fadeIn : ''}`}>
          <p className={styles.messageText}>
            Thanks for reading my story.
          </p>
          <p className={styles.messageText}>
            Follow me on social media to see what I'm building next.
          </p>

          <p className={styles.messageTextJa}>
            ここまで見てくれてありがとうございます。
          </p>
          <p className={styles.messageTextJa}>
            これからの活動はSNSで発信していきます。
          </p>
        </div>

        {/* SNSリンク */}
        <div className={`${styles.socialGrid} ${isTypingComplete ? styles.fadeIn : ''}`}>
          <a
            href="https://x.com/SOAR_C72"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            X (Twitter)
          </a>
          <a
            href="https://github.com/shotocodes"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            GitHub
          </a>
          <a
            href="https://www.instagram.com/sh0t0x72/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Instagram
          </a>
          <a
            href="https://sho-tolog.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Blog
          </a>
        </div>
      </div>
    </section>
  );
}
