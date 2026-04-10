'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl"
        style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
        <Search size={16} style={{ color:'var(--muted)' }} className="flex-shrink-0" />
        <input type="text" value={q} onChange={e => setQ(e.target.value)}
          placeholder="Cari judul donghua..."
          className="flex-1 bg-transparent text-sm outline-none placeholder-muted"
          style={{ color:'var(--text)' }} autoFocus />
        {q && (
          <button type="button" onClick={() => setQ('')}>
            <X size={14} style={{ color:'var(--muted)' }} />
          </button>
        )}
      </div>
      <button type="submit"
        className="px-5 py-3 rounded-2xl text-sm font-bold transition-all"
        style={{ background:'var(--cyan)', color:'#000' }}>
        Cari
      </button>
    </form>
  );
}
