import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutList, ArrowLeft } from 'lucide-react';
import { getEpisode, getDetail } from '@/lib/api';
import { getStreamUrl, epNumFromSlug, getCoverImg, getTitle } from '@/lib/utils';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import Comments from '@/components/Comments';
import type { Episode } from '@/lib/types';

export const dynamic = 'force-dynamic';
interface Props { params: { episodeSlug: string } }

export async function generateMetadata({ params }: Props) {
  const ep  = epNumFromSlug(params.episodeSlug);
  const slug = params.episodeSlug.replace(/-episode-\d+$/i, '');
  return { title: `Episode ${ep} — ${slug.replace(/-/g,' ')}` };
}

export default async function WatchPage({ params }: Props) {
  const epSlug      = params.episodeSlug;
  const donghuaSlug = epSlug.replace(/-episode-\d+$/i, '');
  const epNum       = epNumFromSlug(epSlug);

  let episode;
  try { episode = await getEpisode(epSlug); }
  catch { notFound(); }

  const streamUrl = getStreamUrl(episode as Record<string, unknown>);
  const prev = (episode.prev ?? episode.prev_episode) as string | null | undefined;
  const next = (episode.next ?? episode.next_episode) as string | null | undefined;

  // Fetch detail for episode list + title/cover
  let donghua;
  try { donghua = await getDetail(donghuaSlug); } catch {}
  const episodes = donghua
    ? ((donghua.episodes ?? donghua.episode_list ?? donghua.daftar_episode ?? []) as Episode[])
    : [];
  const cover    = donghua ? getCoverImg(donghua) : '/placeholder.jpg';
  const dTitle   = donghua ? getTitle(donghua) : donghuaSlug.replace(/-/g, ' ');

  return (
    <div style={{ paddingTop: 0, paddingBottom: 32 }}>
      {/* Top bar overlay for this page */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4"
        style={{ height:56, background:'rgba(8,8,15,0.85)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <Link href={"/donghua/" + donghuaSlug}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
          <ArrowLeft size={16} className="text-white" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white clamp-1 capitalize">{dTitle}</p>
          <p className="text-xs" style={{ color:'var(--cyan)' }}>Episode {epNum}</p>
        </div>
      </div>

      {/* Player */}
      <div style={{ paddingTop: 56 }}>
        <VideoPlayer
          src={streamUrl}
          title={`Episode ${epNum}`}
          episodeSlug={epSlug}
          donghuaTitle={dTitle}
          cover={cover}
        />
      </div>

      {/* Episode nav */}
      <div className="flex items-center justify-between gap-3 px-4 mt-4">
        {prev ? (
          <Link href={"/watch/" + prev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background:'var(--ink3)', color:'var(--text)', border:'1px solid var(--ink5)' }}>
            <ChevronLeft size={15} />Sebelumnya
          </Link>
        ) : <div />}

        <Link href={"/donghua/" + donghuaSlug}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background:'rgba(0,212,255,0.1)', color:'var(--cyan)', border:'1px solid rgba(0,212,255,0.25)' }}>
          <LayoutList size={14} />Semua Ep
        </Link>

        {next ? (
          <Link href={"/watch/" + next}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background:'var(--cyan)', color:'#000', boxShadow:'0 0 14px rgba(0,212,255,0.3)' }}>
            Selanjutnya<ChevronRight size={15} />
          </Link>
        ) : <div />}
      </div>

      {/* Episode list (collapse) */}
      {episodes.length > 0 && (
        <div className="px-4 mt-6">
          <h3 className="font-display font-bold text-base text-white glow-line mb-4">DAFTAR EPISODE</h3>
          <EpisodeList episodes={episodes} donghuaSlug={donghuaSlug} currentSlug={epSlug} />
        </div>
      )}

      {/* Comments */}
      <div className="px-4 mt-8">
        <Comments episodeSlug={epSlug} />
      </div>
    </div>
  );
}
