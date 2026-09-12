// SECCIÓN: Agenda de reuniones          RESPONSABLE: por asignar
//
// QUÉ HAY QUE MONTAR
// La agenda completa: la próxima reunión destacada arriba y debajo dos listas,
// las que vienen y las que ya pasaron.
//
// LO QUE YA ESTÁ HECHO POR TI
//   - proximaReunion()    la siguiente reunión que no ha pasado
//   - listarReuniones()   todas, en orden cronológico
//   - reunionesPasadas()  solo las celebradas, de la más reciente a la más antigua
//   - <Etiqueta valor={reunion.modalidad} />  pinta presencial / virtual / híbrida
//   - <Fecha iso={reunion.fecha} />           formatea la fecha igual que el resto del sitio
//
// El bloque de "próxima reunión" de la portada (app/page.tsx) ya hace casi todo
// esto: puedes copiarlo de ahí.
//
// Para añadir reuniones no hace falta tocar código: se crean .md en
// contenido/reuniones/. Ya hay tres de ejemplo.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Pendiente from '@/componentes/Pendiente'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Reuniones',
  description: 'Calendario de sesiones del grupo de investigación ISIA.',
}

export default function PaginaReuniones() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Reuniones"
        titulo="Agenda del grupo"
        descripcion="Las sesiones son abiertas: si te interesa alguna, puedes asistir aunque todavía no seas integrante."
      />
      <Pendiente
        descripcion="Esta página debe mostrar la próxima reunión destacada y, debajo, las siguientes y el histórico de las pasadas."
        pasos={[
          'Destacar la próxima reunión con fecha, hora, lugar, modalidad y ponente.',
          'Listar debajo las reuniones futuras restantes en orden cronológico.',
          'Añadir al final el histórico de sesiones ya celebradas, plegado o en una lista más sobria.',
          'Si la reunión es virtual o híbrida y trae "enlace", mostrar el botón para conectarse.',
        ]}
        datos={'import { proximaReunion, listarReuniones, reunionesPasadas } from "@/lib/contenido"'}
      />
    </Seccion>
  )
}
