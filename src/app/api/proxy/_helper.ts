import { NextResponse } from 'next/server';

const ORBIT_BASE = 'https://api.app.orbitcloud.web.id/api/v1';

export async function proxyGet(path: string) {
  const apiKey = process.env.ORBITCLOUD_API_KEY ?? '';
  const url    = `${ORBIT_BASE}${path}`;

  console.log(`[PROXY] ${url} | key=${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
    });

    const text = await res.text();
    console.log(`[PROXY] → ${res.status} | ${text.slice(0, 200)}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: `OrbitCloud ${res.status}`, detail: text.slice(0, 300) },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
      });
    } catch {
      return NextResponse.json({ error: 'Invalid JSON', raw: text.slice(0, 300) }, { status: 502 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[PROXY] FAILED: ${msg}`);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
