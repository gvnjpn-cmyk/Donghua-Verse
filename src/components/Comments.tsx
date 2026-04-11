'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Heart, Send, Trash2, CornerDownRight } from 'lucide-react';
import type { Comment } from '@/lib/types';

interface Props { episodeSlug: string }

const KEY   = (s: string) => `dv_comments_${s}`;
const genId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const EMOJI_AVATARS = ['🐉','⚔️','🌸','🔥','💫','🌙','🦊','🏯','🌊','🎭','🗡️','🪄'];
const AVATAR_COLORS = ['#00d4ff','#ff4466','#ffb830','#7c3aed','#059669','#dc2626'];

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const em  = EMOJI_AVATARS[name.charCodeAt(0) % EMOJI_AVATARS.length];
  const bg  = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className="flex-shrink-0 rounded-full flex items-center justify-center font-medium"
      style={{ width:size, height:size, background: bg + '22', border:`1.5px solid ${bg}44`, fontSize: size * 0.42 }}>
      {em}
    </div>
  );
}

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export default function Comments({ episodeSlug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    try {
      const c = localStorage.getItem(KEY(episodeSlug));
      if (c) setComments(JSON.parse(c));
      const n = localStorage.getItem('dv_username');
      if (n) setUserName(n);
    } catch {}
  }, [episodeSlug]);

  const persist = useCallback((list: Comment[]) => {
    setComments(list);
    localStorage.setItem(KEY(episodeSlug), JSON.stringify(list));
  }, [episodeSlug]);

  const saveName = () => {
    const n = nameInput.trim();
    if (!n) return;
    setUserName(n);
    localStorage.setItem('dv_username', n);
  };

  const send = () => {
    const t = text.trim();
    if (!t || !userName) return;

    if (replyTo) {
      const updated = comments.map(c =>
        c.id === replyTo.id
          ? { ...c, replies: [...(c.replies ?? []), { id:genId(), author:userName, content:t, timestamp:Date.now(), likes:0, episodeSlug }] }
          : c
      );
      persist(updated);
      setReplyTo(null);
    } else {
      persist([{ id:genId(), author:userName, content:t, timestamp:Date.now(), likes:0, episodeSlug, replies:[] }, ...comments]);
    }
    setText('');
  };

  const like = (id: string) => persist(comments.map(c => c.id === id ? { ...c, likes: c.likes+1 } : c));
  const del  = (id: string) => persist(comments.filter(c => c.id !== id));

  const total = comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <h3 className="font-display font-bold text-base text-white glow-line flex items-center gap-2 mb-5">
        <MessageCircle size={15} style={{ color:'var(--cyan)' }} />
        KOMENTAR
        {total > 0 && <span className="font-ui text-sm font-normal" style={{ color:'var(--muted)' }}>({total})</span>}
      </h3>

      {/* Name setup */}
      {!userName ? (
        <div className="p-4 rounded-2xl mb-5" style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
          <p className="text-xs mb-3" style={{ color:'var(--muted)' }}>Masukkan nama untuk berkomentar</p>
          <div className="flex gap-2">
            <input value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && saveName()}
              placeholder="Nama kamu..." maxLength={25}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background:'var(--ink4)', border:'1px solid var(--ink5)', color:'var(--text)' }} />
            <button onClick={saveName}
              className="px-4 py-2.5 rounded-xl text-sm font-bold"
              style={{ background:'var(--cyan)', color:'#000' }}>OK</button>
          </div>
        </div>
      ) : (
        /* Input area */
        <div className="p-3 rounded-2xl mb-6" style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
          {replyTo && (
            <div className="flex items-center justify-between mb-2 text-xs px-1">
              <span style={{ color:'var(--muted)' }}>
                Balas <span style={{ color:'var(--cyan)' }}>@{replyTo.name}</span>
              </span>
              <button onClick={() => { setReplyTo(null); setText(''); }}
                className="text-xs" style={{ color:'var(--muted)' }}>✕ Batal</button>
            </div>
          )}
          <div className="flex gap-2.5 items-start">
            <Avatar name={userName} size={32} />
            <div className="flex-1">
              <textarea value={text} onChange={e => setText(e.target.value.slice(0,400))}
                placeholder="Tulis komentar..."
                rows={2}
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none"
                style={{ background:'var(--ink4)', border:'1px solid var(--faint)', color:'var(--text)' }} />
              <div className="flex items-center justify-between mt-1.5 px-1">
                <span className="text-xs" style={{ color:'var(--faint)' }}>{text.length}/400</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color:'var(--muted)' }}>
                    sebagai <span style={{ color:'var(--cyan)' }}>{userName}</span>
                  </span>
                  <button onClick={send} disabled={!text.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                    style={{ background:'var(--cyan)', color:'#000' }}>
                    <Send size={11} />Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {!comments.length ? (
        <div className="rounded-2xl p-8 text-center" style={{ background:'var(--ink3)', border:'1px dashed var(--ink5)' }}>
          <MessageCircle size={28} className="mx-auto mb-2" style={{ color:'var(--faint)' }} />
          <p className="text-sm" style={{ color:'var(--muted)' }}>Jadilah yang pertama berkomentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id}>
              {/* Main comment */}
              <div className="flex gap-2.5 group">
                <Avatar name={c.author} size={34} />
                <div className="flex-1 min-w-0">
                  <div className="px-3.5 py-3 rounded-2xl rounded-tl-none"
                    style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-white">{c.author}</span>
                      <span className="text-[10px]" style={{ color:'var(--faint)' }}>{timeAgo(c.timestamp)}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color:'var(--text)' }}>{c.content}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 px-2">
                    <button onClick={() => like(c.id)}
                      className="flex items-center gap-1 text-xs transition-colors"
                      style={{ color:'var(--muted)' }}>
                      <Heart size={12} />
                      {c.likes > 0 && c.likes}
                    </button>
                    <button onClick={() => { setReplyTo({ id:c.id, name:c.author }); setText(`@${c.author} `); }}
                      className="flex items-center gap-1 text-xs transition-colors"
                      style={{ color:'var(--muted)' }}>
                      <CornerDownRight size={12} />Balas
                    </button>
                    {c.author === userName && (
                      <button onClick={() => del(c.id)}
                        className="text-xs opacity-0 group-hover:opacity-100 transition-all"
                        style={{ color:'var(--rose)' }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-10 mt-2 space-y-2 pl-3"
                  style={{ borderLeft:'2px solid var(--ink5)' }}>
                  {c.replies.map(r => (
                    <div key={r.id} className="flex gap-2">
                      <Avatar name={r.author} size={26} />
                      <div className="flex-1 min-w-0">
                        <div className="px-3 py-2 rounded-xl rounded-tl-none"
                          style={{ background:'var(--ink3)', border:'1px solid var(--ink5)' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-white">{r.author}</span>
                            <span className="text-[10px]" style={{ color:'var(--faint)' }}>{timeAgo(r.timestamp)}</span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color:'var(--text)' }}>{r.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
