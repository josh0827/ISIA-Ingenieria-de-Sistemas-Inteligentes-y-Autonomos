import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import ListadoPracticas from '@/componentes/practicas/ListadoPracticas'
import { listarPracticasPublicas } from '@/lib/practicas'
import { seccionVisible } from '@/lib/configuracion'
import estilos from './practicas.module.css'

export const metadata: Metadata = { title: 'Prácticas e iniciativas', description: 'Ofertas de práctica publicadas por entidades autorizadas para estudiantes de ISIA.' }
export const revalidate = 300

export default async function PaginaPracticas() {
  if (!(await seccionVisible('practicas'))) notFound()
  const ofertas = await listarPracticasPublicas()
  return <Seccion className={estilos.primeraSeccion}>
    <EncabezadoPagina indice="Oportunidades" titulo="Prácticas e iniciativas" descripcion="Espacio para consultar oportunidades publicadas por organizaciones autorizadas. La disponibilidad y los procesos de postulación se confirman con cada entidad." />
    <ListadoPracticas ofertas={ofertas} />
  </Seccion>
}
