'use client';

import { useEffect, useState } from 'react';
import { User, Clock, Bookmark, LogIn } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [histCount, setHistCount] = useState(0);
  const [libCount, setLibCount] = useState(0);

  useEffect(() => {
    const n = localStorage.getItem('dv_username') ?? '';
    setName(n);
    try {
      const h = JSON.parse(localStorage.getItem('dv_watch_history') ?? '[]');
      const l = JSON.parse(localStorage.getItem('dv_library') ?? '[]');
      setHistCount(h.length); setLibCount(l.length);
    } catch {}
  }, []);

  const save = () => {
    const n = input.trim();
    if (!n) return;
    localStorage.setItem('dv_username', n);
    setName(n); setEditing(false);
  };

  return (
    <div style={{ paddingTop: 68, paddingBottom: 24 }}>
      <div className="px-4 mb-6">
        <h1 className="font-display font-bold text-2xl text-white">PROFIL</h1>
      </div>

      <div className="mx-4 p-5 rounded-2xl mb-5 flex items-center gap-4"
        style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-display text-2xl font-bold text-black"
          style={{ background:'var(--cyan)', boxShadow:'0 0 20px rgba(0,212,255,0.3)' }}>
          {name ? name[0].toUpperCase() : <User size={24} />}
        </div>
        <div className="flex-1 min-w-0">
          {name ? (
            <>
              <p className="text-xs font-medium mb-0.5" style={{ color:'var(--muted)' }}>Selamat datang,</p>
              <p className="font-display font-bold text-xl text-white">{name}</p>
              <button onClick={() => { setInput(name); setEditing(true); }}
                className="text-xs mt-1" style={{ color:'var(--cyan)' }}>Ubah nama</button>
            </>
          ) : (
            <div>
              <p className="text-sm font-medium text-white mb-0.5">Belum ada nama</p>
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold mt-1 px-3 py-1.5 rounded-xl"
                style={{ background:'var(--cyan)', color:'#000' }}>
                <LogIn size={12} />Set Nama
              </button>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="mx-4 p-4 rounded-2xl mb-5" style={{ background:'var(--ink3)', border:'1px solid rgba(0,212,255,0.3)' }}>
          <p className="text-sm font-semibold text-white mb-3">Nama kamu</p>
          <div className="flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && save()}
              maxLength={30} placeholder="Masukkan nama..."
              className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
              style={{ background:'var(--ink4)', border:'1px solid var(--ink5)', color:'var(--text)' }} />
            <button onClick={save} className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background:'var(--cyan)', color:'#000' }}>Simpan</button>
          </div>
        </div>
      )}

      <div className="mx-4 grid grid-cols-2 gap-3 mb-5">
        {[
          { icon: Clock, label:'Riwayat', val: histCount },
          { icon: Bookmark, label:'Library', val: libCount },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
            <Icon size={20} className="mb-2" style={{ color:'var(--cyan)' }} />
            <p className="text-2xl font-display font-bold text-white">{val}</p>
            <p className="text-xs mt-0.5" style={{ color:'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="mx-4">
        <button onClick={() => {
            localStorage.removeItem('dv_watch_history');
            localStorage.removeItem('dv_library');
            setHistCount(0); setLibCount(0);
          }}
          className="w-full py-3 rounded-2xl text-sm font-medium"
          style={{ background:'rgba(255,68,102,0.1)', color:'var(--rose)', border:'1px solid rgba(255,68,102,0.2)' }}>
          Hapus Semua Data Lokal
        </button>
      </div>
    </div>
  );
}
