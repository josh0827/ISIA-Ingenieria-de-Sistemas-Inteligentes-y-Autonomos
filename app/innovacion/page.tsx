import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import { listarIdeas, listarProyectos } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Innovación y apoyo', description: 'Rutas para convertir ideas en prototipos y colaborar con proyectos de ISIA.' }
export const revalidate = 300

export default async function PaginaInnovacion() {
  if (!(await seccionVisible('proyectos'))) notFound()
  const [ideas, proyectos] = await Promise.all([listarIdeas(), listarProyectos()])
  const abiertos = ideas.filter((idea) => !idea.ilustrativo && (idea.estado === 'Abierta' || idea.estado === 'En evaluación'))
  const confirmados = proyectos.filter((proyecto) => !proyecto.ilustrativo)
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Networking" titulo="Innovación, proyectos y apoyo" descripcion="Conecta una necesidad con personas y capacidades para formular, validar o prototipar una solución con alcance académico claro." /><div className={estilos.rejillaHub}><Link href="/ideas" className={estilos.tarjetaHub}><span>Explorar</span><h2>Ideas y retos</h2><p>Propuestas tempranas que buscan validación, equipo o conocimiento.</p><strong>{abiertos.length ? `${abiertos.length} ideas confirmadas ↗` : 'Explorar ideas ↗'}</strong></Link><Link href="/prototipado" className={estilos.tarjetaHub}><span>Construir</span><h2>Pruebas de concepto</h2><p>Presenta una necesidad acotada para evaluar su viabilidad técnica.</p><strong>Proponer un reto ↗</strong></Link><Link href="/proyectos" className={estilos.tarjetaHub}><span>Colaborar</span><h2>Apoyar proyectos</h2><p>Cada ficha confirmada permite ofrecer mentoría, equipos, conocimiento, alianzas o apoyo material.</p><strong>{confirmados.length ? `${confirmados.length} proyectos confirmados ↗` : 'Explorar proyectos ↗'}</strong></Link></div><div className={estilos.bloque}><h2>Apoyo responsable</h2><p>El portal no recibe pagos ni ofrece participaciones financieras. Una propuesta de apoyo abre una conversación privada con el semillero; alcance, recursos, propiedad intelectual y compromisos deben acordarse por canales institucionales antes de iniciar.</p></div>{ideas.length === 0 && proyectos.length === 0 && <EstadoVacio titulo="Iniciativas por publicar" descripcion="El equipo podrá presentar aquí ideas y proyectos cuando su información esté lista." />}</Seccion>
}
