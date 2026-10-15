import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import ListadoPracticas from '@/componentes/practicas/ListadoPracticas'
import { listarOportunidadesPublicas } from '@/lib/practicas'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../networking.module.css'

export const metadata: Metadata = { title: 'Oportunidades', description: 'Prácticas, convocatorias y retos conectados con la comunidad ISIA.' }
export const revalidate = 300

export default async function PaginaOportunidades() {
  if (!(await seccionVisible('practicas'))) notFound()
  const oportunidades = await listarOportunidadesPublicas()
  const abiertas = oportunidades.filter((oferta) => oferta.estado === 'abierta')
  const historicas = oportunidades.filter((oferta) => oferta.estado === 'cerrada' || oferta.estado === 'archivada')
  return <Seccion className={estilos.primera}><EncabezadoPagina indice="Networking" titulo="Oportunidades" descripcion="Prácticas e iniciativas compartidas por organizaciones autorizadas. Cada ficha indica su vigencia y canal confirmado." /><h2 className={estilos.separadorTitulo}>Disponibles</h2><ListadoPracticas ofertas={abiertas} /><h2 className={estilos.separadorTitulo}>Histórico</h2><p>Las oportunidades cerradas permanecen como referencia de vínculos y temas. Ya no aceptan postulaciones desde este portal.</p><ListadoPracticas ofertas={historicas} historico /></Seccion>
}
