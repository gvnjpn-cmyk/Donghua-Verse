'use client';

import { useState } from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface Props {
  src: string;
  title: string;
  episodeSlug: string;
}

export default function VideoPlayer({ src, title, episodeSlug }: Props) {
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div className="video-container flex items-center justify-center bg-bg-card border border-border rounded-xl">
        <div className="text-center p-8">
          <AlertCircle size={40} className="text-text-muted mx-auto mb-3" />
          <p className="text-text-muted text-sm">Link streaming tidak tersedia</p>
          <p className="text-text-faint text-xs mt-1">Coba episode lain atau kembali nanti</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-container flex items-center justify-center bg-bg-card border border-border rounded-xl">
        <div className="text-center p-8">
          <AlertCircle size={40} className="text-primary mx-auto mb-3" />
          <p className="text-text font-medium mb-2">Gagal memuat video</p>
          <p className="text-text-muted text-sm mb-4">
            Coba buka link langsung di browser
          </p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm rounded-full transition-colors"
          >
            <ExternalLink size={14} />
            Buka Link Langsung
          </a>
          <button
            onClick={() => setError(false)}
            className="block mt-2 text-xs text-text-muted hover:text-text transition-colors mx-auto"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-card">
      {/* Video */}
      <div className="video-container">
        <iframe
          src={src}
          title={title}
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          onError={() => setError(true)}
          className="w-full h-full"
          scrolling="no"
          frameBorder="0"
        />
      </div>

      {/* Under-player bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-bg-card border-t border-border">
        <span className="text-xs text-text-muted">{title}</span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
        >
          <ExternalLink size={12} />
          Buka di Tab Baru
        </a>
      </div>
    </div>
  );
}
