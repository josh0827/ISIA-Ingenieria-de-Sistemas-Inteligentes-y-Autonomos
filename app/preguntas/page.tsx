import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import FormularioPregunta from '@/componentes/FormularioPregunta'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import { listarPreguntasPublicas } from '@/lib/preguntas'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Preguntas de la comunidad', description: 'Preguntas respondidas y moderadas por el equipo ISIA.' }
export const revalidate = 300

export default async function PaginaPreguntas() {
  const config = await obtenerConfiguracionNavegacion()
  if (!config.integrantes && !config.grupos) notFound()
  const preguntas = await listarPreguntasPublicas().catch(() => [])
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Comunidad" titulo="Preguntas y respuestas" descripcion="Un espacio moderado para resolver dudas sobre participación, proyectos, investigación y colaboración." /><div className={estilos.listaPreguntas}>{preguntas.length ? preguntas.map((item) => <article key={item.id} className={estilos.pregunta}><span>{item.categoria}</span><h2>{item.pregunta}</h2><p>{item.respuesta}</p></article>) : <EstadoVacio titulo="Preguntas por responder" descripcion="Las respuestas aprobadas por el equipo se publicarán aquí sin mostrar nombres ni correos de quienes preguntan." />}</div><section className={estilos.formularioCaja}><h2>Enviar una pregunta</h2><p>No es un chat en tiempo real. El equipo revisa cada mensaje para proteger datos personales y publicar únicamente respuestas útiles para la comunidad.</p><FormularioPregunta /></section></Seccion>
}
