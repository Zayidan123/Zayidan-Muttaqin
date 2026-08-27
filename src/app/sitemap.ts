import type { MetadataRoute } from 'next'

const SITE_URL = "https://zayidan-muttaqin.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Single-page portfolio — sections as anchors
  const sections = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/#hero', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/#about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/#experience', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/#projects', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/#techstack', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/#achievements', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/#faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/#contact', priority: 0.8, changeFrequency: 'monthly' as const },
  ]

  return sections.map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
