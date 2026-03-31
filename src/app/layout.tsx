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

export const metadata: Metadata = {
  title: 'Shoto Moriyama | Web Developer & Designer',
  description: 'Full-stack web developer and designer based in Tokyo & Bangkok. Specializing in Next.js, React, Three.js, and modern web experiences. Design × Development × Automation.',
  keywords: ['web developer', 'web designer', 'freelance', 'Next.js', 'React', 'Three.js', 'TypeScript', 'portfolio'],
  authors: [{ name: 'Shoto Moriyama' }],
  creator: 'Shoto Moriyama',
  publisher: 'Shoto Moriyama',

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shoto.tech',
    siteName: 'Shoto Moriyama Portfolio',
    title: 'Shoto Moriyama | Web Developer & Designer',
    description: 'Full-stack web developer and designer. Design × Development × Automation.',
    images: [
      {
        url: 'https://shoto.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shoto Moriyama - Web Developer & Designer',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Shoto Moriyama | Web Developer & Designer',
    description: 'Full-stack web developer and designer. Design × Development × Automation.',
    images: ['https://shoto.tech/og-image.png'],
    creator: '@ShotoMoriyama',
  },

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
    <html lang="en" suppressHydrationWarning>
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
