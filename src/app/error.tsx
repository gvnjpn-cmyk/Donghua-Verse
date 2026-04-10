'use client';
import { AlertTriangle, RefreshCw } from 'lucide-react';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <AlertTriangle size={44} className="mb-4" style={{ color:'var(--rose)' }} />
      <h2 className="font-display font-bold text-2xl text-white mb-2">TERJADI KESALAHAN</h2>
      <p className="text-sm mb-6" style={{ color:'var(--muted)' }}>Gagal memuat halaman. Coba lagi.</p>
      <button onClick={reset}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm"
        style={{ background:'var(--cyan)', color:'#000' }}>
        <RefreshCw size={15} />Coba Lagi
      </button>
    </div>
  );
}
