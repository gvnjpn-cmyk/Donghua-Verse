import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

const LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/browse', label: 'Browse' },
  { href: '/jadwal', label: 'Jadwal' },
  { href: '/search', label: 'Cari' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-display text-white shadow-glow-sm">
              D
            </div>
            <div>
              <p className="font-display text-lg text-white tracking-widest">
                DONGHUA<span className="text-primary">VERSE</span>
              </p>
              <p className="text-xs text-text-muted">Nonton donghua sub indo gratis</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-faint leading-relaxed max-w-2xl mx-auto">
            DonghuaVerse tidak menyimpan konten video apapun. Semua konten bersumber dari layanan
            pihak ketiga melalui OrbitCloud API. Hak cipta sepenuhnya milik pemilik asli.
          </p>
          <p className="flex items-center justify-center gap-1 text-xs text-text-faint mt-3">
            Dibuat dengan <Heart size={12} className="text-primary" fill="#e63946" /> menggunakan Next.js & OrbitCloud API
          </p>
        </div>
      </div>
    </footer>
  );
}
