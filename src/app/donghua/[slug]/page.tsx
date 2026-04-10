import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Tv, Calendar, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import { getDetail } from '@/lib/api';
import { getTitle, getCoverImg, getSynopsis, getGenresArr, getTotalEp, getStatus, getStatusColor, buildEpSlug } from '@/lib/utils';
import type { Episode } from '@/lib/types';
import EpisodeList from '@/components/EpisodeList';
import SaveToLibrary from '@/components/SaveToLibrary';

export const dynamic = 'force-dynamic';
interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  try {
    const d = await getDetail(params.slug);
    return { title: getTitle(d), description: getSynopsis(d).slice(0,160) };
  } catch { return { title: 'Detail Donghua' }; }
}

export default async function DetailPage({ params }: Props) {
  let donghua;
  try { donghua = await getDetail(params.slug); }
  catch { notFound(); }

  const title    = getTitle(donghua);
  const cover    = getCoverImg(donghua);
  const synopsis = getSynopsis(donghua);
  const genres   = getGenresArr(donghua);
  const status   = getStatus(donghua);
  const episodes = (donghua.episodes ?? donghua.episode_list ?? donghua.daftar_episode ?? []) as Episode[];
  const firstEp  = episodes[0];
  const firstSlug = firstEp?.slug ?? buildEpSlug(params.slug, firstEp?.episode ?? 1);
  const lastEp   = episodes[episodes.length-1];
  const lastSlug  = lastEp?.slug ?? buildEpSlug(params.slug, lastEp?.episode ?? episodes.length);
  const isOngoing = status.toLowerCase().includes('ongoing') || status.toLowerCase().includes('berlangsung');

  return (
    <div style={{ paddingTop: 0, paddingBottom: 24 }}>
      {/* Hero backdrop */}
      <div className="relative h-72 overflow-hidden">
        <Image src={cover} alt={title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(8,8,15,0.3) 0%, rgba(8,8,15,1) 100%)' }} />

        {/* Back button */}
        <Link href="javascript:history.back()"
          className="absolute top-14 left-4 w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background:'rgba(8,8,15,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)' }}>
          <ArrowLeft size={18} className="text-white" />
        </Link>
      </div>

      <div className="px-4 -mt-16 relative z-10">
        {/* Poster + info row */}
        <div className="flex gap-4 mb-5">
          <div className="relative rounded-2xl overflow-hidden flex-shrink-0 shadow-card"
            style={{ width:110, height:154, border:'2px solid rgba(0,212,255,0.2)' }}>
            <Image src={cover} alt={title} fill className="object-cover" sizes="110px" />
          </div>

          <div className="flex-1 min-w-0 pt-14">
            <h1 className="font-display font-bold text-xl text-white leading-snug tracking-wide clamp-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: isOngoing ? 'rgba(255,68,102,0.15)' : 'rgba(0,212,255,0.1)',
                         color: isOngoing ? 'var(--rose)' : 'var(--cyan)',
                         border: `1px solid ${isOngoing ? 'rgba(255,68,102,0.3)' : 'rgba(0,212,255,0.2)'}` }}>
                {status}
              </span>
              {donghua.score && (
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color:'var(--amber)' }}>
                  <Star size={11} fill="var(--amber)" />
                  {donghua.score}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs" style={{ color:'var(--muted)' }}>
                <Tv size={11} />{getTotalEp(donghua)} Ep
              </span>
              {(donghua.year ?? donghua.tahun) && (
                <span className="flex items-center gap-1 text-xs" style={{ color:'var(--muted)' }}>
                  <Calendar size={11} />{donghua.year ?? donghua.tahun}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Genre chips */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map(g => (
              <span key={g} className="chip text-xs" style={{ fontSize:11 }}>{g}</span>
            ))}
          </div>
        )}

        {/* Synopsis */}
        {synopsis && (
          <p className="text-sm leading-relaxed mb-5 line-clamp-4" style={{ color:'var(--muted)' }}>{synopsis}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          {episodes.length > 0 && (
            <Link href={"/watch/" + firstSlug}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all"
              style={{ background:'var(--cyan)', color:'#000', boxShadow:'0 0 20px rgba(0,212,255,0.3)' }}>
              <Play size={17} fill="#000" />Tonton Ep 1
            </Link>
          )}
          {episodes.length > 1 && (
            <Link href={"/watch/" + lastSlug}
              className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl font-medium text-sm transition-all"
              style={{ background:'var(--ink3)', color:'var(--text)', border:'1px solid var(--ink5)' }}>
              Terbaru<ChevronRight size={14} />
            </Link>
          )}
          <SaveToLibrary slug={params.slug} title={title} cover={cover} />
        </div>

        {/* Episode list */}
        <div>
          <h2 className="font-display font-bold text-lg text-white glow-line mb-4">DAFTAR EPISODE</h2>
          {episodes.length > 0 ? (
            <EpisodeList episodes={episodes} donghuaSlug={params.slug} />
          ) : (
            <div className="rounded-2xl p-10 text-center" style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
              <BookOpen size={32} className="mx-auto mb-3" style={{ color:'var(--faint)' }} />
              <p className="text-sm" style={{ color:'var(--muted)' }}>Belum ada episode</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
