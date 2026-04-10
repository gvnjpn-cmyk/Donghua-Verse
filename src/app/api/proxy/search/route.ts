import { NextRequest } from 'next/server';
import { proxyGet } from '../_helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q     = req.nextUrl.searchParams.get('q') ?? '';
  const pages = req.nextUrl.searchParams.get('pages') ?? '1';
  return proxyGet(`/search?q=${encodeURIComponent(q)}&pages=${pages}`);
}
