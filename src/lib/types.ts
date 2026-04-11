// ── OrbitCloud actual response shapes ──────────────────────────

export interface Donghua {
  id?: string | number;
  slug?: string;
  title?: string;
  judul?: string;
  // cover fields — OrbitCloud uses "img"
  img?: string;
  cover?: string;
  thumbnail?: string;
  poster?: string;
  image?: string;
  gambar?: string;
  // episode number — OrbitCloud uses "ep" e.g. "Ep 263"
  ep?: string;
  latest_episode?: number | string;
  episode_terakhir?: string | number;
  episode?: number | string;
  // detail fields
  synopsis?: string;
  sinopsis?: string;
  deskripsi?: string;
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
  studio?: string;
  views?: number | string;
  // link field from OrbitCloud home
  link?: string;
}

export interface Episode {
  id?: string | number;
  number?: number;
  episode?: number | string;
  ep?: string;
  title?: string;
  judul?: string;
  slug?: string;
  url?: string;
  link?: string;
  stream_url?: string;
  embed_url?: string;
  thumbnail?: string;
  img?: string;
  date?: string;
  tanggal?: string;
}

export interface EpisodeDetail {
  slug?: string;
  title?: string;
  judul?: string;
  episode?: number | string;
  ep?: string;
  stream_url?: string;
  embed_url?: string;
  iframe?: string;
  video_url?: string;
  link?: string;
  server?: string;
  servers?: VideoServer[];
  thumbnail?: string;
  img?: string;
  prev?: string | null;
  next?: string | null;
  prev_episode?: string | null;
  next_episode?: string | null;
  donghua?: Donghua;
  [key: string]: unknown;
}

export interface VideoServer {
  name: string;
  url: string;
  quality?: string;
}

// OrbitCloud /home response:
// { status: "success", data: { latest: [...], populer: [...], ... } }
export type HomeData = Record<string, unknown> & {
  // Direct list fields
  populer?: Donghua[];
  terbaru?: Donghua[];
  tamat?: Donghua[];
  slider?: Donghua[];
  ongoing?: Donghua[];
  completed?: Donghua[];
  popular?: Donghua[];
  latest?: Donghua[];
  data?: Donghua[] | HomeData;
};

export type ScheduleDay = Record<string, unknown> & {
  day?: string;
  hari?: string;
  donghua?: ScheduleItem[];
  data?: ScheduleItem[];
  list?: ScheduleItem[];
};

export type Schedule = ScheduleDay;

export interface ScheduleItem {
  id?: string | number;
  slug?: string;
  title?: string;
  judul?: string;
  cover?: string;
  thumbnail?: string;
  image?: string;
  img?: string;
  gambar?: string;
  time?: string;
  jam?: string;
  episode?: number | string;
  ep?: string;
  status?: string;
  link?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  episodeSlug: string;
  replies?: Comment[];
}
