import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { searchDonghua } from '@/lib/api';
import type { Donghua } from '@/lib/types';
import DonghuaCard from '@/components/DonghuaCard';
import SearchForm from '@/components/SearchForm';
import { getItemSlug } from '@/lib/utils';

interface Props {
  searchParams: { q?: string; pages?: string };
}

export async function generateMetadata({ searchParams }: Props) {
  return { title: searchParams.q ? `Hasil: ${searchParams.q}` : 'Cari Donghua' };
}

async function Results({ q, pages }: { q: string; pages: number }) {
  let results: Donghua[] = [];
  try {
    results = await searchDonghua(q, pages);
  } catch {
    return <p className="text-center text-text-muted py-12">Gagal mencari. Coba lagi.</p>;
  }

  if (!results.length) {
    return (
      <div className="text-center py-16">
        <Search size={48} className="text-text-faint mx-auto mb-4" />
        <p className="text-text-muted font-medium">Tidak ada hasil untuk &ldquo;{q}&rdquo;</p>
        <p className="text-sm text-text-faint mt-2">Coba kata kunci lain</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-text-muted text-sm mb-5">
        <span className="text-white font-semibold">{results.length}</span> hasil untuk &ldquo;{q}&rdquo;
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((d, i) => (
          <DonghuaCard key={getItemSlug(d) || String(i)} donghua={d} variant="wide" />
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton rounded-xl" style={{ aspectRatio: '3/4' }} />
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: Props) {
  const q     = searchParams.q?.trim() ?? '';
  const pages = parseInt(searchParams.pages ?? '1');

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-4">CARI DONGHUA</h1>
        <div className="mb-8"><SearchForm initialQuery={q} /></div>

        {q ? (
          <Suspense fallback={<Skeleton />}>
            <Results q={q} pages={pages} />
          </Suspense>
        ) : (
          <div className="text-center py-16">
            <Search size={56} className="text-text-faint mx-auto mb-4" />
            <p className="text-text-muted">Ketik judul donghua di kolom pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
