import type { Metadata } from 'next'
import { EncabezadoPagina, Seccion } from '@/componentes/Base'
import ListadoPracticas from '@/componentes/practicas/ListadoPracticas'
import { listarPracticasPublicas } from '@/lib/practicas'
import estilos from './practicas.module.css'

export const metadata: Metadata = { title: 'Prácticas e iniciativas', description: 'Ofertas de práctica publicadas por entidades autorizadas para estudiantes de ISIA.' }
export const dynamic = 'force-dynamic'

export default async function PaginaPracticas() {
  const ofertas = await listarPracticasPublicas()
  return <Seccion className={estilos.primeraSeccion}>
    <EncabezadoPagina indice="Oportunidades" titulo="Prácticas e iniciativas" descripcion="Espacio para consultar oportunidades publicadas por organizaciones autorizadas. La disponibilidad y los procesos de postulación se confirman con cada entidad." />
    <ListadoPracticas ofertas={ofertas} />
  </Seccion>
}
