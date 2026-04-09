import type { Donghua, Episode, EpisodeDetail, ScheduleDay, HomeData } from './types';

const API_BASE = 'https://api.app.orbitcloud.web.id/api/v1';

function getHeaders(): HeadersInit {
  const key = process.env.ORBITCLOUD_API_KEY ?? '';
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) h['x-api-key'] = key;
  return h;
}

async function get<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`OrbitCloud ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`OrbitCloud POST ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

/* ── Normalize helpers ── */
export function getCover(d: Donghua): string {
  return d.cover ?? d.thumbnail ?? d.poster ?? d.image ?? d.gambar ?? '/placeholder.jpg';
}
export function getSlug(d: Donghua): string {
  return String(d.slug ?? d.id ?? '');
}

/* ── Endpoints ── */
export async function getHome(pages = 1): Promise<HomeData> {
  return get<HomeData>(`/home?pages=${pages}`, 180);
}

export async function searchDonghua(q: string, pages = 1): Promise<Donghua[]> {
  type Res = Donghua[] | { data: Donghua[] };
  const res = await get<Res>(`/search?q=${encodeURIComponent(q)}&pages=${pages}`, 60);
  return Array.isArray(res) ? res : (res.data ?? []);
}

export async function getJadwal(): Promise<ScheduleDay[]> {
  type Res = ScheduleDay[] | { data: ScheduleDay[] };
  const res = await get<Res>('/jadwal', 3600);
  return Array.isArray(res) ? res : (res.data ?? []);
}

export async function getDetail(slug: string): Promise<Donghua> {
  type Res = Donghua | { data: Donghua };
  const res = await get<Res>(`/detail/${slug}`, 300);
  return (res as { data: Donghua }).data ?? (res as Donghua);
}

export async function getEpisode(episodeSlug: string): Promise<EpisodeDetail> {
  type Res = EpisodeDetail | { data: EpisodeDetail };
  const res = await get<Res>(`/episode/${episodeSlug}`, 120);
  return (res as { data: EpisodeDetail }).data ?? (res as EpisodeDetail);
}
