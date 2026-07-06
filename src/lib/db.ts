import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const sym = Object.getOwnPropertySymbols(globalThis)
    .find(s => s.toString() === 'Symbol(__cloudflare-context__)')
  const ctx = sym ? (globalThis as any)[sym] : undefined
  const d1 = (ctx?.env as any)?.['DB']

  if (d1) {
    const adapter = new PrismaD1(d1)
    return new PrismaClient({ adapter })
  }

  return new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query'] : undefined,
  })
}

export const db =
  globalForPrisma.prisma ??
  (globalForPrisma.prisma = createPrismaClient())