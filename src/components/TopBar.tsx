'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Bell } from 'lucide-react';

export default function TopBar() {
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ(''); setSearching(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink/95 backdrop-blur-xl border-b border-ink5/50' : 'bg-transparent'
      }`}
      style={{ height: 60 }}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-2xl mx-auto">

        {searching ? (
          /* ── Search mode ── */
          <form onSubmit={submit} className="flex items-center gap-2 flex-1 animate-slide-x">
            <div className="flex-1 flex items-center bg-ink3 border border-cyan/40 rounded-xl px-3 py-2 gap-2 shadow-cyan-sm">
              <Search size={15} className="text-cyan flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Cari donghua..."
                className="flex-1 bg-transparent text-sm text-text outline-none placeholder-muted"
                style={{ color: 'var(--text)' }}
              />
            </div>
            <button
              type="button"
              onClick={() => { setSearching(false); setQ(''); }}
              className="w-9 h-9 rounded-xl bg-ink3 border border-ink5 flex items-center justify-center text-muted hover:text-text transition-colors"
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          /* ── Normal mode ── */
          <>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold text-black"
                style={{ background: 'var(--cyan)', boxShadow: '0 0 12px rgba(0,212,255,0.5)' }}>
                DV
              </div>
              <span className="font-display font-bold text-base tracking-widest"
                style={{ color: 'var(--cyan)' }}>
                DONGHUA<span className="text-text">VERSE</span>
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearching(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-cyan transition-colors hover:bg-ink3"
              >
                <Search size={19} />
              </button>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-cyan transition-colors hover:bg-ink3 relative">
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
