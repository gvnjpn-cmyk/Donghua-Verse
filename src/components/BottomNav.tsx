'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, LayoutGrid, Bookmark, User } from 'lucide-react';

const TABS = [
  { href: '/',        label: 'Home',     icon: Home },
  { href: '/jadwal',  label: 'Jadwal',   icon: CalendarDays },
  { href: '/browse',  label: 'Katalog',  icon: LayoutGrid },
  { href: '/library', label: 'Library',  icon: Bookmark },
  { href: '/profile', label: 'Profil',   icon: User },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(8,8,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        height: 'var(--bottom-h)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-full max-w-2xl mx-auto px-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 flex-1 py-2 group transition-all"
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                active ? 'bg-cyan/10' : 'group-hover:bg-ink3'
              }`}>
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? 'var(--cyan)' : 'var(--muted)' }}
                />
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)' }} />
                )}
              </div>
              <span
                className="text-[10px] font-medium transition-colors"
                style={{ color: active ? 'var(--cyan)' : 'var(--muted)' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
