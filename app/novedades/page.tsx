import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  AvisoDemo,
  EncabezadoPagina,
  EstadoVacio,
  Seccion,
} from '@/componentes/Base'
import { FiltrosNovedades } from '@/componentes/FiltrosContenido'
import { listarNovedades } from '@/lib/contenido'
import { seccionVisible } from '@/lib/configuracion'
import estilos from '../listados.module.css'
export const metadata: Metadata = {
  title: 'Novedades',
  description:
    'Novedades del semillero ISIA: convocatorias, eventos, logros y divulgación.',
}
export const revalidate = 300

export default async function PaginaNovedades() {
  if (!(await seccionVisible('novedades'))) notFound()
  const novedades = await listarNovedades()
  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Vida académica"
        titulo="Novedades"
        descripcion="Un espacio para compartir ideas, actividades y conocimiento del semillero."
      />
      {novedades.some((novedad) => novedad.ilustrativo) && <AvisoDemo>
        Las siguientes notas y sus fechas son ilustrativas. Se ordenan de la más
        reciente a la más antigua para mostrar el funcionamiento de esta
        sección.
      </AvisoDemo>}
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
