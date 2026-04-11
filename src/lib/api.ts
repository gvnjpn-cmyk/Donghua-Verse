/**
 * lib/api.ts — OrbitCloud API
 *
 * Response shape dari debug:
 * GET /api/v1/home → { status:"success", data:{ latest:[{ep,img,link,slug,type,title}] } }
 *
 * Fields item: ep="Ep 263", img="https://...", link="https://.../detail/slug", slug, title
 */

import type { Donghua, EpisodeDetail, ScheduleDay, HomeData } from './types';

const ORBIT_BASE = 'https://api.app.orbitcloud.web.id/api/v1';

function buildHeaders(): Record<string, string> {
  const key = process.env.ORBITCLOUD_API_KEY ?? '';
  const h: Record<string, string> = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (key) h['x-api-key'] = key;
  else console.warn('[ORBIT] ORBITCLOUD_API_KEY tidak diset!');
  return h;
}

async function orbitGet<T>(path: string): Promise<T> {
  const url = `${ORBIT_BASE}${path}`;
  console.log(`[ORBIT] GET ${url}`);

  const res = await fetch(url, { method: 'GET', cache: 'no-store', headers: buildHeaders() });
  const text = await res.text();
  console.log(`[ORBIT] ${res.status} ${path} | ${text.slice(0, 200)}`);

  if (!res.ok) throw new Error(`OrbitCloud ${res.status} on ${path}: ${text.slice(0, 150)}`);

  try { return JSON.parse(text) as T; }
  catch { throw new Error(`Invalid JSON on ${path}: ${text.slice(0, 80)}`); }
}

/**
 * Unwrap OrbitCloud response.
 * Shape: { status:"success", data: { ... } } atau langsung array/object
 */
function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return (raw as Record<string, unknown>).data as T;
  }
  return raw as T;
}

// ─── Helpers ──────────────────────────────────────────────────
export function getCover(d: Donghua): string {
  return d.img ?? d.cover ?? d.thumbnail ?? d.poster ?? d.image ?? d.gambar ?? '/placeholder.jpg';
}
export function getSlug(d: Donghua): string {
  if (d.slug) return d.slug;
  if (d.link) { const p = d.link.split('/'); return p[p.length-1] || ''; }
  return String(d.id ?? '');
}

// ─── Endpoints ────────────────────────────────────────────────
export async function getHome(pages = 1): Promise<HomeData> {
  const raw = await orbitGet<unknown>(`/home?pages=${pages}`);
  // OrbitCloud: { status:"success", data:{ latest:[...], populer:[...], ... } }
  const inner = unwrap<HomeData>(raw);
  console.log('[ORBIT] home keys:', Object.keys(inner ?? {}));
  return inner;
}

export async function searchDonghua(q: string, pages = 1): Promise<Donghua[]> {
  const raw = await orbitGet<unknown>(`/search?q=${encodeURIComponent(q)}&pages=${pages}`);
  const inner = unwrap<Donghua[] | Record<string, unknown>>(raw);
  if (Array.isArray(inner)) return inner;
  // mungkin { results: [...] } atau { data: [...] }
  for (const key of ['results','data','items','list']) {
    if (inner && Array.isArray((inner as Record<string,unknown>)[key])) {
      return (inner as Record<string,unknown>)[key] as Donghua[];
    }
  }
  return [];
}

export async function getJadwal(): Promise<ScheduleDay[]> {
  const raw = await orbitGet<unknown>('/jadwal');
  const inner = unwrap<ScheduleDay[] | Record<string, unknown>>(raw);
  if (Array.isArray(inner)) return inner;
  return [];
}

export async function getDetail(slug: string): Promise<Donghua> {
  const raw = await orbitGet<unknown>(`/detail/${slug}`);
  const inner = unwrap<Donghua>(raw);
  console.log('[ORBIT] detail keys:', Object.keys(inner ?? {}));
  return inner;
}

export async function getEpisode(epSlug: string): Promise<EpisodeDetail> {
  const raw = await orbitGet<unknown>(`/episode/${epSlug}`);
  const inner = unwrap<EpisodeDetail>(raw);
  return inner;
}
