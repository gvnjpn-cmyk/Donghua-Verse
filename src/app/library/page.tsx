'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2 } from 'lucide-react';

interface SavedItem { slug: string; title: string; cover: string; ts: number; }

export default function LibraryPage() {
  const [items, setItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dv_library');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const remove = (slug: string) => {
    const updated = items.filter(i => i.slug !== slug);
    setItems(updated);
    localStorage.setItem('dv_library', JSON.stringify(updated));
  };

  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark size={20} style={{ color:'var(--cyan)' }} />
          <h1 className="font-display font-bold text-2xl text-white">LIBRARY</h1>
        </div>
        <p className="text-xs" style={{ color:'var(--muted)' }}>Donghua yang kamu simpan</p>
      </div>

      {!items.length ? (
        <div className="mx-4 rounded-2xl p-12 text-center" style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
          <Bookmark size={40} className="mx-auto mb-3" style={{ color:'var(--faint)' }} />
          <p className="font-medium text-white mb-1">Library kosong</p>
          <p className="text-sm" style={{ color:'var(--muted)' }}>Simpan donghua dari halaman detail</p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {items.sort((a,b)=>b.ts-a.ts).map(item => (
            <div key={item.slug} className="flex items-center gap-3 p-3 rounded-2xl group"
              style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
              <Link href={"/donghua/" + item.slug} className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative rounded-xl overflow-hidden flex-shrink-0" style={{ width:52, height:74 }}>
                  <Image src={item.cover||'/placeholder.jpg'} alt={item.title} fill className="object-cover" sizes="52px" />
                </div>
                <p className="text-sm font-semibold text-white clamp-2">{item.title}</p>
              </Link>
              <button onClick={() => remove(item.slug)}
                className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                style={{ background:'rgba(255,68,102,0.1)', color:'var(--rose)' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
