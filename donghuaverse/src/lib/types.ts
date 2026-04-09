export interface Donghua {
  id?: string | number;
  slug?: string;
  title?: string;
  judul?: string;
  title_english?: string;
  judul_english?: string;
  synopsis?: string;
  sinopsis?: string;
  deskripsi?: string;
  cover?: string;
  thumbnail?: string;
  poster?: string;
  image?: string;
  gambar?: string;
  genres?: string[];
  genre?: string | string[];
  status?: string;
  type?: string;
  score?: number | string;
  rating?: number | string;
  total_episode?: number | string;
  episodes?: Episode[];
  episode_list?: Episode[];
  daftar_episode?: Episode[];
  year?: number | string;
  tahun?: number | string;
  season?: string;
  studio?: string;
  views?: number | string;
  updated_at?: string;
  latest_episode?: number | string;
  episode_terakhir?: string | number;
  episode?: number | string;
}

export interface Episode {
  id?: string | number;
  number?: number;
  episode?: number | string;
  title?: string;
  judul?: string;
  slug?: string;
  url?: string;
  stream_url?: string;
  embed_url?: string;
  thumbnail?: string;
  date?: string;
  tanggal?: string;
}

export interface EpisodeDetail {
  slug?: string;
  title?: string;
  judul?: string;
  episode?: number | string;
  stream_url?: string;
  embed_url?: string;
  iframe?: string;
  video_url?: string;
  link?: string;
  server?: string;
  servers?: VideoServer[];
  thumbnail?: string;
  prev?: string | null;
  next?: string | null;
  prev_episode?: string | null;
  next_episode?: string | null;
  donghua?: Donghua;
}

export interface VideoServer {
  name: string;
  url: string;
  quality?: string;
}

// Pakai Record biar gak conflict dengan index signature di TS strict
export type HomeData = Record<string, unknown> & {
  populer?: Donghua[];
  terbaru?: Donghua[];
  tamat?: Donghua[];
  slider?: Donghua[];
  ongoing?: Donghua[];
  completed?: Donghua[];
  popular?: Donghua[];
  latest?: Donghua[];
  data?: Donghua[];
};

export interface ScheduleItem {
  id?: string | number;
  slug?: string;
  title?: string;
  judul?: string;
  cover?: string;
  thumbnail?: string;
  image?: string;
  gambar?: string;
  time?: string;
  jam?: string;
  episode?: number | string;
  status?: string;
}

export type ScheduleDay = Record<string, unknown> & {
  day?: string;
  hari?: string;
  donghua?: ScheduleItem[];
  data?: ScheduleItem[];
  list?: ScheduleItem[];
};

// Alias lama
export type Schedule = ScheduleDay;

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  episodeSlug: string;
  replies?: Comment[];
}
