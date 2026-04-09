import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { getEpisode } from '@/lib/api';
import { getStreamUrl, buildEpSlug, epNumFromSlug } from '@/lib/utils';
import VideoPlayer from '@/components/VideoPlayer';
import Comments from '@/components/Comments';

interface Props {
  params: { episodeSlug: string };
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Nonton ${params.episodeSlug.replace(/-/g, ' ')}`,
  };
}

export default async function WatchPage({ params }: Props) {
  const slug = params.episodeSlug;
  let episode;

  try {
    episode = await getEpisode(slug);
  } catch {
    notFound();
  }

  const streamUrl = getStreamUrl(episode as Record<string, unknown>);

  // Derive donghua slug dari episode slug
  // e.g. "renegade-immortal-episode-100" → "renegade-immortal"
  const donghuaSlug = slug.replace(/-episode-\d+$/i, '');
  const epNum = epNumFromSlug(slug);

  const prevSlug = (episode.prev || episode.prev_episode) as string | null | undefined;
  const nextSlug = (episode.next || episode.next_episode) as string | null | undefined;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-4 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home size={14} />
            Beranda
          </Link>
          <span>/</span>
          <Link href={`/donghua/${donghuaSlug}`} className="hover:text-primary transition-colors capitalize">
            {donghuaSlug.replace(/-/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-text">Episode {epNum}</span>
        </nav>

        {/* Title */}
        <h1 className="font-display text-2xl md:text-3xl text-white mb-4 capitalize tracking-wide">
          {donghuaSlug.replace(/-/g, ' ')} — Episode {epNum}
        </h1>

        {/* Video Player */}
        <VideoPlayer src={streamUrl} title={`Episode ${epNum}`} episodeSlug={slug} />

        {/* Episode Navigation */}
        <div className="flex items-center justify-between gap-4 mt-5">
          {prevSlug ? (
            <Link
              href={`/watch/${prevSlug}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-bg-card hover:bg-bg-hover border border-border rounded-full text-sm font-medium text-text transition-all"
            >
              <ChevronLeft size={16} />
              Episode Sebelumnya
            </Link>
          ) : (
            <div />
          )}

          <Link
            href={`/donghua/${donghuaSlug}`}
            className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary transition-all"
          >
            Semua Episode
          </Link>

          {nextSlug ? (
            <Link
              href={`/watch/${nextSlug}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark rounded-full text-sm font-semibold text-white transition-all shadow-glow-sm"
            >
              Episode Selanjutnya
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <Comments episodeSlug={slug} />
        </div>
      </div>
    </div>
  );
}
