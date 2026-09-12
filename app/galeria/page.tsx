// SECCIÓN: Galería del laboratorio      RESPONSABLE: por asignar
//
// QUÉ HAY QUE MONTAR
// Fotos de montajes, equipos y sesiones de trabajo. Es la sección que más
// credibilidad da y la que más depende de tener material real.
//
// ANTES DE EMPEZAR: HAZ LAS FOTOS
// Sin fotos propias esta página no tiene sentido. No usar imágenes de banco.
//
// CÓMO TRATAR LAS IMÁGENES
//   - van en public/imagenes/galeria/
//   - usar siempre next/image, nunca <img>, para que Next las optimice
//   - dar width y height reales, o la página saltará al cargar
//   - poner texto alternativo describiendo la foto, no "foto1"

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Pendiente from '@/componentes/Pendiente'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Montajes, equipos y sesiones de trabajo del laboratorio del grupo ISIA.',
}

export default function PaginaGaleria() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Galería"
        titulo="El laboratorio por dentro"
        descripcion="Montajes a medio armar, medidas que no salieron y las que sí."
      />
      <Pendiente
        descripcion="Esta página debe mostrar una rejilla de fotos reales del laboratorio, con pie de foto y ampliación al pulsar."
        pasos={[
          'Reunir las fotos y dejarlas en public/imagenes/galeria/.',
          'Montar una rejilla tipo mosaico con next/image y width y height reales.',
          'Escribir un pie para cada foto: qué se ve y de qué proyecto es.',
          'Añadir la ampliación al pulsar, cerrable con Escape y con foco atrapado dentro.',
        ]}
      />
    </Seccion>
  )
}
