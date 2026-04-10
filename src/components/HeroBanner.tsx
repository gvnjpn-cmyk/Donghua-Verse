'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Donghua } from '@/lib/types';
import { getCoverImg, getTitle, getItemSlug, getSynopsis, getGenresArr, getStatus, getStatusColor } from '@/lib/utils';

interface Props { items: Donghua[] }

export default function HeroBanner({ items }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const featured = items.slice(0, 6);

  const go = useCallback((dir: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + featured.length) % featured.length);
      setFading(false);
    }, 250);
  }, [featured.length]);

  useEffect(() => {
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [go]);

  if (!featured.length) return null;

  const item = featured[current];
  const slug = getItemSlug(item);
  const title = getTitle(item);
  const synopsis = getSynopsis(item);
  const genres = getGenresArr(item);
  const status = getStatus(item);
  const statusColor = getStatusColor(status);

  return (
    <section className="relative w-full h-[72vh] min-h-[500px] max-h-[720px] overflow-hidden">
      {/* BG image */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image
          src={getCoverImg(item)}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6">
        <div
          key={current}
          className="max-w-xl animate-slide-up"
          style={{ animationFillMode: 'both' }}
        >
          {/* Genre tags */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.slice(0, 3).map((g) => (
                <span key={g} className="badge border border-white/20 text-white/70 text-xs backdrop-blur-sm">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] tracking-wide mb-3 drop-shadow-2xl">
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <span className={`font-semibold ${statusColor}`}>{status}</span>
            {item.score && (
              <span className="flex items-center gap-1 text-accent-gold font-semibold">
                <Star size={13} fill="#ffd60a" />
                {item.score}
              </span>
            )}
            {(item.year || item.tahun) && (
              <span className="text-text-muted">{item.year || item.tahun}</span>
            )}
            {(item.total_episode) && (
              <span className="text-text-muted">{item.total_episode} Ep</span>
            )}
          </div>

          {/* Synopsis */}
          {synopsis && (
            <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-6 max-w-md">
              {synopsis}
            </p>
          )}

          {/* CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/donghua/${slug}`}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-full transition-all shadow-glow-red hover:scale-105 active:scale-95"
            >
              <Play size={18} fill="white" />
              Tonton Sekarang
            </Link>
            <Link
              href={`/donghua/${slug}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-5 py-3 rounded-full transition-all border border-white/20"
            >
              <Info size={16} />
              Detail
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-7 h-2 bg-primary' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-primary/80 transition-all backdrop-blur-sm z-10"
        aria-label="Sebelumnya"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-primary/80 transition-all backdrop-blur-sm z-10"
        aria-label="Selanjutnya"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
