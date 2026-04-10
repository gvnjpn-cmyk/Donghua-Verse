import Link from 'next/link';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import type { Donghua } from '@/lib/types';
import { getCoverImg, getTitle, getItemSlug, getStatus, getStatusColor } from '@/lib/utils';

interface Props {
  donghua: Donghua;
  variant?: 'default' | 'wide' | 'compact';
}

export default function DonghuaCard({ donghua, variant = 'default' }: Props) {
  const slug = getItemSlug(donghua);
  const cover = getCoverImg(donghua);
  const title = getTitle(donghua);
  const status = getStatus(donghua);
  const statusColor = getStatusColor(status);
  const href = slug ? `/donghua/${slug}` : '#';

  /* ── Compact ─────────────────────────────── */
  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 p-3 rounded-xl bg-bg-card hover:bg-bg-hover border border-border hover:border-border-light transition-all group"
      >
        <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={cover} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="56px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text line-clamp-2 group-hover:text-primary transition-colors">{title}</p>
          {(donghua.latest_episode || donghua.episode_terakhir) && (
            <p className="text-xs text-text-muted mt-1">Ep {donghua.latest_episode || donghua.episode_terakhir}</p>
          )}
          <p className={`text-xs mt-1 font-medium ${statusColor}`}>{status}</p>
        </div>
      </Link>
    );
  }

  const W = variant === 'wide' ? 200 : 160;
  const H = variant === 'wide' ? 280 : 240;
  const isOngoing = status.toLowerCase().includes('ongoing') || status.toLowerCase().includes('berlangsung');

  /* ── Default / Wide ──────────────────────── */
  return (
    <Link
      href={href}
      className="relative block rounded-xl overflow-hidden group card-shine border border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-glow-sm flex-shrink-0"
      style={{ width: W, height: H }}
    >
      <Image
        src={cover}
        alt={title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        sizes={`${W}px`}
      />

      <div className="absolute inset-0 gradient-bottom opacity-90" />

      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-glow-red backdrop-blur-sm scale-90 group-hover:scale-100 transition-transform">
          <Play size={20} className="text-white ml-1" fill="white" />
        </div>
      </div>

      {/* Status badge */}
      <div className="absolute top-2 left-2">
        <span className={`badge text-xs ${isOngoing ? 'bg-primary/90 text-white' : 'bg-emerald-600/90 text-white'}`}>
          {status}
        </span>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        {(donghua.latest_episode || donghua.episode_terakhir) && (
          <span className="badge-red text-xs mb-1.5 inline-block">
            Ep {donghua.latest_episode || donghua.episode_terakhir}
          </span>
        )}
        <p className={`${variant === 'wide' ? 'text-sm' : 'text-xs'} font-semibold text-white line-clamp-2 leading-snug`}>
          {title}
        </p>
        {donghua.score && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} fill="#ffd60a" className="text-accent-gold" />
            <span className="text-xs text-accent-gold font-medium">{donghua.score}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
