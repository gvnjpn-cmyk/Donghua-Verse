import type { Donghua, Episode, EpisodeDetail, Schedule, HomeData } from './types';

const API_BASE = 'https://api.app.orbitcloud.web.id/api/v1';

// ─── Helper ────────────────────────────────────────────────
function getHeaders(): HeadersInit {
  const key = process.env.ORBITCLOUD_API_KEY || process.env.NEXT_PUBLIC_ORBITCLOUD_API_KEY || '';
  return {
    'Content-Type': 'application/json',
    ...(key ? { 'x-api-key': key } : {}),
  };
}

async function get<T>(path: string, revalidate = 300): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`OrbitCloud API ${res.status}: ${path}`);
  return res.json();
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`OrbitCloud API ${res.status}: POST ${path}`);
  return res.json();
}

// ─── Normalize helpers ──────────────────────────────────────
export function getCover(d: Donghua): string {
  return d.cover || d.thumbnail || d.poster || d.image || '/placeholder.jpg';
}

export function getSlug(d: Donghua): string {
  return String(d.slug ?? d.id);
}

// ─── Endpoints ─────────────────────────────────────────────
/**
 * GET /api/v1/home?pages=N
 * Returns: { populer, terbaru, tamat } atau similar
 */
export async function getHome(pages = 1): Promise<HomeData> {
  return get<HomeData>(`/home?pages=${pages}`, 180);
}

/**
 * POST /api/v1/home — realtime scrape
 */
export async function getHomeRealtime(halaman = 1): Promise<HomeData> {
  return post<HomeData>('/home', { halaman });
}

/**
 * GET /api/v1/search?q=...&pages=N
 */
export async function searchDonghua(q: string, pages = 1): Promise<Donghua[]> {
  const res = await get<Donghua[] | { data: Donghua[] }>(`/search?q=${encodeURIComponent(q)}&pages=${pages}`, 60);
  return Array.isArray(res) ? res : res.data ?? [];
}

/**
 * POST /api/v1/search
 */
export async function searchDonghuaPost(q: string, halaman = 1): Promise<Donghua[]> {
  const res = await post<Donghua[] | { data: Donghua[] }>('/search', { q, halaman });
  return Array.isArray(res) ? res : res.data ?? [];
}

/**
 * GET /api/v1/jadwal
 */
export async function getJadwal(): Promise<Schedule[]> {
  const res = await get<Schedule[] | { data: Schedule[] }>('/jadwal', 3600);
  return Array.isArray(res) ? res : res.data ?? [];
}

/**
 * GET /api/v1/detail/:slug
 */
export async function getDetail(slug: string): Promise<Donghua> {
  const res = await get<Donghua | { data: Donghua }>(`/detail/${slug}`, 300);
  return (res as { data: Donghua }).data ?? (res as Donghua);
}

/**
 * GET /api/v1/episode/:slug
 * slug format: {donghua-slug}-episode-{N}  e.g. renegade-immortal-episode-100
 */
export async function getEpisode(episodeSlug: string): Promise<EpisodeDetail> {
  const res = await get<EpisodeDetail | { data: EpisodeDetail }>(`/episode/${episodeSlug}`, 120);
  return (res as { data: EpisodeDetail }).data ?? (res as EpisodeDetail);
}
