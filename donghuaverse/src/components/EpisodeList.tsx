'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Play, Grid, List } from 'lucide-react';
import type { Episode } from '@/lib/types';
import { buildEpSlug } from '@/lib/utils';

interface Props {
  episodes: Episode[];
  donghuaSlug: string;
  currentSlug?: string;
}

const PAGE_SIZE = 50;

export default function EpisodeList({ episodes, donghuaSlug, currentSlug }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(0);
  const [reversed, setReversed] = useState(false);

  const sorted = useMemo(
    () => (reversed ? [...episodes].reverse() : episodes),
    [episodes, reversed]
  );

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getEpSlug = (ep: Episode) =>
    ep.slug || buildEpSlug(donghuaSlug, ep.episode ?? ep.number ?? 0);

  const getEpNum = (ep: Episode) => ep.episode ?? ep.number ?? '?';

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-sm">{episodes.length} Episode</span>
          <button
            onClick={() => setReversed((r) => !r)}
            className="text-xs px-3 py-1 rounded-full border border-border hover:border-primary/40 text-text-muted hover:text-text transition-all"
          >
            {reversed ? '↑ Terbaru' : '↓ Terlama'}
          </button>
        </div>

        <div className="flex items-center gap-1 bg-bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:text-text'}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Pagination tabs (kalau banyak episode) */}
      {totalPages > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from({ length: totalPages }).map((_, i) => {
            const start = i * PAGE_SIZE + 1;
            const end = Math.min((i + 1) * PAGE_SIZE, episodes.length);
            return (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  page === i
                    ? 'bg-primary border-primary text-white'
                    : 'border-border text-text-muted hover:border-border-light hover:text-text'
                }`}
              >
                {start}–{end}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {paginated.map((ep, i) => {
            const epSlug = getEpSlug(ep);
            const isCurrent = currentSlug === epSlug;
            return (
              <Link
                key={i}
                href={`/watch/${epSlug}`}
                className={`relative aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all group ${
                  isCurrent
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'bg-bg-card border border-border hover:border-primary/40 hover:bg-bg-hover text-text-muted hover:text-white'
                }`}
              >
                {getEpNum(ep)}
                {!isCurrent && (
                  <div className="absolute inset-0 rounded-lg bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={12} fill="white" className="text-white" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* List mode */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {paginated.map((ep, i) => {
            const epSlug = getEpSlug(ep);
            const isCurrent = currentSlug === epSlug;
            return (
              <Link
                key={i}
                href={`/watch/${epSlug}`}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all group ${
                  isCurrent
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-bg-card border-border hover:bg-bg-hover hover:border-border-light'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isCurrent ? 'bg-primary text-white' : 'bg-bg-hover text-text-muted group-hover:bg-primary/20 group-hover:text-primary'
                  }`}
                >
                  {getEpNum(ep)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text line-clamp-1">
                    {ep.title || ep.judul || `Episode ${getEpNum(ep)}`}
                  </p>
                  {(ep.date || ep.tanggal) && (
                    <p className="text-xs text-text-muted">{ep.date || ep.tanggal}</p>
                  )}
                </div>
                <Play size={14} className={isCurrent ? 'text-primary' : 'text-text-faint group-hover:text-primary'} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
