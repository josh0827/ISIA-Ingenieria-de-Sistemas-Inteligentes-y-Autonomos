import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Comunidad', description: 'Personas y formas de participación en la comunidad ISIA.' }

export default async function PaginaComunidad() {
  const config = await obtenerConfiguracionNavegacion()
  if (!config.integrantes && !config.grupos) notFound()
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Networking" titulo="Comunidad" descripcion="Un punto de encuentro para estudiantes de pregrado y posgrado, egresados, docentes, investigadores, organizaciones y personas externas." /><div className={estilos.rejillaHub}>{config.integrantes && <Link href="/integrantes" className={estilos.tarjetaHub}><span>Personas</span><h2>Integrantes</h2><p>Perfiles confirmados y áreas de interés de la comunidad.</p><strong>Conocer la comunidad ↗</strong></Link>}{config.grupos && <Link href="/grupos" className={estilos.tarjetaHub}><span>Equipos</span><h2>Grupos de trabajo</h2><p>Equipos que conectan experiencia, aprendizaje y retos técnicos.</p><strong>Ver grupos ↗</strong></Link>}<Link href="/unete" className={estilos.tarjetaHub}><span>Participación</span><h2>Conectar con ISIA</h2><p>Manifiesta tus intereses sin requisitos técnicos excluyentes.</p><strong>Participar ↗</strong></Link></div><div className={estilos.bloque}><h2>Participación de posgrado</h2><p>Estudiantes de especialización, maestría y doctorado pueden proponer mentorías, retos, colaboración técnica o vínculos entre proyectos. Cada solicitud se revisa según su alcance y disponibilidad.</p></div></Seccion>
}
