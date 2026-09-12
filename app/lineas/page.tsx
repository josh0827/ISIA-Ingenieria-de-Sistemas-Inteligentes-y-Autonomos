// SECCIÓN: Líneas de investigación      RESPONSABLE: por asignar
//
// QUÉ HAY QUE MONTAR
// El desarrollo largo de cada línea: qué problema aborda, qué se está haciendo
// y qué proyectos cuelgan de ella.
//
// LO QUE YA ESTÁ HECHO POR TI
//   - LINEAS (lib/sitio.ts)      las seis líneas con su icono y su resumen
//   - listarProyectos()          cada proyecto trae el campo "linea", así que se
//                                pueden agrupar los proyectos por línea
//   - componentes/Iconos.tsx     los seis iconos ya dibujados
//
// El bloque de líneas de la portada (app/page.tsx) es el resumen; esta página
// es la versión larga.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Pendiente from '@/componentes/Pendiente'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Líneas de investigación',
  description: 'Los frentes de trabajo del grupo ISIA y los proyectos que cuelgan de cada uno.',
}

export default function PaginaLineas() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Líneas"
        titulo="Líneas de investigación"
        descripcion="Seis frentes de trabajo que se cruzan constantemente entre sí."
      />
      <Pendiente
        descripcion="Esta página debe desarrollar cada línea: el problema que aborda, el enfoque del grupo y los proyectos asociados."
        pasos={[
          'Escribir dos o tres párrafos por línea explicando de qué va realmente.',
          'Agrupar los proyectos por su campo "linea" y mostrarlos bajo la línea que les toca.',
          'Añadir quién es el responsable de cada línea.',
          'Si una línea crece mucho, darle página propia en app/lineas/[slug]/.',
        ]}
        datos={'import { LINEAS } from "@/lib/sitio"\nimport { listarProyectos } from "@/lib/contenido"'}
      />
    </Seccion>
  )
}
