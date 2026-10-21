import { urlSitio } from '@/lib/supabase/config'

/**
 * Interruptor único para salir del modo DEMO: el sitio solo se vuelve indexable
 * cuando NEXT_PUBLIC_SITIO_INDEXABLE=true y existe NEXT_PUBLIC_SITE_URL. Gobierna
 * la metaetiqueta robots, X-Robots-Tag (next.config.mjs), robots.txt, el
 * sitemap y los datos estructurados.
 */
export function sitioIndexable(): boolean {
  return process.env.NEXT_PUBLIC_SITIO_INDEXABLE === 'true' && Boolean(urlSitio())
}
