import Link from 'next/link';
import Image from 'next/image';
import { Play, Star } from 'lucide-react';
import type { Donghua } from '@/lib/types';
import { getCoverImg, getTitle, getItemSlug, getStatus } from '@/lib/utils';

interface Props {
  donghua: Donghua;
  variant?: 'portrait' | 'landscape' | 'list';
}

export default function DonghuaCard({ donghua, variant = 'portrait' }: Props) {
  const slug   = getItemSlug(donghua);
  const cover  = getCoverImg(donghua);
  const title  = getTitle(donghua);
  const status = getStatus(donghua);
  const href   = slug ? `/donghua/${slug}` : '#';
  const ep     = donghua.latest_episode ?? donghua.episode_terakhir;

  /* ── List row ── */
  if (variant === 'list') {
    return (
      <Link href={href}
        className="flex items-center gap-3 p-3 rounded-2xl group transition-all"
        style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
        <div className="relative rounded-xl overflow-hidden flex-shrink-0" style={{ width:56, height:80 }}>
          <Image src={cover} alt={title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="56px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white clamp-2">{title}</p>
          {ep && <p className="text-xs mt-1" style={{ color:'var(--cyan)' }}>Ep {ep}</p>}
          <p className="text-xs mt-0.5 font-medium" style={{
            color: status.toLowerCase().includes('ongoing') ? 'var(--rose)' : 'var(--muted)'
          }}>{status}</p>
        </div>
        <Play size={14} style={{ color:'var(--faint)' }} className="flex-shrink-0 group-hover:text-cyan transition-colors" />
      </Link>
    );
  }

  /* ── Landscape ── */
  if (variant === 'landscape') {
    return (
      <Link href={href}
        className="relative flex-shrink-0 rounded-2xl overflow-hidden group"
        style={{ width:200, height:130 }}>
        <Image src={cover} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
        <div className="absolute inset-0 grad-b" />
        {ep && <span className="badge-ep">Ep {ep}</span>}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:'rgba(0,212,255,0.85)' }}>
            <Play size={15} fill="#000" className="ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-[11px] font-semibold text-white clamp-1">{title}</p>
        </div>
      </Link>
    );
  }

  /* ── Portrait (default) ── */
  return (
    <Link href={href}
      className="relative flex-shrink-0 rounded-xl overflow-hidden group"
      style={{ width:120, height:168 }}>
      <Image src={cover} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="120px" />
      <div className="absolute inset-0 grad-b" />

      {/* NEW badge */}
      {ep && <span className="badge-new">NEW</span>}

      {/* Ep badge */}
      {ep && <span className="badge-ep">Ep {ep}</span>}

      {/* Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-11 h-11 rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform"
          style={{ background:'rgba(0,212,255,0.85)', boxShadow:'0 0 20px rgba(0,212,255,0.4)' }}>
          <Play size={17} fill="#000" className="ml-0.5" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-[11px] font-semibold text-white clamp-2 leading-snug">{title}</p>
        {donghua.score && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={9} fill="var(--amber)" style={{ color:'var(--amber)' }} />
            <span className="text-[10px] font-medium" style={{ color:'var(--amber)' }}>{donghua.score}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
