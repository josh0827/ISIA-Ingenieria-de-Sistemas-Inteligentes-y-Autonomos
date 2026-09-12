// SECCIÓN: Integrantes                  RESPONSABLE: por asignar
//
// QUÉ HAY QUE MONTAR
// El equipo completo, agrupado por rol: dirección, investigadores, estudiantes
// y egresados. listarIntegrantes() ya los devuelve ordenados por rol.
//
// LO QUE YA ESTÁ HECHO POR TI
//   - listarIntegrantes()  todas las fichas de contenido/integrantes/
//   - <TarjetaIntegrante integrante={...} />  la tarjeta ya maquetada
//
// Para añadir a alguien se crea un .md en contenido/integrantes/ con su foto en
// public/imagenes/integrantes/. Ya hay ocho fichas de ejemplo.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Pendiente from '@/componentes/Pendiente'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Integrantes',
  description: 'Docentes, investigadores y estudiantes que forman el grupo ISIA.',
}

export default function PaginaIntegrantes() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Integrantes"
        titulo="El equipo"
        descripcion="Docentes y estudiantes de distintos semestres trabajando en el mismo laboratorio."
      />
      <Pendiente
        descripcion="Esta página debe mostrar a todo el equipo agrupado por rol, con la dirección destacada arriba."
        pasos={[
          'Separar la lista en cuatro grupos: dirección, investigadores, estudiantes y egresados.',
          'Destacar la ficha de dirección con más tamaño o en una fila propia.',
          'Recorrer cada grupo con <TarjetaIntegrante /> dentro de la rejilla de listados.module.css.',
          'Añadir el texto de cada persona (el cuerpo del .md) si se quiere una ficha individual.',
        ]}
        datos={'import { listarIntegrantes } from "@/lib/contenido"'}
      />
    </Seccion>
  )
}
