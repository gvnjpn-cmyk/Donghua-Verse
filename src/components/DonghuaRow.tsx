import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import DonghuaCard from './DonghuaCard';
import type { Donghua } from '@/lib/types';

interface Props {
  title: string;
  items: Donghua[];
  href?: string;
  variant?: 'portrait' | 'landscape';
  icon?: React.ReactNode;
}

export default function DonghuaRow({ title, items, href, variant = 'portrait', icon }: Props) {
  if (!items?.length) return null;
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="glow-line font-display font-bold text-lg text-white flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {href && (
          <Link href={href} className="flex items-center gap-0.5 text-xs font-medium"
            style={{ color:'var(--muted)' }}>
            Lihat Semua <ChevronRight size={13} />
          </Link>
        )}
      </div>
      <div className="pl-4 scroll-x">
        {items.map((d, i) => (
          <DonghuaCard key={String(d.id ?? d.slug ?? i)} donghua={d} variant={variant} />
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </section>
  );
}
