'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface Props {
  initialQuery?: string;
}

export default function SearchForm({ initialQuery = '' }: Props) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-xl">
      <div className="relative flex-1">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul donghua..."
          className="w-full bg-bg-card border border-border focus:border-primary rounded-full px-5 py-3 pl-11 text-text text-sm outline-none transition-colors placeholder-text-faint"
          autoFocus
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
          >
            <X size={15} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-all shadow-glow-sm hover:shadow-glow-red"
      >
        Cari
      </button>
    </form>
  );
}
