import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.ORBITCLOUD_API_KEY ?? '';
  const out: Record<string, unknown> = {
    time:    new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    apiKey: {
      set:     !!apiKey,
      preview: apiKey ? `${apiKey.slice(0, 8)}...` : 'NOT SET ❌',
    },
    vercelUrl: process.env.VERCEL_URL ?? null,
  };

  // Test 1: tanpa key
  try {
    const r = await fetch('https://api.app.orbitcloud.web.id/api/v1/home?pages=1', {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    });
    const body = await r.text();
    out.testNoKey = { status: r.status, ok: r.ok, preview: body.slice(0, 200) };
  } catch (e) { out.testNoKey = { error: String(e) }; }

  // Test 2: dengan key
  if (apiKey) {
    try {
      const r = await fetch('https://api.app.orbitcloud.web.id/api/v1/home?pages=1', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': apiKey,
        },
      });
      const body = await r.text();
      out.testWithKey = { status: r.status, ok: r.ok, preview: body.slice(0, 300) };
    } catch (e) { out.testWithKey = { error: String(e) }; }
  } else {
    out.testWithKey = 'SKIP — no key';
  }

  return NextResponse.json(out, { headers: { 'Cache-Control': 'no-store' } });
}
