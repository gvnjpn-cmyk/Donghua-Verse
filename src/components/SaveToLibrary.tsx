'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface Props { slug: string; title: string; cover: string; }

export default function SaveToLibrary({ slug, title, cover }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const lib = JSON.parse(localStorage.getItem('dv_library') ?? '[]');
      setSaved(lib.some((i: { slug: string }) => i.slug === slug));
    } catch {}
  }, [slug]);

  const toggle = () => {
    try {
      const lib = JSON.parse(localStorage.getItem('dv_library') ?? '[]');
      let updated;
      if (saved) {
        updated = lib.filter((i: { slug: string }) => i.slug !== slug);
      } else {
        updated = [{ slug, title, cover, ts: Date.now() }, ...lib];
      }
      localStorage.setItem('dv_library', JSON.stringify(updated));
      setSaved(!saved);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
      style={saved
        ? { background:'rgba(0,212,255,0.15)', border:'1px solid rgba(0,212,255,0.4)', color:'var(--cyan)' }
        : { background:'var(--ink3)', border:'1px solid var(--ink5)', color:'var(--muted)' }
      }
      title={saved ? 'Hapus dari Library' : 'Simpan ke Library'}
    >
      {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>
  );
}
