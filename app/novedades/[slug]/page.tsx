import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AvisoDemo, Boton, Etiqueta, Fecha, Seccion } from '@/componentes/Base'
import { listarNovedades, markdownAHtml, obtenerNovedad } from '@/lib/contenido'
import estilos from '../../detalle.module.css'
type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() {
  return listarNovedades().map((n) => ({ slug: n.slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = obtenerNovedad((await params).slug)
  if (!n) return { title: 'Novedad no encontrada' }
  return {
    title: n.ilustrativo ? 'Nota académica ilustrativa' : n.titulo,
    description: n.ilustrativo
      ? 'Nota de demostración de la sección de novedades de ISIA. Su contenido y fecha son ilustrativos y no anuncian una actividad vigente.'
      : n.resumen,
  }
}
export default async function PaginaNovedad({ params }: Props) {
  const novedad = obtenerNovedad((await params).slug)
  if (!novedad) notFound()
  const cuerpo = await markdownAHtml(novedad.cuerpo)
  return (
    <Seccion className={estilos.primeraSeccion}>
      <article className={estilos.articulo}>
        <nav className={estilos.migas} aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/novedades">Novedades</Link>
          <span>/</span>
          <span aria-current="page">Nota</span>
        </nav>
        {novedad.ilustrativo && (
          <AvisoDemo>
            Nota ilustrativa con fecha de ejemplo. No es una noticia confirmada
            ni un anuncio de actividades vigentes.
          </AvisoDemo>
        )}
        <header className={estilos.cabecera}>
          <div className={estilos.meta}>
            <span>
              {novedad.ilustrativo && 'Fecha de ejemplo: '}
              <Fecha iso={novedad.fecha} />
            </span>
            <Etiqueta valor={novedad.tipo} />
          </div>
          <h1 className={estilos.titulo}>{novedad.titulo}</h1>
          <p className={estilos.resumen}>{novedad.resumen}</p>
          {novedad.autor && (
            <p className={estilos.autor}>Publicado por {novedad.autor}</p>
          )}
        </header>
        {novedad.imagen && (
          <div className={estilos.imagen}>
            <Image
              src={novedad.imagen}
              alt={novedad.titulo}
              width={1200}
              height={675}
              className={estilos.imagenFoto}
            />
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
