'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Heart, Send, Trash2, Reply, ChevronDown } from 'lucide-react';
import type { Comment } from '@/lib/types';

interface Props {
  episodeSlug: string;
}

const STORAGE_KEY = (slug: string) => `dv_comments_${slug}`;
const MAX_CHARS = 500;

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(ts));
}

function genId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const AVATARS = ['🐉', '⚔️', '🌸', '🔥', '💫', '🌙', '🦊', '🏯', '🌊', '🎭'];
const AVATAR_COLORS = ['#e63946', '#f4a261', '#457b9d', '#2a9d8f', '#8338ec', '#06d6a0'];

function getAvatarBg(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const emoji = AVATARS[name.charCodeAt(0) % AVATARS.length];
  const bg = getAvatarBg(name);
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-xs"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.4 }}
    >
      {emoji}
    </div>
  );
}

function CommentItem({
  comment,
  onLike,
  onDelete,
  onReply,
  userName,
}: {
  comment: Comment;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (id: string, name: string) => void;
  userName: string;
}) {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar name={comment.author} />
        <div className="flex-1 min-w-0">
          <div className="bg-bg-card border border-border rounded-xl rounded-tl-none px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-semibold text-white">{comment.author}</span>
              <span className="text-xs text-text-muted">{timeAgo(comment.timestamp)}</span>
            </div>
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1 px-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
            >
              <Heart size={13} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
            <button
              onClick={() => onReply(comment.id, comment.author)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
            >
              <Reply size={13} />
              Balas
            </button>
            {comment.author === userName && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-2">
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors mb-2"
          >
            <ChevronDown size={13} className={`transition-transform ${showReplies ? 'rotate-180' : ''}`} />
            {comment.replies.length} balasan
          </button>
          {showReplies && (
            <div className="space-y-3 border-l-2 border-border pl-3">
              {comment.replies.map((r) => (
                <div key={r.id} className="flex gap-2">
                  <Avatar name={r.author} size={28} />
                  <div className="flex-1">
                    <div className="bg-bg-card border border-border rounded-xl rounded-tl-none px-3 py-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-white">{r.author}</span>
                        <span className="text-xs text-text-muted">{timeAgo(r.timestamp)}</span>
                      </div>
                      <p className="text-xs text-text">{r.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Comments({ episodeSlug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [hasName, setHasName] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [sortNewest, setSortNewest] = useState(true);

  // Load dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY(episodeSlug));
    if (stored) {
      try { setComments(JSON.parse(stored)); } catch {}
    }
    const storedName = localStorage.getItem('dv_username');
    if (storedName) {
      setUserName(storedName);
      setHasName(true);
    }
  }, [episodeSlug]);

  const save = useCallback((newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(STORAGE_KEY(episodeSlug), JSON.stringify(newComments));
  }, [episodeSlug]);

  const handleSetName = () => {
    const n = nameInput.trim();
    if (!n) return;
    setUserName(n);
    setHasName(true);
    localStorage.setItem('dv_username', n);
  };

  const handleSubmit = () => {
    const text = content.trim();
    if (!text || !userName) return;

    if (replyTo) {
      // Add reply
      const updated = comments.map((c) => {
        if (c.id === replyTo.id) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: genId(),
                author: userName,
                content: text,
                timestamp: Date.now(),
                likes: 0,
                episodeSlug,
              },
            ],
          };
        }
        return c;
      });
      save(updated);
      setReplyTo(null);
    } else {
      const newComment: Comment = {
        id: genId(),
        author: userName,
        content: text,
        timestamp: Date.now(),
        likes: 0,
        episodeSlug,
        replies: [],
      };
      save([newComment, ...comments]);
    }
    setContent('');
  };

  const handleLike = (id: string) => {
    save(comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)));
  };

  const handleDelete = (id: string) => {
    save(comments.filter((c) => c.id !== id));
  };

  const handleReply = (id: string, name: string) => {
    setReplyTo({ id, name });
    setContent(`@${name} `);
  };

  const sorted = sortNewest
    ? [...comments].sort((a, b) => b.timestamp - a.timestamp)
    : [...comments].sort((a, b) => a.timestamp - b.timestamp);

  const totalComments = comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          KOMENTAR
          {totalComments > 0 && (
            <span className="text-base text-text-muted font-body font-normal ml-1">
              ({totalComments})
            </span>
          )}
        </h3>
        <button
          onClick={() => setSortNewest((v) => !v)}
          className="text-xs text-text-muted hover:text-text border border-border hover:border-border-light px-3 py-1.5 rounded-full transition-all"
        >
          {sortNewest ? 'Terbaru' : 'Terlama'}
        </button>
      </div>

      {/* Name setup */}
      {!hasName ? (
        <div className="bg-bg-card border border-border rounded-2xl p-5 mb-5">
          <p className="text-sm text-text-muted mb-3">
            Masukkan nama kamu untuk berkomentar
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
              placeholder="Nama kamu..."
              maxLength={30}
              className="flex-1 bg-bg-secondary border border-border rounded-full px-4 py-2 text-sm text-text outline-none focus:border-primary transition-colors placeholder-text-faint"
            />
            <button
              onClick={handleSetName}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-colors"
            >
              Simpan
            </button>
          </div>
        </div>
      ) : (
        /* Comment input */
        <div className="bg-bg-card border border-border rounded-2xl p-4 mb-6">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs text-text-muted">
                Membalas <span className="text-primary font-medium">@{replyTo.name}</span>
              </span>
              <button
                onClick={() => { setReplyTo(null); setContent(''); }}
                className="text-xs text-text-muted hover:text-text"
              >
                ✕ Batal
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <Avatar name={userName} />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Tulis komentar..."
                rows={3}
                className="w-full bg-bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-primary transition-colors resize-none placeholder-text-faint"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-text-faint">
                  {content.length}/{MAX_CHARS}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">
                    sebagai <span className="text-primary">{userName}</span>
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    <Send size={13} />
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      {sorted.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-2xl">
          <MessageSquare size={32} className="text-text-faint mx-auto mb-2" />
          <p className="text-text-muted text-sm">Belum ada komentar. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sorted.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onLike={handleLike}
              onDelete={handleDelete}
              onReply={handleReply}
              userName={userName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
