/**
 * lib/api.ts — OrbitCloud API client
 *
 * Server Components panggil OrbitCloud LANGSUNG (tidak lewat HTTP proxy).
 * Env var ORBITCLOUD_API_KEY dibaca server-side, tidak perlu NEXT_PUBLIC_.
 * /api/proxy/* routes tetap ada untuk debugging via browser.
 */

import type { Donghua, EpisodeDetail, ScheduleDay, HomeData } from './types';

const ORBIT_BASE = 'https://api.app.orbitcloud.web.id/api/v1';

function buildHeaders(): Record<string, string> {
  const key = process.env.ORBITCLOUD_API_KEY ?? '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (key) {
    headers['x-api-key'] = key;
  } else {
    console.warn('[ORBIT] WARNING: ORBITCLOUD_API_KEY tidak diset!');
  }
  return headers;
}

async function orbitGet<T>(path: string): Promise<T> {
  const url = `${ORBIT_BASE}${path}`;
  const headers = buildHeaders();

  console.log(`[ORBIT] GET ${url} | key=${headers['x-api-key'] ? headers['x-api-key'].slice(0,8)+'...' : 'MISSING'}`);

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  const text = await res.text();
  console.log(`[ORBIT] ${res.status} ${path} | preview: ${text.slice(0, 150)}`);

  if (!res.ok) {
    throw new Error(`OrbitCloud ${res.status} on ${path}: ${text.slice(0, 200)}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`OrbitCloud invalid JSON on ${path}: ${text.slice(0, 100)}`);
  }
}

// ─── Helpers ──────────────────────────────────────────────────
export function getCover(d: Donghua): string {
  return d.cover ?? d.thumbnail ?? d.poster ?? d.image ?? d.gambar ?? '/placeholder.jpg';
}
export function getSlug(d: Donghua): string {
  return String(d.slug ?? d.id ?? '');
}

// ─── Endpoints ────────────────────────────────────────────────
export async function getHome(pages = 1): Promise<HomeData> {
  return orbitGet<HomeData>(`/home?pages=${pages}`);
}

export async function searchDonghua(q: string, pages = 1): Promise<Donghua[]> {
  type R = Donghua[] | { data: Donghua[] };
  const res = await orbitGet<R>(`/search?q=${encodeURIComponent(q)}&pages=${pages}`);
  return Array.isArray(res) ? res : (res.data ?? []);
}

export async function getJadwal(): Promise<ScheduleDay[]> {
  type R = ScheduleDay[] | { data: ScheduleDay[] };
  const res = await orbitGet<R>('/jadwal');
  return Array.isArray(res) ? res : (res.data ?? []);
}

export async function getDetail(slug: string): Promise<Donghua> {
  type R = Donghua | { data: Donghua };
  const res = await orbitGet<R>(`/detail/${slug}`);
  return (res as { data: Donghua }).data ?? (res as Donghua);
}

export async function getEpisode(epSlug: string): Promise<EpisodeDetail> {
  type R = EpisodeDetail | { data: EpisodeDetail };
  const res = await orbitGet<R>(`/episode/${epSlug}`);
  return (res as { data: EpisodeDetail }).data ?? (res as EpisodeDetail);
}
