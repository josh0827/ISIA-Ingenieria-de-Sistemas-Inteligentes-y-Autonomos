import type { MetadataRoute } from 'next'
import { sitioIndexable } from '@/lib/indexacion'
import { urlSitio } from '@/lib/supabase/config'

// En DEMO se permite rastrear para que los buscadores lean el noindex de cada
// página; solo con el sitio indexable se anuncia el sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = urlSitio()
  return {
    rules: sitioIndexable()
      ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }
      : { userAgent: '*', allow: '/' },
    ...(sitioIndexable() && base ? { sitemap: `${base}/sitemap.xml` } : {}),
  }
}
