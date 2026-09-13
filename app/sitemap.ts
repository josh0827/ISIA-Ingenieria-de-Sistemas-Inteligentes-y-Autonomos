import type { MetadataRoute } from 'next'
// DEMO: no se anuncian URLs de producción. El noindex vive en layout.tsx.
export default function sitemap(): MetadataRoute.Sitemap {
  return []
}
