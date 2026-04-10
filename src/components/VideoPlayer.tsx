'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, ExternalLink, RotateCcw } from 'lucide-react';

interface Props { src: string; title: string; episodeSlug: string; donghuaTitle?: string; cover?: string; }

export default function VideoPlayer({ src, title, episodeSlug, donghuaTitle, cover }: Props) {
  const [err, setErr] = useState(false);

  /* simpan ke history */
  useEffect(() => {
    if (!src) return;
    try {
      const epNum = episodeSlug.match(/episode[- ](\d+)/i)?.[1] ?? '?';
      const raw   = localStorage.getItem('dv_watch_history');
      const list  = raw ? JSON.parse(raw) : [];
      const donghuaSlug = episodeSlug.replace(/-episode-\d+$/i, '');
      const entry = {
        epSlug: episodeSlug,
        donghuaSlug,
        title: donghuaTitle ?? donghuaSlug.replace(/-/g,' '),
        cover: cover ?? '/placeholder.jpg',
        epNum,
        ts: Date.now(),
      };
      const filtered = list.filter((x: { epSlug: string }) => x.epSlug !== episodeSlug);
      localStorage.setItem('dv_watch_history', JSON.stringify([entry, ...filtered].slice(0, 20)));
    } catch {}
  }, [episodeSlug, src, donghuaTitle, cover]);

  if (!src) {
    return (
      <div className="rounded-2xl flex items-center justify-center py-16"
        style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
        <div className="text-center">
          <AlertCircle size={36} className="mx-auto mb-3" style={{ color:'var(--muted)' }} />
          <p className="text-sm font-medium text-white">Link streaming tidak tersedia</p>
          <p className="text-xs mt-1" style={{ color:'var(--muted)' }}>Coba episode lain</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-2xl flex items-center justify-center py-12"
        style={{ background:'var(--ink3)', border:'1px solid rgba(255,68,102,0.3)' }}>
        <div className="text-center px-6">
          <AlertCircle size={36} className="mx-auto mb-3" style={{ color:'var(--rose)' }} />
          <p className="text-sm font-semibold text-white mb-1">Gagal memuat video</p>
          <div className="flex items-center gap-2 justify-center mt-3">
            <button onClick={() => setErr(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background:'var(--ink4)', color:'var(--text)' }}>
              <RotateCcw size={13} />Coba lagi
            </button>
            <a href={src} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background:'var(--cyan)', color:'#000' }}>
              <ExternalLink size={13} />Buka Langsung
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid var(--ink5)', boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
      <div className="video-wrap">
        <iframe src={src} title={title} allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          onError={() => setErr(true)} />
      </div>
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background:'var(--ink3)', borderTop:'1px solid var(--ink5)' }}>
        <span className="text-xs font-medium" style={{ color:'var(--muted)' }}>{title}</span>
        <a href={src} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color:'var(--muted)' }}>
          <ExternalLink size={11} />Tab baru
        </a>
      </div>
    </div>
  );
}
