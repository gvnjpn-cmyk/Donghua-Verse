'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="absolute top-14 left-4 w-10 h-10 rounded-2xl flex items-center justify-center z-20"
      style={{ background:'rgba(8,8,15,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)' }}
    >
      <ArrowLeft size={18} className="text-white" />
    </button>
  );
}
