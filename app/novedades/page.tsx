import type { Metadata } from 'next'
import {
  AvisoDemo,
  EncabezadoPagina,
  EstadoVacio,
  Seccion,
} from '@/componentes/Base'
import { FiltrosNovedades } from '@/componentes/FiltrosContenido'
import { listarNovedades } from '@/lib/contenido'
import estilos from '../listados.module.css'
export const metadata: Metadata = {
  title: 'Novedades',
  description:
    'Sección de novedades de la demo académica de ISIA. Notas ilustrativas, sin anuncios ni convocatorias vigentes.',
}
export const dynamic = 'force-dynamic'

export default async function PaginaNovedades() {
  const novedades = await listarNovedades()
  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Vida académica"
        titulo="Novedades"
        descripcion="Un espacio para compartir ideas, actividades y conocimiento del semillero."
      />
      <AvisoDemo>
        Las siguientes notas y sus fechas son ilustrativas. Se ordenan de la más
        reciente a la más antigua para mostrar el funcionamiento de esta
        sección.
      </AvisoDemo>
      {novedades.length ? (
        <FiltrosNovedades novedades={novedades} />
      ) : (
        <EstadoVacio
          titulo="Novedades por compartir"
          descripcion="Aquí podrás consultar las novedades confirmadas del semillero."
        />
      )}
    </Seccion>
  )
}
