import { Tv2 } from 'lucide-react';
import { getHome } from '@/lib/api';
import type { Donghua } from '@/lib/types';
import DonghuaCard from '@/components/DonghuaCard';
import { getItemSlug } from '@/lib/utils';

export const revalidate = 300;

interface Props { searchParams: { sort?: string } }

const SORT_OPTS = [
  { key: 'terbaru', label: 'Terbaru' },
  { key: 'populer', label: 'Populer' },
  { key: 'tamat',   label: 'Sudah Tamat' },
];

export default async function BrowsePage({ searchParams }: Props) {
  const sort = searchParams.sort ?? 'terbaru';
  let items: Donghua[] = [];

  try {
    const data = await getHome(2);
    if (sort === 'populer')     items = (data.populer ?? data.slider ?? data.popular ?? []) as Donghua[];
    else if (sort === 'tamat')  items = (data.tamat   ?? data.completed ?? []) as Donghua[];
    else                        items = (data.terbaru ?? data.ongoing   ?? data.latest ?? []) as Donghua[];
    if (!items.length) items = (data.data ?? []) as Donghua[];
  } catch {
    // silently fail
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Tv2 size={28} className="text-primary" />
          <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide">BROWSE DONGHUA</h1>
        </div>

        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {SORT_OPTS.map(({ key, label }) => (
            <a key={key} href={`/browse?sort=${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                sort === key
                  ? 'bg-primary border-primary text-white shadow-glow-sm'
                  : 'border-border text-text-muted hover:border-border-light hover:text-text bg-bg-card'
              }`}>
              {label}
            </a>
          ))}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((d, i) => (
              <DonghuaCard key={getItemSlug(d) || String(i)} donghua={d} variant="wide" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <Tv2 size={48} className="text-text-faint mx-auto mb-3" />
            <p>Tidak ada konten tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
