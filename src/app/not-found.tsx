import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="font-display text-9xl text-primary/20 leading-none mb-4">404</div>
      <h1 className="font-display text-3xl text-white tracking-wide mb-2">HALAMAN TIDAK DITEMUKAN</h1>
      <p className="text-text-muted text-sm mb-8 max-w-sm">
        Donghua yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all shadow-glow-sm"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
