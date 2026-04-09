import type { Donghua, ScheduleItem } from './types';

/** Ambil judul (support multi-field OrbitCloud) */
export function getTitle(d: Donghua | ScheduleItem): string {
  return (d as Donghua).title || (d as Donghua).judul || 'Judul Tidak Diketahui';
}

/** Ambil cover image */
export function getCoverImg(d: Donghua | ScheduleItem): string {
  return (
    (d as Donghua).cover ||
    d.thumbnail ||
    (d as Donghua).poster ||
    (d as Donghua).image ||
    (d as Donghua).gambar ||
    '/placeholder.jpg'
  );
}

/** Ambil slug */
export function getItemSlug(d: Donghua): string {
  return String(d.slug ?? d.id ?? '');
}

/** Format tanggal Indonesia */
export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/** Ambil episode number dari slug  e.g. "renegade-immortal-episode-42" → 42 */
export function epNumFromSlug(slug: string): number {
  const m = slug.match(/episode[- ](\d+)/i);
  return m ? parseInt(m[1]) : 0;
}

/** Build episode slug dari donghua-slug + episode number */
export function buildEpSlug(donghuaSlug: string, epNum: number | string): string {
  return `${donghuaSlug}-episode-${epNum}`;
}

/** Ambil stream URL dari EpisodeDetail */
export function getStreamUrl(ep: Record<string, unknown>): string {
  return (
    (ep.embed_url as string) ||
    (ep.iframe as string) ||
    (ep.stream_url as string) ||
    (ep.video_url as string) ||
    (ep.link as string) ||
    ''
  );
}

/** Ambil genres sebagai array */
export function getGenresArr(d: Donghua): string[] {
  if (!d.genre && !d.genres) return [];
  if (Array.isArray(d.genres)) return d.genres;
  if (Array.isArray(d.genre)) return d.genre;
  if (typeof d.genre === 'string') return d.genre.split(/[,/]/).map((s) => s.trim());
  return [];
}

/** Ambil sinopsis */
export function getSynopsis(d: Donghua): string {
  return d.synopsis || d.sinopsis || d.deskripsi || '';
}

/** Total episode */
export function getTotalEp(d: Donghua): string {
  const t = d.total_episode ?? d.episodes?.length ?? '';
  return t ? String(t) : '?';
}

/** Status label */
export function getStatus(d: Donghua): string {
  return d.status || 'Ongoing';
}

/** Warna status */
export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('ongoing') || s.includes('berlangsung')) return 'text-primary';
  if (s.includes('tamat') || s.includes('completed')) return 'text-emerald-400';
  return 'text-text-muted';
}

/** Format angka views */
export function formatViews(v: number | string | undefined): string {
  if (!v) return '';
  const n = typeof v === 'string' ? parseInt(v) : v;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
