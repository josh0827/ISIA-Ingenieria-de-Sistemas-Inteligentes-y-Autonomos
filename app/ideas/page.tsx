import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AvisoDemo, EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import ListadoIdeas from '@/componentes/ideas/ListadoIdeas'
import { listarIdeas } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Ideas y retos', description: 'Ideas y retos que buscan validación, equipo o apoyo en la comunidad ISIA.' }
export const revalidate = 300

export default async function PaginaIdeas() {
  if (!(await seccionVisible('proyectos'))) notFound()
  const ideas = await listarIdeas()
  const resumenes = ideas.map(({ slug, titulo, resumen, problema, area, estado, madurez, necesidades, portada, portadaAlt }) => ({ slug, titulo, resumen, problema, area, estado, madurez, necesidades, portada, portadaAlt }))
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Proyectos" titulo="Ideas y retos" descripcion="Propuestas tempranas presentadas de forma breve para facilitar conexiones, retroalimentación y equipos interdisciplinarios." />{ideas.some((idea) => idea.ilustrativo) && <AvisoDemo>Las fichas señaladas como provisionales son ejemplos de estructura y no convocatorias vigentes.</AvisoDemo>}{ideas.length ? <ListadoIdeas ideas={resumenes} /> : <EstadoVacio titulo="Ideas por publicar" descripcion="El equipo podrá crear ideas desde el panel y señalar el apoyo que necesita cada una." />}</Seccion>
}
