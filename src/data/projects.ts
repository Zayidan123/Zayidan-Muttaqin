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
    title: "Zayidan Muttaqin — Portfolio",
    description: {
      id: "Website portfolio profesional dengan CMS terintegrasi untuk mengelola konten tanpa menyentuh source code. Dibangun dengan Next.js, TypeScript, dan TailwindCSS, dilengkapi UI glassmorphism, multi-bahasa (Indonesia & English), responsif, serta admin panel dengan preview real-time.",
      en: "A professional portfolio website with an integrated CMS to manage content without touching the source code. Built with Next.js, TypeScript, and TailwindCSS, featuring a glassmorphism UI, multi-language support (Indonesian & English), responsive layout, and an admin panel with real-time preview.",
    },
    tags: { id: ["Next.js", "TypeScript", "TailwindCSS", "Prisma", "CMS"], en: ["Next.js", "TypeScript", "TailwindCSS", "Prisma", "CMS"] },
    repoUrl: "https://github.com/Zayidan123",
    demoUrl: "https://zayidan-muttaqin.vercel.app",
  },
]
