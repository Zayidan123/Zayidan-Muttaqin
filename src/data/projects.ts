type LocalizedText = { id: string; en: string }

export interface ProjectEntry {
  id: number
  title: string
  description: { id: string; en: string }
  tags: { id: string[]; en: string[] }
  repoUrl: string
  demoUrl?: string
}

export const projects: ProjectEntry[] = [
  {
    id: 1,
    title: "Zaytrix — Institutional Crypto Gateway",
    description: {
      id: "Zaytrix adalah platform Institutional Crypto Gateway dan terminal analisis kripto real-time berbasis Full-Stack JavaScript/TypeScript. Proyek ini mengintegrasikan data on-chain live, derivatif, dan analisis berbasis Gemini AI tanpa data tiruan (zero mock), yang didukung oleh sistem keamanan tingkat enterprise seperti WebAuthn/Passkey, 2FA TOTP, serta enkripsi AES-256-GCM. Frontend: React 19 • TypeScript • Zustand • TanStack Query • Tailwind CSS 4 • Recharts. Backend & DB: Node.js (Bun) • Express • Prisma • SQLite/PostgreSQL. Security & AI: WebAuthn • AES-256-GCM • Gemini AI.",
      en: "Zaytrix is an Institutional Crypto Gateway platform and a real-time crypto analysis terminal built on Full-Stack JavaScript/TypeScript. It integrates live on-chain data, derivatives, and Gemini AI-powered analysis with zero mock data, backed by enterprise-grade security such as WebAuthn/Passkey, 2FA TOTP, and AES-256-GCM encryption. Frontend: React 19 • TypeScript • Zustand • TanStack Query • Tailwind CSS 4 • Recharts. Backend & DB: Node.js (Bun) • Express • Prisma • SQLite/PostgreSQL. Security & AI: WebAuthn • AES-256-GCM • Gemini AI.",
    },
    tags: {
      id: ["React 19", "TypeScript", "Zustand", "TanStack Query", "Tailwind CSS 4", "Recharts", "Node.js (Bun)", "Express", "Prisma", "SQLite/PostgreSQL", "WebAuthn", "AES-256-GCM", "Gemini AI"],
      en: ["React 19", "TypeScript", "Zustand", "TanStack Query", "Tailwind CSS 4", "Recharts", "Node.js (Bun)", "Express", "Prisma", "SQLite/PostgreSQL", "WebAuthn", "AES-256-GCM", "Gemini AI"],
    },
    repoUrl: "https://github.com/Zayidan123/zaytrix_1",
    demoUrl: "https://zayidan-muttaqin.vercel.app",
  },
]
