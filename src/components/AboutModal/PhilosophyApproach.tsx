// components/AboutModal/PhilosophyApproach.tsx
'use client';

import styles from './PhilosophyApproach.module.css';

interface PhilosophyApproachProps {
  language: 'en' | 'ja';
}

export default function PhilosophyApproach({ language }: PhilosophyApproachProps) {
  const philosophyCards = language === 'en' ? [
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
  ] : [
    {
      icon: '🌐',
      title: '場所に依存しない',
      description: 'デジタルノマド時代のために構築。いつでも、どこでも、誰とでも仕事ができます。'
    },
    {
      icon: '⚙️',
      title: '労働よりシステム',
      description: '自動化優先の開発。燃え尽きることなくスケールします。'
    },
    {
      icon: '📈',
      title: '時間より価値',
      description: '結果重視のアプローチ。あなたの成功が私の成功です。'
    }
  ];

  const sectionTitle = language === 'en' ? 'My Approach' : '私のアプローチ';

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* セクションタイトル */}
        <h2 className={styles.sectionTitle}>{sectionTitle}</h2>

        {/* 哲学カードグリッド */}
        <div className={styles.cardGrid}>
          {philosophyCards.map((card, index) => (
            <div
              key={index}
              className={styles.card}
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
