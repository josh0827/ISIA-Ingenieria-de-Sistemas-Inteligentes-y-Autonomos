// Mapa del sitio. Se genera solo a partir de la navegación y del contenido,
// así que una sección o una novedad nueva entra sin tocar este archivo.

import type { MetadataRoute } from 'next'
import { NAVEGACION, SITIO } from '@/lib/sitio'
import { listarNovedades, listarProyectos } from '@/lib/contenido'

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date()

  const fijas: MetadataRoute.Sitemap = [
    { url: SITIO.url, lastModified: ahora, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITIO.url}/unete`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.8 },
    ...NAVEGACION.map((item) => ({
      url: `${SITIO.url}${item.href}`,
      lastModified: ahora,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  const novedades: MetadataRoute.Sitemap = listarNovedades().map((n) => ({
    url: `${SITIO.url}/novedades/${n.slug}`,
    lastModified: new Date(n.fecha),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  const proyectos: MetadataRoute.Sitemap = listarProyectos().map((p) => ({
    url: `${SITIO.url}/proyectos/${p.slug}`,
    lastModified: ahora,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...fijas, ...novedades, ...proyectos]
}
