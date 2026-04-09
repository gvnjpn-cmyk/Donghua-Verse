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
  themeColor: '#070710',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="noise-overlay">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
