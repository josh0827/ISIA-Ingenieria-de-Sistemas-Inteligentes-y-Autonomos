import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AvisoDemo, EncabezadoPagina, EstadoVacio, Seccion } from '@/componentes/Base'
import FormularioReto from '@/componentes/FormularioReto'
import { listarServicios } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Prototipado y colaboración', description: 'Capacidades de ISIA para evaluar retos y desarrollar pruebas de concepto.' }
export const revalidate = 300

export default async function PaginaPrototipado() {
  if (!(await seccionVisible('proyectos'))) notFound()
  const servicios = await listarServicios()
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Conectar un reto" titulo="Prototipado y colaboración" descripcion="Empresas, instituciones, equipos académicos y particulares pueden presentar una necesidad para explorar su viabilidad como prueba de concepto." /><AvisoDemo>El envío inicia una evaluación académica. No constituye una oferta comercial, contrato ni garantía de ejecución. El alcance, la confidencialidad y la propiedad intelectual se acuerdan antes de iniciar cualquier trabajo.</AvisoDemo>{servicios.length ? <div className={estilos.rejillaIdeas}>{servicios.map((servicio) => <Link href={'/prototipado/' + servicio.slug} className={estilos.idea} key={servicio.slug}>{servicio.portada && <div className={estilos.imagenIdea}><Image src={servicio.portada} alt={servicio.portadaAlt ?? ''} fill sizes="(max-width: 620px) 100vw, 33vw" /></div>}<div className={estilos.cuerpoIdea}><div className={estilos.meta}>{servicio.areas.map((area) => <span key={area}>{area}</span>)}</div><h2>{servicio.titulo}</h2><p>{servicio.resumen}</p><strong>Conocer alcance ↗</strong></div></Link>)}</div> : <EstadoVacio titulo="Capacidades por confirmar" descripcion="El semillero podrá publicar aquí las capacidades disponibles y sus responsables." />}<section id="proponer-reto" className={estilos.formularioCaja}><h2>Proponer un reto</h2><p>Describe el problema y el resultado que te interesa validar. Comparte solo la información necesaria; si requiere confidencialidad, indícalo antes de añadir detalles sensibles.</p><FormularioReto /></section></Seccion>
}
