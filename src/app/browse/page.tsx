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
    if (sort === 'populer')    items = (d.populer ?? d.slider ?? d.popular ?? []) as Donghua[];
    else if (sort === 'tamat') items = (d.tamat ?? d.completed ?? []) as Donghua[];
    else                       items = (d.terbaru ?? d.ongoing ?? d.latest ?? []) as Donghua[];
    if (!items.length) items = (d.data ?? []) as Donghua[];
  } catch {}

  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <LayoutGrid size={20} style={{ color:'var(--cyan)' }} />
          <h1 className="font-display font-bold text-2xl text-white">KATALOG</h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 flex gap-2 mb-5">
        {TABS.map(({ key, label }) => (
          <a key={key} href={`/browse?sort=${key}`}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={sort === key
              ? { background:'var(--cyan)', color:'#000', fontWeight:700 }
              : { background:'var(--ink3)', color:'var(--muted)', border:'1px solid var(--ink5)' }
            }>
            {label}
          </a>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {items.map((d, i) => (
            <DonghuaCard key={getItemSlug(d) || String(i)} donghua={d} variant="portrait" />
          ))}
        </div>
      ) : (
        <div className="mx-4 rounded-2xl p-10 text-center" style={{ background:'var(--ink3)' }}>
          <LayoutGrid size={40} className="mx-auto mb-3" style={{ color:'var(--faint)' }} />
          <p style={{ color:'var(--muted)' }}>Tidak ada konten</p>
        </div>
      )}
    </div>
  );
}
