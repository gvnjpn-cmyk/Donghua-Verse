'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Tv2, Calendar, Flame, Home } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/jadwal', label: 'Jadwal', icon: Calendar },
  { href: '/browse', label: 'Browse', icon: Tv2 },
  { href: '/populer', label: 'Populer', icon: Flame },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setQuery('');
    setShowSearch(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/96 backdrop-blur-xl border-b border-border shadow-[0_1px_20px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-display text-white text-lg shadow-glow-sm group-hover:shadow-glow-red transition-shadow duration-300">
              D
            </div>
            <span className="font-display text-xl text-white tracking-[0.15em] hidden sm:block">
              DONGHUA<span className="text-primary">VERSE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-text hover:bg-bg-hover'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: search + mobile menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showSearch ? (
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-bg-card border border-primary/40 rounded-full overflow-hidden shadow-glow-sm"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari donghua..."
                  className="bg-transparent text-text text-sm px-4 py-2 w-40 sm:w-56 md:w-72 outline-none placeholder-text-faint"
                />
                <button type="submit" className="p-2.5 text-text-muted hover:text-primary transition-colors">
                  <Search size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => { setShowSearch(false); setQuery(''); }}
                  className="p-2.5 text-text-muted hover:text-text transition-colors pr-3"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2.5 rounded-full text-text-muted hover:text-white hover:bg-bg-hover transition-all"
                aria-label="Cari"
              >
                <Search size={20} />
              </button>
            )}

            <button
              className="md:hidden p-2.5 rounded-full text-text-muted hover:text-white hover:bg-bg-hover transition-all"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-border bg-bg-secondary/95 backdrop-blur-xl pb-4 animate-fade-in">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 px-4 pt-3 pb-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari donghua..."
                className="flex-1 bg-bg-card border border-border text-text text-sm px-4 py-2 rounded-full outline-none placeholder-text-faint focus:border-primary transition-colors"
              />
              <button type="submit" className="p-2.5 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors">
                <Search size={15} />
              </button>
            </form>

            {/* Nav links */}
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-b border-border/50 last:border-0 ${
                  pathname === href ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-white hover:bg-bg-hover'
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
