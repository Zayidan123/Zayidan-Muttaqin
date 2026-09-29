import type { MetadataRoute } from 'next'

const SITE_URL = "https://zayidan-muttaqin.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page portfolio. Google ignores URL fragments (#about, #projects,
  // …) in sitemaps — every entry would collapse onto the same canonical URL
  // and can surface "duplicate URL" noise in Search Console. A single,
  // always-fresh canonical entry is the correct, clean signal.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]
}
