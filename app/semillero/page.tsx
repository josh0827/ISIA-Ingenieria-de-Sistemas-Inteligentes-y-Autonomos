import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import type { ClaveSeccion } from '@/lib/sitio'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Semillero', description: 'Identidad, líneas y producción académica del semillero ISIA.' }

const ENLACES = [
  ['lineas', '/lineas', 'Líneas de investigación', 'Conoce los temas de referencia que orientan la exploración académica.'],
  ['grupos', '/grupos', 'Grupos de trabajo', 'Consulta los equipos que articulan intereses y capacidades.'],
  ['publicaciones', '/publicaciones', 'Publicaciones y recursos', 'Revisa la producción académica confirmada y los recursos compartidos.'],
] as const

export default async function PaginaSemillero() {
  const config = await obtenerConfiguracionNavegacion()
  const enlaces = ENLACES.filter(([clave]) => config[clave as ClaveSeccion])
  if (!enlaces.length) notFound()
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Semillero" titulo="Conocimiento que conecta personas" descripcion="ISIA articula formación, investigación y prototipado alrededor de sistemas inteligentes y autónomos." /><div className={estilos.rejillaHub}>{enlaces.map(([, href, titulo, texto], i) => <Link href={href} className={estilos.tarjetaHub} key={href}><span>0{i + 1}</span><h2>{titulo}</h2><p>{texto}</p><strong>Explorar ↗</strong></Link>)}</div></Seccion>
}
