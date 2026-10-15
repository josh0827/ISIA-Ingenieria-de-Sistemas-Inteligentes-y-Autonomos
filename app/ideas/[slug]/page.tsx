import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoDemo, Seccion } from '@/componentes/Base'
import FormularioColaboracion from '@/componentes/FormularioColaboracion'
import { markdownAHtml, obtenerIdea } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../../detalle.module.css'
import red from '../../networking.module.css'

type Props = { params: Promise<{ slug: string }> }
export const revalidate = 300
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const idea = await obtenerIdea((await params).slug)
  return { title: idea?.titulo ?? 'Idea no encontrada', description: idea?.resumen }
}
export default async function PaginaIdea({ params }: Props) {
  if (!(await seccionVisible('proyectos'))) notFound()
  const idea = await obtenerIdea((await params).slug)
  if (!idea) notFound()
  const cuerpo = await markdownAHtml(idea.cuerpo)
  return <Seccion className={estilos.primeraSeccion}><article className={estilos.articulo}>
    <nav className={estilos.migas} aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>/</span><Link href="/ideas">Ideas</Link><span>/</span><span aria-current="page">Ficha</span></nav>
    {idea.ilustrativo && <AvisoDemo>Idea ilustrativa: no corresponde a una convocatoria o equipo confirmado.</AvisoDemo>}
    <header className={estilos.cabecera}><div className={red.meta}><span>{idea.area}</span><span>{idea.madurez}</span><span>{idea.estado}</span></div><h1 className={estilos.titulo}>{idea.titulo}</h1><p className={estilos.resumen}>{idea.resumen}</p></header>
    {idea.portada && <div className={estilos.imagen}><Image src={idea.portada} alt={idea.portadaAlt ?? ''} width={1200} height={750} className={estilos.imagenFoto} /></div>}
    <div className="prosa"><h2>Problema u oportunidad</h2><p>{idea.problema}</p><h2>Solución propuesta</h2><p>{idea.solucion || 'Pendiente de desarrollar.'}</p><h2>Proceso de desarrollo</h2><p>{idea.proceso || 'Pendiente de documentar.'}</p>{idea.necesidades.length > 0 && <><h2>Colaboración que busca</h2><ul>{idea.necesidades.map((n) => <li key={n}>{n}</li>)}</ul></>}<h2>Equipo o autor visible</h2><p>{idea.autor}</p></div>
    {cuerpo && <div className="prosa" dangerouslySetInnerHTML={{ __html: cuerpo }} />}
    <section className={red.formularioCaja}><h2>Apoyar o colaborar</h2>{idea.ilustrativo ? <p>El contacto se habilitará cuando esta idea sea validada por el semillero.</p> : <><p>La solicitud llegará a la bandeja privada del semillero. No se publicará tu correo.</p><FormularioColaboracion tipo="idea" slug={idea.slug} /></>}</section>
  </article></Seccion>
}
