# 🐉 DonghuaVerse

Platform streaming donghua (anime China) sub Indonesia berbasis **Next.js 14**, powered by **OrbitCloud API**.

---

## ✨ Fitur

- 🎬 Hero banner slider dengan auto-play
- 🏠 Home page — Terbaru, Populer, Tamat
- 📄 Detail page — sinopsis, genre, daftar episode
- 🎥 Watch page — embed player + navigasi episode
- 📅 Jadwal tayang mingguan
- 🔍 Pencarian judul
- 💬 Sistem komentar + balasan (localStorage)
- 📱 Responsive mobile-first (mirip Donghub)
- ⚡ ISR (Incremental Static Regeneration)
- 🌑 Dark mode cinematic theme

---

## 🚀 Setup Lokal

### 1. Clone & install

```bash
git clone <repo-url>
cd donghuaverse
npm install
```

### 2. Konfigurasi env

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ORBITCLOUD_API_KEY=API_KEY_KAMU_DARI_ORBITCLOUD
```

> Dapatkan API key di: https://api.app.orbitcloud.web.id

### 3. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy ke Vercel

### Via Vercel Dashboard

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project → Import repo
3. Di **Environment Variables**, tambahkan:
   - `ORBITCLOUD_API_KEY` = API key kamu
4. Klik **Deploy**

### Via Vercel CLI

```bash
npm i -g vercel
vercel
# Ikuti promptnya, lalu set env var:
vercel env add ORBITCLOUD_API_KEY
```

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx              # Beranda
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Skeleton loading
│   ├── error.tsx             # Error boundary
│   ├── not-found.tsx         # 404 page
│   ├── donghua/[slug]/       # Detail donghua
│   ├── watch/[episodeSlug]/  # Halaman nonton
│   ├── jadwal/               # Jadwal tayang
│   ├── search/               # Pencarian
│   └── browse/               # Browse semua
├── components/
│   ├── Navbar.tsx            # Navigasi
│   ├── Footer.tsx            # Footer
│   ├── HeroBanner.tsx        # Slider hero
│   ├── DonghuaRow.tsx        # Baris scroll horizontal
│   ├── DonghuaCard.tsx       # Kartu anime
│   ├── EpisodeList.tsx       # Daftar episode
│   ├── VideoPlayer.tsx       # Embed player
│   ├── Comments.tsx          # Komentar + balasan
│   └── SearchForm.tsx        # Form pencarian
└── lib/
    ├── api.ts                # OrbitCloud API client
    ├── types.ts              # TypeScript types
    └── utils.ts              # Helper functions
```

---

## 🔑 API Endpoints yang Dipakai

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/v1/home?pages=N` | Home (Populer, Terbaru, Tamat) |
| GET | `/api/v1/search?q=...&pages=N` | Pencarian |
| GET | `/api/v1/jadwal` | Jadwal mingguan |
| GET | `/api/v1/detail/:slug` | Detail donghua |
| GET | `/api/v1/episode/:slug` | Link streaming episode |

Auth: header `x-api-key: YOUR_KEY`

---

## 💡 Tips

- Komentar disimpan di **localStorage** browser (per episode)
- ISR cache: Home=3 mnt, Detail=5 mnt, Jadwal=1 jam
- Format episode slug: `{judul-donghua}-episode-{nomor}` (contoh: `renegade-immortal-episode-100`)
