import type { Donghua, ScheduleItem, Episode } from './types';

/** Ambil judul */
export function getTitle(d: Donghua | ScheduleItem): string {
  return (d as Donghua).title ?? (d as Donghua).judul ?? 'Judul Tidak Diketahui';
}

/** Ambil cover — OrbitCloud pakai field "img" */
export function getCoverImg(d: Donghua | ScheduleItem): string {
  const x = d as Donghua;
  return x.img ?? x.cover ?? x.thumbnail ?? x.poster ?? x.image ?? x.gambar ?? '/placeholder.jpg';
}

/** Ambil slug — bisa dari slug langsung atau dari link URL */
export function getItemSlug(d: Donghua): string {
  if (d.slug) return d.slug;
  // OrbitCloud link format: "https://api.app.orbitcloud.web.id/api/v1/detail/perfect-world"
  if (d.link) {
    const parts = d.link.split('/');
    const last = parts[parts.length - 1];
    if (last && last !== 'detail') return last;
  }
  return String(d.id ?? '');
}

/** Ambil episode number string — OrbitCloud pakai "ep": "Ep 263" */
export function getEpDisplay(d: Donghua | ScheduleItem | Episode): string {
  const x = d as Donghua;
  if (x.ep) return x.ep; // "Ep 263"
  if (x.latest_episode) return `Ep ${x.latest_episode}`;
  if ((x as Donghua).episode_terakhir) return `Ep ${(x as Donghua).episode_terakhir}`;
  if ((x as Episode).episode) return `Ep ${(x as Episode).episode}`;
  return '';
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
