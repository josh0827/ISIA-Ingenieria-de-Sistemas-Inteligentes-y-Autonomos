// SECCIÓN: Novedades (listado)
//
// Esta página está TERMINADA a propósito: sirve de modelo para las demás.
// Fíjate en lo poco que hace falta: pedir los datos a lib/contenido, envolver
// en <Seccion>, poner un <TituloSeccion> y recorrer la lista con la tarjeta
// que ya existe. Cero CSS propio.
//
// Para añadir una novedad NO se toca este archivo: se crea un .md nuevo en
// contenido/novedades/ y aparece sola.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Revelar from '@/componentes/Revelar'
import { TarjetaNovedad } from '@/componentes/Tarjetas'
import { listarNovedades } from '@/lib/contenido'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Novedades',
  description: 'Convocatorias, resultados y actividad del grupo de investigación ISIA.',
}

export default function PaginaNovedades() {
  const novedades = listarNovedades()

  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Novedades"
        titulo="Lo que pasa en el grupo"
        descripcion="Convocatorias, resultados, participaciones y avisos. Lo más reciente primero."
      />

      {novedades.length === 0 ? (
        <p className={estilos.vacio}>Todavía no hay novedades publicadas.</p>
      ) : (
        <div className={estilos.rejilla}>
          {novedades.map((novedad, i) => (
            <Revelar key={novedad.slug} retardo={i * 70}>
              <TarjetaNovedad novedad={novedad} />
            </Revelar>
          ))}
        </div>
      )}
    </Seccion>
  )
}
