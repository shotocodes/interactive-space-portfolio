// lib/data/planetData.ts
import { PlanetData, ActionPlanetData } from '@/types';

export const planetData: PlanetData[] = [
  {
    name: "About",
    description: "私について、経歴、スキルセットなどをご紹介します",
    color: 0xff6b6b,
    size: 0.32,
    link: "#about"
  },
  {
    name: "Projects",
    description: "これまでに手がけたプロジェクトと実績をご覧ください",
    color: 0x4ecdc4,
    size: 0.4,
    link: "#projects"
  },
  {
    name: "Services",
    description: "技術スタック、ツール、専門分野について詳しく説明します",
    color: 0x45b7d1,
    size: 0.35,
    link: "#services"
  },
  {
    name: "Contact",
    description: "お仕事のご依頼、ご相談はこちらからお気軽にどうぞ",
    color: 0x96ceb4,
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
    description: "私のソーシャルメディアアカウントをご覧いただけます。最新の活動状況や日々の気づきをシェアしています。",
    color: 0x1da1f2,
    size: 0.2,
    action: "sns",
    links: [
      { name: "Twitter", url: "https://twitter.com/your_twitter" },
      { name: "LinkedIn", url: "https://linkedin.com/in/your_linkedin" },
      { name: "Instagram", url: "https://instagram.com/your_instagram" }
    ]
  },
  {
    name: "Blog & Articles",
    description: "技術記事、開発に関する学びや経験をまとめたブログです。最新のテクノロジーや開発手法について発信しています。",
    color: 0xff6b35,
    size: 0.2,
    action: "blog",
    links: [
      { name: "技術ブログ", url: "https://your-tech-blog.com" },
      { name: "Qiita", url: "https://qiita.com/your_qiita" },
      { name: "Zenn", url: "https://zenn.dev/your_zenn" }
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
