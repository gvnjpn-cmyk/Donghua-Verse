'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle size={48} className="text-primary mb-4" />
      <h2 className="font-display text-3xl text-white tracking-wide mb-2">TERJADI KESALAHAN</h2>
      <p className="text-text-muted text-sm mb-6 max-w-sm">
        {error.message || 'Gagal memuat halaman. Coba lagi.'}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all shadow-glow-sm"
      >
        <RefreshCw size={16} />
        Coba Lagi
      </button>
    </div>
  );
}
