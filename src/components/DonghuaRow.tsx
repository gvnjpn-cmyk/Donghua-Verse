import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import DonghuaCard from './DonghuaCard';
import type { Donghua } from '@/lib/types';

interface Props {
  title: string;
  items: Donghua[];
  href?: string;
  variant?: 'default' | 'wide';
}

export default function DonghuaRow({ title, items, href, variant = 'default' }: Props) {
  if (!items || !items.length) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="section-title">{title}</h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
          >
            Lihat Semua <ChevronRight size={15} />
          </Link>
        )}
      </div>

      <div className="pl-4 sm:pl-6 max-w-7xl mx-auto">
        <div className="scroll-row">
          {items.map((d, i) => (
            <DonghuaCard
              key={String(d.id ?? d.slug ?? i)}
              donghua={d}
              variant={variant === 'wide' ? 'wide' : 'default'}
            />
          ))}
          {/* Spacer at end */}
          <div className="w-4 flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
