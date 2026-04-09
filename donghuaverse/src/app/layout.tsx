import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'DonghuaVerse — Nonton Donghua Sub Indo',
    template: '%s | DonghuaVerse',
  },
  description: 'Nonton donghua (anime China) subtitle Indonesia terlengkap. Update terbaru setiap hari.',
  keywords: ['donghua', 'anime china', 'sub indo', 'nonton online', 'streaming'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
