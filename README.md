# Zayidan Muttaqin - Portfolio Website

Portfolio website profesional dengan fitur CMS (Content Management System) terintegrasi untuk mengelola konten tanpa mengubah source code.

## 🚀 Fitur Utama

### CMS & Admin Panel
- ✅ **Update Konten Tanpa Coding** - Edit semua informasi CV, pengalaman, skills, dan kontak melalui admin panel
- ✅ **Real-time Preview** - Perubahan langsung terlihat di website
- ✅ **Database Storage** - Data tersimpan aman di database (SQLite/PostgreSQL)
- ✅ **Role-based Access** - Proteksi password untuk operasi write

### Performance & UX
- ⚡ **Next.js 14** - Server-side rendering & static generation
- 🎨 **Modern UI** - Glassmorphism design dengan animasi smooth
- 📱 **Responsive** - Optimal untuk desktop, tablet, dan mobile
- 🌐 **Multi-language** - Bahasa Indonesia & English
- 🖼️ **Optimized Images** - Next.js Image component dengan lazy loading

### Security
- 🔒 Rate limiting (60 req/min)
- 🛡️ Input sanitization (XSS prevention)
- 🔐 Authentication untuk admin operations
- 📊 Environment variables untuk konfigurasi sensitif

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Database (SQLite default, atau PostgreSQL)

## 🛠️ Installation

```bash
# Clone repository
git clone <repository-url>
cd <project-folder>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dan sesuaikan konfigurasi

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## 🔐 Environment Variables

File `.env.local` harus berisi:

```bash
# API Keys
GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_MAPS_PLATFORM_KEY="your-maps-api-key"

# App Configuration
APP_URL="http://localhost:3000"

# Admin Panel Password (GANTI SEBELUM PRODUCTION!)
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"
```

**PENTING**: Ganti password default sebelum deploy!

## 🎮 Cara Menggunakan Admin Panel

### 1. Akses Admin Panel
```
URL: http://localhost:3000/?admin=true
Password: (sesuai konfigurasi di .env.local)
```

### 2. Edit Konten
Panel admin menyediakan tab untuk mengedit:
- **About**: Bio, location, role, tagline
- **Contact**: Email, phone, social media links
- **Experience**: Work history, companies, periods
- **Skills**: Hard skills & soft skills
- **FAQ**: Questions & answers
- **Stats**: Achievement numbers
- **Achievements**: Badges dan milestones

### 3. Simpan Perubahan
- Klik "Save" pada setiap field yang diubah
- Perubahan langsung tersimpan di database
- Refresh halaman untuk melihat update

## 📁 Struktur Project

```
/workspace
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API endpoints
│   │   │   ├── cms/          # CMS operations
│   │   │   ├── analytics/    # Dashboard data
│   │   │   └── contact/      # Contact form
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── sections/         # Page sections
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components (AdminPanel, dll)
│   ├── hooks/
│   │   └── useCMS.ts         # Custom hook untuk CMS
│   ├── lib/
│   │   ├── db.ts             # Database connection
│   │   └── validators.ts     # Zod schemas
│   ├── store/                # Zustand stores
│   └── styles/               # Global styles
├── public/                   # Static assets
│   └── zayidan-photo.png     # Profile photo
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.example              # Environment template
├── README.md                 # Dokumentasi ini
└── README_CMS_UPDATE.md      # CMS documentation
```

## 🗄️ Database Schema

```prisma
model cmsContent {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model analytics {
  id        String   @id @default(cuid())
  sessionId String
  timestamp DateTime @default(now())
  country   String?
  // ... fields lainnya
}
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio GUI
```

## 🐛 Troubleshooting

### Foto Profil Tidak Muncul
1. Pastikan file ada di `/public/zayidan-photo.png`
2. Cek console browser untuk error
3. Fallback image otomatis digunakan jika file tidak ditemukan

### Admin Panel Tidak Bisa Diakses
1. URL harus mengandung `?admin=true`
2. Cek password di `.env.local`
3. Clear browser cache

### Data CMS Tidak Tersimpan
1. Pastikan database sudah di-setup
2. Jalankan `npx prisma db push`
3. Cek log error di terminal

## 📝 Mengupdate CV/Informasi

### Metode 1: Via Admin Panel (Recommended)
1. Login ke admin panel
2. Pilih kategori konten
3. Edit field yang diinginkan
4. Klik Save

### Metode 2: Edit Language Store
File: `/src/store/language-store.ts`
- Edit object `id` untuk Bahasa Indonesia
- Edit object `en` untuk English

### Metode 3: Direct Database
```bash
npx prisma studio
# Edit langsung tabel cmsContent
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel dashboard
```

### Docker
```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## 📊 Analytics

Website dilengkapi tracking analytics:
- Total visitors
- Page views per section
- Contact form submissions
- Geographic data

Akses via admin panel → Analytics tab

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Copyright © 2024 Zayidan Muttaqin. All rights reserved.

## 📞 Contact

- Email: (configure via admin panel)
- LinkedIn: (configure via admin panel)
- Location: Banyuwangi, Indonesia

---

**Dibuat dengan** ❤️ menggunakan Next.js, TypeScript, TailwindCSS, dan Prisma

**Versi**: 2.0.0  
**Last Updated**: $(date +%Y-%m-%d)


Build berhasil 100%! Berikut ringkasan semua perubahan dan langkah deploy:
Perubahan yang sudah dilakukan
✅ Build Fix (Cloudflare)
File	Perubahan
next.config.ts	Hapus standalone, serverExternalPackages, experimental. Tambah async headers() untuk security headers
wrangler.toml	Konfigurasi dasar + D1 binding
open-next.config.ts	Konfigurasi wrapper cloudflare-node / cloudflare-edge
src/lib/sanitize.ts	Ganti isomorphic-dompurify (native deps) dengan regex
src/proxy.ts	Dihapus — Next.js 16 paksa Node.js runtime, incompatible dengan Cloudflare
✅ Prisma + D1 Integration
File	Perubahan
prisma/schema.prisma	Generator update (driverAdapters support)
src/lib/db.ts	Auto-detect Cloudflare context → pakai PrismaD1 adapter; fallback ke SQLite standar
package.json	Tambah @prisma/adapter-d1
Langkah Manual untuk Deploy
Sebelum deploy ke Cloudflare, kamu perlu:
1. Buat D1 database:
npx wrangler d1 create zayidan-portfolio-db
2. Copy database_id dari output ke wrangler.toml:
[[d1_databases]]
binding = "DB"
database_name = "zayidan-portfolio-db"
database_id = "<copy-id-dari-sini>"
3. Migration data SQLite → D1:
npx wrangler d1 migrations create zayidan-portfolio-db init
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_init.sql
npx wrangler d1 migrations apply zayidan-portfolio-db
4. Deploy ke Cloudflare Pages:
npx wrangler pages deploy .open-next/assets
5. Binding D1 di Dashboard:  
Buka Cloudflare Dashboard → Pages → zayidan-portfolio → Settings → Functions → D1 database bindings → binding name: DB, database: zayidan-portfolio-db
6. Set env vars di dashboard:  
GEMINI_API_KEY, ADMIN_PASSWORD, NEXT_PUBLIC_ADMIN_PASSWORD, FORMSPREE_ID, dll.