import { getHome } from '@/lib/api';
import type { Donghua, HomeData } from '@/lib/types';
import HeroBanner from '@/components/HeroBanner';
import DonghuaRow from '@/components/DonghuaRow';

export const revalidate = 180;

function toList(v: unknown): Donghua[] {
  return Array.isArray(v) ? (v as Donghua[]) : [];
}

export default async function HomePage() {
  let home: HomeData = {};
  try {
    home = await getHome(1);
  } catch {
    // API gagal — tampilkan fallback
  }

  const populer = toList(home.populer ?? home.slider ?? home.popular);
  const terbaru = toList(home.terbaru ?? home.ongoing ?? home.latest);
  const tamat   = toList(home.tamat   ?? home.completed);

  const heroItems = populer.length ? populer : terbaru.slice(0, 8);

  return (
    <div className="pt-16">
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      <div className="max-w-7xl mx-auto space-y-2 pb-12">
        {terbaru.length > 0 && (
          <DonghuaRow title="TERBARU UPDATE" items={terbaru} href="/browse?sort=terbaru" variant="wide" />
        )}
        {populer.length > 0 && (
          <DonghuaRow title="POPULER" items={populer} href="/browse?sort=populer" />
        )}
        {tamat.length > 0 && (
          <DonghuaRow title="SUDAH TAMAT" items={tamat} href="/browse?sort=tamat" />
        )}

        {!terbaru.length && !populer.length && !tamat.length && (
          <div className="flex flex-col items-center justify-center py-32 text-text-muted">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg font-semibold">Tidak dapat memuat konten</p>
            <p className="text-sm mt-2">Pastikan ORBITCLOUD_API_KEY sudah diset di Vercel</p>
          </div>
        )}
      </div>
    </div>
  );
}
