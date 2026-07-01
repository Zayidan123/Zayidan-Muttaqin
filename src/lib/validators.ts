import { z } from 'zod/v4'

// ─── Contact Form Validation ────────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s.'\-]+$/, 'Name contains invalid characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(254, 'Email too long')
    .email('Invalid email format'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject too long'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message too long'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// ─── Analytics Track Validation ─────────────────────────────────────────────

export const analyticsTrackSchema = z.object({
  sessionId: z.string().min(1).max(100),
  section: z.string().min(1).max(50),
  duration: z.number().int().min(0).max(86400).optional().default(0),
  ip: z.string().max(45).optional(),
  userAgent: z.string().max(500).optional(),
  referrer: z.string().max(2000).optional(),
})

export type AnalyticsTrackData = z.infer<typeof analyticsTrackSchema>

// ─── CMS Content Validation ─────────────────────────────────────────────────

export const cmsPutSchema = z.object({
  key: z.string().min(1).max(200),
  value: z.string().max(10000),
  category: z.string().max(50).optional(),
})

export const cmsDeleteSchema = z.object({
  key: z.string().min(1).max(200),
})

// ─── Backup Import Validation ───────────────────────────────────────────────

export const backupImportItemSchema = z.object({
  key: z.string().min(1).max(200),
  value: z.string().max(10000),
  category: z.string().max(50).optional(),
})

export const backupImportSchema = z.object({
  items: z.array(backupImportItemSchema).max(500).optional(),
  version: z.number().optional(),
  exportedAt: z.string().optional(),
}).refine(
  (data) => Array.isArray(data.items) || Array.isArray(data),
  { message: 'items array required' }
)