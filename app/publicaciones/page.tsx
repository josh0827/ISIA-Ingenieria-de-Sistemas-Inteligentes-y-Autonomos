// SECCIÓN: Publicaciones y recursos     RESPONSABLE: por asignar
//
// QUÉ HAY QUE MONTAR
// El listado de lo que el grupo ha publicado: artículos, pósters, informes,
// presentaciones y material descargable.
//
// DECISIÓN PENDIENTE ANTES DE EMPEZAR
// Hoy no hay lector de publicaciones en lib/contenido.ts porque falta decidir
// el formato. Dos opciones:
//   a) un único contenido/publicaciones/publicaciones.md escrito a mano
//   b) un .md por publicación, como novedades, con un listarPublicaciones()
//      nuevo en lib/contenido.ts copiado de listarNovedades()
// Si el grupo va a publicar seguido, la opción (b) envejece mucho mejor.
//
// Los PDF y archivos descargables van en public/recursos/.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Pendiente from '@/componentes/Pendiente'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Publicaciones',
  description: 'Artículos, pósters, informes y material publicado por el grupo ISIA.',
}

export default function PaginaPublicaciones() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Publicaciones"
        titulo="Lo que hemos publicado"
        descripcion="Artículos, pósters, informes y material abierto para que otros puedan partir de nuestro trabajo."
      />
      <Pendiente
        descripcion="Esta página debe listar las publicaciones del grupo ordenadas por año, con autores, medio y enlace o descarga."
        pasos={[
          'Decidir el formato: un solo .md a mano, o un .md por publicación con su propio lector.',
          'Si se elige un .md por publicación, copiar listarNovedades() en lib/contenido.ts y adaptarlo.',
          'Agrupar por año, del más reciente al más antiguo.',
          'Mostrar tipo (artículo, póster, informe), autores, medio y enlace al DOI o al PDF.',
          'Dejar los PDF en public/recursos/ y enlazarlos desde ahí.',
        ]}
      />
    </Seccion>
  )
}
