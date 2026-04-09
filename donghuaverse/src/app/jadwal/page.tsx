import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { getJadwal } from '@/lib/api';
import type { Schedule, ScheduleItem } from '@/lib/types';
import { getTitle, getCoverImg } from '@/lib/utils';

export const revalidate = 3600;

const DAYS_ID = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAYS_EN = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default async function JadwalPage() {
  let rawSchedule: Schedule[] = [];
  let scheduleMap: Record<string, ScheduleItem[]> = {};

  try {
    rawSchedule = await getJadwal();

    // OrbitCloud bisa return array of {day, donghua[]} atau objek {senin: [], selasa: []}
    if (Array.isArray(rawSchedule)) {
      rawSchedule.forEach((s) => {
        const day = (s.day || s.hari || '') as string;
        const items = (s.donghua || s.data || s.list || []) as ScheduleItem[];
        if (day) scheduleMap[day.toLowerCase()] = items;
      });
    } else {
      // Mungkin object: { senin: [...], selasa: [...] }
      const raw = rawSchedule as unknown as Record<string, ScheduleItem[]>;
      Object.keys(raw).forEach((k) => {
        if (Array.isArray(raw[k])) scheduleMap[k.toLowerCase()] = raw[k];
      });
    }
  } catch (err) {
    console.error('Failed to fetch jadwal:', err);
  }

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase();

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Calendar size={28} className="text-primary" />
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white tracking-wide">
              JADWAL TAYANG
            </h1>
            <p className="text-text-muted text-sm">Update episode mingguan</p>
          </div>
        </div>

        {Object.keys(scheduleMap).length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <Calendar size={48} className="text-text-faint mx-auto mb-3" />
            <p>Jadwal belum tersedia</p>
          </div>
        ) : (
          <div className="space-y-8">
            {DAYS_ID.map((dayID, i) => {
              const key = DAYS_EN[i];
              const items = scheduleMap[key] || scheduleMap[dayID.toLowerCase()] || [];
              const isToday = today.includes(dayID.toLowerCase()) || today.includes(key);

              if (!items.length) return null;

              return (
                <section key={dayID}>
                  {/* Day heading */}
                  <div className="flex items-center gap-3 mb-4">
                    <h2
                      className={`font-display text-2xl tracking-wide ${
                        isToday ? 'text-primary' : 'text-white'
                      }`}
                    >
                      {dayID.toUpperCase()}
                    </h2>
                    {isToday && (
                      <span className="badge-red text-xs animate-pulse-slow">HARI INI</span>
                    )}
                    <span className="text-text-muted text-sm">{items.length} judul</span>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {items.map((item, idx) => {
                      const title = getTitle(item);
                      const cover = getCoverImg(item);
                      const slug = item.slug || '';

                      return (
                        <Link
                          key={idx}
                          href={slug ? `/donghua/${slug}` : '#'}
                          className="group bg-bg-card border border-border hover:border-primary/30 rounded-xl overflow-hidden transition-all hover:shadow-glow-sm"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={cover}
                              alt={title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="180px"
                            />
                            <div className="absolute inset-0 gradient-bottom opacity-80" />
                          </div>
                          <div className="p-2">
                            <p className="text-xs font-semibold text-text line-clamp-2 leading-snug">
                              {title}
                            </p>
                            {(item.time || item.jam) && (
                              <p className="flex items-center gap-1 text-xs text-text-muted mt-1">
                                <Clock size={10} />
                                {item.time || item.jam}
                              </p>
                            )}
                            {item.episode && (
                              <p className="text-xs text-primary mt-0.5">Ep {item.episode}</p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
