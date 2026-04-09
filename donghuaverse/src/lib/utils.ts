import type { Donghua, ScheduleItem } from './types';

export function getTitle(d: Donghua | ScheduleItem): string {
  return (d as Donghua).title ?? (d as Donghua).judul ?? 'Judul Tidak Diketahui';
}

export function getCoverImg(d: Donghua | ScheduleItem): string {
  const x = d as Donghua;
  return x.cover ?? x.thumbnail ?? x.poster ?? x.image ?? x.gambar ?? '/placeholder.jpg';
}

export function getItemSlug(d: Donghua): string {
  return String(d.slug ?? d.id ?? '');
}

export function getSynopsis(d: Donghua): string {
  return d.synopsis ?? d.sinopsis ?? d.deskripsi ?? '';
}

export function getGenresArr(d: Donghua): string[] {
  if (Array.isArray(d.genres) && d.genres.length) return d.genres;
  if (Array.isArray(d.genre)) return d.genre;
  if (typeof d.genre === 'string' && d.genre) return d.genre.split(/[,/]/).map(s => s.trim());
  return [];
}

export function getTotalEp(d: Donghua): string {
  return String(d.total_episode ?? d.episodes?.length ?? '?');
}

export function getStatus(d: Donghua): string {
  return d.status ?? 'Ongoing';
}

export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('ongoing') || s.includes('berlangsung')) return 'text-primary';
  if (s.includes('tamat') || s.includes('completed')) return 'text-emerald-400';
  return 'text-text-muted';
}

export function epNumFromSlug(slug: string): number {
  const m = slug.match(/episode[- ](\d+)/i);
  return m ? parseInt(m[1]) : 0;
}

export function buildEpSlug(donghuaSlug: string, epNum: number | string): string {
  return `${donghuaSlug}-episode-${epNum}`;
}

export function getStreamUrl(ep: Record<string, unknown>): string {
  return (
    (ep.embed_url as string) ??
    (ep.iframe as string) ??
    (ep.stream_url as string) ??
    (ep.video_url as string) ??
    (ep.link as string) ??
    ''
  );
}

export function formatViews(v?: number | string): string {
  if (!v) return '';
  const n = typeof v === 'string' ? parseInt(v) : v;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
