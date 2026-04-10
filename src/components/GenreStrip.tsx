'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props { genres: string[] }

export default function GenreStrip({ genres }: Props) {
  const [active, setActive] = useState('Donghua');
  const router = useRouter();

  const pick = (g: string) => {
    setActive(g);
    router.push(`/browse?genre=${encodeURIComponent(g)}`);
  };

  return (
    <div className="scroll-x gap-2">
      {genres.map(g => (
        <button
          key={g}
          onClick={() => pick(g)}
          className={`chip ${active === g ? 'active' : ''}`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
