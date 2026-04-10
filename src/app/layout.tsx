import type { Metadata } from 'next';
import './globals.css';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: { default: 'DonghuaVerse', template: '%s · DonghuaVerse' },
  description: 'Streaming donghua subtitle Indonesia — update harian',
  themeColor: '#08080f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <TopBar />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
