import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { getJadwal } from '@/lib/api';
import type { ScheduleItem } from '@/lib/types';
import { getTitle, getCoverImg } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const DAYS_ID = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
const DAYS_EN = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default async function JadwalPage() {
  const map: Record<string, ScheduleItem[]> = {};
  try {
    const raw = await getJadwal();
    if (Array.isArray(raw)) {
      raw.forEach(s => {
        const day = String(s.day ?? s.hari ?? '').toLowerCase();
        const list = (s.donghua ?? s.data ?? s.list ?? []) as ScheduleItem[];
        if (day) map[day] = list;
      });
    } else {
      const obj = raw as unknown as Record<string, ScheduleItem[]>;
      Object.keys(obj).forEach(k => { if (Array.isArray(obj[k])) map[k.toLowerCase()] = obj[k]; });
    }
  } catch {}

  const todayID = new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();

  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays size={20} style={{ color:'var(--cyan)' }} />
          <h1 className="font-display font-bold text-2xl text-white">JADWAL TAYANG</h1>
        </div>
        <p className="text-xs" style={{ color:'var(--muted)' }}>Update episode mingguan</p>
      </div>

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
            const isToday = todayID.includes(dayID.toLowerCase()) || todayID.includes(key);
            if (!items.length) return null;

            return (
              <section key={dayID}>
                <div className="flex items-center gap-3 px-4 mb-3">
                  <h2 className={`font-display font-bold text-lg ${isToday ? '' : 'text-white'}`}
                    style={isToday ? { color:'var(--cyan)' } : {}}>
                    {dayID.toUpperCase()}
                  </h2>
                  {isToday && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md animate-pulse-slow"
                      style={{ background:'var(--rose)', color:'#fff' }}>HARI INI</span>
                  )}
                  <span className="text-xs" style={{ color:'var(--muted)' }}>{items.length} judul</span>
                </div>

                <div className="pl-4 scroll-x gap-3">
                  {items.map((item, idx) => (
                    <Link key={idx} href={item.slug ? `/donghua/${item.slug}` : '#'}
                      className="relative flex-shrink-0 rounded-xl overflow-hidden group"
                      style={{ width:110, height:155 }}>
                      <Image src={getCoverImg(item)} alt={getTitle(item)} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="110px" />
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
                      {item.episode && (
                        <span className="badge-ep">Ep {item.episode}</span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[11px] font-semibold text-white clamp-2">{getTitle(item)}</p>
                      </div>
                    </Link>
                  ))}
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
