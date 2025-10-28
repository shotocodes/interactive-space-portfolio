// lib/data/languageData.ts
import { LanguageData } from '@/types';

export const languageData: LanguageData = {
  ja: {
    mainTitle: "SHOTO MORIYAMA",
    mainSubtitle: "Navigate through the universe",

    planets: {
      about: {
        name: "About",
        description: "私について、経歴、スキルセットなどをご紹介します"
      },
      projects: {
        name: "Projects",
        description: "これまでに手がけたプロジェクトと実績をご覧ください"
      },
      services: {
        name: "Services",
        description: "技術スタック、ツール、専門分野について詳しく説明します"
      },
      contact: {
        name: "Contact",
        description: "お仕事のご依頼、ご相談はこちらからお気軽にどうぞ"
      }
    },

    actions: {
      controls: {
        name: "Controls",
        description: "システムの設定とコントロールパネルを開きます。惑星の軌道速度、サイズ、太陽の設定などをカスタマイズできます。"
      },
      sns: {
        name: "SNS Links",
        description: "私のソーシャルメディアアカウントをご覧いただけます。最新の活動状況や日々の気づきをシェアしています。"
      },
      blog: {
        name: "Blog & Articles",
        description: "技術記事、開発に関する学びや経験をまとめたブログです。最新のテクノロジーや開発手法について発信しています。"
      }
    },

    ui: {
      settings: "設定",
      language: "言語",
      close: "閉じる",
      viewDetails: "詳細を見る",
      orbitSpeed: "回転速度",
      orbitSize: "軌道サイズ",
      sunSize: "太陽サイズ",
      sunParticles: "太陽粒子数",
      selectPlanet: "惑星を選択",
      hoverInstruction: "惑星にホバーして詳細を確認"
    }
  },

  en: {
    mainTitle: "SHOTO MORIYAMA",
    mainSubtitle: "Navigate through the universe",

    planets: {
      about: {
        name: "About",
        description: "Learn about my background, career journey, and skill set"
      },
      projects: {
        name: "Projects",
        description: "Explore my portfolio of projects and achievements"
      },
      services: {
        name: "Services",
        description: "Discover my technical expertise, tools, and specialized areas"
      },
      contact: {
        name: "Contact",
        description: "Get in touch for collaboration opportunities and inquiries"
      }
    },

    actions: {
      controls: {
        name: "Controls",
        description: "Access system settings and control panel. Customize planet orbit speeds, sizes, and solar configurations."
      },
      sns: {
        name: "Social Links",
        description: "Connect with me on social media platforms. Stay updated on my latest activities and insights."
      },
      blog: {
        name: "Blog & Articles",
        description: "Read my technical articles and development insights. Sharing knowledge about latest technologies and methodologies."
      }
    },

    ui: {
      settings: "Settings",
      language: "Language",
      close: "Close",
      viewDetails: "View Details",
      orbitSpeed: "Orbit Speed",
      orbitSize: "Orbit Size",
      sunSize: "Sun Size",
      sunParticles: "Sun Particles",
      selectPlanet: "Select Planet",
      hoverInstruction: "Hover over planets for details"
    }
  }
};
