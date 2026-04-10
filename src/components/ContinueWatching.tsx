'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Play } from 'lucide-react';

interface WatchItem {
  epSlug: string;
  donghuaSlug: string;
  title: string;
  cover: string;
  epNum: number | string;
  ts: number;
}

export default function ContinueWatching() {
  const [history, setHistory] = useState<WatchItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dv_watch_history');
      if (raw) {
        const parsed = JSON.parse(raw) as WatchItem[];
        setHistory(parsed.sort((a, b) => b.ts - a.ts).slice(0, 6));
      }
    } catch {}
  }, []);

  if (!history.length) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="glow-line font-display font-bold text-lg text-white flex items-center gap-2">
          <Play size={15} style={{ color:'var(--cyan)' }} />
          Lanjutkan Nonton
        </h2>
        <button
          onClick={() => { localStorage.removeItem('dv_watch_history'); setHistory([]); }}
          className="text-xs transition-colors"
          style={{ color:'var(--muted)' }}
        >
          Hapus History
        </button>
      </div>

      <div className="pl-4 scroll-x gap-3">
        {history.map((item) => (
          <Link
            key={item.epSlug}
            href={`/watch/${item.epSlug}`}
            className="relative flex-shrink-0 rounded-2xl overflow-hidden group"
            style={{ width: 200, height: 120 }}
          >
            <Image
              src={item.cover || '/placeholder.jpg'}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="200px"
            />
            <div className="absolute inset-0 grad-b" />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background:'rgba(0,212,255,0.85)', boxShadow:'0 0 16px rgba(0,212,255,0.5)' }}>
                <Play size={16} fill="#000" className="text-black ml-0.5" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <p className="text-[11px] font-semibold text-white clamp-1">{item.title}</p>
              <p className="text-[10px] mt-0.5 font-medium" style={{ color:'var(--cyan)' }}>
                Episode {item.epNum}
              </p>
            </div>
          </Link>
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </section>
  );
}
