import { getHome } from '@/lib/api';
import type { Donghua, HomeData } from '@/lib/types';
import HeroBanner from '@/components/HeroBanner';
import DonghuaRow from '@/components/DonghuaRow';
import { getTitle, getItemSlug } from '@/lib/utils';

export const revalidate = 180; // 3 menit

function normalizeList(raw: unknown): Donghua[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Donghua[];
  return [];
}

export default async function HomePage() {
  let homeData: HomeData = {};

  try {
    homeData = await getHome(1);
  } catch (err) {
    console.error('Failed to fetch home:', err);
  }

  // OrbitCloud /home kemungkinan ada berbagai key — coba semua
  const populer = normalizeList(
    homeData.populer ?? homeData.slider ?? homeData.popular
  );
  const terbaru = normalizeList(
    homeData.terbaru ?? homeData.ongoing ?? homeData.latest
  );
  const tamat = normalizeList(
    homeData.tamat ?? homeData.completed ?? homeData.data
  );

  // Gabung semua untuk hero jika kosong
  const heroItems = populer.length ? populer : [...terbaru].slice(0, 8);

  return (
    <div className="pt-16">
      {/* Hero Slider */}
      {heroItems.length > 0 && <HeroBanner items={heroItems} />}

      <div className="max-w-7xl mx-auto space-y-2 pb-12">
        {/* Terbaru Update */}
        {terbaru.length > 0 && (
          <DonghuaRow
            title="TERBARU UPDATE"
            items={terbaru}
            href="/browse?sort=terbaru"
            variant="wide"
          />
        )}

        {/* Populer */}
        {populer.length > 0 && (
          <DonghuaRow
            title="POPULER"
            items={populer}
            href="/browse?sort=populer"
          />
        )}

        {/* Tamat */}
        {tamat.length > 0 && (
          <DonghuaRow
            title="SUDAH TAMAT"
            items={tamat}
            href="/browse?sort=tamat"
          />
        )}

        {/* Fallback jika semua kosong */}
        {!terbaru.length && !populer.length && !tamat.length && (
          <div className="flex flex-col items-center justify-center py-32 text-text-muted">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-lg font-semibold">Tidak dapat memuat konten</p>
            <p className="text-sm mt-2">Pastikan ORBITCLOUD_API_KEY sudah diset di .env</p>
          </div>
        )}
      </div>
    </div>
  );
}
