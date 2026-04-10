'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Play, Grid2x2, List, ChevronDown, ChevronUp } from 'lucide-react';
import type { Episode } from '@/lib/types';
import { buildEpSlug } from '@/lib/utils';

interface Props {
  episodes: Episode[];
  donghuaSlug: string;
  currentSlug?: string;
}

const PAGE = 50;

export default function EpisodeList({ episodes, donghuaSlug, currentSlug }: Props) {
  const [grid, setGrid]       = useState(true);
  const [desc, setDesc]       = useState(true);
  const [page, setPage]       = useState(0);

  const sorted = useMemo(() =>
    desc ? [...episodes].reverse() : [...episodes],
    [episodes, desc]
  );

  const totalPages = Math.ceil(sorted.length / PAGE);
  const slice      = sorted.slice(page * PAGE, (page + 1) * PAGE);

  const epSlug = (ep: Episode) => ep.slug ?? buildEpSlug(donghuaSlug, ep.episode ?? ep.number ?? 0);
  const epNum  = (ep: Episode) => ep.episode ?? ep.number ?? '?';

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium" style={{ color:'var(--muted)' }}>
          {episodes.length} episode
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDesc(d => !d)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl transition-all"
            style={{ background:'var(--ink3)', color:'var(--muted)', border:'1px solid var(--ink5)' }}
          >
            {desc ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            {desc ? 'Terbaru' : 'Terlama'}
          </button>
          <div className="flex rounded-xl overflow-hidden" style={{ border:'1px solid var(--ink5)' }}>
            <button
              onClick={() => setGrid(true)}
              className="p-2 transition-all"
              style={{ background: grid ? 'rgba(0,212,255,0.15)' : 'var(--ink3)', color: grid ? 'var(--cyan)' : 'var(--muted)' }}
            >
              <Grid2x2 size={14} />
            </button>
            <button
              onClick={() => setGrid(false)}
              className="p-2 transition-all"
              style={{ background: !grid ? 'rgba(0,212,255,0.15)' : 'var(--ink3)', color: !grid ? 'var(--cyan)' : 'var(--muted)' }}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Pagination tabs */}
      {totalPages > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Array.from({ length: totalPages }).map((_, i) => {
            const start = i * PAGE + 1;
            const end   = Math.min((i + 1) * PAGE, episodes.length);
            return (
              <button key={i} onClick={() => setPage(i)}
                className="text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
                style={page === i
                  ? { background:'var(--cyan)', color:'#000' }
                  : { background:'var(--ink3)', color:'var(--muted)', border:'1px solid var(--ink5)' }
                }>
                {start}–{end}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {grid ? (
        <div className="grid gap-1.5" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(52px, 1fr))' }}>
          {slice.map((ep, i) => {
            const slug    = epSlug(ep);
            const active  = currentSlug === slug;
            return (
              <Link key={i} href={"/watch/" + slug}
                className="aspect-square rounded-xl flex items-center justify-center text-xs font-bold relative group transition-all"
                style={active
                  ? { background:'var(--cyan)', color:'#000', boxShadow:'0 0 12px rgba(0,212,255,0.4)' }
                  : { background:'var(--ink3)', color:'var(--muted)', border:'1px solid var(--ink5)' }
                }>
                {epNum(ep)}
                {!active && (
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background:'rgba(0,212,255,0.2)' }}>
                    <Play size={12} fill="var(--cyan)" style={{ color:'var(--cyan)' }} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        /* List */
        <div className="space-y-2">
          {slice.map((ep, i) => {
            const slug   = epSlug(ep);
            const active = currentSlug === slug;
            return (
              <Link key={i} href={"/watch/" + slug}
                className="flex items-center gap-3 p-3 rounded-xl group transition-all"
                style={active
                  ? { background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)' }
                  : { background:'var(--ink3)', border:'1px solid var(--ink5)' }
                }>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                  style={active
                    ? { background:'var(--cyan)', color:'#000' }
                    : { background:'var(--ink4)', color:'var(--muted)' }
                  }>
                  {epNum(ep)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white clamp-1">
                    {ep.title ?? ep.judul ?? `Episode ${epNum(ep)}`}
                  </p>
                  {(ep.date ?? ep.tanggal) && (
                    <p className="text-xs mt-0.5" style={{ color:'var(--muted)' }}>{ep.date ?? ep.tanggal}</p>
                  )}
                </div>
                <Play size={13} style={{ color: active ? 'var(--cyan)' : 'var(--faint)' }} className="flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
