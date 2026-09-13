import type { MetadataRoute } from 'next'
// Permite leer el noindex de cada página; no anuncia un sitemap de producción.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' } }
}
