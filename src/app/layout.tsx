// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

// Viewport設定（Next.js 14+の推奨方法）
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Metadata設定（OGP含む）
export const metadata: Metadata = {
  title: 'Shoto Moriyama | Interactive Space Portfolio',
  description: 'Solar System Portfolio - 地動説をコンセプトにしたインタラクティブポートフォリオ。Web開発、デザイン、技術スキルを宇宙空間で表現。',
  keywords: ['ポートフォリオ', 'Web開発', 'フロントエンド', 'Three.js', 'Next.js', 'インタラクティブ'],
  authors: [{ name: 'Shoto Moriyama' }],
  creator: 'Shoto Moriyama',
  publisher: 'Shoto Moriyama',

  // OGP設定（絶対URLに変更）
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://shoto.tech',
    siteName: 'Shoto Moriyama Portfolio',
    title: 'Shoto Moriyama | Interactive Space Portfolio',
    description: 'Solar System Portfolio - 地動説をコンセプトにしたインタラクティブポートフォリオ',
    images: [
      {
        url: 'https://shoto.tech/og-image.png', // 絶対URLに変更
        width: 1200,
        height: 630,
        alt: 'Shoto Moriyama Portfolio - Solar System',
      },
    ],
  },

  // Twitter Card（絶対URLに変更）
  twitter: {
    card: 'summary_large_image',
    title: 'Shoto Moriyama | Interactive Space Portfolio',
    description: 'Solar System Portfolio - 地動説をコンセプトにしたインタラクティブポートフォリオ',
    images: ['https://shoto.tech/og-image.png'], // 絶対URLに変更
  },

  // その他
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Orbitron:wght@400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
