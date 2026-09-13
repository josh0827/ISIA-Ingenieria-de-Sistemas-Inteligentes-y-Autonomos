import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AvisoDemo, Boton, Etiqueta, Seccion } from '@/componentes/Base'
import {
  listarIntegrantes,
  markdownAHtml,
  obtenerProyecto,
} from '@/lib/contenido'
import { LINEAS } from '@/lib/sitio'
import estilos from '../../detalle.module.css'
type Props = { params: Promise<{ slug: string }> }
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await obtenerProyecto((await params).slug)
  if (!p) return { title: 'Proyecto no encontrado' }
  return {
    title: p.ilustrativo ? 'Ficha de proyecto ilustrativo' : p.titulo,
    description: p.ilustrativo
      ? 'Ficha de demostración del semillero ISIA. La propuesta y su estado son ilustrativos y no documentan resultados reales.'
      : p.resumen,
  }
}
export default async function PaginaProyecto({ params }: Props) {
  const proyecto = await obtenerProyecto((await params).slug)
  if (!proyecto) notFound()
  const cuerpo = await markdownAHtml(proyecto.cuerpo)
  const equipo = (await listarIntegrantes()).filter(
    (i) => !i.ilustrativo && proyecto.integrantes.includes(i.slug),
  )
  const linea = LINEAS.findIndex((l) => l.titulo === proyecto.linea)
  return (
    <Seccion className={estilos.primeraSeccion}>
      <article className={estilos.articulo}>
        <nav className={estilos.migas} aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/proyectos">Proyectos</Link>
          <span>/</span>
          <span aria-current="page">Ficha</span>
        </nav>
        {proyecto.ilustrativo && (
          <AvisoDemo>
            Proyecto ilustrativo. Su descripción y estado son ejemplos; no
            corresponden a resultados ni actividades confirmadas del semillero.
          </AvisoDemo>
        )}
        <header className={estilos.cabecera}>
          <div className={estilos.meta}>
            <Etiqueta valor={proyecto.estado} />
          </div>
          <h1 className={estilos.titulo}>{proyecto.titulo}</h1>
          <p className={estilos.resumen}>{proyecto.resumen}</p>
        </header>
        {proyecto.portada && (
          <div className={estilos.imagen}>
            <Image
              src={proyecto.portada}
              alt={`Imagen del proyecto ${proyecto.titulo}`}
              width={1200}
              height={750}
              className={estilos.imagenFoto}
            />
          </div>
        )}
        <dl className={estilos.ficha}>
          <div className={estilos.fichaDato}>
            <dt>Línea de referencia</dt>
            <dd>
              {linea >= 0 ? (
                <Link href={`/lineas#linea-${linea + 1}`}>
                  {proyecto.linea} ↗
                </Link>
              ) : (
                proyecto.linea || 'Pendiente de confirmar'
              )}
            </dd>
          </div>
          <div className={estilos.fichaDato}>
            <dt>Estado</dt>
            <dd>
              {proyecto.ilustrativo ? (
                'Propuesta ilustrativa, sin ejecución confirmada'
              ) : (
                <Etiqueta valor={proyecto.estado} />
              )}
            </dd>
          </div>
        </dl>
        {equipo.length > 0 && (
          <div className={estilos.equipo}>
            <h2>Participantes</h2>
            <p>{equipo.map((i) => i.nombre).join(', ')}</p>
          </div>
        )}
        <div className="prosa" dangerouslySetInnerHTML={{ __html: cuerpo }} />
        <footer className={estilos.pieArticulo}>
          <Boton href="/proyectos" variante="sutil">
            Volver a proyectos
          </Boton>
          <Boton href="/unete" variante="sutil">
            Conocer cómo participar
          </Boton>
        </footer>
      </article>
    </Seccion>
  )
}
