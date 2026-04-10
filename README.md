# 🐉 DonghuaVerse

Platform streaming donghua sub Indonesia — Next.js 14 + OrbitCloud API.

---

## 🚀 Deploy ke Vercel (step-by-step)

### 1. Extract zip → push ke GitHub
```bash
# Ekstrak zip, masuk folder, init git
git init
git add .
git commit -m "init"
git remote add origin https://github.com/USER/donghuaverse.git
git push -u origin main
```

### 2. Import di Vercel
1. Buka https://vercel.com/new
2. Import repo GitHub tadi
3. **PENTING — sebelum deploy**, klik **"Environment Variables"** dan tambahkan:

| Name | Value |
|------|-------|
| `ORBITCLOUD_API_KEY` | `api_key_kamu_dari_orbitcloud` |

4. Klik **Deploy**

---

## 🔍 Debug setelah deploy

Buka: `https://app-kamu.vercel.app/api/debug`

Output yang diharapkan:
```json
{
  "apiKey": { "set": true, "preview": "abc123..." },
  "testWithKey": { "status": 200, "ok": true }
}
```

Kalau `"set": false` → env var belum diset di Vercel.

---

## 📁 Arsitektur fetch

```
Server Components (pages)
    └─► lib/api.ts → fetch langsung ke OrbitCloud
            └─► header x-api-key: ORBITCLOUD_API_KEY (server env)

Browser debug
    └─► /api/proxy/* → OrbitCloud (sama, tapi via API route)
    └─► /api/debug   → cek status koneksi
```

---

## 📋 Endpoints OrbitCloud yang dipakai

| Endpoint | Keterangan |
|----------|------------|
| `GET /api/v1/home?pages=N` | Home: Populer, Terbaru, Tamat |
| `GET /api/v1/search?q=...&pages=N` | Pencarian |
| `GET /api/v1/jadwal` | Jadwal mingguan |
| `GET /api/v1/detail/:slug` | Detail donghua |
| `GET /api/v1/episode/:slug` | Link streaming |
