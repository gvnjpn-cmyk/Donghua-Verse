import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Tv, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { getDetail } from '@/lib/api';
import {
  getTitle, getCoverImg, getItemSlug, getSynopsis,
  getGenresArr, getTotalEp, getStatus, getStatusColor, buildEpSlug,
} from '@/lib/utils';
import type { Episode } from '@/lib/types';
import EpisodeList from '@/components/EpisodeList';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  try {
    const d = await getDetail(params.slug);
    return { title: getTitle(d), description: getSynopsis(d).slice(0, 160) };
  } catch {
    return { title: 'Detail Donghua' };
  }
}

export default async function DetailPage({ params }: Props) {
  let donghua;
  try {
    donghua = await getDetail(params.slug);
  } catch {
    notFound();
  }

  const title   = getTitle(donghua);
  const cover   = getCoverImg(donghua);
  const synopsis = getSynopsis(donghua);
  const genres  = getGenresArr(donghua);
  const status  = getStatus(donghua);
  const statusColor = getStatusColor(status);

  const episodes = (donghua.episodes ?? donghua.episode_list ?? donghua.daftar_episode ?? []) as Episode[];
  const firstEp  = episodes[0];
  const firstSlug = firstEp?.slug ?? buildEpSlug(params.slug, firstEp?.episode ?? 1);
  const lastEp   = episodes[episodes.length - 1];
  const lastSlug  = lastEp?.slug ?? buildEpSlug(params.slug, lastEp?.episode ?? episodes.length);
  const isOngoing = status.toLowerCase().includes('ongoing') || status.toLowerCase().includes('berlangsung');

  return (
    <div className="pt-16 min-h-screen">
      {/* Backdrop blur */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image src={cover} alt={title} fill className="object-cover blur-sm scale-110" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-bg/70 to-bg" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-40 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-border" style={{ width: 180, height: 260 }}>
              <Image src={cover} alt={title} fill className="object-cover" sizes="180px" />
              <div className="absolute inset-0 card-shine" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="font-display text-3xl md:text-5xl text-white leading-tight tracking-wide mb-2">{title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`font-semibold text-sm ${statusColor}`}>{status}</span>
              {donghua.score && (
                <span className="flex items-center gap-1 text-accent-gold font-semibold text-sm">
                  <Star size={13} fill="#ffd60a" className="text-accent-gold" />
                  {donghua.score}
                </span>
              )}
              {(donghua.year ?? donghua.tahun) && (
                <span className="flex items-center gap-1 text-text-muted text-sm">
                  <Calendar size={13} />{donghua.year ?? donghua.tahun}
                </span>
              )}
              <span className="flex items-center gap-1 text-text-muted text-sm">
                <Tv size={13} />{getTotalEp(donghua)} Episode
              </span>
              {donghua.type && (
                <span className="badge border border-border-light text-text-muted text-xs">{donghua.type}</span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map(g => (
                  <Link key={g} href={`/browse?genre=${encodeURIComponent(g)}`}
                    className="badge border border-primary/30 text-primary text-xs hover:bg-primary/10 transition-colors">
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {synopsis && (
              <p className="text-text-muted text-sm leading-relaxed mb-5 max-w-2xl line-clamp-4 md:line-clamp-none">{synopsis}</p>
            )}

            {episodes.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <Link href={`/watch/${firstSlug}`}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all shadow-glow-sm hover:shadow-glow-red">
                  <Play size={17} fill="white" />Tonton Ep 1
                </Link>
                {episodes.length > 1 && (
                  <Link href={`/watch/${lastSlug}`}
                    className="flex items-center gap-2 bg-bg-card hover:bg-bg-hover border border-border text-text font-medium px-5 py-3 rounded-full transition-all">
                    Episode Terbaru<ChevronRight size={15} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Episode list */}
        <div className="mt-10">
          <h2 className="section-title mb-5">DAFTAR EPISODE</h2>
          {episodes.length > 0 ? (
            <EpisodeList episodes={episodes} donghuaSlug={params.slug} />
          ) : (
            <div className="text-center py-12 border border-border rounded-2xl bg-bg-card">
              <BookOpen size={36} className="text-text-faint mx-auto mb-3" />
              <p className="text-text-muted text-sm">Belum ada episode tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
