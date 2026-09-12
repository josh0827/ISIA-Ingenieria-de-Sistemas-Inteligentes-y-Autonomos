// SECCIÓN: Novedades (ficha de una novedad)
//
// Modelo de página de detalle. Lo importante:
//   - generateStaticParams le dice a Next qué páginas generar en el build
//   - generateMetadata pone el título y la descripción de cada novedad
//   - markdownAHtml convierte el cuerpo del .md en HTML
//   - la clase global "prosa" se encarga de que ese HTML se vea bien

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Boton, Etiqueta, Fecha, Seccion } from '@/componentes/Base'
import { listarNovedades, markdownAHtml, obtenerNovedad } from '@/lib/contenido'
import estilos from '../../detalle.module.css'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return listarNovedades().map((novedad) => ({ slug: novedad.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const novedad = obtenerNovedad(slug)
  if (!novedad) return { title: 'Novedad no encontrada' }

  return {
    title: novedad.titulo,
    description: novedad.resumen,
    openGraph: {
      title: novedad.titulo,
      description: novedad.resumen,
      type: 'article',
      publishedTime: novedad.fecha,
    },
  }
}

export default async function PaginaNovedad({ params }: Props) {
  const { slug } = await params
  const novedad = obtenerNovedad(slug)
  if (!novedad) notFound()

  const cuerpo = await markdownAHtml(novedad.cuerpo)

  return (
    <Seccion className={estilos.primeraSeccion}>
      <article className={estilos.articulo}>
        <header className={estilos.cabecera}>
          <div className={estilos.meta}>
            <span className="mono">
              <Fecha iso={novedad.fecha} />
            </span>
            <Etiqueta valor={novedad.tipo} />
          </div>

          <h1 className={estilos.titulo}>{novedad.titulo}</h1>
          {novedad.resumen && <p className={estilos.resumen}>{novedad.resumen}</p>}
          {novedad.autor && <p className={`mono ${estilos.autor}`}>Publicado por {novedad.autor}</p>}
        </header>

        {novedad.imagen && (
          <div className={estilos.imagen}>
            <Image src={novedad.imagen} alt="" width={1200} height={675} className={estilos.imagenFoto} />
          </div>
        )}

        <div className="prosa" dangerouslySetInnerHTML={{ __html: cuerpo }} />

        <footer className={estilos.pieArticulo}>
          <Boton href="/novedades" variante="sutil">
            Volver a novedades
          </Boton>
        </footer>
      </article>
    </Seccion>
  )
}
