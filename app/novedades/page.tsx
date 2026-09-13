import type { Metadata } from 'next'
import {
  AvisoDemo,
  EncabezadoPagina,
  EstadoVacio,
  Seccion,
} from '@/componentes/Base'
import { TarjetaNovedad } from '@/componentes/Tarjetas'
import { listarNovedades } from '@/lib/contenido'
import estilos from '../listados.module.css'
export const metadata: Metadata = {
  title: 'Novedades',
  description:
    'Sección de novedades de la demo académica de ISIA. Notas ilustrativas, sin anuncios ni convocatorias vigentes.',
}
export default function PaginaNovedades() {
  const novedades = listarNovedades()
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
        <div className={estilos.rejilla}>
          {novedades.map((novedad) => (
            <TarjetaNovedad
              nivelTitulo={2}
              key={novedad.slug}
              novedad={novedad}
            />
          ))}
        </div>
      ) : (
        <EstadoVacio
          titulo="Novedades por compartir"
          descripcion="Aquí podrás consultar las novedades confirmadas del semillero."
        />
      )}
    </Seccion>
  )
}
