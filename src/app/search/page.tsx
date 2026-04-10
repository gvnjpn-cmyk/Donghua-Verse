import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { searchDonghua } from '@/lib/api';
import type { Donghua } from '@/lib/types';
import DonghuaCard from '@/components/DonghuaCard';
import SearchForm from '@/components/SearchForm';
import { getItemSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';
interface Props { searchParams: { q?: string } }

async function Results({ q }: { q: string }) {
  let results: Donghua[] = [];
  let err = '';
  try { results = await searchDonghua(q); }
  catch (e) { err = e instanceof Error ? e.message : String(e); }

  if (err) return (
    <div className="mx-4 p-4 rounded-2xl text-xs font-mono" style={{ background:'rgba(255,68,102,0.1)', color:'var(--rose)', border:'1px solid rgba(255,68,102,0.3)' }}>
      {err}
    </div>
  );
  if (!results.length) return (
    <div className="text-center py-16 px-4">
      <Search size={40} className="mx-auto mb-3" style={{ color:'var(--faint)' }} />
      <p className="font-medium text-white mb-1">Tidak ditemukan</p>
      <p className="text-sm" style={{ color:'var(--muted)' }}>Coba kata kunci lain</p>
    </div>
  );
  return (
    <div className="px-4">
      <p className="text-xs mb-4" style={{ color:'var(--muted)' }}>
        <span className="text-white font-semibold">{results.length}</span> hasil untuk &ldquo;{q}&rdquo;
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {results.map((d, i) => <DonghuaCard key={getItemSlug(d) || String(i)} donghua={d} />)}
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? '';
  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-5">
        <h1 className="font-display font-bold text-2xl text-white mb-4">CARI DONGHUA</h1>
        <SearchForm initialQuery={q} />
      </div>
      {q ? (
        <Suspense fallback={
          <div className="px-4 grid grid-cols-3 gap-3">
            {Array.from({length:9}).map((_,i)=>(
              <div key={i} className="skeleton rounded-xl" style={{ aspectRatio:'3/4' }} />
            ))}
          </div>
        }>
          <Results q={q} />
        </Suspense>
      ) : (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto mb-3" style={{ color:'var(--faint)' }} />
          <p style={{ color:'var(--muted)' }}>Ketik judul untuk mencari</p>
        </div>
      )}
    </div>
  );
}
