import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import { obtenerConfiguracionNavegacion } from '@/lib/configuracion'
import type { ClaveSeccion } from '@/lib/sitio'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Actividades', description: 'Agenda, novedades y registro visual del semillero ISIA.' }
const ITEMS = [
  ['reuniones', '/reuniones', 'Agenda y reuniones', 'Consulta las próximas sesiones confirmadas y el archivo de encuentros.'],
  ['novedades', '/novedades', 'Novedades', 'Noticias y actividades publicadas por el semillero.'],
  ['galeria', '/galeria', 'Galería', 'Registro fotográfico confirmado de actividades y espacios.'],
] as const
export default async function PaginaActividades() { const config = await obtenerConfiguracionNavegacion(); const items = ITEMS.filter(([clave]) => config[clave as ClaveSeccion]); if (!items.length) notFound(); return <Seccion className={estilos.primera}><EncabezadoPagina indice="Vida académica" titulo="Actividades" descripcion="Agenda, divulgación y memoria visual organizadas en un solo lugar." /><div className={estilos.rejillaHub}>{items.map(([, href, titulo, texto], i) => <Link href={href} className={estilos.tarjetaHub} key={href}><span>0{i + 1}</span><h2>{titulo}</h2><p>{texto}</p><strong>Consultar ↗</strong></Link>)}</div></Seccion> }
