import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="font-display font-black text-8xl mb-2"
        style={{ color:'var(--ink4)', WebkitTextStroke:'2px var(--ink5)' }}>
        404
      </div>
      <h1 className="font-display font-bold text-2xl text-white mb-2">HALAMAN TIDAK DITEMUKAN</h1>
      <p className="text-sm mb-8" style={{ color:'var(--muted)' }}>
        Donghua yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all"
        style={{ background:'var(--cyan)', color:'#000', boxShadow:'0 0 20px rgba(0,212,255,0.3)' }}>
        <Home size={16} />Kembali ke Beranda
      </Link>
    </div>
  );
}
