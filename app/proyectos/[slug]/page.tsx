// SECCIÓN: Proyectos (ficha de un proyecto)
//
// Añade sobre el modelo de novedades una ficha técnica con los datos del
// frontmatter, y resuelve los slugs de "integrantes" contra las fichas reales
// de contenido/integrantes para mostrar los nombres.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Boton, Etiqueta, Seccion } from '@/componentes/Base'
import { listarIntegrantes, listarProyectos, markdownAHtml, obtenerProyecto } from '@/lib/contenido'
import estilos from '../../detalle.module.css'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return listarProyectos().map((proyecto) => ({ slug: proyecto.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proyecto = obtenerProyecto(slug)
  if (!proyecto) return { title: 'Proyecto no encontrado' }

  return {
    title: proyecto.titulo,
    description: proyecto.resumen,
    openGraph: { title: proyecto.titulo, description: proyecto.resumen, type: 'article' },
  }
}

export default async function PaginaProyecto({ params }: Props) {
  const { slug } = await params
  const proyecto = obtenerProyecto(slug)
  if (!proyecto) notFound()

  const cuerpo = await markdownAHtml(proyecto.cuerpo)

  // El frontmatter guarda slugs; aquí se traducen a nombres. Un slug que no
  // corresponda a ninguna ficha se ignora en vez de romper la página.
  const equipo = listarIntegrantes().filter((i) => proyecto.integrantes.includes(i.slug))

  return (
    <Seccion className={estilos.primeraSeccion}>
      <article className={estilos.articulo}>
        <header className={estilos.cabecera}>
          <div className={estilos.meta}>
            <Etiqueta valor={proyecto.estado} />
            {proyecto.linea && <span className="mono">{proyecto.linea}</span>}
          </div>

          <h1 className={estilos.titulo}>{proyecto.titulo}</h1>
          {proyecto.resumen && <p className={estilos.resumen}>{proyecto.resumen}</p>}
        </header>

        {proyecto.portada && (
          <div className={estilos.imagen}>
            <Image src={proyecto.portada} alt="" width={1200} height={750} className={estilos.imagenFoto} />
          </div>
        )}

        <dl className={estilos.ficha}>
          <div className={estilos.fichaDato}>
            <dt className={`mono ${estilos.fichaEtiqueta}`}>Línea</dt>
            <dd className={estilos.fichaValor}>{proyecto.linea || 'Sin asignar'}</dd>
          </div>
          <div className={estilos.fichaDato}>
            <dt className={`mono ${estilos.fichaEtiqueta}`}>Equipo</dt>
            <dd className={estilos.fichaValor}>
              {equipo.length > 0 ? equipo.map((i) => i.nombre).join(', ') : 'Por definir'}
            </dd>
          </div>
        </dl>

        <div className="prosa" dangerouslySetInnerHTML={{ __html: cuerpo }} />

        <footer className={estilos.pieArticulo}>
          <Boton href="/proyectos" variante="sutil">
            Volver a proyectos
          </Boton>
        </footer>
      </article>
    </Seccion>
  )
}
