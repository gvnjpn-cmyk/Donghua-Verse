import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Flame, Clock, Tv2, Star } from 'lucide-react';
import { getHome } from '@/lib/api';
import type { Donghua, HomeData } from '@/lib/types';
import { getCoverImg, getTitle, getItemSlug } from '@/lib/utils';
import GenreStrip from '@/components/GenreStrip';
import ContinueWatching from '@/components/ContinueWatching';

export const dynamic = 'force-dynamic';

const GENRES = ['Donghua','Action','Fantasy','Xianxia','Martial Arts','Comedy','Romance','Cultivation','Sci-Fi','Historical'];

function toList(v: unknown): Donghua[] {
  return Array.isArray(v) ? (v as Donghua[]) : [];
}

/* ── Big horizontal card (Lanjutkan Nonton style) ── */
function FeaturedCard({ item, rank }: { item: Donghua; rank?: number }) {
  const slug   = getItemSlug(item);
  const cover  = getCoverImg(item);
  const title  = getTitle(item);
  return (
    <Link href={`/donghua/${slug}`}
      className="relative flex-shrink-0 rounded-2xl overflow-hidden group"
      style={{ width: 220, height: 140 }}>
      <Image src={cover} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="220px" />
      <div className="absolute inset-0 grad-br" />
      {rank && (
        <span className="absolute top-2 right-2 font-display text-xs font-bold px-2 py-0.5 rounded-md"
          style={{ background:'var(--rose)', color:'#fff' }}>#{rank}</span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-xs font-semibold text-white clamp-2 leading-snug">{title}</p>
        {(item.latest_episode || item.episode_terakhir) && (
          <p className="text-xs mt-1" style={{ color: 'var(--cyan)' }}>
            Ep {item.latest_episode ?? item.episode_terakhir}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ── Small portrait card ── */
function SmallCard({ item, showNew }: { item: Donghua; showNew?: boolean }) {
  const slug  = getItemSlug(item);
  const cover = getCoverImg(item);
  const title = getTitle(item);
  return (
    <Link href={`/donghua/${slug}`}
      className="relative flex-shrink-0 rounded-xl overflow-hidden group"
      style={{ width: 110, height: 155 }}>
      <Image src={cover} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="110px" />
      <div className="absolute inset-0 grad-b" />
      {showNew && <span className="badge-new">NEW</span>}
      {(item.latest_episode || item.episode_terakhir) && (
        <span className="badge-ep">Ep {item.latest_episode ?? item.episode_terakhir}</span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-[11px] font-semibold text-white clamp-2 leading-snug">{title}</p>
      </div>
    </Link>
  );
}

/* ── Section heading ── */
function SectionHead({ label, href, icon: Icon }: { label: string; href?: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="glow-line font-display font-bold text-lg text-white flex items-center gap-2">
        {Icon && <Icon size={16} style={{ color: 'var(--cyan)' }} />}
        {label}
      </h2>
      {href && (
        <Link href={href} className="flex items-center gap-0.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--muted)' }}>
          Lihat Semua <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  let home: HomeData = {};
  let fetchErr = '';

  try {
    home = await getHome(1);
  } catch (err) {
    fetchErr = err instanceof Error ? err.message : String(err);
  }

  const populer = toList(home.populer ?? home.slider   ?? home.popular);
  const terbaru = toList(home.terbaru ?? home.ongoing  ?? home.latest);
  const tamat   = toList(home.tamat   ?? home.completed);
  const hasData = populer.length || terbaru.length || tamat.length;

  return (
    <div style={{ paddingTop: 68 }}>

      {/* ── Greeting ── */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Selamat Datang 👋</p>
            <h1 className="font-display font-bold text-2xl text-white tracking-wide mt-0.5">
              DONGHUA<span style={{ color:'var(--cyan)' }}>VERSE</span>
            </h1>
          </div>
          {/* Search shortcut */}
          <Link href="/search"
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
            style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Announcement banner ── */}
      <div className="mx-4 mb-6 rounded-2xl px-4 py-3 flex items-start gap-3"
        style={{ background:'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,153,187,0.05) 100%)', border:'1px solid rgba(0,212,255,0.15)' }}>
        <span className="text-xl mt-0.5">📢</span>
        <div>
          <p className="text-xs font-semibold" style={{ color:'var(--cyan)' }}>Pengumuman</p>
          <p className="text-xs mt-0.5" style={{ color:'var(--text)' }}>
            Konten update setiap hari. Gunakan fitur Library untuk menyimpan donghua favorit kamu!
          </p>
        </div>
      </div>

      {/* ── Genre strip ── */}
      <div className="mb-6">
        <SectionHead label="Semua Genre" href="/browse" />
        <div className="px-4">
          <GenreStrip genres={GENRES} />
        </div>
      </div>

      {/* ── No data fallback ── */}
      {!hasData && (
        <div className="mx-4 rounded-2xl p-6 text-center"
          style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
          <p className="text-4xl mb-3">🎬</p>
          <p className="font-semibold text-white mb-1">Konten belum tersedia</p>
          <p className="text-xs" style={{ color:'var(--muted)' }}>
            {fetchErr || 'Pastikan ORBITCLOUD_API_KEY sudah diset di Vercel'}
          </p>
          <a href="/api/debug" target="_blank"
            className="inline-block mt-3 text-xs underline"
            style={{ color:'var(--cyan)' }}>
            Cek status API →
          </a>
        </div>
      )}

      {/* ── Continue watching (client, dari localStorage) ── */}
      <ContinueWatching />

      {/* ── Episode Terbaru ── */}
      {terbaru.length > 0 && (
        <section className="mb-8">
          <SectionHead label="Episode Terbaru" href="/browse?sort=terbaru" icon={Clock} />
          <div className="pl-4 scroll-x">
            {terbaru.map((d, i) => <SmallCard key={i} item={d} showNew />)}
            <div className="w-2 flex-shrink-0" />
          </div>
        </section>
      )}

      {/* ── Populer ── */}
      {populer.length > 0 && (
        <section className="mb-8">
          <SectionHead label="Trending Minggu Ini" href="/browse?sort=populer" icon={Flame} />
          <div className="pl-4 scroll-x">
            {populer.map((d, i) => <FeaturedCard key={i} item={d} rank={i < 3 ? i+1 : undefined} />)}
            <div className="w-2 flex-shrink-0" />
          </div>
        </section>
      )}

      {/* ── Tamat ── */}
      {tamat.length > 0 && (
        <section className="mb-8">
          <SectionHead label="Sudah Tamat" href="/browse?sort=tamat" icon={Tv2} />
          <div className="pl-4 scroll-x">
            {tamat.map((d, i) => <SmallCard key={i} item={d} />)}
            <div className="w-2 flex-shrink-0" />
          </div>
        </section>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}
