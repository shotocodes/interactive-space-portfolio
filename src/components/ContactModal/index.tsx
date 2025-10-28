// components/ContactModal/index.tsx
'use client';

import { useEffect, useState } from 'react';
import ParticleMorphing from './ParticleMorphing';
import ContactSettingsPanel from './ContactSettingsPanel';
import styles from './ContactModal.module.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [shapeType, setShapeType] = useState<'cone' | 'ring'>('cone');
  const [particleCount, setParticleCount] = useState(15000);
  const [warpMode, setWarpMode] = useState(false);
  const [magneticMode, setMagneticMode] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const fullText = 'Start Your Project';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // メール送信ロジック（後で実装）
    console.log('Form submitted:', formData);
    alert('Thank you for your message! I will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const faqs = [
    {
      question: 'What is your typical project timeline?',
      answer: 'Most projects take 2-8 weeks depending on complexity. We will provide a detailed timeline during our initial consultation.'
    },
    {
      question: 'Do you offer ongoing support?',
      answer: 'Yes! All projects include 1-3 months of post-launch support. Extended maintenance packages are also available.'
    },
    {
      question: 'What information do you need to get started?',
      answer: 'Just share your project goals, timeline, and budget. We will handle the rest through our structured discovery process.'
    },
    {
      question: 'Can you work with my existing team?',
      answer: 'Absolutely! I collaborate seamlessly with designers, developers, and project managers to bring your vision to life.'
    }
  ];

  if (!isOpen) return null;

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
          <ContactSettingsPanel
            shapeType={shapeType}
            onShapeToggle={() => setShapeType(shapeType === 'cone' ? 'ring' : 'cone')}
            particleCount={particleCount}
            onParticleCountChange={setParticleCount}
            warpMode={warpMode}
            onWarpToggle={() => setWarpMode(!warpMode)}
            magneticMode={magneticMode}
            onMagneticToggle={() => setMagneticMode(!magneticMode)}
          />
        )}

        {/* ページタイトル */}
        <div className={styles.pageTitle}>Contact</div>

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
                morphToRing={shapeType === 'ring'}
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

          {/* Contact Form Section */}
          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Get In Touch</h2>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="Project inquiry"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.formTextarea}
                    placeholder="Tell me about your project..."
                    rows={6}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitButton}>
                  Send Message →
                </button>
              </form>
            </div>
          </section>

          {/* Contact Info Section */}
          <section className={styles.section + ' ' + styles.darkSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Connect With Me</h2>
              <div className={styles.contactInfoGrid}>
                <div className={styles.contactInfoCard}>
                  <div className={styles.contactIcon}>📧</div>
                  <h3 className={styles.contactInfoTitle}>Email</h3>
                  <a href="mailto:your-email@example.com" className={styles.contactInfoLink}>
                    your-email@example.com
                  </a>
                </div>

                <div className={styles.contactInfoCard}>
                  <div className={styles.contactIcon}>💼</div>
                  <h3 className={styles.contactInfoTitle}>LinkedIn</h3>
                  <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.contactInfoLink}>
                    Connect on LinkedIn
                  </a>
                </div>

                <div className={styles.contactInfoCard}>
                  <div className={styles.contactIcon}>🐙</div>
                  <h3 className={styles.contactInfoTitle}>GitHub</h3>
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={styles.contactInfoLink}>
                    View My Work
                  </a>
                </div>

                <div className={styles.contactInfoCard}>
                  <div className={styles.contactIcon}>𝕏</div>
                  <h3 className={styles.contactInfoTitle}>X (Twitter)</h3>
                  <a href="https://x.com/yourusername" target="_blank" rel="noopener noreferrer" className={styles.contactInfoLink}>
                    @yourusername
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <div className={styles.faqList}>
                {faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.question}</h3>
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location/Availability Section */}
          <section className={styles.section + ' ' + styles.darkSection}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Availability</h2>
              <div className={styles.availabilityContent}>
                <div className={styles.availabilityCard}>
                  <div className={styles.availabilityIcon}>🌏</div>
                  <h3 className={styles.availabilityTitle}>Location</h3>
                  <p className={styles.availabilityText}>
                    Based in Japan<br />
                    Remote work worldwide
                  </p>
                </div>

                <div className={styles.availabilityCard}>
                  <div className={styles.availabilityIcon}>⏰</div>
                  <h3 className={styles.availabilityTitle}>Timezone</h3>
                  <p className={styles.availabilityText}>
                    JST (UTC+9)<br />
                    Flexible scheduling
                  </p>
                </div>

                <div className={styles.availabilityCard}>
                  <div className={styles.availabilityIcon}>✨</div>
                  <h3 className={styles.availabilityTitle}>Status</h3>
                  <p className={styles.availabilityText}>
                    <span className={styles.statusBadge}>Available for Projects</span><br />
                    Response within 24 hours
                  </p>
                </div>
              </div>

              <div className={styles.ctaSection}>
                <p className={styles.ctaText}>
                  Ready to bring your vision to life?<br />
                  Let's create something amazing together.
                </p>
                <button className={styles.ctaButton} onClick={() => {
                  document.querySelector(`.${styles.contactForm}`)?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Start a Conversation →
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
