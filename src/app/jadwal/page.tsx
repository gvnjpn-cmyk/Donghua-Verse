import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { getJadwal } from '@/lib/api';
import type { ScheduleItem } from '@/lib/types';
import { getTitle, getCoverImg, getEpDisplay } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const DAYS_ID = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
const DAYS_EN = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default async function JadwalPage() {
  const map: Record<string, ScheduleItem[]> = {};
  let fetchErr = '';

  try {
    const raw = await getJadwal();
    console.log('[JADWAL] raw type:', typeof raw, Array.isArray(raw));

    if (Array.isArray(raw)) {
      raw.forEach(s => {
        const day  = String(s.day ?? s.hari ?? '').toLowerCase();
        const list = (s.donghua ?? s.data ?? s.list ?? []) as ScheduleItem[];
        if (day) map[day] = list;
      });
    } else if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;
      Object.keys(obj).forEach(k => {
        if (Array.isArray(obj[k])) map[k.toLowerCase()] = obj[k] as ScheduleItem[];
      });
    }
  } catch (err) {
    fetchErr = err instanceof Error ? err.message : String(err);
    console.error('[JADWAL] error:', fetchErr);
  }

  const todayID = new Date().toLocaleDateString('id-ID', { weekday:'long' }).toLowerCase();

  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={20} style={{ color:'var(--cyan)' }} />
          <h1 className="font-display font-bold text-2xl text-white">JADWAL TAYANG</h1>
        </div>
        <p className="text-xs" style={{ color:'var(--muted)' }}>Update episode mingguan</p>
      </div>

      {fetchErr && (
        <div className="mx-4 mb-4 p-3 rounded-xl text-xs font-mono"
          style={{ background:'rgba(255,68,102,0.1)', color:'var(--rose)', border:'1px solid rgba(255,68,102,0.3)' }}>
          {fetchErr}
        </div>
      )}

      {!Object.keys(map).length ? (
        <div className="mx-4 rounded-2xl p-10 text-center" style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
          <CalendarDays size={40} className="mx-auto mb-3" style={{ color:'var(--faint)' }} />
          <p style={{ color:'var(--muted)' }}>Jadwal belum tersedia</p>
        </div>
      ) : (
        <div className="space-y-8">
          {DAYS_ID.map((dayID, i) => {
            const key   = DAYS_EN[i];
            const items = map[key] ?? map[dayID.toLowerCase()] ?? [];
            if (!items.length) return null;
            const isToday = todayID.includes(dayID.toLowerCase()) || todayID.includes(key);
            return (
              <section key={dayID}>
                <div className="flex items-center gap-3 px-4 mb-3">
                  <h2 className="font-display font-bold text-lg"
                    style={isToday ? { color:'var(--cyan)' } : { color:'white' }}>
                    {dayID.toUpperCase()}
                  </h2>
                  {isToday && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                      style={{ background:'var(--rose)', color:'#fff' }}>HARI INI</span>
                  )}
                  <span className="text-xs" style={{ color:'var(--muted)' }}>{items.length} judul</span>
                </div>
                <div className="pl-4 scroll-x gap-3">
                  {items.map((item, idx) => {
                    const ep = getEpDisplay(item as ScheduleItem & { ep?: string; episode?: number | string });
                    return (
                      <Link key={idx} href={item.slug ? `/donghua/${item.slug}` : '#'}
                        className="relative flex-shrink-0 rounded-xl overflow-hidden group"
                        style={{ width:110, height:155 }}>
                        <Image src={getCoverImg(item)} alt={getTitle(item)} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="110px" />
                        <div className="absolute inset-0 grad-b" />
                        {(item.time ?? item.jam) && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                            style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(4px)' }}>
                            <Clock size={9} style={{ color:'var(--amber)' }} />
                            <span className="text-[10px] font-medium" style={{ color:'var(--amber)' }}>
                              {item.time ?? item.jam}
                            </span>
                          </div>
                        )}
                        {ep && <span className="badge-ep">{ep}</span>}
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-[11px] font-semibold text-white clamp-2">{getTitle(item)}</p>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="w-2 flex-shrink-0" />
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
