import { LayoutGrid } from 'lucide-react';
import { getHome } from '@/lib/api';
import type { Donghua } from '@/lib/types';
import DonghuaCard from '@/components/DonghuaCard';
import { getItemSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';
interface Props { searchParams: { sort?: string } }

const TABS = [
  { key: 'terbaru', label: 'Terbaru' },
  { key: 'populer', label: 'Populer' },
  { key: 'tamat',   label: 'Tamat' },
];

export default async function BrowsePage({ searchParams }: Props) {
  const sort = searchParams.sort ?? 'terbaru';
  let items: Donghua[] = [];

  try {
    const d = await getHome(2);
    console.log('[BROWSE] home keys:', Object.keys(d));

    if (sort === 'populer')    items = (d.populer ?? d.popular ?? d.slider ?? []) as Donghua[];
    else if (sort === 'tamat') items = (d.tamat ?? d.completed ?? []) as Donghua[];
    else                       items = (d.terbaru ?? d.latest ?? d.ongoing ?? []) as Donghua[];

    if (!items.length) {
      // fallback: ambil array apapun yang ada
      for (const key of Object.keys(d)) {
        const val = (d as Record<string, unknown>)[key];
        if (Array.isArray(val) && val.length > 0) { items = val as Donghua[]; break; }
      }
    }
  } catch (err) {
    console.error('[BROWSE] error:', err);
  }

  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <LayoutGrid size={20} style={{ color:'var(--cyan)' }} />
          <h1 className="font-display font-bold text-2xl text-white">KATALOG</h1>
        </div>
      </div>
      <div className="px-4 flex gap-2 mb-5">
        {TABS.map(({ key, label }) => (
          <a key={key} href={`/browse?sort=${key}`}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={sort === key
              ? { background:'var(--cyan)', color:'#000', fontWeight:700 }
              : { background:'var(--ink3)', color:'var(--muted)', border:'1px solid var(--ink5)' }}>
            {label}
          </a>
        ))}
      </div>
      {items.length > 0 ? (
        <div className="px-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {items.map((d, i) => (
            <DonghuaCard key={getItemSlug(d) || String(i)} donghua={d} />
          ))}
        </div>
      ) : (
        <div className="mx-4 rounded-2xl p-10 text-center" style={{ background:'var(--ink3)' }}>
          <p style={{ color:'var(--muted)' }}>Tidak ada konten</p>
          <a href="/api/debug" target="_blank" className="text-xs underline mt-2 block" style={{ color:'var(--cyan)' }}>Debug API</a>
        </div>
      )}
    </div>
  );
}
