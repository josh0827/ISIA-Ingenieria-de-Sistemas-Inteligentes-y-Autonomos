import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoDemo, Seccion } from '@/componentes/Base'
import FormularioReto from '@/componentes/FormularioReto'
import { listarServicios, markdownAHtml, obtenerServicio } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../../detalle.module.css'
import red from '../../networking.module.css'

type Props = { params: Promise<{ slug: string }> }
export const revalidate = 300
export async function generateStaticParams() {
  return (await listarServicios()).map(({ slug }) => ({ slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const servicio = await obtenerServicio((await params).slug)
  return { title: servicio?.titulo ?? 'Capacidad no encontrada', description: servicio?.resumen }
}
export default async function PaginaServicio({ params }: Props) {
  if (!(await seccionVisible('proyectos'))) notFound()
  const servicio = await obtenerServicio((await params).slug)
  if (!servicio) notFound()
  const cuerpo = await markdownAHtml(servicio.cuerpo)
  return <Seccion className={estilos.primeraSeccion}><article className={estilos.articulo}><nav className={estilos.migas} aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>/</span><Link href="/prototipado">Prototipado</Link><span>/</span><span aria-current="page">Capacidad</span></nav>{servicio.ilustrativo && <AvisoDemo>Capacidad ilustrativa pendiente de confirmación operativa.</AvisoDemo>}<header className={estilos.cabecera}><div className={red.meta}>{servicio.areas.map((area) => <span key={area}>{area}</span>)}</div><h1 className={estilos.titulo}>{servicio.titulo}</h1><p className={estilos.resumen}>{servicio.resumen}</p></header>{servicio.portada && <div className={estilos.imagen}><Image src={servicio.portada} alt={servicio.portadaAlt ?? ''} width={1200} height={750} className={estilos.imagenFoto} /></div>}<div className="prosa"><h2>Alcance y condiciones</h2><p>{servicio.condiciones}</p>{servicio.responsable && <><h2>Equipo responsable</h2><p>{servicio.responsable}</p></>}</div>{cuerpo && <div className="prosa" dangerouslySetInnerHTML={{ __html: cuerpo }} />}<section className={red.formularioCaja}><h2>Presentar un reto relacionado</h2>{servicio.ilustrativo ? <p>El formulario se habilitará cuando esta capacidad sea confirmada.</p> : <FormularioReto servicioSlug={servicio.slug} />}</section></article></Seccion>
}
