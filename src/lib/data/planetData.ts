// lib/data/planetData.ts
import { PlanetData, ActionPlanetData } from '@/types';

export const planetData: PlanetData[] = [
  {
    name: "About",
    description: "私について、経歴、スキルセットなどをご紹介します",
    color: 0xff6b6b,  // 赤ピンク（変更なし）
    size: 0.32,
    link: "#about"
  },
  {
    name: "Projects",
    description: "これまでに手がけたプロジェクトと実績をご覧ください",
    color: 0xff9500,  // オレンジ（旧: 0x4ecdc4 シアン）
    size: 0.4,
    link: "#projects"
  },
  {
    name: "Services",
    description: "技術スタック、ツール、専門分野について詳しく説明します",
    color: 0x00d4ff,  // 明るい青（旧: 0x45b7d1 青）
    size: 0.35,
    link: "#services"
  },
  {
    name: "Contact",
    description: "お仕事のご依頼、ご相談はこちらからお気軽にどうぞ",
    color: 0x00ff88,  // 明るい緑（旧: 0x96ceb4 緑）
    size: 0.29,
    link: "#contact"
  }
];

export const actionPlanetData: ActionPlanetData[] = [
  {
    name: "Controls",
    description: "システムの設定とコントロールパネルを開きます。惑星の軌道速度、サイズ、太陽の設定などをカスタマイズできます。",
    color: 0xe6ff2b,
    size: 0.2,
    action: "controls"
  },
  {
    name: "SNS Links",
    description: "Connect with me on social media. Stay updated on my latest activities and insights.",
    color: 0x1da1f2,
    size: 0.2,
    action: "sns",
    links: [
      { name: "X (Twitter)", url: "https://x.com/ShotoMoriyama" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/shotomoriyama/" },
      { name: "Instagram", url: "https://www.instagram.com/sh0t0x72/" },
      { name: "GitHub", url: "https://github.com/shotocodes" }
    ]
  },
  {
    name: "Blog & Articles",
    description: "Read my technical articles and development insights. Sharing knowledge about latest technologies and methodologies.",
    color: 0xff6b35,
    size: 0.2,
    action: "blog",
    links: [
      { name: "Sho-tolog", url: "https://sho-tolog.com/" },
      { name: "note", url: "https://note.com/sh0t0" }
    ]
  }
];

export const defaultConfig = {
  orbitSpeed: 0.4,
  orbitRadius: 7,
  actionOrbitRadius: 4,
  sunSize: 1,
  sunParticleCount: 1000,
  planetCount: 4,
  actionPlanetCount: 3
};
