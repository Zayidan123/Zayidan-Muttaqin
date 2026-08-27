import Link from 'next/link'
import { Home, Briefcase, Mail } from 'lucide-react'

export const metadata = {
  title: "Halaman Tidak Ditemukan — 404",
  description: "Maaf, halaman yang Anda cari tidak ditemukan. Kembali ke beranda portfolio Zayidan Muttaqin untuk melihat pengalaman kerja, proyek, dan informasi kontak.",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-[var(--background)] text-[var(--foreground)]">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl sm:text-8xl font-bold text-[var(--neon-cyan)] mb-4">
          404
        </p>
        <h1 className="font-display text-2xl font-bold mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          Silakan kembali ke beranda portfolio Zayidan Muttaqin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors"
          >
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/#experience"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Briefcase className="h-4 w-4" />
            Lihat Pengalaman
          </Link>
          <Link
            href="/#contact"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Mail className="h-4 w-4" />
            Hubungi Saya
          </Link>
        </div>
      </div>
    </main>
  )
}
